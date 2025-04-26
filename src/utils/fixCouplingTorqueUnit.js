// fixCouplingTorqueUnit.js
// 修复联轴器扭矩单位(torqueUnit)字段缺失问题

/**
 * 为所有联轴器添加扭矩单位(torqueUnit)字段
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复后的数据对象
 */
export const fixCouplingTorqueUnit = (data) => {
  if (!data || !Array.isArray(data.flexibleCouplings)) {
    console.error("数据无效或不包含联轴器数组");
    return data;
  }

  let patchedCount = 0;
  const warnings = [];

  // 为每个联轴器添加torqueUnit字段
  const fixedCouplings = data.flexibleCouplings.map(coupling => {
    if (!coupling || !coupling.model) {
      warnings.push("跳过无效联轴器项（无model字段）");
      return coupling;
    }

    // 如果已经有扭矩单位字段，检查其有效性
    if (coupling.torqueUnit) {
      // 确保单位标准化
      const normalizedUnit = normalizeUnit(coupling.torqueUnit);
      if (normalizedUnit !== coupling.torqueUnit) {
        const fixed = { ...coupling, torqueUnit: normalizedUnit };
        patchedCount++;
        return fixed;
      }
      return coupling;
    }

    // 判断扭矩值大小，推断合适的单位
    let torque = parseFloat(coupling.torque);
    let unit = 'kN·m'; // 默认使用kN·m作为单位

    // 如果扭矩值异常大，可能是N·m单位
    if (torque > 100) {
      warnings.push(`联轴器 ${coupling.model} 扭矩值(${torque})较大，推断单位为N·m，已转换为kN·m`);
      torque = torque / 1000;
      unit = 'kN·m';
    } 
    // 如果扭矩值在合理范围，使用kN·m
    else if (torque > 0 && torque <= 100) {
      unit = 'kN·m';
    }

    const fixed = { 
      ...coupling, 
      torqueUnit: unit,
      // 如果扭矩已转换，更新扭矩值
      ...(torque !== parseFloat(coupling.torque) ? { torque } : {})
    };

    patchedCount++;
    return fixed;
  });

  // 创建修复后的数据
  const fixedData = {
    ...data,
    flexibleCouplings: fixedCouplings
  };

  console.log(`联轴器扭矩单位修复完成: ${patchedCount}个联轴器已修复，${warnings.length}个警告`);
  
  return {
    data: fixedData,
    summary: {
      patched: patchedCount,
      warnings
    }
  };
};

/**
 * 标准化扭矩单位字符串
 * @param {string} unit 原始单位字符串
 * @returns {string} 标准化后的单位字符串
 */
function normalizeUnit(unit) {
  if (!unit) return 'kN·m';
  
  const unitLower = unit.toLowerCase().trim();
  
  // 标准化为kN·m
  if (unitLower.includes('kn') && (unitLower.includes('m') || unitLower.includes('·m'))) {
    return 'kN·m';
  }
  
  // 标准化为N·m
  if ((unitLower.includes('n') && (unitLower.includes('m') || unitLower.includes('·m'))) && 
      !unitLower.includes('kn')) {
    return 'N·m';
  }
  
  // 默认使用kN·m
  return 'kN·m';
}

/**
 * 批量修复联轴器扭矩单位并转换不一致的扭矩值
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复后的数据对象
 */
export const fixAllCouplingUnits = (data) => {
  if (!data) return { data: {}, patched: 0, warnings: [] };
  
  // 标准化单位和转换扭矩值
  const result = fixCouplingTorqueUnit(data);
  const fixedData = result.data;
  
  // 如果需要，可以在这里添加更多的修复逻辑
  
  return {
    data: fixedData,
    patched: result.summary.patched,
    warnings: result.summary.warnings
  };
};

// 导出默认函数
export default fixAllCouplingUnits;