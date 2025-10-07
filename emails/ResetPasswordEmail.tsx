import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  pseudo: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  pseudo,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Ludaria password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔑 Password Reset</Heading>
          <Text style={text}>
            Hi <strong>{pseudo}</strong>,
          </Text>
          <Text style={text}>
            We received a request to reset your password. Click the button below
            — this link is valid for <strong>10 minutes</strong>.
          </Text>
          <Button style={button} href={resetUrl}>
            Reset my password →
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't request this, you can safely ignore this email. Your
            password won't change.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "8px",
  maxWidth: "480px",
};
const h1 = { fontSize: "24px", color: "#1a1a1a" };
const text = { fontSize: "15px", color: "#444", lineHeight: "1.6" };
const button = {
  display: "block",
  background: "linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "15px",
  textDecoration: "none",
  margin: "24px auto",
  textAlign: "center" as const,
  maxWidth: "240px",
};
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
