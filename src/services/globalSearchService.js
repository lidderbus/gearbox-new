// 资料库全局检索服务 — 跨 5 个数据源(图纸/说明书/协议模板/配机案例/标准法规)聚合搜索
// Adapter 模式:把异构记录归一为 { id, sourceModule, type, title, subtitle, tags, link, model, sourceData }
// 各源独立、按需懒加载导入(模块顶层 import,Webpack 会做 dead-code 消除/分块)

import { gearboxDrawings, couplingDrawings } from '../data/outlineDrawings';
import { gearboxDwgDrawings, couplingDwgDrawings } from '../data/dwgDrawings';
import { gearboxManuals } from '../data/gearboxManuals';
import { technicalAgreementTemplates } from '../data/technicalAgreementTemplates';
import { engineMatchingCases } from '../data/hcmEngineMatching';
import { STANDARDS_DATA } from '../data/standardsData';

// ----- 源类型常量 -----
export const SOURCE_TYPES = {
  drawing: { label: '外形图', icon: 'bi-image', color: 'primary', module: 'drawings' },
  dwg: { label: 'DWG 图纸', icon: 'bi-file-earmark-binary', color: 'primary', module: 'drawings' },
  manual: { label: '说明书', icon: 'bi-book', color: 'success', module: 'manuals' },
  template: { label: '协议模板', icon: 'bi-file-earmark-text', color: 'info', module: 'templates' },
  case: { label: '配机案例', icon: 'bi-journal-text', color: 'warning', module: 'engine-cases' },
  standard: { label: '标准法规', icon: 'bi-bookmark-check', color: 'danger', module: 'standards-library' },
};

// ----- 各源 adapter -----

const adaptDrawings = () => {
  const out = [];
  Object.entries(gearboxDrawings || {}).forEach(([model, data]) => {
    out.push({
      id: `drawing-gearbox-${model}`,
      sourceModule: 'drawings',
      type: 'drawing',
      title: `${model} 外形图`,
      subtitle: data.description || data.powerRange || '齿轮箱外形图',
      tags: [model, 'gearbox', data.series, data.category].filter(Boolean),
      model,
      link: data.path || data.filePath || null,
      sourceData: data,
    });
  });
  Object.entries(couplingDrawings || {}).forEach(([model, data]) => {
    out.push({
      id: `drawing-coupling-${model}`,
      sourceModule: 'drawings',
      type: 'drawing',
      title: `${model} 联轴器外形图`,
      subtitle: data.description || data.powerRange || '联轴器外形图',
      tags: [model, 'coupling', data.series, data.category].filter(Boolean),
      model,
      link: data.path || data.filePath || null,
      sourceData: data,
    });
  });
  return out;
};

const adaptDwg = () => {
  const out = [];
  // gearboxDwgDrawings/couplingDwgDrawings 结构: { model: [{ id, fileName, filePath, fileSize, updateDate, series, category }, ...] }
  Object.entries(gearboxDwgDrawings || {}).forEach(([model, files]) => {
    const arr = Array.isArray(files) ? files : [];
    arr.forEach(f => {
      out.push({
        id: `dwg-gearbox-${model}-${f.id || f.fileName}`,
        sourceModule: 'drawings',
        type: 'dwg',
        title: f.fileName || `${model} DWG`,
        subtitle: [f.fileSize, f.updateDate].filter(Boolean).join(' · ') || 'DWG 图纸',
        tags: [model, 'DWG', f.series, f.category].filter(Boolean),
        model,
        link: f.filePath || null,
        sourceData: f,
      });
    });
  });
  Object.entries(couplingDwgDrawings || {}).forEach(([model, files]) => {
    const arr = Array.isArray(files) ? files : [];
    arr.forEach(f => {
      out.push({
        id: `dwg-coupling-${model}-${f.id || f.fileName}`,
        sourceModule: 'drawings',
        type: 'dwg',
        title: f.fileName || `${model} DWG`,
        subtitle: [f.fileSize, f.updateDate].filter(Boolean).join(' · ') || 'DWG 图纸',
        tags: [model, 'DWG', 'coupling', f.series, f.category].filter(Boolean),
        model,
        link: f.filePath || null,
        sourceData: f,
      });
    });
  });
  return out;
};

const adaptManuals = () => {
  return Object.entries(gearboxManuals || {}).map(([model, data]) => ({
    id: `manual-${model}`,
    sourceModule: 'manuals',
    type: 'manual',
    title: data.title || `${model} 使用说明书`,
    subtitle: [data.category, data.fileSize].filter(Boolean).join(' · ') || '说明书',
    tags: [model, 'manual', data.category].filter(Boolean),
    model,
    link: data.path || null,
    sourceData: data,
  }));
};

const adaptTemplates = () => {
  return (technicalAgreementTemplates || []).map(t => ({
    id: `template-${t.id}`,
    sourceModule: 'templates',
    type: 'template',
    title: t.title || `${t.model} 技术协议`,
    subtitle: [t.category, t.type, t.year].filter(Boolean).join(' · '),
    tags: [t.model, t.category, t.type, String(t.year || '')].filter(Boolean),
    model: t.model,
    link: t.path || null,
    sourceData: t,
  }));
};

const adaptCases = () => {
  return (engineMatchingCases || []).map((c, i) => {
    const gearbox = c.gearbox || c.model || '';
    const engine = c.engine || c.engineModel || '';
    return {
      id: `case-${c.id || i}`,
      sourceModule: 'engine-cases',
      type: 'case',
      title: [engine, gearbox].filter(Boolean).join(' + ') || '配机案例',
      subtitle: [
        c.power ? `${c.power}kW` : null,
        c.speed ? `${c.speed}rpm` : null,
        c.ratio ? `速比 ${c.ratio}` : null,
        c.shipType,
        c.classification,
      ].filter(Boolean).join(' · '),
      tags: [gearbox, engine, c.shipType, c.classification, c.controlType].filter(Boolean),
      model: gearbox,
      link: null,
      sourceData: c,
    };
  });
};

const adaptStandards = () => {
  return (STANDARDS_DATA || []).map(s => ({
    id: `standard-${s.id}`,
    sourceModule: 'standards-library',
    type: 'standard',
    title: s.name,
    subtitle: [s.org, s.category, s.year].filter(Boolean).join(' · '),
    tags: [s.org, s.category, s.status, String(s.year || '')].filter(Boolean),
    model: null,
    link: null,
    sourceData: s,
  }));
};

// ----- 索引构建(单次,惰性) -----

let _index = null;
const buildIndex = () => {
  if (_index) return _index;
  _index = [
    ...adaptDrawings(),
    ...adaptDwg(),
    ...adaptManuals(),
    ...adaptTemplates(),
    ...adaptCases(),
    ...adaptStandards(),
  ];
  return _index;
};

// ----- 公共 API -----

/**
 * 全文检索
 * @param {string} query — 关键词(空字符串返回全部)
 * @param {Object} [opts]
 * @param {string[]} [opts.types] — 限定源类型集合(如 ['manual', 'template'])
 * @param {number} [opts.limit] — 返回上限,默认 200
 * @returns {Array} 按相关度排序的统一记录
 */
export const search = (query = '', opts = {}) => {
  const all = buildIndex();
  const types = Array.isArray(opts.types) && opts.types.length > 0 ? new Set(opts.types) : null;
  const limit = opts.limit || 200;

  const q = String(query || '').trim().toLowerCase();
  let pool = types ? all.filter(r => types.has(r.type)) : all;

  if (!q) return pool.slice(0, limit);

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const r of pool) {
    const haystack = [
      r.title || '',
      r.subtitle || '',
      r.model || '',
      ...(r.tags || []),
    ].join(' ').toLowerCase();

    let score = 0;
    let allHit = true;
    for (const t of tokens) {
      if (haystack.includes(t)) {
        score += 1;
        // 标题命中加权
        if ((r.title || '').toLowerCase().includes(t)) score += 2;
        // model 精确等于加权
        if (String(r.model || '').toLowerCase() === t) score += 5;
      } else {
        allHit = false;
        break;
      }
    }
    if (allHit && score > 0) scored.push({ score, record: r });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.record);
};

/**
 * 各源记录数统计(供 UI 显示标签上的 count)
 */
export const getCounts = () => {
  const all = buildIndex();
  const counts = { total: all.length };
  Object.keys(SOURCE_TYPES).forEach(t => { counts[t] = 0; });
  all.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
  return counts;
};

/**
 * 重建索引(测试或数据热更新时用)
 */
export const rebuildIndex = () => { _index = null; buildIndex(); };

const globalSearchService = { search, getCounts, rebuildIndex, SOURCE_TYPES };
export default globalSearchService;
