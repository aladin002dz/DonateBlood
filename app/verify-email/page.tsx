import { Suspense } from 'react';
import EmailVerification from './email-verification';

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <EmailVerification />
            </Suspense>
        </div>
    );
}
