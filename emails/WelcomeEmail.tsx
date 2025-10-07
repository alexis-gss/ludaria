import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  pseudo: string;
  appUrl: string;
}

export default function WelcomeEmail({ pseudo, appUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Ludaria, {pseudo}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎮 Welcome to Ludaria!</Heading>
          <Text style={text}>
            Hi <strong>{pseudo}</strong>,
          </Text>
          <Text style={text}>
            Your account has been created. You can now play all our puzzle games
            and track your progress.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${appUrl}/dashboard`}>
              Start playing →
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't create this account, you can ignore this email.
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
const btnContainer = { textAlign: "center" as const, margin: "24px 0" };
const button = {
  background: "linear-gradient(135deg, #ec4899, #8b5cf6, #6366f1)",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "15px",
  textDecoration: "none",
};
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
