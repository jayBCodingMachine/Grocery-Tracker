'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface SignUpFormProps {
    onNeedConfirmation: (email: string) => void;
}

export default function SignUpForm({ onNeedConfirmation }: SignUpFormProps) {
    const { signUpWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd: string) => {
        const errors: string[] = [];
        if (pwd.length < 8) errors.push('at least 8 characters');
        if (!/[A-Z]/.test(pwd)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(pwd)) errors.push('one lowercase letter');
        if (!/[0-9]/.test(pwd)) errors.push('one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('one special character');
        return errors;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            toast.error(`Password must have ${passwordErrors.join(', ')}`);
            return;
        }

        setLoading(true);
        try {
            const result = await signUpWithEmail(email, password);
            if (result.needsConfirmation) {
                toast.success('Check your email for a verification link!');
                onNeedConfirmation(email);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const passwordErrors = password ? validatePassword(password) : [];

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label
                    htmlFor="signup-email"
                    style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                >
                    Email
                </label>
                <input
                    id="signup-email"
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

            <div>
                <label
                    htmlFor="signup-password"
                    style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                >
                    Password
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
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
                {password && passwordErrors.length > 0 && (
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error, #ef4444)' }}>
                        Needs: {passwordErrors.join(', ')}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="signup-confirm"
                    style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}
                >
                    Confirm Password
                </label>
                <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
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
                {confirmPassword && password !== confirmPassword && (
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--error, #ef4444)' }}>
                        Passwords do not match
                    </p>
                )}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}
            >
                {loading && (
                    <span
                        style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                )}
                {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </form>
    );
}
