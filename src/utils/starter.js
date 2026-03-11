// 性能优化: 改为动态导入
// import { embeddedGearboxData, applyPriceUpdates } from '../data/embeddedData';
// import { gearboxPriceData } from '../data/gearboxPricing';
// import { flexibleCouplings } from '../data/flexibleCouplings';
import { logger } from '../config/logging';

/**
 * 应用启动前的数据准备：
 * 1. 动态加载内置齿轮箱数据
 * 2. 将官方价格表合并到内置数据
 * 3. 返回处理后的初始数据
 * 若发生异常，返回原始嵌入式数据，保证应用可用。
 */
export async function startApp() {
  try {
    // 只在存在'needReset'标志时清除选型系统存储（保护报价等其他应用数据）
    if (sessionStorage.getItem('needReset') === 'true') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('quote') && !key.startsWith('Quote') && key !== 'gearbox_quotations') {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();
      sessionStorage.removeItem('needReset');
      logger.debug(`已重置选型系统存储（清除${keysToRemove.length}个键，保留报价数据）`);
    }

    // 性能优化: 并行动态加载数据
    const [embeddedModule, pricingModule, couplingsModule] = await Promise.all([
      import(/* webpackChunkName: "gearbox-data" */ '../data/embeddedData'),
      import(/* webpackChunkName: "pricing-data" */ '../data/gearboxPricing'),
      import(/* webpackChunkName: "coupling-data" */ '../data/flexibleCouplings')
    ]);

    const { embeddedGearboxData, applyPriceUpdates } = embeddedModule;
    const { gearboxPriceData } = pricingModule;
    const { flexibleCouplings } = couplingsModule;

    // 此处可扩展异步加载外部 JSON 或 localStorage 数据
    const gearboxesWithPrices = applyPriceUpdates(embeddedGearboxData, gearboxPriceData || []);

    // 合并高弹性联轴器数据（保持原始顺序）
    const completeData = {
      ...gearboxesWithPrices,
      flexibleCouplings: flexibleCouplings || []
    };

    return completeData;
  } catch (err) {
    logger.error('数据初始化失败，回退到嵌入式数据:', err);
    // 尝试加载基本数据
    try {
      const { embeddedGearboxData } = await import(
        /* webpackChunkName: "gearbox-data" */
        '../data/embeddedData'
      );
      return embeddedGearboxData;
    } catch {
      return { flexibleCouplings: [], _error: err.message };
    }
  }
} 