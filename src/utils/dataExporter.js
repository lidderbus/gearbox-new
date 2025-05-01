// src/utils/dataExporter.js
import * as XLSX from 'xlsx';

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

export const exportDataToExcel = (data, filename = 'gearbox-data') => {
  try {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
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
        
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(processedItems);
        
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

// 导出当前选择的齿轮箱数据
export const exportSelectionToExcel = (selectionResult, filename = 'gearbox-selection') => {
  try {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
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
      
      const recommendationsWs = XLSX.utils.json_to_sheet(recommendationsData);
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
        const componentsWs = XLSX.utils.json_to_sheet(componentsData);
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
    
    const paramsWs = XLSX.utils.json_to_sheet(paramsData);
    XLSX.utils.book_append_sheet(wb, paramsWs, '选型参数');
    
    // 导出工作簿
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('导出选型结果到Excel失败:', error);
    return false;
  }
};