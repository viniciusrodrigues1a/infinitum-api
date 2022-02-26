import { renderHTML } from "@shared/infra/queue/utils";
import { fileToBase64DataURL } from "@shared/presentation/templates/utils";
import path from "path";

type InvitationTemplateParseRequest = {
  invitationText: string;
  acceptInvitationButtonText: string;
  declineInvitationButtonText: string;
  token: string;
};

export class InvitationTemplate {
  parseTemplate({
    invitationText,
    acceptInvitationButtonText,
    declineInvitationButtonText,
    token,
  }: InvitationTemplateParseRequest): string {
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

    const html = renderHTML(
      path.resolve(__dirname, "views", "invitation.ejs"),
      {
        invitationText,
        acceptInvitationButtonText,
        declineInvitationButtonText,
        token,
        iconImgSrc,
        logoImgSrc,
      }
    );

    if (!html) throw new Error("Error trying to parse template");

    return html;
  }
}
