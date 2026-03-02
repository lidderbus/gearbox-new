// src/utils/selectionSummaryExport.js
// One-click selection summary export (print-friendly)

import { formatPrice } from './priceFormatter';

/**
 * Export selection summary as a printable page
 */
export const exportSelectionSummary = (selectedGearbox, result, couplingResult, pumpResult) => {
  if (!selectedGearbox) return;

  const model = selectedGearbox.model || '未知型号';
  const now = new Date().toLocaleString('zh-CN');

  const row = (label, value) =>
    `<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:500;width:40%;background:#f9f9f9">${label}</td>
     <td style="padding:6px 12px;border:1px solid #ddd">${value || '-'}</td></tr>`;

  const sectionTitle = (title) =>
    `<h3 style="margin:20px 0 8px;padding-bottom:4px;border-bottom:2px solid #0d6efd;color:#0d6efd">${title}</h3>`;

  // Gearbox section
  const gearboxRows = [
    row('型号', model),
    row('传递能力', selectedGearbox.selectedCapacity
      ? `${selectedGearbox.selectedCapacity.toFixed(6)} kW/rpm`
      : `${selectedGearbox.power || '-'} kW`),
    row('所需传递能力', result?.requiredTransferCapacity
      ? `${result.requiredTransferCapacity.toFixed(6)} kW/rpm` : '-'),
    row('能力余量', selectedGearbox.capacityMargin !== undefined
      ? `${selectedGearbox.capacityMargin.toFixed(1)}%` : '-'),
    row('减速比', selectedGearbox.selectedRatio?.toFixed(2) || selectedGearbox.ratio?.toFixed(2) || '-'),
    row('目标减速比', result?.targetRatio?.toFixed(2) || '-'),
    row('推力', selectedGearbox.thrust ? `${selectedGearbox.thrust} kN` : '-'),
    row('重量', selectedGearbox.weight ? `${selectedGearbox.weight} kg` : '-'),
    row('价格', formatPrice(selectedGearbox.price || selectedGearbox.basePrice)),
  ].join('');

  // Coupling section
  let couplingSection = '';
  if (couplingResult) {
    const c = couplingResult;
    couplingSection = sectionTitle('联轴器') + `<table style="width:100%;border-collapse:collapse">${
      row('型号', c.model) +
      row('额定扭矩', c.ratedTorque ? `${c.ratedTorque} kN·m` : '-') +
      row('最大转速', c.maxSpeed ? `${c.maxSpeed} rpm` : '-') +
      row('飞轮规格', c.flywheelSpec || '-')
    }</table>`;
  }

  // Pump section
  let pumpSection = '';
  if (pumpResult) {
    const p = pumpResult;
    pumpSection = sectionTitle('备用泵') + `<table style="width:100%;border-collapse:collapse">${
      row('型号', p.model) +
      row('排量', p.displacement ? `${p.displacement} L/min` : '-') +
      row('压力', p.pressure ? `${p.pressure} MPa` : '-')
    }</table>`;
  }

  // Engine info
  let engineSection = '';
  if (result?.enginePower || result?.engineSpeed) {
    engineSection = sectionTitle('发动机参数') + `<table style="width:100%;border-collapse:collapse">${
      row('功率', result.enginePower ? `${result.enginePower} kW` : '-') +
      row('转速', result.engineSpeed ? `${result.engineSpeed} rpm` : '-')
    }</table>`;
  }

  const html = `<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>选型摘要 - ${model}</title>
    <style>
      body { font-family: -apple-system, "Microsoft YaHei", sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; color: #333; }
      h1 { text-align: center; color: #0d6efd; margin-bottom: 4px; }
      .subtitle { text-align: center; color: #888; margin-bottom: 24px; font-size: 0.9rem; }
      table { width: 100%; border-collapse: collapse; }
      @media print { body { padding: 10px; } }
    </style>
  </head><body>
    <h1>齿轮箱选型摘要</h1>
    <div class="subtitle">${now}</div>
    ${engineSection}
    ${sectionTitle('齿轮箱')}
    <table>${gearboxRows}</table>
    ${couplingSection}
    ${pumpSection}
    <div style="margin-top:30px;text-align:center;color:#aaa;font-size:0.8rem">
      杭齿齿轮箱选型系统生成
    </div>
  </body></html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
};
