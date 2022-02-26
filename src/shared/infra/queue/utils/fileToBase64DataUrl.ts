import fs from "fs";

export const fileToBase64DataUrl = (filePath: string): string => {
  const bitmap = fs.readFileSync(filePath);
  const base64 = bitmap.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

  return dataUrl;
};
