// src/data/documentFieldSchema.js
// 6 类文档生成器的字段映射 schema(集中定义)
// 每个文档列出:input 字段 / 数据来源 / 是否必填 / 示例 / 模板变量名(若适用)
//
// 用途:
// 1. 前端 DocumentFieldMapView 渲染字段映射可视化(给新人/销售看哪些字段必填)
// 2. 文档生成器可直接 import 此 schema 做表单验证
// 3. 未来若需要批量字段填充工具,有统一 schema 可复用

export const FIELD_SOURCES = {
  form: { label: '表单输入', icon: 'bi-input-cursor-text', color: 'primary' },
  selection: { label: '选型结果', icon: 'bi-graph-up', color: 'success' },
  components: { label: '配套件', icon: 'bi-gear-wide-connected', color: 'info' },
  pricing: { label: '价格库', icon: 'bi-currency-yen', color: 'warning' },
  project: { label: '项目信息', icon: 'bi-folder', color: 'secondary' },
  derived: { label: '派生计算', icon: 'bi-calculator', color: 'dark' },
};

export const DOCUMENT_SCHEMAS = {
  inquiry: {
    label: '技术询单',
    icon: 'bi-file-earmark-plus',
    color: 'primary',
    moduleKey: 'inquiry',
    component: 'src/components/InquiryView.js',
    description: '客户初次咨询时填写的技术需求表,售前阶段用于内部技术评估',
    sections: [
      {
        title: '客户信息',
        fields: [
          { name: 'customer', label: '客户名称', source: 'form', required: true, example: '上海远东船厂' },
          { name: 'contact', label: '联系人', source: 'form', required: true, example: '张工' },
          { name: 'phone', label: '电话', source: 'form', required: true, example: '13800138000' },
          { name: 'email', label: '邮箱', source: 'form', required: false, example: 'zhang@example.com' },
        ],
      },
      {
        title: '船舶 / 主机参数',
        fields: [
          { name: 'shipType', label: '船型', source: 'form', required: true, example: '近海拖轮' },
          { name: 'power', label: '主机功率 (kW)', source: 'form', required: true, example: '746' },
          { name: 'speed', label: '主机转速 (r/min)', source: 'form', required: true, example: '1800' },
          { name: 'ratioTarget', label: '目标速比', source: 'form', required: false, example: '4.5' },
          { name: 'thrustReq', label: '推力需求 (kN)', source: 'form', required: false, example: '120' },
          { name: 'classSociety', label: '入级船级社', source: 'form', required: false, example: 'CCS' },
        ],
      },
      {
        title: '交付与特殊需求',
        fields: [
          { name: 'specialReq', label: '特殊要求', source: 'form', required: false, example: '需配备控制冷却器' },
          { name: 'deliveryDate', label: '交付日期', source: 'form', required: false, example: '2026-08-30' },
          { name: 'deliveryPlace', label: '交付地点', source: 'form', required: false, example: '上海港' },
          { name: 'projectId', label: '项目编号', source: 'derived', required: true, example: 'INQ-20260429-001' },
          { name: 'status', label: '状态', source: 'derived', required: true, example: 'new / processing / quoted / expired / closed' },
        ],
      },
    ],
  },

  quotation: {
    label: '报价单',
    icon: 'bi-currency-yen',
    color: 'success',
    moduleKey: 'quotation',
    component: 'src/utils/quotationGenerator.js',
    description: '基于选型结果与价格库,生成客户可用的报价文件(含整箱+联轴器+备用泵+附加项)',
    sections: [
      {
        title: '客户与项目',
        fields: [
          { name: 'customerName', label: '客户名称', source: 'project', required: true, example: '舟山渔业公司' },
          { name: 'customerAddress', label: '客户地址', source: 'project', required: false, example: '舟山市定海区...' },
          { name: 'projectName', label: '项目名称', source: 'project', required: false, example: '300 吨拖网渔船' },
        ],
      },
      {
        title: '产品(齿轮箱 + 配套)',
        fields: [
          { name: 'gearbox.model', label: '齿轮箱型号', source: 'selection', required: true, example: 'GWC42.45' },
          { name: 'gearbox.power', label: '齿轮箱功率', source: 'selection', required: true, example: '1500 kW' },
          { name: 'coupling.model', label: '联轴器型号', source: 'components', required: false, example: 'HGTHT5' },
          { name: 'pump.model', label: '备用泵型号', source: 'components', required: false, example: '2CY 系列' },
        ],
      },
      {
        title: '价格',
        fields: [
          { name: 'priceInfo.packagePrice', label: '配套包价', source: 'pricing', required: true, example: '¥1,232,500' },
          { name: 'priceInfo.marketPrice', label: '市场价', source: 'pricing', required: true, example: '¥1,580,000' },
          { name: 'priceInfo.componentPrices.gearbox', label: '齿轮箱单价', source: 'pricing', required: true, example: '¥980,000' },
          { name: 'priceInfo.componentPrices.coupling', label: '联轴器单价', source: 'pricing', required: false, example: '¥168,000' },
          { name: 'priceInfo.componentPrices.pump', label: '备用泵单价', source: 'pricing', required: false, example: '¥48,000' },
        ],
      },
      {
        title: '商务选项',
        fields: [
          { name: 'options.taxRate', label: '税率 (%)', source: 'form', required: false, example: '13' },
          { name: 'options.deliveryCost', label: '运费', source: 'form', required: false, example: '¥8,000' },
          { name: 'options.discountPercentage', label: '优惠折扣 (%)', source: 'form', required: false, example: '5' },
          { name: 'options.validityDays', label: '报价有效期(天)', source: 'form', required: false, example: '30' },
          { name: 'options.paymentTerms', label: '付款条款', source: 'form', required: false, example: '30% 预付款,70% 发货前付清' },
          { name: 'options.deliveryTime', label: '交货周期', source: 'form', required: false, example: '签合同后 60 个工作日' },
        ],
      },
    ],
  },

  agreement: {
    label: '技术协议',
    icon: 'bi-file-earmark-text',
    color: 'info',
    moduleKey: 'agreement',
    component: 'src/components/AgreementGenerator/useAgreementGeneration.js',
    description: '技术冻结阶段的法律文件,模板基于 ~120 个 {{变量}} 替换,绑定齿轮箱、主机、船舶、船级社多源数据',
    sections: [
      {
        title: '齿轮箱字段(模板变量)',
        fields: [
          { name: 'gearboxModel', label: '齿轮箱型号', source: 'selection', required: true, example: 'GWC42.45', templateVar: '{{gearboxModel}}' },
          { name: 'reductionRatio', label: '减速比', source: 'selection', required: true, example: '4.5', templateVar: '{{reductionRatio}}' },
          { name: 'transferCapacity', label: '传递能力', source: 'selection', required: true, example: '0.85 kW/(r/min)', templateVar: '{{transferCapacity}}' },
          { name: 'thrust', label: '额定推力', source: 'selection', required: true, example: '180 kN', templateVar: '{{thrust}}' },
          { name: 'centerDistance', label: '中心距', source: 'selection', required: false, example: '420 mm', templateVar: '{{centerDistance}}' },
          { name: 'weight', label: '齿轮箱重量', source: 'selection', required: false, example: '1850 kg', templateVar: '{{weight}}' },
          { name: 'oilCapacity', label: '加油量', source: 'selection', required: false, example: '38 L', templateVar: '{{oilCapacity}}' },
          { name: 'oilGrade', label: '油品规格', source: 'selection', required: false, example: 'SAE 30 / API CD', templateVar: '{{oilGrade}}' },
        ],
      },
      {
        title: '主机字段',
        fields: [
          { name: 'enginePower', label: '主机功率', source: 'form', required: true, example: '1500 kW', templateVar: '{{enginePower}}' },
          { name: 'engineSpeed', label: '主机转速', source: 'form', required: true, example: '1800 r/min', templateVar: '{{engineSpeed}}' },
          { name: 'engineModel', label: '主机型号', source: 'form', required: false, example: '康明斯 KTA38-M2', templateVar: '{{engineModel}}' },
          { name: 'engineRotation', label: '主机旋向', source: 'form', required: false, example: '逆时针', templateVar: '{{engineRotation}}' },
          { name: 'minStableSpeed', label: '最低稳定转速', source: 'form', required: false, example: '500 r/min', templateVar: '{{minStableSpeed}}' },
        ],
      },
      {
        title: '船舶 / 项目字段',
        fields: [
          { name: 'shipName', label: '船名', source: 'project', required: false, example: '舟渔 308', templateVar: '{{shipName}}' },
          { name: 'shipType', label: '船型', source: 'project', required: true, example: '拖网渔船', templateVar: '{{shipType}}' },
          { name: 'shipyard', label: '建造船厂', source: 'project', required: false, example: '舟山金海湾', templateVar: '{{shipyard}}' },
          { name: 'designer', label: '设计单位', source: 'project', required: false, example: '某船舶设计院', templateVar: '{{designInstitute}}' },
          { name: 'classification', label: '入级船级社', source: 'project', required: true, example: 'CCS / DNV / ABS', templateVar: '{{classificationName}}' },
          { name: 'quantity', label: '设备数量', source: 'project', required: true, example: '2 台', templateVar: '{{equipmentQty}}' },
        ],
      },
      {
        title: '协议元数据',
        fields: [
          { name: 'agreementNumber', label: '协议编号', source: 'form', required: true, example: 'TA-20260429-001', templateVar: '{{agreementNumber}}' },
          { name: 'projectNumber', label: '项目编号', source: 'project', required: false, example: 'PRJ-2026-018', templateVar: '{{projectNumber}}' },
        ],
      },
    ],
  },

  contract: {
    label: '销售合同',
    icon: 'bi-file-earmark-ruled',
    color: 'warning',
    moduleKey: 'contract',
    component: 'src/utils/contractGenerator.js',
    description: '商务签订阶段的正式合同,自动生成合同号 + 买卖双方信息 + 产品清单 + 总金额',
    sections: [
      {
        title: '合同元数据',
        fields: [
          { name: 'contractNumber', label: '合同编号', source: 'derived', required: true, example: 'GB-2026-0429-001' },
          { name: 'contractDate', label: '签订日期', source: 'derived', required: true, example: '2026-04-29' },
        ],
      },
      {
        title: '买卖双方',
        fields: [
          { name: 'buyerInfo.customerName', label: '买方公司名', source: 'project', required: true, example: '舟山渔业公司' },
          { name: 'buyerInfo.customerAddress', label: '买方地址', source: 'project', required: true, example: '舟山市定海区...' },
          { name: 'sellerInfo.companyName', label: '卖方公司名', source: 'derived', required: true, example: '杭州前进齿轮箱集团股份有限公司' },
        ],
      },
      {
        title: '产品清单',
        fields: [
          { name: 'products[].model', label: '齿轮箱型号', source: 'selection', required: true, example: 'GWC42.45' },
          { name: 'products[].marketPrice', label: '市场价', source: 'pricing', required: true, example: '¥1,580,000' },
          { name: 'products[].factoryPrice', label: '出厂价', source: 'pricing', required: true, example: '¥980,000' },
          { name: 'totalMarketPrice', label: '合同总额', source: 'derived', required: true, example: '¥3,160,000(2 台)' },
        ],
      },
    ],
  },

  'offline-package': {
    label: '资料打包',
    icon: 'bi-file-zip',
    color: 'secondary',
    moduleKey: 'offline-package',
    component: 'src/utils/projectPackager.js',
    description: '项目交付时一键打包询单/报价/协议/合同 4 类文档为 ZIP,含 manifest.txt 与 project.json',
    sections: [
      {
        title: '项目元数据',
        fields: [
          { name: 'projectId', label: '项目 ID', source: 'project', required: true, example: 'PRJ-2026-018' },
          { name: 'projectName', label: '项目名称', source: 'project', required: true, example: '300 吨拖网渔船配套' },
          { name: 'customerName', label: '客户名称', source: 'project', required: true, example: '舟山渔业公司' },
        ],
      },
      {
        title: 'ZIP 包含的文档类型',
        fields: [
          { name: 'inquiry[]', label: '技术询单', source: 'project', required: false, example: '查 inquiryStore' },
          { name: 'quotation[]', label: '报价单', source: 'project', required: false, example: '查 QuoteDB / gearbox_quotations' },
          { name: 'agreement[]', label: '技术协议', source: 'project', required: false, example: '查 generated_agreements' },
          { name: 'contract[]', label: '销售合同', source: 'project', required: false, example: '查 generated_contracts' },
        ],
      },
      {
        title: 'ZIP 结构',
        fields: [
          { name: 'manifest.txt', label: '清单文件', source: 'derived', required: true, example: '列出所有打包文档与生成时间' },
          { name: 'project.json', label: '项目元数据 JSON', source: 'derived', required: true, example: '机器可读的完整项目快照' },
        ],
      },
    ],
  },

  'torsional-report': {
    label: '扭振计算书',
    icon: 'bi-file-earmark-pdf',
    color: 'danger',
    moduleKey: 'torsional-report',
    component: 'src/utils/torsionalReportGenerator.js',
    description: '面向 CCS / DNV / ABS / LR 入级送审的硬性文件,8 页 COMPASS 格式,含自由振动 + 强迫振动 + 应力曲线',
    sections: [
      {
        title: '项目信息',
        fields: [
          { name: 'projectName', label: '项目名称', source: 'project', required: true, example: '舟渔 308 配套扭振' },
          { name: 'controlNumber', label: '控制编号', source: 'project', required: true, example: 'TVC-2026-029' },
          { name: 'shipName', label: '船名', source: 'project', required: false, example: '舟渔 308' },
          { name: 'designOrg', label: '设计单位', source: 'project', required: false, example: '某船舶设计院' },
          { name: 'manufacturer', label: '制造单位', source: 'derived', required: true, example: '杭州前进齿轮箱集团' },
          { name: 'calculator', label: '计算人', source: 'form', required: true, example: '王工程师' },
        ],
      },
      {
        title: '系统输入',
        fields: [
          { name: 'systemInput.powerSource', label: '动力源', source: 'form', required: true, example: '康明斯 KTA38-M2 / 1500 kW / 1800 rpm' },
          { name: 'systemInput.propeller', label: '螺旋桨', source: 'form', required: true, example: 'D = 1.6m, 4 叶' },
          { name: 'systemInput.units[]', label: '系统单元', source: 'derived', required: true, example: '主机 → 联轴器 → 齿轮箱 → 中间轴 → 螺旋桨' },
          { name: 'systemInput.systemLayout', label: '系统拓扑', source: 'derived', required: true, example: '单线 5 节点 / 单线 7 节点' },
        ],
      },
      {
        title: '振动结果',
        fields: [
          { name: 'freeVibration.naturalFrequencies[]', label: '固有频率', source: 'derived', required: true, example: '一阶 18.4 Hz / 二阶 52.7 Hz / ...' },
          { name: 'forcedVibration.combinedResults[]', label: '强迫振动应力', source: 'derived', required: true, example: '各阶共振应力曲线' },
          { name: 'forcedVibration.allowableStress', label: '许用应力', source: 'derived', required: true, example: 'σ_continuous = 50 MPa' },
          { name: 'forcedVibration.verification', label: '校核结论', source: 'derived', required: true, example: '通过 / 不通过(连续 / 瞬态)' },
        ],
      },
      {
        title: '依据规范',
        fields: [
          { name: 'standardCode', label: '执行规范', source: 'form', required: true, example: 'CCS / DNV / ABS / LR' },
          { name: 'iso4867', label: 'ISO 4867', source: 'derived', required: false, example: '国际机械振动测量与评估' },
          { name: 'gbT7094', label: 'GB/T 7094', source: 'derived', required: false, example: '国标船用柴油机轴系扭振计算' },
        ],
      },
    ],
  },
};

export default DOCUMENT_SCHEMAS;
