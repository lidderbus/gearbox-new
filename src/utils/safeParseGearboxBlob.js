// src/utils/safeParseGearboxBlob.js
// 安全解析齿轮箱数据 JS 对象字面量(替代 new Function 注入路径)
// 策略: 严格白名单字符 + 正则预处理 → JSON.parse, 不执行任何代码

const MAX_INPUT_BYTES = 8 * 1024 * 1024; // 8MB

// 任何代码执行/危险 API 模式都直接拒绝
// 注意: 与字段名(如 application/applicationTypes)冲突的关键字必须用 \b 限定
const FORBIDDEN_PATTERNS = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/,
  /\b(?:set|clear)(?:Timeout|Interval|Immediate)\s*\(/,
  /\bimport\s*\(/,
  /\brequire\s*\(/,
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\b(?:document|window|globalThis|self|top|parent|location|navigator|localStorage|sessionStorage|indexedDB|crypto|process)\s*\./,
  /\bSymbol\s*\(/,
  /\bReflect\s*\./,
  /\bProxy\s*\(/,
  /=>/,
  /`[\s\S]*?\$\{/,
  /\\u00(?:65|66)/i,
];

function rejectIfDangerous(text) {
  for (const re of FORBIDDEN_PATTERNS) {
    if (re.test(text)) {
      const matched = text.match(re);
      throw new Error(`输入包含禁止的代码模式: ${matched && matched[0]}`);
    }
  }
}

function stripComments(text) {
  // 移除 /* */ 块注释 + // 行注释 (粗略, 字符串内的 // 也会被剥离, 但齿轮箱数据中字符串极少含 //)
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'])\/\/[^\n]*$/gm, '$1');
}

function stripTrailingCommas(text) {
  return text.replace(/,(\s*[}\]])/g, '$1');
}

function quoteUnquotedKeys(text) {
  // 仅匹配紧跟 { 或 , 后的未引用 key, 例如  { foo: 1, bar: 2 } → { "foo": 1, "bar": 2 }
  return text.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":');
}

function singleToDoubleQuotes(text) {
  // 把 'xxx' 转成 "xxx", 跳过已有转义
  // 简化处理: 假定齿轮箱数据中字符串不含双引号
  return text.replace(/'((?:\\.|[^'\\])*)'/g, (_, inner) => {
    return '"' + inner.replace(/"/g, '\\"') + '"';
  });
}

function normalizeNumberLiterals(text) {
  // JSON 不允许尾部小数点 ".5" / "1.", JS 都允许
  return text
    .replace(/(^|[^\d.])(\.\d+)/g, '$1 0$2')
    .replace(/(\d+)\.(?=\D|$)/g, '$1.0');
}

function normalizeUndefined(text) {
  // 把 undefined 替换为 null (JSON 标准)
  return text.replace(/\bundefined\b/g, 'null');
}

/**
 * 安全解析齿轮箱数据 JS 对象字面量
 * @param {string} dataExpr 形如 '{ hcGearboxes: [...], gwGearboxes: [...] }'
 * @returns {object} 解析后的纯数据对象
 * @throws {Error} 输入危险或无法解析
 */
export function safeParseGearboxBlob(dataExpr) {
  if (typeof dataExpr !== 'string') {
    throw new Error('safeParseGearboxBlob 输入必须为字符串');
  }
  if (dataExpr.length > MAX_INPUT_BYTES) {
    throw new Error(`输入过大 (>${MAX_INPUT_BYTES} bytes), 拒绝处理`);
  }
  const trimmed = dataExpr.trim().replace(/;\s*$/, '');
  rejectIfDangerous(trimmed);

  // 优先尝试直接 JSON.parse (convertToJsCode 输出本身就是合法 JSON)
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // 进入容错路径
  }

  let normalized = trimmed;
  normalized = stripComments(normalized);
  normalized = singleToDoubleQuotes(normalized);
  normalized = quoteUnquotedKeys(normalized);
  normalized = normalizeNumberLiterals(normalized);
  normalized = normalizeUndefined(normalized);
  normalized = stripTrailingCommas(normalized);

  // 二次危险扫描 (转换不应引入新模式, 但保险起见)
  rejectIfDangerous(normalized);

  try {
    return JSON.parse(normalized);
  } catch (err) {
    throw new Error(`safeParseGearboxBlob 解析失败 (容错后仍非法): ${err.message}`);
  }
}

/**
 * 从完整 JS 文本中按 export const 名称提取对象并安全解析
 * @param {string} content 包含 'export const X = {...}' 的 JS 文本
 * @param {string} objectName 要提取的常量名
 * @returns {object|null} 解析后的对象, 失败返回 null
 */
export function safeExtractAndParse(content, objectName) {
  if (typeof content !== 'string' || typeof objectName !== 'string') return null;
  const startPattern = new RegExp(`(?:export\\s+)?const\\s+${objectName}\\s*=\\s*`);
  const match = content.match(startPattern);
  if (!match) return null;

  // 大括号配对找到对象结束位置
  const start = match.index + match[0].length;
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let end = start;
  for (let i = start; i < content.length; i++) {
    const ch = content[i];
    const prev = content[i - 1];
    if (inString) {
      if (ch === stringChar && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (depth !== 0) return null;

  try {
    return safeParseGearboxBlob(content.slice(start, end));
  } catch (e) {
    return null;
  }
}

const _exports = { safeParseGearboxBlob, safeExtractAndParse };
export default _exports;
