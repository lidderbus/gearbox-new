/**
 * 遗传算法选型引擎
 * 使用遗传算法优化齿轮箱选型过程，提供更精确的多参数平衡方案
 */

// 导入依赖项
import { calculateEfficiency } from '../utils/efficiencyUtils';
import { calculateTemperatureRise } from '../utils/thermalUtils';
import { calculateLifespan } from '../utils/lifespanUtils';
import { calculateTorqueReserve } from '../utils/torqueUtils';
import { calculateNoiseLevel } from '../utils/noiseUtils';

/**
 * 遗传算法选型引擎类
 */
export class GeneticSelectionEngine {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   */
  constructor(options = {}) {
    // 默认参数
    this.options = {
      populationSize: 50,        // 种群大小
      generations: 30,           // 最大迭代代数
      mutationRate: 0.1,         // 变异率
      crossoverRate: 0.8,        // 交叉率
      elitismCount: 5,           // 精英保留数量
      tournamentSize: 3,         // 锦标赛选择规模
      convergenceThreshold: 0.001, // 收敛阈值
      weightEfficiency: 25,      // 效率权重
      weightTorqueReserve: 20,   // 扭矩储备权重
      weightTemperature: 15,     // 温度权重
      weightNoise: 10,           // 噪音权重
      weightCost: 15,            // 成本权重
      weightLifespan: 15,        // 寿命权重
      ...options
    };
    
    // 内部状态
    this.population = [];        // 当前种群
    this.bestSolution = null;    // 最佳解决方案
    this.convergenceCounter = 0; // 收敛计数器
    this.currentGeneration = 0;  // 当前代数
    this.fitnessHistory = [];    // 适应度历史记录
    this.gearboxData = [];       // 齿轮箱数据集
    this.requirements = {};      // 选型需求
  }
  
  /**
   * 初始化算法
   * @param {Array} gearboxData - 齿轮箱数据集
   * @param {Object} requirements - 选型需求
   * @returns {boolean} - 初始化是否成功
   */
  initialize(gearboxData, requirements) {
    if (!Array.isArray(gearboxData) || gearboxData.length === 0) {
      console.error('无效的齿轮箱数据集');
      return false;
    }
    
    if (!requirements || !requirements.power || !requirements.inputSpeed) {
      console.error('无效的选型需求参数');
      return false;
    }
    
    this.gearboxData = gearboxData;
    this.requirements = requirements;
    
    // 重置内部状态
    this.population = [];
    this.bestSolution = null;
    this.convergenceCounter = 0;
    this.currentGeneration = 0;
    this.fitnessHistory = [];
    
    // 创建初始种群
    this.createInitialPopulation();
    
    return true;
  }
  
  /**
   * 创建初始种群
   */
  createInitialPopulation() {
    // 清空当前种群
    this.population = [];
    
    // 预筛选满足基本需求的齿轮箱
    const validGearboxes = this.prefilterGearboxes();
    
    if (validGearboxes.length === 0) {
      console.warn('没有找到满足基本需求的齿轮箱');
      // 放宽条件，使用全部数据
      this.population = this.gearboxData.map(gearbox => ({
        gearbox,
        fitness: 0 // 初始适应度为0
      }));
    } else {
      // 使用预筛选的齿轮箱创建初始种群
      this.population = validGearboxes.map(gearbox => ({
        gearbox,
        fitness: 0 // 初始适应度为0
      }));
    }
    
    // 如果预筛选结果少于种群大小，通过复制补充
    while (this.population.length < this.options.populationSize) {
      const randomIndex = Math.floor(Math.random() * validGearboxes.length);
      this.population.push({
        gearbox: validGearboxes[randomIndex],
        fitness: 0 // 初始适应度为0
      });
    }
    
    // 随机截断到种群大小
    if (this.population.length > this.options.populationSize) {
      this.population = this.population.slice(0, this.options.populationSize);
    }
    
    // 计算初始种群适应度
    this.evaluatePopulation();
  }
  
  /**
   * 预筛选满足基本需求的齿轮箱
   * @returns {Array} - 预筛选后的齿轮箱列表
   */
  prefilterGearboxes() {
    const { power, inputSpeed, targetRatio, thrustRequirement } = this.requirements;
    
    // 功率裕度系数 (允许功率比需求低10%，即0.9倍)
    const powerMargin = 0.9;
    // 转速裕度系数
    const speedMargin = 0.95;
    // 减速比容差
    const ratioTolerance = 0.15;
    
    return this.gearboxData.filter(gearbox => {
      // 基本功率要求
      if (gearbox.power < power * powerMargin) {
        return false;
      }
      
      // 基本转速要求
      if (gearbox.inputSpeed < inputSpeed * speedMargin) {
        return false;
      }
      
      // 减速比要求（如果有指定目标减速比）
      if (targetRatio && (
        gearbox.ratio < targetRatio * (1 - ratioTolerance) || 
        gearbox.ratio > targetRatio * (1 + ratioTolerance)
      )) {
        return false;
      }
      
      // 推力要求（如果有指定推力需求）
      if (thrustRequirement && gearbox.thrustCapacity < thrustRequirement) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * 评估整个种群的适应度
   */
  evaluatePopulation() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].fitness = this.calculateFitness(this.population[i].gearbox);
    }
    
    // 按适应度降序排序
    this.population.sort((a, b) => b.fitness - a.fitness);
    
    // 更新最佳解决方案
    if (!this.bestSolution || this.population[0].fitness > this.bestSolution.fitness) {
      this.bestSolution = { ...this.population[0] };
    }
    
    // 记录本代最佳适应度
    this.fitnessHistory.push(this.population[0].fitness);
  }
  
  /**
   * 计算单个齿轮箱的适应度得分
   * @param {Object} gearbox - 齿轮箱数据
   * @returns {number} - 适应度得分 (0-100)
   */
  calculateFitness(gearbox) {
    const { power, inputSpeed, targetRatio, workCondition, temperature } = this.requirements;
    
    // 各评分项的权重
    const {
      weightEfficiency, 
      weightTorqueReserve, 
      weightTemperature, 
      weightNoise, 
      weightCost, 
      weightLifespan
    } = this.options;
    
    // 总权重
    const totalWeight = weightEfficiency + weightTorqueReserve + weightTemperature + 
                        weightNoise + weightCost + weightLifespan;
    
    // 1. 效率评分 (0-100)
    let efficiencyScore = this.calculateEfficiencyScore(gearbox, power, inputSpeed);
    
    // 2. 扭矩储备评分 (0-100)
    let torqueReserveScore = this.calculateTorqueReserveScore(gearbox, power, inputSpeed, workCondition);
    
    // 3. 温升评分 (0-100)
    let temperatureScore = this.calculateTemperatureScore(gearbox, power, inputSpeed, temperature);
    
    // 4. 噪音评分 (0-100)
    let noiseScore = this.calculateNoiseScore(gearbox, inputSpeed);
    
    // 5. 成本评分 (0-100)
    let costScore = this.calculateCostScore(gearbox);
    
    // 6. 寿命评分 (0-100)
    let lifespanScore = this.calculateLifespanScore(gearbox, workCondition);
    
    // 7. 减速比匹配评分 (如果有目标减速比)
    let ratioScore = 100;
    if (targetRatio) {
      ratioScore = this.calculateRatioMatchScore(gearbox.ratio, targetRatio);
    }
    
    // 计算加权得分
    let weightedScore = (
      efficiencyScore * weightEfficiency +
      torqueReserveScore * weightTorqueReserve +
      temperatureScore * weightTemperature +
      noiseScore * weightNoise +
      costScore * weightCost +
      lifespanScore * weightLifespan
    ) / totalWeight;
    
    // 减速比作为乘数应用，以确保减速比要求得到满足
    let finalScore = weightedScore * (ratioScore / 100);
    
    // 应用惩罚因子
    // 例如：如果齿轮箱功率远高于需求，可能会因过度设计而降低评分
    const overdesignPenalty = this.calculateOverdesignPenalty(gearbox, power);
    finalScore *= overdesignPenalty;
    
    return Math.max(0, Math.min(100, finalScore));
  }
  
  /**
   * 计算效率评分
   * @param {Object} gearbox - 齿轮箱数据
   * @param {number} requiredPower - 需求功率
   * @param {number} inputSpeed - 输入转速
   * @returns {number} - 评分 (0-100)
   */
  calculateEfficiencyScore(gearbox, requiredPower, inputSpeed) {
    // 基于齿轮箱数据和工作条件计算效率
    const efficiency = calculateEfficiency(gearbox, {
      power: requiredPower,
      inputSpeed: inputSpeed
    });
    
    // 效率评分计算：
    // 假设95%以上为优秀，低于80%为不理想
    if (efficiency >= 0.95) {
      return 100;
    } else if (efficiency >= 0.9) {
      return 90 + (efficiency - 0.9) * 200; // 线性映射 0.90-0.95 到 90-100
    } else if (efficiency >= 0.85) {
      return 80 + (efficiency - 0.85) * 200; // 线性映射 0.85-0.90 到 80-90
    } else if (efficiency >= 0.8) {
      return 60 + (efficiency - 0.8) * 400; // 线性映射 0.80-0.85 到 60-80
    } else {
      return Math.max(0, efficiency * 75); // 线性映射 0-0.80 到 0-60
    }
  }
  
  /**
   * 计算扭矩储备评分
   * @param {Object} gearbox - 齿轮箱数据
   * @param {number} requiredPower - 需求功率
   * @param {number} inputSpeed - 输入转速
   * @param {string} workCondition - 工况描述
   * @returns {number} - 评分 (0-100)
   */
  calculateTorqueReserveScore(gearbox, requiredPower, inputSpeed, workCondition) {
    // 计算扭矩储备率
    const torqueReserve = calculateTorqueReserve(gearbox, {
      power: requiredPower,
      inputSpeed: inputSpeed,
      workCondition: workCondition
    });
    
    // 基于不同工况确定理想扭矩储备率
    let idealReserve = 0.3; // 默认30%储备
    
    if (workCondition && typeof workCondition === 'string') {
      if (workCondition.includes('I类') || workCondition.includes('扭矩变化很小')) {
        idealReserve = 0.2; // 平稳工况只需20%储备
      } else if (workCondition.includes('II类') || workCondition.includes('扭矩变化小')) {
        idealReserve = 0.25; // 较平稳工况需25%储备
      } else if (workCondition.includes('IV类') || workCondition.includes('扭矩变化大')) {
        idealReserve = 0.4; // 恶劣工况需40%储备
      } else if (workCondition.includes('V类') || workCondition.includes('扭矩变化很大')) {
        idealReserve = 0.5; // 极端工况需50%储备
      }
    }
    
    // 扭矩储备评分
    if (torqueReserve >= idealReserve) {
      return 100; // 达到或超过理想储备
    } else if (torqueReserve >= idealReserve * 0.8) {
      // 储备在理想值的80%-100%，得分80-100
      return 80 + (torqueReserve - idealReserve * 0.8) / (idealReserve * 0.2) * 20;
    } else if (torqueReserve >= idealReserve * 0.5) {
      // 储备在理想值的50%-80%，得分50-80
      return 50 + (torqueReserve - idealReserve * 0.5) / (idealReserve * 0.3) * 30;
    } else {
      // 储备低于理想值的50%，得分0-50
      return Math.max(0, torqueReserve / (idealReserve * 0.5) * 50);
    }
  }
  
  /**
   * 计算温升评分
   * @param {Object} gearbox - 齿轮箱数据
   * @param {number} requiredPower - 需求功率
   * @param {number} inputSpeed - 输入转速
   * @param {number} ambientTemperature - 环境温度
   * @returns {number} - 评分 (0-100)
   */
  calculateTemperatureScore(gearbox, requiredPower, inputSpeed, ambientTemperature = 25) {
    // 计算温升
    const temperatureRise = calculateTemperatureRise(gearbox, {
      power: requiredPower,
      inputSpeed: inputSpeed,
      ambientTemperature: ambientTemperature
    });
    
    // 温升评分计算：
    // 油温不超过90℃为最佳
    const maxSafeTemp = 90;
    const criticalTemp = 100;
    
    const oilTemperature = ambientTemperature + temperatureRise;
    
    if (oilTemperature <= maxSafeTemp) {
      return 100; // 理想温度
    } else if (oilTemperature <= criticalTemp) {
      // 线性映射 90-100℃ 到 100-0
      return 100 - (oilTemperature - maxSafeTemp) * 10;
    } else {
      return 0; // 超过临界温度
    }
  }
  
  /**
   * 计算噪音评分
   * @param {Object} gearbox - 齿轮箱数据
   * @param {number} inputSpeed - 输入转速
   * @returns {number} - 评分 (0-100)
   */
  calculateNoiseScore(gearbox, inputSpeed) {
    // 计算噪音水平(dB)
    const noiseLevel = calculateNoiseLevel(gearbox, inputSpeed);
    
    // 噪音评分计算：
    // 假设75dB以下为优秀，90dB以上为很差
    if (noiseLevel <= 75) {
      return 100;
    } else if (noiseLevel <= 80) {
      return 90 - (noiseLevel - 75) * 2; // 线性映射 75-80dB 到 90-80
    } else if (noiseLevel <= 85) {
      return 80 - (noiseLevel - 80) * 3; // 线性映射 80-85dB 到 80-65
    } else if (noiseLevel <= 90) {
      return 65 - (noiseLevel - 85) * 6.5; // 线性映射 85-90dB 到 65-0
    } else {
      return 0; // 噪音过大
    }
  }
  
  /**
   * 计算成本评分
   * @param {Object} gearbox - 齿轮箱数据
   * @returns {number} - 评分 (0-100)
   */
  calculateCostScore(gearbox) {
    // 如果没有价格信息，返回中等分数
    if (!gearbox.basePrice) {
      return 50;
    }
    
    // 获取相同功率段的齿轮箱价格信息
    const similarGearboxes = this.getSimilarPowerGearboxes(gearbox.power);
    
    if (similarGearboxes.length < 3) {
      return 50; // 样本太少，无法比较
    }
    
    // 计算相似功率齿轮箱的价格统计信息
    const prices = similarGearboxes.map(g => g.basePrice).filter(price => price > 0);
    const stats = this.calculatePriceStatistics(prices);
    
    // 价格评分计算：
    // 价格低于平均价的80%为最优
    // 价格高于平均价的120%为最差
    const price = gearbox.basePrice;
    
    if (price <= stats.mean * 0.8) {
      return 100; // 价格很低
    } else if (price <= stats.mean) {
      // 线性映射 mean*0.8 - mean 到 100-80
      return 80 + (stats.mean - price) / (stats.mean * 0.2) * 20;
    } else if (price <= stats.mean * 1.2) {
      // 线性映射 mean - mean*1.2 到 80-50
      return 80 - (price - stats.mean) / (stats.mean * 0.2) * 30;
    } else {
      // 价格过高
      return Math.max(0, 50 - (price - stats.mean * 1.2) / stats.mean * 50);
    }
  }
  
  /**
   * 计算寿命评分
   * @param {Object} gearbox - 齿轮箱数据
   * @param {string} workCondition - 工况描述
   * @returns {number} - 评分 (0-100)
   */
  calculateLifespanScore(gearbox, workCondition) {
    // 计算预期寿命
    const lifespan = calculateLifespan(gearbox, workCondition);
    
    // 寿命评分计算：
    // 假设30000小时以上为优秀，10000小时以下为较差
    if (lifespan >= 30000) {
      return 100;
    } else if (lifespan >= 20000) {
      return 80 + (lifespan - 20000) / 10000 * 20; // 线性映射 20000-30000 到 80-100
    } else if (lifespan >= 10000) {
      return 50 + (lifespan - 10000) / 10000 * 30; // 线性映射 10000-20000 到 50-80
    } else {
      return Math.max(0, lifespan / 10000 * 50); // 线性映射 0-10000 到 0-50
    }
  }
  
  /**
   * 计算减速比匹配评分
   * @param {number} ratio - 齿轮箱减速比
   * @param {number} targetRatio - 目标减速比
   * @returns {number} - 评分 (0-100)
   */
  calculateRatioMatchScore(ratio, targetRatio) {
    if (!targetRatio || targetRatio <= 0) {
      return 100; // 无目标减速比要求
    }
    
    // 计算偏差百分比
    const deviation = Math.abs(ratio - targetRatio) / targetRatio;
    
    // 减速比匹配评分计算：
    // 偏差小于5%为优秀，偏差大于15%为不可接受
    if (deviation <= 0.05) {
      return 100 - deviation * 200; // 线性映射 0-5% 到 100-90
    } else if (deviation <= 0.1) {
      return 90 - (deviation - 0.05) * 400; // 线性映射 5-10% 到 90-70
    } else if (deviation <= 0.15) {
      return 70 - (deviation - 0.1) * 1400; // 线性映射 10-15% 到 70-0
    } else {
      return 0; // 偏差过大，不接受
    }
  }
  
  /**
   * 计算过度设计惩罚系数
   * @param {Object} gearbox - 齿轮箱数据
   * @param {number} requiredPower - 需求功率
   * @returns {number} - 惩罚系数 (0-1)
   */
  calculateOverdesignPenalty(gearbox, requiredPower) {
    // 计算功率比率
    const powerRatio = requiredPower > 0 ? gearbox.power / requiredPower : 1;
    
    // 过度设计惩罚计算：
    // 功率比率在1-1.5之间为理想，过高则可能过度设计
    if (powerRatio <= 1.5) {
      return 1.0; // 无惩罚
    } else if (powerRatio <= 2.0) {
      return 1.0 - (powerRatio - 1.5) * 0.2; // 线性降低 1.5-2.0 到 1.0-0.9
    } else if (powerRatio <= 3.0) {
      return 0.9 - (powerRatio - 2.0) * 0.15; // 线性降低 2.0-3.0 到 0.9-0.75
    } else {
      return 0.75; // 严重过度设计，固定惩罚
    }
  }
  
  /**
   * 获取相似功率范围的齿轮箱
   * @param {number} power - 基准功率
   * @returns {Array} - 相似功率齿轮箱列表
   */
  getSimilarPowerGearboxes(power) {
    // 功率相似度范围 (±30%)
    const lowerBound = power * 0.7;
    const upperBound = power * 1.3;
    
    return this.gearboxData.filter(gearbox => 
      gearbox.power >= lowerBound && 
      gearbox.power <= upperBound &&
      gearbox.basePrice && 
      gearbox.basePrice > 0
    );
  }
  
  /**
   * 计算价格统计信息
   * @param {Array} prices - 价格数组
   * @returns {Object} - 统计信息
   */
  calculatePriceStatistics(prices) {
    if (!prices || prices.length === 0) {
      return { min: 0, max: 0, mean: 0, median: 0 };
    }
    
    // 排序价格
    const sortedPrices = [...prices].sort((a, b) => a - b);
    
    // 计算基本统计量
    const min = sortedPrices[0];
    const max = sortedPrices[sortedPrices.length - 1];
    const sum = sortedPrices.reduce((a, b) => a + b, 0);
    const mean = sum / sortedPrices.length;
    
    // 计算中位数
    let median;
    if (sortedPrices.length % 2 === 0) {
      median = (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2;
    } else {
      median = sortedPrices[Math.floor(sortedPrices.length / 2)];
    }
    
    return { min, max, mean, median };
  }
  
  /**
   * 选择父代个体
   * @returns {Array} - 选中的父代个体
   */
  selectParents() {
    // 使用锦标赛选择法
    const parent1 = this.tournamentSelection();
    let parent2 = this.tournamentSelection();
    
    // 确保选择不同的个体
    while (parent2 === parent1) {
      parent2 = this.tournamentSelection();
    }
    
    return [parent1, parent2];
  }
  
  /**
   * 锦标赛选择
   * @returns {Object} - 选中的个体
   */
  tournamentSelection() {
    // 随机选择个体进行锦标赛
    const contestants = [];
    
    for (let i = 0; i < this.options.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      contestants.push(this.population[randomIndex]);
    }
    
    // 选择最适应的个体
    return contestants.reduce((best, current) => 
      current.fitness > best.fitness ? current : best, contestants[0]);
  }
  
  /**
   * 交叉操作
   * @param {Object} parent1 - 父代个体1
   * @param {Object} parent2 - 父代个体2
   * @returns {Object} - 子代个体
   */
  crossover(parent1, parent2) {
    // 在遗传算法中，我们通常通过组合父代基因来创建子代
    // 但在齿轮箱选型中，个体代表具体齿轮箱，无法直接"组合"
    // 因此我们采用概率选择父代特性的方式进行交叉
    
    if (Math.random() > this.options.crossoverRate) {
      // 如果低于交叉率，直接返回父代之一
      return Math.random() < 0.5 ? parent1 : parent2;
    }
    
    // 从较适应的个体中选择基础齿轮箱
    const baseParent = parent1.fitness > parent2.fitness ? parent1 : parent2;
    const otherParent = baseParent === parent1 ? parent2 : parent1;
    
    // 创建子代 (基于baseParent的齿轮箱)
    const child = {
      gearbox: { ...baseParent.gearbox },
      fitness: 0
    };
    
    // 交叉过程：有50%的概率接受另一个父代的某些特性
    // 注意：实际应用中，我们不能直接修改真实齿轮箱的基本参数
    // 这里只是为了演示遗传算法的交叉过程
    
    // 根据另一个父代的价格调整当前估算价格 
    if (Math.random() < 0.5 && child.gearbox.basePrice && otherParent.gearbox.basePrice) {
      // 价格介于两者之间
      const ratio = 0.3 + Math.random() * 0.4; // 30%-70%的权重
      child.gearbox.basePrice = child.gearbox.basePrice * (1 - ratio) + 
                               otherParent.gearbox.basePrice * ratio;
    }
    
    // 根据另一个父代特性调整噪音估计
    if (Math.random() < 0.5 && child.gearbox.estimatedNoise && otherParent.gearbox.estimatedNoise) {
      child.gearbox.estimatedNoise = (child.gearbox.estimatedNoise + otherParent.gearbox.estimatedNoise) / 2;
    }
    
    // 其他可调整的估计参数...
    
    return child;
  }
  
  /**
   * 变异操作
   * @param {Object} individual - 个体
   * @returns {Object} - 变异后的个体
   */
  mutate(individual) {
    // 以变异率概率决定是否进行变异
    if (Math.random() > this.options.mutationRate) {
      return individual;
    }
    
    // 创建变异个体
    const mutant = {
      gearbox: { ...individual.gearbox },
      fitness: 0
    };
    
    // 变异过程：随机调整某些估计参数
    // 同样，我们不能改变实际齿轮箱的基本参数，这里仅作演示
    
    // 变异价格估计 (±10%)
    if (Math.random() < 0.3 && mutant.gearbox.basePrice) {
      const mutationFactor = 0.9 + Math.random() * 0.2; // 90%-110%
      mutant.gearbox.basePrice *= mutationFactor;
    }
    
    // 变异噪音估计 (±5%)
    if (Math.random() < 0.3 && mutant.gearbox.estimatedNoise) {
      const mutationFactor = 0.95 + Math.random() * 0.1; // 95%-105%
      mutant.gearbox.estimatedNoise *= mutationFactor;
    }
    
    // 变异寿命估计 (±8%)
    if (Math.random() < 0.3 && mutant.gearbox.estimatedLifespan) {
      const mutationFactor = 0.92 + Math.random() * 0.16; // 92%-108%
      mutant.gearbox.estimatedLifespan *= mutationFactor;
    }
    
    return mutant;
  }
  
  /**
   * 进化一代
   * @returns {boolean} - 是否继续进化
   */
  evolveGeneration() {
    // 增加当前代数
    this.currentGeneration++;
    
    // 创建新一代种群
    const newPopulation = [];
    
    // 精英保留策略：直接将最优个体复制到新种群
    for (let i = 0; i < this.options.elitismCount && i < this.population.length; i++) {
      newPopulation.push(this.population[i]);
    }
    
    // 生成剩余个体
    while (newPopulation.length < this.options.populationSize) {
      // 选择父代
      const [parent1, parent2] = this.selectParents();
      
      // 交叉
      let offspring = this.crossover(parent1, parent2);
      
      // 变异
      offspring = this.mutate(offspring);
      
      // 添加到新种群
      newPopulation.push(offspring);
    }
    
    // 更新种群
    this.population = newPopulation;
    
    // 评估新种群
    this.evaluatePopulation();
    
    // 检查收敛
    const converged = this.checkConvergence();
    
    return !converged && this.currentGeneration < this.options.generations;
  }
  
  /**
   * 检查算法是否已收敛
   * @returns {boolean} - 是否已收敛
   */
  checkConvergence() {
    // 如果历史记录太短，不判断收敛
    if (this.fitnessHistory.length < 5) {
      return false;
    }
    
    // 获取最近几代的适应度
    const recentFitness = this.fitnessHistory.slice(-5);
    
    // 计算适应度变化率
    const changeRate = Math.abs(recentFitness[recentFitness.length - 1] - recentFitness[0]) / recentFitness[0];
    
    // 如果变化率小于阈值，增加收敛计数
    if (changeRate < this.options.convergenceThreshold) {
      this.convergenceCounter++;
    } else {
      this.convergenceCounter = 0;
    }
    
    // 连续3代收敛则认为算法收敛
    return this.convergenceCounter >= 3;
  }
  
  /**
   * 运行遗传算法
   * @returns {Object} - 算法运行结果
   */
  run() {
    // 如果尚未初始化，返回错误
    if (this.population.length === 0) {
      return {
        success: false,
        message: '算法尚未初始化'
      };
    }
    
    // 开始计时
    const startTime = performance.now();
    
    // 迭代进化
    let continueEvolution = true;
    while (continueEvolution) {
      continueEvolution = this.evolveGeneration();
    }
    
    // 计算运行时间
    const endTime = performance.now();
    const runtime = endTime - startTime;
    
    // 准备结果
    const result = {
      success: true,
      message: this.currentGeneration >= this.options.generations 
        ? '已达到最大代数' 
        : '算法已收敛',
      runtime,
      generations: this.currentGeneration,
      bestSolution: this.bestSolution,
      fitnessHistory: this.fitnessHistory,
      fitnessImprovement: this.fitnessHistory.length > 1 
        ? ((this.fitnessHistory[this.fitnessHistory.length - 1] / this.fitnessHistory[0]) - 1) * 100 
        : 0,
      recommendations: this.getTopRecommendations(5)
    };
    
    return result;
  }
  
  /**
   * 获取前N个最佳推荐
   * @param {number} count - 推荐数量
   * @returns {Array} - 推荐列表
   */
  getTopRecommendations(count = 5) {
    // 获取前N个最适应的个体
    return this.population
      .slice(0, Math.min(count, this.population.length))
      .map(individual => ({
        gearbox: individual.gearbox,
        fitness: individual.fitness,
        fitnessDetails: this.calculateDetailedFitness(individual.gearbox)
      }));
  }
  
  /**
   * 计算详细适应度组成
   * @param {Object} gearbox - 齿轮箱数据
   * @returns {Object} - 详细适应度得分
   */
  calculateDetailedFitness(gearbox) {
    const { power, inputSpeed, targetRatio, workCondition, temperature } = this.requirements;
    
    // 计算各方面得分
    const efficiencyScore = this.calculateEfficiencyScore(gearbox, power, inputSpeed);
    const torqueReserveScore = this.calculateTorqueReserveScore(gearbox, power, inputSpeed, workCondition);
    const temperatureScore = this.calculateTemperatureScore(gearbox, power, inputSpeed, temperature);
    const noiseScore = this.calculateNoiseScore(gearbox, inputSpeed);
    const costScore = this.calculateCostScore(gearbox);
    const lifespanScore = this.calculateLifespanScore(gearbox, workCondition);
    
    // 计算减速比匹配得分
    let ratioScore = 100;
    if (targetRatio) {
      ratioScore = this.calculateRatioMatchScore(gearbox.ratio, targetRatio);
    }
    
    // 计算过度设计惩罚
    const overdesignPenalty = this.calculateOverdesignPenalty(gearbox, power);
    
    return {
      efficiency: efficiencyScore,
      torqueReserve: torqueReserveScore,
      temperature: temperatureScore,
      noise: noiseScore,
      cost: costScore,
      lifespan: lifespanScore,
      ratioMatch: ratioScore,
      overdesignPenalty
    };
  }
}