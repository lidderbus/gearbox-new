// src/utils/dataExporter.js
// 性能优化: 改为动态导入 xlsx
// import * as XLSX from 'xlsx';

import {
  PRICE_VERSION,
  getPriceStatus,
  PriceStatus,
  getExportWatermarkText
} from './priceVersioning';

// 动态加载 xlsx
async function loadXLSX() {
  return await import(/* webpackChunkName: "xlsx" */ 'xlsx');
}

/**
 * 在工作簿首位插入「_价格版本」元数据 Sheet。
 * 给所有导出统一打上价格截止日 + 状态。
 */
function appendPriceVersionSheet(XLSX, wb) {
  const status = getPriceStatus();
  const statusLabel = status === PriceStatus.EXPIRED
    ? '已过期'
    : status === PriceStatus.EXPIRING_SOON
      ? '即将过期'
      : '有效';
  const rows = [
    { 字段: '价格版本', 值: PRICE_VERSION.version },
    { 字段: '生效日期', 值: PRICE_VERSION.effectiveDate },
    { 字段: '最后更新', 值: PRICE_VERSION.lastUpdated },
    { 字段: '过期日期', 值: PRICE_VERSION.expiryDate },
    { 字段: '当前状态', 值: statusLabel },
    { 字段: '数据来源', 值: PRICE_VERSION.source },
    { 字段: '导出时间', 值: new Date().toISOString().slice(0, 19).replace('T', ' ') },
    { 字段: '说明', 值: '本文件价格基于上述截止日期，超期请联系管理员核对。' }
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 14 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws, '_价格版本');
}

/**
 * 在已存在的 Sheet 顶部 prepend 一行水印 banner。
 * 这是一个轻量包装：调用方先 json_to_sheet, 再传入此函数。
 */
function prependWatermarkRow(XLSX, ws) {
  try {
    const watermark = getExportWatermarkText();
    XLSX.utils.sheet_add_aoa(ws, [[watermark]], { origin: 'A1' });
  } catch (e) {
    // 不阻断导出
  }
}

export const exportDataToJson = (data, filename = 'gearbox-data') => {
  try {
    // 创建Blob对象
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return true;
  } catch (error) {
    console.error('导出数据到JSON失败:', error);
    return false;
  }
};

export const exportDataToExcel = async (data, filename = 'gearbox-data') => {
  try {
    // 动态加载 xlsx
    const XLSX = await loadXLSX();

    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 首张固定为价格版本元数据
    appendPriceVersionSheet(XLSX, wb);

    // 处理各类数据
    const categories = {
      'HC系列齿轮箱': data.hcGearboxes || [],
      'GW系列齿轮箱': data.gwGearboxes || [],
      'HCM系列齿轮箱': data.hcmGearboxes || [],
      'DT系列齿轮箱': data.dtGearboxes || [],
      'HCQ系列齿轮箱': data.hcqGearboxes || [],
      'GC系列齿轮箱': data.gcGearboxes || [],
      '高弹性联轴器': data.flexibleCouplings || [],
      '备用泵': data.standbyPumps || []
    };

    // 为每类数据创建工作表
    Object.entries(categories).forEach(([name, items]) => {
      if (items.length > 0) {
        // 转换数据，确保数组字段正确导出为字符串
        const processedItems = items.map(item => {
          const newItem = { ...item };

          // 处理数组字段
          Object.entries(newItem).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              newItem[key] = value.join(', ');
            }
          });

          return newItem;
        });

        // 创建工作表（先在 A2 写表头数据，A1 留给水印）
        const ws = XLSX.utils.json_to_sheet(processedItems, { origin: 'A2' });
        prependWatermarkRow(XLSX, ws);

        // 添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, name);
      }
    });

    // 导出工作簿
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('导出数据到Excel失败:', error);
    return false;
  }
};

/**
 * S4: 导出联轴器对比图当前筛选/排序结果到 Excel
 * @param {Array<Object>} couplings - 已筛选并排序的候选列表
 * @param {Object} filters - 当前筛选条件 { filterClass, filterSpeedBand, filterTorqueBand, sortKey, requiredTorque }
 * @param {string} [filename]
 */
export const exportCouplingComparisonToExcel = async (couplings, filters = {}, filename = 'coupling-comparison') => {
  try {
    const XLSX = await loadXLSX();
    const wb = XLSX.utils.book_new();

    appendPriceVersionSheet(XLSX, wb);

    // Sheet 1: 筛选条件
    const filterRows = [
      { 字段: '船检要求', 值: filters.filterClass || 'all' },
      { 字段: '转速段', 值: filters.filterSpeedBand || 'all' },
      { 字段: '扭矩段', 值: filters.filterTorqueBand || 'all' },
      { 字段: '排序', 值: filters.sortKey || 'rated-desc' },
      { 字段: '所需扭矩 (kN·m)', 值: filters.requiredTorque ?? '-' },
      { 字段: '导出时间', 值: new Date().toISOString().slice(0, 19).replace('T', ' ') }
    ];
    const filterWs = XLSX.utils.json_to_sheet(filterRows, { origin: 'A2' });
    prependWatermarkRow(XLSX, filterWs);
    XLSX.utils.book_append_sheet(wb, filterWs, '筛选条件');

    // Sheet 2: 对比数据
    const dataRows = (couplings || []).map((c, i) => {
      const certs = Array.isArray(c.certifications) ? c.certifications.join(', ') : (c.certifications || '');
      return {
        '序号': i + 1,
        '型号': c.model || '-',
        '额定扭矩 (kN·m)': c.ratedTorque ?? '-',
        '最大扭矩 (kN·m)': c.maxTorque ?? '-',
        '最高转速 (rpm)': c.maxSpeed ?? c.ratedSpeed ?? '-',
        '所需扭矩 (kN·m)': filters.requiredTorque ?? '-',
        '扭矩余量 (%)': filters.requiredTorque
          ? (((c.ratedTorque || 0) - filters.requiredTorque) / filters.requiredTorque * 100).toFixed(1)
          : '-',
        '综合评分': c.score ?? '-',
        '基础价 (元)': c.basePrice ?? '-',
        '重量 (kg)': c.weight ?? '-',
        '船检证书': certs
      };
    });
    if (dataRows.length === 0) {
      dataRows.push({ '提示': '当前筛选条件下没有匹配的联轴器。' });
    }
    const dataWs = XLSX.utils.json_to_sheet(dataRows, { origin: 'A2' });
    prependWatermarkRow(XLSX, dataWs);
    XLSX.utils.book_append_sheet(wb, dataWs, '联轴器对比');

    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    return true;
  } catch (error) {
    console.error('导出联轴器对比到Excel失败:', error);
    return false;
  }
};

// 导出当前选择的齿轮箱数据
export const exportSelectionToExcel = async (selectionResult, filename = 'gearbox-selection') => {
  try {
    // 动态加载 xlsx
    const XLSX = await loadXLSX();

    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 首张固定为价格版本元数据
    appendPriceVersionSheet(XLSX, wb);

    // 创建选型结果工作表
    if (selectionResult && selectionResult.recommendations && selectionResult.recommendations.length > 0) {
      const recommendationsData = selectionResult.recommendations.map((rec, index) => ({
        '序号': index + 1,
        '型号': rec.model,
        '减速比': rec.ratio,
        '传递能力': rec.transferCapacity,
        '传递能力余量(%)': rec.capacityMargin.toFixed(2),
        '推力(kN)': rec.thrust,
        '重量(kg)': rec.weight,
        '评分': rec.score.toFixed(2),
        '出厂价(元)': rec.factoryPrice || '-',
        '市场价(元)': rec.marketPrice || '-'
      }));

      const recommendationsWs = XLSX.utils.json_to_sheet(recommendationsData, { origin: 'A2' });
      prependWatermarkRow(XLSX, recommendationsWs);
      XLSX.utils.book_append_sheet(wb, recommendationsWs, '选型推荐');
    }
    
    // 创建配套组件工作表
    if (selectionResult && (selectionResult.flexibleCoupling || selectionResult.standbyPump)) {
      const componentsData = [];
      
      if (selectionResult.flexibleCoupling && selectionResult.flexibleCoupling.success) {
        componentsData.push({
          '类型': '高弹性联轴器',
          '型号': selectionResult.flexibleCoupling.model,
          '扭矩(kN·m)': selectionResult.flexibleCoupling.torque,
          '扭矩余量(%)': selectionResult.flexibleCoupling.torqueMargin?.toFixed(2) || '-',
          '重量(kg)': selectionResult.flexibleCoupling.weight || '-',
          '价格(元)': selectionResult.flexibleCoupling.price || '-'
        });
      }
      
      if (selectionResult.standbyPump && selectionResult.standbyPump.success) {
        componentsData.push({
          '类型': '备用泵',
          '型号': selectionResult.standbyPump.model,
          '流量(m³/h)': selectionResult.standbyPump.flow,
          '压力(MPa)': selectionResult.standbyPump.pressure,
          '电机功率(kW)': selectionResult.standbyPump.motorPower || '-',
          '价格(元)': selectionResult.standbyPump.price || '-'
        });
      }
      
      if (componentsData.length > 0) {
        const componentsWs = XLSX.utils.json_to_sheet(componentsData, { origin: 'A2' });
        prependWatermarkRow(XLSX, componentsWs);
        XLSX.utils.book_append_sheet(wb, componentsWs, '配套组件');
      }
    }

    // 创建选型参数工作表
    const paramsData = [
      { '参数': '主机功率', '值': `${selectionResult.enginePower || '-'} kW` },
      { '参数': '主机转速', '值': `${selectionResult.engineSpeed || '-'} r/min` },
      { '参数': '目标减速比', '值': selectionResult.targetRatio || '-' },
      { '参数': '推力要求', '值': `${selectionResult.thrustRequirement || '-'} kN` },
      { '参数': '所需传递能力', '值': `${selectionResult.requiredTransferCapacity?.toFixed(6) || '-'} kW/r·min` },
      { '参数': '主机扭矩', '值': `${selectionResult.engineTorque?.toFixed(2) || '-'} N·m` }
    ];

    const paramsWs = XLSX.utils.json_to_sheet(paramsData, { origin: 'A2' });
    prependWatermarkRow(XLSX, paramsWs);
    XLSX.utils.book_append_sheet(wb, paramsWs, '选型参数');
    
    // 导出工作簿
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('导出选型结果到Excel失败:', error);
    return false;
  }
};