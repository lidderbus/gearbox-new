import { mergeMarketEnrichment } from '../marketEnrichmentMerge';
import marketEnrichment from '../../data/marketEnrichment.json';

describe('mergeMarketEnrichment (P1#1)', () => {
  const realRecords = marketEnrichment.records || {};
  const someHotModel = Object.entries(realRecords)
    .filter(([, r]) => r.salesCount >= 7)
    .map(([m]) => m)[0];

  it('returns 0 hit on empty data', () => {
    const r = mergeMarketEnrichment({});
    expect(r.hit).toBe(0);
    expect(r.total).toBe(0);
  });

  it('merges a known real hot-seller model', () => {
    if (!someHotModel) {
      // Skip if no hot sellers in fixture
      return;
    }
    const data = {
      hcGearboxes: [
        { model: someHotModel },
        { model: 'ZZZ_UNKNOWN_MODEL' }
      ]
    };
    const r = mergeMarketEnrichment(data);
    expect(r.total).toBe(2);
    expect(r.hit).toBe(1);
    expect(data.hcGearboxes[0].marketData).toBeDefined();
    expect(data.hcGearboxes[0].marketData.salesCount).toBeGreaterThan(0);
    expect(data.hcGearboxes[0].marketData._source).toBe('marketEnrichment');
    expect(data.hcGearboxes[1].marketData).toBeUndefined();
  });

  it('skips when marketData already exists (no clobber)', () => {
    const existingData = { salesCount: 999, _source: 'manual' };
    const data = {
      hcGearboxes: [{ model: someHotModel || '135', marketData: existingData }]
    };
    mergeMarketEnrichment(data);
    expect(data.hcGearboxes[0].marketData).toBe(existingData);
  });

  it('handles missing collections gracefully', () => {
    const data = { _version: 55, nonsenseKey: 'x' };
    expect(() => mergeMarketEnrichment(data)).not.toThrow();
  });

  it('handles null/undefined input', () => {
    expect(mergeMarketEnrichment(null).total).toBe(0);
    expect(mergeMarketEnrichment(undefined).total).toBe(0);
  });
});
