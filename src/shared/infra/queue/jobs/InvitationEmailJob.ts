import path from "path";
import ejs from "ejs";
import { SendInvitationToProjectEmailServiceDTO } from "@modules/project/use-cases/DTOs";
import { transporter } from "@shared/infra/nodemailer";
import { SendMailOptions } from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import { IJob } from "./IJob";
import { fileToBase64DataUrl } from "./utils";

class InvitationEmailJob implements IJob {
  public key = "InvitationEmailJob";

  async handle({
    projectName,
    email,
    token,
  }: SendInvitationToProjectEmailServiceDTO): Promise<void> {
    const emailTemplatesDir = path.resolve(
      __dirname,
      "..",
      "..",
      "emailTemplates"
    );

    const invitationImgSrc = fileToBase64DataUrl(
      path.resolve(emailTemplatesDir, "assets", "invitationIcon.png")
    );
    const logoImgSrc = fileToBase64DataUrl(
      path.resolve(emailTemplatesDir, "assets", "logo.png")
    );

    const mailOptions: SendMailOptions = {
      from: process.env.NODEMAILER_GMAIL_FROM,
      to: email,
      subject: "Infinitum - Convite para participar de projeto",
    };

    const renderedHtml = InvitationEmailJob.renderHtml(
      path.resolve(emailTemplatesDir, "invitation.ejs"),
      { projectName, token, invitationImgSrc, logoImgSrc }
    );

    if (renderedHtml) {
      mailOptions.html = renderedHtml;
    } else {
      mailOptions.text = `Você foi convidado a participar do projeto ${projectName}. Clique aqui para aceitar o convite: http://localhost:3000/invitation?token=${token}`;
    }

    transporter.use("compile", inlineBase64());
    transporter.sendMail(mailOptions, (err, _res) => {
      if (err) console.log("Nodemailer error ", err.message);
    });
  }

  private static renderHtml(filePath: string, data: any): string | undefined {
    let html;

    ejs.renderFile(filePath, data, (err, res) => {
      if (!err) html = res;
    });

    return html;
  }
}

export default new InvitationEmailJob();
