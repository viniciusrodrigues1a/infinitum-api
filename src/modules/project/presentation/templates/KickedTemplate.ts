import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { KickedViewModel } from "./views/kickedViewModel";

type KickedTemplateParseRequest = {
  kickedText: string;
};

export class KickedTemplate {
  parseTemplate({ kickedText }: KickedTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "kickedView.ejs");
    const viewModel = { kickedText };
    const iconPath = path.resolve(__dirname, "assets", "kickedIcon.png");

    const html = renderBaseTemplate<KickedViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
