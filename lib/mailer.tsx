import { BrevoClient } from "@getbrevo/brevo";
import { render } from "@react-email/render";

import AccountDeletedEmail from "@/emails/AccountDeletedEmail";
import PasswordChangedEmail from "@/emails/PasswordChangedEmail";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import WelcomeEmail from "@/emails/WelcomeEmail";

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

const sender = {
  email: process.env.BREVO_SENDER_EMAIL!,
  name: process.env.BREVO_SENDER_NAME ?? "Ludaria",
};

async function send(to: string, subject: string, react: React.ReactElement) {
  const htmlContent = await render(react);
  await brevo.transactionalEmails.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject,
    htmlContent,
  });
}

export async function sendWelcomeEmail(to: string, pseudo: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await send(to, "Welcome to Ludaria 🎮", WelcomeEmail({ pseudo, appUrl }));
}

export async function sendResetPasswordEmail(
  to: string,
  pseudo: string,
  token: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  await send(
    to,
    "Reset your Ludaria password 🔑",
    ResetPasswordEmail({ pseudo, resetUrl }),
  );
}

export async function sendPasswordChangedEmail(to: string, pseudo: string) {
  await send(
    to,
    "Your password has been changed 🔒",
    PasswordChangedEmail({ pseudo }),
  );
}

export async function sendAccountDeletedEmail(to: string, pseudo: string) {
  await send(
    to,
    "Your Ludaria account has been deleted 👋",
    AccountDeletedEmail({ pseudo }),
  );
}
