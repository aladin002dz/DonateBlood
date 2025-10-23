import ResetPasswordForm from '../reset-password-form';

interface ResetPasswordPageProps {
    params: {
        token: string;
    };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <ResetPasswordForm token={params.token} />
        </div>
    );
}
