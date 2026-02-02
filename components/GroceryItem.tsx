import { GroceryItemType } from '../app/types';

interface GroceryItemProps {
    item: GroceryItemType;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function GroceryItem({ item, onToggle, onDelete }: GroceryItemProps) {
    return (
        <div
            className={`card`}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
                opacity: item.completed ? 0.6 : 1,
                background: item.completed ? 'transparent' : 'var(--surface)',
                borderColor: item.completed ? 'transparent' : 'var(--border)'
            }}
        >
            <label
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    cursor: 'pointer',
                    gap: '12px'
                }}
                onClick={() => onToggle(item.itemId)}
            >
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: item.completed ? 'none' : '2px solid var(--text-muted)',
                        backgroundColor: item.completed ? 'var(--success)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                    }}
                >
                    {item.completed && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <span
                        style={{
                            display: 'block',
                            fontSize: '1rem',
                            fontWeight: 500,
                            textDecoration: item.completed ? 'line-through' : 'none',
                            color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {item.name}
                    </span>
                    {item.store && (
                        <span
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--primary)',
                                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                marginTop: '4px',
                                display: 'inline-block'
                            }}
                        >
                            {item.store}
                        </span>
                    )}
                </div>
            </label>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.itemId);
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    padding: '8px',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                }}
                aria-label="Delete item"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    );
}
