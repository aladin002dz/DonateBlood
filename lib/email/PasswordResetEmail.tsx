import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
    userName: string;
    resetUrl: string;
}

export default function PasswordResetEmail({
    userName = 'User',
    resetUrl = 'https://example.com/reset-password',
}: PasswordResetEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset your password for your Donate Blood account</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoContainer}>
                        <Text style={logo}>🩸 Donate Blood</Text>
                    </Section>

                    <Heading style={h1}>Password Reset Request</Heading>

                    <Text style={text}>
                        Hello {userName},
                    </Text>

                    <Text style={text}>
                        You requested a password reset for your Donate Blood account.
                        Click the button below to reset your password:
                    </Text>

                    <Section style={buttonContainer}>
                        <Button style={button} href={resetUrl}>
                            Reset Password
                        </Button>
                    </Section>

                    <Text style={text}>
                        If the button doesn&apos;t work, you can copy and paste this link into your browser:
                    </Text>

                    <Text style={link}>
                        {resetUrl}
                    </Text>

                    <Text style={text}>
                        This link will expire in 1 hour for security reasons.
                    </Text>

                    <Text style={text}>
                        If you didn&apos;t request this password reset, please ignore this email.
                        Your password will remain unchanged.
                    </Text>

                    <Text style={footer}>
                        This is an automated message from Donate Blood Platform.
                        Please do not reply to this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const logoContainer = {
    textAlign: 'center' as const,
    marginBottom: '32px',
};

const logo = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#dc2626',
    margin: '0',
};

const h1 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    textAlign: 'center' as const,
};

const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#dc2626',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
};

const link = {
    color: '#dc2626',
    fontSize: '14px',
    textDecoration: 'underline',
    wordBreak: 'break-all' as const,
    margin: '16px 0',
};

const footer = {
    color: '#6b7280',
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
};
