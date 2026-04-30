// src/utils/quotationManager.js
/**
 * 报价单管理工具
 * 处理报价单保存、比较和历史记录管理
 */

import { quotationStore, relationStore } from '../services/documentStorage';

// 保存报价单到本地存储
export const saveQuotation = (quotation, name, projectInfo) => {
  if (!quotation || !quotation.success) {
    console.error('无法保存无效的报价单数据');
    return false;
  }

  try {
    const saveName = name || `${projectInfo?.projectName || '未命名项目'} - ${new Date().toLocaleDateString()}`;
    const saveId = `quotation_${Date.now()}`;

    // 从本地存储获取已保存的报价单
    const quotationSaves = JSON.parse(localStorage.getItem('quotationSaves') || '[]');

    // 创建新的保存项
    const newSave = {
      id: saveId,
      name: saveName,
      date: new Date().toISOString(),
      data: quotation,
      projectInfo: {
        customerName: projectInfo?.customerName,
        projectName: projectInfo?.projectName
      }
    };

    // 更新保存列表
    const updatedSaves = [newSave, ...quotationSaves].slice(0, 20); // 最多保存20个
    localStorage.setItem('quotationSaves', JSON.stringify(updatedSaves));

    // 同步到 quotationStore (文档管理仪表板)
    // P0-1: 从 session 读取 current_project_id, 让报价单挂入项目主线
    let currentProjectId = null;
    try { currentProjectId = sessionStorage.getItem('current_project_id') || null; } catch (e) { /* ignore */ }
    try {
      quotationStore.save({
        id: saveId,
        docNumber: quotation.quotationNumber || saveId,
        customerName: projectInfo?.customerName || quotation.customerInfo?.name,
        projectName: projectInfo?.projectName,
        projectId: currentProjectId || undefined,
        items: quotation.items,
        totalAmount: quotation.totalAmount,
        // P1#6 — 透传报价单二态机 (官方/草稿)
        status: quotation.quotationStatus || 'draft',
        priceVersionUsed: quotation.priceVersionUsed,
        model: quotation.selectedComponents?.gearbox?.model || quotation.items?.[0]?.model,
      });
    } catch (e) {
      console.warn('同步报价单到 quotationStore 失败:', e);
    }

    // 同步到 gearbox_quotations (智能报价引擎+趋势分析)
    try {
      const gqList = JSON.parse(localStorage.getItem('gearbox_quotations') || '[]');
      gqList.unshift({
        id: saveId,
        date: new Date().toISOString(),
        items: quotation.items || [],
        totalAmount: quotation.totalAmount,
        discountPercentage: quotation.discountPercentage || quotation.options?.discountPercentage || 10,
        customerInfo: { name: projectInfo?.customerName || quotation.customerInfo?.name || '' },
        model: quotation.selectedComponents?.gearbox?.model || quotation.items?.[0]?.model || '',
      });
      localStorage.setItem('gearbox_quotations', JSON.stringify(gqList.slice(0, 100)));
    } catch (e) {
      console.warn('同步报价单到 gearbox_quotations 失败:', e);
    }

    // 建立询单→报价单关联 (文档溯源链)
    try {
      const sourceInquiryId = sessionStorage.getItem('source_inquiry_id');
      if (sourceInquiryId) {
        relationStore.addRelation(saveId, 'quotation', sourceInquiryId, 'inquiry', 'derived_from');
        sessionStorage.removeItem('source_inquiry_id');
      }
    } catch (e) {
      console.warn('建立文档关联失败:', e);
    }

    return true;
  } catch (error) {
    console.error("保存报价单错误:", error);
    return false;
  }
};

/**
 * S2: 保存"配套包"报价 (齿轮箱+联轴器+备用泵 一键打包)
 * @param {Object} pkg - resolvePackage() 的输出 { gearbox, coupling, pump, packagePrice, ... }
 * @param {Object} [meta] - { customerName, projectName, name }
 * @returns {boolean}
 */
export const savePackageQuotation = (pkg, meta = {}) => {
  if (!pkg || !pkg.gearbox?.model) {
    console.error('savePackageQuotation: 配套包数据无效');
    return false;
  }
  const items = [];
  if (pkg.gearbox)  items.push({ type: 'gearbox',  model: pkg.gearbox.model,  price: pkg.gearbox.price ?? 0 });
  if (pkg.coupling) items.push({ type: 'coupling', model: pkg.coupling.model, price: pkg.coupling.price ?? 0 });
  if (pkg.pump)     items.push({ type: 'pump',     model: pkg.pump.model,     price: pkg.pump.price ?? 0 });

  // saveQuotation 要求 success=true; 包装为兼容形态
  const wrapper = {
    success: true,
    type: 'package',
    quotationNumber: `PKG-${Date.now()}`,
    selectedComponents: { gearbox: { model: pkg.gearbox.model } },
    items,
    totalAmount: pkg.packagePrice ?? pkg.totalCalculated ?? 0,
    customerInfo: { name: meta.customerName || '配套包待报价' },
    options: { discountPercentage: 10 },
    notes: `配套包来源: ${pkg.source} · ${pkg.priceVersionTag}`,
    hasInquiry: !!pkg.hasInquiry,
    generatedAt: pkg.generatedAt
  };
  return saveQuotation(
    wrapper,
    meta.name || `配套包_${pkg.gearbox.model}_${new Date().toISOString().slice(0,10)}`,
    {
      customerName: meta.customerName || '配套包待报价',
      projectName: meta.projectName || `${pkg.gearbox.model} 整机配套`
    }
  );
};

// 获取保存的报价单列表
// Continuing quotationManager.js...

// 获取保存的报价单列表
export const getSavedQuotations = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('quotationSaves') || '[]');
    return saved;
  } catch (error) {
    console.error("获取保存的报价单列表失败:", error);
    return [];
  }
};

// 加载特定的报价单
export const loadSavedQuotation = (quotationId) => {
  try {
    // 从本地存储获取报价单历史
    const quotationSaves = JSON.parse(localStorage.getItem('quotationSaves') || '[]');
    
    // 查找指定ID的报价单
    const savedQuotation = quotationSaves.find(q => q.id === quotationId);
    
    if (!savedQuotation || !savedQuotation.data) {
      console.error('找不到指定的保存报价单:', quotationId);
      return null;
    }

    // 重建 getter（JSON序列化后getter丢失）
    if (savedQuotation.data && Array.isArray(savedQuotation.data.items)) {
      savedQuotation.data.items = savedQuotation.data.items.map(item => {
        if (item.prices && item.selectedPrice && typeof item.unitPrice !== 'function') {
          const restored = { ...item };
          Object.defineProperty(restored, 'unitPrice', {
            get() { return this.prices[this.selectedPrice] || 0; },
            enumerable: true, configurable: true
          });
          Object.defineProperty(restored, 'amount', {
            get() { return this.unitPrice * this.quantity; },
            enumerable: true, configurable: true
          });
          return restored;
        }
        return item;
      });
      // 重算总金额
      const total = savedQuotation.data.items.reduce((sum, item) => {
        const amt = typeof item.amount === 'number' ? item.amount : 0;
        return sum + amt;
      }, 0);
      if (total > 0) savedQuotation.data.totalAmount = total;
    }

    return savedQuotation;
  } catch (error) {
    console.error("加载保存报价单错误:", error);
    return null;
  }
};

// 删除保存的报价单
export const deleteSavedQuotation = (quotationId) => {
  try {
    const quotationSaves = JSON.parse(localStorage.getItem('quotationSaves') || '[]');
    const filtered = quotationSaves.filter(q => q.id !== quotationId);
    
    if (filtered.length === quotationSaves.length) {
      console.warn(`未找到ID为 ${quotationId} 的报价单`);
      return false;
    }
    
    localStorage.setItem('quotationSaves', JSON.stringify(filtered));

    // 同步删除 gearbox_quotations
    try {
      const gqList = JSON.parse(localStorage.getItem('gearbox_quotations') || '[]');
      const gqFiltered = gqList.filter(q => q.id !== quotationId);
      if (gqFiltered.length !== gqList.length) {
        localStorage.setItem('gearbox_quotations', JSON.stringify(gqFiltered));
      }
    } catch (e) { /* ignore */ }

    return true;
  } catch (error) {
    console.error("删除保存报价单错误:", error);
    return false;
  }
};

// 比较两个报价单
export const compareQuotations = (quotationA, quotationB) => {
  if (!quotationA || !quotationB) {
    console.error('无法比较：至少一个报价单无效');
    return null;
  }
  
  try {
    // 创建比较结果对象
    const comparison = {
      date: new Date().toISOString(),
      quotationA: {
        id: quotationA.quotationNumber,
        date: quotationA.date,
        totalAmount: quotationA.totalAmount,
        itemCount: quotationA.items.length
      },
      quotationB: {
        id: quotationB.quotationNumber,
        date: quotationB.date,
        totalAmount: quotationB.totalAmount,
        itemCount: quotationB.items.length
      },
      differences: []
    };
    
    // 比较总金额
    const totalAmountDiff = quotationB.totalAmount - quotationA.totalAmount;
    comparison.differences.push({
      type: 'totalAmount',
      description: '报价总金额',
      valueA: quotationA.totalAmount,
      valueB: quotationB.totalAmount,
      difference: totalAmountDiff,
      percentChange: totalAmountDiff !== 0 ? (totalAmountDiff / Math.abs(quotationA.totalAmount)) * 100 : 0
    });
    
    // 比较项目
    const itemsA = quotationA.items || [];
    const itemsB = quotationB.items || [];
    
    // 创建项目映射
    const itemMapA = itemsA.reduce((map, item) => {
      map[item.model] = item;
      return map;
    }, {});
    
    const itemMapB = itemsB.reduce((map, item) => {
      map[item.model] = item;
      return map;
    }, {});
    
    // 找出所有项目型号
    const allModels = [...new Set([
      ...itemsA.map(item => item.model),
      ...itemsB.map(item => item.model)
    ])];
    
    // 比较每个项目
    allModels.forEach(model => {
      const itemA = itemMapA[model];
      const itemB = itemMapB[model];
      
      if (itemA && itemB) {
        // 两个报价单都有该项目 - 比较价格
        if (itemA.unitPrice !== itemB.unitPrice) {
          const priceDiff = itemB.unitPrice - itemA.unitPrice;
          comparison.differences.push({
            type: 'itemPrice',
            model: model,
            description: `${itemA.name} (${model})`,
            valueA: itemA.unitPrice,
            valueB: itemB.unitPrice,
            difference: priceDiff,
            percentChange: priceDiff !== 0 ? (priceDiff / Math.abs(itemA.unitPrice)) * 100 : 0
          });
        }
      } else if (itemA) {
        // 只有报价单A有该项目
        comparison.differences.push({
          type: 'itemRemoved',
          model: model,
          description: `${itemA.name} (${model})`,
          valueA: itemA.unitPrice,
          valueB: 0,
          difference: -itemA.unitPrice,
          percentChange: -100
        });
      } else if (itemB) {
        // 只有报价单B有该项目
        comparison.differences.push({
          type: 'itemAdded',
          model: model,
          description: `${itemB.name} (${model})`,
          valueA: 0,
          valueB: itemB.unitPrice,
          difference: itemB.unitPrice,
          percentChange: 100
        });
      }
    });
    
    return comparison;
  } catch (error) {
    console.error("比较报价单错误:", error);
    return null;
  }
};

// 导出报价单比较为Excel
export const exportComparisonToExcel = async (comparison, filename = '报价单比较') => {
  if (!comparison) return false;
  try {
    const { loadXLSX } = await import('./dynamicImports');
    const XLSX = await loadXLSX();
    const wb = XLSX.utils.book_new();

    // 构建对比表格数据
    const headers = ['对比项', ...(comparison.items || []).map((_, i) => `报价单${i + 1}`)];
    const rows = [];

    // 基本信息行
    rows.push(['报价单名称', ...(comparison.items || []).map(q => q.name || '-')]);
    rows.push(['客户名称', ...(comparison.items || []).map(q => q.customerName || '-')]);
    rows.push(['齿轮箱型号', ...(comparison.items || []).map(q => q.gearboxModel || '-')]);
    rows.push(['总价 (元)', ...(comparison.items || []).map(q => q.totalPrice || 0)]);
    rows.push(['折扣率', ...(comparison.items || []).map(q => q.discountRate ? (q.discountRate * 100 + '%') : '-')]);
    rows.push(['创建日期', ...(comparison.items || []).map(q => q.date || '-')]);

    // 差异分析
    if (comparison.summary) {
      rows.push([]);
      rows.push(['价格差异', comparison.summary.priceDiff || '-']);
      rows.push(['推荐方案', comparison.summary.recommendation || '-']);
    }

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    // 设置列宽
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 15 : 20 }));
    XLSX.utils.book_append_sheet(wb, ws, '报价单对比');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('导出报价单比较Excel失败:', error);
    return false;
  }
};