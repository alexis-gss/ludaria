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

interface PasswordChangedEmailProps {
  pseudo: string;
}

export default function PasswordChangedEmail({
  pseudo,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Ludaria password has been changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔒 Password Changed</Heading>
          <Text style={text}>
            Hi <strong>{pseudo}</strong>,
          </Text>
          <Text style={text}>Your password has been successfully updated.</Text>
          <Text style={text}>
            If you didn't make this change, please reset your password
            immediately or contact support.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This is an automated security notification from Ludaria.
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
