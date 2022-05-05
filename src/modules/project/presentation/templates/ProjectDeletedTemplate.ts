import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { ProjectDeletedViewModel } from "./views/projectDeletedViewModel";

type ProjectDeletedTemplateParseRequest = {
  projectDeletedText: string;
};

export class ProjectDeletedTemplate {
  parseTemplate({
    projectDeletedText,
  }: ProjectDeletedTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "projectDeletedView.ejs");
    const viewModel = { projectDeletedText };
    const iconPath = path.resolve(__dirname, "assets", "invitationIcon.png");

    const html = renderBaseTemplate<ProjectDeletedViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
