// src/utils/__tests__/copilotRules.test.js
// Copilot 选型规则对齐测试 — 5 个 audit case 与 gearbox-copilot.html 行为一致性验证

import {
  inferPropellerType,
  isCPPGearbox,
  applyCopilotHardConstraints,
  findDirectModel,
  COPILOT_RULES,
} from '../copilotRules';

// ============================================================================
// 工具: 构造测试齿轮箱
// ============================================================================

const mk = (overrides = {}) => ({
  model: 'HC400',
  series: 'HC',
  inputSpeedRange: [750, 2100],
  ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
  transferCapacity: [0.15, 0.14, 0.13, 0.12, 0.11],
  thrust: 50,
  weight: 350,
  ...overrides,
});

// ============================================================================
// 1. 船型 → 桨型推断 (R-PROP-INFER)
// ============================================================================

describe('Copilot 规则 R-PROP-INFER: 船型 → 桨型推断', () => {
  test('集装箱 → CPP', () => {
    expect(inferPropellerType(['集装箱'])).toBe('CPP');
  });
  test('LNG 船 → CPP', () => {
    expect(inferPropellerType(['LNG'])).toBe('CPP');
  });
  test('散货船 → CPP', () => {
    expect(inferPropellerType(['散货'])).toBe('CPP');
  });
  test('渔船 → FPP', () => {
    expect(inferPropellerType(['拖网渔船'])).toBe('FPP');
  });
  test('拖船 → FPP', () => {
    expect(inferPropellerType(['拖船'])).toBe('FPP');
  });
  test('内河船 → FPP', () => {
    expect(inferPropellerType(['内河船'])).toBe('FPP');
  });
  test('≥8MW 高功率 → CPP (无关 application)', () => {
    expect(inferPropellerType([], 8000)).toBe('CPP');
    expect(inferPropellerType(['未知船型'], 9000)).toBe('CPP');
  });
  test('未知船型 + 低功率 → null', () => {
    expect(inferPropellerType(['未知'])).toBeNull();
    expect(inferPropellerType([])).toBeNull();
  });
});

// ============================================================================
// 2. isCPPGearbox 判定
// ============================================================================

describe('Copilot 规则 isCPPGearbox: 无离合判定', () => {
  test('GC 系列 → true (model 前缀)', () => {
    expect(isCPPGearbox(mk({ model: 'GCH320', series: 'GCH' }))).toBe(true);
    expect(isCPPGearbox(mk({ model: 'GCS280', series: 'GCS' }))).toBe(true);
  });
  test('GC配变距桨 series → true', () => {
    expect(isCPPGearbox(mk({ model: 'GCH640', series: 'GC配变距桨' }))).toBe(true);
  });
  test('DT 电推 → true', () => {
    expect(isCPPGearbox(mk({ model: 'DT900', series: 'DT' }))).toBe(true);
  });
  test('HC 普通 → false', () => {
    expect(isCPPGearbox(mk({ model: 'HC1200', series: 'HC' }))).toBe(false);
  });
  test('GW 普通 → false', () => {
    expect(isCPPGearbox(mk({ model: 'GWC42.45', series: 'GW' }))).toBe(false);
  });
});

// ============================================================================
// 3. 9 条硬约束
// ============================================================================

describe('Copilot 规则 applyCopilotHardConstraints', () => {
  test('CPP 请求排除非 GC*/DT*', () => {
    const r = applyCopilotHardConstraints(mk({ model: 'HC1200', series: 'HC' }), { propellerType: 'CPP' });
    expect(r.pass).toBe(false);
    expect(r.rejectedRule).toBe(COPILOT_RULES.PROP_CPP);
  });
  test('CPP 请求接受 GC*', () => {
    const r = applyCopilotHardConstraints(mk({ model: 'GCS280', series: 'GCS' }), { propellerType: 'CPP' });
    expect(r.pass).toBe(true);
  });
  test('FPP 请求排除 GC*', () => {
    const r = applyCopilotHardConstraints(mk({ model: 'GCH320', series: 'GCH' }), { propellerType: 'FPP' });
    expect(r.pass).toBe(false);
    expect(r.rejectedRule).toBe(COPILOT_RULES.PROP_FPP);
  });
  test('双机并车 → 仅 2GWH 通过', () => {
    expect(applyCopilotHardConstraints(mk({ model: 'HC1200' }), { twinEngine: true }).pass).toBe(false);
    expect(applyCopilotHardConstraints(mk({ model: '2GWH3140', series: 'other' }), { twinEngine: true }).pass).toBe(true);
  });
  test('双速 → DT 系列通过, HC 排除', () => {
    expect(applyCopilotHardConstraints(mk({ model: 'HC1200', series: 'HC' }), { gearType: '双速' }).pass).toBe(false);
    expect(applyCopilotHardConstraints(mk({ model: 'DT900', series: 'DT' }), { gearType: '双速' }).pass).toBe(true);
    expect(applyCopilotHardConstraints(mk({ model: 'HCS180', series: '船用双速' }), { gearType: '双速' }).pass).toBe(true);
  });
  test('高速 → HCG/HCAG/HCQ 通过, HC 排除', () => {
    expect(applyCopilotHardConstraints(mk({ model: 'HC1200', series: 'HC' }), { gearType: '高速' }).pass).toBe(false);
    expect(applyCopilotHardConstraints(mk({ model: 'HCQ40', series: 'HCQ' }), { gearType: '高速' }).pass).toBe(true);
    expect(applyCopilotHardConstraints(mk({ model: 'HCAG800', series: 'HCAG' }), { gearType: '高速' }).pass).toBe(true);
  });
  test('高速 → 扩展白名单 HCM/HCAM/HCV/HCVG 也通过', () => {
    expect(applyCopilotHardConstraints(mk({ model: 'HCM435', series: 'HCM' }), { gearType: '高速' }).pass).toBe(true);
    expect(applyCopilotHardConstraints(mk({ model: 'HCAM303', series: 'HCAM' }), { gearType: '高速' }).pass).toBe(true);
    expect(applyCopilotHardConstraints(mk({ model: 'HCV120', series: 'HCV' }), { gearType: '高速' }).pass).toBe(true);
    expect(applyCopilotHardConstraints(mk({ model: 'HCVG440', series: 'HCVG' }), { gearType: '高速' }).pass).toBe(true);
    // HCD/HCT/HCS 等非高速系列仍排除
    expect(applyCopilotHardConstraints(mk({ model: 'HCD800', series: 'HCD' }), { gearType: '高速' }).pass).toBe(false);
    expect(applyCopilotHardConstraints(mk({ model: 'HCT1100', series: 'HCT' }), { gearType: '高速' }).pass).toBe(false);
  });
  test('推力下限 ≥120kN, gb=50kN 排除', () => {
    const r = applyCopilotHardConstraints(mk({ thrust: 50 }), { minThrust: 120 });
    expect(r.pass).toBe(false);
    expect(r.rejectedRule).toBe(COPILOT_RULES.THRUST_MIN);
  });
  test('推力 ≥120kN, gb=150kN 通过', () => {
    expect(applyCopilotHardConstraints(mk({ thrust: 150 }), { minThrust: 120 }).pass).toBe(true);
  });
  test('船级社 CCS 必须含 → 不含排除', () => {
    const r = applyCopilotHardConstraints(
      mk({ certifications: ['DNV'] }),
      { classification: 'CCS' }
    );
    expect(r.pass).toBe(false);
    expect(r.rejectedRule).toBe(COPILOT_RULES.CERT_MATCH);
  });
  test('船级社 CCS, gb 含 CCS 通过', () => {
    expect(applyCopilotHardConstraints(
      mk({ certifications: ['CCS', 'DNV'] }),
      { classification: 'CCS' }
    ).pass).toBe(true);
  });
  test('未指定任何约束 → 全通过', () => {
    expect(applyCopilotHardConstraints(mk(), {}).pass).toBe(true);
  });
});

// ============================================================================
// 4. 直接型号 fast path
// ============================================================================

describe('Copilot 规则 R-DIRECT-MODEL: 直接型号查询', () => {
  const stockGearboxes = [
    mk({ model: 'HC1200', series: 'HC' }),
    mk({ model: 'HC400', series: 'HC' }),
    mk({ model: 'GWC42.45', series: 'GW' }),
    mk({ model: 'DT900', series: 'DT' }),
    mk({ model: '120B', series: 'HC' }),
    mk({ model: '06', series: 'other' }),
  ];

  test('"我要选 HC1200 用于集装箱船" → 命中 HC1200', () => {
    const hit = findDirectModel('我要选 HC1200 用于集装箱船', stockGearboxes);
    expect(hit?.model).toBe('HC1200');
  });
  test('长度倒序: HC1200 不应被 HC 误抢 (虽然 HC 不是型号, 这里测 HC400 vs HC1200)', () => {
    const hit = findDirectModel('请推荐 HC1200', stockGearboxes);
    expect(hit?.model).toBe('HC1200');
  });
  test('GWC42.45 (含点号) word boundary 命中', () => {
    const hit = findDirectModel('GWC42.45 报价', stockGearboxes);
    expect(hit?.model).toBe('GWC42.45');
  });
  test('"300 马力" 不应误匹纯数字 model "06"', () => {
    const hit = findDirectModel('300 马力 渔船', stockGearboxes);
    expect(hit).toBeNull();
  });
  test('"DT900 直接型号" 命中', () => {
    const hit = findDirectModel('DT900 直接型号', stockGearboxes);
    expect(hit?.model).toBe('DT900');
  });
  test('空 query → null', () => {
    expect(findDirectModel('', stockGearboxes)).toBeNull();
  });
  test('无任何已知 model → null', () => {
    expect(findDirectModel('需要 8MW 集装箱船', stockGearboxes)).toBeNull();
  });
});
