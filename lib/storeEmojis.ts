// Store emoji mapping for visual identification
const STORE_EMOJI_MAP: Record<string, string> = {
  'costco': '🏪',
  'heb': '❤️',
  'h-e-b': '❤️',
  'whole foods': '🥬',
  'wholefoods': '🥬',
  'walmart': '🛒',
  'kroger': '🛒',
  'target': '🎯',
  'aldi': '🏷️',
  'trader joe\'s': '🌻',
  'trader joes': '🌻',
  'safeway': '🛒',
  'publix': '🛒',
  'wegmans': '🛒',
  'sprouts': '🌱',
  'amazon': '📦',
  'amazon fresh': '📦',
};

export function getStoreEmoji(store: string): string {
  if (!store) return '🛒';
  const normalized = store.toLowerCase().trim();
  return STORE_EMOJI_MAP[normalized] || '🛒';
}

export const DEFAULT_STORES = ['Costco', 'HEB', 'Whole Foods', 'Walmart'];
