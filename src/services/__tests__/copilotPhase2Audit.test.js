// src/services/__tests__/copilotPhase2Audit.test.js
// Phase 2 验收: 抽 10 + 全量 86/50 + 非映射 sample 20 验证联轴器+泵推荐
// 数据源: public/copilot-data/*.json (与生产同源 80 联轴器 + 22 泵 + 86+50 映射)

const fs = require('fs');
const path = require('path');

// 静态读真实生产数据
const DATA_DIR = path.join(__dirname, '..', '..', '..', 'public', 'copilot-data');
const couplingsFile = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'copilot-couplings.json'), 'utf8'));
const pumpsFile = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'copilot-pumps.json'), 'utf8'));
const couplingMapFile = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gearbox_to_coupling.json'), 'utf8'));
const pumpMapFile = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gearbox_to_pump.json'), 'utf8'));

const couplings = couplingsFile.data || [];
const pumps = pumpsFile.data || [];
const gbToCoupling = couplingMapFile.mappings || {};
const gbToPump = pumpMapFile.mappings || {};

// 复刻 recommend* 算法 (与 copilotDataLoader.ts:164-237 同源 — 任何修改需同步)
function recommendCoupling(gearboxModel, enginePower, engineSpeed, safetyK = 1.5) {
  const officialModel = gbToCoupling[gearboxModel];
  if (officialModel) {
    const found = couplings.find(c => c.model === officialModel);
    if (found) return { coupling: found, source: 'official' };
  }
  if (enginePower > 0 && engineSpeed > 0) {
    const required = (9.55 * enginePower / engineSpeed) * safetyK / 1000;
    const cand = couplings
      .filter(c => typeof c.torque === 'number' && c.torque >= required)
      .sort((a, b) => (a.torque || 0) - (b.torque || 0));
    if (cand.length > 0) return { coupling: cand[0], source: 'torque-formula' };
  }
  return { coupling: null, source: 'none' };
}

function recommendPump(gearboxModel, centerDistance) {
  const officialModel = gbToPump[gearboxModel];
  if (officialModel) {
    const found = pumps.find(p => p.model === officialModel);
    if (found) return { pump: found, source: 'official' };
  }
  const reverseHit = pumps.find(p =>
    Array.isArray(p.applicableGearbox) && p.applicableGearbox.includes(gearboxModel)
  );
  if (reverseHit) return { pump: reverseHit, source: 'applicable-gearbox' };
  if (typeof centerDistance === 'number' && centerDistance > 0) {
    const targetFlow = centerDistance <= 200 ? 3.3
      : centerDistance <= 320 ? 5
      : centerDistance <= 450 ? 7.5
      : centerDistance <= 600 ? 12
      : 24.8;
    const found = pumps.find(p =>
      typeof p.flow === 'number' && Math.abs(p.flow - targetFlow) < 0.5
    );
    if (found) return { pump: found, source: 'center-distance' };
  }
  return { pump: null, source: 'none' };
}

const SAMPLE_MODELS = [
  'HC1200', 'GWC42.45', '120B', 'HCT1100', 'GCH320',
  'HCM160', 'HCQ40', 'HCAG1090', 'DT900', '2GWH63',
];

// 非映射 sample: 故意不在 86/50 映射表内, 触发 fallback (扭矩公式 / 中心距经验)
const UNMAPPED_SAMPLE = [
  'FAKE_X1', 'FAKE_X2', 'FAKE_X3', 'FAKE_X4', 'FAKE_X5',
  'FAKE_X6', 'FAKE_X7', 'FAKE_X8', 'FAKE_X9', 'FAKE_X10',
  'FAKE_Y1', 'FAKE_Y2', 'FAKE_Y3', 'FAKE_Y4', 'FAKE_Y5',
  'FAKE_Y6', 'FAKE_Y7', 'FAKE_Y8', 'FAKE_Y9', 'FAKE_Y10',
];

describe('Copilot Phase 2 验收: 10 sample + 全量 86/50 映射 + 20 非映射 fallback', () => {
  test('数据完整性: 80 联轴器 + 22 泵 + 86+50 映射 全部 load', () => {
    expect(couplings.length).toBe(80);
    expect(pumps.length).toBe(22);
    expect(Object.keys(gbToCoupling).length).toBeGreaterThanOrEqual(86);
    expect(Object.keys(gbToPump).length).toBeGreaterThanOrEqual(50);
  });

  test('10 sample 联轴器审计 (官方映射 vs 扭矩公式 vs 无)', () => {
    const rows = SAMPLE_MODELS.map(model => {
      const r = recommendCoupling(model, 1500, 1500, 1.5);
      return { model, coupling: r.coupling?.model || '-', torque: r.coupling?.torque ?? '-', source: r.source };
    });
    // eslint-disable-next-line no-console
    console.log('\n=== Copilot Phase 2 联轴器审计 (1500kW @ 1500rpm K=1.5) ===\n' +
      '| model | coupling | torque(kN·m) | source |\n' +
      '|---|---|---|---|\n' +
      rows.map(r => `| ${r.model} | ${r.coupling} | ${r.torque} | ${r.source} |`).join('\n') + '\n'
    );

    const noneCount = rows.filter(r => r.source === 'none').length;
    expect(noneCount).toBeLessThanOrEqual(2);
    const officialCount = rows.filter(r => r.source === 'official').length;
    expect(officialCount).toBeGreaterThanOrEqual(5);
    rows.forEach(r => {
      expect(['official', 'torque-formula', 'none']).toContain(r.source);
    });
  });

  test('10 sample 备用泵审计 (官方映射 vs applicable 反查 vs 中心距经验)', () => {
    const cdMap = {
      'HC1200': 1200, 'GWC42.45': 425, '120B': 120, 'HCT1100': 1100,
      'GCH320': 320, 'HCM160': 160, 'HCQ40': 80, 'HCAG1090': 1090,
      'DT900': 900, '2GWH63': 630,
    };
    const rows = SAMPLE_MODELS.map(model => {
      const r = recommendPump(model, cdMap[model]);
      return { model, pump: r.pump?.model || '-', flow: r.pump?.flow ?? '-', source: r.source };
    });
    // eslint-disable-next-line no-console
    console.log('\n=== Copilot Phase 2 备用泵审计 (按真实中心距) ===\n' +
      '| model | pump | flow(L/min) | source |\n' +
      '|---|---|---|---|\n' +
      rows.map(r => `| ${r.model} | ${r.pump} | ${r.flow} | ${r.source} |`).join('\n') + '\n'
    );

    const hitCount = rows.filter(r => r.source !== 'none').length;
    expect(hitCount).toBeGreaterThanOrEqual(8);
    rows.forEach(r => {
      expect(['official', 'applicable-gearbox', 'center-distance', 'none']).toContain(r.source);
    });
  });

  test('扭矩公式 fallback: 未在 86 映射的虚构 model 不应误命中 official', () => {
    const r = recommendCoupling('FAKE_NOT_IN_MAP_X9', 1500, 1500, 1.5);
    expect(r.source).not.toBe('official');
  });

  test('中心距分桶逻辑覆盖 5 档 (200/320/450/600/>600)', () => {
    const tiers = [
      { cd: 100, expectedFlowAround: 3.3 },
      { cd: 250, expectedFlowAround: 5 },
      { cd: 380, expectedFlowAround: 7.5 },
      { cd: 500, expectedFlowAround: 12 },
      { cd: 800, expectedFlowAround: 24.8 },
    ];
    tiers.forEach(t => {
      const r = recommendPump('UNMAPPED_MODEL', t.cd);
      expect(r.source).toBe('center-distance');
      expect(Math.abs((r.pump?.flow || 0) - t.expectedFlowAround)).toBeLessThan(0.5);
    });
  });

  // 已知孤儿白名单: 杭齿手册 mapping target 缺在 80 联轴器主库 (后续补全自然变绿)
  const KNOWN_ORPHAN_COUPLING_MAPPINGS = {
    'DT770': 'HGTH3.2',
  };

  test('全量审计: 86 联轴器映射 ≥98% 命中 + 孤儿名单与已知白名单一致', () => {
    const allKeys = Object.keys(gbToCoupling);
    expect(allKeys.length).toBeGreaterThanOrEqual(86);

    const rows = allKeys.map(model => {
      const r = recommendCoupling(model, 1500, 1500, 1.5);
      return { model, target: gbToCoupling[model], resolved: r.coupling?.model || '-', source: r.source };
    });

    const officialHits = rows.filter(r => r.source === 'official').length;
    const orphan = rows.filter(r => r.source !== 'official');
    const orphanMap = orphan.reduce((acc, r) => { acc[r.model] = r.target; return acc; }, {});

    // eslint-disable-next-line no-console
    console.log(`\n=== 全量 86 联轴器映射审计 — official 命中率 ${officialHits}/${allKeys.length} (${((officialHits/allKeys.length)*100).toFixed(1)}%) ===`);
    if (orphan.length > 0) {
      // eslint-disable-next-line no-console
      console.log('⚠ 孤儿映射 (target 不在 80 联轴器内):');
      orphan.forEach(r => console.log(`  ${r.model} → ${r.target} [resolved=${r.resolved}, source=${r.source}]`));
    }

    // 命中率 ≥98%
    expect(officialHits / allKeys.length).toBeGreaterThanOrEqual(0.98);
    // 孤儿名单必须等于已知白名单 (新增孤儿 = 测试失败, 缺失孤儿 = 数据已补 → 更新白名单)
    expect(orphanMap).toEqual(KNOWN_ORPHAN_COUPLING_MAPPINGS);
  });

  test('全量审计: 50 泵映射 100% 必须解析到真实 22 泵条目', () => {
    const allKeys = Object.keys(gbToPump);
    expect(allKeys.length).toBeGreaterThanOrEqual(50);

    const rows = allKeys.map(model => {
      const r = recommendPump(model, 500);
      return { model, target: gbToPump[model], resolved: r.pump?.model || '-', source: r.source };
    });

    const officialHits = rows.filter(r => r.source === 'official').length;
    const orphan = rows.filter(r => r.source !== 'official');

    // eslint-disable-next-line no-console
    console.log(`\n=== 全量 50 泵映射审计 — official 命中率 ${officialHits}/${allKeys.length} (${((officialHits/allKeys.length)*100).toFixed(1)}%) ===`);
    if (orphan.length > 0) {
      // eslint-disable-next-line no-console
      console.log('⚠ 孤儿映射 (target 不在 22 泵内):');
      orphan.forEach(r => console.log(`  ${r.model} → ${r.target} [resolved=${r.resolved}, source=${r.source}]`));
    }

    expect(officialHits).toBe(allKeys.length);
  });

  test('全量审计: 80 联轴器内部去重 (model 字段必须唯一)', () => {
    const seen = new Map();
    couplings.forEach(c => {
      seen.set(c.model, (seen.get(c.model) || 0) + 1);
    });
    const dups = Array.from(seen.entries()).filter(([, n]) => n > 1);
    if (dups.length > 0) {
      // eslint-disable-next-line no-console
      console.log('⚠ 联轴器 model 重复:', dups);
    }
    expect(dups.length).toBe(0);
  });

  test('全量审计: 22 泵内部去重 (model 字段必须唯一)', () => {
    const seen = new Map();
    pumps.forEach(p => {
      seen.set(p.model, (seen.get(p.model) || 0) + 1);
    });
    const dups = Array.from(seen.entries()).filter(([, n]) => n > 1);
    if (dups.length > 0) {
      // eslint-disable-next-line no-console
      console.log('⚠ 泵 model 重复:', dups);
    }
    expect(dups.length).toBe(0);
  });

  test('非映射 sample (20): 联轴器全部走扭矩公式 fallback, 不应误命中 official', () => {
    const rows = UNMAPPED_SAMPLE.map(model => {
      const r = recommendCoupling(model, 1500, 1500, 1.5);
      return { model, coupling: r.coupling?.model || '-', source: r.source };
    });

    const officialHits = rows.filter(r => r.source === 'official').length;
    const torqueHits = rows.filter(r => r.source === 'torque-formula').length;
    const noneHits = rows.filter(r => r.source === 'none').length;

    // eslint-disable-next-line no-console
    console.log(`\n=== 非映射 sample(20) 联轴器 fallback — official=${officialHits} / torque=${torqueHits} / none=${noneHits} ===`);

    expect(officialHits).toBe(0);
    expect(torqueHits).toBe(20);  // 1500kW@1500rpm 必有候选
    expect(noneHits).toBe(0);
  });

  test('非映射 sample (20): 泵全部走中心距经验, 不应误命中 official/applicable', () => {
    const cdValues = [100, 150, 180, 220, 280, 300, 350, 400, 450, 500,
                       550, 580, 600, 650, 700, 750, 800, 900, 1000, 1200];
    const rows = UNMAPPED_SAMPLE.map((model, i) => {
      const r = recommendPump(model, cdValues[i]);
      return { model, cd: cdValues[i], pump: r.pump?.model || '-', flow: r.pump?.flow ?? '-', source: r.source };
    });

    const officialHits = rows.filter(r => r.source === 'official').length;
    const applicable = rows.filter(r => r.source === 'applicable-gearbox').length;
    const centerDist = rows.filter(r => r.source === 'center-distance').length;

    // eslint-disable-next-line no-console
    console.log(`\n=== 非映射 sample(20) 泵 fallback — official=${officialHits} / applicable=${applicable} / center-distance=${centerDist} ===`);

    expect(officialHits).toBe(0);
    expect(applicable).toBe(0);
    expect(centerDist).toBe(20);
  });
});
