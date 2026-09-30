import nodemailer from "nodemailer";

const getTransporter = () => {
  if (!process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async (to, name, otp) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n==========================================`);
    console.log(`[DEV OTP EMAIL] To: ${to} (${name}) | OTP: ${otp}`);
    console.log(`==========================================\n`);
    return true;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, sans-serif; background-color: #FAF6F1; color: #1C1917; margin: 0; padding: 40px 20px; }
        .container { max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 32px; border: 1px solid rgba(28,25,23,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .logo { font-size: 24px; font-weight: 700; color: #E2622B; margin-bottom: 24px; text-align: center; }
        .title { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
        .text { font-size: 14px; color: #78716C; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #FDEADD; color: #B8431A; font-size: 32px; font-weight: 700; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 16px; margin-bottom: 24px; }
        .footer { font-size: 12px; color: #78716C; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">ForgeCV</div>
        <div class="title">Verify your email address</div>
        <div class="text">Hi ${name}, welcome to ForgeCV! Use the following 6-digit verification code to complete your registration. This code expires in 10 minutes.</div>
        <div class="otp-box">${otp}</div>
        <div class="text">If you didn't create a ForgeCV account, you can safely ignore this email.</div>
        <div class="footer">&copy; ${new Date().getFullYear()} ForgeCV. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "ForgeCV <no-reply@forgecv.app>",
    to,
    subject: `${otp} is your ForgeCV verification code`,
    html,
  });

  return true;
};
