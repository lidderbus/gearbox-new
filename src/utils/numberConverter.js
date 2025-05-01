// src/utils/numberConverter.js
/**
 * 将数字转换为中文大写金额
 * @param {number} num - 要转换的数字
 * @returns {string} - 转换后的中文大写金额
 */
export const convertToChinaNum = (num) => {
  if (isNaN(num)) return '零元整';
  
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  
  // 处理小数部分
  const head = num < 0 ? '负' : '';
  num = Math.abs(num);

  let s = '';
  
  // 处理小数点后的部分
  const numStr = num.toString();
  const dotIndex = numStr.indexOf('.');
  let decimalPart = '';
  
  if (dotIndex !== -1) {
    decimalPart = numStr.substring(dotIndex + 1, dotIndex + 3); // 最多保留两位小数
    while (decimalPart.length < 2) {
      decimalPart += '0';
    }
  } else {
    decimalPart = '00';
  }
  
  // 处理整数部分
  let integerPart = parseInt(num).toString();
  
  if (integerPart === '0') {
    s = '零元';
  } else {
    let zeroCount = 0;
    const IntLen = integerPart.length;
    
    for (let i = 0; i < IntLen; i++) {
      const n = integerPart.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          s += digit[0];
        }
        zeroCount = 0;
        s += digit[parseInt(n)] + unit[1][m];
      }
      
      if (m === 0 && zeroCount < 4) {
        s += unit[0][q];
      }
    }
  }
  
  // 处理小数部分
  for (let i = 0; i < decimalPart.length; i++) {
    const n = decimalPart.charAt(i);
    if (n !== '0') {
      s += digit[Number(n)] + fraction[i];
    }
  }
  
  // 如果小数部分都是0，则加上"整"字
  if (s.charAt(s.length - 1) === '元') {
    s += '整';
  }
  
  return head + s;
};