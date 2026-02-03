'use client';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel, loading }: LogoutConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '320px',
                    width: '100%',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                }}>
                    Sign Out?
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                }}>
                    Are you sure you want to sign out of your account?
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </div>
        </div>
    );
}
