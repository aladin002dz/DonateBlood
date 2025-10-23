import ResetPasswordForm from '../reset-password-form';

interface ResetPasswordPageProps {
    params: Promise<{
        token: string;
    }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    const { token } = await params;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <ResetPasswordForm token={token} />
        </div>
    );
}
