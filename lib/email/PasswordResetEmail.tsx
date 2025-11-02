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
    locale?: 'en' | 'fr' | 'ar';
}

export default function PasswordResetEmail({
    userName = 'User',
    resetUrl = 'https://example.com/reset-password',
    locale = 'en',
}: PasswordResetEmailProps) {
    const isRTL = locale === 'ar'
    const dict = {
        en: {
            preview: 'Reset your password for your Donate Blood account',
            brand: '🩸 Donate Blood',
            heading: 'Password Reset Request',
            hello: `Hello ${userName},`,
            intro: 'You requested a password reset for your Donate Blood account. Click the button below to reset your password:',
            button: 'Reset Password',
            copy: "If the button doesn't work, you can copy and paste this link into your browser:",
            expires: 'This link will expire in 1 hour for security reasons.',
            ignore: "If you didn't request this password reset, please ignore this email. Your password will remain unchanged.",
            footer: 'This is an automated message from Donate Blood Platform. Please do not reply to this email.'
        },
        fr: {
            preview: 'Réinitialisez le mot de passe de votre compte Don de Sang',
            brand: '🩸 Don de Sang',
            heading: 'Demande de réinitialisation du mot de passe',
            hello: `Bonjour ${userName},`,
            intro: 'Vous avez demandé la réinitialisation du mot de passe de votre compte Don de Sang. Cliquez sur le bouton ci-dessous pour continuer :',
            button: 'Réinitialiser le mot de passe',
            copy: "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
            expires: 'Ce lien expirera dans 1 heure pour des raisons de sécurité.',
            ignore: "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. Votre mot de passe restera inchangé.",
            footer: "Ceci est un message automatique de la plateforme Don de Sang. Merci de ne pas répondre à cet e-mail."
        },
        ar: {
            preview: 'إعادة تعيين كلمة المرور لحسابك في منصة التبرع بالدم',
            brand: '🩸 التبرع بالدم',
            heading: 'طلب إعادة تعيين كلمة المرور',
            hello: `مرحبًا ${userName}،`,
            intro: 'لقد طلبت إعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإعادة التعيين:',
            button: 'إعادة تعيين كلمة المرور',
            copy: 'إذا لم يعمل الزر، يمكنك نسخ هذا الرابط ولصقه في متصفحك:',
            expires: 'سينتهي هذا الرابط خلال ساعة واحدة لأسباب أمنية.',
            ignore: 'إذا لم تطلب إعادة التعيين، يرجى تجاهل هذا البريد. ستبقى كلمة المرور دون تغيير.',
            footer: 'هذه رسالة تلقائية من منصة التبرع بالدم. الرجاء عدم الرد على هذا البريد.'
        }
    }[locale]
    return (
        <Html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
            <Head />
            <Preview>{dict.preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoContainer}>
                        <Text style={logo}>{dict.brand}</Text>
                    </Section>

                    <Heading style={h1}>{dict.heading}</Heading>

                    <Text style={text}>{dict.hello}</Text>

                    <Text style={text}>{dict.intro}</Text>

                    <Section style={buttonContainer}>
                        <Button style={button} href={resetUrl}>
                            {dict.button}
                        </Button>
                    </Section>

                    <Text style={text}>{dict.copy}</Text>

                    <Text style={link}>
                        {resetUrl}
                    </Text>

                    <Text style={text}>{dict.expires}</Text>

                    <Text style={text}>{dict.ignore}</Text>

                    <Text style={footer}>{dict.footer}</Text>
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
