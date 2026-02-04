# Feature 003: Enhanced Store Filtering

| Field | Value |
|-------|-------|
| **Feature ID** | 003 |
| **Date** | 2026-02-03 |
| **Branch** | main |
| **Status** | Completed |

**Summary:** Add multi-select store filtering with emoji icons, grouped views, and persistent user preferences.

---

## Why This Change?

The previous UI had basic single-select store filtering using tab buttons. Users needed:
- **Multi-select filtering** - View items from multiple stores at once (e.g., "show me Costco AND HEB items")
- **Better organization** - Group items by store with collapsible sections
- **Visual identification** - Emoji icons make stores instantly recognizable
- **Persistent preferences** - Don't lose filter settings on page refresh
- **Hide completed option** - Focus on what still needs to be bought

### User Requirements (from interview)
- Filter bar above the list with pill-shaped chips
- Each chip shows emoji + store name + item count
- Mobile: show top 3 stores + "+X more" that expands
- Collapsible store sections with smooth animations
- Smart expand: filtered stores auto-expand
- Toggle to hide completed items
- All preferences persist to localStorage

---

## What Changed

### Files Modified

| File | Change Type | Purpose |
|------|-------------|---------|
| `components/GroceryList.tsx` | Major rewrite | Multi-select state, grouping logic, persistence, FilterBar integration |
| `components/AddItem.tsx` | Modified | Replaced chip buttons with StoreDropdown component |
| `app/globals.css` | Extended | Added ~325 lines of styles for new components |

### Files Added

| File | Purpose |
|------|---------|
| `lib/storeEmojis.ts` | Store-to-emoji mapping function + default stores list |
| `components/FilterBar.tsx` | Filter controls: store chips, view toggles, clear button |
| `components/StoreGroup.tsx` | Collapsible store section with animated expand/collapse |
| `components/StoreDropdown.tsx` | Dropdown selector for store with "+ Add new store" option |

---

## Technical Details

### 1. Store Emoji Mapping (`lib/storeEmojis.ts`)

Maps store names to emojis for visual identification:

```typescript
const STORE_EMOJI_MAP: Record<string, string> = {
  'costco': '🏪',
  'heb': '❤️',
  'whole foods': '🥬',
  'walmart': '🛒',
  // ... more mappings
};

export function getStoreEmoji(store: string): string {
  const normalized = store.toLowerCase().trim();
  return STORE_EMOJI_MAP[normalized] || '🛒'; // Default fallback
}

export const DEFAULT_STORES = ['Costco', 'HEB', 'Whole Foods', 'Walmart'];
```

### 2. Filter State Management

Changed from single-select to multi-select with localStorage persistence:

```typescript
// Before
const [filterStore, setFilterStore] = useState('All');

// After
const [selectedStores, setSelectedStores] = useState<string[]>([]);
const [groupByStore, setGroupByStore] = useState(false);
const [hideCompleted, setHideCompleted] = useState(false);

// Persistence via localStorage
useEffect(() => {
  setStorageItem('grocery-filters', selectedStores);
}, [selectedStores]);
```

### 3. Filtering Logic

```typescript
const filteredItems = useMemo(() => {
  let result = items;

  // Filter by selected stores (empty = show all)
  if (selectedStores.length > 0) {
    result = result.filter(i => selectedStores.includes(i.store || ''));
  }

  // Hide completed if enabled
  if (hideCompleted) {
    result = result.filter(i => !i.completed);
  }

  return result;
}, [items, selectedStores, hideCompleted]);
```

### 4. Grouped View

When grouping is enabled, items are organized by store:

```typescript
const groupedItems = useMemo(() => {
  const groups: Record<string, GroceryItemType[]> = {};
  filteredItems.forEach(item => {
    const store = item.store || 'No Store';
    if (!groups[store]) groups[store] = [];
    groups[store].push(item);
  });
  return groups;
}, [filteredItems]);
```

### 5. Collapsible Sections

StoreGroup uses CSS height transitions for smooth animations:

```typescript
<div
  style={{
    height: isExpanded ? height : 0,
    overflow: 'hidden',
    transition: 'height 0.3s ease',
  }}
>
```

### 6. Store Dropdown

Replaces hardcoded chip buttons with dynamic dropdown:
- Shows stores from existing items + default stores (deduplicated)
- "+ Add new store" option for custom stores
- Each option shows emoji icon

---

## Component Architecture

```
GroceryList
├── AddItem
│   └── StoreDropdown (new)
├── FilterBar (new)
│   ├── Store filter chips
│   ├── View toggle (grouped/flat)
│   └── Hide completed toggle
└── [Items rendering]
    ├── Flat list: GroceryItem[]
    └── Grouped: StoreGroup[] (new)
        └── GroceryItem[]
```

---

## Lessons Learned

1. **localStorage SSR Safety** - Must check `typeof window !== 'undefined'` before accessing localStorage in Next.js to avoid hydration errors.

2. **Emoji Consistency** - Store name matching needs normalization (lowercase, trim) to handle variations like "HEB" vs "heb" vs "H-E-B".

3. **CSS Height Transitions** - Can't animate `height: auto`. Need to measure content height with `scrollHeight` and animate to specific pixel value.

4. **Smart Defaults** - Auto-expanding filtered stores improves UX by showing relevant content immediately.

---

## Future Improvements

1. **Category filtering** - Filter by item category (produce, dairy, etc.) in addition to store
2. **Save filter presets** - Name and save combinations of filters for quick access
3. **Drag-and-drop reorder** - Reorder items within groups
4. **Store management screen** - Edit store names, assign custom emojis
5. **Search within filters** - Text search combined with store filters
