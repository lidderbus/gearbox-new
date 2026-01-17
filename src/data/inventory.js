// src/data/inventory.js
// 库存管理数据结构 - 解决审计发现的存货管理问题

/**
 * 库存分类枚举
 * OWNED: 自有库存
 * CONSIGNED: 代理商代管库存
 */
export const InventoryOwnership = {
  OWNED: 'OWNED',
  CONSIGNED: 'CONSIGNED'
};

/**
 * 单据类型枚举
 */
export const DocumentType = {
  STOCK_IN: 'IN',    // 入库单
  STOCK_OUT: 'OUT'   // 出库单
};

/**
 * 库存项目数据结构
 */
export const createInventoryItem = ({
  id = null,
  sku = '',           // 物料编码
  name = '',          // 产品名称
  model = '',         // 型号规格
  category = '',      // 分类: 'gearbox' | 'accessory'
  ownership = InventoryOwnership.OWNED,  // 所有权
  location = '',      // 存放位置 (货架编码)
  quantity = 0,       // 数量
  unitPrice = 0,      // 单价
  unit = '件',        // 单位
  minStock = 0,       // 最低库存预警
  lastUpdated = null,
  remark = ''
}) => ({
  id: id || `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  sku,
  name,
  model,
  category,
  ownership,
  location,
  quantity,
  unitPrice,
  unit,
  minStock,
  lastUpdated: lastUpdated || new Date().toISOString(),
  remark
});

/**
 * 出入库单据数据结构
 */
export const createStockDocument = ({
  id = null,
  type = DocumentType.STOCK_IN,  // 单据类型
  documentNo = '',    // 单据编号 (自动生成)
  inventoryId = '',   // 关联库存项ID
  sku = '',           // 物料编码
  productName = '',   // 产品名称
  quantity = 0,       // 数量 (正数)
  operator = '',      // 操作人
  reason = '',        // 出入库原因
  relatedOrder = '',  // 关联订单号
  createdAt = null,
  remark = ''
}) => ({
  id: id || `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  documentNo: documentNo || generateDocumentNo(type),
  inventoryId,
  sku,
  productName,
  quantity,
  operator,
  reason,
  relatedOrder,
  createdAt: createdAt || new Date().toISOString(),
  remark
});

/**
 * 生成单据编号
 * 格式: IN/OUT-YYYYMMDD-XXX
 */
export const generateDocumentNo = (type, sequence = null) => {
  const prefix = type === DocumentType.STOCK_IN ? 'IN' : 'OUT';
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = sequence || String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${prefix}-${dateStr}-${seq}`;
};

/**
 * 负数库存检查
 * @returns {boolean} true = 允许操作, false = 拒绝(会导致负数)
 */
export const checkNegativeStock = (currentQuantity, outQuantity) => {
  return currentQuantity >= outQuantity;
};

/**
 * 初始库存数据 (根据审计报告 2025-10-31)
 * 库存余额: 1,476,951.10元
 */
export const initialInventory = [
  // 船用齿轮箱 (整机) - 审计报告显示 100% 抽盘
  createInventoryItem({
    sku: 'GB-HCM400A-001',
    name: '船用齿轮箱',
    model: 'HCM400A',
    category: 'gearbox',
    ownership: InventoryOwnership.OWNED,
    location: 'A-01-01',
    quantity: 2,
    unitPrice: 45000,
    unit: '台',
    minStock: 1
  }),
  createInventoryItem({
    sku: 'GB-HC138-001',
    name: '船用齿轮箱',
    model: 'HC138',
    category: 'gearbox',
    ownership: InventoryOwnership.OWNED,
    location: 'A-01-02',
    quantity: 3,
    unitPrice: 28000,
    unit: '台',
    minStock: 1
  }),

  // 齿轮箱配件 - 审计发现部分负数库存问题
  createInventoryItem({
    sku: 'ACC-OIL-SEAL-001',
    name: '德式封骨架油封',
    model: 'FKM100*120*12/F',
    category: 'accessory',
    ownership: InventoryOwnership.OWNED,
    location: 'B-02-01',
    quantity: 0,  // 审计发现: 原-130件，需核实
    unitPrice: 35,
    unit: '件',
    minStock: 50,
    remark: '审计发现负数库存，待核实'
  }),
  createInventoryItem({
    sku: 'ACC-COUPLING-001',
    name: '中间联轴节',
    model: 'D300-03A-006X1',
    category: 'accessory',
    ownership: InventoryOwnership.OWNED,
    location: 'B-02-02',
    quantity: 0,  // 审计发现: 原-1件，需核实
    unitPrice: 1200,
    unit: '件',
    minStock: 2,
    remark: '审计发现负数库存，待核实'
  }),

  // 代理商代管库存 (需分开管理)
  createInventoryItem({
    sku: 'ACC-BEARING-001',
    name: '主轴承',
    model: 'SKF-6210-2RS',
    category: 'accessory',
    ownership: InventoryOwnership.CONSIGNED,
    location: 'C-01-01',  // C区为代理商专区
    quantity: 20,
    unitPrice: 450,
    unit: '件',
    minStock: 5,
    remark: '代理商代管库存'
  })
];

/**
 * 出入库记录 (初始为空)
 */
export const initialStockDocuments = [];

/**
 * 库存统计
 */
export const calculateInventoryStats = (inventory) => {
  const stats = {
    totalItems: inventory.length,
    totalValue: 0,
    ownedValue: 0,
    consignedValue: 0,
    negativeStockCount: 0,
    lowStockCount: 0,
    gearboxCount: 0,
    accessoryCount: 0
  };

  inventory.forEach(item => {
    const value = item.quantity * item.unitPrice;
    stats.totalValue += value;

    if (item.ownership === InventoryOwnership.OWNED) {
      stats.ownedValue += value;
    } else {
      stats.consignedValue += value;
    }

    if (item.quantity < 0) {
      stats.negativeStockCount++;
    }

    if (item.quantity > 0 && item.quantity <= item.minStock) {
      stats.lowStockCount++;
    }

    if (item.category === 'gearbox') {
      stats.gearboxCount++;
    } else {
      stats.accessoryCount++;
    }
  });

  return stats;
};

/**
 * 验证出库操作
 * @returns {{ valid: boolean, message: string }}
 */
export const validateStockOut = (inventory, itemId, quantity) => {
  const item = inventory.find(i => i.id === itemId);

  if (!item) {
    return { valid: false, message: '库存项目不存在' };
  }

  if (quantity <= 0) {
    return { valid: false, message: '出库数量必须大于0' };
  }

  if (item.quantity < quantity) {
    return {
      valid: false,
      message: `库存不足! 当前库存: ${item.quantity}, 请求出库: ${quantity}`
    };
  }

  return { valid: true, message: '验证通过' };
};

const inventoryModule = {
  InventoryOwnership,
  DocumentType,
  createInventoryItem,
  createStockDocument,
  generateDocumentNo,
  checkNegativeStock,
  initialInventory,
  initialStockDocuments,
  calculateInventoryStats,
  validateStockOut
};

export default inventoryModule;
