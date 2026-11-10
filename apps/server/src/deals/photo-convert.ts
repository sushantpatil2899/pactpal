import { detectMediaType } from "@pactpal/ledger";
import sharp from "sharp";

/** The longest side a converted photo keeps, in pixels. */
export const MAX_PHOTO_SIDE = 1600;

/**
 * A picture as a JPEG PayPal accepts as evidence (8h): WebP (as Channel3 serves listing photos),
 * PNG, JPEG or GIF in; JPEG out at quality 85, no wider or taller than `MAX_PHOTO_SIDE`, with its
 * metadata (EXIF, location) left out. Undefined when the bytes are not a picture.
 */
export async function toJpeg(bytes: Uint8Array): Promise<Uint8Array | undefined> {
  try {
    const out = await sharp(bytes, { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({
        width: MAX_PHOTO_SIDE,
        height: MAX_PHOTO_SIDE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85 })
      .toBuffer();
    const jpeg = new Uint8Array(out);
    return detectMediaType(jpeg) === "image/jpeg" ? jpeg : undefined;
  } catch {
    return undefined;
  }
}
