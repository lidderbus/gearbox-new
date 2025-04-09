// src/utils/agreementGenerator.js
// 技术协议相关功能模块

// 引入 docx 组件用于构建 Word 文档
// *** 修正：确保引入所有需要的 docx 组件 ***
import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun, WidthType, BorderStyle } from 'docx';
// 导入 PDF 导出功能
import { exportAgreementToPDF } from './pdfExportUtils';

/**
 * 生成技术协议数据
 * @param {Object} selectionResult - 选型结果
 * @param {Object} projectInfo - 项目信息
 * @param {Object} selectedComponents - 选中的组件（齿轮箱、联轴器、备用泵）
 * @returns {Object} 包含技术协议内容的对象
 */
export const generateAgreement = (selectionResult, projectInfo, selectedComponents) => {
  // *** 注意：这是文件中唯一且正确的 generateAgreement 函数定义 ***
  // *** 重复的、错误的 try...catch 块已被删除 ***
  try {
    // 获取当前日期
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('zh-CN');

    // 提取组件数据, 使用可选链和默认值
    const gearbox = selectedComponents?.gearbox || {};
    const coupling = selectedComponents?.coupling; // 可以为 null
    const pump = selectedComponents?.pump; // 可以为 null

    // 标准随机供应配件
    const standardAccessories = [
      "滑油冷却器", "滑油过滤器", "工作油过滤器", "齿轮油泵",
      "油标尺", "透气帽", "操纵阀", "安全阀", "溢流阀", "单向阀"
    ];

    // 标准监控仪表
    const standardMonitoring = [
      { name: "正车工作油压力", range: "0～3MPa" },
      { name: "倒车工作油压力", range: "0～3MPa" },
      { name: "滑油压力", range: "0～1MPa" },
      { name: "滑油温度", range: "0～100℃" }
    ];

    // 标准技术文件
    const standardDocuments = [
      "使用说明书 2份", "总装图 2份", "外形安装图 2份",
      "电气控制原理图 2份", "产品合格证书 1份", "船检证书 1份"
    ];

    // 创建技术协议对象
    const agreement = {
      success: true,
      agreementDate: formattedDate,
      content: {
        title: "船用齿轮箱技术协议",
        generalInfo: {
          buyer: projectInfo?.customerName || "",
          seller: "杭州前进齿轮箱集团股份有限公司",
          projectName: projectInfo?.projectName || ""
        },
        engineData: {
          model: projectInfo?.engineModel || "",
          power: gearbox.power || selectionResult?.enginePower || "",
          speed: gearbox.speed || selectionResult?.engineSpeed || "",
          direction: "顺时针（面对飞轮）"
        },
        gearboxData: {
          model: gearbox.model || '-',
          ratio: gearbox.ratio || '-',
          transferCapacity: typeof gearbox.transferCapacity === 'number'
            ? gearbox.transferCapacity
            : (Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > 0 ? gearbox.transferCapacity[0] : "-"),
          thrust: gearbox.thrust ? `${gearbox.thrust} kN` : '-',
          centerDistance: gearbox.centerDistance || "-",
          weight: gearbox.weight ? `${gearbox.weight} kg` : '-',
          inputSpeedRange: formatSpeedRange(gearbox.inputSpeedRange),
          oilType: "CD40",
          lubricationOilPressure: "0.04～0.4MPa",
          lubricationOilTemperature: "≤75℃"
        },
        // Add coupling data if available
        couplingData: selectedComponents.coupling ? {
          model: selectedComponents.coupling.model || '-',
          type: "高弹性联轴器",
          specifications: selectedComponents.coupling.specifications || '-',
          torque: selectedComponents.coupling.torque || '-',
          weight: selectedComponents.coupling.weight ? `${selectedComponents.coupling.weight} kg` : '-'
        } : null,
        // Add standby pump data if available
        standbyPumpData: selectedComponents.pump ? {
          model: selectedComponents.pump.model || '-',
          type: "备用泵",
          specifications: selectedComponents.pump.specifications || '-',
          flow: selectedComponents.pump.flow || '-',
          pressure: selectedComponents.pump.pressure || '-',
          power: selectedComponents.pump.power || '-'
        } : null,
        accessories: standardAccessories,
        monitoringInstruments: standardMonitoring,
        technicalDocuments: standardDocuments,
        qualityAssurance: {
          testStandard: "产品出厂前按CCS规范测试",
          warranty: "产品自交付之日起12个月内质保"
        }
      }
    };

    return agreement; // 这个 return 在正确的函数作用域内
  } catch (error) {
    console.error("生成技术协议错误:", error);
    return {
      success: false,
      message: '生成技术协议出错: ' + (error.message || '未知错误')
    };
  }
}; // *** 这是 generateAgreement 函数的结束括号 ***

/**
 * 导出技术协议为Word文档
 * @param {Object} agreement - 技术协议数据
 * @param {string} filename - 导出的文件名
 * @returns {Promise<Object>} 导出结果
 */
export const exportAgreementToWord = async (agreement, filename = '船用齿轮箱技术协议') => {
  if (!agreement || !agreement.success || !agreement.content) {
    console.error("无法导出Word：协议数据无效");
    throw new Error('协议数据无效');
  }

  const { content } = agreement;
  const generalInfo = content.generalInfo || {};
  const engineData = content.engineData || {};
  const gearboxData = content.gearboxData || {};
  const couplingData = content.couplingData;
  const standbyPumpData = content.standbyPumpData;
  const accessories = content.accessories || [];
  const monitoringInstruments = content.monitoringInstruments || [];
  const technicalDocuments = content.technicalDocuments || [];
  const qualityAssurance = content.qualityAssurance || {};

  // --- Helper Functions for Docx ---
  const createSectionTitle = (text) => new Paragraph({ text: text, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } });
  const createKeyValueRow = (key, value) => new TableRow({
      children: [
          new TableCell({ width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph(key)] }),
          new TableCell({ width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph(value || '-')] }),
      ],
  });
  const createTwoColKeyValueRow = (key1, value1, key2, value2) => new TableRow({
      children: [
          new TableCell({ width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph(key1)] }),
          new TableCell({ width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph(value1 || '-')] }),
          new TableCell({ width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph(key2)] }),
          new TableCell({ width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph(value2 || '-')] }),
      ],
  });
  const createListItem = (text) => new Paragraph({ text: text, bullet: { level: 0 } });
  // --- End Helper Functions ---

  try {
    const children = [
      new Paragraph({ text: content.title || '船用齿轮箱技术协议', heading: HeadingLevel.TITLE, alignment: 'center', spacing: { after: 300 } }),

      // 基本信息
      createSectionTitle('基本信息'),
      new Table({
          width: { size: 9000, type: WidthType.DXA },
          rows: [
              createTwoColKeyValueRow('买方', generalInfo.buyer, '卖方', generalInfo.seller),
              createTwoColKeyValueRow('项目名称', generalInfo.projectName, '签署日期', agreement.agreementDate),
          ],
      }),

      // 主机参数
      createSectionTitle('一、主机参数'),
       new Table({
           width: { size: 9000, type: WidthType.DXA },
           rows: [
               createTwoColKeyValueRow('1. 型号', engineData.model, '2. 额定功率', engineData.power ? `${engineData.power} kW` : '-'),
               createTwoColKeyValueRow('3. 额定转速', engineData.speed ? `${engineData.speed} r/min` : '-', '4. 转向', engineData.direction),
           ],
       }),

      // 高弹性联轴器 (如果存在)
      ...(couplingData ? [
          createSectionTitle('二、橡胶高弹联轴器'),
           new Table({
               width: { size: 9000, type: WidthType.DXA },
               rows: [
                   createKeyValueRow('1. 型号', couplingData.model),
                   // *** 修正：添加了之前可能缺失的扭矩和重量显示 ***
                   ...(couplingData.torque ? [createKeyValueRow('2. 额定扭矩', couplingData.torque)] : []),
                   ...(couplingData.weight ? [createKeyValueRow('3. 重量', couplingData.weight)] : []),
                   createKeyValueRow('4. 配齐联接件', '配齐高弹与齿轮箱、柴油机连接的全部连接件'),
               ],
           }),
      ] : []),

      // 齿轮箱参数
      createSectionTitle(couplingData ? '三、齿轮箱技术参数' : '二、齿轮箱技术参数'),
       new Table({
          width: { size: 9000, type: WidthType.DXA },
           rows: [
               createTwoColKeyValueRow('1. 型号', gearboxData.model, '2. 减速比', gearboxData.ratio ? `${gearboxData.ratio}：1` : '-'),
               createTwoColKeyValueRow('3. 传递能力', gearboxData.transferCapacity ? `${gearboxData.transferCapacity} kW/r/min` : '-', '4. 额定推力', gearboxData.thrust),
               // *** 修正：添加中心距单位 ***
               createTwoColKeyValueRow('5. 中心距', gearboxData.centerDistance ? `${gearboxData.centerDistance} mm` : '-', '6. 重量', gearboxData.weight ? `${gearboxData.weight} kg` : '-'),
               // *** 修正：调用 formatSpeedRange ***
               createTwoColKeyValueRow('7. 输入转速范围', formatSpeedRange(gearboxData.inputSpeedRange), '8. 润滑油牌号', gearboxData.oilType),
               createTwoColKeyValueRow('9. 润滑油压力', gearboxData.lubricationOilPressure, '10. 润滑油温度', gearboxData.lubricationOilTemperature),
           ],
       }),

      // 备用泵 (如果存在)
       ...(standbyPumpData ? [
          createSectionTitle(couplingData ? '四、备用泵' : '三、备用泵'),
           new Table({
               width: { size: 9000, type: WidthType.DXA },
               rows: [
                   ...(standbyPumpData.model ? [createKeyValueRow('型号', standbyPumpData.model)] : []),
                   ...(standbyPumpData.flow ? [createKeyValueRow('流量', standbyPumpData.flow)] : []),
                   ...(standbyPumpData.pressure ? [createKeyValueRow('压力', standbyPumpData.pressure)] : []),
                   ...(standbyPumpData.power ? [createKeyValueRow('电机功率', standbyPumpData.power)] : []),
               ],
           }),
       ] : []),

        // 动态计算后续章节的序号
       ...(() => { // 使用 IIFE 来包含逻辑并返回数组
            let sectionCounter = 3 + (couplingData ? 1 : 0) + (standbyPumpData ? 1 : 0);
            const sections = [];
            const sectionTitles = ['一','二','三','四','五','六','七','八','九','十']; // 确保足够

            // 随机供应配件
            sections.push(createSectionTitle(`${sectionTitles[sectionCounter-1]}、随机供应配件`));
            if (accessories.length > 0) {
                accessories.forEach(item => sections.push(createListItem(item)));
            } else {
                sections.push(new Paragraph('- 无'));
            }
            sectionCounter++;

            // 监控仪表
            sections.push(createSectionTitle(`${sectionTitles[sectionCounter-1]}、监控仪表`));
            if (monitoringInstruments.length > 0) {
                 monitoringInstruments.forEach(item => sections.push(createListItem(`${item.name}，传感器量程 ${item.range}`)));
            } else {
                sections.push(new Paragraph('- 无'));
            }
             sectionCounter++;

            // 随机技术文件
             sections.push(createSectionTitle(`${sectionTitles[sectionCounter-1]}、随机技术文件`));
            if (technicalDocuments.length > 0) {
                 technicalDocuments.forEach(item => sections.push(createListItem(item)));
            } else {
                sections.push(new Paragraph('- 无'));
            }
             sectionCounter++;

             // 质量保证及服务
             sections.push(createSectionTitle(`${sectionTitles[sectionCounter-1]}、质量保证及服务`));
             sections.push(new Paragraph({ text: `1. ${qualityAssurance.testStandard || "产品出厂前按国家标准测试"}`, indentation: { left: 720 } }));
             sections.push(new Paragraph({ text: `2. ${qualityAssurance.warranty || "产品自安装调试完成后18个月内质保"}`, indentation: { left: 720 } }));
             sections.push(new Paragraph({ text: '3. 未尽事宜友好协商解决。', indentation: { left: 720 } }));

            return sections;
       })(),

      // 签名区域
      new Paragraph({ text: '\n\n', spacing: { after: 400 } }), // 添加签名前的空间
      new Table({
          width: { size: 9000, type: WidthType.DXA },
          // 使用无边框单元格模拟签名区域
           borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
           rows: [
               new TableRow({
                   children: [
                       // *** 修正：确保 TableCell 的 borders 属性正确应用无边框样式 ***
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('船东（甲方）：')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('船厂/需方（甲方）：')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('制造厂（乙方）：')] }),
                   ]
               }),
               new TableRow({
                    children: [
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('\n签字：_________________')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('\n签字：_________________')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('\n签字：_________________')] }),
                   ]
               }),
               new TableRow({
                    children: [
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('日期：_________________')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('日期：_________________')] }),
                       new TableCell({ borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}}, children: [new Paragraph('日期：_________________')] }),
                   ]
               }),
           ],
      }),
    ]; // End of children array

    const doc = new Document({
       sections: [{ properties: {}, children: children }]
    });

    // 生成Word文档
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.docx`;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: `技术协议已导出为${filename}.docx`
    };
  } catch (error) {
    console.error("导出Word技术协议错误:", error);
    throw new Error('导出Word技术协议出错: ' + error.message);
  }
};

/**
 * 导出技术协议为PDF
 * @param {Object} agreement - 技术协议数据
 * @param {string} filename - 导出的文件名
 * @returns {Object} 导出结果
 */
export const exportAgreementToPDFFormat = (agreement, filename = '船用齿轮箱技术协议') => {
  try {
    // 调用 pdfExportUtils.js 中的导出函数
    return exportAgreementToPDF(agreement, filename);
  } catch (error) {
    console.error("导出PDF技术协议错误:", error);
    // *** 修正：直接抛出错误，让调用者处理 ***
    throw new Error('导出PDF技术协议出错: ' + error.message);
  }
};

/**
 * 格式化转速范围
 * @param {Array|string|number} speedRange - 转速范围数据
 * @returns {string} 格式化后的转速范围字符串
 */
const formatSpeedRange = (speedRange) => {
  if (speedRange === undefined || speedRange === null) return "-";
  if (typeof speedRange === 'string') return speedRange.trim() || "-";
  // *** 修正：确保数组元素存在再格式化 ***
  if (Array.isArray(speedRange) && speedRange.length === 2 && speedRange[0] !== undefined && speedRange[1] !== undefined) return `${speedRange[0]}-${speedRange[1]}`;
  if (typeof speedRange === 'number') return speedRange.toString();
  return "-"; // 默认值
};

// *** 文件末尾不再有悬空的 } (根据 fetched content 分析) ***