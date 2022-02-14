export function getDataURLFromImageBuffer(buffer: Buffer): string {
  const base64 = buffer.toString("base64");
  const mimeType = findMimeTypeOfBase64Image(base64);
  const dataURL = getDataURLFromMimeType(mimeType, base64);

  return dataURL;
}

function findMimeTypeOfBase64Image(base64: string) {
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("PHN2")) return "image/svg+xml";
  if (base64.startsWith("/9j/")) return "image/jpeg";

  return "image/*";
}

function getDataURLFromMimeType(mimeType: string, base64: string): string {
  const dataURLPrefix = `data:${mimeType};base64,`;
  return dataURLPrefix + base64;
}
