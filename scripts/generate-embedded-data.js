#!/usr/bin/env node
/**
 * 一次性生成脚本: 将 completeGearboxData.js 的全部700型号同步到 embeddedData.js
 *
 * 策略:
 * 1. 保留现有 embeddedData 中215个型号的手工调优数据
 * 2. 从 completeGearboxData 追加不存在的新型号
 * 3. 按系列映射规则分组
 *
 * 用法: node scripts/generate-embedded-data.js
 */

const fs = require('fs');
const path = require('path');

// ==================== 系列映射 ====================
// 基于 selectionAlgorithm.ts 的10种搜索类型 + repair.js 的 collection keys
const SERIES_TO_COLLECTION = {
    // HC 大家族 → hcGearboxes (selection算法用 'HC' 类型搜索)
    'HC': 'hcGearboxes',
    'HCD': 'hcGearboxes',
    'HCT': 'hcGearboxes',
    'HCL': 'hcGearboxes',
    'HCS': 'hcGearboxes',
    'HCG': 'hcGearboxes',
    'HCN': 'hcGearboxes',
    'HCNM': 'hcGearboxes',
    'HCW': 'hcGearboxes',
    'HCH': 'hcGearboxes',
    'HCP': 'hcGearboxes',
    'HCDF': 'hcGearboxes',
    'HCDX': 'hcGearboxes',
    'HCTH': 'hcGearboxes',
    'MB': 'hcGearboxes',
    'MA': 'hcGearboxes',
    '混合动力': 'hcGearboxes',
    '船用双速': 'hcGearboxes',

    // GW 系列
    'GW': 'gwGearboxes',
    'GWC': 'gwGearboxes',
    'GWS': 'gwGearboxes',
    'GWD': 'gwGearboxes',
    'GWH': 'gwGearboxes',
    'GWL': 'gwGearboxes',
    'GWK': 'gwGearboxes',
    'SGW': 'gwGearboxes',
    'SGWL': 'gwGearboxes',

    // 独立系列 (各有自己的 collection key)
    'HCM': 'hcmGearboxes',
    'DT': 'dtGearboxes',
    'HCQ': 'hcqGearboxes',
    'HCQH': 'hcqGearboxes',
    'HCA': 'hcaGearboxes',
    'HCAG': 'hcaGearboxes',
    'HCAM': 'hcaGearboxes',
    'HCV': 'hcvGearboxes',
    'HCVG': 'hcvGearboxes',
    'HCX': 'hcxGearboxes',
    'MV': 'mvGearboxes',

    // GC 系列 (含变距桨)
    'GC': 'gcGearboxes',
    'GC配变距桨': 'gcGearboxes',
    'GCS': 'gcGearboxes',
    'GCH': 'gcGearboxes',
    'GCD': 'gcGearboxes',
    'GSH': 'gcGearboxes',
    'GCC': 'gcGearboxes',
    'GCHT': 'gcGearboxes',
    'GCHE': 'gcGearboxes',

    // 其他
    'other': 'otherGearboxes',
    'X6': 'otherGearboxes',
};

// ==================== 解析源数据 ====================

function parseCompleteData() {
    const filePath = path.join(__dirname, '../src/data/completeGearboxData.js');
    const text = fs.readFileSync(filePath, 'utf8');

    // 找到 const completeGearboxData = [ 后面的 [
    const marker = 'const completeGearboxData = [';
    const markerIdx = text.indexOf(marker);
    if (markerIdx === -1) {
        throw new Error('无法找到 completeGearboxData 定义');
    }
    const startIdx = markerIdx + marker.length - 1; // 指向 [

    // 从 [ 开始找匹配的 ]，注意跳过字符串中的 [ ]
    let depth = 0;
    let endIdx = -1;
    let inString = false;
    let escape = false;
    for (let i = startIdx; i < text.length; i++) {
        const ch = text[i];
        if (escape) { escape = false; continue; }
        if (ch === '\\' && inString) { escape = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (ch === '[') depth++;
        else if (ch === ']') {
            depth--;
            if (depth === 0) { endIdx = i; break; }
        }
    }
    if (endIdx === -1) {
        throw new Error('无法找到 completeGearboxData 数组结束位置');
    }

    const jsonStr = text.substring(startIdx, endIdx + 1);
    const data = JSON.parse(jsonStr);
    console.log(`[completeGearboxData] 解析到 ${data.length} 个型号`);
    return data;
}

function parseEmbeddedData() {
    const filePath = path.join(__dirname, '../src/data/embeddedData.js');
    const text = fs.readFileSync(filePath, 'utf8');

    // 提取 embeddedGearboxData 对象中的各个集合
    // 找到 JSON-like 对象区域
    const startMarker = 'export const embeddedGearboxData = ';
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) {
        throw new Error('无法找到 embeddedGearboxData 定义');
    }

    // 找到对象起始的 {
    const objStart = text.indexOf('{', startIdx + startMarker.length);

    // 找匹配的 }，注意跳过字符串中的 { }
    let depth = 0;
    let objEnd = -1;
    let inStr = false;
    let esc = false;
    for (let i = objStart; i < text.length; i++) {
        const ch = text[i];
        if (esc) { esc = false; continue; }
        if (ch === '\\' && inStr) { esc = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                objEnd = i;
                break;
            }
        }
    }

    if (objEnd === -1) {
        throw new Error('无法找到 embeddedGearboxData 结束位置');
    }

    const jsonStr = text.substring(objStart, objEnd + 1);
    const data = JSON.parse(jsonStr);

    // 统计现有型号
    let totalExisting = 0;
    const existingModels = new Set();
    const collections = {};

    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) continue;
        if (Array.isArray(value)) {
            collections[key] = value;
            value.forEach(item => {
                if (item.model) {
                    existingModels.add(item.model);
                    totalExisting++;
                }
            });
        }
    }

    console.log(`[embeddedData] 解析到 ${totalExisting} 个现有型号，分布在 ${Object.keys(collections).length} 个集合中`);
    for (const [key, arr] of Object.entries(collections)) {
        console.log(`  ${key}: ${arr.length} 个`);
    }

    return { data, collections, existingModels };
}

// ==================== 字段转换 ====================

function convertItem(item) {
    const converted = {
        model: item.model,
    };

    // 转速范围
    if (item.minSpeed != null && item.maxSpeed != null) {
        converted.inputSpeedRange = [item.minSpeed, item.maxSpeed];
    } else if (item.inputSpeedRange) {
        converted.inputSpeedRange = item.inputSpeedRange;
    }

    // 减速比 (保持数组格式，embeddedData 用数组)
    if (Array.isArray(item.ratios)) {
        converted.ratios = item.ratios;
    }

    // 传递能力 (completeData 用 transmissionCapacityPerRatio，embeddedData 用 transferCapacity)
    if (Array.isArray(item.transmissionCapacityPerRatio)) {
        converted.transferCapacity = item.transmissionCapacityPerRatio;
    } else if (Array.isArray(item.transferCapacity)) {
        converted.transferCapacity = item.transferCapacity;
    }

    // 推力
    if (item.thrust != null) converted.thrust = item.thrust;

    // 中心距
    if (item.centerDistance != null) converted.centerDistance = item.centerDistance;

    // 重量
    if (item.weight != null) converted.weight = item.weight;

    // 尺寸
    if (item.dimensions) converted.dimensions = item.dimensions;

    // 效率 (默认 0.97)
    converted.efficiency = item.efficiency || 0.97;

    // 价格
    if (item.price != null) {
        converted.basePrice = item.price;
        converted.price = item.price;
    }
    if (item.discountRate != null) {
        converted.discountRate = item.discountRate;
    }

    // 功率范围
    if (item.minPower != null && item.maxPower != null) {
        converted.powerRange = { min: item.minPower, max: item.maxPower };
    }

    // 图片
    if (item.image) converted.image = item.image;
    else if (item.imageUrl) converted.image = item.imageUrl;

    // 来源信息 (保留有用的字段)
    if (item.note) converted.notes = item.note;
    if (item.source) converted.source = item.source;
    if (item.applications) converted.applications = item.applications;

    return converted;
}

function getCollectionKey(series) {
    if (!series) return 'otherGearboxes';

    // 直接匹配
    if (SERIES_TO_COLLECTION[series]) {
        return SERIES_TO_COLLECTION[series];
    }

    // 前缀匹配 (处理可能遗漏的子系列)
    const prefixes = ['HCQ', 'HCA', 'HCV', 'HCX', 'HCM', 'HCD', 'HCT', 'HCL', 'HCS', 'HCG', 'HCN', 'HCW', 'HC', 'GWC', 'GWS', 'GWD', 'GWH', 'GWL', 'GWK', 'GW', 'SGW', 'GCS', 'GCH', 'GCD', 'GCC', 'GCHT', 'GCHE', 'GC', 'DT', 'MV', 'MB', 'MA'];
    for (const prefix of prefixes) {
        if (series.startsWith(prefix)) {
            return SERIES_TO_COLLECTION[prefix] || 'otherGearboxes';
        }
    }

    console.warn(`  ⚠ 未知系列 "${series}"，放入 otherGearboxes`);
    return 'otherGearboxes';
}

// ==================== 主逻辑 ====================

function main() {
    console.log('=== 同步 completeGearboxData → embeddedData ===\n');

    // 1. 解析两个数据源
    const completeData = parseCompleteData();
    const { data: embeddedObj, collections, existingModels } = parseEmbeddedData();

    // 2. 找出需要新增的型号
    const newModels = completeData.filter(item => !existingModels.has(item.model));
    const skippedModels = completeData.filter(item => existingModels.has(item.model));

    console.log(`\n保留现有: ${existingModels.size} 个`);
    console.log(`新增: ${newModels.length} 个`);
    console.log(`跳过(已存在): ${skippedModels.length} 个`);

    // 3. 确保所有 collection key 存在
    const allCollectionKeys = new Set(Object.values(SERIES_TO_COLLECTION));
    for (const key of allCollectionKeys) {
        if (!collections[key]) {
            collections[key] = [];
        }
    }

    // 4. 转换并追加新型号
    const seriesStats = {};
    for (const item of newModels) {
        const collKey = getCollectionKey(item.series);
        const converted = convertItem(item);
        collections[collKey].push(converted);

        seriesStats[collKey] = (seriesStats[collKey] || 0) + 1;
    }

    console.log('\n新增型号分布:');
    for (const [key, count] of Object.entries(seriesStats).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${key}: +${count}`);
    }

    // 5. 统计最终结果
    let totalFinal = 0;
    console.log('\n最终各集合型号数:');
    for (const [key, arr] of Object.entries(collections).sort((a, b) => a[0].localeCompare(b[0]))) {
        console.log(`  ${key}: ${arr.length}`);
        totalFinal += arr.length;
    }
    console.log(`\n总计: ${totalFinal} 个型号`);

    // 6. 生成新的 embeddedData.js
    const outputObj = {
        "_version": 3,
        "_lastFixed": new Date().toISOString(),
        ...collections,
    };

    const outputPath = path.join(__dirname, '../src/data/embeddedData.js');

    // 构造输出文件内容
    const header = `
// src/data/embeddedData.js
// 自动生成 by scripts/generate-embedded-data.js
// 生成时间: ${new Date().toISOString()}
// 总型号数: ${totalFinal} (原215 + 新增${newModels.length})
// 数据来源: completeGearboxData.js (700型号) + 原 embeddedData.js 手工数据

// 在文件开头添加 safeParseFloat 函数定义
/**
 * 安全解析浮点数，如果解析失败则返回null或默认值
 * @param {any} value 要解析的值
 * @param {number|null} defaultValue 解析失败时返回的默认值
 * @returns {number|null} 解析结果
 */
function safeParseFloat(value, defaultValue = null) {
  // 检查 undefined, null, 或空字符串
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  // 尝试解析
  const parsed = parseFloat(value);

  // 检查是否解析为 NaN
  return isNaN(parsed) ? defaultValue : parsed;
}

// 如果项目使用了 ESM 模块，需要导出 safeParseFloat 函数
export { safeParseFloat };

`;

    const jsonContent = JSON.stringify(outputObj, null, 4);
    const output = header +
        `export const embeddedGearboxData = ${jsonContent};\n\n` +
        `// Add default export to ensure correct import from other files\n` +
        `export default embeddedGearboxData;\n`;

    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`\n✅ 已生成 ${outputPath}`);
    console.log(`   文件大小: ${(Buffer.byteLength(output) / 1024).toFixed(1)} KB`);
}

main();
