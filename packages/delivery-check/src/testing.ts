import { crc32, deflateSync } from "node:zlib";

// Test code only: small image files built in code, so tests need no binary fixtures.

/** A PNG chunk: length, type, body and CRC. */
function chunk(type: string, body: Uint8Array): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), body])), 0);
  return Buffer.concat([head, body, crc]);
}

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Applies one PNG row filter (0 to 4) to raw rows, as an encoder would. */
function filterRows(raw: Uint8Array, width: number, height: number, bpp: number, filter: number) {
  const stride = width * bpp;
  const out = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    out[y * (stride + 1)] = filter;
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x;
      const left = x >= bpp ? (raw[i - bpp] ?? 0) : 0;
      const up = y > 0 ? (raw[i - stride] ?? 0) : 0;
      const upLeft = x >= bpp && y > 0 ? (raw[i - stride - bpp] ?? 0) : 0;
      const p = left + up - upLeft;
      const paeth =
        Math.abs(p - left) <= Math.abs(p - up) && Math.abs(p - left) <= Math.abs(p - upLeft)
          ? left
          : Math.abs(p - up) <= Math.abs(p - upLeft)
            ? up
            : upLeft;
      const predictor = [0, left, up, (left + up) >> 1, paeth][filter] ?? 0;
      out[y * (stride + 1) + 1 + x] = ((raw[i] ?? 0) - predictor) & 0xff;
    }
  }
  return out;
}

export interface PngOptions {
  width: number;
  height: number;
  colorType?: number;
  bitDepth?: number;
  interlace?: number;
  /** The bytes of the pixel at (x, y). */
  pixel?: (x: number, y: number) => number[];
  filter?: number;
  trns?: number[];
  palette?: number[];
  /** Replaces the compressed pixel data. */
  idat?: Uint8Array;
}

const BPP: Record<number, number> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

export function png(options: PngOptions): Uint8Array {
  const { width, height, colorType = 6, bitDepth = 8, interlace = 0, filter = 0 } = options;
  const pixel = options.pixel ?? (() => [0, 0, 0, 255]);
  const bpp = BPP[colorType] ?? 4;
  const raw = new Uint8Array(options.idat ? 0 : width * height * bpp);
  for (let y = 0; y < height && !options.idat; y++) {
    for (let x = 0; x < width; x++) raw.set(pixel(x, y).slice(0, bpp), (y * width + x) * bpp);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = bitDepth;
  ihdr[9] = colorType;
  ihdr[12] = interlace;
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    ...(options.palette ? [chunk("PLTE", Buffer.from(options.palette))] : []),
    ...(options.trns ? [chunk("tRNS", Buffer.from(options.trns))] : []),
    chunk("IDAT", options.idat ?? deflateSync(filterRows(raw, width, height, bpp, filter))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** A figure in the middle of a clear background: the corners and edges are transparent. */
export const figure = (width: number, height: number) => (x: number, y: number) => {
  const inside = x > width / 4 && x < (3 * width) / 4 && y > height / 4 && y < (3 * height) / 4;
  return inside ? [200, 30, 30, 255] : [0, 0, 0, 0];
};

/** The first bytes of a JPEG with a frame header of the given size. */
export function jpeg(width: number, height: number, withFrame = true): Uint8Array {
  const app0 = [0xff, 0xe0, 0x00, 0x04, 0x00, 0x00];
  const sof = [0xff, 0xc0, 0x00, 0x0b, 0x08, height >> 8, height & 0xff, width >> 8, width & 0xff];
  return Uint8Array.from([0xff, 0xd8, ...app0, ...(withFrame ? sof : []), 0, 0, 0, 0, 0, 0]);
}
