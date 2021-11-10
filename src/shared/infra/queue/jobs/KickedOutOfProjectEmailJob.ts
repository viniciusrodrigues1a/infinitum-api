import { SendKickedOutOfProjectEmailServiceDTO } from "@modules/project/use-cases/DTOs";
import { transporter } from "@shared/infra/nodemailer";
import { SendMailOptions } from "nodemailer";
import path from "path";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import { IJob } from "./IJob";
import { fileToBase64DataUrl, renderHtml } from "./utils";

class KickedOutOfProjectEmailJob implements IJob {
  public key = "KickedOutOfProjectEmailJob";

  async handle({
    email,
    projectName,
  }: SendKickedOutOfProjectEmailServiceDTO): Promise<void> {
    const emailTemplatesDir = path.resolve(
      __dirname,
      "..",
      "..",
      "emailTemplates"
    );

    const kickedImgSrc = fileToBase64DataUrl(
      path.resolve(emailTemplatesDir, "assets", "kickedIcon.png")
    );
    const logoImgSrc = fileToBase64DataUrl(
      path.resolve(emailTemplatesDir, "assets", "logo.png")
    );

    const mailOptions: SendMailOptions = {
      from: process.env.NODEMAILER_GMAIL_FROM,
      to: email,
      subject: "Infinitum - Convite para participar de projeto",
    };

    const renderedHtml = renderHtml(
      path.resolve(emailTemplatesDir, "kicked.ejs"),
      { projectName, logoImgSrc, iconImgSrc: kickedImgSrc }
    );

    if (renderedHtml) {
      mailOptions.html = renderedHtml;
    } else {
      mailOptions.text = `Você foi removido do do projeto: ${projectName}. E portanto não pode mais acessá-lo na plataforma.`;
    }

    transporter.use("compile", inlineBase64());
    transporter.sendMail(mailOptions, (err, _res) => {
      if (err) console.log("Nodemailer error ", err.message);
    });
  }
}

export default new KickedOutOfProjectEmailJob();
