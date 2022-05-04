import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { ProjectDeletedViewModel } from "./views/projectDeletedViewModel";

export class ProjectDeletedTemplate {
  parseTemplate(viewModel: ProjectDeletedViewModel): string {
    const viewPath = path.resolve(__dirname, "views", "projectDeletedView.ejs");
    const iconPath = path.resolve(__dirname, "assets", "invitationIcon.png");

    const html = renderBaseTemplate<ProjectDeletedViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
