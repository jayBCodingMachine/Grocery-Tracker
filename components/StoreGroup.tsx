'use client';

import { useRef, useEffect, useState } from 'react';
import { GroceryItemType } from '@/app/types';
import GroceryItem from './GroceryItem';
import { getStoreEmoji } from '@/lib/storeEmojis';

interface StoreGroupProps {
  store: string;
  items: GroceryItemType[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemToggle: (id: string) => void;
  onItemDelete: (id: string) => void;
}

export default function StoreGroup({
  store,
  items,
  isExpanded,
  onToggle,
  onItemToggle,
  onItemDelete,
}: StoreGroupProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const emoji = getStoreEmoji(store);
  const incompleteCount = items.filter(i => !i.completed).length;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [items]);

  return (
    <div className="store-group">
      <button className="store-group__header" onClick={onToggle}>
        <span className="store-group__emoji">{emoji}</span>
        <span className="store-group__name">{store}</span>
        <span className="store-group__count">
          {incompleteCount} / {items.length}
        </span>
        <span className={`store-group__chevron ${isExpanded ? 'store-group__chevron--expanded' : ''}`}>
          ▼
        </span>
      </button>

      <div
        className="store-group__content"
        style={{
          height: isExpanded ? height : 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div ref={contentRef} className="store-group__items">
          {items.map((item) => (
            <GroceryItem
              key={item.itemId}
              item={item}
              onToggle={onItemToggle}
              onDelete={onItemDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
