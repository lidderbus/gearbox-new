// B2 跨系统黄金测试集 — gearbox-app ↔ gearbox-copilot 选型一致性守卫
// ===========================================================================
// golden 数据 (selection-golden-cases.json) 由 erp-dashboard/scripts/gen-selection-golden.js
// 用 headless Chrome 驱动 *真实* gearbox-copilot.html (R7 引擎) 捕获, 是 copilot ground truth。
// 本测试把同一组 (copilot 自己解析出的) 参数喂给 app 的 autoSelectGearbox, 比对排序。
//
// ⚠ 重要事实 (2026-06-03 实测): B1 权重对齐后, 两引擎仍在"权重"之外深度分歧:
//   ① 候选集不同 — copilot 用 products.json 501 (去重/不含部分 P/S/legacy 变体);
//      app 用 embeddedData 544 (含 *P 混动 / *S 双速 / legacy)。
//   ② copilot 有 GW 后缀去重 (C>S>L>H>K>D>Q) + series 硬 gate + 11 维打分;
//      app autoSelectGearbox 无 series 约束项、维度集不同。
//   → 故 *非 directModel* 工况 Top-1 普遍不一致, 属"分工设计"差异 (报告已记), 非 bug。
//
// 因此本测试的守卫策略 (有牙齿但不撒谎):
//   A. directModel 工况 — 两端共享同一确定性 fast-path, Top-1 *必须* 完全一致 (硬断言)。
//   B. 整体一致性 — 测量 Top-1 命中数 / copilot-Top1 落入 app-Top3 数, 断言 *不低于* 记录基线,
//      捕获未来任一端的回归 (变得更不一致就失败)。
//   C. 打印完整分歧表 + 每例疑似原因, 供人工监控。
//
// copilot 引擎合法变更后: 重跑 gen-selection-golden.js 刷新 golden, 再按需调基线常量。
import { autoSelectGearbox } from '../selectionAlgorithm';
import * as embedded from '../../data/embeddedData';
import golden from './selection-golden-cases.json';

const appData = embedded.embeddedGearboxData || embedded.default || embedded;

// 当前实测基线. 守卫"不退步"; 若后续做引擎统一使一致性上升, 同步上调。
// 2026-06-03 B1 对齐后: top1=2 / top3=4。
// 2026-06-03 型号库对账(①): copilot products.json 回填 13 GW 减速比 + 修 HCD2400 功率后, copilot G12
//   Top-1 由 GWC70.82 → GWS66.106 (GW 全档位暴露所致, 数据更准), 不再落入 app G12 Top-3 → top3 4→3。
//   属数据修正的合理副作用 (非 app 回归), 基线随真值下调到 3。directModel 确定性一致仍恒 2。
const BASELINE = {
  top1Match: 2, // directModel ×2 (G07/G08) 确定性一致
  top3Overlap: 3, // copilot-Top1 落入 app-Top3 的例数
};

/** copilot 解析参数 → app autoSelectGearbox requirements (同输入对齐, 不重做解析) */
function mapReq(p) {
  const r = { motorPower: p.power, motorSpeed: p.speed, targetRatio: p.targetRatio };
  if (p.directModel) r.directModelQuery = p.directModel;
  if (p.propellerType === 'CPP') r.seriesRequirements = { propellerType: 'CPP' };
  else if (p.propellerType === 'FPP') r.seriesRequirements = { propellerType: 'FPP' };
  if (p.twinEngine) r.twinEngine = true;
  if (p.application && p.application.length) r.application = p.application;
  return r;
}

function runApp(c) {
  const res = autoSelectGearbox(mapReq(c.parsed), appData);
  return (res.recommendations || []).slice(0, 3).map((x) => x.model);
}

describe('B2 跨系统黄金集: app ↔ copilot 选型一致性', () => {
  // 汇总跑一次, 供多个断言复用
  const rows = golden.cases.map((c) => {
    const appTop = runApp(c);
    const cop1 = c.top[0] && c.top[0].model;
    return {
      id: c.id, desc: c.desc, isDirect: c.isDirectModel,
      cop1, appTop, app1: appTop[0] || '-',
      top1Match: cop1 === appTop[0],
      inTop3: appTop.includes(cop1),
    };
  });

  afterAll(() => {
    const t1 = rows.filter((r) => r.top1Match).length;
    const t3 = rows.filter((r) => r.inTop3).length;
    const fmt = rows.map((r) =>
      `| ${r.id} | ${r.isDirect ? '直查' : '工况'} | ${r.cop1} | ${r.app1} | ` +
      `${r.top1Match ? '✓一致' : r.inTop3 ? '~落Top3' : '✗分歧'} | [${r.appTop.join(', ')}] |`
    ).join('\n');
    // eslint-disable-next-line no-console
    console.log(
      '\n=== B2 app↔copilot 一致性 (golden ' + golden.cases.length + ' 例) ===\n' +
      '| id | 类型 | copilot Top1 | app Top1 | 判定 | app Top3 |\n' +
      '|---|---|---|---|---|---|\n' + fmt +
      `\n--- Top1 完全一致: ${t1}/${rows.length} · copilot-Top1 落入 app-Top3: ${t3}/${rows.length} ` +
      `(基线 ${BASELINE.top1Match}/${BASELINE.top3Overlap}) ---\n` +
      '说明: 非直查工况 Top-1 分歧主要源于候选集(501 vs 544)/GW 去重/series gate/维度集差异, 属分工设计, 详见研究报告。\n'
    );
  });

  test('golden 数据完整可读', () => {
    expect(golden.cases.length).toBeGreaterThanOrEqual(10);
    expect(golden._meta && golden._meta.copilotGearboxCount).toBeGreaterThan(400);
  });

  // A. 确定性守卫: directModel 两端必须 Top-1 一致 (共享 fast-path, 任何分歧=真回归)
  describe('A. directModel 工况 — Top-1 必须一致 (硬断言)', () => {
    const directs = golden.cases.filter((c) => c.isDirectModel);
    test('至少有 directModel 样例', () => expect(directs.length).toBeGreaterThanOrEqual(2));
    directs.forEach((c) => {
      test(`${c.id} ${c.desc}: app Top-1 == copilot ${c.top[0].model}`, () => {
        const appTop = runApp(c);
        expect(appTop[0]).toBe(c.top[0].model);
      });
    });
  });

  // B. 整体一致性不退步守卫
  describe('B. 一致性基线守卫 (不低于记录值)', () => {
    test(`Top-1 完全一致数 ≥ ${BASELINE.top1Match}`, () => {
      const t1 = rows.filter((r) => r.top1Match).length;
      expect(t1).toBeGreaterThanOrEqual(BASELINE.top1Match);
    });
    test(`copilot-Top1 落入 app-Top3 数 ≥ ${BASELINE.top3Overlap}`, () => {
      const t3 = rows.filter((r) => r.inTop3).length;
      expect(t3).toBeGreaterThanOrEqual(BASELINE.top3Overlap);
    });
  });
});
