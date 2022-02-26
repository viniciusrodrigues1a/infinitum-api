import fs from "fs";

export const fileToBase64DataURL = (filePath: string): string => {
  const bitmap = fs.readFileSync(filePath);
  const base64 = bitmap.toString("base64");
  const dataURL = `data:image/png;base64,${base64}`;

  return dataURL;
};
