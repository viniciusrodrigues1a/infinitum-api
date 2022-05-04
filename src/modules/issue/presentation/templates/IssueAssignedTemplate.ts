import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { IssueAssignedViewModel } from "./views/issueAssignedViewModel";

export class IssueAssignedTemplate {
  parseTemplate(viewModel: IssueAssignedViewModel): string {
    const viewPath = path.resolve(__dirname, "views", "issueAssignedView.ejs");
    const iconPath = path.resolve(__dirname, "assets", "invitationIcon.png");

    const html = renderBaseTemplate<IssueAssignedViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
