import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { RoleUpdatedViewModel } from "./views/roleUpdatedViewModel";

type RoleUpdatedTemplateParseRequest = {
  roleUpdatedText: string;
};

export class RoleUpdatedTemplate {
  parseTemplate({ roleUpdatedText }: RoleUpdatedTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "roleUpdatedView.ejs");
    const viewModel = { roleUpdatedText };
    const iconPath = path.resolve(__dirname, "assets", "invitationIcon.png");

    const html = renderBaseTemplate<RoleUpdatedViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
