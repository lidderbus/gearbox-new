/**
 * Total Cost of Ownership (TCO) Calculator for Gearbox Products
 *
 * Calculates and compares lifecycle costs including purchase, installation,
 * maintenance, overhaul, spare parts, and downtime costs.
 */

import { tcoParameters, shipTypeDefaults } from '../data/competitorDataEnhanced';

// ---------------------------------------------------------------------------
// Default constants
// ---------------------------------------------------------------------------

export const tcoDefaults = {
  years: 10,
  installationCostFactor: 0.10,
  oilCostPerChange: 5000,
  laborRate: 500,         // yuan/hour
  overhaulCostFactor: 0.15 // 15% of purchase price per overhaul
};

// ---------------------------------------------------------------------------
// Ship type options (for UI dropdowns)
// ---------------------------------------------------------------------------

const shipTypeOptions = [
  { value: 'fishing',          label: '渔船' },
  { value: 'inlandCargo',      label: '内河货船' },
  { value: 'coastalCargo',     label: '沿海货船' },
  { value: 'mediumCommercial', label: '中型商船' },
  { value: 'largeCommercial',  label: '大型商船' },
  { value: 'specialVessel',    label: '特种船舶' },
  { value: 'yacht',            label: '游艇' },
  { value: 'military',         label: '军用船舶' }
];

export function getShipTypeOptions() {
  return shipTypeOptions;
}

// ---------------------------------------------------------------------------
// Helper: resolve TCO parameters for a manufacturer
// ---------------------------------------------------------------------------

// 杭齿基准维护参数
const hangchiBaseParams = {
  oilChangeIntervalHours: 2000,
  majorOverhaulIntervalHours: 20000,
  maintenanceManHoursPerService: 8,
  avgDowntimeDaysPerYear: 1,
  sparePartsCostFactor: 0.02
};

function resolveTcoParams(manufacturer) {
  const factors = tcoParameters?.manufacturerTCOFactors;
  if (!factors) return hangchiBaseParams;
  const mfg = factors[String(manufacturer || '').trim()] || factors.HANGCHI || {};
  // 用乘数调整杭齿基准值
  return {
    oilChangeIntervalHours: hangchiBaseParams.oilChangeIntervalHours,
    majorOverhaulIntervalHours: hangchiBaseParams.majorOverhaulIntervalHours,
    maintenanceManHoursPerService: hangchiBaseParams.maintenanceManHoursPerService * (mfg.maintenance || 1),
    avgDowntimeDaysPerYear: hangchiBaseParams.avgDowntimeDaysPerYear * (mfg.downtime || 1),
    sparePartsCostFactor: hangchiBaseParams.sparePartsCostFactor * (mfg.spareParts || 1)
  };
}

// ---------------------------------------------------------------------------
// Helper: resolve ship-type defaults
// ---------------------------------------------------------------------------

function resolveShipDefaults(shipType) {
  const defaults = shipTypeDefaults?.[shipType] || shipTypeDefaults?.fishing || {};
  // 适配字段名: annualHours → annualRunningHours
  return {
    annualRunningHours: defaults.annualHours || 3000,
    downtimeCostPerDay: (defaults.maintenanceCostBase || 5000) * 10, // 停机损失≈单次维护的10倍
    ...defaults
  };
}

// ---------------------------------------------------------------------------
// 1. calculateTCO
// ---------------------------------------------------------------------------

/**
 * Calculate Total Cost of Ownership for a single product.
 *
 * @param {Object} product  - { price|estimatedPrice, manufacturer, model }
 * @param {Object} config   - { years, shipType, annualRunningHours,
 *                              downtimeCostPerDay, installationCostFactor,
 *                              oilCostPerChange }
 * @returns {Object} TCO breakdown
 */
export function calculateTCO(product, config = {}) {
  // --- Resolve inputs with safe defaults ---
  const price = Number(product?.price || product?.estimatedPrice) || 0;
  const manufacturer = product?.manufacturer || '';

  const years = Math.max(1, Number(config.years) || tcoDefaults.years);
  const shipType = config.shipType || 'cargo';
  const installationCostFactor =
    config.installationCostFactor != null
      ? Number(config.installationCostFactor)
      : tcoDefaults.installationCostFactor;
  const oilCostPerChange =
    config.oilCostPerChange != null
      ? Number(config.oilCostPerChange)
      : tcoDefaults.oilCostPerChange;
  const laborRate = tcoDefaults.laborRate;
  const overhaulCostFactor = tcoDefaults.overhaulCostFactor;

  // --- Manufacturer & ship-type parameters ---
  const tcoParams = resolveTcoParams(manufacturer);
  const shipDefaults = resolveShipDefaults(shipType);

  const annualRunningHours =
    Number(config.annualRunningHours) || Number(shipDefaults.annualRunningHours) || 3000;
  const downtimeCostPerDay =
    Number(config.downtimeCostPerDay) || Number(shipDefaults.downtimeCostPerDay) || 50000;

  // --- Derived intervals (guard against zero / missing) ---
  const oilChangeInterval = Number(tcoParams.oilChangeIntervalHours) || 2000;
  const overhaulInterval = Number(tcoParams.majorOverhaulIntervalHours) || 20000;
  const maintenanceManHours = Number(tcoParams.maintenanceManHoursPerService) || 8;
  const avgDowntimeDays = Number(tcoParams.avgDowntimeDaysPerYear) || 0;
  const sparePartsCostFactor = Number(tcoParams.sparePartsCostFactor) || 0.02;

  // --- Cost calculations ---
  const purchaseCost = price;
  const installationCost = price * installationCostFactor;

  const oilChangesPerYear = annualRunningHours / oilChangeInterval;
  const maintenanceCost =
    years * (oilChangesPerYear * oilCostPerChange +
             oilChangesPerYear * maintenanceManHours * laborRate);

  const totalRunningHours = years * annualRunningHours;
  const overhaulCount = Math.floor(totalRunningHours / overhaulInterval);
  const overhaulCost = overhaulCount * overhaulCostFactor * price;

  const sparePartsCost = sparePartsCostFactor * price * years;

  const downtimeCost = avgDowntimeDays * downtimeCostPerDay * years;

  const totalTCO =
    purchaseCost + installationCost + maintenanceCost +
    overhaulCost + sparePartsCost + downtimeCost;
  const annualTCO = totalTCO / years;

  // --- Yearly breakdown (for charts) ---
  const annualMaintenance = maintenanceCost / years;
  const annualSpareParts = sparePartsCost / years;
  const annualDowntime = downtimeCost / years;

  const breakdown = [];
  let cumulative = purchaseCost + installationCost; // year-0 upfront costs

  for (let y = 1; y <= years; y++) {
    // Overhaul cost falls in the year the interval is reached
    const hoursAtEndOfYear = y * annualRunningHours;
    const overhaulsPrev = Math.floor((y - 1) * annualRunningHours / overhaulInterval);
    const overhaulsCurr = Math.floor(hoursAtEndOfYear / overhaulInterval);
    const overhaulThisYear = (overhaulsCurr - overhaulsPrev) * overhaulCostFactor * price;

    cumulative += annualMaintenance + annualSpareParts + annualDowntime + overhaulThisYear;

    breakdown.push({
      year: y,
      cumulative: Math.round(cumulative),
      maintenance: Math.round(annualMaintenance),
      spareParts: Math.round(annualSpareParts),
      downtime: Math.round(annualDowntime),
      overhaul: Math.round(overhaulThisYear)
    });
  }

  return {
    purchaseCost:     Math.round(purchaseCost),
    installationCost: Math.round(installationCost),
    maintenanceCost:  Math.round(maintenanceCost),
    overhaulCost:     Math.round(overhaulCost),
    sparePartsCost:   Math.round(sparePartsCost),
    downtimeCost:     Math.round(downtimeCost),
    totalTCO:         Math.round(totalTCO),
    annualTCO:        Math.round(annualTCO),
    breakdown
  };
}

// ---------------------------------------------------------------------------
// 2. compareTCO
// ---------------------------------------------------------------------------

/**
 * Compare TCO between a Hangchi product and a competitor product.
 *
 * @param {Object} hangchiProduct     - Hangchi product object
 * @param {Object} competitorProduct  - Competitor product object
 * @param {Object} config             - Shared calculation config
 * @returns {Object} Comparison result with savings and break-even year
 */
export function compareTCO(hangchiProduct, competitorProduct, config = {}) {
  const hangchi    = calculateTCO(hangchiProduct, config);
  const competitor = calculateTCO(competitorProduct, config);

  const savings = competitor.totalTCO - hangchi.totalTCO;
  const savingsPercent =
    competitor.totalTCO > 0
      ? (savings / competitor.totalTCO) * 100
      : 0;

  // Find break-even year: first year where hangchi cumulative < competitor cumulative
  let breakEvenYear = null;
  const maxLen = Math.min(hangchi.breakdown.length, competitor.breakdown.length);
  for (let i = 0; i < maxLen; i++) {
    if (hangchi.breakdown[i].cumulative < competitor.breakdown[i].cumulative) {
      breakEvenYear = hangchi.breakdown[i].year;
      break;
    }
  }

  return {
    hangchi,
    competitor,
    savings:        Math.round(savings),
    savingsPercent: Math.round(savingsPercent * 100) / 100, // 2 decimal places
    breakEvenYear
  };
}

// ---------------------------------------------------------------------------
// 3. formatTCOForChart
// ---------------------------------------------------------------------------

/**
 * Format two TCO results for ECharts stacked bar + cumulative line chart.
 *
 * @param {Object} hangchiTCO      - TCO result from calculateTCO
 * @param {Object} competitorTCO   - TCO result from calculateTCO
 * @param {string} competitorName  - Display name for the competitor
 * @returns {Object} Chart-ready data structure
 */
export function formatTCOForChart(hangchiTCO, competitorTCO, competitorName = '竞品') {
  const h = hangchiTCO  || {};
  const c = competitorTCO || {};

  const years = (h.breakdown || []).map(b => b.year);

  return {
    categories: ['杭齿', competitorName],
    stackedData: {
      purchase:    [h.purchaseCost    || 0, c.purchaseCost    || 0],
      maintenance: [h.maintenanceCost || 0, c.maintenanceCost || 0],
      overhaul:    [h.overhaulCost    || 0, c.overhaulCost    || 0],
      spareParts:  [h.sparePartsCost  || 0, c.sparePartsCost  || 0],
      downtime:    [h.downtimeCost    || 0, c.downtimeCost    || 0]
    },
    cumulativeData: {
      years,
      hangchi:    (h.breakdown || []).map(b => b.cumulative),
      competitor: (c.breakdown || []).map(b => b.cumulative)
    }
  };
}
