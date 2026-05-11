// src/services/copilotDataLoader.ts
// 加载 Copilot 配套数据 (联轴器 80 / 泵 22 / 齿轮箱→联轴器 86 映射 / 齿轮箱→泵 50 映射)
// 数据源: /Users/lidder/erp-dashboard/public/copilot-{couplings,pumps,gearbox_to_*}.json
// 部署位置: gearbox-new/public/copilot-data/ (cp 自包含)
// 使用 PUBLIC_URL fetch (homepage=/gearbox-app/), 内存缓存 1h TTL.

import { logger } from '../config/logging';

// ============================================================================
// 类型定义 (字段已是 camelCase, 无需 snake_case 适配)
// ============================================================================

export interface CopilotCoupling {
  model: string;
  torque?: number;          // 额定扭矩 kN·m
  maxTorque?: number;       // 最大扭矩 kN·m
  maxSpeed?: number;        // rpm
  weight?: number;          // kg
  price?: number;           // 元 (含折)
  basePrice?: number;       // 元 (出厂底价)
  factoryPrice?: number;
  discountRate?: number;
}

export interface CopilotPump {
  model: string;
  flow?: number;            // L/min
  pressure?: number;        // MPa
  motorPower?: number;      // kW
  weight?: number;
  price?: number;
  applicableGearbox?: string[];
  type?: 'mechanical' | 'electric' | string;
}

interface MappingFile {
  version: string | number;
  updateDate?: string;
  description?: string;
  source?: string;
  mappings: Record<string, string>;  // gbModel → coupling/pump model
}

interface CouplingsFile {
  meta: { count: number; source?: string; updated?: string };
  data: CopilotCoupling[];
}

interface PumpsFile {
  meta: { count: number; source?: string; updated?: string };
  data: CopilotPump[];
}

// ============================================================================
// 内存缓存 (TTL 1h)
// ============================================================================

const CACHE_TTL_MS = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  loadedAt: number;
}

const cache = {
  couplings: null as CacheEntry<CopilotCoupling[]> | null,
  pumps: null as CacheEntry<CopilotPump[]> | null,
  gbToCoupling: null as CacheEntry<Record<string, string>> | null,
  gbToPump: null as CacheEntry<Record<string, string>> | null,
};

function isFresh<T>(entry: CacheEntry<T> | null): boolean {
  return !!entry && Date.now() - entry.loadedAt < CACHE_TTL_MS;
}

// ============================================================================
// fetch 工具 (走 PUBLIC_URL, 失败时返回空, 不抛异常以免破坏选型主流程)
// ============================================================================

const PUBLIC_URL = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) || '';

async function safeFetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${PUBLIC_URL}${path}`);
    if (!res.ok) {
      logger.warn(`[copilotDataLoader] fetch ${path} HTTP ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (e) {
    logger.warn(`[copilotDataLoader] fetch ${path} error:`, e);
    return fallback;
  }
}

// ============================================================================
// 公开加载函数
// ============================================================================

export async function loadCopilotCouplings(): Promise<CopilotCoupling[]> {
  if (isFresh(cache.couplings)) return cache.couplings!.data;
  const file = await safeFetchJson<CouplingsFile>(
    '/copilot-data/copilot-couplings.json',
    { meta: { count: 0 }, data: [] }
  );
  cache.couplings = { data: file.data || [], loadedAt: Date.now() };
  return cache.couplings.data;
}

export async function loadCopilotPumps(): Promise<CopilotPump[]> {
  if (isFresh(cache.pumps)) return cache.pumps!.data;
  const file = await safeFetchJson<PumpsFile>(
    '/copilot-data/copilot-pumps.json',
    { meta: { count: 0 }, data: [] }
  );
  cache.pumps = { data: file.data || [], loadedAt: Date.now() };
  return cache.pumps.data;
}

export async function loadGearboxToCouplingMap(): Promise<Record<string, string>> {
  if (isFresh(cache.gbToCoupling)) return cache.gbToCoupling!.data;
  const file = await safeFetchJson<MappingFile>(
    '/copilot-data/gearbox_to_coupling.json',
    { version: 0, mappings: {} }
  );
  cache.gbToCoupling = { data: file.mappings || {}, loadedAt: Date.now() };
  return cache.gbToCoupling.data;
}

export async function loadGearboxToPumpMap(): Promise<Record<string, string>> {
  if (isFresh(cache.gbToPump)) return cache.gbToPump!.data;
  const file = await safeFetchJson<MappingFile>(
    '/copilot-data/gearbox_to_pump.json',
    { version: 0, mappings: {} }
  );
  cache.gbToPump = { data: file.mappings || {}, loadedAt: Date.now() };
  return cache.gbToPump.data;
}

// ============================================================================
// 联轴器/泵推荐 — 三级优先级
// 联轴器: 官方映射 → 扭矩公式 fallback (T = 9.55·P/n·K, K=1.5) → null
// 泵: 官方映射 → applicableGearbox 反查 → 中心距经验估算 → null
// 源: gearbox-copilot.html:1126-1176 (suggestAuxiliary)
// ============================================================================

export interface CouplingMatch {
  coupling: CopilotCoupling | null;
  source: 'official' | 'torque-formula' | 'none';
}

export interface PumpMatch {
  pump: CopilotPump | null;
  source: 'official' | 'applicable-gearbox' | 'center-distance' | 'none';
}

/**
 * 推荐联轴器
 * @param gearboxModel 齿轮箱型号 (如 HC1200)
 * @param enginePower 发动机功率 kW
 * @param engineSpeed 发动机转速 rpm
 * @param safetyK 工况系数 (默认 1.5)
 */
export async function recommendCoupling(
  gearboxModel: string,
  enginePower: number,
  engineSpeed: number,
  safetyK = 1.5
): Promise<CouplingMatch> {
  const [couplings, gbToCoupling] = await Promise.all([
    loadCopilotCouplings(),
    loadGearboxToCouplingMap(),
  ]);

  // 1. 官方映射 (杭齿前进手册)
  const officialModel = gbToCoupling[gearboxModel];
  if (officialModel) {
    const found = couplings.find(c => c.model === officialModel);
    if (found) return { coupling: found, source: 'official' };
  }

  // 2. 扭矩公式 fallback (T = 9.55·P/n·K, kN·m)
  // P (kW) / n (rpm) → 扭矩 N·m, /1000 → kN·m
  if (enginePower > 0 && engineSpeed > 0) {
    const required = (9.55 * enginePower / engineSpeed) * safetyK / 1000; // kN·m
    const candidates = couplings
      .filter(c => typeof c.torque === 'number' && c.torque >= required)
      .sort((a, b) => (a.torque || 0) - (b.torque || 0));
    if (candidates.length > 0) return { coupling: candidates[0], source: 'torque-formula' };
  }

  return { coupling: null, source: 'none' };
}

/**
 * 推荐备用泵
 * @param gearboxModel 齿轮箱型号
 * @param centerDistance 中心距 mm (经验估算用)
 */
export async function recommendPump(
  gearboxModel: string,
  centerDistance?: number
): Promise<PumpMatch> {
  const [pumps, gbToPump] = await Promise.all([
    loadCopilotPumps(),
    loadGearboxToPumpMap(),
  ]);

  // 1. 官方映射
  const officialModel = gbToPump[gearboxModel];
  if (officialModel) {
    const found = pumps.find(p => p.model === officialModel);
    if (found) return { pump: found, source: 'official' };
  }

  // 2. applicableGearbox 反查
  const reverseHit = pumps.find(p =>
    Array.isArray(p.applicableGearbox) && p.applicableGearbox.includes(gearboxModel)
  );
  if (reverseHit) return { pump: reverseHit, source: 'applicable-gearbox' };

  // 3. 中心距经验估算 (gearbox-copilot.html:1170)
  // cd ≤200 → 3.3 / ≤320 → 5 / ≤450 → 7.5 / ≤600 → 12 / >600 → 24.8 (L/min)
  if (typeof centerDistance === 'number' && centerDistance > 0) {
    const targetFlow = centerDistance <= 200 ? 3.3
      : centerDistance <= 320 ? 5
      : centerDistance <= 450 ? 7.5
      : centerDistance <= 600 ? 12
      : 24.8;
    const found = pumps.find(p =>
      typeof p.flow === 'number' && Math.abs(p.flow - targetFlow) < 0.5
    );
    if (found) return { pump: found, source: 'center-distance' };
  }

  return { pump: null, source: 'none' };
}

// ============================================================================
// 预热 (在 App 启动时调用, 避免首次选型卡顿)
// ============================================================================

export async function preloadCopilotData(): Promise<void> {
  await Promise.all([
    loadCopilotCouplings(),
    loadCopilotPumps(),
    loadGearboxToCouplingMap(),
    loadGearboxToPumpMap(),
  ]);
  logger.log('[copilotDataLoader] preload complete');
}

// 测试用: 重置缓存
export function resetCopilotCache(): void {
  cache.couplings = null;
  cache.pumps = null;
  cache.gbToCoupling = null;
  cache.gbToPump = null;
}
