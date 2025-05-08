"use server";

import nodemailer from "nodemailer";

export const sendVerificationMail = async (to: string, code: number) => {
  try {
    const subject = "Verifica tu Correo";
    const text = `Tu codigo de verificación es: ${code}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    });
  } catch (e) {
    console.error(e);
  }
};
