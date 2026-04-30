import {
  formatPrice,
  lookupPriceByModel,
  isPriceMissing,
  getPriceBadge,
  getDisplayPrice,
  formatPriceWithFallback
} from '../priceFormatter';

// Mock priceDiscount to avoid pulling localStorage in unit test
jest.mock('../../data/priceDiscount', () => ({
  getPriceMode: () => 'external',
  PRICE_MODE: { INTERNAL: 'internal', EXTERNAL: 'external' },
  getMarkupRate: () => 1.1
}));

describe('priceFormatter (v2)', () => {
  describe('formatPrice', () => {
    it('formats integer price with ¥', () => {
      expect(formatPrice(125000)).toBe('¥125,000');
    });
    it('returns 询价 fallback for 0/null/NaN', () => {
      expect(formatPrice(0)).toBe('询价');
      expect(formatPrice(null)).toBe('询价');
      expect(formatPrice(undefined)).toBe('询价');
      expect(formatPrice(NaN)).toBe('询价');
    });
    it('accepts custom fallback', () => {
      expect(formatPrice(null, 'N/A')).toBe('N/A');
    });
  });

  describe('lookupPriceByModel', () => {
    it('finds exact model in gearboxPriceData', () => {
      const r = lookupPriceByModel('40A');
      expect(r.factoryPrice).toBeGreaterThan(0);
      expect(r.source).toBe('exact');
    });
    it('falls back to stripped suffix match', () => {
      // HC300 (1.5-4.61) is in data; test stripped version
      const r = lookupPriceByModel('HC300');
      expect(r.source === 'exact' || r.source === 'stripped').toBe(true);
    });
    it('uses GW formula for GW series', () => {
      const r = lookupPriceByModel('GWD49.54');
      expect(r.source).toBe('gw-formula');
      expect(r.factoryPrice).toBeGreaterThan(0);
    });
    it('returns null for unknown model', () => {
      const r = lookupPriceByModel('ZZZ_UNKNOWN_999');
      expect(r.factoryPrice).toBeNull();
      expect(r.source).toBeNull();
    });
  });

  describe('isPriceMissing', () => {
    it('true for product with no price fields', () => {
      expect(isPriceMissing({ model: 'ZZZ_UNKNOWN_999' })).toBe(true);
    });
    it('false when inline factoryPrice exists', () => {
      expect(isPriceMissing({ model: 'X', factoryPrice: 1000 })).toBe(false);
    });
    it('false when fallback lookup succeeds (GW)', () => {
      expect(isPriceMissing({ model: 'GWD49.54' })).toBe(false);
    });
  });

  describe('getPriceBadge', () => {
    it('returns warning 询价 badge when missing', () => {
      const b = getPriceBadge({ model: 'ZZZ_UNKNOWN' });
      expect(b.isMissing).toBe(true);
      expect(b.text).toBe('询价');
      expect(b.variant).toBe('warning');
    });
    it('returns success 有价 badge when available', () => {
      const b = getPriceBadge({ model: 'X', factoryPrice: 1000 });
      expect(b.isMissing).toBe(false);
      expect(b.text).toBe('有价');
    });
  });

  describe('getDisplayPrice fallback', () => {
    it('falls back to lookup when inline missing (GW series)', () => {
      expect(getDisplayPrice({ model: 'GWD49.54' })).toBeGreaterThan(0);
    });
    it('returns 0 for unknown model with no inline price', () => {
      expect(getDisplayPrice({ model: 'ZZZ_UNKNOWN_999' })).toBe(0);
    });
  });

  // P0#2 — formatPriceWithFallback 渲染层统一兜底
  describe('formatPriceWithFallback', () => {
    it('formats inline factoryPrice', () => {
      expect(formatPriceWithFallback({ model: 'X', factoryPrice: 50000 })).toBe('¥50,000');
    });
    it('prefers inline over lookup', () => {
      expect(formatPriceWithFallback({ model: 'GWD49.54', factoryPrice: 99 })).toBe('¥99');
    });
    it('falls back to lookup (GW formula) when inline missing', () => {
      const r = formatPriceWithFallback({ model: 'GWD49.54' });
      expect(r).toMatch(/^¥/);
    });
    it('returns default fallback "询价" for unknown model', () => {
      expect(formatPriceWithFallback({ model: 'ZZZ_UNKNOWN_999' })).toBe('询价');
    });
    it('accepts custom fallback', () => {
      expect(formatPriceWithFallback({ model: 'ZZZ_UNKNOWN_999' }, '-')).toBe('-');
    });
    it('accepts string model', () => {
      expect(formatPriceWithFallback('GWD49.54')).toMatch(/^¥/);
    });
    it('handles null/undefined', () => {
      expect(formatPriceWithFallback(null)).toBe('询价');
      expect(formatPriceWithFallback(undefined)).toBe('询价');
      expect(formatPriceWithFallback({})).toBe('询价');
    });
    it('reads marketPrice / price / basePrice in order', () => {
      expect(formatPriceWithFallback({ marketPrice: 1234 })).toBe('¥1,234');
      expect(formatPriceWithFallback({ price: 5678 })).toBe('¥5,678');
      expect(formatPriceWithFallback({ basePrice: 999 })).toBe('¥999');
    });
  });
});
