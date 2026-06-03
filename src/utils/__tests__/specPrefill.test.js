// A2 参数透传 — URL 工况解析守卫
import { parseSpecPrefill, SPEC_PREFILL_KEY } from '../specPrefill';

describe('parseSpecPrefill — copilot/中枢 → app 工况透传', () => {
  test('完整参数 power/speed/ratio/prop/application', () => {
    const r = parseSpecPrefill('?power=1500&speed=1500&ratio=4&prop=FPP&application=拖船');
    expect(r).toEqual({ motorPower: 1500, motorSpeed: 1500, targetRatio: 4, propellerType: 'FPP', application: '拖船' });
  });

  test('仅 power/speed/ratio (无 prop/application)', () => {
    expect(parseSpecPrefill('?power=600&speed=1000&ratio=3'))
      .toEqual({ motorPower: 600, motorSpeed: 1000, targetRatio: 3 });
  });

  test('部分参数 — 只给 power 也触发', () => {
    expect(parseSpecPrefill('?power=800')).toEqual({ motorPower: 800 });
  });

  test('小数减速比保留', () => {
    expect(parseSpecPrefill('?power=2000&speed=750&ratio=5.5').targetRatio).toBe(5.5);
  });

  test('无任何数值参数 → null (不触发预填)', () => {
    expect(parseSpecPrefill('?prop=FPP')).toBeNull();
    expect(parseSpecPrefill('?tab=energy')).toBeNull();
    expect(parseSpecPrefill('')).toBeNull();
    expect(parseSpecPrefill('?focus=HC1200')).toBeNull();
  });

  test('NaN / 非法数值被忽略 (不写入脏字段)', () => {
    const r = parseSpecPrefill('?power=abc&speed=1500&ratio=');
    expect(r).toEqual({ motorSpeed: 1500 });
    expect('motorPower' in r).toBe(false);
    expect('targetRatio' in r).toBe(false);
  });

  test('接受 URLSearchParams 入参 (App.js 实际传法)', () => {
    const sp = new URLSearchParams('power=1200&speed=1500&ratio=4.5&prop=CPP');
    expect(parseSpecPrefill(sp)).toEqual({ motorPower: 1200, motorSpeed: 1500, targetRatio: 4.5, propellerType: 'CPP' });
  });

  test('SPEC_PREFILL_KEY 常量稳定 (App.js 写 / InputParametersTab 读 同键)', () => {
    expect(SPEC_PREFILL_KEY).toBe('selection_prefill');
  });

  test('round-trip: 解析 → JSON → 还原 (App.js 写 sessionStorage 的形态)', () => {
    const r = parseSpecPrefill('?power=1500&speed=1500&ratio=4&prop=FPP');
    const restored = JSON.parse(JSON.stringify(r));
    expect(restored).toEqual(r);
    expect(restored.motorPower).toBe(1500);
  });
});
