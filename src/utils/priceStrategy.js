// utils/priceStrategy.js
// 客户价格策略管理

// 客户价格策略数据结构
const defaultPriceStrategies = [
  {
    id: 'default',
    name: '标准价格',
    description: '默认标准价格策略',
    globalDiscount: 0,
    productTypeDiscounts: {},
    customerTypeDiscount: {}
  }
];

// 本地保存客户价格策略
export const savePriceStrategies = (strategies) => {
  try {
    localStorage.setItem('price_strategies', JSON.stringify(strategies));
    console.log(`成功保存 ${strategies.length} 个价格策略`);
    return true;
  } catch (error) {
    console.error('保存价格策略失败:', error);
    return false;
  }
};

// 加载客户价格策略
export const loadPriceStrategies = () => {
  try {
    const storedStrategies = localStorage.getItem('price_strategies');
    if (!storedStrategies) {
      console.log('未找到已保存的价格策略，使用默认策略');
      return defaultPriceStrategies;
    }
    
    const strategies = JSON.parse(storedStrategies);
    console.log(`已加载 ${strategies.length} 个价格策略`);
    return strategies;
  } catch (error) {
    console.error('加载价格策略失败:', error);
    return defaultPriceStrategies;
  }
};

// 创建或更新价格策略
export const upsertPriceStrategy = (strategy) => {
  if (!strategy || !strategy.id) {
    console.error('无效的价格策略', strategy);
    return false;
  }
  
  try {
    const strategies = loadPriceStrategies();
    const existingIndex = strategies.findIndex(s => s.id === strategy.id);
    
    if (existingIndex >= 0) {
      strategies[existingIndex] = strategy;
    } else {
      strategies.push(strategy);
    }
    
    return savePriceStrategies(strategies);
  } catch (error) {
    console.error('更新价格策略失败:', error);
    return false;
  }
};

// 删除价格策略
export const deletePriceStrategy = (strategyId) => {
  try {
    const strategies = loadPriceStrategies();
    const filteredStrategies = strategies.filter(s => s.id !== strategyId);
    
    if (filteredStrategies.length === strategies.length) {
      console.warn(`未找到ID为 ${strategyId} 的价格策略`);
      return false;
    }
    
    return savePriceStrategies(filteredStrategies);
  } catch (error) {
    console.error('删除价格策略失败:', error);
    return false;
  }
};

// 根据策略计算价格
export const calculatePriceWithStrategy = (component, strategyId = 'default') => {
  if (!component) {
    return component;
  }
  
  try {
    const strategies = loadPriceStrategies();
    const strategy = strategies.find(s => s.id === strategyId) || strategies[0];
    
    if (!strategy) {
      console.warn('找不到价格策略，使用原始价格');
      return component;
    }
    
    // 克隆组件以避免修改原始对象
    const result = { ...component };
    
    // 应用全局折扣
    const globalDiscount = 1 - (strategy.globalDiscount || 0);
    
    // 确定组件类型
    let componentType = 'other';
    if (result.model) {
      if (result.model.includes('HC') || result.model.includes('GW') || 
          result.model.includes('HCM') || result.model.includes('DT')) {
        componentType = 'gearbox';
      } else if (result.model.includes('FL') || result.model.includes('YOX')) {
        componentType = 'coupling';
      } else if (result.model.includes('BY')) {
        componentType = 'pump';
      }
    }
    
    // 应用组件类型折扣
    const typeDiscount = 1 - (strategy.productTypeDiscounts[componentType] || 0);
    
    // 计算折扣系数
    const discountFactor = globalDiscount * typeDiscount;
    
    // 应用折扣
    if (typeof result.marketPrice === 'number') {
      result.marketPrice *= discountFactor;
    }
    
    if (typeof result.factoryPrice === 'number') {
      result.factoryPrice *= discountFactor;
    }
    
    // 更新折扣率
    if (typeof result.discountRate === 'number') {
      // 确保折扣率在0-1之间
      result.discountRate = Math.max(0, Math.min(1, result.discountRate + (1 - discountFactor)));
    }
    
    return result;
  } catch (error) {
    console.error('应用价格策略失败:', error);
    return component;
  }
};

// 价格策略管理界面组件
export const PriceStrategyManager = ({ onClose, onSave, colors, theme }) => {
  const [strategies, setStrategies] = useState(loadPriceStrategies());
  const [currentStrategy, setCurrentStrategy] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // 创建新策略
  const handleCreateStrategy = () => {
    const newStrategy = {
      id: `strategy_${Date.now()}`,
      name: '新价格策略',
      description: '',
      globalDiscount: 0,
      productTypeDiscounts: {
        gearbox: 0,
        coupling: 0,
        pump: 0,
        other: 0
      },
      customerTypeDiscount: {}
    };
    
    setCurrentStrategy(newStrategy);
    setEditMode(true);
  };
  
  // 编辑策略
  const handleEditStrategy = (strategy) => {
    setCurrentStrategy({ ...strategy });
    setEditMode(true);
  };
  
  // 保存策略
  const handleSaveStrategy = () => {
    if (!currentStrategy) return;
    
    const updatedStrategies = [...strategies];
    const index = updatedStrategies.findIndex(s => s.id === currentStrategy.id);
    
    if (index >= 0) {
      updatedStrategies[index] = currentStrategy;
    } else {
      updatedStrategies.push(currentStrategy);
    }
    
    setStrategies(updatedStrategies);
    savePriceStrategies(updatedStrategies);
    setCurrentStrategy(null);
    setEditMode(false);
  };
  
  // 删除策略
  const handleDeleteStrategy = (strategyId) => {
    if (window.confirm('确定要删除此价格策略吗？')) {
      const updatedStrategies = strategies.filter(s => s.id !== strategyId);
      setStrategies(updatedStrategies);
      savePriceStrategies(updatedStrategies);
      
      if (currentStrategy && currentStrategy.id === strategyId) {
        setCurrentStrategy(null);
        setEditMode(false);
      }
    }
  };
  
  // 渲染策略管理UI
  // 这里只是示例，实际实现应根据项目UI风格调整
  return (
    <div className="price-strategy-manager" style={{ color: colors.text }}>
      {/* 策略列表和编辑表单的UI实现 */}
      {/* 这里省略具体实现，应包含策略列表、编辑表单等组件 */}
    </div>
  );
};