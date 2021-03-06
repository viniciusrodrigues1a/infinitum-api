import path from "path";

import { renderBaseTemplate } from "@shared/presentation/templates/_baseTemplate";
import { InvitationViewModel } from "./views/invitationViewModel";

type InvitationTemplateParseRequest = {
  invitationText: string;
  acceptInvitationButtonText: string;
  declineInvitationButtonText: string;
  projectId: string;
  token: string;
};

export class InvitationTemplate {
  parseTemplate({
    invitationText,
    acceptInvitationButtonText,
    declineInvitationButtonText,
    projectId,
    token,
  }: InvitationTemplateParseRequest): string {
    const viewPath = path.resolve(__dirname, "views", "invitationView.ejs");
    const viewModel = {
      invitationText,
      acceptInvitationButtonText,
      declineInvitationButtonText,
      projectId,
      token,
    };
    const iconPath = path.resolve(__dirname, "assets", "invitationIcon.png");

    const html = renderBaseTemplate<InvitationViewModel>(
      viewPath,
      viewModel,
      iconPath
    );

    return html;
  }
}
