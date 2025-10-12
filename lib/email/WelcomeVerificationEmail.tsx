import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface VerifyEmailProps {
    userName: string;
    verificationUrl: string;
}

const WelcomeVerificationEmail = (props: VerifyEmailProps) => {
    const { userName = 'there', verificationUrl = '#' } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[32px] font-bold text-gray-900 m-0 mb-[8px]">
                                Welcome to Our Platform!
                            </Text>
                            <Text className="text-[16px] text-gray-600 m-0">
                                We&apos;re excited to have you on board
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[18px] text-gray-900 mb-[16px] font-semibold">
                                Hi {userName},
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                                Thank you for joining our community! To get started and ensure the security of your account, please verify your email address by clicking the button below.
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                                Once verified, you'll have full access to all our features and can begin exploring everything we have to offer.
                            </Text>

                            {/* Verification Button */}
                            <Section className="text-center mb-[24px]">
                                <Button
                                    href={verificationUrl}
                                    className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border"
                                >
                                    Verify Email Address
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-500 mb-[16px] leading-[20px]">
                                If the button doesn't work, you can also copy and paste this link into your browser:
                            </Text>

                            <Text className="text-[14px] text-blue-600 mb-[24px] break-all">
                                {verificationUrl}
                            </Text>

                            <Text className="text-[14px] text-gray-500 leading-[20px]">
                                This verification link will expire in 24 hours for security reasons. If you didn't create an account with us, you can safely ignore this email.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[24px]" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-[14px] text-gray-500 mb-[8px]">
                                Need help? Contact our support team at support@company.com
                            </Text>

                            <Text className="text-[12px] text-gray-400 m-0 mb-[8px]">
                                Company Name, 123 Business Street, City, State 12345
                            </Text>

                            <Text className="text-[12px] text-gray-400 m-0">
                                © {new Date().getFullYear()} Company Name. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

WelcomeVerificationEmail.PreviewProps = {
    userName: 'John Doe',
    verificationUrl: 'https://yourapp.com/verify?token=abc123xyz',
};

export default WelcomeVerificationEmail;