// utils/quotationGenerator.js - 修正版本
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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
    if (selectedComponents?.gearbox && typeof selectedComponents.gearbox.model === 'string') {
        const isGWSeries = selectedComponents.gearbox.model.toUpperCase().includes('GW');
        if (!isGWSeries && options.autoSetPriceOption !== false) {
            // 非GW系列默认包含配件价格
            finalOptions.showCouplingPrice = false;
            finalOptions.showPumpPrice = false;
            console.log("非GW系列齿轮箱，默认包含配件价格");
        }
    }
    
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
            }
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
    
    // 检查是否需要将配件价格包含在齿轮箱中
    const includeCouplingInGearbox = !finalOptions.showCouplingPrice && selectedComponents.coupling;
    const includePumpInGearbox = !finalOptions.showPumpPrice && selectedComponents.pump;
    
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
    let gearboxMarketPrice = typeof gearboxPrices.marketPrice === 'number' ? gearboxPrices.marketPrice : 0;
    let gearboxFactoryPrice = typeof gearboxPrices.factoryPrice === 'number' ? gearboxPrices.factoryPrice : 0;
    let gearboxPackagePrice = typeof gearboxPrices.packagePrice === 'number' ? gearboxPrices.packagePrice : 0;
    
    // 如果包含配件价格，则增加齿轮箱价格
    if (includedAccessoriesPrice > 0) {
        gearboxMarketPrice += includedAccessoriesPrice;
        gearboxFactoryPrice += includedAccessoriesPrice * 0.88; // 估算工厂价
        gearboxPackagePrice += includedAccessoriesPrice * 0.88; // 估算包装价
    }
    
    // 生成齿轮箱项目
    let gearboxRemarks = `速比: ${gearbox.ratio?.toFixed(2) ?? gearbox.selectedRatio?.toFixed(2) ?? 'N/A'}`;
    
    // 如果包含配件价格，在备注中注明
    if (includeCouplingInGearbox || includePumpInGearbox) {
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
        remarks: gearboxRemarks
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

    // 添加备用泵（如果显示单独价格）
    if (selectedComponents.pump && finalOptions.showPumpPrice) {
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
    } else if (selectedComponents.pump && !finalOptions.showPumpPrice) {
        console.log("备用泵价格已包含在齿轮箱中，不单独显示");
    } else {
        console.log("备用泵组件不存在，已跳过");
    }

    // 添加额外服务项目
    // 1. 运输服务
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
        calculatedTotalAmount += deliveryItem.amount;
    }

    // 2. 安装调试服务
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
        calculatedTotalAmount += installationItem.amount;
    }

    // 应用折扣
    let finalTotalAmount = calculatedTotalAmount;
    let discountAmount = 0;
    if (finalOptions.discountPercentage > 0) {
        discountAmount = calculatedTotalAmount * (finalOptions.discountPercentage / 100);
        finalTotalAmount = calculatedTotalAmount - discountAmount;
    }

    // 计算含税金额
    let taxAmount = 0;
    let taxIncludedAmount = finalTotalAmount;
    if (finalOptions.taxRate > 0) {
        taxAmount = finalTotalAmount * (finalOptions.taxRate / 100);
        taxIncludedAmount = finalTotalAmount + taxAmount;
    }
    
    // 生成人民币大写金额
    function numberToChinese(num) {
        if (isNaN(num)) return '零元整';
        
        const fraction = ['角', '分'];
        const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        
        const head = num < 0 ? '负' : '';
        num = Math.abs(num);
        
        let s = '';
        
        for (let i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        
        s = s || '整';
        num = Math.floor(num);
        
        for (let i = 0; i < unit[0].length && num > 0; i++) {
            let p = '';
            for (let j = 0; j < unit[1].length && num > 0; j++) {
                p = digit[num % 10] + unit[1][j] + p;
                num = Math.floor(num / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }

    // 生成最终的报价单对象
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
        totalAmount: finalTotalAmount,
        originalAmount: calculatedTotalAmount,
        discountAmount,
        discountPercentage: finalOptions.discountPercentage,
        taxRate: finalOptions.taxRate,
        taxAmount,
        taxIncludedAmount,
        totalAmountInChinese: numberToChinese(finalTotalAmount),
        priceType: 'market', // Default price type
        paymentTerms: finalOptions.paymentTerms,
        deliveryTime: finalOptions.deliveryTime,
        notes: `此报价有效期${finalOptions.validityDays}天。价格含标准包装，不含运费保险。最终解释权归供方。`,
        summary: {
            packagePrice: priceInfo.packagePrice,
            marketPrice: priceInfo.marketPrice,
            totalMarketPrice: priceInfo.totalMarketPrice
        },
        options: finalOptions // 保存配置选项，以便后续处理
    };
    
    console.log("生成的报价单摘要:", {
        success: result.success,
        itemCount: result.items.length,
        totalAmount: result.totalAmount,
        includesCoupling: finalOptions.showCouplingPrice && result.items.some(item => item.name === "高弹性联轴器"),
        includesPump: finalOptions.showPumpPrice && result.items.some(item => item.name === "备用泵"),
        includedInGearbox: !finalOptions.showCouplingPrice || !finalOptions.showPumpPrice
    });
    
    return result;
};

/**
 * 创建报价单预览HTML
 * @param {Object} quotation - 报价单数据
 * @returns {HTMLElement} - 报价单预览元素
 */
export const createQuotationPreview = (quotation) => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.fontFamily = '"Microsoft YaHei", SimSun, Arial, sans-serif';
    container.style.boxSizing = 'border-box';
    container.style.color = '#333';
    container.style.padding = '40px 60px'; // 增加整体内边距
    container.className = 'quotation-preview-content';

    // 页眉 - 公司信息
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '40px'; // 增加页眉底部间距
    header.innerHTML = `
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">上海前进齿轮经营有限公司</div>
        <div style="font-size: 14px; color: #333;">
            地址：上海市浦东新区浦东大道2123号3B-1室<br>
            电话：021-58208956
        </div>
    `;
    container.appendChild(header);

    // 标题
    const title = document.createElement('div');
    title.style.textAlign = 'center';
    title.style.marginBottom = '40px'; // 增加标题底部间距
    title.innerHTML = `
        <div style="font-size: 28px; font-weight: bold;">报 价 单</div>
    `;
    container.appendChild(title);

    // 基本信息
    const info = document.createElement('div');
    info.style.marginBottom = '30px';
    info.style.display = 'flex';
    info.style.justifyContent = 'space-between';
    info.style.fontSize = '14px';
    info.style.lineHeight = '1.8';
    info.style.padding = '0 20px'; // 增加基本信息两侧内边距
    info.innerHTML = `
        <div>
            <div style="margin-bottom: 10px">报价单号：${quotation.quotationNumber}</div>
            <div>客户名称：${quotation.customerInfo.name}</div>
        </div>
        <div style="text-align: right">
            <div style="margin-bottom: 10px">日期：${quotation.date}</div>
            <div>有效期至：${quotation.expiryDate}</div>
        </div>
    `;
    container.appendChild(info);

    // 表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '40px'; // 增加表格底部间距
    table.style.fontSize = '12px';
    table.style.textAlign = 'left';
    
    // 表头
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background: #f8f8f8;">
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">序号</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">名称</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">型号</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">数量</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">单位</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">单价(元)</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; white-space: nowrap;">金额(元)</th>
            <th style="border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold;">备注</th>
        </tr>
    `;
    table.appendChild(thead);

    // 表体
    const tbody = document.createElement('tbody');
    quotation.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        const formatNumber = (num) => {
            if (typeof num === 'number') {
                return num.toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            return num || '';
        };

        tr.innerHTML = `
            <td style="border: 1px solid #000; padding: 10px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #000; padding: 10px;">${item.name || ''}</td>
            <td style="border: 1px solid #000; padding: 10px;">${item.model || ''}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center;">${item.quantity || ''}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: center;">${item.unit || ''}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: right;">${formatNumber(item.unitPrice)}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: right;">${formatNumber(item.amount)}</td>
            <td style="border: 1px solid #000; padding: 10px;">${item.remarks || ''}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // 添加合计行
    const tfoot = document.createElement('tfoot');
    
    // 小计行
    if (quotation.discountAmount > 0 || quotation.taxAmount > 0) {
        tfoot.innerHTML += `
            <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold;">小计：</td>
                <td style="border: 1px solid #000; padding: 10px; text-align: right;">¥${quotation.originalAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                <td style="border: 1px solid #000; padding: 10px;"></td>
            </tr>
        `;
    }
    
    // 折扣行
    if (quotation.discountAmount > 0) {
        tfoot.innerHTML += `
            <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 10px; text-align: right;">折扣 (${quotation.discountPercentage}%)：</td>
                <td style="border: 1px solid #000; padding: 10px; text-align: right;">-¥${quotation.discountAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                <td style="border: 1px solid #000; padding: 10px;"></td>
            </tr>
        `;
    }
    
    // 不含税合计行
    tfoot.innerHTML += `
        <tr>
            <td colspan="6" style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold;">不含税总计：</td>
            <td style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold;">¥${quotation.totalAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
            <td style="border: 1px solid #000; padding: 10px;"></td>
        </tr>
    `;
    
    // 税额行
    if (quotation.taxAmount > 0) {
        tfoot.innerHTML += `
            <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 10px; text-align: right;">增值税 (${quotation.taxRate}%)：</td>
                <td style="border: 1px solid #000; padding: 10px; text-align: right;">¥${quotation.taxAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                <td style="border: 1px solid #000; padding: 10px;"></td>
            </tr>
            <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold;">含税总计：</td>
                <td style="border: 1px solid #000; padding: 10px; text-align: right; font-weight: bold;">¥${quotation.taxIncludedAmount?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                <td style="border: 1px solid #000; padding: 10px;"></td>
            </tr>
        `;
    }
    
    table.appendChild(tfoot);
    container.appendChild(table);

    // 大写金额
    const amountInChinese = document.createElement('div');
    amountInChinese.style.marginBottom = '20px';
    amountInChinese.style.fontSize = '14px';
    amountInChinese.style.fontWeight = 'bold';
    amountInChinese.innerHTML = `
        <div>合计人民币(大写)：${quotation.totalAmountInChinese || ''}</div>
    `;
    container.appendChild(amountInChinese);

    // 说明事项
    const notes = document.createElement('div');
    notes.style.marginBottom = '40px';
    notes.style.fontSize = '14px';
    notes.style.lineHeight = '1.8';
    notes.style.padding = '0 20px'; // 增加说明事项两侧内边距
    notes.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 15px;">说明事项：</div>
        <div style="line-height: 2;">
            <p style="margin: 8px 0;">1. ${quotation.paymentTerms || '合同签订后支付30%预付款，发货前付清全款。'}</p>
            <p style="margin: 8px 0;">2. ${quotation.deliveryTime || '合同签订生效后3个月内发货。'}</p>
            <p style="margin: 8px 0;">3. ${quotation.notes || '此报价有效期30天。价格含标准包装，不含运费保险。最终解释权归供方。'}</p>
        </div>
    `;
    container.appendChild(notes);

    // 供方信息
    const seller = document.createElement('div');
    seller.style.marginBottom = '50px';
    seller.style.fontSize = '14px';
    seller.style.lineHeight = '1.8';
    seller.style.padding = '0 20px'; // 增加供方信息两侧内边距
    seller.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 15px;">供方信息：</div>
        <div style="line-height: 2;">
            <p style="margin: 8px 0;">公司名称：${quotation.sellerInfo.name}</p>
            <p style="margin: 8px 0;">地址：${quotation.sellerInfo.address}</p>
            <p style="margin: 8px 0;">电话：${quotation.sellerInfo.phone}</p>
            <p style="margin: 8px 0;">开户行：${quotation.sellerInfo.bank}</p>
            <p style="margin: 8px 0;">账号：${quotation.sellerInfo.account}</p>
        </div>
    `;
    container.appendChild(seller);

    // 签章区域
    const signature = document.createElement('div');
    signature.style.marginTop = '50px';
    signature.style.display = 'flex';
    signature.style.justifyContent = 'flex-end';
    signature.style.fontSize = '14px';
    signature.style.lineHeight = '1.8';
    signature.style.padding = '0 40px'; // 增加签章区域右侧内边距
    signature.innerHTML = `
        <div style="text-align: center;">
            <p style="margin-bottom: 70px;">供方盖章：</p>
            <p>日期：${quotation.date}</p>
        </div>
    `;
    container.appendChild(signature);

    return container;
};

/**
 * 导出报价单为Excel
 * @param {Object} quotation - 报价单数据
 * @param {string} filename - 文件名
 */
export const exportQuotationToExcel = (quotation, filename = '报价单') => {
    try {
        if (!quotation || !quotation.success) {
            throw new Error('无效的报价单数据');
        }

        // 创建工作簿
        const workbook = XLSX.utils.book_new();
        
        // 1. 报价单信息工作表
        const infoData = [
            ['报价单号', quotation.quotationNumber],
            ['日期', quotation.date],
            ['有效期至', quotation.expiryDate],
            [''],
            ['客户信息', ''],
            ['客户名称', quotation.customerInfo.name],
            ['联系人', quotation.customerInfo.contactPerson || ''],
            ['联系电话', quotation.customerInfo.phone || ''],
            ['客户地址', quotation.customerInfo.address || ''],
            [''],
            ['供方信息', ''],
            ['公司名称', quotation.sellerInfo.name],
            ['地址', quotation.sellerInfo.address],
            ['电话', quotation.sellerInfo.phone],
            ['开户行', quotation.sellerInfo.bank],
            ['账号', quotation.sellerInfo.account]
        ];
        
        const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
        XLSX.utils.book_append_sheet(workbook, infoSheet, '报价单信息');
        
        // 设置列宽
        infoSheet['!cols'] = [
            { wch: 15 },  // 第一列宽度
            { wch: 40 }   // 第二列宽度
        ];
        
        // 2. 报价明细工作表
        const itemsHeaders = ['序号', '产品名称', '型号', '数量', '单位', '单价(元)', '金额(元)', '备注'];
        
        // 添加所有项目
        const itemsData = quotation.items.map((item, index) => {
            const unitPrice = typeof item.unitPrice === 'string' ? item.unitPrice : 
                             (typeof item.unitPrice === 'number' ? item.unitPrice : 0);
            const amount = typeof item.amount === 'string' ? item.amount : 
                          (typeof item.amount === 'number' ? item.amount : 0);
            
            return [
                index + 1,
                item.name || '',
                item.model || '',
                item.quantity,
                item.unit || '',
                unitPrice,
                amount,
                item.remarks || ''
            ];
        });
        
        // 添加小计行
        if (quotation.discountAmount > 0 || quotation.taxAmount > 0) {
            itemsData.push([
                '',
                '',
                '',
                '',
                '',
                '小计',
                quotation.originalAmount || 0,
                ''
            ]);
        }
        
        // 添加折扣行
        if (quotation.discountAmount > 0) {
            itemsData.push([
                '',
                '',
                '',
                '',
                '',
                `折扣 (${quotation.discountPercentage}%)`,
                -quotation.discountAmount || 0,
                ''
            ]);
        }
        
        // 添加不含税合计行
        itemsData.push([
            '',
            '',
            '',
            '',
            '',
            '不含税总计',
            quotation.totalAmount || 0,
            ''
        ]);
        
        // 添加税额行
        if (quotation.taxAmount > 0) {
            itemsData.push([
                '',
                '',
                '',
                '',
                '',
                `增值税 (${quotation.taxRate}%)`,
                quotation.taxAmount || 0,
                ''
            ]);
            
            itemsData.push([
                '',
                '',
                '',
                '',
                '',
                '含税总计',
                quotation.taxIncludedAmount || 0,
                ''
            ]);
        }
        
        const itemsSheet = XLSX.utils.aoa_to_sheet([itemsHeaders, ...itemsData]);
        XLSX.utils.book_append_sheet(workbook, itemsSheet, '报价明细');
        
        // 设置列宽
        itemsSheet['!cols'] = [
            { wch: 8 },   // 序号
            { wch: 15 },  // 产品名称
            { wch: 25 },  // 型号
            { wch: 8 },   // 数量
            { wch: 8 },   // 单位
            { wch: 15 },  // 单价
            { wch: 15 },  // 金额
            { wch: 30 }   // 备注
        ];
        
        // 3. 说明事项工作表
        const notesData = [
            ['支付条件', quotation.paymentTerms || '合同签订后支付30%预付款，发货前付清全款。'],
            ['交货期', quotation.deliveryTime || '合同签订生效后3个月内发货。'],
            ['质保期', '产品安装调试完成后12个月内'],
            [''],
            ['其他说明事项', ''],
            ['1', '此报价有效期' + (quotation.options?.validityDays || 30) + '天。'],
            ['2', '价格含标准包装，不含运费保险。'],
            ['3', '技术协议和最终合同以双方确认为准。'],
            ['4', '最终解释权归供方所有。']
        ];
        
        const notesSheet = XLSX.utils.aoa_to_sheet(notesData);
        XLSX.utils.book_append_sheet(workbook, notesSheet, '说明事项');
        
        // 设置列宽
        notesSheet['!cols'] = [
            { wch: 15 },  // 第一列宽度
            { wch: 60 }   // 第二列宽度
        ];
        
        // 导出Excel文件
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        console.log('Excel导出成功:', filename);
        return true;
    } catch (error) {
        console.error('导出Excel失败:', error);
        throw new Error('导出Excel失败: ' + error.message);
    }
};

/**
 * 导出报价单为PDF
 * @param {Object} quotation - 报价单数据
 * @param {string} filename - 文件名
 */
export const exportQuotationToPDF = async (quotation, filename = '报价单') => {
    if (!quotation || !quotation.success || !quotation.items || !quotation.sellerInfo || !quotation.customerInfo) {
        console.error('导出PDF失败: 报价单数据无效或不完整。', quotation);
        throw new Error('报价单数据无效或不完整');
    }

    try {
        // 创建预览元素
        const preview = createQuotationPreview(quotation);
        document.body.appendChild(preview);

        // 等待一小段时间确保字体加载完成
        await new Promise(resolve => setTimeout(resolve, 500));

        // 转换为图片
        const canvas = await html2canvas(preview, {
            scale: 2, // 提高清晰度
            useCORS: true,
            logging: false, // 禁用日志
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 794, // A4 宽度 (96 DPI)
            height: 1123, // A4 高度 (96 DPI)
            windowWidth: 794,
            windowHeight: 1123,
            onclone: (clonedDoc) => {
                // 确保克隆的文档中的元素样式正确
                const clonedPreview = clonedDoc.body.firstChild;
                if (clonedPreview) {
                    clonedPreview.style.transform = 'none';
                    clonedPreview.style.position = 'relative';
                }
            }
        });

        // 移除预览元素
        document.body.removeChild(preview);

        // 创建PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // 将 canvas 转换为图片
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // 添加图片到PDF（使用毫米单位）
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

        // 保存PDF
        pdf.save(`${filename}.pdf`);
        console.log('PDF导出成功');
        return true;
    } catch (error) {
        console.error('PDF导出错误:', error);
        throw error;
    }
};

/**
 * 添加自定义项目到报价单
 * @param {Object} quotation - 现有报价单数据
 * @param {Object} item - 自定义项目数据
 * @returns {Object} - 更新后的报价单数据
 */
export const addCustomItemToQuotation = (quotation, item) => {
    if (!quotation || !quotation.success || !Array.isArray(quotation.items)) {
        console.error('无法添加自定义项目: 报价单数据无效');
        throw new Error('报价单数据无效');
    }
    
    if (!item || !item.name || !item.model) {
        console.error('无法添加自定义项目: 项目数据不完整');
        throw new Error('项目数据不完整');
    }
    
    try {
        // 创建新项目对象
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
        const amount = quantity * unitPrice;
        
        const newItem = {
            id: quotation.items.length + 1,
            name: item.name,
            model: item.model,
            quantity: quantity,
            unit: item.unit || '个',
            prices: {
                factory: unitPrice * 0.85, // 估算
                package: unitPrice * 0.85, // 估算
                market: unitPrice
            },
            selectedPrice: 'market',
            get unitPrice() {
                return this.prices[this.selectedPrice] || 0;
            },
            get amount() {
                return this.unitPrice * this.quantity;
            },
            remarks: item.remarks || '自定义项目'
        };
        
        // 创建新报价单对象 (不直接修改原对象)
        const newQuotation = {
            ...quotation,
            items: [...quotation.items, newItem],
        };
        
        // 重新计算总金额
        let calculatedTotalAmount = newQuotation.items.reduce((sum, item) => {
            const itemAmount = typeof item.amount === 'number' ? item.amount : 0;
            return sum + itemAmount;
        }, 0);
        
        // 应用折扣
        let finalTotalAmount = calculatedTotalAmount;
        let discountAmount = 0;
        if (newQuotation.options?.discountPercentage > 0) {
            discountAmount = calculatedTotalAmount * (newQuotation.options.discountPercentage / 100);
            finalTotalAmount = calculatedTotalAmount - discountAmount;
        }

        // 更新总金额相关字段
        newQuotation.originalAmount = calculatedTotalAmount;
        newQuotation.discountAmount = discountAmount;
        newQuotation.totalAmount = finalTotalAmount;
        
        // 更新税额相关字段
        if (newQuotation.options?.taxRate > 0) {
            const taxAmount = finalTotalAmount * (newQuotation.options.taxRate / 100);
            newQuotation.taxAmount = taxAmount;
            newQuotation.taxIncludedAmount = finalTotalAmount + taxAmount;
        }
        
        console.log('自定义项目已添加到报价单:', newItem.name);
        return newQuotation;
    } catch (error) {
        console.error('添加自定义项目失败:', error);
        throw new Error('添加自定义项目失败: ' + error.message);
    }
};

/**
 * 从报价单中移除项目
 * @param {Object} quotation - 现有报价单数据
 * @param {number} itemId - 要移除项目的ID
 * @returns {Object} - 更新后的报价单数据
 */
export const removeItemFromQuotation = (quotation, itemId) => {
    if (!quotation || !quotation.success || !Array.isArray(quotation.items)) {
        console.error('无法移除项目: 报价单数据无效');
        throw new Error('报价单数据无效');
    }
    
    try {
        // 找到要移除的项目索引
        const itemIndex = quotation.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            console.warn(`无法找到ID为 ${itemId} 的项目`);
            return quotation;
        }
        
        // 创建新报价单对象 (不直接修改原对象)
        const newQuotation = {
            ...quotation,
            items: quotation.items.filter(item => item.id !== itemId),
        };
        
        // 重新编号和计算总金额
        newQuotation.items.forEach((item, index) => {
            item.id = index + 1;
        });
        
        // 重新计算总金额
        let calculatedTotalAmount = newQuotation.items.reduce((sum, item) => {
            const itemAmount = typeof item.amount === 'number' ? item.amount : 0;
            return sum + itemAmount;
        }, 0);
        
        // 应用折扣
        let finalTotalAmount = calculatedTotalAmount;
        let discountAmount = 0;
        if (newQuotation.options?.discountPercentage > 0) {
            discountAmount = calculatedTotalAmount * (newQuotation.options.discountPercentage / 100);
            finalTotalAmount = calculatedTotalAmount - discountAmount;
        }

        // 更新总金额相关字段
        newQuotation.originalAmount = calculatedTotalAmount;
        newQuotation.discountAmount = discountAmount;
        newQuotation.totalAmount = finalTotalAmount;
        
        // 更新税额相关字段
        if (newQuotation.options?.taxRate > 0) {
            const taxAmount = finalTotalAmount * (newQuotation.options.taxRate / 100);
            newQuotation.taxAmount = taxAmount;
            newQuotation.taxIncludedAmount = finalTotalAmount + taxAmount;
        }
        
        console.log(`已从报价单移除ID为 ${itemId} 的项目`);
        return newQuotation;
    } catch (error) {
        console.error('移除项目失败:', error);
        throw new Error('移除项目失败: ' + error.message);
    }
};