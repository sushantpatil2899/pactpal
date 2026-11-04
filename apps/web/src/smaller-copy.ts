/** The longest side of the copy a model looks at; the stored file is never changed. */
const LONGEST_SIDE = 1568;

/** The base64 part of a blob, read in the browser. */
const base64Of = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result.replace(/^data:[^,]*,/, "") : "");
    };
    reader.onerror = () => {
      reject(new Error("Could not read the image"));
    };
    reader.readAsDataURL(blob);
  });

/**
 * A smaller JPEG copy of an image for the automatic look (on white, at most 1,568 px on its
 * longest side), made in the browser; undefined for anything that is not an image the browser
 * can draw. Code checks always read the real uploaded file.
 */
export async function smallerCopy(
  file: File,
): Promise<{ mediaType: "image/jpeg"; base64: string } | undefined> {
  if (!file.type.startsWith("image/")) return undefined;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, LONGEST_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.85);
    });
    return blob ? { mediaType: "image/jpeg", base64: await base64Of(blob) } : undefined;
  } catch {
    return undefined;
  }
}
