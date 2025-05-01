// src/utils/priceCalculator.js

import { calculatePrices, updateSelectionPrices } from './gearboxDataUpdater';

// 应用价格到选型结果
export function applyPricesToSelection(selection) {
  if (!selection) return null;

  // 确保组件数据完整性
  const validatedSelection = {
    ...selection,
    coupling: selection.coupling || null,
    pump: selection.pump || null
  };

  // 更新价格信息
  const updatedSelection = updateSelectionPrices(validatedSelection);
  
  // 验证价格是否合理
  const validation = validatePrices(updatedSelection);
  
  return {
    ...updatedSelection,
    validation
  };
}

// 验证价格是否合理
function validatePrices(selection) {
  if (!selection || !selection.prices) {
    return { isValid: false, messages: ['价格信息不完整'] };
  }

  const messages = [];
  const { gearbox, coupling, pump } = selection.prices.details;

  // 验证齿轮箱价格
  if (gearbox && gearbox.marketPrice < gearbox.factoryPrice) {
    messages.push(`齿轮箱${selection.gearbox?.model || ''}市场价(${formatPrice(gearbox.marketPrice)})小于出厂价(${formatPrice(gearbox.factoryPrice)})`);
  }

  // 验证联轴器价格
  if (coupling && coupling.marketPrice < coupling.factoryPrice) {
    messages.push(`联轴器${selection.coupling?.model || ''}市场价(${formatPrice(coupling.marketPrice)})小于出厂价(${formatPrice(coupling.factoryPrice)})`);
  }

  // 验证备用泵价格
  if (pump && pump.marketPrice < pump.factoryPrice) {
    messages.push(`备用泵${selection.pump?.model || ''}市场价(${formatPrice(pump.marketPrice)})小于出厂价(${formatPrice(pump.factoryPrice)})`);
  }

  return {
    isValid: messages.length === 0,
    messages
  };
}

// 格式化价格显示
export function formatPrice(price) {
  if (typeof price !== 'number') return '¥0';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// 获取价格明细
export function getPriceDetails(selection) {
  if (!selection || !selection.prices) return null;

  const details = selection.prices.details;
  
  return {
    gearbox: {
      name: selection.gearbox?.model || '未选择',
      factoryPrice: formatPrice(details.gearbox?.factoryPrice || 0),
      marketPrice: formatPrice(details.gearbox?.marketPrice || 0),
      specs: selection.gearbox || null
    },
    coupling: {
      name: selection.coupling?.model || '未选择',
      factoryPrice: formatPrice(details.coupling?.factoryPrice || 0),
      marketPrice: formatPrice(details.coupling?.marketPrice || 0),
      specs: selection.coupling || null
    },
    pump: {
      name: selection.pump?.model || '未选择',
      factoryPrice: formatPrice(details.pump?.factoryPrice || 0),
      marketPrice: formatPrice(details.pump?.marketPrice || 0),
      specs: selection.pump || null
    },
    total: formatPrice(selection.prices.total || 0),
    validation: selection.validation || { isValid: true, messages: [] }
  };
} 