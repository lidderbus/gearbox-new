/**
 * 64TEU端到端验证 v2 — 修正直径+η换算系数扫描
 *
 * 修正点:
 * 1. 中间轴实际直径dmin=120mm (计算资料), 不是COMPASS等效系统的d=102
 * 2. 扫描η换算系数, 找最佳匹配COMPASS的值
 *
 * COMPASS基准: 1500rpm IS=3.072, PS=3.060 N/mm²
 */

const PI = Math.PI;

// ---- 核心计算 (同verify-e2e-64teu.mjs) ----
function calcResidualTorque(units, omega) {
  let theta = 1.0, T = 0;
  for (let i = 0; i < units.length; i++) {
    T += omega * omega * units[i].inertia * theta;
    if (i < units.length - 1 && units[i].torsionalFlexibility > 0)
      theta -= units[i].torsionalFlexibility * 1e-10 * T;
  }
  return T;
}

function bisect(units, fLow, fHigh) {
  let low = fLow, high = fHigh;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    if (calcResidualTorque(units, 2*PI*mid) * calcResidualTorque(units, 2*PI*low) < 0) high = mid;
    else low = mid;
    if (high - low < 0.001) break;
  }
  return (low + high) / 2;
}

function solveFreqs(units, fMin, fMax, n) {
  const freqs = [];
  let prev = calcResidualTorque(units, 2*PI*fMin);
  for (let f = fMin + 0.1; f <= fMax && freqs.length < n; f += 0.1) {
    const r = calcResidualTorque(units, 2*PI*f);
    if (prev * r < 0) freqs.push(bisect(units, f-0.1, f));
    prev = r;
  }
  return freqs;
}

function calcModeShape(units, freq) {
  const omega = 2*PI*freq, n = units.length;
  const phi = []; let theta = 1.0, T = 0;
  for (let i = 0; i < n; i++) {
    phi.push(theta);
    T += omega*omega * units[i].inertia * theta;
    if (i < n-1 && units[i].torsionalFlexibility > 0)
      theta -= units[i].torsionalFlexibility * 1e-10 * T;
  }
  const mx = Math.max(...phi.map(Math.abs));
  return phi.map(v => v/mx);
}

function calcStress(torque, d_mm) {
  const d = d_mm / 1000;
  return Math.abs(torque / (PI * d*d*d / 16) / 1e6);
}

// ---- 系统定义 ----
const UNITS = [
  { unitNumber:1, type:'motor',    speedRatio:1.0,   inertia:1.350,  torsionalFlexibility:5434.78 },
  { unitNumber:2, type:'coupling', speedRatio:1.0,   inertia:1.540,  torsionalFlexibility:389105.06 },
  { unitNumber:3, type:'gear',     speedRatio:1.0,   inertia:0.3436, torsionalFlexibility:7677.54 },
  { unitNumber:4, type:'gear',     speedRatio:1.0,   inertia:0.0282, torsionalFlexibility:0 },
  { unitNumber:5, type:'gear',     speedRatio:5.048, inertia:0.1344, torsionalFlexibility:62111.80 },
  { unitNumber:6, type:'shaft',    speedRatio:5.048, inertia:0.0133, torsionalFlexibility:60679.61 },
  { unitNumber:7, type:'shaft',    speedRatio:5.048, inertia:0.0481, torsionalFlexibility:456621.00 },
  { unitNumber:8, type:'propeller',speedRatio:5.048, inertia:0.9918, torsionalFlexibility:0 }
];

const POWER = 249, RATED = 1500, RATIO = 5.048;
const IS_D = 120, PS_D = 120; // 计算资料: 两轴dmin=120mm
const isSegIdx = 5, psSegIdx = 6;
const isK = 1/(UNITS[isSegIdx].torsionalFlexibility*1e-10);
const psK = 1/(UNITS[psSegIdx].torsionalFlexibility*1e-10);

// 模态
const freqs = solveFreqs(UNITS, 0.1, 600, 5);
const modes = freqs.map(f => ({ freq: f, omega: 2*PI*f, phi: calcModeShape(UNITS, f) }));

// COMPASS基准
const REF = { 300:{is:0.056,ps:0.057}, 600:{is:0.254,ps:0.256}, 900:{is:0.700,ps:0.705},
              1200:{is:1.855,ps:1.858}, 1500:{is:3.072,ps:3.060}, 1642:{is:3.375,ps:3.351} };

// ---- η扫描 ----
console.log('=== η换算系数扫描 (寻找最佳匹配COMPASS) ===\n');
console.log('η_eff    ζ₁      Q₁     300rpm   600rpm   1200rpm  1500rpm  1642rpm  RMSE');

const etaFactors = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.15];

for (const etaEff of etaFactors) {
  // 模态阻尼 (仅联轴器, 不含螺旋桨阻尼)
  const n = UNITS.length;
  const segs = [];
  for (let i = 0; i < n-1; i++) {
    const c = UNITS[i].torsionalFlexibility;
    if (c > 0) segs.push({ idx:i, K:1/(c*1e-10), isC: UNITS[i].type==='coupling' });
  }

  const dampingRatios = modes.map(mode => {
    const {phi, omega} = mode;
    let Ut=0, Uc=0;
    for (const s of segs) {
      if (s.idx >= phi.length || s.idx+1 >= phi.length) continue;
      const dp = phi[s.idx] - phi[s.idx+1];
      const U = 0.5 * s.K * dp*dp;
      Ut += U; if (s.isC) Uc += U;
    }
    const zC = etaEff * Uc / (2 * Ut);
    return Math.max(0.001, 0.005 + zC);
  });

  // 各速度点应力
  const results = {};
  for (const speed of [300, 600, 900, 1200, 1500, 1642]) {
    const pAtSpeed = POWER * Math.pow(speed/RATED, 3);
    const Tmean = 9550 * pAtSpeed / speed;

    // 叶片次 (主导)
    const mu4 = 0.06;
    const excT = new Array(8).fill(0); excT[7] = Tmean * mu4;
    const fExc = 4 * speed / (60 * RATIO);
    const omegaExc = 2*PI*fExc;

    const resp = new Array(8).fill(0);
    for (let mi = 0; mi < modes.length; mi++) {
      const {phi, omega} = modes[mi];
      let Mr=0; for (let i=0;i<n;i++) Mr += UNITS[i].inertia * phi[i]*phi[i];
      if (Mr<=0) Mr=1;
      let Fr=0; for (let i=0;i<n;i++) Fr += phi[i] * excT[i];
      const r = omegaExc/omega, z = dampingRatios[mi];
      const H = 1/Math.sqrt((1-r*r)*(1-r*r) + (2*z*r)*(2*z*r));
      const q = Fr * H / (omega*omega*Mr);
      for (let i=0;i<n;i++) resp[i] += phi[i]*q;
    }

    const isT = isK * Math.abs(resp[isSegIdx]-resp[isSegIdx+1]) * RATIO;
    const psT = psK * Math.abs(resp[psSegIdx]-resp[psSegIdx+1]) * RATIO;
    results[speed] = { is: calcStress(isT, IS_D), ps: calcStress(psT, PS_D) };
  }

  // RMSE vs COMPASS (中间轴)
  let sse = 0, cnt = 0;
  for (const [spd, ref] of Object.entries(REF)) {
    const r = results[parseInt(spd)];
    if (r) { sse += (r.is - ref.is)**2; cnt++; }
  }
  const rmse = Math.sqrt(sse/cnt);

  console.log(
    `${etaEff.toFixed(2).padStart(5)}   ${dampingRatios[0].toFixed(3).padStart(6)}  ${(1/(2*dampingRatios[0])).toFixed(1).padStart(5)}` +
    `   ${results[300]?.is.toFixed(3).padStart(7)}  ${results[600]?.is.toFixed(3).padStart(7)}` +
    `  ${results[1200]?.is.toFixed(3).padStart(7)}  ${results[1500]?.is.toFixed(3).padStart(7)}` +
    `  ${results[1642]?.is.toFixed(3).padStart(7)}   ${rmse.toFixed(3)}`
  );
}

console.log('                                                                   ');
console.log('COMPASS基准:            0.056    0.254    1.855    3.072    3.375');
console.log('');
console.log('注: IS和PS均使用d=120mm (计算资料dmin), 仅叶片次激励(主导), 不含螺旋桨阻尼');
