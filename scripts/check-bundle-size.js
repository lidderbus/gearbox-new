#!/usr/bin/env node
// scripts/check-bundle-size.js
// 构建产物体积守门 — 检查 build/static/js/ 下 main + chunk 是否超阈值
// 使用: node scripts/check-bundle-size.js [--strict]
//   --strict: 超阈值 exit 1, 默认仅警告 (不阻断 CI)

const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');
const BUILD_DIR = path.join(__dirname, '..', 'build');
const JS_DIR = path.join(BUILD_DIR, 'static', 'js');
const CSS_DIR = path.join(BUILD_DIR, 'static', 'css');

// 阈值 (bytes)
const LIMITS = {
  MAIN_JS: 1.5 * 1024 * 1024,        // 1.5 MB
  CHUNK_JS: 500 * 1024,              // 500 KB per chunk
  MAIN_CSS: 200 * 1024,              // 200 KB
  TOTAL_BUILD: 50 * 1024 * 1024      // 50 MB
};

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

function dirSize(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(ext) && !f.endsWith('.map'))
    .map(f => ({ name: f, size: fs.statSync(path.join(dir, f)).size }));
}

const issues = [];

// 1. main.*.js
const jsFiles = listFiles(JS_DIR, '.js');
const mainJs = jsFiles.find(f => /^main\..+\.js$/.test(f.name));
if (mainJs && mainJs.size > LIMITS.MAIN_JS) {
  issues.push(`main.js ${fmt(mainJs.size)} 超过 ${fmt(LIMITS.MAIN_JS)} 阈值`);
}

// 2. 单 chunk
const oversizedChunks = jsFiles
  .filter(f => !/^main\./.test(f.name))
  .filter(f => f.size > LIMITS.CHUNK_JS);
if (oversizedChunks.length) {
  issues.push(
    `${oversizedChunks.length} 个 chunk 超 ${fmt(LIMITS.CHUNK_JS)}: ` +
    oversizedChunks.slice(0, 5).map(f => `${f.name} (${fmt(f.size)})`).join(', ')
  );
}

// 3. main.*.css
const cssFiles = listFiles(CSS_DIR, '.css');
const mainCss = cssFiles.find(f => /^main\..+\.css$/.test(f.name));
if (mainCss && mainCss.size > LIMITS.MAIN_CSS) {
  issues.push(`main.css ${fmt(mainCss.size)} 超过 ${fmt(LIMITS.MAIN_CSS)} 阈值`);
}

// 4. 总体
const total = dirSize(BUILD_DIR);
if (total > LIMITS.TOTAL_BUILD) {
  issues.push(`build 总大小 ${fmt(total)} 超过 ${fmt(LIMITS.TOTAL_BUILD)}`);
}

// 输出报告
console.log('=== 构建产物体积审计 ===');
if (mainJs) console.log(`  main.js:    ${fmt(mainJs.size)} (限 ${fmt(LIMITS.MAIN_JS)})`);
if (mainCss) console.log(`  main.css:   ${fmt(mainCss.size)} (限 ${fmt(LIMITS.MAIN_CSS)})`);
console.log(`  chunks:     ${jsFiles.length - (mainJs ? 1 : 0)} 个, 最大 ${fmt(Math.max(...jsFiles.filter(f => !/^main\./.test(f.name)).map(f => f.size), 0))}`);
console.log(`  build 总:   ${fmt(total)} (限 ${fmt(LIMITS.TOTAL_BUILD)})`);

if (issues.length === 0) {
  console.log('✓ 全部通过阈值');
  process.exit(0);
}

console.log('\n⚠ 超阈值项:');
issues.forEach(i => console.log(`  - ${i}`));

if (STRICT) {
  console.log('\n[strict] exit 1');
  process.exit(1);
}
console.log('\n(warn-only 模式; 加 --strict 启用硬阻断)');
process.exit(0);
