import { SendMailOptions } from "nodemailer";
import inlineBase64 from "nodemailer-plugin-inline-base64";

import { transporter } from "@shared/infra/nodemailer";

export type EmailJobHandlerPayload = {
  email: string;
  html: string;
  subject: string;
};

export function emailJobHandler({
  email,
  html,
  subject,
}: EmailJobHandlerPayload): void {
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
