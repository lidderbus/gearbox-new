// src/utils/agreementEnhancer.js

export function generateSignatureSection(options = {}) {
  var buyerName = options.buyerName || '________________';
  var sellerName = options.sellerName || '杭州前进齿轮箱集团股份有限公司';
  var language = options.language || 'zh';

  if (language === 'en') {
    return '<div style="margin-top:40px;page-break-inside:avoid;"><h3 style="border-bottom:2px solid #333;padding-bottom:5px;">Signature</h3><table style="width:100%;border-collapse:collapse;margin-top:15px;"><tr><td style="width:50%;padding:15px;vertical-align:top;"><p><strong>BUYER (Party A):</strong></p><p>' + buyerName + '</p><p style="margin-top:30px;">Representative: ________________</p><p>Title: ________________</p><p>Date: ________________</p><p style="margin-top:20px;">Seal:</p><div style="width:120px;height:120px;border:1px dashed #ccc;margin-top:5px;"></div></td><td style="width:50%;padding:15px;vertical-align:top;border-left:1px solid #ddd;"><p><strong>SELLER (Party B):</strong></p><p>' + sellerName + '</p><p style="margin-top:30px;">Representative: ________________</p><p>Title: ________________</p><p>Date: ________________</p><p style="margin-top:20px;">Seal:</p><div style="width:120px;height:120px;border:1px dashed #ccc;margin-top:5px;"></div></td></tr></table></div>';
  }

  return '<div style="margin-top:40px;page-break-inside:avoid;"><h3 style="border-bottom:2px solid #333;padding-bottom:5px;">签章</h3><table style="width:100%;border-collapse:collapse;margin-top:15px;"><tr><td style="width:50%;padding:15px;vertical-align:top;"><p><strong>需方（甲方）：</strong></p><p>' + buyerName + '</p><p style="margin-top:30px;">授权代表：________________</p><p>职务：________________</p><p>日期：________________</p><p style="margin-top:20px;">（盖章）</p><div style="width:120px;height:120px;border:1px dashed #ccc;margin-top:5px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:12px;">甲方印章</div></td><td style="width:50%;padding:15px;vertical-align:top;border-left:1px solid #ddd;"><p><strong>供方（乙方）：</strong></p><p>' + sellerName + '</p><p style="margin-top:30px;">授权代表：________________</p><p>职务：________________</p><p>日期：________________</p><p style="margin-top:20px;">（盖章）</p><div style="width:120px;height:120px;border:1px dashed #ccc;margin-top:5px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:12px;">乙方印章</div></td></tr></table></div>';
}

export function getApplicableRegulations(model, certifications) {
  var regs = [];
  regs.push({ code: 'GB/T 20070', name: '船用齿轮箱通用技术条件' });
  regs.push({ code: 'GB/T 3480', name: '渐开线圆柱齿轮承载能力计算方法' });
  var certs = certifications || [];
  if (certs.includes('CCS') || certs.includes('ZC')) {
    regs.push({ code: 'CCS 钢质海船入级规范', name: '中国船级社钢质海船入级规范' });
    regs.push({ code: 'CCS GD 22-2015', name: '船用齿轮箱产品检验指南' });
  }
  if (certs.includes('DNV')) regs.push({ code: 'DNV Rules Pt.4 Ch.4', name: 'DNV齿轮传动装置规范' });
  if (certs.includes('BV')) regs.push({ code: 'BV NR467', name: 'BV船用齿轮箱认证规范' });
  var series = extractSeries(model);
  if (series.startsWith('GW')) regs.push({ code: 'GB/T 3481', name: '齿轮轮齿磨损和损伤术语' });
  if (series === 'DT') regs.push({ code: 'IEC 60092', name: '船舶电气装置标准' });
  return regs;
}

export var BILINGUAL_TITLES = {
  '技术协议': 'Technical Agreement', '产品规格': 'Product Specifications',
  '主机参数': 'Engine Parameters', '齿轮箱参数': 'Gearbox Parameters',
  '联轴器参数': 'Coupling Parameters', '备用泵参数': 'Standby Pump Parameters',
  '附件清单': 'Accessories List', '监测仪表': 'Monitoring Instruments',
  '技术文件': 'Technical Documents', '质量保证': 'Quality Assurance',
  '适用标准': 'Applicable Standards', '签章': 'Signature',
  '型号': 'Model', '功率': 'Power', '转速': 'Speed', '减速比': 'Reduction Ratio',
  '推力': 'Thrust', '重量': 'Weight', '中心距': 'Center Distance',
};

export function toBilingual(zhText) {
  var en = BILINGUAL_TITLES[zhText];
  return en ? zhText + ' / ' + en : zhText;
}

function extractSeries(model) {
  if (!model) return '';
  var m = model.match(/^(HCT|HCD|HCQ|HCA|HCM|HCW|HC|GWC|GWS|GWL|GWK|SGW|DT|GCS|2GWH|HCL|MA|MB)/i);
  return m ? m[1].toUpperCase() : '';
}
