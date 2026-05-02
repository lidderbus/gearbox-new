// src/utils/__tests__/imoComplianceEngine.test.js
// B4 IMO 合规 facade 单测
import {
  calculateEEDI,
  evaluateCompliance,
  generateRecommendations,
  getSupportedShipTypes
} from '../imoComplianceEngine';

describe('imoComplianceEngine', () => {
  describe('calculateEEDI', () => {
    it('Capesize 散货船 + MAN 6G70 工况下 EEDI Phase 3 系数=30%', () => {
      const result = calculateEEDI({
        shipType: 'bulkCarrier',
        installedPower: 13800,
        capacity: 180000,
        referenceSpeed: 14.5,
        fuelType: 'HFO'
      });
      expect(result.success).toBe(true);
      expect(result.indicator).toBe('EEDI');
      expect(result.reductionFactor).toBe(30);
      expect(result.standard).toMatch(/Phase 3/);
      expect(typeof result.attainedEEDI).toBe('number');
      expect(typeof result.requiredEEDI).toBe('number');
    });

    it('集装箱船 EEDI Phase 3 = 50% 削减', () => {
      const result = calculateEEDI({
        shipType: 'containerShip',
        installedPower: 30000,
        capacity: 80000,
        referenceSpeed: 22,
        fuelType: 'HFO'
      });
      expect(result.success).toBe(true);
      expect(result.reductionFactor).toBe(50);
    });

    it('input 不合法时 indicator 仍为 EEDI', () => {
      const result = calculateEEDI({ installedPower: 0 });
      expect(result.success).toBe(false);
      expect(result.indicator).toBe('EEDI');
    });
  });

  describe('evaluateCompliance', () => {
    it('给定 engineId + 船型 + DWT + Vref 返回 EEXI + recommendations', () => {
      const result = evaluateCompliance({
        shipType: 'bulkCarrier',
        dwt: 180000,
        referenceSpeed: 14.5,
        engineId: 'man-l27-38-9l',
        fuelType: 'HFO'
      });
      expect(result.success).toBe(true);
      expect(result.eexi).toBeDefined();
      expect(result.eexi.success).toBe(true);
      expect(result.engine).toEqual(expect.objectContaining({
        id: 'man-l27-38-9l',
        brand: 'MAN',
        model: '9L27/38'
      }));
      expect(result.effectivePropulsionPower).toBe(Math.round(3060 * 0.985));
      expect(result.imoVersion).toMatch(/MEPC/);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('evaluateEEDI=true 时同时返回 EEDI', () => {
      const result = evaluateCompliance({
        shipType: 'tanker',
        dwt: 100000,
        referenceSpeed: 14,
        installedPower: 10000,
        evaluateEEDI: true
      });
      expect(result.eedi).toBeDefined();
      expect(result.eedi.indicator).toBe('EEDI');
    });

    it('提供年消耗 + 里程时返回 CII', () => {
      const result = evaluateCompliance({
        shipType: 'bulkCarrier',
        dwt: 180000,
        referenceSpeed: 14.5,
        installedPower: 13800,
        annualFuelConsumption: 8500,
        annualDistance: 80000
      });
      expect(result.cii).toBeDefined();
      expect(result.cii.success).toBe(true);
      expect(['A', 'B', 'C', 'D', 'E']).toContain(result.cii.rating);
    });

    it('无 engineId + 无 installedPower 时 success=false', () => {
      const result = evaluateCompliance({
        shipType: 'tanker',
        dwt: 100000,
        referenceSpeed: 14
      });
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/installedPower|engineId/);
    });

    it('齿轮箱效率 0.985 应用到 effectivePropulsionPower', () => {
      const result = evaluateCompliance({
        shipType: 'tanker',
        dwt: 50000,
        referenceSpeed: 14,
        installedPower: 10000,
        gearboxEfficiency: 0.95
      });
      expect(result.effectivePropulsionPower).toBe(9500);
    });
  });

  describe('generateRecommendations', () => {
    it('EEXI 不合规且 reductionNeeded < 10% 推荐 EPL', () => {
      const eexi = { success: true, compliant: false, reductionNeeded: 5 };
      const recs = generateRecommendations({ eexi });
      expect(recs.some(r => r.action.includes('EPL'))).toBe(true);
      expect(recs.some(r => r.priority === 'medium')).toBe(true);
    });

    it('EEXI 不合规且 reductionNeeded > 20% 推荐换主机', () => {
      const eexi = { success: true, compliant: false, reductionNeeded: 25 };
      const recs = generateRecommendations({ eexi });
      expect(recs.some(r => r.action.includes('主机') || r.action.includes('双燃料'))).toBe(true);
      expect(recs.some(r => r.priority === 'critical')).toBe(true);
    });

    it('CII = D 时推荐 SEEMP Part III', () => {
      const cii = { success: true, rating: 'D' };
      const recs = generateRecommendations({ cii });
      expect(recs.some(r => r.detail.includes('SEEMP') || r.detail.includes('降速'))).toBe(true);
    });

    it('CII = E 时推荐强制改进', () => {
      const cii = { success: true, rating: 'E' };
      const recs = generateRecommendations({ cii });
      expect(recs.some(r => r.priority === 'critical')).toBe(true);
    });

    it('全合规无推荐', () => {
      const eexi = { success: true, compliant: true, reductionNeeded: 0 };
      const cii = { success: true, rating: 'A' };
      const recs = generateRecommendations({ eexi, cii });
      expect(recs).toEqual([]);
    });
  });

  describe('getSupportedShipTypes', () => {
    it('返回非空船型列表', () => {
      const types = getSupportedShipTypes();
      expect(types.length).toBeGreaterThan(5);
      expect(types[0]).toEqual(expect.objectContaining({
        key: expect.any(String),
        nameZh: expect.any(String),
        nameEn: expect.any(String)
      }));
    });
  });
});
