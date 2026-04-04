// src/utils/modelAliasResolver.js
// 型号别名解析：将销售文档中的非标型号名映射到数据库型号
import { cppModelNameMapping } from '../data/cppSystemData';

const SUFFIX_RE = /[ABCDLRP]$/i;
const CD_RATIO_RE = /^(GCS|GCST|GCD|GCH)(\d{2,3})\.(\d{2,3})$/i;

/**
 * @param {string} query - 用户输入的型号名
 * @param {Array<{model:string}>} allModels - 数据库全部型号列表
 * @returns {{ resolved: string|null, candidates: string[], confidence: string, note: string }}
 */
export function resolveModelAlias(query, allModels) {
  if (!query || !allModels?.length) return { resolved: null, candidates: [], confidence: 'none', note: '' };
  const q = query.trim().toUpperCase();
  const modelSet = new Set(allModels.map(m => (m.model || m).toString().toUpperCase()));

  // 1. 精确匹配
  if (modelSet.has(q)) return { resolved: q, candidates: [q], confidence: 'exact', note: '' };

  // 2. 去后缀 (GCST44B → GCST44)
  const stripped = q.replace(SUFFIX_RE, '');
  if (stripped !== q && modelSet.has(stripped)) {
    return { resolved: stripped, candidates: [stripped], confidence: 'high', note: `去除后缀"${q.slice(stripped.length)}"` };
  }

  // 3. CPP映射反查
  const gearboxMap = cppModelNameMapping?.gearbox || {};
  for (const [dbModel, info] of Object.entries(gearboxMap)) {
    if (info.realModels?.some(rm => rm.toUpperCase() === q)) {
      const inDb = info.realModels.filter(rm => modelSet.has(rm.toUpperCase()));
      if (inDb.length) {
        return { resolved: inDb[0].toUpperCase(), candidates: inDb.map(m => m.toUpperCase()), confidence: 'medium', note: `CPP映射 → ${dbModel}` };
      }
      return { resolved: null, candidates: [], confidence: 'none', note: `项目型号 ${q} 对应 ${dbModel}，不在选型数据库` };
    }
  }

  // 4. 中心距.减速比格式 (GCS49.61 → GCS490)
  const cdMatch = q.match(CD_RATIO_RE);
  if (cdMatch) {
    const prefix = cdMatch[1].toUpperCase();
    const expanded = `${prefix}${cdMatch[2]}0`;
    if (modelSet.has(expanded)) {
      return { resolved: expanded, candidates: [expanded], confidence: 'medium', note: `中心距格式 → ${expanded}` };
    }
  }

  // 5. 模糊匹配：同前缀 + 数值最近
  const pm = q.match(/^([A-Z]+)(\d+)/);
  if (pm) {
    const [, prefix, numStr] = pm;
    const num = parseInt(numStr, 10);
    const hits = allModels
      .filter(m => m.model.toUpperCase().startsWith(prefix))
      .map(m => ({ model: m.model, diff: Math.abs(parseInt(m.model.replace(/[^0-9]/g, ''), 10) - num) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5)
      .map(c => c.model);
    if (hits.length) return { resolved: null, candidates: hits, confidence: 'fuzzy', note: '模糊匹配最近型号' };
  }

  return { resolved: null, candidates: [], confidence: 'none', note: '无法解析' };
}
