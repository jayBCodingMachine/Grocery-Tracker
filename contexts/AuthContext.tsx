'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    getCurrentUser,
    fetchAuthSession,
    signInWithRedirect
} from 'aws-amplify/auth';

export interface AuthUser {
    userId: string;
    email: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
    confirmSignUpCode: (email: string, code: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    resetUserPassword: (email: string) => Promise<void>;
    confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
    getAccessToken: () => Promise<string | null>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkUser = useCallback(async () => {
        // Dev bypass mode
        if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
            setUser({ userId: 'dev_user', email: 'dev@localhost' });
            setLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();
            const idToken = session.tokens?.idToken;

            if (currentUser && idToken) {
                const payload = idToken.payload;
                setUser({
                    userId: currentUser.userId,
                    email: (payload.email as string) || currentUser.signInDetails?.loginId || '',
                });
            }
        } catch {
            // User not authenticated
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    const signInWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await signIn({ username: email, password });
            await checkUser();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign in failed';
            setError(message);
            throw err;
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            const result = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: { email },
                },
            });
            return { needsConfirmation: !result.isSignUpComplete };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed';
            setError(message);
            throw err;
        }
    };

    const confirmSignUpCode = async (email: string, code: string) => {
        setError(null);
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Confirmation failed';
            setError(message);
            throw err;
        }
    };

    const signInWithGoogle = async () => {
        setError(null);
        try {
            await signInWithRedirect({ provider: 'Google' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Google sign in failed';
            setError(message);
            throw err;
        }
    };

    const signOutUser = async () => {
        setError(null);
        try {
            await signOut();
            setUser(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign out failed';
            setError(message);
            throw err;
        }
    };

    const resetUserPassword = async (email: string) => {
        setError(null);
        try {
            await resetPassword({ username: email });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Password reset failed';
            setError(message);
            throw err;
        }
    };

    const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
        setError(null);
        try {
            await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Password reset confirmation failed';
            setError(message);
            throw err;
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
            return 'dev_token';
        }
        try {
            const session = await fetchAuthSession();
            return session.tokens?.accessToken?.toString() || null;
        } catch {
            return null;
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                signInWithEmail,
                signUpWithEmail,
                confirmSignUpCode,
                signInWithGoogle,
                signOutUser,
                resetUserPassword,
                confirmPasswordReset,
                getAccessToken,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
