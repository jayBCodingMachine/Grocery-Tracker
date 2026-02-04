'use client';

import { useState, useRef, useEffect } from 'react';
import { getStoreEmoji, DEFAULT_STORES } from '@/lib/storeEmojis';

interface StoreDropdownProps {
  value: string;
  onChange: (store: string) => void;
  existingStores: string[];
}

export default function StoreDropdown({
  value,
  onChange,
  existingStores,
}: StoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine existing stores with defaults, deduplicated
  const allStores = Array.from(
    new Set([...existingStores, ...DEFAULT_STORES])
  ).filter(Boolean).sort();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when adding new store
  useEffect(() => {
    if (isAddingNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingNew]);

  const handleSelect = (store: string) => {
    onChange(store);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (newStoreName.trim()) {
      onChange(newStoreName.trim());
      setNewStoreName('');
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNew();
    } else if (e.key === 'Escape') {
      setIsAddingNew(false);
      setNewStoreName('');
    }
  };

  const displayValue = value || 'Select store';
  const displayEmoji = value ? getStoreEmoji(value) : '🏪';

  return (
    <div className="store-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="store-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="store-dropdown__emoji">{displayEmoji}</span>
        <span className="store-dropdown__value">{displayValue}</span>
        <span className="store-dropdown__arrow">▼</span>
      </button>

      {isOpen && (
        <div className="store-dropdown__menu">
          {/* No store option */}
          <button
            type="button"
            className={`store-dropdown__option ${!value ? 'store-dropdown__option--selected' : ''}`}
            onClick={() => handleSelect('')}
          >
            <span className="store-dropdown__emoji">🏪</span>
            <span>Any store</span>
          </button>

          {/* Existing stores */}
          {allStores.map((store) => (
            <button
              key={store}
              type="button"
              className={`store-dropdown__option ${value === store ? 'store-dropdown__option--selected' : ''}`}
              onClick={() => handleSelect(store)}
            >
              <span className="store-dropdown__emoji">{getStoreEmoji(store)}</span>
              <span>{store}</span>
            </button>
          ))}

          {/* Add new store */}
          <div className="store-dropdown__divider" />

          {isAddingNew ? (
            <div className="store-dropdown__add-new">
              <input
                ref={inputRef}
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Store name..."
                className="store-dropdown__input"
              />
              <button
                type="button"
                className="store-dropdown__add-btn"
                onClick={handleAddNew}
                disabled={!newStoreName.trim()}
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="store-dropdown__option store-dropdown__option--add"
              onClick={() => setIsAddingNew(true)}
            >
              <span className="store-dropdown__emoji">➕</span>
              <span>Add new store</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
