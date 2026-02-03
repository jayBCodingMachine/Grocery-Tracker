'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import toast from 'react-hot-toast';

type View = 'signin' | 'signup' | 'forgot' | 'confirm';

export default function LoginPage() {
    const { user, loading, confirmSignUpCode } = useAuth();
    const router = useRouter();
    const [view, setView] = useState<View>('signin');
    const [pendingEmail, setPendingEmail] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleNeedConfirmation = (email: string) => {
        setPendingEmail(email);
        setView('confirm');
    };

    const handleConfirmCode = async () => {
        if (!confirmCode) {
            toast.error('Please enter the verification code');
            return;
        }
        setConfirming(true);
        try {
            await confirmSignUpCode(pendingEmail, confirmCode);
            toast.success('Email verified! Please sign in.');
            setView('signin');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Verification failed';
            toast.error(message);
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background)',
            }}>
                <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'var(--background)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
            }}>
                {/* Logo / Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '32px',
                        marginBottom: '8px',
                    }}>
                        🛒
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Grocery Tracker
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {view === 'signin' && 'Sign in to your account'}
                        {view === 'signup' && 'Create your account'}
                        {view === 'forgot' && 'Reset your password'}
                        {view === 'confirm' && 'Verify your email'}
                    </p>
                </div>

                {/* Tabs (only show for signin/signup) */}
                {(view === 'signin' || view === 'signup') && (
                    <div style={{
                        display: 'flex',
                        marginBottom: '24px',
                        borderBottom: '1px solid var(--border)',
                    }}>
                        <button
                            onClick={() => setView('signin')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: view === 'signin' ? '2px solid var(--primary)' : '2px solid transparent',
                                color: view === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontWeight: view === 'signin' ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setView('signup')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: view === 'signup' ? '2px solid var(--primary)' : '2px solid transparent',
                                color: view === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontWeight: view === 'signup' ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* Google Sign In (for signin and signup) */}
                {(view === 'signin' || view === 'signup') && (
                    <>
                        <GoogleSignInButton />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '20px 0',
                            gap: '12px',
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>or</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                        </div>
                    </>
                )}

                {/* Forms */}
                {view === 'signin' && (
                    <LoginForm
                        onForgotPassword={() => setView('forgot')}
                        onSuccess={() => router.push('/')}
                    />
                )}

                {view === 'signup' && (
                    <SignUpForm onNeedConfirmation={handleNeedConfirmation} />
                )}

                {view === 'forgot' && (
                    <ForgotPasswordForm
                        onBack={() => setView('signin')}
                        onSuccess={() => setView('signin')}
                    />
                )}

                {view === 'confirm' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            We sent a verification code to <strong>{pendingEmail}</strong>
                        </p>
                        <div>
                            <label
                                htmlFor="confirm-code"
                                style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                            >
                                Verification Code
                            </label>
                            <input
                                id="confirm-code"
                                type="text"
                                value={confirmCode}
                                onChange={(e) => setConfirmCode(e.target.value)}
                                placeholder="Enter the code"
                                disabled={confirming}
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
                            onClick={handleConfirmCode}
                            disabled={confirming}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: confirming ? 'not-allowed' : 'pointer',
                                opacity: confirming ? 0.7 : 1,
                            }}
                        >
                            {confirming ? 'Verifying...' : 'Verify Email'}
                        </button>
                        <button
                            onClick={() => setView('signup')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Back to Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
