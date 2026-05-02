// src/utils/projectPackager.js
// P1-5: 按项目维度打包项目资料 (询单 + 报价单 + 技术协议 + 销售合同 + 可选资源清单)

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getProjectDocuments, listAllProjects } from '../services/documentStorage';

/**
 * 把单个文档对象格式化为可读的纯文本快照
 */
const docToText = (type, doc) => {
  const TYPE_NAMES = { inquiry: '技术询单', quotation: '报价单', agreement: '技术协议', contract: '销售合同' };
  const lines = [];
  lines.push(`${TYPE_NAMES[type] || type}: ${doc.docNumber || doc.id}`);
  lines.push('-'.repeat(60));
  if (doc.contractNumber && doc.contractNumber !== doc.docNumber) lines.push(`合同编号: ${doc.contractNumber}`);
  if (doc.projectId) lines.push(`项目编号: ${doc.projectId}`);
  if (doc.projectName) lines.push(`项目名称: ${doc.projectName}`);
  if (doc.customerName || doc.customer) lines.push(`客户: ${doc.customerName || doc.customer}`);
  if (doc.buyerName) lines.push(`买方: ${doc.buyerName}`);
  if (doc.contact) lines.push(`联系人: ${doc.contact}`);
  if (doc.phone) lines.push(`电话: ${doc.phone}`);
  if (doc.email) lines.push(`邮箱: ${doc.email}`);
  if (doc.shipType) lines.push(`船型: ${doc.shipType}`);
  if (doc.power) lines.push(`功率: ${doc.power} kW`);
  if (doc.speed) lines.push(`转速: ${doc.speed} rpm`);
  if (doc.ratioTarget) lines.push(`目标速比: ${doc.ratioTarget}`);
  if (doc.model) lines.push(`型号: ${doc.model}`);
  if (doc.gearboxModel && doc.gearboxModel !== doc.model) lines.push(`齿轮箱型号: ${doc.gearboxModel}`);
  if (doc.classification) lines.push(`船级社: ${doc.classification}`);
  if (doc.classSociety) lines.push(`船级社: ${doc.classSociety}`);
  if (doc.totalAmount) lines.push(`总金额: ¥${Number(doc.totalAmount).toLocaleString()}`);
  if (doc.deliveryDate) lines.push(`期望交货日期: ${doc.deliveryDate}`);
  if (doc.deliveryPlace) lines.push(`交货地点: ${doc.deliveryPlace}`);
  if (doc.specialReq) lines.push(`特殊要求: ${doc.specialReq}`);
  if (doc.status) lines.push(`状态: ${doc.status}`);
  if (Array.isArray(doc.items) && doc.items.length > 0) {
    lines.push('');
    lines.push('明细项目:');
    doc.items.forEach((item, i) => {
      lines.push(`  ${i + 1}. ${item.name || item.model || '-'} × ${item.quantity || 1} = ¥${item.unitPrice ? Number(item.unitPrice).toLocaleString() : '-'}`);
    });
  }
  if (doc.createdAt) lines.push(`创建时间: ${new Date(doc.createdAt).toLocaleString('zh-CN')}`);
  if (doc.updatedAt && doc.updatedAt !== doc.createdAt) lines.push(`更新时间: ${new Date(doc.updatedAt).toLocaleString('zh-CN')}`);
  return lines.join('\n');
};

/**
 * 生成 README 摘要
 */
const generateReadme = (projectId, projectName, docs, options) => {
  const lines = [];
  lines.push('齿轮箱选型系统 — 项目资料包');
  lines.push('='.repeat(60));
  lines.push(`项目编号: ${projectId}`);
  if (projectName) lines.push(`项目名称: ${projectName}`);
  lines.push(`生成时间: ${new Date().toLocaleString('zh-CN')}`);
  lines.push('');
  lines.push('文件清单:');
  if (docs.inquiry?.length) lines.push(`  /inquiry/      — 技术询单 ${docs.inquiry.length} 份`);
  if (docs.quotation?.length) lines.push(`  /quotation/    — 报价单 ${docs.quotation.length} 份`);
  if (docs.agreement?.length) lines.push(`  /agreement/    — 技术协议 ${docs.agreement.length} 份`);
  if (docs.contract?.length) lines.push(`  /contract/     — 销售合同 ${docs.contract.length} 份`);
  if (options?.includeProjectJson) lines.push('  project.json   — 完整 JSON 备份 (可重新导入)');
  if (options?.includeManifest) lines.push('  manifest.txt   — 本说明');
  lines.push('');
  lines.push('用法:');
  lines.push('  - 直接解压查看 .txt 快照');
  lines.push('  - 通过文档管理仪表板的 "备份/恢复" 功能恢复 project.json');
  lines.push('');
  lines.push('注: 此包由齿轮箱选型系统 P1-5 项目打包器自动生成。');
  return lines.join('\n');
};

/**
 * 主入口: 按项目打包并触发下载
 *
 * @param {string} projectId
 * @param {Object} [options]
 * @param {string} [options.projectName] — 项目名 (用于 README)
 * @param {boolean} [options.includeJson=true] — 是否包含完整 JSON 备份
 * @param {boolean} [options.includeManifest=true] — 是否包含 README/manifest
 * @returns {Promise<{filename: string, sizeBytes: number, docCounts: Object}>}
 */
export const packProject = async (projectId, options = {}) => {
  const { projectName = '', includeJson = true, includeManifest = true } = options;
  if (!projectId) throw new Error('projectId 不能为空');

  const docs = getProjectDocuments(projectId);
  const totalDocs = (docs.inquiry?.length || 0) + (docs.quotation?.length || 0) + (docs.agreement?.length || 0) + (docs.contract?.length || 0);
  if (totalDocs === 0) throw new Error(`项目 ${projectId} 下没有可打包的文档`);

  const zip = new JSZip();

  // 添加 README
  if (includeManifest) {
    zip.file('manifest.txt', generateReadme(projectId, projectName, docs, { includeProjectJson: includeJson, includeManifest }));
  }

  // 按文档类型逐个写入
  const TYPE_FOLDERS = {
    inquiry: 'inquiry',
    quotation: 'quotation',
    agreement: 'agreement',
    contract: 'contract',
  };

  Object.entries(TYPE_FOLDERS).forEach(([type, folder]) => {
    (docs[type] || []).forEach(doc => {
      const filename = `${folder}/${(doc.docNumber || doc.id || 'unnamed').replace(/[/\\?%*:|"<>]/g, '_')}.txt`;
      zip.file(filename, docToText(type, doc));
    });
  });

  // 完整 JSON 备份 (用于跨系统恢复)
  if (includeJson) {
    const projectJson = {
      version: '1.0',
      kind: 'project-bundle',
      projectId,
      projectName,
      exportedAt: new Date().toISOString(),
      docs,
    };
    zip.file('project.json', JSON.stringify(projectJson, null, 2));
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const safeName = (projectName ? `${projectName}_` : '').replace(/[/\\?%*:|"<>]/g, '_');
  const filename = `${safeName}${projectId}_${new Date().toISOString().slice(0, 10)}.zip`;
  saveAs(blob, filename);

  return {
    filename,
    sizeBytes: blob.size,
    docCounts: {
      inquiry: docs.inquiry?.length || 0,
      quotation: docs.quotation?.length || 0,
      agreement: docs.agreement?.length || 0,
      contract: docs.contract?.length || 0,
    },
  };
};

/**
 * 列出可打包项目 (用于 UI 选择器)
 */
export const listPackageableProjects = () => {
  return listAllProjects().filter(p => p.total > 0 && !p.projectId.startsWith('legacy:'));
};

export default { packProject, listPackageableProjects };
