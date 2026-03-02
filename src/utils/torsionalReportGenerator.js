/**
 * 专业扭振计算书生成器 (10章结构)
 * 移植自 erp-dashboard/public/js/report-generator.js
 * 支持PDF导出 (via html2pdf.js)
 */

import { getStandard } from '../data/torsionalStandardsDB';

/**
 * 构建报告数据
 */
export function buildProfessionalReportData({ systemInput, freeVibration, forcedVibration, standardCode, projectInfo }) {
  const std = getStandard(standardCode || 'CCS_INLAND_2016');
  return {
    projectInfo: {
      projectName: projectInfo?.projectName || '船舶轴系扭振计算书',
      shipyard: projectInfo?.shipyard || '',
      hullNo: projectInfo?.hullNo || '',
      docNo: projectInfo?.docNo || '',
      engineer: projectInfo?.engineer || '',
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

/**
 * 生成10章专业报告 HTML
 */
function generateReportHTML(data) {
  const { projectInfo, standard, systemInput, freeVibration, forcedVibration } = data;
  const ps = systemInput.powerSource || {};
  const prop = systemInput.propeller || {};
  const units = systemInput.units || [];
  const nfs = freeVibration.naturalFrequencies || [];
  const fv = forcedVibration;

  const chapter1 = `
    <div class="chapter">
      <h2>第1章 封面</h2>
      <div style="text-align:center; padding:60px 0;">
        <h1 style="font-size:24pt;">${esc(projectInfo.projectName)}</h1>
        <p style="font-size:14pt; margin-top:30px;">基于 ${esc(standard.name)} 规范</p>
        <table style="margin:40px auto; text-align:left;">
          <tr><td style="padding:5px 20px;">船厂:</td><td>${esc(projectInfo.shipyard)}</td></tr>
          <tr><td style="padding:5px 20px;">船号:</td><td>${esc(projectInfo.hullNo)}</td></tr>
          <tr><td style="padding:5px 20px;">文件编号:</td><td>${esc(projectInfo.docNo)}</td></tr>
          <tr><td style="padding:5px 20px;">编制:</td><td>${esc(projectInfo.engineer)}</td></tr>
          <tr><td style="padding:5px 20px;">日期:</td><td>${projectInfo.date}</td></tr>
        </table>
      </div>
    </div>`;

  const chapter2 = `
    <div class="chapter page-break">
      <h2>第2章 已知数据</h2>
      <h3>2.1 主机参数</h3>
      <table class="dt"><thead><tr><th>参数</th><th>符号</th><th>单位</th><th>数值</th></tr></thead><tbody>
        <tr><td>额定功率</td><td>Ne</td><td>kW</td><td>${ps.ratedPower || '-'}</td></tr>
        <tr><td>额定转速</td><td>ne</td><td>r/min</td><td>${ps.ratedSpeed || '-'}</td></tr>
        <tr><td>类型</td><td>-</td><td>-</td><td>${ps.type === 'diesel' ? '柴油机' : '电动机'}</td></tr>
        <tr><td>气缸数</td><td>Z</td><td>-</td><td>${ps.cylinderCount || '-'}</td></tr>
      </tbody></table>
      <h3>2.2 螺旋桨参数</h3>
      <table class="dt"><thead><tr><th>参数</th><th>数值</th></tr></thead><tbody>
        <tr><td>叶片数</td><td>${prop.bladeCount || '-'}</td></tr>
      </tbody></table>
      <h3>2.3 轴系单元数据</h3>
      <table class="dt"><thead><tr><th>#</th><th>名称</th><th>类型</th><th>惯量(kg·m²)</th><th>柔度(×10⁻¹⁰)</th></tr></thead><tbody>
        ${units.map((u, i) => `<tr><td>${i + 1}</td><td>${esc(u.name || '')}</td><td>${u.type || '-'}</td><td>${u.inertia || '-'}</td><td>${u.torsionalFlexibility?.toFixed(4) || '-'}</td></tr>`).join('')}
      </tbody></table>
    </div>`;

  const chapter3 = `
    <div class="chapter page-break">
      <h2>第3章 轴径计算</h2>
      <div class="formula-box">
        <p class="formula">${esc(standard.shaftFormula?.formula || 'd = F × K × [Ne×560/ne/(Rm+160)]^(1/3)')}</p>
      </div>
      <p>按${standard.name}规范计算最小轴径。</p>
    </div>`;

  const chapter4 = `
    <div class="chapter page-break">
      <h2>第4章 联轴器扭矩计算</h2>
      <div class="formula-box">
        <p class="formula">Me = 9550 × Ne / ne (N·m)</p>
      </div>
      ${ps.ratedPower && ps.ratedSpeed ? `<p>Me = 9550 × ${ps.ratedPower} / ${ps.ratedSpeed} = ${(9550 * ps.ratedPower / ps.ratedSpeed).toFixed(1)} N·m</p>` : ''}
    </div>`;

  const chapter5 = `
    <div class="chapter page-break">
      <h2>第5章 等效系统参数</h2>
      <div class="formula-box">
        <p class="formula">K = G × Ip / L = G × πd⁴ / (32L)</p>
        <p class="formula">两质量模型: J_reduced = J₁×J₂/(J₁+J₂)</p>
      </div>
    </div>`;

  const chapter6 = `
    <div class="chapter page-break">
      <h2>第6章 固有频率计算</h2>
      <div class="formula-box">
        <p class="formula">fn = √(K / J_reduced) / (2π) Hz</p>
      </div>
      <table class="dt"><thead><tr><th>阶次</th><th>固有频率(Hz)</th><th>角频率(rad/s)</th></tr></thead><tbody>
        ${nfs.map((nf, i) => `<tr><td>${i + 1}阶</td><td>${(nf.frequency || 0).toFixed(2)}</td><td>${(nf.omega || 0).toFixed(2)}</td></tr>`).join('')}
        ${nfs.length === 0 ? '<tr><td colspan="3">暂无数据</td></tr>' : ''}
      </tbody></table>
    </div>`;

  const chapter7 = `
    <div class="chapter page-break">
      <h2>第7章 激励分析</h2>
      <p>激励阶次: ${(fv?.excitationOrders || []).join(', ') || '-'}</p>
      <div class="formula-box">
        <p class="formula">激励频率: fe = 阶次 × n / 60 (Hz)</p>
      </div>
    </div>`;

  const fz = standard.torsionalVibration?.forbiddenZone;
  const chapter8 = `
    <div class="chapter page-break">
      <h2>第8章 临界转速校核</h2>
      <p>规范要求: 禁区 ${fz ? `${(fz.min * 100).toFixed(0)}%~${(fz.max * 100).toFixed(0)}%` : '80%~105%'} × nc</p>
      <div class="formula-box">
        <p class="formula">nc = fn × 60 / 阶次 (r/min)</p>
      </div>
    </div>`;

  const allowable = fv?.allowableStress || {};
  const verification = fv?.verification || {};
  const chapter9 = `
    <div class="chapter page-break">
      <h2>第9章 应力校核</h2>
      <div class="formula-box">
        <p class="formula">中间轴: T1 = 18 + Rm/36 (N/mm²)</p>
        <p class="formula">螺旋桨轴: T1 = 18√(560/(Rm+160)) + Rm/48</p>
        <p class="formula">瞬态: T2 = T1 × 1.7</p>
      </div>
      <table class="dt"><thead><tr><th>轴段</th><th>最大应力</th><th>T1许用值</th><th>T2许用值</th><th>校核</th></tr></thead><tbody>
        <tr>
          <td>中间轴</td>
          <td>${verification.maxIntermediateStress?.toFixed(3) || '-'} N/mm²</td>
          <td>${allowable.intermediateShaft?.continuous?.toFixed(1) || '-'}</td>
          <td>${allowable.intermediateShaft?.transient?.toFixed(1) || '-'}</td>
          <td class="${verification.maxIntermediateStress <= (allowable.intermediateShaft?.continuous || 999) ? 'pass' : 'fail'}">${verification.maxIntermediateStress <= (allowable.intermediateShaft?.continuous || 999) ? '✓' : '✗'}</td>
        </tr>
        <tr>
          <td>螺旋桨轴</td>
          <td>${verification.maxPropellerStress?.toFixed(3) || '-'} N/mm²</td>
          <td>${allowable.propellerShaft?.continuous?.toFixed(1) || '-'}</td>
          <td>${allowable.propellerShaft?.transient?.toFixed(1) || '-'}</td>
          <td class="${verification.maxPropellerStress <= (allowable.propellerShaft?.continuous || 999) ? 'pass' : 'fail'}">${verification.maxPropellerStress <= (allowable.propellerShaft?.continuous || 999) ? '✓' : '✗'}</td>
        </tr>
      </tbody></table>
    </div>`;

  const overallPass = verification.isValid !== false;
  const chapter10 = `
    <div class="chapter page-break">
      <h2>第10章 结论与建议</h2>
      <div class="conclusion-box ${overallPass ? 'pass' : 'fail'}">
        <p><strong>${overallPass ? '✓ 校核通过' : '✗ 校核未通过'}</strong></p>
        <p>${overallPass ? '轴系扭振分析满足规范要求。' : '存在不满足规范要求的项目，需调整轴系参数。'}</p>
      </div>
      ${(verification.warnings || []).length > 0 ? `
        <h3>注意事项</h3>
        <ul>${verification.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
      ` : ''}
      ${(verification.recommendations || []).length > 0 ? `
        <h3>建议</h3>
        <ol>${verification.recommendations.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
      ` : ''}
      <div class="report-footer">
        <p>报告生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        <p>计算软件: 杭州前进齿轮箱扭振计算系统</p>
      </div>
    </div>`;

  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
<title>${esc(projectInfo.projectName)}</title>
<style>
body{font-family:'SimSun','Microsoft YaHei',sans-serif;font-size:11pt;line-height:1.6;color:#333;margin:0;padding:20px;}
.chapter{margin-bottom:30px;}
.page-break{page-break-before:always;}
h1{font-size:22pt;} h2{border-bottom:2px solid #333;padding-bottom:8px;margin-top:20px;} h3{margin-top:15px;}
.dt{width:100%;border-collapse:collapse;margin:10px 0;}
.dt th,.dt td{border:1px solid #999;padding:6px 10px;text-align:center;}
.dt th{background:#f0f0f0;font-weight:bold;}
.formula-box{background:#f8f9fa;border-left:4px solid #3b82f6;padding:12px 15px;margin:10px 0;}
.formula{font-size:12pt;font-weight:bold;text-align:center;margin:5px 0;}
.pass{color:#28a745;font-weight:bold;} .fail{color:#dc3545;font-weight:bold;}
.conclusion-box{padding:20px;border-radius:8px;text-align:center;margin:20px 0;}
.conclusion-box.pass{background:#d4edda;border:2px solid #28a745;}
.conclusion-box.fail{background:#f8d7da;border:2px solid #dc3545;}
.report-footer{margin-top:30px;padding-top:15px;border-top:1px solid #ccc;font-size:10pt;color:#666;}
@media print{.page-break{page-break-before:always;}}
</style></head><body>
${chapter1}${chapter2}${chapter3}${chapter4}${chapter5}${chapter6}${chapter7}${chapter8}${chapter9}${chapter10}
</body></html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 生成并导出PDF报告
 */
export async function generateProfessionalReport(reportData, options = {}) {
  const html = generateReportHTML(reportData);
  const filename = options.filename || `扭振计算书_${new Date().toISOString().slice(0, 10)}`;

  // 尝试使用html2pdf
  if (typeof window !== 'undefined') {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      await html2pdf().set({
        margin: [15, 15, 15, 15],
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

  // 降级: 新窗口打印
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
  return true;
}

export default { buildProfessionalReportData, generateProfessionalReport };
