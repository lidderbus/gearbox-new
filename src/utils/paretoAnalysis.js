// src/utils/paretoAnalysis.js
// Multi-objective Pareto front analysis for gearbox selection

/**
 * Check if solution A dominates solution B
 * A dominates B if A is at least as good on all objectives and strictly better on at least one
 */
function dominates(a, b, objectives) {
  let atLeastOneBetter = false;
  for (const obj of objectives) {
    const va = a[obj.key] ?? (obj.direction === 'min' ? Infinity : -Infinity);
    const vb = b[obj.key] ?? (obj.direction === 'min' ? Infinity : -Infinity);
    if (obj.direction === 'min') {
      if (va > vb) return false; // A is worse
      if (va < vb) atLeastOneBetter = true;
    } else {
      if (va < vb) return false;
      if (va > vb) atLeastOneBetter = true;
    }
  }
  return atLeastOneBetter;
}

/**
 * Compute Pareto front (non-dominated solutions)
 * @param {Array} solutions - Array of recommendation objects
 * @param {Array} objectives - [{key, direction:'min'|'max', label}]
 * @returns {{ paretoFront: Array, dominated: Array }}
 */
export function computeParetoFront(solutions, objectives) {
  if (!solutions || solutions.length === 0) return { paretoFront: [], dominated: [] };

  const valid = solutions.filter(s => objectives.every(o => s[o.key] != null && !isNaN(s[o.key])));
  if (valid.length === 0) return { paretoFront: [], dominated: [] };

  const paretoFront = [];
  const dominated = [];

  for (let i = 0; i < valid.length; i++) {
    let isDominated = false;
    for (let j = 0; j < valid.length; j++) {
      if (i !== j && dominates(valid[j], valid[i], objectives)) {
        isDominated = true;
        break;
      }
    }
    if (isDominated) dominated.push(valid[i]);
    else paretoFront.push(valid[i]);
  }

  return { paretoFront, dominated };
}

/**
 * Compute ideal and nadir points for normalization
 */
export function computeBounds(solutions, objectives) {
  const ideal = {};
  const nadir = {};
  for (const obj of objectives) {
    const values = solutions.map(s => s[obj.key]).filter(v => v != null && !isNaN(v));
    if (values.length === 0) {
      ideal[obj.key] = 0;
      nadir[obj.key] = 1;
      continue;
    }
    if (obj.direction === 'min') {
      ideal[obj.key] = Math.min(...values);
      nadir[obj.key] = Math.max(...values);
    } else {
      ideal[obj.key] = Math.max(...values);
      nadir[obj.key] = Math.min(...values);
    }
  }
  return { ideal, nadir };
}

/**
 * Compute weighted trade-off score using Chebyshev scalarization
 * Lower score = better (closer to ideal point)
 */
export function computeTradeoffScore(solution, objectives, weights, bounds) {
  let maxWeightedDist = 0;
  for (let i = 0; i < objectives.length; i++) {
    const obj = objectives[i];
    const w = weights[i] || 1;
    const val = solution[obj.key] ?? 0;
    const range = Math.abs(bounds.nadir[obj.key] - bounds.ideal[obj.key]) || 1;
    const normalized = Math.abs(val - bounds.ideal[obj.key]) / range;
    maxWeightedDist = Math.max(maxWeightedDist, w * normalized);
  }
  return maxWeightedDist;
}

/** Default objectives for gearbox selection */
export const DEFAULT_OBJECTIVES = [
  { key: 'weight', direction: 'min', label: '重量(kg)', color: '#5470c6' },
  { key: 'factoryPrice', direction: 'min', label: '价格(元)', color: '#91cc75' },
  { key: 'capacityMargin', direction: 'max', label: '能力余量', color: '#fac858' },
];
