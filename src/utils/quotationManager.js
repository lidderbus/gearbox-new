// src/utils/quotationManager.js
/**
 * 报价单管理工具
 * 处理报价单保存、比较和历史记录管理
 */

// 保存报价单到本地存储
export const saveQuotation = (quotation, name, projectInfo) => {
  if (!quotation || !quotation.success) {
    console.error('无法保存无效的报价单数据');
    return false;
  }
  
  try {
    const saveName = name || `${projectInfo?.projectName || '未命名项目'} - ${new Date().toLocaleDateString()}`;
    
    // 从本地存储获取已保存的报价单
    const quotationSaves = JSON.parse(localStorage.getItem('quotationSaves') || '[]');
    
    // 创建新的保存项
    const newSave = {
      id: `quotation_${Date.now()}`,
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
    
    return true;
  } catch (error) {
    console.error("保存报价单错误:", error);
    return false;
  }
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