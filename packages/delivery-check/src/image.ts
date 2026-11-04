import { inflateSync } from "node:zlib";
import { detectMediaType, type MediaType } from "@pactpal/ledger";

/**
 * Whether a file's background is transparent, read from its pixels:
 * - `transparent`: some pixels are fully transparent; `corners` (0 to 4) says how many corners are.
 * - `opaque`: no pixel is transparent (or the file has no transparency at all).
 * - `impossible`: the format cannot be transparent (JPEG, PDF).
 * - `not-checked`: it could be, but this file was not read for it (GIF, an unusual PNG).
 */
export type Transparency =
  | { kind: "transparent"; corners: number; share: number }
  | { kind: "opaque" }
  | { kind: "impossible" }
  | { kind: "not-checked" };

/** What code can tell about a delivered file. */
export interface ImageFacts {
  /** From the bytes, never the name; `other` for anything else. */
  mediaType: MediaType | "other";
  sizeBytes: number;
  /** In pixels, for PNG, JPEG and GIF files that could be read. */
  width?: number;
  height?: number;
  transparency: Transparency;
}

/** Larger images are not decoded for transparency (40 million pixels, about 160 MB unpacked). */
const MAX_PIXELS = 40_000_000;

/** The byte at `i`, or 0 past the end (a cut-off file reads as zeros, never as an error). */
const byte = (b: Uint8Array, i: number): number => b[i] ?? 0;

const u32 = (b: Uint8Array, at: number) =>
  ((byte(b, at) << 24) | (byte(b, at + 1) << 16) | (byte(b, at + 2) << 8) | byte(b, at + 3)) >>> 0;
const u16 = (b: Uint8Array, at: number) => (byte(b, at) << 8) | byte(b, at + 1);
const ascii = (b: Uint8Array, at: number, length: number) =>
  String.fromCharCode(...b.subarray(at, at + length));

interface PngHeader {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  interlace: number;
}

/** The PNG's chunks that matter here; undefined when the file is cut short or has no header. */
function pngChunks(bytes: Uint8Array) {
  let header: PngHeader | undefined;
  let trns: Uint8Array | undefined;
  const data: Uint8Array[] = [];
  for (let at = 8; at + 8 <= bytes.length;) {
    const length = u32(bytes, at);
    const type = ascii(bytes, at + 4, 4);
    const body = bytes.subarray(at + 8, at + 8 + length);
    if (body.length < length) return undefined;
    if (type === "IHDR" && length >= 13) {
      header = {
        width: u32(body, 0),
        height: u32(body, 4),
        bitDepth: byte(body, 8),
        colorType: byte(body, 9),
        interlace: byte(body, 12),
      };
    } else if (type === "tRNS") trns = body;
    else if (type === "IDAT") data.push(body);
    else if (type === "IEND") break;
    at += 12 + length;
  }
  return header && { header, trns, data };
}

/** Undoes PNG row filters in place; `bpp` is bytes per pixel. */
function unfilter(raw: Uint8Array, width: number, height: number, bpp: number): Uint8Array {
  const stride = width * bpp;
  const out = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x;
      const left = x >= bpp ? byte(out, i - bpp) : 0;
      const up = y > 0 ? byte(out, i - stride) : 0;
      const upLeft = x >= bpp && y > 0 ? byte(out, i - stride - bpp) : 0;
      const value = byte(row, x);
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const [pa, pb, pc] = [Math.abs(p - left), Math.abs(p - up), Math.abs(p - upLeft)];
        predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      }
      out[i] = (value + predictor) & 0xff;
    }
  }
  return out;
}

/** Bytes per pixel and where alpha is, for the 8-bit PNG kinds that can carry it. */
const ALPHA_LAYOUT: Record<number, { bpp: number; alpha?: number } | undefined> = {
  6: { bpp: 4, alpha: 3 }, // RGBA
  4: { bpp: 2, alpha: 1 }, // grey and alpha
  3: { bpp: 1 }, // palette: alpha from tRNS
};

function pngTransparency(png: NonNullable<ReturnType<typeof pngChunks>>): Transparency {
  const { header, trns, data } = png;
  const { width, height, colorType } = header;
  const hasAlpha = colorType === 4 || colorType === 6 || trns !== undefined;
  if (!hasAlpha) return { kind: "opaque" };
  const layout = ALPHA_LAYOUT[colorType];
  if (!layout || header.bitDepth !== 8 || header.interlace !== 0 || width * height > MAX_PIXELS) {
    return { kind: "not-checked" };
  }
  let raw: Uint8Array;
  try {
    raw = inflateSync(Buffer.concat(data), { maxOutputLength: (width * layout.bpp + 1) * height });
  } catch {
    return { kind: "not-checked" };
  }
  if (raw.length < (width * layout.bpp + 1) * height) {
    return { kind: "not-checked" };
  }
  const pixels = unfilter(raw, width, height, layout.bpp);
  const alphaAt = (n: number) =>
    layout.alpha === undefined
      ? (trns?.[byte(pixels, n)] ?? 255)
      : byte(pixels, n * layout.bpp + layout.alpha);
  let clear = 0;
  for (let n = 0; n < width * height; n++) if (alphaAt(n) === 0) clear += 1;
  if (clear === 0) return { kind: "opaque" };
  const corners = [0, width - 1, (height - 1) * width, height * width - 1].filter(
    (n) => alphaAt(n) === 0,
  ).length;
  return { kind: "transparent", corners, share: clear / (width * height) };
}

/** A JPEG's size from its frame header, or undefined if none is found. */
function jpegSize(bytes: Uint8Array): { width: number; height: number } | undefined {
  for (let at = 2; at + 9 < bytes.length;) {
    if (bytes[at] !== 0xff) return undefined;
    const marker = byte(bytes, at + 1);
    const length = u16(bytes, at + 2);
    // Start-of-frame markers C0 to CF, except C4 (tables), C8 (reserved) and CC (arithmetic).
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: u16(bytes, at + 5), width: u16(bytes, at + 7) };
    }
    at += 2 + length;
  }
  return undefined;
}

/** What code can tell about a delivered file from its bytes. Pure; never trusts the name. */
export function imageFacts(bytes: Uint8Array): ImageFacts {
  const mediaType: ImageFacts["mediaType"] = detectMediaType(bytes) ?? "other";
  const base = { mediaType, sizeBytes: bytes.length };
  switch (mediaType) {
    case "image/png": {
      const png = pngChunks(bytes);
      if (!png) return { ...base, transparency: { kind: "not-checked" } };
      const { width, height } = png.header;
      return { ...base, width, height, transparency: pngTransparency(png) };
    }
    case "image/jpeg":
      return { ...base, ...jpegSize(bytes), transparency: { kind: "impossible" } };
    case "image/gif": {
      const size =
        bytes.length >= 10
          ? {
              width: byte(bytes, 6) | (byte(bytes, 7) << 8),
              height: byte(bytes, 8) | (byte(bytes, 9) << 8),
            }
          : {};
      return { ...base, ...size, transparency: { kind: "not-checked" } };
    }
    case "application/pdf":
      return { ...base, transparency: { kind: "impossible" } };
    case "other":
      return { ...base, transparency: { kind: "not-checked" } };
  }
}
