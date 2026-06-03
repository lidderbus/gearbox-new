// A2 (2026-06-03) 参数透传 — URL 工况参数解析 (纯函数, 可测)
// copilot / 选型中枢 跳转 gearbox-app 时携带 ?power=&speed=&ratio=&prop=&application=,
// App.js 用本函数把 query string 解析成 prefill 对象, 写入 sessionStorage 'selection_prefill',
// InputParametersTab 挂载时读取并经 applyScenarioPreset 回填输入页。
//
// 抽成纯函数便于单测 (NaN 守卫 / 部分参数 / prop/application 透传), 不依赖 DOM。

export const SPEC_PREFILL_KEY = 'selection_prefill';

/**
 * 解析 URL query 中的工况参数为 prefill 对象。
 * @param {string|URLSearchParams} search - location.search 字符串或 URLSearchParams
 * @returns {{motorPower?:number, motorSpeed?:number, targetRatio?:number, propellerType?:string, application?:string}|null}
 *          至少含一个有效数值参数 (power/speed/ratio) 时返回对象, 否则返回 null。
 */
export function parseSpecPrefill(search) {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search || '');
  const num = (k) => {
    const v = parseFloat(params.get(k));
    return Number.isFinite(v) ? v : null;
  };
  const power = num('power');
  const speed = num('speed');
  const ratio = num('ratio');
  // 至少要有一个有效数值参数才算"带了工况", 否则不触发预填
  if (power == null && speed == null && ratio == null) return null;

  const prefill = {};
  if (power != null) prefill.motorPower = power;
  if (speed != null) prefill.motorSpeed = speed;
  if (ratio != null) prefill.targetRatio = ratio;
  const prop = params.get('prop');
  if (prop) prefill.propellerType = prop;
  const app = params.get('application');
  if (app) prefill.application = app;
  return prefill;
}
