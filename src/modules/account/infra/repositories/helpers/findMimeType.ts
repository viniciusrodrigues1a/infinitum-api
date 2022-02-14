export function findMimeType(base64: string) {
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("PHN2")) return "image/svg+xml";
  if (base64.startsWith("/9j/")) return "image/jpeg";

  return "image/*";
}
