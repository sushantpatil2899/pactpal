import { detectMediaType, isWebp } from "@pactpal/ledger";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MAX_PHOTO_SIDE, toJpeg } from "./photo-convert.js";

const picture = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 4, background: "#3a6" } });

describe("listing photos as JPEG (8h)", () => {
  it("turns a WebP into a JPEG PayPal accepts", async () => {
    const webp = new Uint8Array(await picture(40, 20).webp().toBuffer());
    expect(isWebp(webp)).toBe(true);
    const jpeg = await toJpeg(webp);
    if (!jpeg) throw new Error("expected a JPEG");
    expect(detectMediaType(jpeg)).toBe("image/jpeg");
    expect(await sharp(jpeg).metadata()).toMatchObject({ width: 40, height: 20 });
  });

  it("shrinks a large picture to the longest side allowed, keeping its shape", async () => {
    const png = new Uint8Array(await picture(3200, 1600).png().toBuffer());
    const jpeg = await toJpeg(png);
    if (!jpeg) throw new Error("expected a JPEG");
    expect(await sharp(jpeg).metadata()).toMatchObject({ width: MAX_PHOTO_SIDE, height: 800 });
  });

  it("gives nothing for bytes that are not a picture", async () => {
    expect(await toJpeg(new TextEncoder().encode("<html>not a picture</html>"))).toBeUndefined();
    expect(await toJpeg(new Uint8Array())).toBeUndefined();
  });
});
