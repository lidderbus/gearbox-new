/**
 * 多货币与国际贸易报价系统
 * 提供多货币支持、汇率转换、国际贸易条款和分期付款计划功能
 */

import React, { useState, useMemo } from 'react';
import { Table, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';

// 常量和配置
const CURRENCY_DATA = {
  CNY: { symbol: '¥', name: '人民币', format: 'zh-CN', rounding: 2 },
  USD: { symbol: '$', name: '美元', format: 'en-US', rounding: 2 },
  EUR: { symbol: '€', name: '欧元', format: 'de-DE', rounding: 2 },
  JPY: { symbol: '¥', name: '日元', format: 'ja-JP', rounding: 0 },
  GBP: { symbol: '£', name: '英镑', format: 'en-GB', rounding: 2 }
};

const INCOTERM_DATA = {
  EXW: { name: '工厂交货', includesTrans: false, includesInsurance: false, includesExport: false, includesImport: false },
  FCA: { name: '货交承运人', includesTrans: false, includesInsurance: false, includesExport: true, includesImport: false },
  CPT: { name: '运费付至', includesTrans: true, includesInsurance: false, includesExport: true, includesImport: false },
  CIP: { name: '运费和保险费付至', includesTrans: true, includesInsurance: true, includesExport: true, includesImport: false },
  DAP: { name: '目的地交货', includesTrans: true, includesInsurance: false, includesExport: true, includesImport: false },
  DDP: { name: '完税后交货', includesTrans: true, includesInsurance: false, includesExport: true, includesImport: true },
  FOB: { name: '船上交货', includesTrans: false, includesInsurance: false, includesExport: true, includesImport: false },
  CFR: { name: '成本加运费', includesTrans: true, includesInsurance: false, includesExport: true, includesImport: false },
  CIF: { name: '成本、保险费加运费', includesTrans: true, includesInsurance: true, includesExport: true, includesImport: false }
};

const PAYMENT_TERMS = [
  { value: 'advance', label: '预付款 (100%)' },
  { value: 'net30', label: '30天账期' },
  { value: 'net60', label: '60天账期' },
  { value: 'LC', label: '信用证' },
  { value: 'milestone', label: '里程碑付款' },
  { value: 'installment', label: '分期付款' }
];

/**
 * 货币格式化函数
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @returns {string} - 格式化后的金额字符串
 */
export function formatCurrency(amount, currency = 'CNY') {
  if (amount === undefined || amount === null) return '';
  
  const currencyInfo = CURRENCY_DATA[currency] || CURRENCY_DATA.CNY;
  
  try {
    return new Intl.NumberFormat(currencyInfo.format, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyInfo.rounding,
      maximumFractionDigits: currencyInfo.rounding
    }).format(amount);
  } catch (error) {
    console.warn('货币格式化失败，使用简单格式:', error);
    return `${currencyInfo.symbol}${amount.toFixed(currencyInfo.rounding)}`;
  }
}

/**
 * 货币转换函数
 * @param {number} amount - 金额
 * @param {string} fromCurrency - 源货币
 * @param {string} toCurrency - 目标货币
 * @param {Object} exchangeRates - 汇率数据
 * @returns {number} - 转换后的金额
 */
export function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
  if (!amount || !fromCurrency || !toCurrency || !exchangeRates || !exchangeRates.rates) {
    return amount;
  }
  
  // 如果货币相同，无需转换
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const rates = exchangeRates.rates;
  
  // 检查汇率是否存在
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    console.warn(`无法转换货币: ${fromCurrency} → ${toCurrency}`);
    return amount;
  }
  
  // 转换到目标货币
  // 注意：这里假设所有汇率都是基于USD
  const usdAmount = amount / rates[fromCurrency];
  const convertedAmount = usdAmount * rates[toCurrency];
  
  // 根据目标货币配置进行取整
  const rounding = CURRENCY_DATA[toCurrency]?.rounding || 2;
  return parseFloat(convertedAmount.toFixed(rounding));
}

/**
 * 获取汇率数据
 * @returns {Promise<Object>} - 汇率数据
 */
export async function fetchExchangeRates() {
  try {
    // 在实际应用中使用外部API
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    // const data = await response.json();
    // return data;
    
    // 模拟汇率数据
    return {
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      rates: {
        USD: 1.0,
        CNY: 7.15,
        EUR: 0.92,
        JPY: 150.5,
        GBP: 0.78
      },
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('获取汇率数据失败:', error);
    throw new Error('无法获取当前汇率数据');
  }
}

/**
 * 生成付款计划
 * @param {number} totalAmount - 总金额
 * @param {string} currency - 货币
 * @param {Object} options - 配置选项
 * @returns {Object} - 付款计划
 */
export function generatePaymentSchedule(totalAmount, currency = 'CNY', options = {}) {
  // 默认选项
  const defaultOptions = {
    type: 'standard', // standard(标准), milestone(里程碑), custom(自定义)
    initialPercent: 30, // 首付款百分比
    installments: 3,    // 分期次数
    interestRate: 0,    // 年利率(%)
    interval: 30,       // 付款间隔(天)
    startDate: new Date()
  };
  
  // 合并选项
  const config = { ...defaultOptions, ...options };
  
  // 验证输入
  if (totalAmount <= 0) {
    throw new Error('总金额必须大于零');
  }
  
  // 准备付款计划对象
  const paymentSchedule = {
    totalAmount,
    currency,
    type: config.type,
    installments: [],
    notes: config.notes || '',
    metadata: {
      generatedAt: new Date().toISOString(),
      options: config
    }
  };
  
  // 根据类型生成付款计划
  switch (config.type) {
    case 'milestone':
      // 验证里程碑数据
      if (!config.milestoneDates || !config.milestonePercents || 
          config.milestoneDates.length !== config.milestonePercents.length) {
        throw new Error('里程碑付款计划需要匹配的日期和百分比数组');
      }
      
      // 生成里程碑付款计划
      for (let i = 0; i < config.milestoneDates.length; i++) {
        const percent = config.milestonePercents[i];
        const amount = totalAmount * (percent / 100);
        const dueDate = new Date(config.milestoneDates[i]);
        
        paymentSchedule.installments.push({
          number: i + 1,
          description: `里程碑${i + 1}付款`,
          percent,
          amount,
          formattedAmount: formatCurrency(amount, currency),
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'pending'
        });
      }
      break;
    
    case 'standard':
    default:
      // 标准分期付款计划
      
      // 验证分期次数
      if (config.installments < 1) {
        throw new Error('分期次数必须至少为1');
      }
      
      // 首付款
      const firstPaymentPercent = config.initialPercent;
      const firstPaymentAmount = totalAmount * (firstPaymentPercent / 100);
      const firstPaymentDate = new Date(config.startDate);
      
      paymentSchedule.installments.push({
        number: 1,
        description: '首付款',
        percent: firstPaymentPercent,
        amount: firstPaymentAmount,
        formattedAmount: formatCurrency(firstPaymentAmount, currency),
        dueDate: firstPaymentDate.toISOString().split('T')[0],
        status: 'pending'
      });
      
      // 计算后续分期付款
      const remainingAmount = totalAmount - firstPaymentAmount;
      const remainingPercent = 100 - firstPaymentPercent;
      const installmentCount = config.installments - 1;
      
      if (installmentCount > 0) {
        // 计算每期金额(不含利息)
        const baseInstallmentAmount = remainingAmount / installmentCount;
        const baseInstallmentPercent = remainingPercent / installmentCount;
        
        // 是否有利息
        const hasInterest = config.interestRate > 0;
        
        for (let i = 0; i < installmentCount; i++) {
          const installmentNumber = i + 2; // 首付款是1
          const dueDate = new Date(config.startDate);
          dueDate.setDate(dueDate.getDate() + config.interval * (i + 1));
          
          let installmentAmount = baseInstallmentAmount;
          let installmentPercent = baseInstallmentPercent;
          
          // 计算利息(如果有)
          if (hasInterest) {
            const monthsElapsed = config.interval * (i + 1) / 30; // 估算月数
            const annualRate = config.interestRate / 100;
            const monthlyRate = annualRate / 12;
            
            // 简单利息计算
            const interest = remainingAmount * monthlyRate * monthsElapsed / installmentCount;
            installmentAmount += interest;
            
            // 调整百分比
            installmentPercent = (installmentAmount / totalAmount) * 100;
          }
          
          paymentSchedule.installments.push({
            number: installmentNumber,
            description: `分期付款${installmentNumber}`,
            percent: installmentPercent,
            amount: installmentAmount,
            formattedAmount: formatCurrency(installmentAmount, currency),
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'pending'
          });
        }
      }
      break;
  }
  
  // 计算付款计划摘要
  paymentSchedule.summary = {
    totalAmount,
    formattedTotalAmount: formatCurrency(totalAmount, currency),
    paidAmount: 0,
    formattedPaidAmount: formatCurrency(0, currency),
    remainingAmount: totalAmount,
    formattedRemainingAmount: formatCurrency(totalAmount, currency),
    nextPaymentDate: paymentSchedule.installments[0]?.dueDate || 'N/A',
    nextPaymentAmount: paymentSchedule.installments[0]?.amount || 0,
    formattedNextPaymentAmount: paymentSchedule.installments[0] 
      ? formatCurrency(paymentSchedule.installments[0].amount, currency) 
      : formatCurrency(0, currency)
  };
  
  return paymentSchedule;
}

/**
 * 生成基于不同贸易条款的报价
 * @param {Object} quotation - 基本报价单
 * @param {Object} options - 配置选项
 * @returns {Object} - 不同贸易条款下的报价结果
 */
export function generateIncotermQuotations(quotation, options = {}) {
  const {
    baseIncoterm = 'EXW',
    targetIncoterms = ['EXW', 'FOB', 'CIF', 'DDP'],
    originCountry = 'CN',
    destinationCountry = 'US',
    shippingPort = '上海',
    destinationPort = '洛杉矶',
    transportCost = 0,
    insuranceCost = 0,
    exportClearanceCost = 0,
    importClearanceCost = 0,
    importDuty = 0,
    currency = 'USD'
  } = options;
  
  // 检查基础贸易条款是否有效
  if (!INCOTERM_DATA[baseIncoterm]) {
    throw new Error(`无效的基础贸易条款: ${baseIncoterm}`);
  }
  
  // 基础价格和成本数据
  const basePrice = quotation.totalAmount;
  const results = {};
  
  // 处理每个目标贸易条款
  targetIncoterms.forEach(incoterm => {
    if (!INCOTERM_DATA[incoterm]) {
      console.warn(`跳过无效的贸易条款: ${incoterm}`);
      return;
    }
    
    // 复制基本报价单
    const incotermQuotation = JSON.parse(JSON.stringify(quotation));
    
    // 根据贸易条款调整成本
    let additionalCosts = [];
    let totalAdditionalCost = 0;
    
    // 调整运输成本
    if (INCOTERM_DATA[incoterm].includesTrans && !INCOTERM_DATA[baseIncoterm].includesTrans) {
      additionalCosts.push({
        name: '国际运输费',
        amount: transportCost,
        description: `从${shippingPort}运至${destinationPort}`
      });
      totalAdditionalCost += transportCost;
    }
    
    // 调整保险成本
    if (INCOTERM_DATA[incoterm].includesInsurance && !INCOTERM_DATA[baseIncoterm].includesInsurance) {
      additionalCosts.push({
        name: '货物保险费',
        amount: insuranceCost,
        description: '货物运输保险'
      });
      totalAdditionalCost += insuranceCost;
    }
    
    // 调整出口清关成本
    if (INCOTERM_DATA[incoterm].includesExport && !INCOTERM_DATA[baseIncoterm].includesExport) {
      additionalCosts.push({
        name: '出口清关费',
        amount: exportClearanceCost,
        description: `${originCountry}出口清关`
      });
      totalAdditionalCost += exportClearanceCost;
    }
    
    // 调整进口清关成本和关税
    if (INCOTERM_DATA[incoterm].includesImport && !INCOTERM_DATA[baseIncoterm].includesImport) {
      additionalCosts.push({
        name: '进口清关费',
        amount: importClearanceCost,
        description: `${destinationCountry}进口清关`
      });
      totalAdditionalCost += importClearanceCost;
      
      additionalCosts.push({
        name: '进口关税',
        amount: importDuty,
        description: `${destinationCountry}进口关税`
      });
      totalAdditionalCost += importDuty;
    }
    
    // 更新报价单
    if (additionalCosts.length > 0) {
      // 添加额外成本项目
      incotermQuotation.items = [
        ...incotermQuotation.items,
        ...additionalCosts.map((cost, index) => ({
          id: `incoterm-cost-${index}`,
          name: cost.name,
          model: '',
          quantity: 1,
          unit: '项',
          unitPrice: cost.amount,
          amount: cost.amount,
          remarks: cost.description,
          incotermRelated: true
        }))
      ];
      
      // 更新总额
      incotermQuotation.originalAmount = basePrice;
      incotermQuotation.totalAmount = basePrice + totalAdditionalCost;
    }
    
    // 添加贸易条款说明
    incotermQuotation.incoterm = {
      code: incoterm,
      name: INCOTERM_DATA[incoterm].name,
      description: `${incoterm} ${INCOTERM_DATA[incoterm].name} (${shippingPort})`,
      details: generateIncotermClause(incoterm, {
        originCountry,
        destinationCountry,
        shippingPort,
        destinationPort
      })
    };
    
    // 存储结果
    results[incoterm] = incotermQuotation;
  });
  
  return results;
}

/**
 * 生成贸易条款说明
 * @param {string} incoterm - 贸易条款代码
 * @param {Object} options - 配置选项
 * @returns {string} - 条款说明
 */
function generateIncotermClause(incoterm, options) {
  const { originCountry, destinationCountry, shippingPort, destinationPort } = options;
  
  // 各贸易条款详细说明
  const clauses = {
    EXW: `卖方在卖方场所(${originCountry})将货物交付给买方后，即完成交货。卖方无需将货物装上任何运输工具，也无需办理出口清关手续。买方承担所有风险和费用。`,
    
    FOB: `卖方必须在装运港(${shippingPort})将货物交至买方指定的船上，即完成交货。自此点起，买方承担所有风险和额外费用。卖方需办理出口清关手续。`,
    
    CIF: `卖方在装运港(${shippingPort})将货物交至船上，并支付将货物运至目的港(${destinationPort})的运费和保险费。卖方办理出口清关手续，但买方承担自装运港装船后的风险。`,
    
    DDP: `卖方将在目的地(${destinationPort})，办理完进口清关手续并交付使用的货物交给买方，即完成交货。卖方承担将货物运至目的地的所有风险和费用，包括在目的地国办理进口清关手续、缴纳关税、税金和其他费用。`
  };
  
  // 返回指定贸易条款的条款文本，如果没有详细说明则返回通用描述
  return clauses[incoterm] || `${incoterm} (2020): 卖方和买方应根据国际商会(ICC)发布的《2020年国际贸易术语解释通则》中${incoterm}条款的规定履行各自义务。`;
}
/**
 * 生成多货币报价单
 * @param {Object} quotation - 基础报价单
 * @param {string} targetCurrency - 目标货币
 * @param {Object} exchangeRates - 汇率数据
 * @returns {Object} - 转换后的报价单
 */
export function generateMultiCurrencyQuotation(quotation, targetCurrency, exchangeRates) {
  if (!quotation || !quotation.items || !Array.isArray(quotation.items)) {
    throw new Error('无效的报价单数据');
  }
  
  if (targetCurrency === quotation.currency) {
    // 已经是目标货币报价单，无需转换
    return { ...quotation };
  }
  
  // 复制报价单并更新货币信息
  const convertedQuotation = {
    ...quotation,
    currency: targetCurrency,
    originalCurrency: quotation.currency,
    exchangeRate: exchangeRates ? (exchangeRates.rates[targetCurrency] / exchangeRates.rates[quotation.currency]) : null,
    exchangeRateDate: exchangeRates ? exchangeRates.date : new Date().toISOString().split('T')[0],
    items: []
  };
  
  // 转换每个项目的价格
  convertedQuotation.items = quotation.items.map(item => {
    const convertedUnitPrice = convertCurrency(
      item.unitPrice,
      quotation.currency,
      targetCurrency,
      exchangeRates
    );
    
    return {
      ...item,
      unitPrice: convertedUnitPrice,
      amount: convertedUnitPrice * item.quantity,
      originalUnitPrice: item.unitPrice,
      originalAmount: item.amount,
      originalCurrency: quotation.currency
    };
  });
  
  // 重新计算总金额
  const totalAmount = convertedQuotation.items.reduce((sum, item) => sum + item.amount, 0);
  convertedQuotation.totalAmount = totalAmount;
  convertedQuotation.originalTotalAmount = quotation.totalAmount;
  
  // 更新折扣信息(如果有)
  if (quotation.discountPercentage) {
    convertedQuotation.discountAmount = totalAmount * (quotation.discountPercentage / 100);
    convertedQuotation.totalAmount = totalAmount - convertedQuotation.discountAmount;
  }
  
  // 格式化显示金额
  convertedQuotation.formattedTotalAmount = formatCurrency(convertedQuotation.totalAmount, targetCurrency);
  
  return convertedQuotation;
}

/**
 * 多货币报价表组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function MultiCurrencyQuotationTable({
  quotation,
  onCurrencyChange,
  availableCurrencies = ['CNY', 'USD', 'EUR'],
  exchangeRates,
  loading = false
}) {
  // 当前货币
  const [currency, setCurrency] = React.useState(quotation?.currency || 'CNY');
  
  // 处理货币变更
  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setCurrency(newCurrency);
    
    // 调用外部处理函数
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  };
  
  // 如果没有报价单数据，显示提示信息
  if (!quotation || !quotation.items || !Array.isArray(quotation.items)) {
    return (
      <div className="card">
        <div className="card-body text-center p-4">
          <p className="text-muted">无可用报价单数据</p>
        </div>
      </div>
    );
  }
  
  // 汇率信息显示
  const renderExchangeRateInfo = () => {
    if (!exchangeRates || currency === (quotation.originalCurrency || 'CNY')) {
      return null;
    }
    
    const rate = exchangeRates.rates[currency] / exchangeRates.rates[quotation.originalCurrency || 'CNY'];
    
    return (
      <div className="mb-3 d-flex align-items-center">
        <span className="badge bg-info text-dark me-2">
          <i className="bi bi-currency-exchange me-1"></i>
          汇率: 1 {quotation.originalCurrency || 'CNY'} = {rate.toFixed(4)} {currency}
        </span>
        <small className="text-muted">
          更新日期: {exchangeRates.date || new Date().toISOString().split('T')[0]}
        </small>
      </div>
    );
  };
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">报价单</h5>
          <div className="d-flex align-items-center">
            <select
              className="form-select form-select-sm"
              value={currency}
              onChange={handleCurrencyChange}
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              {availableCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_DATA[curr].symbol} {curr}
                </option>
              ))}
            </select>
            
            {loading && (
              <div className="spinner-border spinner-border-sm ms-2" role="status">
                <span className="visually-hidden">加载中...</span>
              </div>
            )}
          </div>
        </div>
        
        {renderExchangeRateInfo()}
        
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th>描述</th>
                <th className="text-center">单位</th>
                <th className="text-center">数量</th>
                <th className="text-end">单价 ({CURRENCY_DATA[currency].symbol})</th>
                <th className="text-end">金额 ({CURRENCY_DATA[currency].symbol})</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => {
                // 转换价格到当前货币
                const unitPrice = currency === quotation.currency
                  ? item.unitPrice
                  : convertCurrency(item.unitPrice, quotation.currency, currency, exchangeRates);
                
                const amount = unitPrice * item.quantity;
                
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className="text-center">{item.unit}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(unitPrice, currency)}</td>
                    <td className="text-end">{formatCurrency(amount, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-end">
          <div className="lead">
            总金额: {formatCurrency(
              quotation.items.reduce((sum, item) => {
                const unitPrice = currency === quotation.currency
                  ? item.unitPrice
                  : convertCurrency(item.unitPrice, quotation.currency, currency, exchangeRates);
                return sum + unitPrice * item.quantity;
              }, 0),
              currency
            )}
          </div>
          
          {quotation.discountPercentage > 0 && (
            <>
              <div className="text-muted small">
                折扣 ({quotation.discountPercentage}%): {formatCurrency(
                  quotation.items.reduce((sum, item) => {
                    const unitPrice = currency === quotation.currency
                      ? item.unitPrice
                      : convertCurrency(item.unitPrice, quotation.currency, currency, exchangeRates);
                    return sum + unitPrice * item.quantity;
                  }, 0) * (quotation.discountPercentage / 100),
                  currency
                )}
              </div>
              <div className="h5 text-primary">
                应付金额: {formatCurrency(
                  quotation.items.reduce((sum, item) => {
                    const unitPrice = currency === quotation.currency
                      ? item.unitPrice
                      : convertCurrency(item.unitPrice, quotation.currency, currency, exchangeRates);
                    return sum + unitPrice * item.quantity;
                  }, 0) * (1 - quotation.discountPercentage / 100),
                  currency
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 国际贸易条款选择组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function IncotermSelector({
  value,
  onChange,
  quotation,
  disabled = false,
  showDetails = true
}) {
  // 贸易条款选项
  const incotermOptions = React.useMemo(() => 
    Object.entries(INCOTERM_DATA).map(([code, data]) => ({
      code,
      label: `${code} - ${data.name}`,
      details: data
    })),
    []
  );
  
  // 获取当前选择的贸易条款详情
  const selectedIncoterm = incotermOptions.find(option => option.code === value);
  
  // 处理贸易条款变更
  const handleChange = (event) => {
    const newValue = event.target.value;
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // 渲染贸易条款特性
  const renderIncotermFeatures = (incoterm) => {
    if (!incoterm) return null;
    
    const { details } = incoterm;
    
    return (
      <div className="mt-3">
        <h6 className="mb-2">条款特性:</h6>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              运输费:
              <span className={`badge ms-2 ${details.includesTrans ? 'bg-success' : 'bg-secondary'}`}>
                {details.includesTrans ? '包含' : '不包含'}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              保险费:
              <span className={`badge ms-2 ${details.includesInsurance ? 'bg-success' : 'bg-secondary'}`}>
                {details.includesInsurance ? '包含' : '不包含'}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              出口清关:
              <span className={`badge ms-2 ${details.includesExport ? 'bg-success' : 'bg-secondary'}`}>
                {details.includesExport ? '包含' : '不包含'}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              进口清关:
              <span className={`badge ms-2 ${details.includesImport ? 'bg-success' : 'bg-secondary'}`}>
                {details.includesImport ? '包含' : '不包含'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">国际贸易条款</h5>
        
        <div className="form-group mb-3">
          <label htmlFor="incoterm-select" className="form-label">贸易条款</label>
          <select
            id="incoterm-select"
            className="form-select"
            value={value}
            onChange={handleChange}
            disabled={disabled}
          >
            {incotermOptions.map(option => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {showDetails && selectedIncoterm && (
          <>
            {renderIncotermFeatures(selectedIncoterm)}
            
            {quotation && quotation.incoterm && (
              <div className="mt-3">
                <h6 className="mb-2">价格影响:</h6>
                
                <div className="table-responsive">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>基础价格 (EXW):</td>
                        <td className="text-end">
                          {formatCurrency(quotation.originalAmount || quotation.totalAmount, quotation.currency)}
                        </td>
                      </tr>
                      
                      {quotation.items
                        .filter(item => item.incotermRelated)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}:</td>
                            <td className="text-end">
                              {formatCurrency(item.amount, quotation.currency)}
                            </td>
                          </tr>
                        ))}
                      
                      <tr className="table-active fw-bold">
                        <td>{quotation.incoterm.code} 总价:</td>
                        <td className="text-end text-primary">
                          {formatCurrency(quotation.totalAmount, quotation.currency)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 付款计划组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 渲染的组件
 */
export function PaymentSchedule({
  schedule,
  onScheduleChange,
  editable = true,
  currency = 'CNY'
}) {
  // 处理计划类型变更
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    
    if (onScheduleChange) {
      onScheduleChange({
        ...schedule,
        type: newType
      });
    }
  };
  
  // 处理首付款百分比变更
  const handleInitialPercentChange = (event) => {
    const value = parseFloat(event.target.value);
    
    if (onScheduleChange && !isNaN(value) && value >= 0 && value <= 100) {
      onScheduleChange({
        ...schedule,
        options: {
          ...schedule.options,
          initialPercent: value
        }
      });
    }
  };
  
  // 处理分期次数变更
  const handleInstallmentsChange = (event) => {
    const value = parseInt(event.target.value, 10);
    
    if (onScheduleChange && !isNaN(value) && value >= 1) {
      onScheduleChange({
        ...schedule,
        options: {
          ...schedule.options,
          installments: value
        }
      });
    }
  };
  
  // 处理利率变更
  const handleInterestRateChange = (event) => {
    const value = parseFloat(event.target.value);
    
    if (onScheduleChange && !isNaN(value) && value >= 0) {
      onScheduleChange({
        ...schedule,
        options: {
          ...schedule.options,
          interestRate: value
        }
      });
    }
  };
  
  // 如果没有计划数据，显示提示信息
  if (!schedule) {
    return (
      <div className="card h-100">
        <div className="card-body text-center p-4">
          <p className="text-muted">无可用付款计划数据</p>
        </div>
      </div>
    );
  }
  
  // 付款计划类型选项
  const scheduleTypeOptions = [
    { value: 'standard', label: '标准分期付款' },
    { value: 'milestone', label: '里程碑付款' }
  ];
  
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">付款计划</h5>
        
        {editable && (
          <div className="mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12">
                <div className="form-group">
                  <label className="form-label">计划类型</label>
                  <select
                    className="form-select"
                    value={schedule.type}
                    onChange={handleTypeChange}
                  >
                    {scheduleTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {schedule.type === 'standard' && (
                <>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">首付款(%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={schedule.options?.initialPercent || 30}
                        onChange={handleInitialPercentChange}
                        min="0"
                        max="100"
                        step="5"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">分期次数</label>
                      <input
                        type="number"
                        className="form-control"
                        value={schedule.options?.installments || 3}
                        onChange={handleInstallmentsChange}
                        min="1"
                        step="1"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">年利率(%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={schedule.options?.interestRate || 0}
                        onChange={handleInterestRateChange}
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {schedule.type === 'milestone' && (
                <div className="col-12">
                  <div className="form-text">
                    里程碑付款需要定义具体的日期和比例，请在下面表格中编辑。
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th width="5%">#</th>
                <th>描述</th>
                <th className="text-center" width="15%">比例</th>
                <th className="text-end" width="20%">金额</th>
                <th className="text-center" width="15%">日期</th>
                <th className="text-center" width="15%">状态</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(schedule.installments) && schedule.installments.map((installment, index) => (
                <tr key={index}>
                  <td>{installment.number}</td>
                  <td>{installment.description}</td>
                  <td className="text-center">{`${installment.percent.toFixed(1)}%`}</td>
                  <td className="text-end">{formatCurrency(installment.amount, currency)}</td>
                  <td className="text-center">{new Date(installment.dueDate).toLocaleDateString()}</td>
                  <td className="text-center">
                    <span className={`badge ${installment.status === 'paid' ? 'bg-success' : 'bg-secondary'}`}>
                      {installment.status === 'paid' ? '已支付' : '待支付'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3">
          <h6>付款计划摘要:</h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td width="50%">总金额:</td>
                  <td className="text-end">
                    {formatCurrency(schedule.totalAmount, currency)}
                  </td>
                </tr>
                
                <tr>
                  <td>已支付金额:</td>
                  <td className="text-end">
                    {formatCurrency(
                      Array.isArray(schedule.installments) 
                        ? schedule.installments
                            .filter(inst => inst.status === 'paid')
                            .reduce((sum, inst) => sum + inst.amount, 0)
                        : 0,
                      currency
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td>待支付金额:</td>
                  <td className="text-end">
                    {formatCurrency(
                      Array.isArray(schedule.installments) 
                        ? schedule.installments
                            .filter(inst => inst.status !== 'paid')
                            .reduce((sum, inst) => sum + inst.amount, 0)
                        : schedule.totalAmount,
                      currency
                    )}
                  </td>
                </tr>
                
                <tr>
                  <td>下次付款日期:</td>
                  <td className="text-end">
                    {Array.isArray(schedule.installments) && schedule.installments.some(inst => inst.status !== 'paid')
                      ? new Date(
                          schedule.installments
                            .filter(inst => inst.status !== 'paid')
                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0].dueDate
                        ).toLocaleDateString()
                      : '无'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 导出功能组件和工具函数
export default {
  formatCurrency,
  convertCurrency,
  fetchExchangeRates,
  generatePaymentSchedule,
  generateIncotermQuotations,
  generateMultiCurrencyQuotation,
  MultiCurrencyQuotationTable,
  IncotermSelector,
  PaymentSchedule,
  CURRENCY_DATA,
  INCOTERM_DATA,
  PAYMENT_TERMS
};