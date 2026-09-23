import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { categories } from '../data/content';

/**
 * CompassContext holds the two pieces of shared UI state that link the
 * Compass (Section 2) to the preview panels (Sections 3 & 4):
 *
 *   activeCategory — which compass point is "selected" (defaults to `work`)
 *   activeItemId   — which item within that category is shown in the big preview
 *
 * Hovering a compass point calls `selectCategory`, which also resets the
 * active item to the first in the new category. Clicking a thumbnail calls
 * `selectItem`. Everything downstream just reads `category` + `activeItem`.
 */
const CompassContext = createContext(null);

const CATEGORY_KEYS = Object.keys(categories);

export function CompassProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState('about');
  const [activeItemId, setActiveItemId] = useState(categories.about.items[0].id);

  const selectCategory = useCallback((key) => {
    if (!CATEGORY_KEYS.includes(key)) return;
    setActiveCategory(key);
    // Reset to the first item so the preview always shows something valid.
    setActiveItemId(categories[key].items[0].id);
  }, []);

  const selectItem = useCallback((id) => {
    setActiveItemId(id);
  }, []);

  const value = useMemo(() => {
    const category = categories[activeCategory];
    const activeItem =
      category.items.find((it) => it.id === activeItemId) ?? category.items[0];
    const activeIndex = category.items.indexOf(activeItem);

    // Step to the previous/next item within the current category (wraps).
    const step = (dir) => {
      const len = category.items.length;
      const next = (activeIndex + dir + len) % len;
      setActiveItemId(category.items[next].id);
    };

    return {
      activeCategory,
      category,
      activeItem,
      activeIndex,
      total: category.items.length,
      selectCategory,
      selectItem,
      next: () => step(1),
      prev: () => step(-1),
    };
  }, [activeCategory, activeItemId, selectCategory, selectItem]);

  return (
    <CompassContext.Provider value={value}>{children}</CompassContext.Provider>
  );
}

export function useCompass() {
  const ctx = useContext(CompassContext);
  if (!ctx) throw new Error('useCompass must be used within a CompassProvider');
  return ctx;
}
