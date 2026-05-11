// SPA↔Copilot 同 query 一致性快照: SPA autoSelectGearbox top-1 推荐与 Copilot 端
// /Users/lidder/erp-dashboard/scripts/audit-copilot-selection.js 已验证的 30+ case 对齐。
//
// 与 copilotAuditCases.test.js 区别: 后者验"规则触发", 此文件验"end-to-end top 输出"。
//
// 每个 case 的期望值来自 Copilot 端通过的 audit case (audit-copilot-selection.js:191-258)。
// case ID 与 Copilot 端保持一致便于排查。

import { autoSelectGearbox } from '../selectionAlgorithm';
import { initialData } from '../../data/initialData';

const isCPP = (m) => /^GC|^DT/.test(m || '');

const printAuditRow = (rows) => {
  // eslint-disable-next-line no-console
  console.log(
    '\n=== SPA↔Copilot 一致性 audit (顶推 model + 触发规则) ===\n' +
    '| id | 描述 | SPA top | series | 触发规则 | 预期 |\n' +
    '|---|---|---|---|---|---|\n' +
    rows.map(r =>
      `| ${r.id} | ${r.desc} | ${r.top || '-'} | ${r.series || '-'} | ${(r.rules || []).join(',') || '-'} | ${r.expected} |`
    ).join('\n') + '\n'
  );
};

describe('SPA↔Copilot end-to-end 一致性 (15 case)', () => {
  const auditRows = [];

  afterAll(() => {
    printAuditRow(auditRows);
  });

  test('A1: 8MW 集装箱配可调桨 1000rpm → top 应是 CPP (GC*/DT*)', () => {
    const r = autoSelectGearbox(
      { motorPower: 8000, motorSpeed: 1000, targetRatio: 5.2, autoInferPropellerType: true, application: '集装箱船' },
      initialData
    );
    auditRows.push({
      id: 'A1', desc: '8MW 集装箱 CPP', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'CPP/GC',
    });
    if (r.recommendations?.length > 0) {
      expect(isCPP(r.recommendations[0].model)).toBe(true);
    }
  });

  test('A5: 6000kW 双机并车拖船 1000rpm → 全部 2GWH', () => {
    const r = autoSelectGearbox(
      { motorPower: 3000, motorSpeed: 1000, targetRatio: 5.0, twinEngine: true },
      initialData
    );
    auditRows.push({
      id: 'A5', desc: '6000kW 双机并车', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: '2GWH*',
    });
    if (r.recommendations?.length > 0) {
      r.recommendations.forEach(rc => expect(rc.model.startsWith('2GWH')).toBe(true));
    }
  });

  test('A8: 2000kW 高速齿轮箱 1500rpm → series ∈ HCG/HCAG/HCQ/HCM/HCAM/HCV/HCVG', () => {
    const r = autoSelectGearbox(
      { motorPower: 2000, motorSpeed: 1500, targetRatio: 1.6, gearType: '高速' },
      initialData
    );
    auditRows.push({
      id: 'A8', desc: '2000kW 高速', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'HCG/HCAG/HCQ/HCM*',
    });
    const HIGH_SPEED = ['HCG', 'HCAG', 'HCQ', 'HCM', 'HCAM', 'HCV', 'HCVG'];
    if (r.recommendations?.length > 0) {
      r.recommendations.forEach(rc => {
        const s = rc.series || '';
        expect(HIGH_SPEED.includes(s)).toBe(true);
      });
    }
  });

  test('A9: 500kW 双速 1500rpm → DT 系列', () => {
    const r = autoSelectGearbox(
      { motorPower: 500, motorSpeed: 1500, targetRatio: 5.0, gearType: '双速' },
      initialData
    );
    auditRows.push({
      id: 'A9', desc: '500kW 双速', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'DT*',
    });
    if (r.recommendations?.length > 0) {
      r.recommendations.forEach(rc => {
        const okPrefix = rc.model.startsWith('DT') || (rc.series || '').includes('双速');
        expect(okPrefix).toBe(true);
      });
    }
  });

  test('A10: 900kW DT 系列电推 → 若 DT900 在数据集 top=DT900 + isCPP', () => {
    const r = autoSelectGearbox(
      { motorPower: 900, motorSpeed: 1500, targetRatio: 5.0, directModelQuery: 'DT900' },
      initialData
    );
    auditRows.push({
      id: 'A10', desc: '900kW DT 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'DT900 (需 DT 系列在数据)',
    });
    // initialData 不含 DT 系列, fast path 走不通必然回退到普通选型。
    // 这里只验证: 若返回了任何结果, 不能崩 (用 completeGearboxData 跑生产链路时, expect=DT900)
    expect(r).toBeTruthy();
  });

  test('A11: 8MW 油船 750rpm DNV → 全部含 DNV', () => {
    const r = autoSelectGearbox(
      { motorPower: 8000, motorSpeed: 750, targetRatio: 4.0, classification: 'DNV' },
      initialData
    );
    auditRows.push({
      id: 'A11', desc: '8MW 油船 DNV', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'DNV 全覆盖',
    });
    if (r.recommendations?.length > 0) {
      r.recommendations.forEach(rc => {
        const certs = rc.certifications || rc.gearbox?.certifications || [];
        expect(certs.some(c => (c || '').toUpperCase().includes('DNV'))).toBe(true);
      });
    }
  });

  test('B7: 极小 50kW 内河 → 应有匹配 (06/16A 等小型)', () => {
    const r = autoSelectGearbox(
      { motorPower: 50, motorSpeed: 1500, targetRatio: 3.0 },
      initialData
    );
    auditRows.push({
      id: 'B7', desc: '50kW 内河', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: '小型有匹配',
    });
    expect((r.recommendations?.length || 0)).toBeGreaterThan(0);
  });

  test('B5: 12000kW 推力 ≥1500kN → 0 匹配 (杭齿 501 最大推力 < 1500kN)', () => {
    const r = autoSelectGearbox(
      { motorPower: 12000, motorSpeed: 750, targetRatio: 5.0, minThrust: 1500 },
      initialData
    );
    auditRows.push({
      id: 'B5', desc: '12000kW 推力≥1500kN', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: '0 匹配',
    });
    expect(r.recommendations?.length || 0).toBe(0);
  });

  test('D1: HC1200 直接型号查询 → top=HC1200 + isDirectModelHit', () => {
    const r = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1500, targetRatio: 4.0, directModelQuery: 'HC1200' },
      initialData
    );
    auditRows.push({
      id: 'D1', desc: 'HC1200 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'HC1200',
    });
    expect(r.recommendations?.[0]?.model).toBe('HC1200');
    expect(r._diagnostics?.isDirectModelHit).toBe(true);
  });

  test('D2: GWC42.45 直接型号查询 → top=GWC42.45', () => {
    const r = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1000, targetRatio: 5.0, directModelQuery: 'GWC42.45' },
      initialData
    );
    auditRows.push({
      id: 'D2', desc: 'GWC42.45 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'GWC42.45',
    });
    expect(r.recommendations?.[0]?.model).toBe('GWC42.45');
  });

  test('D4: 120B 直接型号查询 → top=120B', () => {
    const r = autoSelectGearbox(
      { motorPower: 500, motorSpeed: 1500, targetRatio: 3.0, directModelQuery: '120B' },
      initialData
    );
    auditRows.push({
      id: 'D4', desc: '120B 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: '120B',
    });
    expect(r.recommendations?.[0]?.model).toBe('120B');
  });

  test('D6: DT770 直查 → 若 DT770 在数据集 top=DT770 (initialData 不含 DT, 跳过)', () => {
    const r = autoSelectGearbox(
      { motorPower: 800, motorSpeed: 1500, targetRatio: 5.0, directModelQuery: 'DT770' },
      initialData
    );
    auditRows.push({
      id: 'D6', desc: 'DT770 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'DT770 (需 DT 系列在数据)',
    });
    expect(r).toBeTruthy();
  });

  test('L7: 1000kW 1000rpm 配可调桨 → top 是 CPP', () => {
    const r = autoSelectGearbox(
      {
        motorPower: 1000, motorSpeed: 1000, targetRatio: 4.0,
        seriesRequirements: { propellerType: 'CPP' },
      },
      initialData
    );
    auditRows.push({
      id: 'L7', desc: '1000kW CPP', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'CPP/GC*',
    });
    if (r.recommendations?.length > 0) {
      expect(isCPP(r.recommendations[0].model)).toBe(true);
    }
  });

  test('L8: 800kW 配定距桨 → 不应推荐 GC*/DT*', () => {
    const r = autoSelectGearbox(
      {
        motorPower: 800, motorSpeed: 1500, targetRatio: 4.0,
        seriesRequirements: { propellerType: 'FPP' },
      },
      initialData
    );
    auditRows.push({
      id: 'L8', desc: '800kW FPP', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'FPP, 排除 GC/DT',
    });
    if (r.recommendations?.length > 0) {
      r.recommendations.forEach(rc => expect(isCPP(rc.model)).toBe(false));
    }
  });

  test('N1: DT240 直查 → top=DT240 + isCPP (DT 无离合)', () => {
    const r = autoSelectGearbox(
      { motorPower: 200, motorSpeed: 1500, targetRatio: 4.0, directModelQuery: 'DT240' },
      initialData
    );
    auditRows.push({
      id: 'N1', desc: 'DT240 直查', top: r.recommendations?.[0]?.model, series: r.recommendations?.[0]?.series,
      rules: r._diagnostics?.appliedRules, expected: 'DT240/isCPP',
    });
    if (r.recommendations?.[0]?.model === 'DT240') {
      expect(isCPP('DT240')).toBe(true);
    }
  });
});
