"use server";

import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    });
  } catch (e) {
    console.error(e);
  }
};
