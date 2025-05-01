"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOfficialPriceTable = parseOfficialPriceTable;
exports.parseOfficialDiscountTable = parseOfficialDiscountTable;
exports.applyOfficialPrices = applyOfficialPrices;
exports.validatePricesAgainstOfficial = validatePricesAgainstOfficial;
exports.loadAndApplyOfficialPriceFile = loadAndApplyOfficialPriceFile;
exports.parseCompletePriceTableFromPDF = parseCompletePriceTableFromPDF;
exports.generateCorrectedDiscountRates = generateCorrectedDiscountRates;

// src/utils/officialPriceImporter.js

/**
 * 官方价格导入工具
 * 用于将官方价格表数据应用到程序中
 */

/**
 * 从官方价格表解析型号和价格数据
 * @param {string} priceTableText - 官方价格表文本
 * @returns {Array<Object>} 解析后的价格数据数组
 */
function parseOfficialPriceTable(priceTableText) {
  if (!priceTableText) return []; // 分割行

  var lines = priceTableText.split('\n').filter(function (line) {
    return line.trim();
  });
  var prices = [];
  lines.forEach(function (line) {
    // 跳过标题行和说明行
    if (line.includes('产品型号') || line.includes('备注') || !line.includes(' ')) {
      return;
    } // 尝试提取型号和价格


    var parts = line.trim().split(/\s+/);

    if (parts.length >= 2) {
      var model = parts[0]; // 针对特殊情况，如带有速比的型号

      if (model.includes('(') && parts.length >= 3) {
        // 假设格式是: 型号 (速比) 价格
        model = model + ' ' + parts[1];
        var price = parseFloat(parts[2]);

        if (!isNaN(price)) {
          prices.push({
            model: model.replace(/\(|\)/g, ''),
            basePrice: price
          });
        }
      } else {
        // 常规情况: 型号 价格
        var _price = parseFloat(parts[1]);

        if (!isNaN(_price)) {
          prices.push({
            model: model,
            basePrice: _price
          });
        }
      }
    }
  });
  return prices;
}
/**
 * 从官方折扣价格表解析数据
 * @param {string} discountPriceText - 官方折扣价格表文本
 * @returns {Object} 折扣率和价格映射
 */


function parseOfficialDiscountTable(discountPriceText) {
  if (!discountPriceText) return {
    discounts: {},
    prices: {}
  };
  var lines = discountPriceText.split('\n').filter(function (line) {
    return line.trim();
  });
  var result = {
    discounts: {},
    // 型号 -> 折扣率
    prices: {} // 型号 -> 折后价格

  };
  lines.forEach(function (line) {
    // 跳过标题行和说明行
    if (line.includes('产品型号') || line.includes('备注') || !line.includes(' ')) {
      return;
    } // 尝试提取型号、价格和折扣信息


    var parts = line.trim().split(/\s+/);

    if (parts.length >= 3) {
      var model = parts[0];
      var originalPrice, discountedPrice, discountDesc; // 处理带有速比信息的型号

      if (model.includes('(') && parts.length >= 4) {
        model = model + ' ' + parts[1];
        originalPrice = parseFloat(parts[2]);
        discountedPrice = parseFloat(parts[3]);
        discountDesc = parts.length >= 5 ? parts[4] : '';
      } else {
        originalPrice = parseFloat(parts[1]);
        discountedPrice = parseFloat(parts[2]);
        discountDesc = parts.length >= 4 ? parts[3] : '';
      }

      if (!isNaN(originalPrice) && !isNaN(discountedPrice)) {
        // 提取折扣率 (格式通常是"下浮XX%")
        var discountRate = 0;

        if (discountDesc && discountDesc.includes('下浮')) {
          var match = discountDesc.match(/下浮(\d+)%/);

          if (match && match[1]) {
            discountRate = parseInt(match[1], 10) / 100;
          } else {
            // 如果没有明确的下浮百分比，根据价格差计算
            discountRate = (originalPrice - discountedPrice) / originalPrice;
          }
        } else {
          // 根据价格差计算折扣率
          discountRate = (originalPrice - discountedPrice) / originalPrice;
        } // 保存到结果对象


        result.discounts[model.replace(/\(|\)/g, '')] = discountRate;
        result.prices[model.replace(/\(|\)/g, '')] = discountedPrice;
      }
    }
  });
  return result;
}
/**
 * 应用官方价格到数据库
 * @param {Object} appData - 应用程序数据
 * @param {Array<Object>} officialPrices - 官方价格数据
 * @param {Object} discountData - 折扣率和折后价格数据
 * @returns {Object} 更新后的数据
 */


function applyOfficialPrices(appData, officialPrices) {
  var discountData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!appData || !officialPrices || officialPrices.length === 0) {
    return appData;
  }

  var updatedData = JSON.parse(JSON.stringify(appData)); // 深拷贝

  var modelToPriceMap = new Map(); // 构建型号到价格的映射

  officialPrices.forEach(function (item) {
    if (item.model && !isNaN(item.basePrice)) {
      modelToPriceMap.set(item.model, item.basePrice);
    }
  }); // 更新各个集合中的价格

  var collections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'];
  var updatedItemCount = 0;
  collections.forEach(function (collectionName) {
    if (Array.isArray(updatedData[collectionName])) {
      updatedData[collectionName].forEach(function (item) {
        if (item.model && modelToPriceMap.has(item.model)) {
          // 更新基础价格
          var oldBasePrice = item.basePrice || item.price || 0;
          var newBasePrice = modelToPriceMap.get(item.model);

          if (oldBasePrice !== newBasePrice) {
            item.basePrice = newBasePrice;
            item.price = newBasePrice; // 同步更新price字段

            updatedItemCount++; // 如果有折扣数据，也更新折扣率和折后价格

            if (discountData) {
              if (discountData.discounts[item.model]) {
                item.discountRate = discountData.discounts[item.model];
              }

              if (discountData.prices[item.model]) {
                item.factoryPrice = discountData.prices[item.model];
              } else {
                // 使用默认折扣计算工厂价
                item.factoryPrice = Math.round(item.basePrice * (1 - (item.discountRate || getDefaultDiscountRate(item.model))));
              }
            } else {
              // 使用默认逻辑计算工厂价
              item.factoryPrice = Math.round(item.basePrice * (1 - (item.discountRate || getDefaultDiscountRate(item.model))));
            } // 计算市场价 (工厂价基础上加10%)


            item.marketPrice = Math.round(item.factoryPrice * 1.1);
          }
        }
      });
    }
  });
  console.log("\u5DF2\u66F4\u65B0".concat(updatedItemCount, "\u9879\u4EF7\u683C\u6570\u636E"));
  updatedData._priceUpdatedCount = updatedItemCount;
  updatedData._lastPriceUpdate = new Date().toISOString();
  return updatedData;
}
/**
 * 根据型号获取默认折扣率
 * 这个函数逻辑应与priceDiscount.js中的getDiscountRate保持一致
 * @param {string} model - 齿轮箱型号
 * @returns {number} 默认折扣率 (小数形式)
 */


function getDefaultDiscountRate(model) {
  if (!model) return 0.1; // 默认折扣率10%
  // HCM系列折扣率

  if (model.startsWith('HCM')) return 0; // HCM系列全国统一售价，无折扣
  // HC系列折扣率

  if (model.startsWith('HC')) return 0.16; // 16%折扣
  // GW系列折扣率

  if (model.startsWith('GW')) return 0.1; // 10%折扣
  // DT系列折扣率

  if (model.startsWith('DT')) return 0.12; // 12%折扣
  // HCQ系列折扣率

  if (model.startsWith('HCQ')) return 0.15; // 15%折扣
  // HGT系列联轴器折扣率

  if (model.startsWith('HGT')) return 0.1; // 10%折扣
  // PUMP系列备用泵折扣率

  if (model.startsWith('PUMP')) return 0.1; // 10%折扣
  // GC系列折扣率

  if (model.startsWith('GC')) return 0.1; // 10%折扣
  // 其他系列使用默认折扣率

  return 0.1; // 默认10%折扣
}
/**
 * 验证价格数据是否与官方价格表一致
 * @param {Object} appData - 应用程序数据
 * @param {Array<Object>} officialPrices - 官方价格数据
 * @returns {Object} 验证结果
 */


function validatePricesAgainstOfficial(appData, officialPrices) {
  if (!appData || !officialPrices || officialPrices.length === 0) {
    return {
      valid: false,
      message: '没有有效的对比数据',
      inconsistencies: []
    };
  }

  var modelToPriceMap = new Map();
  officialPrices.forEach(function (item) {
    if (item.model && !isNaN(item.basePrice)) {
      modelToPriceMap.set(item.model, item.basePrice);
    }
  });
  var inconsistencies = [];
  var collections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'];
  collections.forEach(function (collectionName) {
    if (Array.isArray(appData[collectionName])) {
      appData[collectionName].forEach(function (item) {
        if (item.model && modelToPriceMap.has(item.model)) {
          var officialPrice = modelToPriceMap.get(item.model);
          var currentPrice = item.basePrice || item.price || 0;

          if (Math.abs(currentPrice - officialPrice) > 0.1) {
            // 允许0.1元的误差
            inconsistencies.push({
              collection: collectionName,
              model: item.model,
              currentPrice: currentPrice,
              officialPrice: officialPrice,
              difference: (currentPrice - officialPrice).toFixed(2)
            });
          }
        }
      });
    }
  });
  return {
    valid: inconsistencies.length === 0,
    message: inconsistencies.length === 0 ? '所有价格与官方价格表一致' : "\u53D1\u73B0".concat(inconsistencies.length, "\u9879\u4EF7\u683C\u4E0D\u4E00\u81F4"),
    inconsistencies: inconsistencies
  };
}
/**
 * 从文本文件加载官方价格表并应用
 * @param {string} filePath - 官方价格表文件路径
 * @returns {Promise<Object>} 处理结果
 */


function loadAndApplyOfficialPriceFile(filePath) {
  var response, text, prices, appDataJson, appData, updatedData;
  return regeneratorRuntime.async(function loadAndApplyOfficialPriceFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (filePath) {
            _context.next = 3;
            break;
          }

          throw new Error('未提供文件路径');

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch(filePath));

        case 5:
          response = _context.sent;

          if (response.ok) {
            _context.next = 8;
            break;
          }

          throw new Error("\u65E0\u6CD5\u52A0\u8F7D\u6587\u4EF6: ".concat(response.status, " ").concat(response.statusText));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(response.text());

        case 10:
          text = _context.sent;
          prices = parseOfficialPriceTable(text);

          if (!(prices.length === 0)) {
            _context.next = 14;
            break;
          }

          throw new Error('解析到0个价格项，可能格式不正确');

        case 14:
          // 从本地存储中获取当前数据
          appDataJson = localStorage.getItem('appData');

          if (appDataJson) {
            _context.next = 17;
            break;
          }

          throw new Error('本地存储中未找到应用数据');

        case 17:
          appData = JSON.parse(appDataJson);
          updatedData = applyOfficialPrices(appData, prices); // 保存更新后的数据回本地存储

          localStorage.setItem('appData', JSON.stringify(updatedData));
          return _context.abrupt("return", {
            success: true,
            message: "\u5DF2\u6210\u529F\u5E94\u7528\u5B98\u65B9\u4EF7\u683C\u8868\uFF0C\u66F4\u65B0\u4E86".concat(updatedData._priceUpdatedCount, "\u9879\u4EF7\u683C\u6570\u636E"),
            updatedData: updatedData
          });

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.error('加载和应用官方价格表失败:', _context.t0);
          return _context.abrupt("return", {
            success: false,
            message: "\u52A0\u8F7D\u548C\u5E94\u7528\u5B98\u65B9\u4EF7\u683C\u8868\u5931\u8D25: ".concat(_context.t0.message),
            error: _context.t0
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
}
/**
 * 解析整个PDF价格表内容并提取所有价格信息
 * @param {string} pdfText - PDF价格表文本内容
 * @returns {Object} 提取的价格数据
 */


function parseCompletePriceTableFromPDF(pdfText) {
  if (!pdfText) return {
    basePrice: [],
    discountRates: {}
  }; // 解析基本价格表

  var basePrice = [];
  var discountRates = {}; // 尝试分割出出厂价格表和折扣价格表部分

  var parts = pdfText.split(/二O二二年内销产品出厂价格表|2022年内销产品出厂价格表/g);

  if (parts.length >= 2) {
    // 第一部分可能包含标题和说明
    // 第二部分通常包含出厂价格表
    var factoryPriceTable = parts[1] || ''; // 按行分割并处理每一行

    var lines = factoryPriceTable.split('\n').filter(function (line) {
      return line.trim();
    }); // 处理出厂价格表

    lines.forEach(function (line) {
      // 跳过标题行和说明行
      if (line.includes('产品型号') || line.includes('备注') || !line.includes(' ')) {
        return;
      } // 尝试提取型号和价格


      var parts = line.trim().split(/\s+/);

      if (parts.length >= 2) {
        var model = parts[0];
        var price; // 处理带速比的型号

        if (model.includes('(') && parts.length >= 3) {
          model = "".concat(model, " ").concat(parts[1]);
          price = parseFloat(parts[2]);
        } else {
          price = parseFloat(parts[1]);
        }

        if (!isNaN(price)) {
          basePrice.push({
            model: model.replace(/\(|\)/g, ''),
            basePrice: price
          });
        }
      }
    });
  } // 尝试解析折扣率信息（如果有）


  var discountParts = pdfText.match(/下浮(\d+)%/g) || [];
  discountParts.forEach(function (part) {
    var rateStr = part.match(/下浮(\d+)%/)[1];
    var rate = parseInt(rateStr, 10) / 100; // 这里需要配合上下文确定这个折扣率适用于哪些型号
    // 由于PDF解析的限制，可能需要手动补充这部分逻辑
  });
  return {
    basePrice: basePrice,
    discountRates: discountRates
  };
}
/**
 * 根据官方价格表2022生成修正后的折扣率数据
 * 基于价格表和已知折扣规则
 */


function generateCorrectedDiscountRates() {
  // 基于官方文档和附件中的折扣信息
  var correctedRates = {
    // HC系列 - 16%折扣
    'HC': 0.16,
    // GW系列 - 10%折扣
    'GW': 0.10,
    // DT系列 - 12%折扣(根据附件显示)
    'DT': 0.10,
    // HCQ系列 - 不同型号可能有不同折扣
    'HCQ': 0.15,
    // GC系列 - 10%折扣
    'GC': 0.10,
    // 其他系列默认折扣
    'default': 0.10
  }; // 特定型号的特殊折扣率

  var specialModelRates = {
    // 示例：特定型号可能有特殊折扣
    'HC400': 0.22,
    // 示例，根据报告特批
    'HCD400A': 0.22,
    // 示例，根据报告特批
    'D300A': 0.22,
    // 4-5.5:1 比例特批
    'J300': 0.22,
    // 报告特批
    'HC1200': 0.14,
    // 报告特批
    'HC1200/1': 0.10 // 报告特批

  };
  return {
    seriesRates: correctedRates,
    specialModelRates: specialModelRates
  };
}