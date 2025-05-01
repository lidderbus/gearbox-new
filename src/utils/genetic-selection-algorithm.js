/**
 * 遗传算法选型引擎
 * 提供高级齿轮箱选型优化算法
 */

/**
 * 遗传算法选型引擎类
 */
export class GeneticSelectionEngine {
  /**
   * 构造函数
   * @param {Object} options - 算法配置选项
   */
  constructor(options = {}) {
    // 算法参数
    this.populationSize = options.populationSize || 50;
    this.generations = options.generations || 30;
    this.crossoverRate = options.crossoverRate || 0.8;
    this.mutationRate = options.mutationRate || 0.1;
    this.elitismCount = options.elitismCount || 5;
    
    // 评分权重
    this.weights = {
      efficiency: options.weightEfficiency || 25,
      torqueReserve: options.weightTorqueReserve || 20,
      temperature: options.weightTemperature || 15,
      noise: options.weightNoise || 10,
      cost: options.weightCost || 15,
      lifespan: options.weightLifespan || 15,
      // 可以根据需要添加额外的权重
      // ...
    };
    
    // 标准化权重总和为100
    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight !== 100) {
      const factor = 100 / totalWeight;
      Object.keys(this.weights).forEach(key => {
        this.weights[key] = this.weights[key] * factor;
      });
    }
    
    // 初始化引擎状态
    this.initialized = false;
    this.currentGeneration = 0;
    this.population = [];
    this.allGearboxes = [];
    this.requirements = {};
    this.bestSolutions = [];
  }
  
  /**
   * 初始化算法
   * @param {Array} gearboxData - 齿轮箱数据集
   * @param {Object} requirements - 选型需求参数
   * @returns {boolean} - 初始化成功标志
   */
  initialize(gearboxData, requirements) {
    if (!Array.isArray(gearboxData) || gearboxData.length === 0) {
      throw new Error('无效的齿轮箱数据集');
    }
    
    if (!requirements || !requirements.power || !requirements.inputSpeed) {
      throw new Error('缺少必要的选型参数(功率、输入转速)');
    }
    
    // 保存数据和需求
    this.allGearboxes = [...gearboxData];
    this.requirements = { ...requirements };
    
    // 预处理：过滤出基本满足要求的齿轮箱
    const preFilteredGearboxes = this.preFilterGearboxes(this.allGearboxes, this.requirements);
    
    // 如果预过滤后没有齿轮箱，则放宽条件
    if (preFilteredGearboxes.length === 0) {
      console.warn('没有完全匹配的齿轮箱，正在放宽条件...');
      // 放宽条件的过滤
      const relaxedGearboxes = this.relaxedFilterGearboxes(this.allGearboxes, this.requirements);
      if (relaxedGearboxes.length === 0) {
        throw new Error('即使放宽条件，也找不到匹配的齿轮箱');
      }
      this.population = this.initializePopulation(relaxedGearboxes);
    } else {
      this.population = this.initializePopulation(preFilteredGearboxes);
    }
    
    // 重置状态
    this.currentGeneration = 0;
    this.bestSolutions = [];
    
    // 标记为已初始化
    this.initialized = true;
    return true;
  }
  
  /**
   * 预过滤齿轮箱 - 筛选出基本满足要求的候选项
   * @param {Array} gearboxes - 齿轮箱数据集
   * @param {Object} requirements - 选型需求参数
   * @returns {Array} - 过滤后的候选齿轮箱
   */
  preFilterGearboxes(gearboxes, requirements) {
    // 提取基本需求参数
    const { power, inputSpeed, targetRatio, thrustRequirement } = requirements;
    
    // 功率和转速的容许误差
    const powerMargin = 0.15; // 15%
    const rpmMargin = 0.1;    // 10%
    const ratioMargin = 0.1;  // 10%
    
    return gearboxes.filter(gearbox => {
      // 功率检查
      const powerMatch = gearbox.power >= power * (1 - powerMargin);
      
      // 转速检查
      const speedMatch = gearbox.inputSpeed >= inputSpeed * (1 - rpmMargin);
      
      // 减速比检查
      const ratioMatch = !targetRatio || 
                        (gearbox.ratio >= targetRatio * (1 - ratioMargin) && 
                         gearbox.ratio <= targetRatio * (1 + ratioMargin));
      
      // 推力检查
      const thrustMatch = !thrustRequirement || 
                         !gearbox.thrustCapacity || 
                         gearbox.thrustCapacity >= thrustRequirement;
      
      // 所有条件必须满足
      return powerMatch && speedMatch && ratioMatch && thrustMatch;
    });
  }
  
  /**
   * 放宽条件的过滤 - 当严格过滤无结果时使用
   * @param {Array} gearboxes - 齿轮箱数据集
   * @param {Object} requirements - 选型需求参数
   * @returns {Array} - 过滤后的候选齿轮箱
   */
  relaxedFilterGearboxes(gearboxes, requirements) {
    // 提取基本需求参数
    const { power, inputSpeed, targetRatio } = requirements;
    
    // 放宽的容许误差
    const powerMargin = 0.3;  // 30%
    const rpmMargin = 0.2;    // 20%
    const ratioMargin = 0.15; // 15%
    
    return gearboxes.filter(gearbox => {
      // 功率检查（仅需达到70%即可）
      const powerMatch = gearbox.power >= power * (1 - powerMargin);
      
      // 转速检查（放宽至80%）
      const speedMatch = gearbox.inputSpeed >= inputSpeed * (1 - rpmMargin);
      
      // 减速比检查（放宽至±15%）
      const ratioMatch = !targetRatio || 
                        (gearbox.ratio >= targetRatio * (1 - ratioMargin) && 
                         gearbox.ratio <= targetRatio * (1 + ratioMargin));
      
      // 至少满足功率和转速要求
      return powerMatch && speedMatch;
    });
  }
  
  /**
   * 初始化种群
   * @param {Array} candidates - 候选齿轮箱
   * @returns {Array} - 初始化的种群
   */
  initializePopulation(candidates) {
    // 如果候选项不足以构成种群，复制到足够数量
    if (candidates.length < this.populationSize) {
      const population = [];
      let index = 0;
      
      for (let i = 0; i < this.populationSize; i++) {
        population.push(candidates[index]);
        index = (index + 1) % candidates.length;
      }
      
      return population;
    }
    
    // 如果候选项过多，随机选择
    if (candidates.length > this.populationSize) {
      const population = [];
      const candidatesCopy = [...candidates];
      
      for (let i = 0; i < this.populationSize; i++) {
        const randomIndex = Math.floor(Math.random() * candidatesCopy.length);
        population.push(candidatesCopy[randomIndex]);
        candidatesCopy.splice(randomIndex, 1);
      }
      
      return population;
    }
    
    // 如果刚好等于种群大小，直接返回
    return [...candidates];
  }
  
  /**
   * 运行遗传算法
   * @returns {Object} - 运行结果
   */
  run() {
    if (!this.initialized) {
      throw new Error('引擎未初始化，请先调用initialize方法');
    }
    
    // 记录开始时间
    const startTime = new Date().getTime();
    
    // 运行指定代数
    for (let gen = 0; gen < this.generations; gen++) {
      this.evolve();
      this.currentGeneration = gen + 1;
    }
    
    // 计算运行时间
    const endTime = new Date().getTime();
    const runtime = endTime - startTime;
    
    // 获取最终结果
    const recommendations = this.getTopRecommendations();
    
    return {
      success: recommendations.length > 0,
      message: recommendations.length > 0 ? 
               `成功找到 ${recommendations.length} 个匹配的齿轮箱` : 
               '未找到合适的齿轮箱',
      generations: this.currentGeneration,
      runtime,
      recommendations
    };
  }
  
  /**
   * 进化一代
   */
  evolve() {
    // 计算当前种群适应度
    const fitnessValues = this.population.map(gearbox => ({
      gearbox,
      fitness: this.calculateFitness(gearbox)
    }));
    
    // 按适应度排序
    fitnessValues.sort((a, b) => b.fitness - a.fitness);
    
    // 保存最佳解决方案
    this.bestSolutions = fitnessValues.slice(0, Math.max(this.elitismCount, 10))
      .map(item => ({
        ...item,
        fitnessDetails: this.calculateDetailedFitness(item.gearbox)
      }));
    
    // 创建新一代
    const newPopulation = [];
    
    // 精英保留
    for (let i = 0; i < this.elitismCount && i < fitnessValues.length; i++) {
      newPopulation.push(fitnessValues[i].gearbox);
    }
    
    // 繁殖新个体，直到填满种群
    while (newPopulation.length < this.populationSize) {
      // 选择父母
      const parent1 = this.selectParent(fitnessValues);
      const parent2 = this.selectParent(fitnessValues);
      
      // 交叉繁殖
      if (Math.random() < this.crossoverRate) {
        const child = this.crossover(parent1, parent2);
        newPopulation.push(child);
      } else {
        // 不交叉则直接复制父母
        newPopulation.push(Math.random() < 0.5 ? parent1 : parent2);
      }
    }
    
    // 更新种群
    this.population = newPopulation;
  }
  
  /**
   * 计算适应度 - 评估齿轮箱与需求的匹配度
   * @param {Object} gearbox - 齿轮箱
   * @returns {number} - 适应度得分(0-100)
   */
  calculateFitness(gearbox) {
    if (!gearbox) return 0;
    
    // 获取详细评分
    const scores = this.calculateDetailedFitness(gearbox);
    
    // 计算加权总分
    let totalScore = 0;
    Object.keys(scores).forEach(key => {
      if (this.weights[key]) {
        totalScore += scores[key] * this.weights[key] / 100;
      }
    });
    
    return totalScore;
  }
  
  /**
   * 计算详细适应度评分
   * @param {Object} gearbox - 齿轮箱
   * @returns {Object} - 各方面评分
   */
  calculateDetailedFitness(gearbox) {
    if (!gearbox) return {};
    
    const { power, inputSpeed, targetRatio, thrustRequirement, 
            temperature, application } = this.requirements;
    
    // 效率评分 (根据齿轮箱类型和功率估算)
    const efficiency = this.calculateEfficiencyScore(gearbox, power);
    
    // 扭矩储备评分
    const torqueReserve = this.calculateTorqueReserveScore(gearbox, power, application);
    
    // 温度控制评分
    const temperatureScore = this.calculateTemperatureScore(gearbox, temperature);
    
    // 噪音水平评分
    const noise = this.calculateNoiseScore(gearbox);
    
    // 成本效益评分
    const cost = this.calculateCostScore(gearbox, power);
    
    // 预期寿命评分
    const lifespan = this.calculateLifespanScore(gearbox, power, application);
    
    // 减速比匹配评分
    const ratioMatch = this.calculateRatioMatchScore(gearbox.ratio, targetRatio);
    
    return {
      efficiency,
      torqueReserve,
      temperature: temperatureScore,
      noise,
      cost,
      lifespan,
      ratioMatch
    };
  }
  
  /**
   * 计算效率评分
   * @param {Object} gearbox - 齿轮箱
   * @param {number} requiredPower - 需求功率
   * @returns {number} - 效率评分(0-100)
   */
  calculateEfficiencyScore(gearbox, requiredPower) {
    // 基础效率评分 - 根据齿轮箱类型估算
    let baseEfficiency = 0;
    
    // 根据系列和型号估算效率
    if (gearbox.series) {
      const series = gearbox.series.toUpperCase();
      if (series.includes('GW')) {
        baseEfficiency = 92; // GW系列基础效率较高
      } else if (series.includes('HC') || series.includes('HCM')) {
        baseEfficiency = 90; // HC/HCM系列基础效率适中
      } else if (series.includes('DT')) {
        baseEfficiency = 88; // DT系列基础效率一般
      } else {
        baseEfficiency = 85; // 其他系列基础效率较低
      }
    } else {
      // 根据型号推断
      const model = gearbox.model.toUpperCase();
      if (model.includes('GW')) {
        baseEfficiency = 92;
      } else if (model.includes('HC') || model.includes('HCM')) {
        baseEfficiency = 90;
      } else if (model.includes('DT')) {
        baseEfficiency = 88;
      } else {
        baseEfficiency = 85;
      }
    }
    
    // 功率匹配度修正
    const powerRatio = requiredPower / gearbox.power;
    let powerCorrection = 0;
    
    if (powerRatio <= 0.5) {
      // 功率过剩，效率下降
      powerCorrection = -5;
    } else if (powerRatio > 0.5 && powerRatio <= 0.8) {
      // 功率匹配较好，效率最佳
      powerCorrection = 5;
    } else if (powerRatio > 0.8 && powerRatio <= 0.95) {
      // 功率接近极限，效率适中
      powerCorrection = 0;
    } else {
      // 功率接近极限或超限，效率下降
      powerCorrection = -10;
    }
    
    // 计算最终效率得分(映射到0-100分)
    const finalEfficiency = baseEfficiency + powerCorrection;
    return (finalEfficiency - 80) * 5; // 80-100% 映射到 0-100分
  }
  
  /**
   * 计算扭矩储备评分
   * @param {Object} gearbox - 齿轮箱
   * @param {number} requiredPower - 需求功率
   * @param {string} application - 应用场景
   * @returns {number} - 扭矩储备评分(0-100)
   */
  calculateTorqueReserveScore(gearbox, requiredPower, application) {
    // 计算功率储备比例
    const powerRatio = requiredPower / gearbox.power;
    let baseScore = 0;
    
    if (powerRatio <= 0.6) {
      // 功率储备大，扭矩储备充足
      baseScore = 90;
    } else if (powerRatio > 0.6 && powerRatio <= 0.8) {
      // 功率储备适中
      baseScore = 80;
    } else if (powerRatio > 0.8 && powerRatio <= 0.9) {
      // 功率储备较小
      baseScore = 60;
    } else if (powerRatio > 0.9 && powerRatio <= 1.0) {
      // 功率储备很小
      baseScore = 40;
    } else {
      // 功率超限
      baseScore = 0;
    }
    
    // 应用场景修正
    let applicationCorrection = 0;
    
    if (application === 'propulsion') {
      // 主推进应用，需要更高的扭矩储备
      applicationCorrection = powerRatio > 0.8 ? -10 : 0;
    } else if (application === 'auxiliary') {
      // 辅助推进，扭矩储备要求适中
      applicationCorrection = 0;
    } else if (application === 'winch') {
      // 绞车应用，需要很高的扭矩储备
      applicationCorrection = powerRatio > 0.7 ? -20 : 0;
    }
    
    // 计算最终扭矩储备得分
    return Math.max(0, Math.min(100, baseScore + applicationCorrection));
  }
  
  /**
   * 计算温度控制评分
   * @param {Object} gearbox - 齿轮箱
   * @param {number} requiredTemperature - 环境温度
   * @returns {number} - 温度控制评分(0-100)
   */
  calculateTemperatureScore(gearbox, requiredTemperature = 30) {
    // 根据系列估算温度控制能力
    let baseTempScore = 0;
    
    // 根据系列和型号估算温度控制能力
    if (gearbox.series) {
      const series = gearbox.series.toUpperCase();
      if (series.includes('GW')) {
        baseTempScore = 85; // GW系列温度控制较好
      } else if (series.includes('HC') || series.includes('HCM')) {
        baseTempScore = 80; // HC/HCM系列温度控制适中
      } else if (series.includes('DT')) {
        baseTempScore = 75; // DT系列温度控制一般
      } else {
        baseTempScore = 70; // 其他系列温度控制较弱
      }
    } else {
      // 根据型号推断
      const model = gearbox.model.toUpperCase();
      if (model.includes('GW')) {
        baseTempScore = 85;
      } else if (model.includes('HC') || model.includes('HCM')) {
        baseTempScore = 80;
      } else if (model.includes('DT')) {
        baseTempScore = 75;
      } else {
        baseTempScore = 70;
      }
    }
    
    // 温度需求修正
    let tempCorrection = 0;
    
    if (requiredTemperature <= 30) {
      // 正常温度环境，无修正
      tempCorrection = 0;
    } else if (requiredTemperature > 30 && requiredTemperature <= 40) {
      // 较高温度环境，需更好的温控
      tempCorrection = -10;
    } else if (requiredTemperature > 40 && requiredTemperature <= 50) {
      // 高温环境，温控要求高
      tempCorrection = -20;
    } else {
      // 极高温环境，温控要求极高
      tempCorrection = -40;
    }
    
    // 计算最终温度控制得分
    return Math.max(0, Math.min(100, baseTempScore + tempCorrection));
  }
  
  /**
   * 计算噪音水平评分
   * @param {Object} gearbox - 齿轮箱
   * @returns {number} - 噪音水平评分(0-100)
   */
  calculateNoiseScore(gearbox) {
    // 根据系列估算噪音水平
    let baseNoiseScore = 0;
    
    // 根据系列和型号估算噪音水平
    if (gearbox.series) {
      const series = gearbox.series.toUpperCase();
      if (series.includes('GW')) {
        baseNoiseScore = 85; // GW系列噪音控制较好
      } else if (series.includes('HC') || series.includes('HCM')) {
        baseNoiseScore = 75; // HC/HCM系列噪音控制适中
      } else if (series.includes('DT')) {
        baseNoiseScore = 65; // DT系列噪音控制一般
      } else {
        baseNoiseScore = 60; // 其他系列噪音控制较弱
      }
    } else {
      // 根据型号推断
      const model = gearbox.model.toUpperCase();
      if (model.includes('GW')) {
        baseNoiseScore = 85;
      } else if (model.includes('HC') || model.includes('HCM')) {
        baseNoiseScore = 75;
      } else if (model.includes('DT')) {
        baseNoiseScore = 65;
      } else {
        baseNoiseScore = 60;
      }
    }
    
    // 计算最终噪音水平得分
    return baseNoiseScore;
  }
  
  /**
   * 计算成本效益评分
   * @param {Object} gearbox - 齿轮箱
   * @param {number} requiredPower - 需求功率
   * @returns {number} - 成本效益评分(0-100)
   */
  calculateCostScore(gearbox, requiredPower) {
    // 如果有价格信息，进行精确计算
    if (gearbox.basePrice && gearbox.factoryPrice) {
      // 价格与功率比
      const powerCostRatio = gearbox.factoryPrice / gearbox.power;
      
      // 评估价格合理性
      // 典型船用齿轮箱价格范围：1000-3000元/kW
      if (powerCostRatio < 1000) {
        return 95; // 非常经济
      } else if (powerCostRatio >= 1000 && powerCostRatio < 1500) {
        return 90; // 较为经济
      } else if (powerCostRatio >= 1500 && powerCostRatio < 2000) {
        return 80; // 价格适中
      } else if (powerCostRatio >= 2000 && powerCostRatio < 3000) {
        return 70; // 价格较高
      } else {
        return 60; // 价格高
      }
    }
    
    // 无价格信息时，根据功率匹配度估算性价比
    const powerRatio = requiredPower / gearbox.power;
    
    if (powerRatio > 0.9) {
      return 85; // 功率匹配度高，性价比较高
    } else if (powerRatio > 0.7 && powerRatio <= 0.9) {
      return 90; // 功率匹配度最佳，性价比高
    } else if (powerRatio > 0.5 && powerRatio <= 0.7) {
      return 75; // 功率有富余，性价比适中
    } else {
      return 60; // 功率过剩，性价比低
    }
  }
  
  /**
   * 计算预期寿命评分
   * @param {Object} gearbox - 齿轮箱
   * @param {number} requiredPower - 需求功率
   * @param {string} application - 应用场景
   * @returns {number} - 预期寿命评分(0-100)
   */
  calculateLifespanScore(gearbox, requiredPower, application) {
    // 功率匹配度对寿命的影响
    const powerRatio = requiredPower / gearbox.power;
    let baseScore = 0;
    
    if (powerRatio <= 0.6) {
      // 功率富余大，寿命较长
      baseScore = 90;
    } else if (powerRatio > 0.6 && powerRatio <= 0.8) {
      // 功率匹配度较好，寿命适中
      baseScore = 80;
    } else if (powerRatio > 0.8 && powerRatio <= 0.9) {
      // 功率接近额定值，寿命略短
      baseScore = 70;
    } else if (powerRatio > 0.9 && powerRatio <= 1.0) {
      // 功率接近极限，寿命短
      baseScore = 50;
    } else {
      // 功率超限，寿命极短
      baseScore = 20;
    }
    
    // 应用场景修正
    let applicationCorrection = 0;
    
    if (application === 'propulsion') {
      // 主推进应用，持续负载高
      applicationCorrection = -5;
    } else if (application === 'auxiliary') {
      // 辅助推进，负载适中
      applicationCorrection = 0;
    } else if (application === 'winch') {
      // 绞车应用，间歇负载
      applicationCorrection = 10;
    }
    
    // 计算最终预期寿命得分
    return Math.max(0, Math.min(100, baseScore + applicationCorrection));
  }
  
  /**
   * 计算减速比匹配度评分
   * @param {number} ratio - 齿轮箱减速比
   * @param {number} targetRatio - 目标减速比
   * @returns {number} - 减速比匹配评分(0-100)
   */
  calculateRatioMatchScore(ratio, targetRatio) {
    // 如果没有指定目标减速比，默认满分
    if (!targetRatio) return 100;
    
    // 计算差异百分比
    const difference = Math.abs(ratio - targetRatio) / targetRatio;
    
    if (difference <= 0.01) {
      return 100; // 几乎完全匹配
    } else if (difference <= 0.03) {
      return 90; // 非常接近
    } else if (difference <= 0.05) {
      return 80; // 接近
    } else if (difference <= 0.1) {
      return 70; // 较接近
    } else if (difference <= 0.15) {
      return 50; // 差异较大
    } else {
      return 30; // 差异很大
    }
  }
  
  /**
   * 根据适应度选择父母
   * @param {Array} fitnessValues - 适应度值数组
   * @returns {Object} - 选中的父母
   */
  selectParent(fitnessValues) {
    // 采用锦标赛选择法
    const tournamentSize = 3;
    const tournament = [];
    
    // 随机选择锦标赛参与者
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * fitnessValues.length);
      tournament.push(fitnessValues[randomIndex]);
    }
    
    // 找出锦标赛中适应度最高的个体
    tournament.sort((a, b) => b.fitness - a.fitness);
    
    return tournament[0].gearbox;
  }
  
  /**
   * 交叉操作 - 混合两个父母的特性生成子代
   * @param {Object} parent1 - 父母1
   * @param {Object} parent2 - 父母2
   * @returns {Object} - 子代
   */
  crossover(parent1, parent2) {
    // 在当前应用场景下，齿轮箱选型主要是选择现有型号
    // 而非创建新的混合齿轮箱，因此这里简化为直接返回
    // 两个父母中的一个，或者从所有可用齿轮箱中随机选择
    
    // 有10%的概率完全随机选择，以增加多样性
    if (Math.random() < 0.1 && this.allGearboxes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.allGearboxes.length);
      return this.allGearboxes[randomIndex];
    }
    
    // 如果父母相同，则尝试做一些变异
    if (parent1.model === parent2.model) {
      // 寻找与父母相似但不同的齿轮箱
      const similarGearboxes = this.allGearboxes.filter(gb => 
        gb.model !== parent1.model &&
        Math.abs(gb.power - parent1.power) / parent1.power < 0.3 &&
        Math.abs(gb.ratio - parent1.ratio) / parent1.ratio < 0.2
      );
      
      if (similarGearboxes.length > 0) {
        const randomIndex = Math.floor(Math.random() * similarGearboxes.length);
        return similarGearboxes[randomIndex];
      }
    }
    
    // 默认等概率返回其中一个父母
    return Math.random() < 0.5 ? parent1 : parent2;
  }
  
  /**
   * 获取最优推荐结果
   * @param {number} count - 返回数量
   * @returns {Array} - 推荐结果
   */
  getTopRecommendations(count = 10) {
    // 如果没有最佳解决方案，返回空数组
    if (!this.bestSolutions || this.bestSolutions.length === 0) {
      return [];
    }
    
    // 提取最佳解决方案
    const recommendations = this.bestSolutions
      .slice(0, Math.min(count, this.bestSolutions.length))
      .map(solution => {
        // 转换成选型结果格式
        return {
          model: solution.gearbox.model,
          series: solution.gearbox.series,
          // 复制原齿轮箱的所有属性
          ...solution.gearbox,
          // 添加评分信息
          score: solution.fitness,
          fitnessDetails: solution.fitnessDetails,
          // 识别是否为完全匹配
          isExactMatch: this.isExactMatch(solution.gearbox, this.requirements),
          isPartialMatch: !this.isExactMatch(solution.gearbox, this.requirements)
        };
      });
    
    return recommendations;
  }
  
  /**
   * 检查是否为完全匹配
   * @param {Object} gearbox - 齿轮箱
   * @param {Object} requirements - 需求参数
   * @returns {boolean} - 是否完全匹配
   */
  isExactMatch(gearbox, requirements) {
    // 提取需求参数
    const { power, inputSpeed, targetRatio, thrustRequirement } = requirements;
    
    // 功率检查
    const powerMatch = gearbox.power >= power;
    
    // 转速检查
    const speedMatch = gearbox.inputSpeed >= inputSpeed;
    
    // 减速比检查
    const ratioMatch = !targetRatio || 
                      (Math.abs(gearbox.ratio - targetRatio) / targetRatio <= 0.03);
    
    // 推力检查
    const thrustMatch = !thrustRequirement || 
                       !gearbox.thrustCapacity || 
                       gearbox.thrustCapacity >= thrustRequirement;
    
    // 所有条件必须满足
    return powerMatch && speedMatch && ratioMatch && thrustMatch;
  }
}

export default GeneticSelectionEngine;