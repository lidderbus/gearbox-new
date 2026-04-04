/**
 * 强迫振动校准 V2 - 核心修正
 *
 * 关键发现: 螺旋桨叶片次频率 = z × n_prop / 60 = z × n_motor / (60 × i)
 * 在1500rpm时: f = 4 × 1500/(60×5.048) = 19.81 Hz ← 紧邻1阶固有频率18.54Hz!
 *
 * 之前的错误: f = 4 × 1500/60 = 100 Hz (这是把叶片次当作电机侧阶次)
 *
 * 修正:
 * 1. 螺旋桨激励频率 = z × n_motor / (60 × i)
 * 2. 电机激励频率 = order × n_motor / 60
 * 3. 螺旋桨激励扭矩 ∝ n² (螺旋桨定律)
 * 4. 应力 = T_holzer / Wp (直接从Holzer扭矩计算)
 */

const PI = Math.PI;

// COMPASS系统
const UNITS = [
  { name: '电动机',     J: 1.3500, c: 5434.7826,   d: 80,  sr: 1.000 },
  { name: '弹性联轴器', J: 1.5400, c: 389105.0584, d: 0,   sr: 1.000 },
  { name: '输入轴段',   J: 0.3436, c: 7677.5432,   d: 75,  sr: 1.000 },
  { name: '主动齿轮',   J: 0.0282, c: 0,           d: 0,   sr: 1.000 },
  { name: '从动齿轮',   J: 0.1344, c: 62111.8012,  d: 102, sr: 5.048 },
  { name: '中间轴',     J: 0.0133, c: 60679.6117,  d: 120, sr: 5.048 },
  { name: '螺旋桨轴',   J: 0.0481, c: 456621.0046, d: 120, sr: 5.048 },
  { name: '螺旋桨',     J: 0.9918, c: 0,           d: 0,   sr: 5.048 },
];

const I = 5.048; // 总减速比
const N = UNITS.length;

// 基本参数
const POWER = 249;      // kW
const RATED_SPEED = 1500; // rpm (电机)
const BLADE_COUNT = 4;
const DAMPING = 0.02;    // 阻尼比

// T_motor = 9550 × P / n (N·m)
const T_RATED = 9550 * POWER / RATED_SPEED; // = 1585.35 N·m

// ============================================================
// Holzer法
// ============================================================
function holzer(freq) {
  const w2 = (2 * PI * freq) ** 2;
  let th = 1, T = 0;
  const amps = [], torqs = [];
  for (let i = 0; i < N; i++) {
    amps.push(th);
    T += w2 * UNITS[i].J * th;
    torqs.push(T);
    if (i < N - 1 && UNITS[i].c > 0) th -= UNITS[i].c * 1e-10 * T;
  }
  return { amps, torqs, res: T };
}

function findFreqs(fMin, fMax, nModes) {
  const fs = [];
  let pR = null, pF;
  for (let f = fMin; f <= fMax && fs.length < nModes; f += 0.01) {
    const r = holzer(f).res;
    if (pR !== null && pR * r < 0) {
      let lo = pF, hi = f;
      for (let k = 0; k < 100; k++) {
        const mid = (lo + hi) / 2;
        if (holzer(lo).res * holzer(mid).res < 0) hi = mid; else lo = mid;
        if (hi - lo < 1e-7) break;
      }
      fs.push((lo + hi) / 2);
    }
    pR = r; pF = f;
  }
  return fs;
}

// 固有频率和振型
const natFreqs = findFreqs(0.5, 600, 5);
const modes = natFreqs.map(f => holzer(f).amps);

console.log('固有频率:');
natFreqs.forEach((f, i) => console.log(`  ${i + 1}阶: ${f.toFixed(4)} Hz = ${(f * 60).toFixed(1)} rpm`));

// ============================================================
// 强迫振动 - 正确的频率模型
// ============================================================

/**
 * 模态叠加法强迫响应
 *
 * @param {number} speed - 电机转速 rpm
 * @param {number[]} excTorques - 各质量点激励扭矩 N·m (在等效系统中)
 * @param {number} excFreq - 激励频率 Hz
 * @returns {number[]} 各质量点响应振幅 rad
 */
function modalResponse(speed, excTorques, excFreq) {
  const n = N;
  const response = new Array(n).fill(0);

  for (let m = 0; m < natFreqs.length; m++) {
    const phi = modes[m];
    const wn = 2 * PI * natFreqs[m];
    const we = 2 * PI * excFreq;

    // 广义质量
    let Mr = 0;
    for (let i = 0; i < n; i++) Mr += UNITS[i].J * phi[i] ** 2;

    // 广义力
    let Fr = 0;
    for (let i = 0; i < n; i++) Fr += phi[i] * excTorques[i];

    // 放大系数
    const r = we / wn;
    const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * DAMPING * r) ** 2);

    // 模态贡献
    const qr = Fr * H / (wn * wn * Mr);
    for (let i = 0; i < n; i++) response[i] += phi[i] * qr;
  }

  return response;
}

/**
 * 从振幅差计算Holzer扭矩和应力
 */
function calcResults(amps) {
  const results = {};
  for (let i = 0; i < N - 1; i++) {
    if (UNITS[i].c <= 0) continue;
    const K = 1 / (UNITS[i].c * 1e-10);
    const dTh = Math.abs(amps[i] - amps[i + 1]);
    const Teq = K * dTh;

    const isLow = UNITS[i + 1].sr > 1;
    const Treal = Teq * (isLow ? UNITS[i + 1].sr : 1);

    const d = UNITS[i + 1].d || UNITS[i].d;
    let stress = 0;
    if (d > 0) {
      const Wp = PI * (d / 1000) ** 3 / 16;
      stress = Treal / Wp / 1e6;
    }

    results[i] = { from: UNITS[i].name, to: UNITS[i + 1].name, Teq, Treal, d, stress };
  }
  return results;
}

// ============================================================
// 计算: COMPASS方法 (修正后的频率)
// ============================================================

console.log('\n' + '='.repeat(80));
console.log('V2 校准 - 修正螺旋桨叶片次频率');
console.log('='.repeat(80));

// 电机激励阶次和系数 (相对于电机平均扭矩)
const MOTOR_HARMONICS = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };

// 螺旋桨激励系数 (相对于当前转速下的螺旋桨平均扭矩)
// 在等效系统中: T_exc = μ × T_prop / i = μ × T_motor × (n/n_rated)²
const PROP_HARMONICS = { 4: 0.06, 8: 0.02, 12: 0.008 };

function computeAtSpeed(speed) {
  const combinedAmps = new Array(N).fill(0);
  const bladePassAmps = new Array(N).fill(0);

  // 电机激励 (频率 = order × n_motor / 60)
  for (const [order, mu] of Object.entries(MOTOR_HARMONICS)) {
    const q = Number(order);
    const fExc = q * speed / 60;
    const Texc = T_RATED * mu * (speed / RATED_SPEED) ** 2; // 电机扭矩也随转速变
    const F = new Array(N).fill(0);
    F[0] = Texc;

    const resp = modalResponse(speed, F, fExc);
    for (let i = 0; i < N; i++)
      combinedAmps[i] = Math.sqrt(combinedAmps[i] ** 2 + resp[i] ** 2);
  }

  // 螺旋桨激励 (频率 = z × n_prop / 60 = z × n_motor / (60 × i))
  for (const [order, mu] of Object.entries(PROP_HARMONICS)) {
    const z = Number(order); // 叶片倍数 (4, 8, 12 for 4-blade propeller)
    // ★ 关键修正: 频率基于螺旋桨转速 ★
    const fExc = z * speed / (60 * I);

    // 激励扭矩 ∝ n² (螺旋桨定律), 在等效系统中已折算
    const Texc = T_RATED * mu * (speed / RATED_SPEED) ** 2;
    const F = new Array(N).fill(0);
    F[N - 1] = Texc; // 作用在螺旋桨位置

    const resp = modalResponse(speed, F, fExc);
    for (let i = 0; i < N; i++)
      combinedAmps[i] = Math.sqrt(combinedAmps[i] ** 2 + resp[i] ** 2);

    if (z === BLADE_COUNT) {
      for (let i = 0; i < N; i++) bladePassAmps[i] = Math.abs(resp[i]);
    }
  }

  return { combinedAmps, bladePassAmps };
}

// 验证关键转速
console.log('\n▶ 叶片次频率验证:');
for (const spd of [150, 750, 1112, 1500, 1800]) {
  const fBP = BLADE_COUNT * spd / (60 * I);
  const r1 = fBP / natFreqs[0];
  console.log(`  ${spd}rpm: f_BP=${fBP.toFixed(2)}Hz, r₁=${r1.toFixed(3)} (vs fn1=${natFreqs[0].toFixed(2)}Hz) ${Math.abs(r1 - 1) < 0.2 ? '★ 近共振!' : ''}`);
}

// COMPASS参考数据
const COMPASS = [
  { spd: 150,  amp: 0.099598, bp_amp: 0.019732, isS: 0.014, psS: 0.014, gT: 0.001, cT: 0.001 },
  { spd: 300,  amp: 0.102521, bp_amp: 0.020311, isS: 0.056, psS: 0.057, gT: 0.004, cT: 0.003 },
  { spd: 666,  amp: 0.120218, bp_amp: 0.023817, isS: 0.317, psS: 0.321, gT: 0.021, cT: 0.019 },
  { spd: 910,  amp: 0.145007, bp_amp: 0.028728, isS: 0.700, psS: 0.705, gT: 0.046, cT: 0.042 },
  { spd: 1112, amp: 0.178767, bp_amp: 0.035417, isS: 1.260, psS: 1.265, gT: 0.082, cT: 0.077 },
  { spd: 1337, amp: 0.230166, bp_amp: 0.045599, isS: 2.278, psS: 2.277, gT: 0.150, cT: 0.142 },
  { spd: 1500, amp: 0.252586, bp_amp: 0.050041, isS: 3.072, psS: 3.060, gT: 0.204, cT: 0.196 },
  { spd: 1642, amp: 0.236805, bp_amp: 0.046915, isS: 3.375, psS: 3.351, gT: 0.225, cT: 0.220 },
  { spd: 1800, amp: 0.195151, bp_amp: 0.038663, isS: 3.255, psS: 3.221, gT: 0.218, cT: 0.218 },
];

// 全转速范围计算
console.log('\n▶ 全转速范围对比 (当前系数):');
console.log('rpm  | 我们BP振幅  | COMPASS_BP  | 比值   | 我们IS应力 | COMPASS_IS | 比值');
console.log('-----|-----------|-------------|--------|----------|------------|------');

for (const ref of COMPASS) {
  const { combinedAmps, bladePassAmps } = computeAtSpeed(ref.spd);
  const str = calcResults(combinedAmps);

  const ourBP = bladePassAmps[0] * 180 / PI;
  const isStr = str[5]?.stress || str[4]?.stress || 0;

  const bpRatio = ref.bp_amp > 0 ? (ourBP / ref.bp_amp).toFixed(2) : '-';
  const isRatio = ref.isS > 0 ? (isStr / ref.isS).toFixed(2) : '-';

  console.log(`${ref.spd.toString().padStart(4)} | ${ourBP.toFixed(6).padStart(9)} | ${ref.bp_amp.toFixed(6).padStart(11)} | ${bpRatio.padStart(6)} | ${isStr.toFixed(4).padStart(8)} | ${ref.isS.toFixed(3).padStart(10)} | ${isRatio.padStart(5)}`);
}

// 逆向校准: 用1500rpm的叶片次振幅校准螺旋桨系数
console.log('\n▶ 校准螺旋桨激励系数:');

// 只算叶片次(z=4)在1500rpm的响应
const fBP_1500 = BLADE_COUNT * 1500 / (60 * I); // = 19.81 Hz
const F_bp = new Array(N).fill(0);
F_bp[N - 1] = T_RATED * 0.06; // 当前系数
const bpResp = modalResponse(1500, F_bp, fBP_1500);
const ourBP_1500 = Math.abs(bpResp[0]) * 180 / PI;
const targetBP_1500 = 0.050041; // COMPASS

const calibCoeff = 0.06 * targetBP_1500 / ourBP_1500;
console.log(`  叶片次频率@1500rpm: ${fBP_1500.toFixed(3)} Hz (1阶fn=${natFreqs[0].toFixed(3)}Hz, r=${(fBP_1500/natFreqs[0]).toFixed(4)})`);
console.log(`  当前叶片次振幅: ${ourBP_1500.toFixed(6)} deg`);
console.log(`  COMPASS叶片次振幅: ${targetBP_1500} deg`);
console.log(`  ➜ 校准后4次系数: ${calibCoeff.toFixed(6)} (原: 0.06)`);

// 用校准系数重新算全范围
const CALIB_PROP = {
  4: calibCoeff,
  8: calibCoeff * 0.02 / 0.06,
  12: calibCoeff * 0.008 / 0.06,
};

function computeCalibrated(speed) {
  const combinedAmps = new Array(N).fill(0);
  const bladePassAmps = new Array(N).fill(0);

  // 电机
  for (const [order, mu] of Object.entries(MOTOR_HARMONICS)) {
    const q = Number(order);
    const fExc = q * speed / 60;
    const Texc = T_RATED * mu * (speed / RATED_SPEED) ** 2;
    const F = new Array(N).fill(0);
    F[0] = Texc;
    const resp = modalResponse(speed, F, fExc);
    for (let i = 0; i < N; i++)
      combinedAmps[i] = Math.sqrt(combinedAmps[i] ** 2 + resp[i] ** 2);
  }

  // 螺旋桨 (校准后)
  for (const [order, mu] of Object.entries(CALIB_PROP)) {
    const z = Number(order);
    const fExc = z * speed / (60 * I);
    const Texc = T_RATED * mu * (speed / RATED_SPEED) ** 2;
    const F = new Array(N).fill(0);
    F[N - 1] = Texc;
    const resp = modalResponse(speed, F, fExc);
    for (let i = 0; i < N; i++)
      combinedAmps[i] = Math.sqrt(combinedAmps[i] ** 2 + resp[i] ** 2);
    if (z === BLADE_COUNT) {
      for (let i = 0; i < N; i++) bladePassAmps[i] = Math.abs(resp[i]);
    }
  }

  return { combinedAmps, bladePassAmps };
}

console.log('\n▶ 校准后全范围对比:');
console.log('rpm  | 我们IS应力 | COMPASS_IS | 比值  | 我们PS应力 | COMPASS_PS | 我们齿轮T | COMPASS齿轮T');
console.log('-----|----------|------------|-------|----------|------------|----------|------------');

for (const ref of COMPASS) {
  const { combinedAmps } = computeCalibrated(ref.spd);
  const str = calcResults(combinedAmps);

  const isStr = str[5]?.stress || 0;  // 中间轴→螺旋桨轴
  const psStr = str[6]?.stress || 0;  // 螺旋桨轴→螺旋桨
  const gearT = str[4]?.Treal || 0;   // 从动齿轮→中间轴

  const isR = ref.isS > 0 ? (isStr / ref.isS).toFixed(2) : '-';

  console.log(`${ref.spd.toString().padStart(4)} | ${isStr.toFixed(4).padStart(8)} | ${ref.isS.toFixed(3).padStart(10)} | ${isR.padStart(5)} | ${psStr.toFixed(4).padStart(8)} | ${ref.psS.toFixed(3).padStart(10)} | ${(gearT/1000).toFixed(4).padStart(8)} | ${ref.gT.toFixed(3).padStart(10)}`);
}

// 输出校准参数
console.log('\n' + '='.repeat(80));
console.log('📋 V2 校准参数');
console.log('='.repeat(80));
console.log(`\n核心修正:`);
console.log(`  ★ 螺旋桨叶片次频率 = z × n_motor / (60 × i)`);
console.log(`  ★ T_mean = 9550 × P / n (不×1000)`);
console.log(`  ★ 激励扭矩 ∝ (n/n_rated)² (螺旋桨定律)`);
console.log(`\n螺旋桨系数 (4叶桨):`);
console.log(`  4次(叶片次): ${calibCoeff.toFixed(6)}`);
console.log(`  8次: ${(calibCoeff * 0.02 / 0.06).toFixed(6)}`);
console.log(`  12次: ${(calibCoeff * 0.008 / 0.06).toFixed(6)}`);
