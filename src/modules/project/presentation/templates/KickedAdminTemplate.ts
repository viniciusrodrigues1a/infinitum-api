import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { KickedAdminViewModel } from "./views/kickedAdminViewModel";

type KickedAdminTemplateParseRequest = {
  kickedAdminText: string;
  linkToProjectButtonText: string;
  projectId: string;
};

export class KickedAdminTemplate {
  parseTemplate({
    kickedAdminText,
    projectId,
    linkToProjectButtonText,
  }: KickedAdminTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "kickedAdminView.ejs");
    const viewModel = { kickedAdminText, projectId, linkToProjectButtonText };
    const iconPath = path.resolve(__dirname, "assets", "kickedIcon.png");

    const html = renderBaseTemplate<KickedAdminViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
