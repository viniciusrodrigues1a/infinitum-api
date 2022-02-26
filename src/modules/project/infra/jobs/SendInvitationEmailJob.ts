import { SendMailOptions } from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";

import { transporter } from "@shared/infra/nodemailer";
import { IJob } from "@shared/infra/queue/interfaces";

type Payload = {
  email: string;
  html: string;
  subject: string;
};

export class SendInvitationEmailJob implements IJob {
  public key = "InvitationEmailJob";

  async handle({ email, html, subject }: Payload): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: process.env.NODEMAILER_GMAIL_FROM,
      to: email,
      subject,
      html,
    };

    transporter.use("compile", inlineBase64());
    transporter.sendMail(mailOptions, (err, _res) => {
      if (err) console.error("Nodemailer error ", err.message);
    });
  }
}
