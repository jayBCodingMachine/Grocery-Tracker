'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GroceryItemType } from '../app/types';
import GroceryItem from './GroceryItem';
import AddItem from './AddItem';
import FilterBar from './FilterBar';
import StoreGroup from './StoreGroup';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface GroceryListProps {
    initialItems?: GroceryItemType[];
}

// localStorage helpers with SSR safety
function getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setStorageItem(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage errors
    }
}

export default function GroceryList({ initialItems = [] }: GroceryListProps) {
    const { getAccessToken } = useAuth();
    const [items, setItems] = useState<GroceryItemType[]>(initialItems);
    const [loading, setLoading] = useState(true);

    // Filter and view state with persistence
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [groupByStore, setGroupByStore] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    // Load persisted state on mount
    useEffect(() => {
        setSelectedStores(getStorageItem('grocery-filters', []));
        setGroupByStore(getStorageItem('grocery-group', false));
        setHideCompleted(getStorageItem('grocery-hide-completed', false));
    }, []);

    // Persist state changes
    useEffect(() => {
        setStorageItem('grocery-filters', selectedStores);
    }, [selectedStores]);

    useEffect(() => {
        setStorageItem('grocery-group', groupByStore);
    }, [groupByStore]);

    useEffect(() => {
        setStorageItem('grocery-hide-completed', hideCompleted);
    }, [hideCompleted]);

    const getAuthHeaders = useCallback(async (): Promise<HeadersInit> => {
        const token = await getAccessToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };
    }, [getAccessToken]);

    const fetchItems = useCallback(async () => {
        try {
            const headers = await getAuthHeaders();
            const res = await fetch('/api/items', { headers });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            } else if (res.status === 401) {
                toast.error('Session expired. Please sign in again.');
            }
        } catch (err) {
            console.error('Failed to fetch items', err);
            toast.error('Failed to load items');
        } finally {
            setLoading(false);
        }
    }, [getAuthHeaders]);

    // Fetch items on mount
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Derive unique stores from items
    const stores = useMemo(() => {
        return Array.from(new Set(items.map(i => i.store).filter(Boolean))).sort();
    }, [items]);

    // Calculate store counts
    const storeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        items.forEach(item => {
            if (item.store) {
                counts[item.store] = (counts[item.store] || 0) + 1;
            }
        });
        return counts;
    }, [items]);

    // Filter items
    const filteredItems = useMemo(() => {
        let result = items;

        // Filter by selected stores
        if (selectedStores.length > 0) {
            result = result.filter(i => selectedStores.includes(i.store || ''));
        }

        // Hide completed if enabled
        if (hideCompleted) {
            result = result.filter(i => !i.completed);
        }

        // Sort: Incomplete first
        return [...result].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
    }, [items, selectedStores, hideCompleted]);

    // Group items by store
    const groupedItems = useMemo(() => {
        const groups: Record<string, GroceryItemType[]> = {};
        filteredItems.forEach(item => {
            const store = item.store || 'No Store';
            if (!groups[store]) groups[store] = [];
            groups[store].push(item);
        });
        return groups;
    }, [filteredItems]);

    // Smart expand: auto-expand filtered stores when filters change
    useEffect(() => {
        if (selectedStores.length > 0) {
            setExpandedGroups(new Set(selectedStores));
        }
    }, [selectedStores]);

    // Filter handlers
    const handleToggleStore = (store: string) => {
        setSelectedStores(prev =>
            prev.includes(store)
                ? prev.filter(s => s !== store)
                : [...prev, store]
        );
    };

    const handleClearFilters = () => {
        setSelectedStores([]);
    };

    const handleToggleGrouping = () => {
        setGroupByStore(prev => !prev);
    };

    const handleToggleHideCompleted = () => {
        setHideCompleted(prev => !prev);
    };

    const handleToggleGroup = (store: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(store)) {
                next.delete(store);
            } else {
                next.add(store);
            }
            return next;
        });
    };

    // Item CRUD handlers
    const addItem = async (name: string, store: string) => {
        try {
            const headers = await getAuthHeaders();
            const res = await fetch('/api/items', {
                method: 'POST',
                headers,
                body: JSON.stringify({ action: 'add', name, store })
            });
            if (res.ok) {
                const newItem = await res.json();
                setItems(prev => [newItem, ...prev]);
            } else if (res.status === 401) {
                toast.error('Session expired. Please sign in again.');
            }
        } catch (error) {
            console.error('Error adding item', error);
            toast.error('Failed to add item');
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
            const headers = await getAuthHeaders();
            await fetch('/api/items', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ itemId, updates: { completed: !item.completed } })
            });
        } catch (error) {
            console.error('Error updating item', error);
            fetchItems();
        }
    };

    const deleteItem = async (itemId: string) => {
        // Optimistic update
        setItems(prev => prev.filter(item => item.itemId !== itemId));

        try {
            const headers = await getAuthHeaders();
            await fetch(`/api/items?id=${itemId}`, {
                method: 'DELETE',
                headers,
            });
        } catch (error) {
            console.error('Error deleting item', error);
            fetchItems();
        }
    };

    // Render empty state
    const renderEmptyState = () => (
        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            <p>
                {loading
                    ? 'Loading...'
                    : selectedStores.length > 0
                        ? 'No items match your filters'
                        : 'No items yet. Add your first item above!'}
            </p>
        </div>
    );

    // Render flat list
    const renderFlatList = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredItems.map(item => (
                <GroceryItem
                    key={item.itemId}
                    item={item}
                    onToggle={toggleItem}
                    onDelete={deleteItem}
                />
            ))}
        </div>
    );

    // Render grouped list
    const renderGroupedList = () => {
        const storeNames = Object.keys(groupedItems).sort();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {storeNames.map(store => (
                    <StoreGroup
                        key={store}
                        store={store}
                        items={groupedItems[store]}
                        isExpanded={expandedGroups.has(store)}
                        onToggle={() => handleToggleGroup(store)}
                        onItemToggle={toggleItem}
                        onItemDelete={deleteItem}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '100%', width: '100%' }}>
            <AddItem onAdd={addItem} existingStores={stores} />

            {/* Filter Bar */}
            {stores.length > 0 && (
                <FilterBar
                    stores={stores}
                    storeCounts={storeCounts}
                    selectedStores={selectedStores}
                    onToggleStore={handleToggleStore}
                    onClearFilters={handleClearFilters}
                    groupByStore={groupByStore}
                    onToggleGrouping={handleToggleGrouping}
                    hideCompleted={hideCompleted}
                    onToggleHideCompleted={handleToggleHideCompleted}
                />
            )}

            {/* Item List */}
            {filteredItems.length === 0
                ? renderEmptyState()
                : groupByStore
                    ? renderGroupedList()
                    : renderFlatList()
            }
        </div>
    );
}
