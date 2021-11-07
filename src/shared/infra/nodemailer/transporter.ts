import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_GMAIL_USER,
    pass: process.env.NODEMAILER_GMAIL_PASS,
  },
});
