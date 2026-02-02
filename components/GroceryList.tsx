'use client';

import { useState, useEffect } from 'react';
import { GroceryItemType } from '../app/types';
import GroceryItem from './GroceryItem';
import AddItem from './AddItem';

interface GroceryListProps {
    initialItems?: GroceryItemType[];
}

export default function GroceryList({ initialItems = [] }: GroceryListProps) {
    const [items, setItems] = useState<GroceryItemType[]>(initialItems);
    const [filterStore, setFilterStore] = useState('All');
    const [loading, setLoading] = useState(true);

    // Fetch items on mount
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/items');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error('Failed to fetch items', err);
        } finally {
            setLoading(false);
        }
    };

    // Derive unique stores from items + defaults
    const stores = ['All', ...Array.from(new Set(items.map(i => i.store).filter(Boolean)))];

    const filteredItems = filterStore === 'All'
        ? items
        : items.filter(i => i.store === filterStore);

    // Sort: Incomplete first, then by name
    filteredItems.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    const addItem = async (name: string, store: string) => {
        try {
            // Optimistic add could be done here if we generate a temp ID
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add', name, store })
            });
            if (res.ok) {
                const newItem = await res.json();
                setItems(prev => [newItem, ...prev]);
            }
        } catch (error) {
            console.error('Error adding item', error);
        }
    };

    const toggleItem = async (itemId: string) => {
        const item = items.find(i => i.itemId === itemId);
        if (!item) return;

        // Optimistic update
        setItems(prev => prev.map(i =>
            i.itemId === itemId ? { ...i, completed: !i.completed } : i
        ));

        try {
            await fetch('/api/items', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, updates: { completed: !item.completed } })
            });
        } catch (error) {
            // Revert on error
            console.error('Error updating item', error);
            fetchItems();
        }
    };

    const deleteItem = async (itemId: string) => {
        // Optimistic update
        setItems(prev => prev.filter(item => item.itemId !== itemId));

        try {
            await fetch(`/api/items?id=${itemId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting item', error);
            fetchItems();
        }
    };

    return (
        <div style={{ maxWidth: '100%', width: '100%' }}>
            <AddItem onAdd={addItem} />

            {/* Filter Tabs */}
            {stores.length > 2 && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    overflowX: 'auto',
                    paddingBottom: '4px'
                }}>
                    {stores.map(store => (
                        <button
                            key={store}
                            onClick={() => setFilterStore(store)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '6px 12px',
                                color: filterStore === store ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: filterStore === store ? 700 : 400,
                                borderBottom: filterStore === store ? '2px solid var(--primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {store}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                        <p>{loading ? 'Loading...' : 'No items found'}</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <GroceryItem
                            key={item.itemId}
                            item={item}
                            onToggle={toggleItem}
                            onDelete={deleteItem}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
