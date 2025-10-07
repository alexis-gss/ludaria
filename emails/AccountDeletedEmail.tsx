import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface AccountDeletedEmailProps {
  pseudo: string;
}

export default function AccountDeletedEmail({
  pseudo,
}: AccountDeletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Ludaria account has been deleted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>👋 Account Deleted</Heading>
          <Text style={text}>
            Hi <strong>{pseudo}</strong>,
          </Text>
          <Text style={text}>
            Your Ludaria account and all associated data have been permanently
            deleted. We're sorry to see you go!
          </Text>
          <Text style={text}>
            If this was a mistake or you didn't request this deletion, please
            contact our support immediately.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This is an automated notification from Ludaria.
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
const hr = { borderColor: "#e5e7eb", margin: "20px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
