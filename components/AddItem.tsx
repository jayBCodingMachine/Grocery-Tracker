'use client';

import { useState } from 'react';
import StoreDropdown from './StoreDropdown';

interface AddItemProps {
    onAdd: (name: string, store: string) => void;
    existingStores?: string[];
}

export default function AddItem({ onAdd, existingStores = [] }: AddItemProps) {
    const [name, setName] = useState('');
    const [store, setStore] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), store);
            setName('');
            // Keep store selected for quick adding multiple items from same store
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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

                <div style={{ paddingLeft: '8px' }}>
                    <StoreDropdown
                        value={store}
                        onChange={setStore}
                        existingStores={existingStores}
                    />
                </div>
            </div>
        </form>
    );
}
