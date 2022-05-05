import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { KickedAdminViewModel } from "./views/kickedAdminViewModel";

type RoleUpdatedAdminTemplateParseRequest = {
  roleUpdatedAdminText: string;
  linkToProjectButtonText: string;
  projectId: string;
};

export class RoleUpdatedAdminTemplate {
  parseTemplate({
    roleUpdatedAdminText,
    projectId,
    linkToProjectButtonText,
  }: RoleUpdatedAdminTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "kickedAdminView.ejs");
    const viewModel = {
      kickedAdminText: roleUpdatedAdminText,
      projectId,
      linkToProjectButtonText,
    };
    const iconPath = path.resolve(__dirname, "assets", "roleUpdatedIcon.png");

    const html = renderBaseTemplate<KickedAdminViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
