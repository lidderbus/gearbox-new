// src/utils/imoComplianceEngine.js
// IMO 合规评估 facade — B4 投产前外部数据融合
// 整合 EEXI / EEDI / CII 三个指标 + 减排建议生成
//
// 底层算法复用 src/utils/energyEfficiencyCompliance.js (789 行, 已有 EEXI/CII)
// 新增 EEDI 计算 (新建船适用) — 公式同 EEXI 但 reductionFactor 取 Phase 3 系数
//
// IMO 决议版本: MEPC.328(76) / MEPC.333(76) / MEPC.339(76) / 2023-01-01 生效

import {
  calculateEEXI,
  calculateCII,
  EEXI_REFERENCE_LINES
} from './energyEfficiencyCompliance';
import { getEngineById, interpolateAtRpm } from './engineDatabaseUtils';

export const IMO_VERSION = 'MEPC.328(76) / MEPC.333(76) / MEPC.339(76)';

// EEDI Phase 3 削减系数 (新建船比 EEXI 严格)
// 数据来源: IMO MEPC.328(76) Table 1 — 2025-01-01 起 Phase 3 全面适用
const EEDI_PHASE3_REDUCTION = {
  bulkCarrier: 0.30,
  tanker: 0.30,
  containerShip: 0.50,    // 大型集装箱船 Phase 3 = 50% 削减
  generalCargo: 0.30,
  reefer: 0.30,
  roRoCargoShip: 0.30,
  roRoPassengerShip: 0.30,
  lngCarrier: 0.30,
  cruiseShip: 0.30,       // 取与 EEXI 相同
  tug: 0.20,
  offshoreSupplyVessel: 0.20
};

/**
 * 计算 EEDI (新建船) — 与 EEXI 同公式, 区别在 reductionFactor
 * 输入: 同 calculateEEXI
 */
export const calculateEEDI = (params) => {
  const eexiResult = calculateEEXI(params);
  if (!eexiResult.success) return { ...eexiResult, indicator: 'EEDI' };

  const { shipType = 'generalCargo' } = params;
  const SHIP_TYPE_CN_MAP = {
    '散货船': 'bulkCarrier', '油轮': 'tanker', '集装箱船': 'containerShip',
    '杂货船': 'generalCargo', '冷藏船': 'reefer', '滚装货船': 'roRoCargoShip',
    '滚装客船': 'roRoPassengerShip', 'LNG运输船': 'lngCarrier', '邮轮': 'cruiseShip',
    '拖轮': 'tug', '海工船': 'offshoreSupplyVessel'
  };
  const resolvedType = SHIP_TYPE_CN_MAP[shipType] || shipType;
  const phase3Reduction = EEDI_PHASE3_REDUCTION[resolvedType] ?? 0.30;

  // EEDI requiredEEDI 用 Phase 3 系数重算; attainedEEDI = attainedEEXI (公式相同)
  const referenceEEDI = eexiResult.referenceEEXI;
  const requiredEEDI = Math.round(referenceEEDI * (1 - phase3Reduction) * 100) / 100;
  const attainedEEDI = eexiResult.attainedEEXI;
  const compliant = attainedEEDI <= requiredEEDI;
  const margin = ((requiredEEDI - attainedEEDI) / requiredEEDI) * 100;
  const reductionNeeded = compliant ? 0 : Math.abs(margin);

  return {
    success: true,
    indicator: 'EEDI',
    input: eexiResult.input,
    attainedEEDI,
    referenceEEDI,
    requiredEEDI,
    reductionFactor: phase3Reduction * 100,
    compliant,
    margin: Math.round(margin * 10) / 10,
    reductionNeeded: Math.round(reductionNeeded * 10) / 10,
    unit: 'g CO₂/(t·nm)',
    standard: 'IMO MEPC.328(76) Phase 3',
    effectiveDate: '2025-01-01',
    message: compliant
      ? `EEDI ${attainedEEDI.toFixed(2)} 满足 IMO Phase 3 (限值: ${requiredEEDI.toFixed(2)})`
      : `EEDI ${attainedEEDI.toFixed(2)} 超出 IMO Phase 3 限值 ${requiredEEDI.toFixed(2)}, 需削减 ${reductionNeeded.toFixed(1)}%`
  };
};

/**
 * 减排建议生成 — 基于 EEXI/EEDI/CII 评估结果
 * 输入: { eexi, eedi, cii } 三项结果
 * 输出: 推荐措施列表 (按优先级排序)
 */
export const generateRecommendations = ({ eexi, eedi, cii }) => {
  const recs = [];

  // EEXI 维度 (现役船改造)
  if (eexi?.success && !eexi.compliant) {
    const need = eexi.reductionNeeded;
    if (need > 0 && need <= 10) {
      recs.push({
        category: 'EEXI',
        priority: 'medium',
        action: 'EPL (Engine Power Limitation) 限功率',
        detail: `安装可逆的 EPL 限功率装置, 在主机上限制 MCR 至当前值的 ${(100 - need).toFixed(0)}%. 改造成本低, 可逆.`,
        co2ReductionExpected: `${need.toFixed(1)}%`
      });
    } else if (need > 10 && need <= 20) {
      recs.push({
        category: 'EEXI',
        priority: 'high',
        action: 'EPL + 节能装置 (PBCF / 前置导管 / 球鼻艏改造)',
        detail: '组合 EPL 限功率 + 螺旋桨节能装置 (Propeller Boss Cap Fins / 前置导管 / 优化球鼻艏). 通常累计减排 12-18%.',
        co2ReductionExpected: '12-18%'
      });
    } else if (need > 20) {
      recs.push({
        category: 'EEXI',
        priority: 'critical',
        action: '换主机或双燃料改装 (LNG / Methanol)',
        detail: `削减需求 ${need.toFixed(1)}% 超出节能装置上限, 建议评估更换更高效主机 / 双燃料改装. 资本支出大但合规寿命长.`,
        co2ReductionExpected: '20-50%'
      });
      recs.push({
        category: 'EEXI',
        priority: 'high',
        action: '更换更高效齿轮箱 (本系统选型)',
        detail: '齿轮箱效率从 95% 提升至 98% 可贡献约 3% 综合减排. 用本系统重新选型, 关注 transferCapacity 余量与最佳效率工况点匹配.',
        co2ReductionExpected: '~3%'
      });
    }
  }

  // EEDI 维度 (新建船)
  if (eedi?.success && !eedi.compliant) {
    recs.push({
      category: 'EEDI',
      priority: 'high',
      action: '新建船设计阶段优化',
      detail: 'Phase 3 限值已较 baseline 降低 30-50%. 设计阶段建议: 主机 SFC ≤180 g/kWh + 双燃料 (LNG/Methanol/Ammonia ready) + 优化船型方形系数 + WHR 余热回收.',
      co2ReductionExpected: `${eedi.reductionNeeded.toFixed(1)}%+`
    });
  }

  // CII 维度 (运营评级)
  if (cii?.success) {
    if (cii.rating === 'D') {
      recs.push({
        category: 'CII',
        priority: 'high',
        action: 'CII D 级 — 制定改进计划 (SEEMP Part III)',
        detail: '连续 3 年 D 级或单年 E 级触发改进义务. 立即措施: (1) 降速 0.5-1 节 (运营速度优化, 立竿见影 5-15% 减排); (2) 船体清洁 + 螺旋桨抛光 (季度); (3) JIT 准时到港减少锚地空转.'
      });
    } else if (cii.rating === 'E') {
      recs.push({
        category: 'CII',
        priority: 'critical',
        action: 'CII E 级 — 强制改进',
        detail: '触发强制改进计划. 必须降速 1-2 节 + 船体清洁 + 评估 EPL/SEEMP. 持续 E 级可能触发限制港口作业.'
      });
    } else if (cii.rating === 'C') {
      recs.push({
        category: 'CII',
        priority: 'low',
        action: 'CII C 级 — 建议小幅改进',
        detail: '当前合格但接近 D 边界. 建议: 优化航速 (Slow Steaming) + 主机负载点优化 + 船体清洁周期缩短.'
      });
    }
  }

  return recs;
};

/**
 * 评估柴油机+齿轮箱组合在指定船舶工况下的 IMO 合规性
 *
 * @param {Object} params
 * @param {string} params.shipType                船型 (中文或英文键)
 * @param {number} params.dwt                     载重量 DWT (吨)
 * @param {number} params.referenceSpeed          参考航速 (节)
 * @param {string} [params.engineId]              柴油机库 id (优先用于精确 SFC)
 * @param {number} [params.installedPower]        装机功率 (kW), 若提供 engineId 则可省略
 * @param {string} [params.fuelType='HFO']        燃料类型
 * @param {number} [params.gearboxEfficiency=0.985] 齿轮箱效率
 * @param {number} [params.annualFuelConsumption] 年燃料消耗 (吨, CII 必需)
 * @param {number} [params.annualDistance]        年航行里程 (海里, CII 必需)
 * @param {number} [params.year]                  CII 评估年份
 * @param {boolean} [params.evaluateEEDI=false]   是否同时评估 EEDI (新建船)
 * @returns {Object} { success, eexi, eedi?, cii?, recommendations, imoVersion }
 */
export const evaluateCompliance = (params) => {
  const {
    shipType = 'generalCargo',
    dwt,
    referenceSpeed,
    engineId,
    installedPower,
    fuelType = 'HFO',
    gearboxEfficiency = 0.985,
    annualFuelConsumption,
    annualDistance,
    year = new Date().getFullYear(),
    evaluateEEDI = false
  } = params;

  // 从 engineId 推导 installedPower / SFC, 若未提供则用 fallback
  let resolvedPower = installedPower;
  let resolvedSFC = null;
  let resolvedEngine = null;
  if (engineId) {
    resolvedEngine = getEngineById(engineId);
    if (resolvedEngine) {
      resolvedPower = resolvedPower || resolvedEngine.ratedPower_kW;
      // 取 100% 工况点 SFC
      const interp = interpolateAtRpm(resolvedEngine, resolvedEngine.ratedSpeed_rpm);
      resolvedSFC = interp.sfc_g_kWh;
    }
  }

  // 经齿轮箱后的有效推进功率
  const effectivePropulsionPower = resolvedPower
    ? Math.round(resolvedPower * gearboxEfficiency)
    : null;

  if (!effectivePropulsionPower) {
    return {
      success: false,
      message: '缺少 installedPower 或 engineId, 无法评估',
      imoVersion: IMO_VERSION
    };
  }

  const baseParams = {
    shipType,
    installedPower: effectivePropulsionPower,
    capacity: dwt,
    referenceSpeed,
    fuelType,
    specificFuelConsumption: resolvedSFC || undefined
  };

  const eexi = calculateEEXI(baseParams);

  let eedi;
  if (evaluateEEDI) {
    eedi = calculateEEDI(baseParams);
  }

  let cii;
  if (annualFuelConsumption && annualDistance) {
    cii = calculateCII({
      shipType,
      capacity: dwt,
      annualFuelConsumption,
      annualDistance,
      fuelType,
      year
    });
  }

  const recommendations = generateRecommendations({ eexi, eedi, cii });

  return {
    success: true,
    eexi,
    eedi,
    cii,
    recommendations,
    engine: resolvedEngine
      ? { id: resolvedEngine.id, brand: resolvedEngine.brand, model: resolvedEngine.model, sfc: resolvedSFC }
      : null,
    gearboxEfficiency,
    effectivePropulsionPower,
    imoVersion: IMO_VERSION
  };
};

/**
 * 列出当前支持的船型 (供 UI 下拉)
 */
export const getSupportedShipTypes = () => {
  return Object.entries(EEXI_REFERENCE_LINES).map(([key, data]) => ({
    key,
    nameZh: data.name,
    nameEn: data.nameEn
  }));
};

const _exports = {
  IMO_VERSION,
  calculateEEDI,
  evaluateCompliance,
  generateRecommendations,
  getSupportedShipTypes
};
export default _exports;
