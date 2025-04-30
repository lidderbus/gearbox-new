/**
 * 文件: src/utils/enhancedPumpSelection.js
 * 描述: 增强版备用泵选型功能，严格符合官方配置标准
 */

/**
 * 精确的齿轮箱与备用泵对应关系
 * 基于官方提供的匹配表
 */
const pumpMatchingRules = {
  // GW系列齿轮箱与备用泵对应关系
  GW: [
    {
      range: ['GW28.30', 'GW45.49'],
      pumpModel: '2CY-7.5/2.5D',
      altModels: ['2CY-7.5/2.5'] // 备选型号
    },
    {
      range: ['GW49.54', 'GW52.62'],
      pumpModel: '2CY-14.2/2.5D',
      altModels: ['2CY-14.2/2.5'] // 备选型号
    },
    {
      range: ['GW60.66', 'GW60.74'],
      pumpModel: '2CY-19.2/2.5D',
      altModels: ['2CY-19.2/2.5'] // 备选型号
    },
    {
      range: ['GW63.71', 'GW999.99'],
      pumpModel: '2CY-24.8/2.5D',
      altModels: ['2CY-24.8/2.5'] // 备选型号
    }
  ],

  // HC系列齿轮箱与备用泵对应关系 - 仅限特定系列
  HC: [
    {
      series: '1000-1200',
      pumpModel: '2CY-5/2.5D',
      altModels: ['2CY-5/2.5'] // 备选型号
    },
    {
      series: '1400-2000',
      pumpModel: '2CY-7.5/2.5D',
      altModels: ['2CY-7.5/2.5'] // 备选型号
    },
    {
      series: '2700',
      pumpModel: '2CY-14.2/2.5D',
      altModels: ['2CY-14.2/2.5'] // 备选型号
    }
  ],

  // DT系列齿轮箱与备用泵对应关系
  DT: [
    {
      range: ['DT180', 'DT770'],
      pumpModel: '2CYA-1.1/0.8D',
      altModels: ['2CYA-1.1/0.8'] // 备选型号
    },
    {
      range: ['DT900', 'DT1400'],
      pumpModel: '2CYA-1.7/0.8D',
      altModels: ['2CYA-1.7/0.8'] // 备选型号
    },
    {
      range: ['DT1500', 'DT2400'],
      pumpModel: '2CYA-2.2/1D',
      altModels: ['2CYA-2.2/1'] // 备选型号
    }
  ]
};

/**
 * 备用泵型号替代规则：定义型号互相替代的规则
 * 当在泵列表中无法找到精确匹配的型号时使用
 */
const pumpAlternativeRules = [
  // 2CY系列替代规则
  {
    pattern: /^2CY-(\d+(\.\d+)?)\//i,
    alternativeFormats: [
      (matched) => `2CY-${matched[1]}/2.5`,
      (matched) => `2CY-${matched[1]}/2.5D`,
      (matched) => `2CY ${matched[1]}/2.5D`,
      (matched) => `2CY${matched[1]}/2.5D`
    ]
  },
  // 2CYA系列替代规则
  {
    pattern: /^2CYA-(\d+(\.\d+)?)\//i,
    alternativeFormats: [
      (matched) => `2CYA-${matched[1]}/0.8`,
      (matched) => `2CYA-${matched[1]}/0.8D`,
      (matched) => `2CYA-${matched[1]}/1`,
      (matched) => `2CYA-${matched[1]}/1D`,
      (matched) => `2CYA ${matched[1]}/0.8D`,
      (matched) => `2CYA${matched[1]}/0.8D`
    ]
  }
];

/**
 * 获取标准折扣率函数
 * 根据型号返回标准的折扣率
 * @param {string} modelName - 设备型号
 * @returns {number} - 标准折扣率（小数形式）
 */
function getStandardDiscountRate(modelName) {
  // 简单实现：默认返回0.85作为标准折扣率
  // 实际应用中可能需要根据不同型号系列返回不同的折扣率
  return 0.85;
}

/**
 * 判断给定齿轮箱型号是否需要备用泵
 * 严格按照官方配置要求判断
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Object} options - 附加选项，包括功率等信息
 * @returns {boolean} - 是否需要备用泵
 */
export const needsStandbyPump = (gearboxModel, options = {}) => {
  if (!gearboxModel) return false;

  const normalizedModel = gearboxModel.toUpperCase().trim();

  // GW系列和GC系列都需要备用泵
  if (normalizedModel.startsWith('GW') || normalizedModel.startsWith('GC')) {
    return true;
  }

  // HC系列只有指定型号需要备用泵
  if (normalizedModel.startsWith('HC')) {
    // 只有HC1000-1200, HC1400-2000, HC2700系列需要备用泵
    const seriesMatch = normalizedModel.match(/HC(\d+)/i);
    if (seriesMatch) {
      const seriesNum = parseInt(seriesMatch[1]);

      if ((seriesNum >= 1000 && seriesNum <= 1200) ||
          (seriesNum >= 1400 && seriesNum <= 2000) ||
          (seriesNum >= 2700 && seriesNum < 2800)) {
        return true;
      }
    }
    return false; // 其他HC系列不需要
  }

  // DT系列范围内的需要备用泵
  if (normalizedModel.startsWith('DT')) {
    const seriesMatch = normalizedModel.match(/DT(\d+)/i);
    if (seriesMatch) {
      const seriesNum = parseInt(seriesMatch[1]);
      if ((seriesNum >= 180 && seriesNum <= 770) ||
          (seriesNum >= 900 && seriesNum <= 1400) ||
          (seriesNum >= 1500 && seriesNum <= 2400)) {
        return true;
      }
    }
    return false; // 其他DT系列不需要
  }

  // HCM和HCQ系列的小型号不需要备用泵
  if (normalizedModel.startsWith('HCM') || normalizedModel.startsWith('HCQ')) {
    const seriesMatch = normalizedModel.match(/(HCM|HCQ)(\d+)/i);
    if (seriesMatch) {
      const seriesNum = parseInt(seriesMatch[2]);
      if (seriesNum < 300) {
        return false; // 小于300的型号不需要
      }
      return true; // 大于等于300的型号需要
    }
    return false;
  }

  // 其他系列基于功率判断
  if (options && options.power && options.power >= 600) {
    return true; // 功率大于等于600kW的需要备用泵
  }

  // 其他情况默认不需要备用泵
  return false;
};

/**
 * 增强版备用泵选型函数
 * 根据齿轮箱型号智能选择匹配的备用泵，首先判断是否需要备用泵
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Array} pumpList - 备用泵列表
 * @param {Object} options - 选型选项，包含齿轮箱功率等信息
 * @returns {Object} - 匹配的备用泵对象
 */
export const enhancedSelectPump = (gearboxModel, pumpList, options = {}) => {
  // 验证输入
  if (!gearboxModel || typeof gearboxModel !== 'string') {
    console.error('无效的齿轮箱型号');
    return {
      success: false,
      message: '无效的齿轮箱型号',
      recommendations: [],
      requiresPump: false // 明确标记为不需要泵
    };
  }

  // 首先判断是否需要备用泵
  const requiresPump = needsStandbyPump(gearboxModel, options);

  if (!requiresPump) {
    console.log(`齿轮箱 ${gearboxModel} 不需要配备备用泵`);
    return {
      success: true, // 选型流程成功，但结果是不需要泵
      message: `齿轮箱 ${gearboxModel} 不需要配备备用泵`,
      requiresPump: false,
      recommendations: [] // 不需要泵时没有推荐型号
    };
  }

  // 如果需要备用泵，但泵列表无效，则无法进行选型
  if (!Array.isArray(pumpList) || pumpList.length === 0) {
      console.error('备用泵列表为空或无效，无法为需要备用泵的齿轮箱进行选型');
      return {
          success: false,
          message: '备用泵列表为空或无效，无法进行备用泵选型',
          recommendations: [],
          requiresPump: true // 标记为需要泵但选型失败
      };
  }

  // 记录开始的日志
  console.log(`开始为齿轮箱 ${gearboxModel} 选择备用泵 (需要备用泵)...`);

  // 标准化齿轮箱型号（去除空格和转为大写）
  const normalizedModel = gearboxModel.toUpperCase().trim();

  // 识别齿轮箱系列
  const seriesMatch = normalizedModel.match(/^([A-Z]+)/);
  const gearboxSeries = seriesMatch ? seriesMatch[1] : null;

  console.log(`识别的齿轮箱系列: ${gearboxSeries || '未识别'}`);

  // 初始化备选泵型号列表
  let candidatePumpModels = [];

  // 根据识别的系列和规则查找推荐的泵型号
  if (gearboxSeries && pumpMatchingRules[gearboxSeries]) {
    const seriesRules = pumpMatchingRules[gearboxSeries];

    // 根据系列规则进行匹配
    for (const rule of seriesRules) {
      // 对于有数值范围的规则
      if (rule.range) {
        // 解析齿轮箱型号中的数值
        let modelValue;

        if (gearboxSeries === 'GW') {
          // GW系列通常格式为GWxx.yy
          const gwMatch = normalizedModel.match(/GW(\d+\.\d+)/);
          modelValue = gwMatch ? parseFloat(gwMatch[1]) : null;
        } else {
          // 其他系列通常格式为XX数字
          const numMatch = normalizedModel.match(/[A-Z]+(\d+)/);
          modelValue = numMatch ? parseInt(numMatch[1]) : null;
        }

        // 如果成功解析出数值，检查是否在范围内
        if (modelValue !== null) {
          const lowerBound = rule.range[0];
          const upperBound = rule.range[1];

          // 提取范围边界值
          let lowerValue, upperValue;

          if (gearboxSeries === 'GW') {
            const lowerMatch = lowerBound.match(/GW(\d+\.\d+)/);
            const upperMatch = upperBound.match(/GW(\d+\.\d+)/);
            lowerValue = lowerMatch ? parseFloat(lowerMatch[1]) : 0;
            upperValue = upperMatch ? parseFloat(upperMatch[1]) : Infinity;
          } else {
            const lowerMatch = lowerBound.match(/[A-Z]+(\d+)/);
            const upperMatch = upperBound.match(/[A-Z]+(\d+)/);
            lowerValue = lowerMatch ? parseInt(lowerMatch[1]) : 0;
            upperValue = upperMatch ? parseInt(upperMatch[1]) : Infinity;
          }

          // 检查值是否在范围内
          if (modelValue >= lowerValue && modelValue <= upperValue) {
            console.log(`匹配到范围规则: ${lowerBound} - ${upperBound}`);
            candidatePumpModels.push({
              model: rule.pumpModel,
              score: 100, // 精确匹配得分最高
              matchType: '主要匹配',
              matchInfo: `在型号范围 ${lowerBound} - ${upperBound} 内`,
              requiresPump: true // 明确标记为需要泵
            });

            // 也添加备选型号，但降低得分
            if (rule.altModels && Array.isArray(rule.altModels)) {
              rule.altModels.forEach((altModel, index) => {
                candidatePumpModels.push({
                  model: altModel,
                  score: 95 - index * 3, // 备选型号得分降低
                  matchType: '备选匹配',
                  matchInfo: `主推型号 ${rule.pumpModel} 的备选型号`,
                  requiresPump: true // 明确标记为需要泵
                });
              });
            }
          }
        }
      }
      // 对于系列范围规则
      else if (rule.series) {
        // 解析范围字符串，通常格式为"起始-结束"
        const rangeMatch = rule.series.match(/(\d+)-(\d+)/);
        if (rangeMatch) {
          const seriesStart = parseInt(rangeMatch[1]);
          const seriesEnd = parseInt(rangeMatch[2]);

          // 从齿轮箱型号中提取系列号
          const seriesMatch = normalizedModel.match(/[A-Z]+(\d+)/);
          if (seriesMatch) {
            const seriesNum = parseInt(seriesMatch[1]);

            // 检查是否在范围内
            if (seriesNum >= seriesStart && seriesNum <= seriesEnd) {
              console.log(`匹配到系列规则: ${rule.series}`);
              candidatePumpModels.push({
                model: rule.pumpModel,
                score: 100,
                matchType: '主要匹配',
                matchInfo: `在系列范围 ${rule.series} 内`,
                requiresPump: true // 明确标记为需要泵
              });

              // 也添加备选型号，但降低得分
              if (rule.altModels && Array.isArray(rule.altModels)) {
                rule.altModels.forEach((altModel, index) => {
                  candidatePumpModels.push({
                    model: altModel,
                    score: 95 - index * 3,
                    matchType: '备选匹配',
                    matchInfo: `主推型号 ${rule.pumpModel} 的备选型号`,
                    requiresPump: true // 明确标记为需要泵
                  });
                });
              }
            }
          }
        }
        // 对于单一系列值
        else if (!isNaN(parseInt(rule.series))) {
          const seriesVal = parseInt(rule.series);

          // 从齿轮箱型号中提取系列号
          const seriesMatch = normalizedModel.match(/[A-Z]+(\d+)/);
          if (seriesMatch) {
            const seriesNum = parseInt(seriesMatch[1]);

            // 检查是否匹配
            if (seriesNum === seriesVal) {
              console.log(`匹配到系列规则: ${rule.series}`);
              candidatePumpModels.push({
                model: rule.pumpModel,
                score: 100,
                matchType: '主要匹配',
                matchInfo: `精确匹配系列 ${rule.series}`,
                requiresPump: true // 明确标记为需要泵
              });

              // 也添加备选型号，但降低得分
              if (rule.altModels && Array.isArray(rule.altModels)) {
                rule.altModels.forEach((altModel, index) => {
                  candidatePumpModels.push({
                    model: altModel,
                    score: 95 - index * 3,
                    matchType: '备选匹配',
                    matchInfo: `主推型号 ${rule.pumpModel} 的备选型号`,
                    requiresPump: true // 明确标记为需要泵
                  });
                });
              }
            }
          }
        }
      }
    }
  }

  // 对于GC系列类似于GW，需要根据型号估计对应的备用泵
  if (normalizedModel.startsWith('GC') && candidatePumpModels.length === 0) {
    console.log(`GC系列类似于GW系列，尝试根据型号估计对应的备用泵...`);

    const seriesMatch = normalizedModel.match(/GC(\d+)/);
    if (seriesMatch) {
      const seriesNum = parseInt(seriesMatch[1]);

      // 根据GC型号大小估计对应备用泵
      if (seriesNum <= 200) {
        candidatePumpModels.push({
          model: '2CY-1.1/2.5D',
          score: 90,
          matchType: '系列匹配',
          matchInfo: 'GC系列小型号对应的备用泵',
          requiresPump: true // 明确标记为需要泵
        });
      } else if (seriesNum <= 400) {
        candidatePumpModels.push({
          model: '2CY-3.3/2.5D',
          score: 90,
          matchType: '系列匹配',
          matchInfo: 'GC系列中型号对应的备用泵',
          requiresPump: true // 明确标记为需要泵
        });
      } else {
        candidatePumpModels.push({
          model: '2CY-7.5/2.5D',
          score: 90,
          matchType: '系列匹配',
          matchInfo: 'GC系列大型号对应的备用泵',
          requiresPump: true // 明确标记为需要泵
        });
      }
    }
  }

  // 如果没有找到合适的候选泵型号，使用默认备用泵
  if (candidatePumpModels.length === 0) {
    console.log(`未找到匹配规则，使用默认备用泵...`);
    candidatePumpModels.push({
      model: '2CY-7.5/2.5D', // 最通用的型号
      score: 60,
      matchType: '默认选择',
      matchInfo: '没有找到匹配规则，使用默认型号',
      requiresPump: true // 明确标记为需要泵
    });
  }

  // 在泵列表中查找匹配型号
  let matchedPumps = [];

  // 首先尝试精确匹配
  for (const candidate of candidatePumpModels) {
    const exactMatch = findExactPumpMatch(candidate.model, pumpList);

    if (exactMatch) {
      matchedPumps.push({
        ...exactMatch,
        score: candidate.score,
        matchType: candidate.matchType,
        matchInfo: candidate.matchInfo,
        requiresPump: true // 明确标记为需要泵
      });
    } else {
      // 如果没有精确匹配，尝试模糊匹配
      const fuzzyMatches = findFuzzyPumpMatches(candidate.model, pumpList);

      if (fuzzyMatches.length > 0) {
        // 将模糊匹配结果添加到候选列表
        fuzzyMatches.forEach((match) => {
          matchedPumps.push({
            ...match.pump,
            score: candidate.score * (match.similarity / 100), // 根据相似度调整得分
            matchType: '模糊匹配',
            matchInfo: `与 ${candidate.model} 相似度 ${match.similarity.toFixed(0)}%`,
            requiresPump: true // 明确标记为需要泵
          });
        });
      }
    }
  }

  // 如果没有找到任何匹配，尝试使用替代规则
  if (matchedPumps.length === 0) {
    console.log(`尝试使用替代规则寻找匹配...`);

    for (const candidate of candidatePumpModels) {
      const alternativeMatches = findAlternativePumpMatches(candidate.model, pumpList, pumpAlternativeRules);

      if (alternativeMatches.length > 0) {
        // 将替代匹配结果添加到matchedPumps，并去重
        alternativeMatches.forEach(match => {
             // 检查是否已经存在型号完全相同的匹配，避免重复
             const exists = matchedPumps.some(p => p.model.toUpperCase().replace(/\s+/g, '') === match.pump.model.toUpperCase().replace(/\s+/g, ''));
             if (!exists) {
                matchedPumps.push({
                     ...match.pump,
                     score: candidate.score * (match.score / 100), // 根据相似度调整得分
                     matchType: '替代匹配',
                     matchInfo: `${candidate.model} 的替代型号`,
                     requiresPump: true // 明确标记为需要泵
                });
             }
        });
      }
    }
  }

  // 排序筛选匹配的泵
  if (matchedPumps.length > 0) {
    // 按得分降序排序
    matchedPumps.sort((a, b) => b.score - a.score);

    // 获取最佳匹配
    const bestMatch = matchedPumps[0];

    // 获取推荐列表（最多5个）
    const recommendedPumps = matchedPumps.slice(0, 5);

    console.log(`找到最佳匹配泵: ${bestMatch.model}, 得分: ${bestMatch.score}`);

    // 确保价格字段存在
    const basePrice = bestMatch.basePrice || bestMatch.price || 0;
    const discountRate = bestMatch.discountRate || getStandardDiscountRate(bestMatch.model); // 使用标准折扣率
    const factoryPrice = bestMatch.factoryPrice || (basePrice * discountRate);
     // 估算市场价
    const marketPrice = bestMatch.marketPrice || (factoryPrice / (getStandardDiscountRate(bestMatch.model) * 0.85)); // 估算市场价

    // 构建结果对象
    return {
      success: true,
      model: bestMatch.model,
      flow: bestMatch.flow || 0,
      pressure: bestMatch.pressure || 0,
      motorPower: bestMatch.motorPower || 0,
      weight: bestMatch.weight || 0,
      basePrice: basePrice,
      price: basePrice, // price字段保留，可能某些地方还在用
      discountRate: discountRate,
      factoryPrice: factoryPrice,
      marketPrice: marketPrice,
      score: bestMatch.score,
      matchType: bestMatch.matchType,
      matchInfo: bestMatch.matchInfo,
      message: `已为齿轮箱 ${gearboxModel} 选择备用泵: ${bestMatch.model}`,
      recommendations: recommendedPumps,
      requiresPump: true // 明确标记为需要泵
    };
  }

  // 如果仍找不到匹配的泵型号，返回建议型号和失败状态
  console.warn(`在备用泵库中找不到匹配的泵，推荐型号为 ${candidatePumpModels.length > 0 ? candidatePumpModels[0].model : '2CY-7.5/2.5D'}`);
  return {
    success: false, // 选型失败，因为在列表中找不到对应的型号
    suggestedModel: candidatePumpModels.length > 0 ? candidatePumpModels[0].model : '2CY-7.5/2.5D',
    message: `在备用泵库中找不到匹配的泵，请手动选择或添加此型号 (推荐型号: ${candidatePumpModels.length > 0 ? candidatePumpModels[0].model : '2CY-7.5/2.5D'})`,
    recommendations: candidatePumpModels.map(c => ({
      model: c.model,
      score: c.score,
      matchType: c.matchType,
      matchInfo: c.matchInfo,
      requiresPump: true // 明确标记为需要泵
    })),
    requiresPump: true // 明确标记为需要泵，只是没找到匹配的型号
  };
};

/**
 * 在泵列表中查找精确匹配的泵型号
 * @param {string} targetModel - 目标泵型号
 * @param {Array} pumpList - 备用泵列表
 * @returns {Object|null} - 匹配的泵对象或null
 */
function findExactPumpMatch(targetModel, pumpList) {
  // 标准化目标型号（去除空格和大小写差异）
  const normalizedTarget = targetModel.replace(/\s+/g, '').toUpperCase();

  // 在列表中查找完全匹配的型号
  return pumpList.find(pump => {
    if (!pump || !pump.model) return false;
    const normalizedPumpModel = pump.model.replace(/\s+/g, '').toUpperCase();
    return normalizedPumpModel === normalizedTarget;
  });
}

/**
 * 在泵列表中查找模糊匹配的泵型号
 * @param {string} targetModel - 目标泵型号
 * @param {Array} pumpList - 备用泵列表
 * @returns {Array} - 匹配的泵对象数组，每个对象包含pump和similarity
 */
function findFuzzyPumpMatches(targetModel, pumpList) {
  // 标准化目标型号（去除空格）
  const normalizedTarget = targetModel.replace(/\s+/g, '').toUpperCase();

  // 提取型号的主要部分和能力数值
  const targetParts = normalizedTarget.split(/[-\/]/); // 按-或/分割
  const targetMainPart = targetParts[0] || '';
  // 尝试找到第一个数字部分作为容量
  const targetCapacityMatch = normalizedTarget.match(/([\d.]+)/);
  const targetCapacity = targetCapacityMatch ? targetCapacityMatch[1] : '';

  if (!targetMainPart || !targetCapacity) {
       // 如果没有主要部分或容量，尝试按整个字符串包含匹配，给较低得分
       const basicMatches = pumpList.filter(pump => {
           if (!pump || !pump.model) return false;
           const normalizedPumpModel = pump.model.replace(/\s+/g, '').toUpperCase();
           return normalizedPumpModel.includes(normalizedTarget);
       }).map(pump => ({ pump, similarity: 50 })); // 包含给50分
       return basicMatches;
  }

  // 模糊匹配结果数组
  const matches = [];

  // 检查每个泵
  pumpList.forEach(pump => {
    if (!pump || !pump.model) return;

    // 标准化泵型号
    const normalizedPumpModel = pump.model.replace(/\s+/g, '').toUpperCase();

    // 跳过精确匹配（这些在精确匹配阶段已处理）
    if (normalizedPumpModel === normalizedTarget) return;

    // 计算相似度分数
    let similarity = 0;

    // 检查主要部分匹配（例如2CY, 2CYA等）
    const pumpParts = normalizedPumpModel.split(/[-\/]/);
    const pumpMainPart = pumpParts[0] || '';

    if (pumpMainPart === targetMainPart) {
      similarity += 50; // 主要部分精确匹配给50分
    } else if (pumpMainPart.includes(targetMainPart) || targetMainPart.includes(pumpMainPart)) {
      similarity += 30; // 主要部分部分包含给30分
    }

    // 检查能力数值匹配
    const pumpCapacityMatch = normalizedPumpModel.match(/([\d.]+)/);
    const pumpCapacity = pumpCapacityMatch ? pumpCapacityMatch[1] : '';

    if (pumpCapacity === targetCapacity) {
      similarity += 50; // 能力数值精确匹配给50分
    } else if (pumpCapacity && targetCapacity) {
      // 数值相近性评分 (最多50分)
      const pumpCapacityNum = parseFloat(pumpCapacity);
      const targetCapacityNum = parseFloat(targetCapacity);

      if (!isNaN(pumpCapacityNum) && !isNaN(targetCapacityNum)) {
        const capacityRatio = Math.min(pumpCapacityNum, targetCapacityNum) / Math.max(pumpCapacityNum, targetCapacityNum);

        if (capacityRatio > 0.9) {
          similarity += 40; // 数值很接近 (80-100%)
        } else if (capacityRatio > 0.7) {
          similarity += 30; // 数值较接近 (70-90%)
        } else if (capacityRatio > 0.5) {
          similarity += 20; // 数值有一定差距 (50-70%)
        } else {
          similarity += 10; // 数值差距较大 (0-50%)
        }
         // 如果主要部分不匹配，降低能力数值匹配的权重
         if (pumpMainPart !== targetMainPart) {
             similarity -= 10; // 惩罚
         }
      }
    }

    // 确保相似度不为负
    similarity = Math.max(0, similarity);

    // 如果相似度大于等于阈值（60%），添加到匹配结果
    if (similarity >= 60) {
      matches.push({
        pump,
        similarity
      });
    }
  });

  // 按相似度降序排序
  matches.sort((a, b) => b.similarity - a.similarity);

  return matches;
}

/**
 * 使用替代规则查找匹配的泵
 * @param {string} targetModel - 目标泵型号
 * @param {Array} pumpList - 备用泵列表
 * @param {Array} rules - 替代规则
 * @returns {Array} - 匹配的泵数组, 每个对象包含pump和score
 */
function findAlternativePumpMatches(targetModel, pumpList, rules) {
  const matches = [];
  const processedAlternativeModels = new Set(); // 避免重复添加

  // 对每个规则进行检查
  for (const rule of rules) {
    const match = targetModel.match(rule.pattern);

    if (match) {
      // 生成替代型号
      for (const formatFn of rule.alternativeFormats) {
        try {
          const alternativeModel = formatFn(match);

          // 避免处理重复的替代型号
          if (processedAlternativeModels.has(alternativeModel.toUpperCase().replace(/\s+/g, ''))) {
            continue;
          }
          processedAlternativeModels.add(alternativeModel.toUpperCase().replace(/\s+/g, ''));

          // 检查替代型号是否在泵列表中
          const pump = findExactPumpMatch(alternativeModel, pumpList);

          if (pump) {
            matches.push({
              pump,
              score: 90, // 替代规则匹配给90分
              alternativeModel
            });
          }
        } catch (error) {
          console.warn(`替代规则格式化错误:`, error);
        }
      }
    }
  }

  return matches;
}

// 兼容性包装函数 - 与现有selectStandbyPump函数保持相同签名
export const selectStandbyPump = (gearboxModel, pumpList) => {
  return enhancedSelectPump(gearboxModel, pumpList);
};

// 导出用于其他模块的规则
export { pumpMatchingRules, pumpAlternativeRules };

// 默认导出主函数
export default enhancedSelectPump;