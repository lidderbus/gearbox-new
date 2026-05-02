#!/usr/bin/env node
// scripts/audit-theme-tokens.js
// 主题 token 迁移进度追踪
// 输出:
// - 已用 var(--*) 的组件比例
// - 硬编码 hex 总量 + 高频值 TOP 10
// - 按文件排序的硬编码密度 TOP 20 (优先迁移目标)
//
// 使用: node scripts/audit-theme-tokens.js [--json]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');
const COMPONENTS = path.join(ROOT, 'components');
const STYLES = path.join(ROOT, 'styles');

const JSON_OUTPUT = process.argv.includes('--json');

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const TOKEN_RE = /var\(--(?:primary|secondary|accent|success|warning|danger|info|gray|bg|text|border|shadow|spacing|radius|transition|text)-/;

function walk(dir, exts = ['.js', '.jsx', '.ts', '.tsx', '.css']) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '__tests__' && entry.name !== 'node_modules') {
      out.push(...walk(p, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

const componentFiles = walk(COMPONENTS, ['.js', '.jsx']);
const totalComponents = componentFiles.length;

let hasTokenCount = 0;
let totalHex = 0;
const hexFreq = new Map();
const fileHexDensity = [];

for (const f of componentFiles) {
  const content = fs.readFileSync(f, 'utf-8');
  if (TOKEN_RE.test(content)) hasTokenCount++;
  const hexes = content.match(HEX_RE) || [];
  totalHex += hexes.length;
  hexes.forEach(h => {
    const k = h.toLowerCase();
    hexFreq.set(k, (hexFreq.get(k) || 0) + 1);
  });
  if (hexes.length > 0) {
    fileHexDensity.push({
      file: path.relative(ROOT, f),
      hex: hexes.length
    });
  }
}

fileHexDensity.sort((a, b) => b.hex - a.hex);

// theme.css 中已定义的 token
const themeCss = fs.existsSync(path.join(STYLES, 'theme.css'))
  ? fs.readFileSync(path.join(STYLES, 'theme.css'), 'utf-8')
  : '';
const definedTokens = (themeCss.match(/--[a-z][a-z0-9-]+:/gi) || []).length;

const summary = {
  totalComponents,
  hasTokenCount,
  tokenAdoption: ((hasTokenCount / totalComponents) * 100).toFixed(1) + '%',
  totalHex,
  uniqueHex: hexFreq.size,
  topHex: Array.from(hexFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([color, count]) => ({ color, count })),
  topDensityFiles: fileHexDensity.slice(0, 20),
  definedTokens
};

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

console.log('=== 主题 Token 迁移审计 ===\n');
console.log(`组件总数: ${totalComponents}`);
console.log(`已用 var(--*) token: ${hasTokenCount} (${summary.tokenAdoption})`);
console.log(`theme.css 已定义 token: ${definedTokens}\n`);
console.log(`硬编码 hex 总数: ${totalHex} 处, 唯一值 ${hexFreq.size} 种\n`);

console.log('TOP 10 高频硬编码颜色:');
summary.topHex.forEach((h, i) => {
  console.log(`  ${(i + 1).toString().padStart(2)}. ${h.color.padEnd(10)} ×${h.count}`);
});

console.log('\nTOP 20 硬编码密度文件 (优先迁移):');
summary.topDensityFiles.forEach((f, i) => {
  console.log(`  ${(i + 1).toString().padStart(2)}. ${f.hex.toString().padStart(4)} ${f.file}`);
});

console.log('\n建议:');
console.log('  1. 先迁移 TOP 20 高密度文件 (累计占总硬编码量 ~40%)');
console.log('  2. 高频颜色对应到 theme.css token (#fff → --bg-primary, #333 → --text-primary 等)');
console.log('  3. 每周跑本脚本对比 tokenAdoption %, 目标 1 年内 ≥80%');
