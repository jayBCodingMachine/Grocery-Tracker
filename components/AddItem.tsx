'use client';

import { useState } from 'react';

interface AddItemProps {
    onAdd: (name: string, store: string) => void;
}

const STORES = ['Any', 'Costco', 'Kroger', 'Whole Foods', 'Trader Joe\'s', 'Target'];

export default function AddItem({ onAdd }: AddItemProps) {
    const [name, setName] = useState('');
    const [store, setStore] = useState(STORES[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), store === 'Any' ? '' : store);
            setName('');
            // Keep store selected for quick adding multiple items from same store
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className={`card`} style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        placeholder="Add item..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            padding: '12px',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            minWidth: 0
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!name.trim()}
                        style={{
                            borderRadius: 'var(--radius-sm)',
                            padding: '0 20px',
                            opacity: name.trim() ? 1 : 0.5
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* Store Chips - Always visible or expand on focus? Let's keep distinct rows for clarity */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        padding: '4px 8px 8px',
                        scrollbarWidth: 'none'  /* Firefox */
                    }}
                >
                    {STORES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStore(s)}
                            style={{
                                flexShrink: 0,
                                fontSize: '0.8rem',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: store === s ? 'var(--primary)' : 'var(--border)',
                                background: store === s ? 'var(--primary)' : 'transparent',
                                color: store === s ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </form>
    );
}
