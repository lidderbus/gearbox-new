// P3-1: ecoStore.js 单元测试
import {
  generateEcoNumber,
  createEco,
  transitionEco,
  listEco,
  getEco,
  removeEco,
  ecoStats,
  ECO_STATES,
} from '../ecoStore';

describe('ecoStore', () => {
  beforeEach(() => {
    // 清空 localStorage 保证测试隔离
    localStorage.clear();
  });

  describe('generateEcoNumber', () => {
    test('generates ECO-YYYY-XXXX format', () => {
      const num = generateEcoNumber();
      expect(num).toMatch(/^ECO-\d{4}-\d{4}$/);
    });

    test('sequence increments', () => {
      const a = generateEcoNumber();
      const b = generateEcoNumber();
      const seqA = parseInt(a.split('-')[2], 10);
      const seqB = parseInt(b.split('-')[2], 10);
      expect(seqB).toBe(seqA + 1);
    });
  });

  describe('createEco', () => {
    test('creates draft with valid input', () => {
      const eco = createEco({
        resourceType: 'manual',
        resourceId: 'HC1000',
        fromVersion: '1.0',
        toVersion: '1.1',
        reason: '修正附录数据错误',
        author: 'tester',
      });
      expect(eco.ecoId).toMatch(/^ECO-\d{4}-\d{4}$/);
      expect(eco.state).toBe('draft');
      expect(eco.history).toHaveLength(1);
      expect(eco.history[0].state).toBe('draft');
    });

    test('rejects missing required fields', () => {
      expect(() => createEco({ resourceType: 'manual' })).toThrow();
      expect(() => createEco({ reason: '只有理由' })).toThrow();
    });
  });

  describe('transitionEco', () => {
    test('draft → submitted is allowed', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      const next = transitionEco(eco.ecoId, 'submitted', 'tester', '提交审核');
      expect(next.state).toBe('submitted');
      expect(next.history).toHaveLength(2);
    });

    test('draft → effective is rejected (must go through submitted+approved)', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      expect(() => transitionEco(eco.ecoId, 'effective', '', '')).toThrow();
    });

    test('full flow: draft → submitted → approved → effective', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      transitionEco(eco.ecoId, 'submitted', '', '');
      transitionEco(eco.ecoId, 'approved', '', '');
      const final = transitionEco(eco.ecoId, 'effective', '', '');
      expect(final.state).toBe('effective');
      expect(final.history).toHaveLength(4);
    });

    test('rejected is terminal (no further transitions)', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      transitionEco(eco.ecoId, 'submitted', '', '');
      transitionEco(eco.ecoId, 'rejected', '', '');
      expect(() => transitionEco(eco.ecoId, 'approved', '', '')).toThrow();
    });

    test('non-existent ECO throws', () => {
      expect(() => transitionEco('ECO-9999-9999', 'submitted', '', '')).toThrow();
    });
  });

  describe('listEco / getEco', () => {
    test('list filters by state', () => {
      const eco1 = createEco({ resourceType: 'manual', resourceId: 'A', reason: 'r' });
      createEco({ resourceType: 'manual', resourceId: 'B', reason: 'r' });
      transitionEco(eco1.ecoId, 'submitted', '', '');

      expect(listEco({ state: 'draft' })).toHaveLength(1);
      expect(listEco({ state: 'submitted' })).toHaveLength(1);
    });

    test('list filters by resourceId', () => {
      createEco({ resourceType: 'manual', resourceId: 'HC1000', reason: 'r' });
      createEco({ resourceType: 'manual', resourceId: 'HC2000', reason: 'r' });
      expect(listEco({ resourceId: 'HC1000' })).toHaveLength(1);
    });

    test('getEco returns specific record', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      const fetched = getEco(eco.ecoId);
      expect(fetched.ecoId).toBe(eco.ecoId);
    });
  });

  describe('removeEco', () => {
    test('removes draft', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      expect(removeEco(eco.ecoId)).toBe(true);
      expect(getEco(eco.ecoId)).toBeNull();
    });

    test('rejects removal of non-draft', () => {
      const eco = createEco({ resourceType: 'manual', resourceId: 'X', reason: 'r' });
      transitionEco(eco.ecoId, 'submitted', '', '');
      expect(() => removeEco(eco.ecoId)).toThrow();
    });
  });

  describe('ecoStats', () => {
    test('counts by state', () => {
      const a = createEco({ resourceType: 'manual', resourceId: 'A', reason: 'r' });
      const b = createEco({ resourceType: 'manual', resourceId: 'B', reason: 'r' });
      transitionEco(b.ecoId, 'submitted', '', '');

      const s = ecoStats();
      expect(s.total).toBe(2);
      expect(s.byState.draft).toBe(1);
      expect(s.byState.submitted).toBe(1);
    });
  });

  describe('ECO_STATES', () => {
    test('all 5 states defined', () => {
      expect(Object.keys(ECO_STATES)).toEqual(
        expect.arrayContaining(['draft', 'submitted', 'approved', 'rejected', 'effective'])
      );
    });

    test('each state has next allowed transitions', () => {
      Object.values(ECO_STATES).forEach(s => {
        expect(Array.isArray(s.next)).toBe(true);
      });
    });
  });
});
