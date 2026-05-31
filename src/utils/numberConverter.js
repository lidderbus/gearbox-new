// src/utils/numberConverter.js
/**
 * 将数字转换为中文大写金额
 *
 * 2026-05-31 P0 修复: 旧实现对整百万/整十万/整万级金额(如 1,000,000)漏 "元整",
 * 产出法律无效的残缺大写(如 "壹佰万")。改用与 quotationGenerator.numberToChinese 一致的
 * 已验证算法 — 整数部分恒接 "元", 小数走角/分, 无小数补 "整"。
 *
 * @param {number} num - 要转换的数字
 * @returns {string} - 转换后的中文大写金额 (如 "壹佰万元整")
 */
export const convertToChinaNum = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '零元整';

  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const head = num < 0 ? '负' : '';
  num = Math.abs(num);

  // 小数部分（角/分）
  let decimalStr = '';
  const decimalPart = Math.round(num * 100) % 100;
  if (decimalPart > 0) {
    const jiao = Math.floor(decimalPart / 10);
    const fen = decimalPart % 10;
    if (jiao > 0) decimalStr += digit[jiao] + '角';
    if (fen > 0) decimalStr += digit[fen] + '分';
  } else {
    decimalStr = '整';
  }

  // 整数部分
  const integerPart = Math.floor(num);
  if (integerPart === 0) {
    return head + '零元' + decimalStr;
  }

  const integerStr = integerPart.toString();
  const len = integerStr.length;
  let result = '';
  let zeroFlag = false;

  for (let i = 0; i < len; i++) {
    const d = parseInt(integerStr[i], 10);
    const pos = len - i - 1;       // 从右数: 0=个 1=十 2=百 3=千 4=万...
    const sectionPos = pos % 4;    // 节内位置

    if (d !== 0) {
      if (zeroFlag) { result += '零'; zeroFlag = false; }
      result += digit[d];
      if (sectionPos === 1) result += '拾';
      else if (sectionPos === 2) result += '佰';
      else if (sectionPos === 3) result += '仟';
    } else {
      zeroFlag = true;
    }

    // 节末(pos 为 4 的倍数)补节权 万/亿
    if (sectionPos === 0) {
      if (pos >= 8) result += '亿';
      else if (pos >= 4) result += '万';
    }
  }

  // 清理整节为 0 时多余的 万/亿
  result = result.replace(/零万/, '万').replace(/零亿/, '亿').replace(/亿万/, '亿');

  return head + result + '元' + decimalStr;
};
