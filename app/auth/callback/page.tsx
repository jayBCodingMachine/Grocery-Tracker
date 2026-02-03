'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // AWS Amplify handles the OAuth callback automatically
        // We just need to redirect to home after a brief moment
        const timer = setTimeout(() => {
            router.push('/');
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            gap: '16px',
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Completing sign in...
            </p>
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
