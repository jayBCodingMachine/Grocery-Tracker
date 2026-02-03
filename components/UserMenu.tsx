'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import toast from 'react-hot-toast';

export default function UserMenu() {
    const { user, signOutUser } = useAuth();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOutUser();
            toast.success('Signed out successfully');
            router.push('/login');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign out failed';
            toast.error(message);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                <span style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {user.email}
                </span>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover, rgba(255,255,255,0.1))';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    Sign Out
                </button>
            </div>

            <LogoutConfirmModal
                isOpen={showModal}
                onConfirm={handleSignOut}
                onCancel={() => setShowModal(false)}
                loading={loading}
            />
        </>
    );
}
