import path from "path";

import { renderHTML } from "@shared/infra/queue/utils";
import { fileToBase64DataURL } from "@shared/presentation/templates/utils";

const logoImgSrc = fileToBase64DataURL(
  path.resolve(__dirname, "assets", "logo.png")
);

export function renderBaseTemplate<T>(
  viewPath: string,
  viewModel: Omit<T, "iconImgSrc" | "logoImgSrc">,
  iconPath: string
): string {
  const iconImgSrc = fileToBase64DataURL(iconPath);

  const html = renderHTML(viewPath, {
    ...viewModel,
    iconImgSrc,
    logoImgSrc,
  });

  if (!html) throw new Error("Error trying to parse template");

  return html;
}
