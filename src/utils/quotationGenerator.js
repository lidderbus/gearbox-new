// utils/quotationGenerator.js - 完整版
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { getGWPackagePriceConfig, checkPackageMatch } from '../data/packagePriceConfig';
// 导入增强版备用泵需求判断函数
import { needsStandbyPump } from '../utils/enhancedPumpSelection';

/**
 * 生成报价单数据
 * @param {Object} selectionResult - 选型结果对象
 * @param {Object} projectInfo - 项目信息
 * @param {Object} selectedComponents - 包含选定 gearbox, coupling (或null), pump (或null) 的对象
 * @param {Object} priceInfo - 包含 packagePrice, marketPrice, totalMarketPrice 和 componentPrices 的对象
 * @param {Object} options - 额外选项，如配件价格显示设置
 * @returns {Object} 生成的报价单数据对象 { success: boolean, message?: string, ...data }
 */
export const generateQuotation = (selectionResult, projectInfo, selectedComponents, priceInfo, options = {}) => {
    // 默认选项设置
    const defaultOptions = {
        showCouplingPrice: true, // 默认显示联轴器单独价格
        showPumpPrice: true,     // 默认显示备用泵单独价格
        includePump: true,       // 默认包含备用泵
        taxRate: 0,              // 默认税率为0（不含税）
        includeDelivery: false,  // 默认不包含运输
        deliveryCost: 0,         // 默认运输费用
        includeInstallation: false, // 默认不包含安装
        installationCost: 0,     // 默认安装费用
        discountPercentage: 0,   // 默认折扣百分比
        validityDays: 30,        // 默认有效期
        paymentTerms: '合同签订后支付30%预付款，发货前付清全款',
        deliveryTime: '合同签订生效后3个月内发货',
        currency: 'CNY',         // 默认货币
        language: 'zh-CN',       // 默认语言
        format: 'standard'       // 默认报价单格式
    };
    
    // 合并选项
    const finalOptions = { ...defaultOptions, ...options };
    
    // 检查是否为GW系列齿轮箱，如果不是，则默认将配件价格包含在齿轮箱中
    const gearboxModel = selectedComponents?.gearbox?.model || '';
    if (gearboxModel && typeof gearboxModel === 'string') {
        const isGWSeries = gearboxModel.toUpperCase().includes('GW');
        if (!isGWSeries && options.autoSetPriceOption !== false) {
            // 非GW系列默认包含配件价格
            finalOptions.showCouplingPrice = false;
            finalOptions.showPumpPrice = false;
            console.log("非GW系列齿轮箱，默认包含配件价格");
        }
    }
    
    // 使用传入的备用泵需求信息
    const needsPumpFlag = priceInfo.needsPump !== undefined ? 
        priceInfo.needsPump : 
        (selectedComponents.gearbox ? needsStandbyPump(selectedComponents.gearbox.model, {
            power: selectedComponents.gearbox.power
        }) : false);
    
    // 最终决定是否包含泵
    const effectiveIncludePump = needsPumpFlag && finalOptions.includePump;
    
    // 记录详细日志
    console.log("generateQuotation called with:", { 
        selectionResultStatus: selectionResult?.success, 
        componentsPresent: {
            gearbox: !!selectedComponents?.gearbox,
            coupling: !!selectedComponents?.coupling,
            pump: !!selectedComponents?.pump
        },
        priceInfo: {
            packagePrice: priceInfo?.packagePrice,
            marketPrice: priceInfo?.marketPrice,
            componentsIncluded: {
                gearbox: !!priceInfo?.componentPrices?.gearbox,
                coupling: !!priceInfo?.componentPrices?.coupling,
                pump: !!priceInfo?.componentPrices?.pump
            },
            needsPump: needsPumpFlag,
            includePump: effectiveIncludePump,
            hasSpecialPackagePrice: priceInfo?.hasSpecialPackagePrice,
            specialPackageConfig: priceInfo?.specialPackageConfig
        },
        options: finalOptions
    });
    
    if (!selectedComponents?.gearbox || !priceInfo?.componentPrices?.gearbox) {
        return { success: false, message: "缺少齿轮箱或价格信息" };
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const expiryDate = new Date(today); expiryDate.setDate(today.getDate() + finalOptions.validityDays);
    const formattedExpiryDate = `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-${String(expiryDate.getDate()).padStart(2, '0')}`;
    const quotationNumber = `Q-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).toString().padStart(4, '0')}`;

    const items = [];
    let calculatedTotalAmount = 0;
    
    // 检查是否适用特殊打包价格
    let usingSpecialPackagePrice = false;
    let specialPackageConfig = null;
    
    if (gearboxModel && gearboxModel.startsWith('GW')) {
        const gwConfig = getGWPackagePriceConfig(gearboxModel);
        if (gwConfig && !gwConfig.isSmallGWModel) {
            // 检查组件组合是否符合打包价格条件
            if (checkPackageMatch(
                selectedComponents.gearbox, 
                selectedComponents.coupling, 
                effectiveIncludePump ? selectedComponents.pump : null, 
                gwConfig
            )) {
                usingSpecialPackagePrice = true;
                specialPackageConfig = gwConfig;
                console.log(`使用GW系列特殊打包价格: ${gwConfig.packagePrice}`);
                
                // 启用特殊价格时，默认不单独显示配件价格
                finalOptions.showCouplingPrice = false;
                finalOptions.showPumpPrice = false;
            }
        }
    }
    
    // 检查是否需要将配件价格包含在齿轮箱中
    const includeCouplingInGearbox = !finalOptions.showCouplingPrice && selectedComponents.coupling;
    const includePumpInGearbox = !finalOptions.showPumpPrice && selectedComponents.pump && effectiveIncludePump;
    
    // 计算需要包含在齿轮箱价格中的配件价格总和
    let includedAccessoriesPrice = 0;
    
    if (includeCouplingInGearbox && priceInfo.componentPrices.coupling) {
        includedAccessoriesPrice += priceInfo.componentPrices.coupling.marketPrice || 0;
        console.log("联轴器价格包含在齿轮箱中:", priceInfo.componentPrices.coupling.marketPrice);
    }
    
    if (includePumpInGearbox && priceInfo.componentPrices.pump) {
        includedAccessoriesPrice += priceInfo.componentPrices.pump.marketPrice || 0;
        console.log("备用泵价格包含在齿轮箱中:", priceInfo.componentPrices.pump.marketPrice);
    }
    
    // 添加齿轮箱（可能包含配件价格）
    const gearbox = selectedComponents.gearbox;
    const gearboxPrices = priceInfo.componentPrices.gearbox;
    
    // 基础价格
    let gearboxMarketPrice;
    let gearboxFactoryPrice;
    let gearboxPackagePrice;
    
    if (usingSpecialPackagePrice) {
        // 使用特殊打包价格
        gearboxMarketPrice = specialPackageConfig.packagePrice;
        gearboxFactoryPrice = Math.round(specialPackageConfig.packagePrice * 0.87); // 估算工厂价
        gearboxPackagePrice = specialPackageConfig.packagePrice;
    } else {
        // 使用标准价格计算
        gearboxMarketPrice = typeof gearboxPrices.marketPrice === 'number' ? gearboxPrices.marketPrice : 0;
        gearboxFactoryPrice = typeof gearboxPrices.factoryPrice === 'number' ? gearboxPrices.factoryPrice : 0;
        gearboxPackagePrice = typeof gearboxPrices.packagePrice === 'number' ? gearboxPrices.packagePrice : 0;
        
        // 如果包含配件价格，则增加齿轮箱价格
        if (includedAccessoriesPrice > 0) {
            gearboxMarketPrice += includedAccessoriesPrice;
            gearboxFactoryPrice += includedAccessoriesPrice * 0.88; // 估算工厂价
            gearboxPackagePrice += includedAccessoriesPrice * 0.88; // 估算包装价
        }
    }
    
    // 生成齿轮箱项目
    let gearboxRemarks = `速比: ${gearbox.ratio?.toFixed(2) ?? gearbox.selectedRatio?.toFixed(2) ?? 'N/A'}`;
    
    // 添加特殊打包价格说明
    if (usingSpecialPackagePrice) {
        gearboxRemarks += ` (采用市场常规打包价)`;
    } 
    // 如果包含配件价格，在备注中注明
    else if (includeCouplingInGearbox || includePumpInGearbox) {
        let includedItems = [];
        if (includeCouplingInGearbox) includedItems.push("高弹性联轴器");
        if (includePumpInGearbox) includedItems.push("备用泵");
        gearboxRemarks += ` (含${includedItems.join('和')})`;
    }
    
    const gearboxItem = {
        id: 1,
        name: "船用齿轮箱",
        model: gearbox.model || 'N/A',
        quantity: 1,
        unit: '台',
        prices: {
            factory: gearboxFactoryPrice,
            package: gearboxPackagePrice,
            market: gearboxMarketPrice
        },
        selectedPrice: 'market', // Default to market price
        get unitPrice() {
            return this.prices[this.selectedPrice] || 0;
        },
        get amount() {
            return this.unitPrice * this.quantity;
        },
        remarks: gearboxRemarks,
        hasSpecialPackagePrice: usingSpecialPackagePrice,
        gwPackageConfig: usingSpecialPackagePrice ? specialPackageConfig : undefined
    };
    items.push(gearboxItem);
    calculatedTotalAmount += gearboxItem.amount;

    // 添加联轴器（如果显示单独价格）
    if (selectedComponents.coupling && finalOptions.showCouplingPrice) {
        console.log("添加联轴器到报价单:", selectedComponents.coupling.model);
        const coupling = selectedComponents.coupling;
        const couplingPrices = priceInfo.componentPrices.coupling;
        
        // 确保有价格信息
        if (couplingPrices && (couplingPrices.factoryPrice || couplingPrices.marketPrice || couplingPrices.basePrice)) {
            const couplingItem = {
                id: items.length + 1,
                name: "高弹性联轴器",
                model: coupling.model || 'N/A',
                quantity: 1,
                unit: '套',
                prices: {
                    factory: typeof couplingPrices.factoryPrice === 'number' ? couplingPrices.factoryPrice : 0,
                    package: typeof couplingPrices.packagePrice === 'number' ? couplingPrices.packagePrice : 0,
                    market: typeof couplingPrices.marketPrice === 'number' ? couplingPrices.marketPrice : 0
                },
                selectedPrice: 'market',
                get unitPrice() {
                    return this.prices[this.selectedPrice] || 0;
                },
                get amount() {
                    return this.unitPrice * this.quantity;
                },
                remarks: coupling.hasCover ? "带罩壳，与齿轮箱配套" : "与齿轮箱配套"
            };
            items.push(couplingItem);
            calculatedTotalAmount += couplingItem.amount;
            console.log("联轴器已成功添加到报价单，价格:", couplingItem.unitPrice);
        } else {
            // 如果没有价格信息，仍然添加但价格为"待定"
            const couplingItem = {
                id: items.length + 1,
                name: "高弹性联轴器",
                model: coupling.model || 'N/A',
                quantity: 1,
                unit: '套',
                prices: { factory: 0, package: 0, market: 0 },
                selectedPrice: 'market',
                unitPrice: '待定',
                amount: '待定',
                remarks: coupling.hasCover ? "带罩壳，配套(价待定)" : "配套(价待定)"
            };
            items.push(couplingItem);
            console.log("联轴器已添加到报价单，但价格为待定");
        }
    } else if (selectedComponents.coupling && !finalOptions.showCouplingPrice) {
        console.log("联轴器价格已包含在齿轮箱中，不单独显示");
    } else {
        console.log("联轴器组件不存在，已跳过");
    }

    // 添加备用泵（如果显示单独价格并且需要备用泵且用户选择包含）
    if (selectedComponents.pump && finalOptions.showPumpPrice && effectiveIncludePump) {
        console.log("添加备用泵到报价单:", selectedComponents.pump.model);
        const pump = selectedComponents.pump;
        const pumpPrices = priceInfo.componentPrices.pump;
        
        // 确保有价格信息
        if (pumpPrices && (pumpPrices.factoryPrice || pumpPrices.marketPrice || pumpPrices.basePrice)) {
            const pumpItem = {
                id: items.length + 1,
                name: "备用泵",
                model: pump.model || 'N/A',
                quantity: 1,
                unit: '台',
                prices: {
                    factory: typeof pumpPrices.factoryPrice === 'number' ? pumpPrices.factoryPrice : 0,
                    package: typeof pumpPrices.packagePrice === 'number' ? pumpPrices.packagePrice : 0,
                    market: typeof pumpPrices.marketPrice === 'number' ? pumpPrices.marketPrice : 0
                },
                selectedPrice: 'market',
                get unitPrice() {
                    return this.prices[this.selectedPrice] || 0;
                },
                get amount() {
                    return this.unitPrice * this.quantity;
                },
                remarks: "与齿轮箱配套"
            };
            items.push(pumpItem);
            calculatedTotalAmount += pumpItem.amount;
            console.log("备用泵已成功添加到报价单，价格:", pumpItem.unitPrice);
        } else {
            // 如果没有价格信息，仍然添加但价格为"待定"
            const pumpItem = {
                id: items.length + 1,
                name: "备用泵",
                model: pump.model || 'N/A',
                quantity: 1,
                unit: '台',
                prices: { factory: 0, package: 0, market: 0 },
                selectedPrice: 'market',
                unitPrice: '待定',
                amount: '待定',
                remarks: "配套(价待定)"
            };
            items.push(pumpItem);
            console.log("备用泵已添加到报价单，但价格为待定");
        }
    } else if (selectedComponents.pump && !finalOptions.showPumpPrice && effectiveIncludePump) {
        console.log("备用泵价格已包含在齿轮箱中，不单独显示");
    } else if (selectedComponents.pump && !effectiveIncludePump) {
        console.log("备用泵不需要或用户选择不包含，已跳过");
    } else {
        console.log("备用泵组件不存在，已跳过");
    }

    // 在报价单对象中添加标记，表明是否使用了特殊打包价格
    // 使用特殊打包价格时，总价使用特殊打包价格，而不是累加价格
    const result = {
        success: true,
        quotationNumber,
        date: formattedDate,
        expiryDate: formattedExpiryDate,
        customerInfo: {
            name: projectInfo?.customerName || 'N/A',
            contactPerson: projectInfo?.contactPerson || '',
            phone: projectInfo?.contactPhone || '',
            address: projectInfo?.customerAddress || ''
        },
        sellerInfo: {
            name: "上海前进齿轮经营有限公司",
            address: "上海市浦东新区浦东大道2123号3B-1室",
            phone: "021-58208956",
            bank: "中国银行上海市益民支行",
            account: "452759227880"
        },
        items,
        usingSpecialPackagePrice,
        specialPackageConfig,
        // 修复: 总价只包括实际显示在报价单中的项目
        totalAmount: usingSpecialPackagePrice ? specialPackageConfig.packagePrice : calculatedTotalAmount,
        originalAmount: usingSpecialPackagePrice ? specialPackageConfig.packagePrice : calculatedTotalAmount,
        discountAmount: 0,
        discountPercentage: finalOptions.discountPercentage,
        taxRate: finalOptions.taxRate,
        taxAmount: 0,
        taxIncludedAmount: usingSpecialPackagePrice ? specialPackageConfig.packagePrice : calculatedTotalAmount,
        totalAmountInChinese: numberToChinese(usingSpecialPackagePrice ? specialPackageConfig.packagePrice : calculatedTotalAmount),
        priceType: 'market', // Default price type
        paymentTerms: finalOptions.paymentTerms,
        deliveryTime: finalOptions.deliveryTime,
        notes: `此报价有效期${finalOptions.validityDays}天。价格含标准包装，不含运费保险。最终解释权归供方。`,
        
        // 保存备用泵相关设置
        options: {
            ...finalOptions,
            needsPump: needsPumpFlag,
            includePump: effectiveIncludePump,
            // 明确记录配件价格包含状态
            includeCouplingInGearbox: !finalOptions.showCouplingPrice,
            includePumpInGearbox: !finalOptions.showPumpPrice
        },
        selectionResult,
        selectedComponents,
        // 添加价格摘要信息
        summary: {
            packagePrice: priceInfo.packagePrice,
            marketPrice: priceInfo.marketPrice,
            totalMarketPrice: usingSpecialPackagePrice ? specialPackageConfig.packagePrice : priceInfo.totalMarketPrice,
            hasSpecialPackagePrice: usingSpecialPackagePrice,
            specialPackageConfig: usingSpecialPackagePrice ? specialPackageConfig : null
        }
    };
    
    // 应用折扣
    if (finalOptions.discountPercentage > 0) {
        result.discountAmount = Math.round(result.originalAmount * (finalOptions.discountPercentage / 100));
        result.totalAmount = result.originalAmount - result.discountAmount;
        result.totalAmountInChinese = numberToChinese(result.totalAmount);
    }
    
    // 计算含税金额
    if (finalOptions.taxRate > 0) {
        result.taxAmount = Math.round(result.totalAmount * (finalOptions.taxRate / 100));
        result.taxIncludedAmount = result.totalAmount + result.taxAmount;
    }
    
    // 添加运输服务项目
    if (finalOptions.includeDelivery && finalOptions.deliveryCost > 0) {
        const deliveryItem = {
            id: items.length + 1,
            name: "运输服务",
            model: "-",
            quantity: 1,
            unit: '项',
            prices: {
                factory: finalOptions.deliveryCost,
                package: finalOptions.deliveryCost,
                market: finalOptions.deliveryCost
            },
            selectedPrice: 'market',
            get unitPrice() {
                return this.prices[this.selectedPrice] || 0;
            },
            get amount() {
                return this.unitPrice * this.quantity;
            },
            remarks: "运输至客户指定地点"
        };
        items.push(deliveryItem);
        
        // 如果使用特殊打包价格，增加运输成本到总价
        if (usingSpecialPackagePrice) {
            result.originalAmount += deliveryItem.amount;
            result.totalAmount = result.originalAmount;
        } else {
            result.originalAmount += deliveryItem.amount;
        }
        
        // 重新计算总金额和折扣
        if (finalOptions.discountPercentage > 0) {
            result.discountAmount = Math.round(result.originalAmount * (finalOptions.discountPercentage / 100));
            result.totalAmount = result.originalAmount - result.discountAmount;
            result.totalAmountInChinese = numberToChinese(result.totalAmount);
            
            // 重新计算税额
            if (finalOptions.taxRate > 0) {
                result.taxAmount = Math.round(result.totalAmount * (finalOptions.taxRate / 100));
                result.taxIncludedAmount = result.totalAmount + result.taxAmount;
            }
        } else {
            result.totalAmount = result.originalAmount;
            result.totalAmountInChinese = numberToChinese(result.totalAmount);
            
            // 重新计算税额
            if (finalOptions.taxRate > 0) {
                result.taxAmount = Math.round(result.totalAmount * (finalOptions.taxRate / 100));
                result.taxIncludedAmount = result.totalAmount + result.taxAmount;
            }
        }
    }
    
    // 添加安装调试服务项目
    if (finalOptions.includeInstallation && finalOptions.installationCost > 0) {
        const installationItem = {
            id: items.length + 1,
            name: "安装调试服务",
            model: "-",
            quantity: 1,
            unit: '项',
            prices: {
                factory: finalOptions.installationCost,
                package: finalOptions.installationCost,
                market: finalOptions.installationCost
            },
            selectedPrice: 'market',
            get unitPrice() {
                return this.prices[this.selectedPrice] || 0;
            },
            get amount() {
                return this.unitPrice * this.quantity;
            },
            remarks: "产品安装、调试及操作培训"
        };
        items.push(installationItem);
        
        // 如果使用特殊打包价格，增加安装成本到总价
        if (usingSpecialPackagePrice) {
            result.originalAmount += installationItem.amount;
            result.totalAmount = result.originalAmount;
        } else {
            result.originalAmount += installationItem.amount;
        }
        
        // 重新计算总金额和折扣
        if (finalOptions.discountPercentage > 0) {
            result.discountAmount = Math.round(result.originalAmount * (finalOptions.discountPercentage / 100));
            result.totalAmount = result.originalAmount - result.discountAmount;
            result.totalAmountInChinese = numberToChinese(result.totalAmount);
            
            // 重新计算税额
            if (finalOptions.taxRate > 0) {
                result.taxAmount = Math.round(result.totalAmount * (finalOptions.taxRate / 100));
                result.taxIncludedAmount = result.totalAmount + result.taxAmount;
            }
        } else {
            result.totalAmount = result.originalAmount;
            result.totalAmountInChinese = numberToChinese(result.totalAmount);
            
            // 重新计算税额
            if (finalOptions.taxRate > 0) {
                result.taxAmount = Math.round(result.totalAmount * (finalOptions.taxRate / 100));
                result.taxIncludedAmount = result.totalAmount + result.taxAmount;
            }
        }
    }
    
    console.log("生成的报价单摘要:", {
        success: result.success,
        itemCount: result.items.length,
        totalAmount: result.totalAmount,
        includesCoupling: finalOptions.showCouplingPrice && result.items.some(item => item.name === "高弹性联轴器"),
        includesPump: finalOptions.showPumpPrice && result.items.some(item => item.name === "备用泵"),
        includedInGearbox: !finalOptions.showCouplingPrice || !finalOptions.showPumpPrice,
        usingSpecialPackagePrice: result.usingSpecialPackagePrice,
        needsPump: needsPumpFlag,
        includePump: effectiveIncludePump
    });
    
    return result;
};

/**
 * 将数字转换为中文大写金额
 * @param {number} n - 数字
 * @returns {string} 中文大写金额
 */
export function numberToChinese(n) {
    if (typeof n !== 'number') {
        return '零元整';
    }
    
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    
    const head = n < 0 ? '负' : '';
    n = Math.abs(n);
    
    let s = '';
    
    // 处理小数部分
    const decimalPart = Math.floor(n * 100 % 100);
    if (decimalPart > 0) {
        const decimalStr = decimalPart.toString().padStart(2, '0');
        s += digit[parseInt(decimalStr[0])] + fraction[0];
        if (decimalStr[1] !== '0') {
            s += digit[parseInt(decimalStr[1])] + fraction[1];
        }
    } else {
        s = '整';
    }
    
    // 处理整数部分
    const integerPart = Math.floor(n);
    if (integerPart > 0) {
        let integerStr = integerPart.toString();
        const length = integerStr.length;
        
        for (let i = 0; i < length; i++) {
            const pos = length - i - 1;
            const unitPos = pos % 4;
            const currDigit = parseInt(integerStr[i]);
            
            if (currDigit !== 0) {
                if (i > 0 && integerStr[i-1] === '0') {
                    s = '零' + s;
                }
                s = digit[currDigit] + unit[1][unitPos] + s;
            } else {
                if (unitPos === 0 && pos > 0) {
                    // 处理万亿等
                    if (integerStr[i-1] !== '0') {
                        s = unit[0][Math.floor(pos / 4)] + s;
                    }
                } else if (i > 0 && integerStr[i-1] !== '0' && unitPos !== 0) {
                    s = '零' + s;
                }
            }
            
            if (unitPos === 0 && pos > 0) {
                if (parseInt(integerStr.substr(Math.max(0, i - unitPos), unitPos + 1)) > 0) {
                    s = unit[0][Math.floor(pos / 4)] + s;
                }
            }
        }
    } else {
        s = '零' + s;
    }
    
    return head + s;
}

/**
 * 向报价单添加自定义项目
 * @param {Object} quotation - 报价单对象
 * @param {Object} itemData - 项目数据
 * @returns {Object} 更新后的报价单
 */
export function addCustomItemToQuotation(quotation, itemData) {
    if (!quotation || !quotation.items) {
        throw new Error('无效的报价单数据');
    }
    
    if (!itemData || !itemData.name) {
        throw new Error('无效的项目数据');
    }
    
    // 创建新的报价单副本
    const updatedQuotation = {
        ...quotation,
        items: [...quotation.items]
    };
    
    // 创建新项目
    const newItemId = Math.max(...updatedQuotation.items.map(item => item.id), 0) + 1;
    
    const newItem = {
        id: newItemId,
        name: itemData.name,
        model: itemData.model || '-',
        quantity: parseFloat(itemData.quantity) || 1,
        unit: itemData.unit || '项',
        prices: {
            factory: parseFloat(itemData.factoryPrice) || 0,
            package: parseFloat(itemData.packagePrice) || 0,
            market: parseFloat(itemData.marketPrice) || parseFloat(itemData.price) || 0
        },
        selectedPrice: 'market',
        get unitPrice() {
            return this.prices[this.selectedPrice] || 0;
        },
        get amount() {
            return this.unitPrice * this.quantity;
        },
        remarks: itemData.remarks || ''
    };
    
    // 添加新项目
    updatedQuotation.items.push(newItem);
    
    // 更新总金额
    if (!updatedQuotation.usingSpecialPackagePrice) {
        // 如果不是使用特殊打包价格，则累加新项目金额
        updatedQuotation.originalAmount += newItem.amount;
    }
    
    // 重新计算折扣和税额
    if (updatedQuotation.discountPercentage > 0) {
        updatedQuotation.discountAmount = Math.round(updatedQuotation.originalAmount * (updatedQuotation.discountPercentage / 100));
        updatedQuotation.totalAmount = updatedQuotation.originalAmount - updatedQuotation.discountAmount;
    } else {
        updatedQuotation.totalAmount = updatedQuotation.originalAmount;
    }
    
    // 更新中文大写金额
    updatedQuotation.totalAmountInChinese = numberToChinese(updatedQuotation.totalAmount);
    
    // 更新税额
    if (updatedQuotation.taxRate > 0) {
        updatedQuotation.taxAmount = Math.round(updatedQuotation.totalAmount * (updatedQuotation.taxRate / 100));
        updatedQuotation.taxIncludedAmount = updatedQuotation.totalAmount + updatedQuotation.taxAmount;
    }
    
    return updatedQuotation;
}

/**
 * 从报价单中移除项目
 * @param {Object} quotation - 报价单对象
 * @param {number} itemId - 要移除的项目ID
 * @returns {Object} 更新后的报价单
 */
export function removeItemFromQuotation(quotation, itemId) {
    if (!quotation || !quotation.items) {
        throw new Error('无效的报价单数据');
    }
    
    // 查找要移除的项目
    const itemIndex = quotation.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        throw new Error(`未找到ID为 ${itemId} 的项目`);
    }
    
    // 获取项目信息
    const item = quotation.items[itemIndex];
    
    // 如果是主要项目（如齿轮箱），不允许删除
    if (item.name === "船用齿轮箱" && quotation.items.length > 1) {
        throw new Error('不能删除齿轮箱主项目');
    }
    
    // 创建新的报价单副本
    const updatedQuotation = {
        ...quotation,
        items: [...quotation.items]
    };
    
    // 移除项目
    updatedQuotation.items.splice(itemIndex, 1);
    
    // 更新总金额
    if (!updatedQuotation.usingSpecialPackagePrice) {
        // 如果不是使用特殊打包价格，则减去移除项目金额
        updatedQuotation.originalAmount -= item.amount;
    }
    
    // 确保总金额不小于0
    updatedQuotation.originalAmount = Math.max(0, updatedQuotation.originalAmount);
    
    // 重新计算折扣和税额
    if (updatedQuotation.discountPercentage > 0) {
        updatedQuotation.discountAmount = Math.round(updatedQuotation.originalAmount * (updatedQuotation.discountPercentage / 100));
        updatedQuotation.totalAmount = updatedQuotation.originalAmount - updatedQuotation.discountAmount;
    } else {
        updatedQuotation.totalAmount = updatedQuotation.originalAmount;
    }
    
    // 更新中文大写金额
    updatedQuotation.totalAmountInChinese = numberToChinese(updatedQuotation.totalAmount);
    
    // 更新税额
    if (updatedQuotation.taxRate > 0) {
        updatedQuotation.taxAmount = Math.round(updatedQuotation.totalAmount * (updatedQuotation.taxRate / 100));
        updatedQuotation.taxIncludedAmount = updatedQuotation.totalAmount + updatedQuotation.taxAmount;
    }
    
    return updatedQuotation;
}

/**
 * 导出报价单为Excel文件
 * @param {Object} quotation - 报价单对象
 * @param {string} filename - 文件名（不含扩展名）
 */
export function exportQuotationToExcel(quotation, filename = '报价单') {
    if (!quotation || !quotation.items) {
        throw new Error('无效的报价单数据');
    }
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建标题行和报价单基本信息
    const headerRows = [
        ['报价单'],
        ['报价单号', quotation.quotationNumber],
        ['日期', quotation.date],
        ['有效期至', quotation.expiryDate],
        [],
        ['客户信息'],
        ['客户名称', quotation.customerInfo.name],
        ['联系人', quotation.customerInfo.contactPerson],
        ['联系电话', quotation.customerInfo.phone],
        ['地址', quotation.customerInfo.address],
        [],
        ['供方信息'],
        ['公司名称', quotation.sellerInfo.name],
        ['地址', quotation.sellerInfo.address],
        ['电话', quotation.sellerInfo.phone],
        ['开户行', quotation.sellerInfo.bank],
        ['账号', quotation.sellerInfo.account],
        [],
        ['报价明细'],
        ['序号', '名称', '型号', '数量', '单位', '单价(元)', '金额(元)', '备注']
    ];
    
    // 添加项目行
    const itemRows = quotation.items.map((item, index) => [
        index + 1,
        item.name,
        item.model,
        item.quantity,
        item.unit,
        item.unitPrice,
        item.amount,
        item.remarks
    ]);
    
    // 添加总计行
    const totalRows = [];
    
    if (quotation.discountAmount > 0 || quotation.taxAmount > 0) {
        totalRows.push(['', '', '', '', '', '小计:', quotation.originalAmount, '']);
    }
    
    if (quotation.discountAmount > 0) {
        totalRows.push(['', '', '', '', '', `折扣 (${quotation.discountPercentage}%):`, -quotation.discountAmount, '']);
    }
    
    totalRows.push(['', '', '', '', '', '总计:', quotation.totalAmount, '']);
    
    if (quotation.taxAmount > 0) {
        totalRows.push(['', '', '', '', '', `增值税 (${quotation.taxRate}%):`, quotation.taxAmount, '']);
        totalRows.push(['', '', '', '', '', '含税总计:', quotation.taxIncludedAmount, '']);
    }
    
    // 添加备注信息
    const footerRows = [
        [],
        ['合计人民币(大写):', quotation.totalAmountInChinese],
        [],
        ['付款条件:', quotation.paymentTerms],
        ['交货时间:', quotation.deliveryTime],
        ['其他说明:', quotation.notes]
    ];
    
    // 合并所有行
    const allRows = [...headerRows, ...itemRows, ...totalRows, ...footerRows];
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    
    // 设置列宽
    const cols = [
        { wch: 8 },  // 序号
        { wch: 15 }, // 名称
        { wch: 15 }, // 型号
        { wch: 8 },  // 数量
        { wch: 8 },  // 单位
        { wch: 12 }, // 单价
        { wch: 12 }, // 金额
        { wch: 25 }  // 备注
    ];
    ws['!cols'] = cols;
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '报价单');
    
    // 导出工作簿
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * 导出报价单为PDF文件
 * @param {Object} quotation - 报价单对象
 * @param {string} filename - 文件名（不含扩展名）
 */
export function exportQuotationToPDF(quotation, filename = '报价单') {
    if (!quotation || !quotation.items) {
        throw new Error('无效的报价单数据');
    }
    
    // 创建PDF文档
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // 设置字体
    doc.setFont('helvetica', 'normal');
    
    // 标题
    doc.setFontSize(20);
    doc.text('报价单', 105, 20, { align: 'center' });
    
    // 报价单基本信息
    doc.setFontSize(10);
    doc.text(`报价单号：${quotation.quotationNumber} | 日期：${quotation.date} | 有效期至：${quotation.expiryDate}`, 105, 28, { align: 'center' });
    
    // 客户信息
    doc.setFontSize(12);
    doc.text('客户信息', 14, 40);
    doc.setFontSize(10);
    doc.text(`客户名称：${quotation.customerInfo.name}`, 14, 46);
    if (quotation.customerInfo.contactPerson) {
        doc.text(`联系人：${quotation.customerInfo.contactPerson}`, 14, 52);
    }
    if (quotation.customerInfo.phone) {
        doc.text(`联系电话：${quotation.customerInfo.phone}`, 14, 58);
    }
    if (quotation.customerInfo.address) {
        doc.text(`地址：${quotation.customerInfo.address}`, 14, 64);
    }
    
    // 供方信息
    doc.setFontSize(12);
    doc.text('供方信息', 110, 40);
    doc.setFontSize(10);
    doc.text(`公司名称：${quotation.sellerInfo.name}`, 110, 46);
    doc.text(`地址：${quotation.sellerInfo.address}`, 110, 52);
    doc.text(`电话：${quotation.sellerInfo.phone}`, 110, 58);
    doc.text(`开户行：${quotation.sellerInfo.bank}`, 110, 64);
    doc.text(`账号：${quotation.sellerInfo.account}`, 110, 70);
    
    // 报价明细
    doc.setFontSize(12);
    doc.text('报价明细', 14, 80);
    
    // 表格头部
    const headers = [['序号', '名称', '型号', '数量', '单位', '单价(元)', '金额(元)', '备注']];
    
    // 表格数据
    const data = quotation.items.map((item, index) => [
        index + 1,
        item.name,
        item.model,
        item.quantity,
        item.unit,
        typeof item.unitPrice === 'number' ? item.unitPrice.toLocaleString() : item.unitPrice,
        typeof item.amount === 'number' ? item.amount.toLocaleString() : item.amount,
        item.remarks
    ]);
    
    // 添加小计等数据
    if (quotation.discountAmount > 0 || quotation.taxAmount > 0) {
        data.push(['', '', '', '', '', '小计:', quotation.originalAmount.toLocaleString(), '']);
    }
    
    if (quotation.discountAmount > 0) {
        data.push(['', '', '', '', '', `折扣 (${quotation.discountPercentage}%):`, (-quotation.discountAmount).toLocaleString(), '']);
    }
    
    data.push(['', '', '', '', '', '总计:', quotation.totalAmount.toLocaleString(), '']);
    
    if (quotation.taxAmount > 0) {
        data.push(['', '', '', '', '', `增值税 (${quotation.taxRate}%):`, quotation.taxAmount.toLocaleString(), '']);
        data.push(['', '', '', '', '', '含税总计:', quotation.taxIncludedAmount.toLocaleString(), '']);
    }
    
    // 绘制表格
    doc.autoTable({
        head: headers,
        body: data,
        startY: 85,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 10 },  // 序号
            1: { cellWidth: 25 },  // 名称
            2: { cellWidth: 25 },  // 型号
            3: { cellWidth: 10 },  // 数量
            4: { cellWidth: 10 },  // 单位
            5: { cellWidth: 20 },  // 单价
            6: { cellWidth: 25 },  // 金额
            7: { cellWidth: 'auto' } // 备注
        },
        headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        }
    });
    
    // 表格结束后的Y坐标
    const finalY = doc.lastAutoTable.finalY || 180;
    
    // 大写金额
    doc.setFontSize(10);
    doc.text(`合计人民币(大写)：${quotation.totalAmountInChinese}`, 14, finalY + 10);
    
    // 报价说明
    doc.setFontSize(12);
    doc.text('报价说明', 14, finalY + 25);
    
    doc.setFontSize(10);
    doc.text(`付款条件：${quotation.paymentTerms}`, 14, finalY + 32);
    doc.text(`交货时间：${quotation.deliveryTime}`, 14, finalY + 39);
    doc.text(`其他说明：${quotation.notes}`, 14, finalY + 46);
    
    // 保存PDF
    doc.save(`${filename}.pdf`);
}

/**
 * 创建报价单预览HTML内容
 * @param {Object} quotation - 报价单对象
 * @returns {string} HTML内容
 */
export function createQuotationPreview(quotation) {
    if (!quotation || !quotation.items) {
        return '<div class="alert alert-warning">无效的报价单数据</div>';
    }
    
    // 格式化金额显示
    const formatCurrency = (amount) => {
        if (typeof amount === 'string') return amount;
        if (typeof amount !== 'number') return '-';
        
        return amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    
    // HTML模板
    const html = `
    <div class="quotation-preview-content">
        <!-- 报价单标题 -->
        <div class="text-center p-4" style="border-bottom: 1px solid #ddd;">
            <h3>报 价 单</h3>
            <div class="small text-muted mt-1">报价单号：${quotation.quotationNumber} | 日期：${quotation.date} | 有效期至：${quotation.expiryDate}</div>
        </div>
        
        <!-- 基本信息 -->
        <div class="row mx-0 p-3" style="border-bottom: 1px solid #ddd;">
            <div class="col-md-6">
                <h6>客户信息</h6>
                <table class="table table-sm table-borderless">
                    <tbody>
                        <tr>
                            <td width="30%">客户名称：</td>
                            <td>${quotation.customerInfo.name}</td>
                        </tr>
                        ${quotation.customerInfo.contactPerson ? `
                        <tr>
                            <td>联系人：</td>
                            <td>${quotation.customerInfo.contactPerson}</td>
                        </tr>
                        ` : ''}
                        ${quotation.customerInfo.phone ? `
                        <tr>
                            <td>联系电话：</td>
                            <td>${quotation.customerInfo.phone}</td>
                        </tr>
                        ` : ''}
                        ${quotation.customerInfo.address ? `
                        <tr>
                            <td>地址：</td>
                            <td>${quotation.customerInfo.address}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
            <div class="col-md-6">
                <h6>供方信息</h6>
                <table class="table table-sm table-borderless">
                    <tbody>
                        <tr>
                            <td width="30%">公司名称：</td>
                            <td>${quotation.sellerInfo.name}</td>
                        </tr>
                        <tr>
                            <td>地址：</td>
                            <td>${quotation.sellerInfo.address}</td>
                        </tr>
                        <tr>
                            <td>电话：</td>
                            <td>${quotation.sellerInfo.phone}</td>
                        </tr>
                        <tr>
                            <td>开户行：</td>
                            <td>${quotation.sellerInfo.bank}</td>
                        </tr>
                        <tr>
                            <td>账号：</td>
                            <td>${quotation.sellerInfo.account}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        ${quotation.usingSpecialPackagePrice ? `
        <!-- 特殊打包价格提示 -->
        <div class="mx-3 mt-3">
            <div class="alert alert-info">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>特别说明：</strong> 本报价采用GW系列市场常规打包价格。
            </div>
        </div>
        ` : ''}
        
        ${!quotation.usingSpecialPackagePrice && (quotation.options?.includeCouplingInGearbox || (quotation.options?.includePumpInGearbox && quotation.options?.needsPump)) ? `
        <!-- 配件包含提示 -->
        <div class="mx-3 mt-3">
            <div class="alert alert-info">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>配件说明：</strong>
                ${quotation.options?.includeCouplingInGearbox ? '<span>联轴器价格已包含在齿轮箱价格中。</span>' : ''}
                ${quotation.options?.includeCouplingInGearbox && quotation.options?.includePumpInGearbox && quotation.options?.needsPump ? '<span> </span>' : ''}
                ${quotation.options?.includePumpInGearbox && quotation.options?.needsPump ? '<span>备用泵价格已包含在齿轮箱价格中。</span>' : ''}
            </div>
        </div>
        ` : ''}
        
        ${quotation.options && !quotation.options.needsPump ? `
        <!-- 备用泵需求提示 -->
        <div class="mx-3 mt-3">
            <div class="alert alert-info">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>备用泵需求说明：</strong> 该齿轮箱型号 (${quotation.selectedComponents.gearbox.model}) 不需要配备备用泵。
            </div>
        </div>
        ` : ''}
        
        <!-- 报价明细 -->
        <div class="p-3">
            <h6>报价明细</h6>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th class="text-center">序号</th>
                            <th>名称</th>
                            <th>型号</th>
                            <th class="text-center">数量</th>
                            <th class="text-center">单位</th>
                            <th class="text-end">单价(元)</th>
                            <th class="text-end">金额(元)</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quotation.items.map((item, index) => `
                        <tr ${quotation.usingSpecialPackagePrice && item.name === "船用齿轮箱" ? 'class="table-info"' : ''}>
                            <td class="text-center">${index + 1}</td>
                            <td>
                                ${item.name}
                                ${quotation.options?.includeCouplingInGearbox && item.name === "船用齿轮箱" ? 
                                '<span class="badge bg-info ms-1">含联轴器</span>' : ''}
                                ${quotation.options?.includePumpInGearbox && quotation.options?.needsPump && item.name === "船用齿轮箱" ? 
                                '<span class="badge bg-info ms-1">含备用泵</span>' : ''}
                            </td>
                            <td>${item.model}</td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-center">${item.unit}</td>
                            <td class="text-end">${formatCurrency(item.unitPrice)}</td>
                            <td class="text-end">${formatCurrency(item.amount)}</td>
                            <td>${item.remarks}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        ${(quotation.discountAmount > 0 || quotation.taxAmount > 0) ? `
                        <!-- 小计行 -->
                        <tr>
                            <td colspan="6" class="text-end"><strong>小计：</strong></td>
                            <td class="text-end">${formatCurrency(quotation.originalAmount)}</td>
                            <td></td>
                        </tr>
                        ` : ''}
                        
                        ${quotation.discountAmount > 0 ? `
                        <!-- 折扣行 -->
                        <tr>
                            <td colspan="6" class="text-end">折扣 (${quotation.discountPercentage}%)：</td>
                            <td class="text-end">-${formatCurrency(quotation.discountAmount)}</td>
                            <td></td>
                        </tr>
                        ` : ''}
                        
                        <!-- 总计行 -->
                        <tr>
                            <td colspan="6" class="text-end"><strong>总计：</strong></td>
                            <td class="text-end"><strong>${formatCurrency(quotation.totalAmount)}</strong></td>
                            <td></td>
                        </tr>
                        
                        ${quotation.taxAmount > 0 ? `
                        <!-- 税额行 -->
                        <tr>
                            <td colspan="6" class="text-end">增值税 (${quotation.taxRate}%)：</td>
                            <td class="text-end">${formatCurrency(quotation.taxAmount)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-end"><strong>含税总计：</strong></td>
                            <td class="text-end"><strong>${formatCurrency(quotation.taxIncludedAmount)}</strong></td>
                            <td></td>
                        </tr>
                        ` : ''}
                    </tfoot>
                </table>
            </div>
            
            <!-- 大写金额 -->
            <div class="mt-3 mb-4">
                <strong>合计人民币(大写)：</strong> ${quotation.totalAmountInChinese}
            </div>
            
            <!-- 报价说明 -->
            <div class="mt-4">
                <h6>报价说明</h6>
                <table class="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td width="20%">付款条件：</td>
                            <td>${quotation.paymentTerms}</td>
                        </tr>
                        <tr>
                            <td>交货时间：</td>
                            <td>${quotation.deliveryTime}</td>
                        </tr>
                        <tr>
                            <td>其他说明：</td>
                            <td>${quotation.notes}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            ${quotation.options ? `
            <!-- 显示选项说明 -->
            <div class="mt-3 small text-muted">
                <p>
                    报价单配置：
                    ${quotation.options.showCouplingPrice ? '联轴器单独显示' : '联轴器包含在齿轮箱中'} | 
                    ${quotation.options.needsPump ? (quotation.options.showPumpPrice ? '备用泵单独显示' : '备用泵包含在齿轮箱中') : '不需要备用泵'} | 
                    税率: ${quotation.options.taxRate}% | 
                    折扣: ${quotation.options.discountPercentage}% | 
                    有效期: ${quotation.options.validityDays}天
                </p>
            </div>
            ` : ''}
        </div>
    </div>
    `;
    
    return html;
}