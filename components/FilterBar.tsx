'use client';

import { useState } from 'react';
import { getStoreEmoji } from '@/lib/storeEmojis';

interface FilterBarProps {
  stores: string[];
  storeCounts: Record<string, number>;
  selectedStores: string[];
  onToggleStore: (store: string) => void;
  onClearFilters: () => void;
  groupByStore: boolean;
  onToggleGrouping: () => void;
  hideCompleted: boolean;
  onToggleHideCompleted: () => void;
}

export default function FilterBar({
  stores,
  storeCounts,
  selectedStores,
  onToggleStore,
  onClearFilters,
  groupByStore,
  onToggleGrouping,
  hideCompleted,
  onToggleHideCompleted,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MOBILE_VISIBLE_COUNT = 3;

  const visibleStores = isExpanded ? stores : stores.slice(0, MOBILE_VISIBLE_COUNT);
  const hiddenCount = stores.length - MOBILE_VISIBLE_COUNT;
  const showMoreButton = !isExpanded && hiddenCount > 0;

  return (
    <div className="filter-bar">
      {/* Store filter chips */}
      <div className="filter-chips-container">
        <div className="filter-chips">
          {visibleStores.map((store) => {
            const isSelected = selectedStores.includes(store);
            const count = storeCounts[store] || 0;
            const emoji = getStoreEmoji(store);

            return (
              <button
                key={store}
                onClick={() => onToggleStore(store)}
                className={`filter-chip ${isSelected ? 'filter-chip--selected' : ''}`}
              >
                <span className="filter-chip__emoji">{emoji}</span>
                <span className="filter-chip__name">{store}</span>
                <span className="filter-chip__count">({count})</span>
                {isSelected && (
                  <span
                    className="filter-chip__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStore(store);
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}

          {showMoreButton && (
            <button
              className="filter-chip filter-chip--more"
              onClick={() => setIsExpanded(true)}
            >
              +{hiddenCount} more
            </button>
          )}
        </div>

        {selectedStores.length > 0 && (
          <button className="filter-clear" onClick={onClearFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* View controls */}
      <div className="filter-controls">
        <button
          className={`filter-toggle ${hideCompleted ? 'filter-toggle--active' : ''}`}
          onClick={onToggleHideCompleted}
          title={hideCompleted ? 'Show completed' : 'Hide completed'}
        >
          {hideCompleted ? '👁️' : '👁️‍🗨️'}
          <span className="filter-toggle__label">
            {hideCompleted ? 'Hidden' : 'Showing'}
          </span>
        </button>

        <button
          className={`filter-toggle ${groupByStore ? 'filter-toggle--active' : ''}`}
          onClick={onToggleGrouping}
          title={groupByStore ? 'Show flat list' : 'Group by store'}
        >
          {groupByStore ? '📋' : '📑'}
          <span className="filter-toggle__label">
            {groupByStore ? 'Grouped' : 'Flat'}
          </span>
        </button>
      </div>
    </div>
  );
}
