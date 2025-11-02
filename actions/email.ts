'use server'

import PasswordResetEmail from '@/lib/email/PasswordResetEmail';
import { Resend } from 'resend';
import { getLocale } from 'next-intl/server';


export async function sendPasswordResetEmail(email: string, token: string) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
        const locale = await getLocale();
        const subjectMap: Record<string, string> = {
            en: 'Password Reset Request - Donate Blood Platform',
            fr: 'Demande de réinitialisation du mot de passe - Don de Sang',
            ar: 'طلب إعادة تعيين كلمة المرور - منصة التبرع بالدم'
        };
        const subject = subjectMap[locale] ?? subjectMap.en;

        type Locale = 'en' | 'fr' | 'ar';
        const isSupportedLocale = (value: string): value is Locale => (['en','fr','ar'] as readonly string[]).includes(value);
        const localeForEmail: Locale = isSupportedLocale(locale) ? locale : 'en';

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM ? `Mahfoudh <${process.env.EMAIL_FROM}>` : 'mahfoudh <hello@marostudio.dev>',
            to: email,
            subject,
            react: PasswordResetEmail({
                userName: email.split('@')[0], // Use email prefix as username
                resetUrl: resetUrl,
                locale: localeForEmail
            })
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
} 