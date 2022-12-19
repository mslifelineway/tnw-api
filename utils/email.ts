import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SendEmailOptions } from "../types/shared";

export const sendEmail = async (options: SendEmailOptions) => {
  const { mailTo, subject, message } = options;

  const host: string = process.env.EMAIL_HOST || "";
  const port: number = Number(process.env.EMAIL_PORT);
  const username = process.env.EMAIL_USERNAME || "";
  const password = process.env.EMAIL_PASSWORD || "";

  const SMTPTransportOptions: SMTPTransport.Options = {
    host: host,
    port: port,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  };

  const transporter = nodemailer.createTransport(SMTPTransportOptions);

  const mailOptions = {
    from: `${process.env.COMPANY_NAME} <${process.env.COMPANY_EMAIL}>`,
    to: mailTo,
    subject,
    text: message,
    //html:
  };

  await transporter.sendMail(mailOptions);
};
