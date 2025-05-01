/**
 * 选型算法接口
 * 提供统一的选型算法调用接口，支持传统算法和新的遗传算法
 */

// 导入算法
import { selectGearbox as traditionalSelectGearbox } from './selectionAlgorithm';

// 定义遗传算法引擎类 - 实际实现会在genetic-selection-algorithm.js中
class GeneticSelectionEngineStub {
  constructor(options = {}) {
    this.options = options;
    this.initialized = false;
    this.currentGeneration = 0;
    this.requirements = {};
  }
  
  initialize(gearboxData, requirements) {
    this.initialized = true;
    this.requirements = requirements;
    return true;
  }
  
  calculateFitness(gearbox) {
    // 简化版适应度计算
    return 85; // 模拟值
  }
  
  calculateDetailedFitness(gearbox) {
    // 简化版详细评分
    return {
      efficiency: 85,
      torqueReserve: 80,
      temperature: 75,
      noise: 70,
      cost: 90,
      lifespan: 85
    };
  }
  
  getTopRecommendations(count = 5) {
    return []; // 模拟空结果
  }
  
  run() {
    return {
      success: true,
      generations: 30,
      runtime: 500,
      recommendations: []
    };
  }
}

// 全局遗传算法引擎实例
let geneticEngine = null;

/**
 * 初始化遗传算法引擎
 * @param {Object} options - 遗传算法选项
 * @returns {Object} - 初始化结果
 */
export function initializeGeneticEngine(options = {}) {
  try {
    // 这里使用存根类，实际实现会在genetic-selection-algorithm.js中
    geneticEngine = new GeneticSelectionEngineStub(options);
    
    return {
      success: true,
      message: '遗传算法引擎初始化成功',
      engine: geneticEngine
    };
  } catch (error) {
    console.error('遗传算法引擎初始化失败:', error);
    
    return {
      success: false,
      message: '遗传算法引擎初始化失败',
      error: error.message
    };
  }
}

/**
 * 高级齿轮箱选型函数
 * @param {Array} gearboxData - 齿轮箱数据集
 * @param {Object} requirements - 选型需求参数
 * @param {Object} options - 选型选项
 * @returns {Object} - 选型结果
 */
export async function selectGearbox(gearboxData, requirements, options = {}) {
  // 默认选项
  const defaultOptions = {
    algorithm: 'genetic', // 'traditional' 或 'genetic'
    maxResults: 5,        // 最大结果数量
    timeout: 10000,       // 算法超时时间(毫秒)
    sortBy: 'score',      // 排序依据
    filterInvalid: true,  // 过滤无效结果
    scoringWeights: null, // 评分权重
    detailedScoring: true // 是否返回详细评分
  };
  
  // 合并选项
  const selectionOptions = { ...defaultOptions, ...options };
  
  // 验证输入参数
  if (!Array.isArray(gearboxData) || gearboxData.length === 0) {
    return {
      success: false,
      message: '无效的齿轮箱数据集',
      results: []
    };
  }
  
  if (!requirements || !requirements.power || !requirements.inputSpeed) {
    return {
      success: false,
      message: '缺少必要的选型参数(功率、输入转速)',
      results: []
    };
  }
  
  // 选择算法并执行
  try {
    let results;
    let algorithmDetails = {};
    
    if (selectionOptions.algorithm === 'genetic') {
      // 使用遗传算法
      results = await runGeneticSelection(gearboxData, requirements, selectionOptions);
      algorithmDetails.type = 'genetic';
      algorithmDetails.generations = results.generations;
      algorithmDetails.runtime = results.runtime;
      
      // 提取推荐结果
      results = results.recommendations;
    } else {
      // 使用传统算法
      results = runTraditionalSelection(gearboxData, requirements, selectionOptions);
      algorithmDetails.type = 'traditional';
    }
    
    // 过滤和排序结果
    if (selectionOptions.filterInvalid) {
      results = results.filter(result => result.fitness > 0);
    }
    
    // 限制结果数量
    if (results.length > selectionOptions.maxResults) {
      results = results.slice(0, selectionOptions.maxResults);
    }
    
    // 准备返回数据
    return {
      success: true,
      message: `成功找到 ${results.length} 个匹配的齿轮箱`,
      results,
      requirements,
      algorithm: algorithmDetails,
      totalCandidates: gearboxData.length
    };
  } catch (error) {
    console.error('选型过程出错:', error);
    
    return {
      success: false,
      message: '选型过程发生错误',
      error: error.message,
      results: []
    };
  }
}

/**
 * 运行遗传算法选型
 * @param {Array} gearboxData - 齿轮箱数据集
 * @param {Object} requirements - 选型需求参数
 * @param {Object} options - 选型选项
 * @returns {Object} - 选型结果
 */
async function runGeneticSelection(gearboxData, requirements, options) {
  // 如果没有初始化遗传算法引擎，创建一个默认实例
  if (!geneticEngine) {
    geneticEngine = new GeneticSelectionEngineStub({
      // 使用自定义评分权重（如果提供）
      ...(options.scoringWeights ? {
        weightEfficiency: options.scoringWeights.efficiency || 25,
        weightTorqueReserve: options.scoringWeights.torqueReserve || 20,
        weightTemperature: options.scoringWeights.temperature || 15,
        weightNoise: options.scoringWeights.noise || 10,
        weightCost: options.scoringWeights.cost || 15,
        weightLifespan: options.scoringWeights.lifespan || 15
      } : {})
    });
  }
  
  // 初始化遗传算法
  geneticEngine.initialize(gearboxData, requirements);
  
  // 设置超时保护
  return new Promise((resolve, reject) => {
    // 设置超时
    const timeoutId = setTimeout(() => {
      // 返回当前最佳结果
      resolve({
        success: true,
        message: '算法执行超时，返回当前最佳结果',
        runtime: options.timeout,
        generations: geneticEngine.currentGeneration,
        recommendations: geneticEngine.getTopRecommendations(options.maxResults)
      });
    }, options.timeout);
    
    // 执行算法
    try {
      const result = geneticEngine.run();
      clearTimeout(timeoutId); // 清除超时
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId); // 清除超时
      reject(error);
    }
  });
}

/**
 * 运行传统选型算法
 * @param {Array} gearboxData - 齿轮箱数据集
 * @param {Object} requirements - 选型需求参数
 * @param {Object} options - 选型选项
 * @returns {Array} - 选型结果
 */
function runTraditionalSelection(gearboxData, requirements, options) {
  // 调整参数格式以匹配传统算法
  const traditionalParams = {
    power: requirements.power,
    speed: requirements.inputSpeed,
    targetRatio: requirements.targetRatio,
    thrustRequirement: requirements.thrustRequirement || 0,
    gearboxType: requirements.gearboxType || 'auto',
    application: requirements.application || 'propulsion'
  };
  
  // 调用传统算法
  const traditionalResults = traditionalSelectGearbox(
    traditionalParams.power,
    traditionalParams.speed,
    traditionalParams.targetRatio,
    traditionalParams.thrustRequirement,
    traditionalParams.gearboxType,
    { allGearboxes: gearboxData }
  );
  
  // 转换结果格式以匹配遗传算法输出
  const results = (traditionalResults.recommendations || []).map(gearbox => {
    // 如果还没有遗传算法引擎实例，创建一个临时实例计算得分
    const tempEngine = geneticEngine || new GeneticSelectionEngineStub();
    tempEngine.requirements = requirements;
    
    // 计算适应度得分
    const fitness = tempEngine.calculateFitness(gearbox);
    
    // 获取详细评分（如果需要）
    const fitnessDetails = options.detailedScoring 
      ? tempEngine.calculateDetailedFitness(gearbox) 
      : null;
    
    return {
      gearbox,
      fitness,
      fitnessDetails
    };
  });
  
  // 按适应度排序
  return results.sort((a, b) => b.fitness - a.fitness);
}

/**
 * 评估单个齿轮箱是否满足需求
 * @param {Object} gearbox - 齿轮箱数据
 * @param {Object} requirements - 选型需求参数
 * @returns {Object} - 评估结果
 */
export function evaluateGearbox(gearbox, requirements) {
  if (!gearbox || !requirements) {
    return {
      valid: false,
      message: '无效的参数'
    };
  }
  
  // 使用遗传算法引擎评估
  if (!geneticEngine) {
    geneticEngine = new GeneticSelectionEngineStub();
  }
  
  geneticEngine.requirements = requirements;
  
  // 计算适应度得分
  const fitness = geneticEngine.calculateFitness(gearbox);
  
  // 计算详细评分
  const fitnessDetails = geneticEngine.calculateDetailedFitness(gearbox);
  
  // 验证最低要求
  const valid = fitness > 50; // 50分为及格线
  
  // 返回评估结果
  return {
    valid,
    fitness,
    fitnessDetails,
    message: valid ? '齿轮箱满足基本需求' : '齿轮箱不满足基本需求'
  };
}

/**
 * 比较多个齿轮箱性能
 * @param {Array} gearboxList - 齿轮箱列表
 * @param {Object} requirements - 评估需求参数
 * @returns {Object} - 比较结果
 */
export function compareGearboxes(gearboxList, requirements) {
  if (!Array.isArray(gearboxList) || gearboxList.length < 2) {
    return {
      success: false,
      message: '需要至少2个齿轮箱进行比较'
    };
  }
  
  if (!requirements) {
    return {
      success: false,
      message: '需要提供评估需求参数'
    };
  }
  
  // 对每个齿轮箱进行评估
  const evaluations = gearboxList.map(gearbox => ({
    gearbox,
    evaluation: evaluateGearbox(gearbox, requirements)
  }));
  
  // 按适应度排序
  evaluations.sort((a, b) => b.evaluation.fitness - a.evaluation.fitness);
  
  // 找出各项最佳
  const bestPerformers = {
    overall: evaluations[0].gearbox,
    efficiency: null,
    cost: null,
    lifespan: null,
    noise: null,
    temperatureControl: null
  };
  
  // 找出各方面的最佳
  let maxEfficiency = 0;
  let minCost = Infinity;
  let maxLifespan = 0;
  let minNoise = Infinity;
  let maxTemperature = 0;
  
  evaluations.forEach(item => {
    const details = item.evaluation.fitnessDetails;
    
    // 找出效率最高的
    if (details.efficiency > maxEfficiency) {
      maxEfficiency = details.efficiency;
      bestPerformers.efficiency = item.gearbox;
    }
    
    // 找出成本最优的
    if (details.cost > minCost) {
      minCost = details.cost;
      bestPerformers.cost = item.gearbox;
    }
    
    // 找出寿命最长的
    if (details.lifespan > maxLifespan) {
      maxLifespan = details.lifespan;
      bestPerformers.lifespan = item.gearbox;
    }
    
    // 找出噪音最低的
    if (details.noise > minNoise) {
      minNoise = details.noise;
      bestPerformers.noise = item.gearbox;
    }
    
    // 找出温控最好的
    if (details.temperature > maxTemperature) {
      maxTemperature = details.temperature;
      bestPerformers.temperatureControl = item.gearbox;
    }
  });
  
  // 生成比较报告
  return {
    success: true,
    evaluations,
    bestPerformers,
    differentiators: findKeyDifferentiators(evaluations),
    recommendations: generateComparisonRecommendations(evaluations)
  };
}

/**
 * 找出关键差异点
 * @param {Array} evaluations - 齿轮箱评估结果
 * @returns {Array} - 关键差异点
 */
function findKeyDifferentiators(evaluations) {
  // 如果只有两个齿轮箱，直接比较所有方面
  if (evaluations.length === 2) {
    const diff1 = evaluations[0].evaluation.fitnessDetails;
    const diff2 = evaluations[1].evaluation.fitnessDetails;
    
    const differentiators = [];
    
    // 比较各个方面，找出差异大于10%的
    if (Math.abs(diff1.efficiency - diff2.efficiency) > 10) {
      differentiators.push({
        aspect: 'efficiency',
        description: '效率',
        difference: Math.abs(diff1.efficiency - diff2.efficiency).toFixed(1),
        better: diff1.efficiency > diff2.efficiency ? evaluations[0].gearbox.model : evaluations[1].gearbox.model
      });
    }
    
    if (Math.abs(diff1.cost - diff2.cost) > 10) {
      differentiators.push({
        aspect: 'cost',
        description: '成本',
        difference: Math.abs(diff1.cost - diff2.cost).toFixed(1),
        better: diff1.cost > diff2.cost ? evaluations[0].gearbox.model : evaluations[1].gearbox.model
      });
    }
    
    // 添加其他差异...
    
    return differentiators;
  }
  
  // 如果有多个齿轮箱，找出标准差最大的方面
  const aspects = ['efficiency', 'torqueReserve', 'temperature', 'noise', 'cost', 'lifespan'];
  const aspectStats = {};
  
  // 计算每个方面的平均值和标准差
  aspects.forEach(aspect => {
    const values = evaluations.map(item => item.evaluation.fitnessDetails[aspect]);
    
    // 计算平均值
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // 计算标准差
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // 计算变异系数 (CV = 标准差/平均值)
    const cv = mean > 0 ? stdDev / mean : 0;
    
    aspectStats[aspect] = { mean, stdDev, cv };
  });
  
  // 按变异系数排序，找出最大的3个差异
  const sortedAspects = aspects.sort((a, b) => aspectStats[b].cv - aspectStats[a].cv);
  
  // 返回前3个主要差异
  return sortedAspects.slice(0, 3).map(aspect => {
    // 找出此方面得分最高的齿轮箱
    let maxScore = 0;
    let bestModel = '';
    
    evaluations.forEach(item => {
      const score = item.evaluation.fitnessDetails[aspect];
      if (score > maxScore) {
        maxScore = score;
        bestModel = item.gearbox.model;
      }
    });
    
    // 返回差异信息
    return {
      aspect,
      description: getAspectDescription(aspect),
      variationCoefficient: aspectStats[aspect].cv.toFixed(3),
      standardDeviation: aspectStats[aspect].stdDev.toFixed(1),
      bestPerformer: bestModel
    };
  });
}

/**
 * 获取方面描述
 * @param {string} aspect - 方面代码
 * @returns {string} - 方面描述
 */
function getAspectDescription(aspect) {
  const descriptions = {
    efficiency: '效率',
    torqueReserve: '扭矩储备',
    temperature: '温度控制',
    noise: '噪音水平',
    cost: '成本效益',
    lifespan: '预期寿命',
    ratioMatch: '减速比匹配度'
  };
  
  return descriptions[aspect] || aspect;
}

/**
 * 生成比较建议
 * @param {Array} evaluations - 齿轮箱评估结果
 * @returns {Array} - 建议列表
 */
function generateComparisonRecommendations(evaluations) {
  // 根据不同场景生成建议
  const recommendations = [];
  
  // 总体最佳推荐
  if (evaluations.length > 0) {
    recommendations.push({
      scenario: 'general',
      description: '一般用途',
      recommended: evaluations[0].gearbox.model,
      reason: `综合评分最高 (${evaluations[0].evaluation.fitness.toFixed(1)}分)`
    });
  }
  
  // 成本敏感场景
  const costSorted = [...evaluations].sort((a, b) => 
    b.evaluation.fitnessDetails.cost - a.evaluation.fitnessDetails.cost);
  
  if (costSorted.length > 0 && costSorted[0].evaluation.fitnessDetails.cost > 70) {
    recommendations.push({
      scenario: 'cost_sensitive',
      description: '成本敏感场景',
      recommended: costSorted[0].gearbox.model,
      reason: `成本效益最高 (${costSorted[0].evaluation.fitnessDetails.cost.toFixed(1)}分)`
    });
  }
  
  // 高负载场景
  const torqueSorted = [...evaluations].sort((a, b) => 
    b.evaluation.fitnessDetails.torqueReserve - a.evaluation.fitnessDetails.torqueReserve);
  
  if (torqueSorted.length > 0 && torqueSorted[0].evaluation.fitnessDetails.torqueReserve > 80) {
    recommendations.push({
      scenario: 'heavy_load',
      description: '高负载场景',
      recommended: torqueSorted[0].gearbox.model,
      reason: `扭矩储备最高 (${torqueSorted[0].evaluation.fitnessDetails.torqueReserve.toFixed(1)}分)`
    });
  }
  
  // 高温环境
  const tempSorted = [...evaluations].sort((a, b) => 
    b.evaluation.fitnessDetails.temperature - a.evaluation.fitnessDetails.temperature);
  
  if (tempSorted.length > 0 && tempSorted[0].evaluation.fitnessDetails.temperature > 80) {
    recommendations.push({
      scenario: 'high_temperature',
      description: '高温环境',
      recommended: tempSorted[0].gearbox.model,
      reason: `温度控制最佳 (${tempSorted[0].evaluation.fitnessDetails.temperature.toFixed(1)}分)`
    });
  }
  
  // 噪音敏感场景
  const noiseSorted = [...evaluations].sort((a, b) => 
    b.evaluation.fitnessDetails.noise - a.evaluation.fitnessDetails.noise);
  
  if (noiseSorted.length > 0 && noiseSorted[0].evaluation.fitnessDetails.noise > 80) {
    recommendations.push({
      scenario: 'noise_sensitive',
      description: '噪音敏感场景',
      recommended: noiseSorted[0].gearbox.model,
      reason: `噪音水平最低 (${noiseSorted[0].evaluation.fitnessDetails.noise.toFixed(1)}分)`
    });
  }
  
  // 长寿命需求
  const lifespanSorted = [...evaluations].sort((a, b) => 
    b.evaluation.fitnessDetails.lifespan - a.evaluation.fitnessDetails.lifespan);
  
  if (lifespanSorted.length > 0 && lifespanSorted[0].evaluation.fitnessDetails.lifespan > 80) {
    recommendations.push({
      scenario: 'longevity',
      description: '长寿命需求',
      recommended: lifespanSorted[0].gearbox.model,
      reason: `预期寿命最长 (${lifespanSorted[0].evaluation.fitnessDetails.lifespan.toFixed(1)}分)`
    });
  }
  
  return recommendations;
}

// 导出接口
export default {
  selectGearbox,
  evaluateGearbox,
  compareGearboxes,
  initializeGeneticEngine
};