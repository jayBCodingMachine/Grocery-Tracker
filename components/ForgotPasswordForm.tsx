'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface ForgotPasswordFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export default function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
    const { resetUserPassword, confirmPasswordReset } = useAuth();
    const [step, setStep] = useState<'request' | 'confirm'>('request');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await resetUserPassword(email);
            toast.success('Check your email for a reset code!');
            setStep('confirm');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to send reset email';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (e: FormEvent) => {
        e.preventDefault();
        if (!code || !newPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(email, code, newPassword);
            toast.success('Password reset successfully! Please sign in.');
            onSuccess();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to reset password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'request') {
        return (
            <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Enter your email and we&apos;ll send you a code to reset your password.
                </p>

                <div>
                    <label
                        htmlFor="reset-email"
                        style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                    >
                        Email
                    </label>
                    <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Back to Sign In
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleConfirmReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Enter the code from your email and your new password.
            </p>

            <div>
                <label
                    htmlFor="reset-code"
                    style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                >
                    Verification Code
                </label>
                <input
                    id="reset-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code from email"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                    }}
                />
            </div>

            <div>
                <label
                    htmlFor="new-password"
                    style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                >
                    New Password
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            paddingRight: '48px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '4px',
                        }}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
                type="button"
                onClick={() => setStep('request')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                Didn&apos;t receive a code? Try again
            </button>
        </form>
    );
}
