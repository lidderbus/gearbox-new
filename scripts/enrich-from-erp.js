#!/usr/bin/env node
/**
 * enrich-from-erp.js
 *
 * 从 ERP 三个数据源聚合产品级真实交易指标,产出 src/data/marketEnrichment.json
 * 不修改任何既有数据文件 — 运行时由 dataLoader.js 合并到内存中。
 *
 * 数据源 (相对 /Users/lidder/erp-dashboard/public):
 *   - js/sales-invoice-data.js    (507 张销售发票, productInfo.products[] 已预解析)
 *   - purchase-invoice-data.js    (408 张采购发票, items[] 含 spec)
 *   - contract-data.js            (197 份合同, product 字符串)
 *
 * 型号归一化: 从 shared-data-service-v3.js 端口 normalizeModel() 简化版
 *
 * 用法: node scripts/enrich-from-erp.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ERP_DIR = path.resolve(__dirname, '../../erp-dashboard/public');
const OUT_PATH = path.resolve(__dirname, '../src/data/marketEnrichment.json');
const EMBEDDED_DATA_PATH = path.resolve(__dirname, '../src/data/embeddedData.js');

// 价格合理性阈值: 成交均价低于目录 30% 判定为零件/服务污染
const PARTS_CONTAMINATION_THRESHOLD = 0.30;
// 成交均价高于目录 2.5x 打 priceAnomaly 标记(可能是套装/服务打包/目录偏低)
const PRICE_ANOMALY_RATIO = 2.5;

// ============================================================
// 加载 embeddedData 的目录价索引 (用于 parts 污染识别)
// ============================================================

function loadCatalogPrices() {
    const text = fs.readFileSync(EMBEDDED_DATA_PATH, 'utf8');
    const catalog = {};
    const re = /"model":\s*"([^"]+)"[^}]*?"(basePrice|price)":\s*(\d+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        const model = m[1].toUpperCase();
        const val = parseInt(m[3], 10);
        if (!catalog[model]) catalog[model] = val;
    }
    return catalog;
}

// ============================================================
// 加载 ERP 数据 (JS 文件里的全局变量,用 vm 沙箱取出)
// ============================================================

function loadErpGlobal(relPath, varName) {
    const full = path.join(ERP_DIR, relPath);
    const src = fs.readFileSync(full, 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(src + `\nthis.__out = ${varName};`, sandbox);
    return sandbox.__out;
}

// ============================================================
// 型号归一化 (端口自 shared-data-service-v3.js:71)
// ============================================================

// 非齿轮箱前缀黑名单 (柴油发电机组/船用辅机等,不进入本表)
const NON_GEARBOX_PREFIX = /^(CCFJ|NTA|KTA|ZF|MAN|CUMMINS|VOLVO|YUCHAI|WEICHAI)/;

function normalizeBaseModel(raw) {
    if (!raw) return null;
    let s = String(raw).trim();
    s = s.replace(/^(电推齿轮箱|齿轮箱|离合器|柴油机|发电机组|消音器|螺旋桨|高弹|增速齿轮箱|增速箱)\s*/, '');
    s = s.replace(/:/g, ':');
    // 复合型号: HC1200/1-4.45:1
    const mc = s.match(/^([A-Za-z]*\d+(?:\.\d+)?[A-Za-z]*\/\d+[A-Za-z]*)[-]/);
    if (mc) {
        const bm = mc[1].toUpperCase();
        return isValidModel(bm) ? bm : null;
    }
    // 标准型号: HCD2001/4.95:1, 300-4.10-016, HC138
    const m = s.match(/^([A-Za-z]*\d+(?:\.\d+)?[A-Za-z]*)/);
    if (!m) return null;
    const bm = m[1].toUpperCase();
    if (!isValidModel(bm)) return null;
    return bm;
}

function isValidModel(model) {
    if (!model || model.length <= 1) return false;
    if (/^0+$/.test(model)) return false;
    if (/^0\d+$/.test(model)) return false;
    if (NON_GEARBOX_PREFIX.test(model)) return false;
    return true;
}

// 客户名归一化 (端口自 shared-data-service-v3.js:224)
// 去除"有限公司"等法人后缀 + 常见别名归一,避免 customerCount 膨胀
const CUSTOMER_ALIASES = {
    '苏州苏净船用机械': '江苏苏净船用机械',
    '安徽倍豪海洋装备技术': '合肥倍豪海洋装备技术',
    '安徽宏宇潍柴产品销售服务': '安徽宏宇潍柴产品销售',
    '江苏金洋造船厂': '江苏金洋造船',
    '安徽万鼎船舶配套设备': '安徽万鼎船舶配套',
    '无锡东方船研高性能船艇工程有限公司靖江分公司': '无锡东方船研高性能船艇工程',
    '无锡东方船研高性能船艇工程': '无锡东方船研高性能船艇工程',
    '常州市东海游艇船舶': '常州市东海游艇',
    '常州市东海船舶': '常州市东海游艇',
    '常州潍重船电产品销售服务': '常州潍重船电产品销售服务',
    '常州潍重船产品销售服务': '常州潍重船电产品销售服务',
    '张家港永丰行进出口': '张家港市永丰行进出口',
    '上海通庆船舶': '上海通庆船舶设备',
    '上海诚涵船舶设备': '上海诚函船舶设备',
};
function normalizeCustomerName(name) {
    if (!name) return '';
    let s = String(name).trim();
    if (s.indexOf('另星') === 0) return '个体户';
    for (const alias in CUSTOMER_ALIASES) {
        if (s.indexOf(alias) === 0 || s === alias) return CUSTOMER_ALIASES[alias];
    }
    s = s.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '');
    s = s.replace(/(有限责任公司|有限公司|股份有限公司|分公司|公司|有限责任|有限|股份|集团)$/g, '');
    return s;
}

// 粗略船型关键词 (用于 shipTypes)
const SHIP_TYPE_KEYWORDS = [
    ['渔船', '渔'], ['拖船', '拖轮', '拖'], ['游艇', '游艇'],
    ['货船', '散货', '集装箱', '货'], ['工程船', '工程'],
    ['客船', '客渡'], ['科考', '公务'], ['特种', '军'],
];
function inferShipTypes(...texts) {
    const joined = texts.filter(Boolean).join(' ');
    const hits = new Set();
    for (const [label, ...kws] of SHIP_TYPE_KEYWORDS) {
        if (kws.some(k => joined.includes(k))) hits.add(label);
    }
    return [...hits];
}

// ============================================================
// 聚合
// ============================================================

function buildEnrichment() {
    console.log('[enrich] 加载 ERP 数据源...');
    const salesInvoices = loadErpGlobal('js/sales-invoice-data.js', 'salesInvoiceData');
    const purchaseInvoices = loadErpGlobal('purchase-invoice-data.js', 'purchaseInvoiceData');
    const contracts = loadErpGlobal('contract-data.js', 'realContractData');
    const catalogPrices = loadCatalogPrices();
    console.log(`[enrich]   sales=${salesInvoices.length}, purchase=${purchaseInvoices.length}, contracts=${contracts.length}, catalog=${Object.keys(catalogPrices).length} 型号含价`);

    // baseModel → 聚合桶
    const buckets = new Map();
    function bucket(bm) {
        if (!buckets.has(bm)) {
            buckets.set(bm, {
                salesCount: 0,
                salesRevenue: 0,
                costQty: 0,
                costTotal: 0,
                lastSoldDate: null,
                customers: new Map(), // customer → revenue
                shipTypeHints: [],
                contractQty: 0,
                contractRevenue: 0,
            });
        }
        return buckets.get(bm);
    }

    // --- 1. 销售发票 ---
    let unmappedSales = 0;
    let partsContaminationSkipped = 0;
    for (const inv of salesInvoices) {
        const products = inv?.productInfo?.products;
        if (!Array.isArray(products) || products.length === 0) { unmappedSales++; continue; }
        const amount = Number(inv['金额（含税）'] || inv.amount || 0);
        const customer = (inv['单位名称'] || inv.customer || '').trim();
        const date = inv['日期'] || inv.date || '';
        const totalQty = products.reduce((s, p) => s + (Number(p.qty) || 1), 0) || 1;
        for (const p of products) {
            const bm = normalizeBaseModel(p.model || p.fullModel);
            if (!bm) continue;
            const qty = Number(p.qty) || 1;
            const share = amount * (qty / totalQty);
            const unitPrice = share / qty;

            // 价格合理性闸口: 成交单价 < 目录价 30% 时判定为零件/服务污染,跳过聚合
            const catalogPrice = catalogPrices[bm];
            if (catalogPrice && unitPrice < catalogPrice * PARTS_CONTAMINATION_THRESHOLD) {
                partsContaminationSkipped++;
                continue;
            }

            const b = bucket(bm);
            b.salesCount += qty;
            b.salesRevenue += share;
            const normCustomer = normalizeCustomerName(customer);
            if (normCustomer) {
                b.customers.set(normCustomer, (b.customers.get(normCustomer) || 0) + share);
            }
            if (date && (!b.lastSoldDate || date > b.lastSoldDate)) b.lastSoldDate = date;
            if (p.type) b.shipTypeHints.push(p.type);
        }
    }
    console.log(`[enrich] 销售聚合完成: ${buckets.size} 个型号 (未匹配 ${unmappedSales} 张发票, 零件污染剔除 ${partsContaminationSkipped} 行)`);

    // --- 2. 采购发票 (整机) ---
    let costLines = 0;
    for (const inv of purchaseInvoices) {
        for (const item of (inv.items || [])) {
            if (!item.isWhole) continue;
            const bm = normalizeBaseModel(item.spec) || normalizeBaseModel(item.name);
            if (!bm) continue;
            const qty = Number(item.qty) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            if (qty <= 0 || unitPrice <= 0) continue;
            const b = bucket(bm);
            b.costQty += qty;
            b.costTotal += qty * unitPrice;
            costLines++;
        }
    }
    console.log(`[enrich] 采购聚合完成: ${costLines} 条整机行`);

    // --- 3. 合同 (仅齿轮箱类) ---
    let contractLines = 0;
    for (const c of contracts) {
        const prodText = c.product || '';
        if (!/^齿轮箱|^离合器|^增速/.test(prodText.trim())) continue;
        const bm = normalizeBaseModel(prodText);
        if (!bm) continue;
        const qty = Number(c.quantity) || 0;
        const amount = Number(c.amount) || 0;
        if (qty <= 0) continue;
        const b = bucket(bm);
        b.contractQty += qty;
        b.contractRevenue += amount;
        const types = inferShipTypes(c.remarks, c.category);
        b.shipTypeHints.push(...types);
        contractLines++;
    }
    console.log(`[enrich] 合同聚合完成: ${contractLines} 份齿轮箱合同`);

    // --- 4. 输出 marketData 记录 ---
    const records = {};
    const salesCounts = [];
    let priceAnomalyCount = 0;
    for (const [bm, b] of buckets) {
        const hasSales = b.salesCount > 0;
        const hasCost = b.costQty > 0;
        if (!hasSales && !hasCost && b.contractQty === 0) continue;

        const avgSalePrice = hasSales ? Math.round(b.salesRevenue / b.salesCount) : null;
        const avgCostPrice = hasCost ? Math.round(b.costTotal / b.costQty) : null;
        const realMarginPct = (avgSalePrice && avgCostPrice)
            ? Math.round(((avgSalePrice - avgCostPrice) / avgSalePrice) * 1000) / 10
            : null;

        // 价格异常标记: 成交均价远高于目录(catalog 偏低或含套装/服务)
        const catalogPrice = catalogPrices[bm];
        let priceAnomaly = null;
        if (catalogPrice && avgSalePrice && avgSalePrice > catalogPrice * PRICE_ANOMALY_RATIO) {
            priceAnomaly = {
                catalogPrice,
                ratio: Math.round((avgSalePrice / catalogPrice) * 100) / 100,
                hint: '成交均价显著高于目录,可能是套装/服务打包,或目录价偏低待校正',
            };
            priceAnomalyCount++;
        }

        const topCustomers = [...b.customers.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name);

        const shipTypes = [...new Set(b.shipTypeHints)].slice(0, 5);

        records[bm] = {
            salesCount: b.salesCount,
            salesRevenue: Math.round(b.salesRevenue),
            avgSalePrice,
            avgCostPrice,
            realMarginPct,
            lastSoldDate: b.lastSoldDate,
            customerCount: b.customers.size,
            topCustomers,
            shipTypes,
            contractQty: b.contractQty || undefined,
            contractRevenue: b.contractRevenue ? Math.round(b.contractRevenue) : undefined,
            priceAnomaly: priceAnomaly || undefined,
        };
        if (hasSales) salesCounts.push(b.salesCount);
    }
    console.log(`[enrich] 价格异常标记 ${priceAnomalyCount} 个型号 (avgSale/catalog > ${PRICE_ANOMALY_RATIO}x)`);

    // 畅销阈值 = 有销量型号的 P75 分位,向上取整到 2
    salesCounts.sort((a, b) => a - b);
    const p75 = salesCounts[Math.floor(salesCounts.length * 0.75)] || 0;
    const hotSellerThreshold = Math.max(2, p75);

    const snapshot = new Date();
    const marketDataTag = `erp-${snapshot.getFullYear()}-${String(snapshot.getMonth() + 1).padStart(2, '0')}`;

    const output = {
        _meta: {
            generatedAt: snapshot.toISOString(),
            marketDataTag,
            salesInvoiceCount: salesInvoices.length,
            purchaseInvoiceCount: purchaseInvoices.length,
            contractCount: contracts.length,
            enrichedModelCount: Object.keys(records).length,
            hotSellerThreshold,
        },
        records,
    };

    return output;
}

// ============================================================
// 主逻辑 + 覆盖率报告
// ============================================================

function main() {
    console.log('=== 市场数据富化管道 (ERP → gearbox-app) ===\n');

    const output = buildEnrichment();

    fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
    const sizeKB = (Buffer.byteLength(JSON.stringify(output)) / 1024).toFixed(1);
    console.log(`\n✅ 已生成 ${OUT_PATH} (${sizeKB} KB)`);

    // 覆盖率 — 对比 embeddedData.js 的型号集
    try {
        const embeddedSrc = fs.readFileSync(path.resolve(__dirname, '../src/data/embeddedData.js'), 'utf8');
        const modelSet = new Set();
        const re = /"model"\s*:\s*"([^"]+)"/g;
        let m;
        while ((m = re.exec(embeddedSrc)) !== null) modelSet.add(m[1].toUpperCase());
        const enriched = Object.keys(output.records);
        const hit = enriched.filter(bm => modelSet.has(bm)).length;
        const coverage = ((hit / modelSet.size) * 100).toFixed(1);
        console.log(`\n[覆盖率] embeddedData ${modelSet.size} 型号,匹配到富化数据 ${hit} 个 (${coverage}%)`);
        const unmatched = enriched.filter(bm => !modelSet.has(bm));
        if (unmatched.length) {
            console.log(`[提示] ${unmatched.length} 个富化型号不在 embeddedData (多为配件/衍生型号): ${unmatched.slice(0, 15).join(', ')}${unmatched.length > 15 ? '...' : ''}`);
        }
    } catch (e) {
        console.warn('[覆盖率] 跳过 (读 embeddedData 失败):', e.message);
    }

    // TOP 5 销量
    const top = Object.entries(output.records)
        .filter(([, r]) => r.salesCount)
        .sort((a, b) => b[1].salesCount - a[1].salesCount)
        .slice(0, 5);
    console.log('\n[TOP 5 销量型号]');
    for (const [bm, r] of top) {
        console.log(`  ${bm.padEnd(10)} ${String(r.salesCount).padStart(4)}台 ¥${(r.salesRevenue / 10000).toFixed(1)}万  客户${r.customerCount}`);
    }
    console.log(`\n[畅销阈值] salesCount ≥ ${output._meta.hotSellerThreshold} (P75 分位)`);
    console.log(`[市场数据版本] ${output._meta.marketDataTag}`);
}

main();
