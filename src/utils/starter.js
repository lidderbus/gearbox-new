import { embeddedGearboxData, applyPriceUpdates } from '../data/embeddedData';
import { gearboxPriceData } from '../data/gearboxPricing';
import { flexibleCouplings } from '../data/flexibleCouplings';

/**
 * 应用启动前的数据准备：
 * 1. 加载内置齿轮箱数据
 * 2. 将官方价格表合并到内置数据
 * 3. 返回处理后的初始数据
 * 若发生异常，返回原始嵌入式数据，保证应用可用。
 */
export async function startApp() {
  try {
    // 只在存在'needReset'标志时清除存储
    if (sessionStorage.getItem('needReset') === 'true') {
      localStorage.clear();
      sessionStorage.clear();
      // 清除标志
      sessionStorage.removeItem('needReset');
      console.log('已重置应用存储');
    }
    
    // 此处可扩展异步加载外部 JSON 或 localStorage 数据
    const gearboxesWithPrices = applyPriceUpdates(embeddedGearboxData, gearboxPriceData || []);

    // 合并高弹性联轴器数据（保持原始顺序）
    const completeData = {
      ...gearboxesWithPrices,
      flexibleCouplings: flexibleCouplings || []
    };

    return completeData;
  } catch (err) {
    console.error('数据初始化失败，回退到嵌入式数据:', err);
    return embeddedGearboxData;
  }
} 