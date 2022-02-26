import path from "path";

import { renderHTML } from "@shared/infra/queue/utils";
import { fileToBase64DataURL } from "@shared/presentation/templates/utils";

type KickedTemplateParseRequest = {
  kickedText: string;
};

export class KickedTemplate {
  parseTemplate({ kickedText }: KickedTemplateParseRequest): string {
    const iconImgSrc = fileToBase64DataURL(
      path.resolve(__dirname, "assets", "invitationIcon.png")
    );
    const logoImgSrc = fileToBase64DataURL(
      path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "shared",
        "presentation",
        "templates",
        "assets",
        "logo.png"
      )
    );

    const html = renderHTML(path.resolve(__dirname, "views", "kicked.ejs"), {
      kickedText,
      iconImgSrc,
      logoImgSrc,
    });

    if (!html) throw new Error("Error trying to parse template");

    return html;
  }
}
