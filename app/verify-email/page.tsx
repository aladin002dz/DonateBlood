import EmailVerification from '@/components/email-verification';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <EmailVerification />
            </Suspense>
        </div>
    );
}
