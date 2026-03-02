// src/components/EnhancedSelectionForm/useEnhancedSelectionForm.js
// 增强选型表单状态管理Hook

import { useState, useCallback, useEffect } from 'react';
import { generateDocNumber } from '../../utils/documentNumbering';
import { inquiryStore } from '../../services/documentStorage';

// 本地存储key
const STORAGE_KEY = 'enhanced_selection_form_draft';

// 范围限制
const FIELD_RANGES = {
  enginePower: { min: 1, max: 10000, unit: 'kW', label: '主机功率' },
  engineSpeed: { min: 100, max: 5000, unit: 'rpm', label: '主机转速' },
  ratio: { min: 0.5, max: 10, unit: '', label: '速比' },
};

// 默认表单数据
const getDefaultFormData = () => ({
  // === 客户信息 (选填) ===
  customerName: "",           // 船东/需方名称
  contactPerson: "",          // 联系人
  contactPhone: "",           // 联系电话
  contactEmail: "",           // 电子邮箱

  // === 项目信息 (选填) ===
  projectName: "",            // 项目名称/船名
  projectNumber: "",          // 项目编号
  shipyard: "",               // 建造船厂
  shipType: "渔船",           // 船舶类型

  // === 主机信息 ===
  engineBrand: "潍柴",        // 主机品牌
  engineModel: "",            // 主机型号
  flywheelSpec: "",           // 飞轮型号
  engineRotation: "无要求",   // 主机转向(面向飞轮)
  interfaceType: "无要求",    // 接口类型 (sae/domestic/无要求)
  interfaceSpec: "",          // 接口规格

  // === 基本参数 ===
  arrangement: { axisAlignment: 'any', offsetDirection: 'any' },  // 轴布置方式
  enginePower: "",            // 主机功率 (kW)
  engineSpeed: "",            // 主机转速 (rpm)
  ratio: "",                  // 速比

  // === 船检要求 ===
  classification: {
    type: "国内",             // 国内/国外
    society: "CCS",           // 船检机构
    certificates: []          // 所需证书
  },

  // === PTO/PTH配置 ===
  pto: {
    enabled: false,
    power: "",                // PTO功率 (kW)
    speed: "",                // PTO转速 (rpm)
    purpose: "",              // 用途
    application: "other",     // PTO应用类型
    temperature: 30           // 工作温度
  },
  pthRatio: "",               // PTH速比

  // === 技术要求 ===
  thrust: "无要求",           // 推力
  monitoringSystem: "无要求", // 监控系统
  controlMethod: "无要求",    // 操控方式
  inputRotation: "无要求",    // 输入转向(面向飞轮)

  // === 质量要求 ===
  materialRequirements: "无要求",
  processRequirements: "无要求",
  specialQualityControl: "无要求",
  purchasedPartsRequirements: "无要求",
  inspectionRequirements: "无要求",

  // === 参考信息 ===
  similarModel: "",           // 相似方案/产品型号
  specialConditions: "",      // 特殊工况说明

  // === 输出需求 ===
  outputRequirements: [],     // 输出要求 (多选)
  deadline: "",               // 输出要求时间
  attachments: []             // 相关附件
});

// 下拉选项配置
export const FORM_OPTIONS = {
  // 船舶类型选项
  shipType: [
    { value: "渔船", label: "渔船" },
    { value: "货船", label: "货船" },
    { value: "油轮", label: "油轮" },
    { value: "集装箱船", label: "集装箱船" },
    { value: "工程船", label: "工程船" },
    { value: "拖轮", label: "拖轮" },
    { value: "客船", label: "客船" },
    { value: "游艇", label: "游艇" },
    { value: "公务船", label: "公务船" },
    { value: "其他", label: "其他" }
  ],

  // 主机品牌选项
  engineBrand: [
    { value: "潍柴", label: "潍柴" },
    { value: "康明斯", label: "康明斯" },
    { value: "道依茨", label: "道依茨" },
    { value: "沃尔沃", label: "沃尔沃" },
    { value: "曼恩", label: "曼恩 (MAN)" },
    { value: "卡特彼勒", label: "卡特彼勒" },
    { value: "MTU", label: "MTU" },
    { value: "洋马", label: "洋马 (YANMAR)" },
    { value: "玉柴", label: "玉柴" },
    { value: "其他", label: "其他" }
  ],

  // 主机转向选项
  engineRotation: [
    { value: "无要求", label: "无要求" },
    { value: "顺时针", label: "顺时针 (CW)" },
    { value: "逆时针", label: "逆时针 (CCW)" }
  ],

  // 船检机构选项
  classificationSociety: {
    domestic: [
      { value: "CCS", label: "中国船级社 (CCS)" },
      { value: "ZY", label: "中国渔业船舶检验局 (ZY)" }
    ],
    foreign: [
      { value: "LR", label: "英国劳氏 (LR)" },
      { value: "DNV", label: "挪威船级社 (DNV)" },
      { value: "BV", label: "法国船级社 (BV)" },
      { value: "ABS", label: "美国船级社 (ABS)" },
      { value: "NK", label: "日本船级社 (NK)" },
      { value: "KR", label: "韩国船级社 (KR)" }
    ]
  },

  // 证书类型选项
  certificates: [
    { value: "船用产品证书", label: "船用产品证书" },
    { value: "型式认可证书", label: "型式认可证书" },
    { value: "工厂认可证书", label: "工厂认可证书" },
    { value: "产品检验证书", label: "产品检验证书" }
  ],

  // 轴布置方式选项 (结构化选择，见ShaftArrangementSelector组件)
  arrangement: [
    { value: "any", label: "自动选择" },
    { value: "concentric", label: "同心布置 (GWC)" },
    { value: "horizontal-offset", label: "水平偏置 (GWS/GWH)" },
    { value: "vertical-down", label: "垂直向下 (GWD)" },
    { value: "k-shape", label: "K型布置 (GWK)" },
    { value: "l-shape", label: "L型/直角 (GWL)" }
  ],

  // 监控系统选项
  monitoringSystem: [
    { value: "无要求", label: "无要求" },
    { value: "标准", label: "标准监控" },
    { value: "高级", label: "高级监控" },
    { value: "定制", label: "定制方案" }
  ],

  // 操控方式选项
  controlMethod: [
    { value: "无要求", label: "无要求" },
    { value: "手动", label: "手动" },
    { value: "气动", label: "气动" },
    { value: "液压", label: "液压" },
    { value: "电动", label: "电动" }
  ],

  // 输入转向选项
  inputRotation: [
    { value: "无要求", label: "无要求" },
    { value: "顺时针", label: "顺时针" },
    { value: "逆时针", label: "逆时针" }
  ],

  // 输出要求选项
  outputRequirements: [
    { value: "外形图", label: "外形图" },
    { value: "技术协议", label: "技术协议" },
    { value: "报价单", label: "报价单" },
    { value: "产品手册", label: "产品手册" }
  ],

  // 主机接口类型选项
  interfaceType: [
    { value: "无要求", label: "无要求 (不筛选)" },
    { value: "sae", label: "SAE国际标准" },
    { value: "domestic", label: "国内机标准" }
  ],

  // SAE接口规格选项
  saeInterfaces: [
    { value: "SAE10寸", label: "SAE 10寸 (254mm)" },
    { value: "SAE11.5寸", label: "SAE 11.5寸 (292mm)" },
    { value: "SAE14寸", label: "SAE 14寸 (356mm)" },
    { value: "SAE16寸", label: "SAE 16寸 (406mm)" },
    { value: "SAE18寸", label: "SAE 18寸 (457mm)" },
    { value: "SAE21寸", label: "SAE 21寸 (533mm)" },
    { value: "SAE24寸", label: "SAE 24寸 (610mm)" },
    { value: "SAE30寸", label: "SAE 30寸 (762mm)" },
    { value: "SAE36寸", label: "SAE 36寸 (914mm)" }
  ],

  // 国内机接口规格选项
  domesticInterfaces: [
    { value: "φ290", label: "φ290" },
    { value: "φ350", label: "φ350" },
    { value: "φ405", label: "φ405" },
    { value: "φ450", label: "φ450" },
    { value: "φ480", label: "φ480" },
    { value: "φ505", label: "φ505" },
    { value: "φ518", label: "φ518" },
    { value: "φ530", label: "φ530" },
    { value: "φ540", label: "φ540" },
    { value: "φ570", label: "φ570" },
    { value: "φ608", label: "φ608" },
    { value: "φ640", label: "φ640" },
    { value: "φ700", label: "φ700" },
    { value: "φ720", label: "φ720" },
    { value: "φ770", label: "φ770" },
    { value: "φ800", label: "φ800" },
    { value: "φ820", label: "φ820" },
    { value: "φ908", label: "φ908" },
    { value: "φ950", label: "φ950" },
    { value: "φ1025", label: "φ1025" },
    { value: "φ1110", label: "φ1110" }
  ]
};

/**
 * 增强选型表单Hook
 * 管理表单状态、本地存储、验证等功能
 */
export const useEnhancedSelectionForm = () => {
  // 表单数据状态
  const [formData, setFormData] = useState(getDefaultFormData);

  // 表单状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // 从本地存储恢复草稿
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...getDefaultFormData(), ...parsed }));
      }
    } catch (err) {
      console.warn('恢复表单草稿失败:', err);
    }
  }, []);

  // 保存草稿到本地存储
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
      console.warn('保存表单草稿失败:', err);
    }
  }, [formData]);

  // 自动保存草稿 (防抖)
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [formData, isDirty, saveDraft]);

  // 更新单个字段
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // 清除该字段的错误
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // 更新PTO配置
  const updatePTO = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      pto: { ...prev.pto, [field]: value }
    }));
    setIsDirty(true);
  }, []);

  // 更新船检配置
  const updateClassification = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      classification: { ...prev.classification, [field]: value }
    }));
    setIsDirty(true);
  }, []);

  // 切换输出要求选项
  const toggleOutputRequirement = useCallback((option) => {
    setFormData(prev => {
      const current = prev.outputRequirements || [];
      const isSelected = current.includes(option);
      return {
        ...prev,
        outputRequirements: isSelected
          ? current.filter(o => o !== option)
          : [...current, option]
      };
    });
    setIsDirty(true);
  }, []);

  // 添加附件
  const addAttachment = useCallback((file) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), file]
    }));
    setIsDirty(true);
  }, []);

  // 移除附件
  const removeAttachment = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  }, []);

  // 验证单个字段（实时校验用）
  const validateField = useCallback((field, value) => {
    const range = FIELD_RANGES[field];
    if (range && value !== '' && value != null) {
      const num = parseFloat(value);
      if (isNaN(num)) return `${range.label}必须是数字`;
      if (num < range.min) return `${range.label}不能小于 ${range.min}${range.unit}`;
      if (num > range.max) return `${range.label}不能大于 ${range.max}${range.unit}`;
    }
    return null;
  }, []);

  // 验证表单
  const validateForm = useCallback(() => {
    const newErrors = {};

    // 必填字段验证 + 范围校验
    if (!formData.enginePower) {
      newErrors.enginePower = '请输入主机功率';
    } else {
      const err = validateField('enginePower', formData.enginePower);
      if (err) newErrors.enginePower = err;
    }

    if (!formData.engineSpeed) {
      newErrors.engineSpeed = '请输入主机转速';
    } else {
      const err = validateField('engineSpeed', formData.engineSpeed);
      if (err) newErrors.engineSpeed = err;
    }

    if (!formData.ratio) {
      newErrors.ratio = '请输入速比';
    } else {
      const err = validateField('ratio', formData.ratio);
      if (err) newErrors.ratio = err;
    }

    // 客户信息格式验证 (选填，但填写时验证格式)
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = '邮箱格式不正确';
    }
    if (formData.contactPhone && !/^(1\d{10}|0\d{2,3}-?\d{7,8})$/.test(formData.contactPhone)) {
      newErrors.contactPhone = '电话号码格式不正确（手机或座机）';
    }

    // PTO启用时的验证
    if (formData.pto.enabled) {
      if (!formData.pto.power) {
        newErrors.ptoPower = '请输入PTO功率';
      }
      if (!formData.pto.speed) {
        newErrors.ptoSpeed = '请输入PTO转速';
      }
    }

    // 输出要求验证
    if (!formData.outputRequirements || formData.outputRequirements.length === 0) {
      newErrors.outputRequirements = '请选择至少一项输出要求';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(getDefaultFormData());
    setErrors({});
    setIsDirty(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 获取表单摘要 (用于预览/导出)
  const getFormSummary = useCallback(() => {
    const summary = [];

    // 客户与项目信息
    const hasCustomerInfo = formData.customerName || formData.projectName || formData.shipyard;
    if (hasCustomerInfo) {
      summary.push({ group: '客户与项目信息', items: [
        { label: '船东/需方', value: formData.customerName || '-' },
        { label: '联系人', value: formData.contactPerson || '-' },
        { label: '联系电话', value: formData.contactPhone || '-' },
        { label: '项目名称/船名', value: formData.projectName || '-' },
        { label: '项目编号', value: formData.projectNumber || '-' },
        { label: '建造船厂', value: formData.shipyard || '-' },
        { label: '船舶类型', value: formData.shipType || '-' }
      ]});
    }

    // 主机信息
    summary.push({ group: '主机信息', items: [
      { label: '主机品牌', value: formData.engineBrand || '-' },
      { label: '主机型号', value: formData.engineModel || '-' },
      { label: '飞轮型号', value: formData.flywheelSpec || '-' },
      { label: '主机转向', value: formData.engineRotation || '-' }
    ]});

    // 基本参数
    const arrangementLabel = (() => {
      const arr = formData.arrangement;
      if (!arr || typeof arr === 'string') return arr || '自动选择';
      if (arr.axisAlignment === 'any') return '自动选择';
      if (arr.axisAlignment === 'concentric') return '同心布置';
      if (arr.axisAlignment === 'eccentric') {
        const dirLabels = { 'any': '不限方向', 'horizontal-offset': '水平偏置', 'vertical-down': '垂直向下', 'k-shape': 'K型', 'l-shape': 'L型' };
        return `异心布置 - ${dirLabels[arr.offsetDirection] || '不限方向'}`;
      }
      return '自动选择';
    })();
    summary.push({ group: '基本参数', items: [
      { label: '轴布置方式', value: arrangementLabel },
      { label: '主机功率', value: formData.enginePower ? `${formData.enginePower} kW` : '-' },
      { label: '主机转速', value: formData.engineSpeed ? `${formData.engineSpeed} rpm` : '-' },
      { label: '速比', value: formData.ratio || '-' }
    ]});

    // 船检要求
    const classification = formData.classification || {};
    summary.push({ group: '船检要求', items: [
      { label: '船检类型', value: classification.type || '国内' },
      { label: '船检机构', value: classification.society || 'CCS' },
      { label: '所需证书', value: classification.certificates?.join(', ') || '-' }
    ]});

    // PTO配置
    if (formData.pto.enabled) {
      summary.push({ group: 'PTO配置', items: [
        { label: 'PTO功率', value: formData.pto.power ? `${formData.pto.power} kW` : '-' },
        { label: 'PTO转速', value: formData.pto.speed ? `${formData.pto.speed} rpm` : '-' },
        { label: 'PTO用途', value: formData.pto.purpose || '-' },
        { label: 'PTH速比', value: formData.pthRatio || '-' }
      ]});
    }

    // 技术要求
    summary.push({ group: '技术要求', items: [
      { label: '推力', value: formData.thrust },
      { label: '监控系统', value: formData.monitoringSystem },
      { label: '操控方式', value: formData.controlMethod },
      { label: '输入转向', value: formData.inputRotation }
    ]});

    // 质量要求
    summary.push({ group: '质量要求', items: [
      { label: '材料要求', value: formData.materialRequirements },
      { label: '工艺要求', value: formData.processRequirements },
      { label: '特殊质量控制', value: formData.specialQualityControl },
      { label: '外购件要求', value: formData.purchasedPartsRequirements },
      { label: '检验要求', value: formData.inspectionRequirements }
    ]});

    // 参考信息
    summary.push({ group: '参考信息', items: [
      { label: '相似方案/产品型号', value: formData.similarModel || '-' },
      { label: '特殊工况说明', value: formData.specialConditions || '-' }
    ]});

    // 输出需求
    summary.push({ group: '输出需求', items: [
      { label: '输出要求', value: formData.outputRequirements?.join(', ') || '-' },
      { label: '交付日期', value: formData.deadline || '-' },
      { label: '附件数量', value: `${formData.attachments?.length || 0} 个` }
    ]});

    return summary;
  }, [formData]);

  // 全选/取消全选输出需求
  const selectAllOutputRequirements = useCallback((allOptions) => {
    const current = formData.outputRequirements || [];
    const allSelected = allOptions.every(opt => current.includes(opt));
    setFormData(prev => ({
      ...prev,
      outputRequirements: allSelected ? [] : [...allOptions],
    }));
    setIsDirty(true);
  }, [formData.outputRequirements]);

  // 保存询单到历史记录
  const saveToHistory = useCallback((docNumber) => {
    const inquiry = {
      id: docNumber || generateDocNumber('inquiry'),
      formData: { ...formData },
      summary: getFormSummary(),
      status: 'submitted',
      projectName: formData.projectName || formData.customerName || '未命名',
      engineInfo: `${formData.enginePower || '?'}kW / ${formData.engineSpeed || '?'}rpm`,
    };
    inquiryStore.save(inquiry);
    return inquiry.id;
  }, [formData, getFormSummary]);

  // 从历史记录加载
  const loadFromHistory = useCallback((id) => {
    const inquiry = inquiryStore.getById(id);
    if (inquiry?.formData) {
      setFormData(prev => ({ ...getDefaultFormData(), ...inquiry.formData }));
      setIsDirty(false);
      return true;
    }
    return false;
  }, []);

  // 获取询单历史列表
  const getHistory = useCallback((limit = 20) => {
    return inquiryStore.getRecent(limit);
  }, []);

  // 实时字段校验（用于onChange）
  const getFieldError = useCallback((field, value) => {
    return validateField(field, value);
  }, [validateField]);

  return {
    // 状态
    formData,
    errors,
    isSubmitting,
    isDirty,

    // 操作
    updateField,
    updatePTO,
    updateClassification,
    toggleOutputRequirement,
    selectAllOutputRequirements,
    addAttachment,
    removeAttachment,
    validateForm,
    validateField: getFieldError,
    resetForm,
    saveDraft,
    getFormSummary,
    setIsSubmitting,

    // 历史记录
    saveToHistory,
    loadFromHistory,
    getHistory,
  };
};

export default useEnhancedSelectionForm;
