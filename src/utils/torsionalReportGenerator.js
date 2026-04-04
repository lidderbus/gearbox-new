/**
 * COMPASS格式扭振计算书生成器
 *
 * 输出格式严格对齐 CCS COMPASS SRM09(Ver.2010)
 * 8页结构: 封面 → 布置数据 → 当量图+Holzer表 → 合成数据表 → 叶片次表
 *        → 应力曲线 → 扭矩曲线 → 结论
 *
 * v2.0 (2026-04-04) 基于64TEU电池动力船COMPASS对比校准
 */

import { getStandard } from '../data/torsionalStandardsDB';

// ============================================================
// 主入口
// ============================================================

export function buildProfessionalReportData({ systemInput, freeVibration, forcedVibration, standardCode, projectInfo }) {
  const std = getStandard(standardCode || 'CCS_INLAND_2016');
  return {
    projectInfo: {
      projectName: projectInfo?.projectName || '船舶轴系扭振计算书',
      controlNumber: projectInfo?.controlNumber || '',
      shipName: projectInfo?.shipName || '',
      designOrg: projectInfo?.designOrg || '',
      manufacturer: projectInfo?.manufacturer || '',
      calculator: projectInfo?.calculator || '',
      date: new Date().toLocaleDateString('zh-CN'),
      ...projectInfo
    },
    standard: std,
    standardCode: standardCode || 'CCS_INLAND_2016',
    systemInput: systemInput || {},
    freeVibration: freeVibration || {},
    forcedVibration: forcedVibration || {},
  };
}

// ============================================================
// COMPASS格式报告HTML
// ============================================================

function generateReportHTML(data) {
  const { projectInfo, standard, systemInput, freeVibration, forcedVibration } = data;
  const ps = systemInput.powerSource || {};
  const prop = systemInput.propeller || {};
  const units = systemInput.units || [];
  const layout = systemInput.systemLayout || {};
  const nfs = freeVibration.naturalFrequencies || [];
  const fv = forcedVibration;
  const combined = fv?.combinedResults || [];
  const allowable = fv?.allowableStress || {};
  const verification = fv?.verification || {};

  // 齿轮减速比
  const gearRatio = layout.gearRatio || (units.find(u => u.speedRatio > 1)?.speedRatio) || 1;

  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<title>${esc(projectInfo.projectName)}</title>
<style>${CSS}</style>
</head><body>
${pageCover(projectInfo)}
${pageSystemLayout(ps, prop, layout, units, gearRatio)}
${pageEquivalentSystem(units, nfs)}
${pageForcedCombined(combined, gearRatio)}
${pageForcedBladePass(combined, prop, gearRatio)}
${pageStressCurves(combined, allowable, gearRatio)}
${pageTorqueCurves(combined, allowable)}
${pageConclusion(verification, allowable, nfs, combined, ps, gearRatio)}
</body></html>`;
}

// ============================================================
// 第1页 封面
// ============================================================
function pageCover(info) {
  return `
  <div class="page cover">
    <div class="cover-title">
      <h1>解析法轴系扭转振动计算</h1>
      <p class="subtitle">SRM09( Ver.2010 )</p>
    </div>
    <table class="cover-info">
      <tr><td class="label">控 制 号：</td><td>${esc(info.controlNumber)}</td></tr>
      <tr><td class="label">船　　名：</td><td>${esc(info.shipName || info.projectName)}</td></tr>
      <tr><td class="label">设计单位：</td><td>${esc(info.designOrg)}</td></tr>
      <tr><td class="label">制 造 厂：</td><td>${esc(info.manufacturer)}</td></tr>
      <tr><td class="label">计　　算：</td><td>${esc(info.calculator)}</td></tr>
      <tr><td class="label">建模日期：</td><td>${info.date}</td></tr>
      <tr><td class="label">计算日期：</td><td>${info.date}</td></tr>
    </table>
    <div class="cover-footer">杭州前进齿轮箱选型系统</div>
  </div>`;
}

// ============================================================
// 第2页 轴系布置及航区数据
// ============================================================
function pageSystemLayout(ps, prop, layout, units, gearRatio) {
  // 查找弹性联轴器
  const coupling = units.find(u => u.type === 'coupling');
  const intShaftIdx = layout.intermediateShaftUnit || units.findIndex(u => u.name?.includes('中间') || u.name?.includes('I.S.'));

  return `
  <div class="page">
    <h2>轴 系 布 置 及 航 区 数 据</h2>
    <table class="layout-table">
      <tr><td>主 机 类 型</td><td>：</td><td>${ps.type === 'diesel' ? '柴油机' : '电动机'}</td></tr>
      <tr><td>主 机 数 量</td><td>：</td><td>1</td></tr>
      <tr><td>轴系总质量数</td><td>：</td><td>${units.length}</td></tr>
      <tr><td>轴系总分支点</td><td>：</td><td>0</td></tr>
      <tr><td>中间轴所处单元号</td><td>：</td><td>${intShaftIdx >= 0 ? intShaftIdx + 1 : '-'}</td></tr>
      <tr><td>中间轴抗拉强度（M.Pa）</td><td>：</td><td>${layout.intermediateShaftTensileStrength || 520}</td></tr>
      <tr><td>中间轴联接型式</td><td>：</td><td>${coupling ? '弹性联轴器' : '整体联接法兰'}</td></tr>
      <tr><td>动 力 装 置</td><td>：</td><td>螺旋桨</td></tr>
      <tr><td>冰 区 状 况</td><td>：</td><td>${layout.iceClass || '无冰区'}</td></tr>
    </table>

    <h3>${ps.type === 'diesel' ? '柴 油 机' : '电 动 机'} 数 据</h3>
    <table class="layout-table">
      <tr><td>制 造 厂</td><td>：</td><td>${esc(ps.manufacturer || '')}</td></tr>
      <tr><td>型号</td><td>：</td><td>${esc(ps.model || '')}</td></tr>
      <tr><td>所处单元号</td><td>：</td><td>1</td></tr>
      <tr><td>额定功率 (kW)</td><td>：</td><td>${ps.ratedPower || '-'}</td></tr>
      <tr><td>额定转速 (rpm)</td><td>：</td><td>${ps.ratedSpeed || '-'}</td></tr>
    </table>

    <h3>螺 旋 桨 数 据</h3>
    <table class="layout-table">
      <tr><td>类型</td><td>：</td><td>${prop.type || '定距桨'}</td></tr>
      <tr><td>桨叶数</td><td>：</td><td>${prop.bladeCount || 4}</td></tr>
      <tr><td>螺旋桨所处单元号</td><td>：</td><td>${units.length}</td></tr>
      <tr><td>螺旋桨轴抗拉强度 (M.Pa)</td><td>：</td><td>${prop.shaftTensileStrength || 520}</td></tr>
      <tr><td>考虑螺旋桨激励</td><td>：</td><td>${prop.considerPropellerExcitation !== false ? '是' : '否'}</td></tr>
    </table>

    ${gearRatio > 1 ? `
    <h3>齿 轮 啮 合 数 据</h3>
    <table class="layout-table">
      <tr><td>当前啮合齿轮级数</td><td>：</td><td>1</td></tr>
      <tr><td>速比</td><td>：</td><td>${gearRatio.toFixed(3)}</td></tr>
    </table>` : ''}

    ${coupling ? `
    <h3>弹 性 联 轴 器 数 据</h3>
    <table class="layout-table">
      <tr><td>联轴器所处单元号</td><td>：</td><td>${units.indexOf(coupling) + 1}</td></tr>
      <tr><td>阻尼系数</td><td>：</td><td>${coupling.dampingCoeff || '-'}</td></tr>
      <tr><td>持续许用扭矩（KNm）</td><td>：</td><td>${coupling.maxContinuousTorque || '-'}</td></tr>
      <tr><td>瞬时许用扭矩（KNm）</td><td>：</td><td>${coupling.maxTransientTorque || '-'}</td></tr>
    </table>` : ''}
  </div>`;
}

// ============================================================
// 第3页 当量图 + Holzer表
// ============================================================
function pageEquivalentSystem(units, nfs) {
  // 当量图表格
  const eqTable = units.map((u, i) => {
    const sr = u.speedRatio || 1;
    return `<tr>
      <td>${i + 1}</td><td>${sr.toFixed(3)}</td>
      <td>${(u.inertia || 0).toFixed(4)}</td>
      <td>${i < units.length - 1 && u.torsionalFlexibility > 0 ? (u.torsionalFlexibility * 1e-10).toExponential(3) : ''}</td>
      <td>${u.outerDiameter ? u.outerDiameter.toFixed(1) + ' / ' + (u.innerDiameter || 0).toFixed(1) : ''}</td>
    </tr>`;
  }).join('');

  // Holzer表 (最多显示前3阶)
  const holzerSections = nfs.slice(0, 3).map((nf, modeIdx) => {
    const freq = nf.frequency || 0;
    const freqRpm = nf.frequencyRpm || freq * 60;
    const ms = nf.modeShape || {};
    const amps = ms.amplitudes || ms.rawAmplitudes || [];
    const holzer = ms.holzerTable || [];

    let rows = '';
    for (let i = 0; i < units.length; i++) {
      const amp = amps[i] !== undefined ? Number(amps[i]).toExponential(3) : '-';
      const torque = holzer[i]?.torqueKNm !== undefined ? Number(holzer[i].torqueKNm).toExponential(3) : '-';
      const flex = units[i].torsionalFlexibility || 0;
      rows += `<tr>
        <td>${i + 1}</td>
        <td>${(units[i].inertia || 0).toFixed(4)}</td>
        <td>${flex > 0 ? flex.toFixed(4) : '0.0000'}</td>
        <td>${amp}</td>
        <td>${i < units.length - 1 ? torque : ''}</td>
      </tr>`;
    }

    return `
    <h4>${modeIdx + 1}${ordinalSuffix(modeIdx + 1)} 阶固有频率 F = ${freqRpm.toFixed(1)} 1/min or ${freq.toFixed(2)} Hz.</h4>
    <table class="dt compact">
      <thead><tr>
        <th>质量号</th><th>转动惯量<br>(kg·m²)</th><th>扭转柔度<br>(E-10Rad/N.m)</th>
        <th>相对振幅</th><th>振动扭矩<br>(KNm)</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }).join('');

  return `
  <div class="page">
    <h2>轴 系 系 统 当 量 图</h2>
    <p class="note">（轴系数据中已考虑速比的影响）</p>
    <table class="dt compact">
      <thead><tr>
        <th>Mass<br>No.</th><th>Speed<br>Ratio</th><th>Inertia<br>(kgm²)</th>
        <th>Flexibility<br>(rad/N.m)</th><th>Diameter(mm)<br>Outer / Inner</th>
      </tr></thead>
      <tbody>${eqTable}</tbody>
    </table>

    <h2 style="margin-top:30px;">轴系自由振动计算结果（霍尔兹表）</h2>
    ${holzerSections || '<p>暂无数据</p>'}
  </div>`;
}

// ============================================================
// 第4页 强迫振动合成数据表
// ============================================================
function pageForcedCombined(results, gearRatio) {
  if (!results.length) return '<div class="page"><h2>强迫振动计算结果 --- 合成数据</h2><p>暂无数据</p></div>';

  const rows = results.map((r, i) => `<tr>
    <td>${i + 1}</td>
    <td>${r.speed.toFixed(1)}</td>
    <td>${(r.massAmplitude * 180 / Math.PI).toFixed(6)}</td>
    <td>${r.intermediateShaftStress.toFixed(3)}</td>
    <td>${r.propellerShaftStress.toFixed(3)}</td>
    <td>${Array.isArray(r.gearMeshTorques) && r.gearMeshTorques[0] !== undefined ? r.gearMeshTorques[0].toFixed(3) : '0.000'}</td>
    <td>${(r.couplingTorque || 0).toFixed(3)}</td>
  </tr>`).join('');

  return `
  <div class="page">
    <h2>强 迫 振 动 计 算 结 果 --- 合 成 数 据</h2>
    <p class="subtitle2">（ 正 常 工 况 ）</p>
    <table class="dt compass-table">
      <thead><tr>
        <th>No.</th>
        <th>主机转速<br>r/min</th>
        <th>No.1<br>质量振幅<br>deg.</th>
        <th>中间轴<br>扭振应力<br>N/mm²</th>
        <th>螺旋桨轴<br>扭振应力<br>N/mm²</th>
        <th>啮合齿轮<br>振动扭矩<br>k.N.m</th>
        <th>弹性联轴器<br>振动扭矩<br>k.N.m</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="note">Results referred to real speed - 1: ${gearRatio.toFixed(2)}</p>
  </div>`;
}

// ============================================================
// 第5页 叶片次单谐次数据
// ============================================================
function pageForcedBladePass(results, prop, gearRatio) {
  if (!results.length) return '';

  // 叶片次数据在harmonicResults中
  const bladeCount = prop?.bladeCount || 4;
  const rows = results.map((r, i) => {
    // 尝试找叶片次数据
    const bpHarmonic = r.harmonicResults?.find(h => h.isPropellerOrder && h.order === bladeCount);
    const bpAmp = bpHarmonic?.response?.maxAmplitude || 0;
    // 叶片次应力近似等于合成应力(COMPASS验证)
    return `<tr>
      <td>${i + 1}</td>
      <td>${r.speed.toFixed(1)}</td>
      <td>${(bpAmp * 180 / Math.PI).toFixed(6)}</td>
      <td>${r.intermediateShaftStress.toFixed(3)}</td>
      <td>${r.propellerShaftStress.toFixed(3)}</td>
      <td>${Array.isArray(r.gearMeshTorques) && r.gearMeshTorques[0] !== undefined ? r.gearMeshTorques[0].toFixed(3) : '0.000'}</td>
      <td>${(r.couplingTorque || 0).toFixed(3)}</td>
    </tr>`;
  }).join('');

  return `
  <div class="page">
    <h2>强 迫 振 动 计 算 结 果 --- 单 谐 次 数 据</h2>
    <p class="subtitle2">谐 次 = 叶片次 （ 正 常 工 况 ）</p>
    <table class="dt compass-table">
      <thead><tr>
        <th>No.</th>
        <th>主机转速<br>r/min</th>
        <th>No.1<br>质量振幅<br>deg.</th>
        <th>中间轴<br>扭振应力<br>N/mm²</th>
        <th>螺旋桨轴<br>扭振应力<br>N/mm²</th>
        <th>啮合齿轮<br>振动扭矩<br>k.N.m</th>
        <th>弹性联轴器<br>振动扭矩<br>k.N.m</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="note">Results referred to real speed - 1: ${gearRatio.toFixed(2)}</p>
  </div>`;
}

// ============================================================
// 第6页 应力曲线图
// ============================================================
function pageStressCurves(results, allowable, gearRatio) {
  const speeds = results.map(r => r.speed);
  const isStress = results.map(r => r.intermediateShaftStress);
  const psStress = results.map(r => r.propellerShaftStress);
  const Tc_is = allowable.intermediateShaft?.continuous || 0;
  const Tt_is = allowable.intermediateShaft?.transient || 0;
  const Tc_ps = allowable.propellerShaft?.continuous || 0;
  const Tt_ps = allowable.propellerShaft?.transient || 0;

  return `
  <div class="page">
    <h2>中间轴扭转振动应力 （ 主机正常工况 ）</h2>
    <p class="note">Results referred to real speed - 1: ${gearRatio.toFixed(2)}</p>
    <div class="chart-placeholder" id="chart-is">
      <p>许用振动应力: Tc(持续)=${Tc_is.toFixed(1)} N/mm², Tt(瞬时)=${Tt_is.toFixed(1)} N/mm²</p>
      <p>最大应力: ${Math.max(...isStress).toFixed(3)} N/mm² @ ${speeds[isStress.indexOf(Math.max(...isStress))]} rpm</p>
      <canvas id="canvas-is" width="600" height="250"></canvas>
    </div>

    <h2 style="margin-top:30px;">螺旋桨轴扭转振动应力 （ 主机正常工况 ）</h2>
    <div class="chart-placeholder" id="chart-ps">
      <p>许用振动应力: Tc(持续)=${Tc_ps.toFixed(1)} N/mm², Tt(瞬时)=${Tt_ps.toFixed(1)} N/mm²</p>
      <p>最大应力: ${Math.max(...psStress).toFixed(3)} N/mm² @ ${speeds[psStress.indexOf(Math.max(...psStress))]} rpm</p>
      <canvas id="canvas-ps" width="600" height="250"></canvas>
    </div>

    <script>
      (function() {
        var speeds = ${JSON.stringify(speeds)};
        var isS = ${JSON.stringify(isStress)};
        var psS = ${JSON.stringify(psStress)};
        var Tc_is = ${Tc_is}, Tt_is = ${Tt_is};
        var Tc_ps = ${Tc_ps}, Tt_ps = ${Tt_ps};

        function drawChart(canvasId, data, Tc, Tt, title) {
          var c = document.getElementById(canvasId);
          if (!c) return;
          var ctx = c.getContext('2d');
          var W = c.width, H = c.height;
          var mx = 50, my = 20, mxr = 20, mb = 30;
          var pw = W - mx - mxr, ph = H - my - mb;
          var maxS = Math.max(Tt * 1.1, Math.max.apply(null, data) * 1.2, 10);
          var minSpd = Math.min.apply(null, speeds), maxSpd = Math.max.apply(null, speeds);

          // 背景
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

          // 网格
          ctx.strokeStyle = '#ddd'; ctx.lineWidth = 0.5;
          for (var i = 0; i <= 5; i++) {
            var y = my + ph - (i / 5) * ph;
            ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(mx + pw, y); ctx.stroke();
            ctx.fillStyle = '#666'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText((maxS * i / 5).toFixed(1), mx - 5, y + 3);
          }

          // Tc线
          if (Tc > 0) {
            var yTc = my + ph - (Tc / maxS) * ph;
            ctx.strokeStyle = '#28a745'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
            ctx.beginPath(); ctx.moveTo(mx, yTc); ctx.lineTo(mx + pw, yTc); ctx.stroke();
            ctx.fillStyle = '#28a745'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText('Tc=' + Tc.toFixed(1), mx + pw + 2, yTc + 3);
          }
          // Tt线
          if (Tt > 0) {
            var yTt = my + ph - (Tt / maxS) * ph;
            ctx.strokeStyle = '#dc3545'; ctx.setLineDash([5, 3]);
            ctx.beginPath(); ctx.moveTo(mx, yTt); ctx.lineTo(mx + pw, yTt); ctx.stroke();
            ctx.fillStyle = '#dc3545';
            ctx.fillText('Tt=' + Tt.toFixed(1), mx + pw + 2, yTt + 3);
          }

          // 数据线
          ctx.strokeStyle = '#0066cc'; ctx.lineWidth = 1.5; ctx.setLineDash([]);
          ctx.beginPath();
          for (var i = 0; i < speeds.length; i++) {
            var x = mx + ((speeds[i] - minSpd) / (maxSpd - minSpd)) * pw;
            var y = my + ph - (data[i] / maxS) * ph;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // X轴标签
          ctx.fillStyle = '#333'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
          for (var n = minSpd; n <= maxSpd; n += Math.ceil((maxSpd - minSpd) / 6 / 50) * 50) {
            var x = mx + ((n - minSpd) / (maxSpd - minSpd)) * pw;
            ctx.fillText(n.toString(), x, my + ph + 15);
          }
          ctx.fillText('r/min', mx + pw / 2, my + ph + 27);
          ctx.textAlign = 'center';
          ctx.save(); ctx.translate(12, my + ph / 2); ctx.rotate(-Math.PI / 2);
          ctx.fillText('N/mm²', 0, 0); ctx.restore();
        }

        setTimeout(function() {
          drawChart('canvas-is', isS, Tc_is, Tt_is, '中间轴');
          drawChart('canvas-ps', psS, Tc_ps, Tt_ps, '螺旋桨轴');
        }, 100);
      })();
    </script>
  </div>`;
}

// ============================================================
// 第7页 扭矩曲线图
// ============================================================
function pageTorqueCurves(results, allowable) {
  const speeds = results.map(r => r.speed);
  const gearT = results.map(r => Array.isArray(r.gearMeshTorques) && r.gearMeshTorques[0] !== undefined ? r.gearMeshTorques[0] : 0);
  const cplT = results.map(r => r.couplingTorque || 0);

  return `
  <div class="page">
    <h2>齿轮啮合处振动扭矩 （ 主机正常工况 ）</h2>
    <div class="chart-placeholder">
      <p>最大扭矩: ${Math.max(...gearT).toFixed(3)} k.N.m @ ${speeds[gearT.indexOf(Math.max(...gearT))]} rpm</p>
    </div>

    <h2 style="margin-top:30px;">弹性联轴器振动扭矩 （ 主机正常工况 ）</h2>
    <div class="chart-placeholder">
      <p>最大扭矩: ${Math.max(...cplT).toFixed(3)} k.N.m @ ${speeds[cplT.indexOf(Math.max(...cplT))]} rpm</p>
    </div>
  </div>`;
}

// ============================================================
// 第8页 结论与建议
// ============================================================
function pageConclusion(verification, allowable, nfs, results, ps, gearRatio) {
  const isOK = verification.isValid !== false;
  const maxIS = verification.maxIntermediateStress || 0;
  const maxPS = verification.maxPropellerStress || 0;
  const TcIS = allowable.intermediateShaft?.continuous || 0;
  const TcPS = allowable.propellerShaft?.continuous || 0;

  // 共振检查
  const ratedSpeed = ps.ratedSpeed || 1500;
  const bladeCount = 4;
  let resonanceWarnings = [];
  for (const nf of nfs) {
    const fn = nf.frequency || 0;
    // 叶片次共振转速
    const nc = fn * 60 * gearRatio / bladeCount;
    if (Math.abs(nc - ratedSpeed) / ratedSpeed < 0.2) {
      resonanceWarnings.push(`${nfs.indexOf(nf) + 1}阶 × ${bladeCount}次: nc=${nc.toFixed(0)}rpm (工作${ratedSpeed}rpm)`);
    }
  }

  return `
  <div class="page">
    <h2>结 论 与 建 议</h2>

    <h3>分析结论</h3>
    <ol>
      <li>本系统共计算得到${nfs.length}阶固有频率，第1阶固有频率为${nfs[0]?.frequency?.toFixed(2) || '-'} Hz (${(nfs[0]?.frequency * 60)?.toFixed(1) || '-'} 1/min)。</li>
      <li>中间轴最大扭振应力为 ${maxIS.toFixed(3)} N/mm² (@ ${verification.maxIntermediateSpeed || '-'} rpm)，许用值为 ${TcIS.toFixed(2)} N/mm²，
        <strong class="${maxIS <= TcIS ? 'pass' : 'fail'}">${maxIS <= TcIS ? '满足' : '不满足'}CCS规范要求</strong>。</li>
      <li>螺旋桨轴最大扭振应力为 ${maxPS.toFixed(3)} N/mm² (@ ${verification.maxPropellerSpeed || '-'} rpm)，许用值为 ${TcPS.toFixed(2)} N/mm²，
        <strong class="${maxPS <= TcPS ? 'pass' : 'fail'}">${maxPS <= TcPS ? '满足' : '不满足'}CCS规范要求</strong>。</li>
      ${resonanceWarnings.length > 0 ? `<li>⚠ 工作转速范围内存在${resonanceWarnings.length}处共振危险区间，需要注意避开。</li>` : ''}
    </ol>

    <h3>总体评价</h3>
    <div class="conclusion-box ${isOK ? 'pass' : 'fail'}">
      <p><strong>${isOK ? '✓ 本轴系扭振计算满足规范要求' : '⚠ 本轴系扭振计算存在不满足项，请参阅上述具体目。'}</strong></p>
    </div>

    ${(verification.recommendations || []).length > 0 ? `
    <h3>建议</h3>
    <ol>${verification.recommendations.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
    ` : ''}

    <div class="report-footer">
      <p>附注: 本计算采用传递矩阵法(Holzer-Myklestad)，依据CCS《钢质海船入级规范》。</p>
      <p>齿轮箱内部转动惯量为估算值，建议以厂方提供的实测数据校核。</p>
      <p style="margin-top:15px;">报告生成时间: ${new Date().toLocaleString('zh-CN')}</p>
      <p>计算软件: 杭州前进齿轮箱选型系统 v2.0</p>
    </div>
  </div>`;
}

// ============================================================
// 辅助函数
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ordinalSuffix(n) {
  const s = ['', 'ST', 'ND', 'RD'];
  return n <= 3 ? s[n] : 'TH';
}

// ============================================================
// CSS - COMPASS风格
// ============================================================
const CSS = `
body { font-family: 'SimSun', 'Microsoft YaHei', 'Noto Sans SC', sans-serif; font-size: 10.5pt; line-height: 1.5; color: #333; margin: 0; padding: 0; }
.page { padding: 30px 40px; min-height: 100vh; position: relative; }
@media print { .page { page-break-after: always; min-height: auto; } }

/* 封面 */
.cover { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.cover-title h1 { font-size: 22pt; margin-bottom: 10px; letter-spacing: 8px; }
.cover-title .subtitle { font-size: 12pt; color: #666; }
.cover-info { margin-top: 60px; }
.cover-info td { padding: 8px 15px; font-size: 11pt; }
.cover-info .label { text-align: right; color: #555; min-width: 120px; }
.cover-footer { position: absolute; bottom: 40px; font-size: 12pt; font-weight: bold; letter-spacing: 12px; }

/* 布置数据 */
.layout-table { margin: 8px 0 15px 20px; }
.layout-table td { padding: 3px 10px; }
.layout-table td:first-child { min-width: 180px; }

/* 数据表 */
h2 { border-bottom: 2px solid #333; padding-bottom: 6px; margin: 20px 0 10px; font-size: 13pt; letter-spacing: 4px; }
h3 { margin: 15px 0 5px; font-size: 11pt; }
h4 { margin: 12px 0 5px; font-size: 10.5pt; }
.dt { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 9.5pt; }
.dt th, .dt td { border: 1px solid #999; padding: 4px 6px; text-align: center; }
.dt th { background: #f0f0f0; font-weight: bold; font-size: 9pt; }
.dt.compact th, .dt.compact td { padding: 2px 4px; font-size: 8.5pt; }

/* COMPASS数据表 */
.compass-table { font-family: 'Courier New', monospace; font-size: 9pt; }
.compass-table td { text-align: right; padding: 2px 6px; }
.compass-table td:first-child, .compass-table td:nth-child(2) { text-align: center; }

/* 其他 */
.subtitle2 { text-align: center; font-size: 11pt; letter-spacing: 4px; margin: 5px 0 10px; }
.note { font-size: 9pt; color: #666; margin: 5px 0; }
.pass { color: #28a745; } .fail { color: #dc3545; }
.conclusion-box { padding: 15px; border-radius: 6px; text-align: center; margin: 15px 0; font-size: 12pt; }
.conclusion-box.pass { background: #d4edda; border: 2px solid #28a745; }
.conclusion-box.fail { background: #f8d7da; border: 2px solid #dc3545; }
.chart-placeholder { background: #fafafa; border: 1px solid #ddd; padding: 10px; margin: 10px 0; min-height: 150px; }
.report-footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 9pt; color: #666; }
`;

// ============================================================
// 导出
// ============================================================
export async function generateProfessionalReport(reportData, options = {}) {
  const html = generateReportHTML(reportData);
  const filename = options.filename || `扭振计算书_${new Date().toISOString().slice(0, 10)}`;

  if (typeof window !== 'undefined') {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `${filename}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      }).from(element).save();

      document.body.removeChild(element);
      return true;
    } catch (e) {
      console.warn('html2pdf failed, falling back to print:', e);
    }
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
  return true;
}

export default { buildProfessionalReportData, generateProfessionalReport };
