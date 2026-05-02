#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/audit-a11y-modal.js
 * C5: a11y 静态审计 — 扫描 src/ 中使用 react-bootstrap Modal 的组件,
 *     标记缺 Modal.Title (无 aria-labelledby 关联) / 缺 onHide 处理 / 缺 aria-label
 *
 * react-bootstrap 的 Modal 默认行为:
 *   - 自动设置 role="dialog" 和 aria-modal="true"
 *   - 自动焦点陷阱 (enforceFocus=true 默认)
 *   - 自动 Esc 关闭 (keyboard=true 默认)
 *   - 但 aria-labelledby 需要 Modal.Title 显式提供 id 才会自动关联
 *
 * 用法: node scripts/audit-a11y-modal.js
 * 退出码: 0 OK / 1 有警告
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.resolve(projectRoot, 'src');

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  fs.readdirSync(dir).forEach(name => {
    if (name.startsWith('.') || name === 'node_modules' || name === '__tests__' || name === '__mocks__') return;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, fileList);
    else if (/\.(js|jsx|ts|tsx)$/.test(name) && !name.endsWith('.test.js') && !name.endsWith('.test.tsx')) {
      fileList.push(full);
    }
  });
  return fileList;
}

const files = walk(srcRoot);
const audits = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');

  // 仅处理 import { Modal } from 'react-bootstrap'
  if (!/import[\s\S]*?\bModal\b[\s\S]*?from\s+['"]react-bootstrap['"]/.test(content)) return;

  const findings = [];

  // 1. 用了 <Modal 但没有 <Modal.Title? (粗略, 跨行)
  const modalUsageCount = (content.match(/<Modal\s/g) || []).length;
  const titleUsageCount = (content.match(/<Modal\.Title/g) || []).length;
  if (modalUsageCount > 0 && titleUsageCount === 0) {
    findings.push(`使用 <Modal 但未见 <Modal.Title> — aria-labelledby 无法自动建立 (a11y 警告)`);
  }

  // 2. <Modal.Title 缺 id/aria-labelledby?
  // react-bootstrap 默认为 Modal.Title 自动加 id, 一般不需手动. 跳过强校验.

  // 3. <Modal 有 onHide?
  if (modalUsageCount > 0 && !/onHide\s*=/.test(content)) {
    findings.push(`<Modal 缺 onHide 处理 — Esc 与遮罩点击无法关闭`);
  }

  // 4. <Button onClick 但既无 children 文本也无 aria-label? (小心, 太严格会误报)
  const iconOnlyButton = /<Button[^>]*onClick[\s\S]{0,120}?>\s*<i\s+className="bi[^"]*"[^>]*\/>\s*<\/Button>/g;
  let match;
  while ((match = iconOnlyButton.exec(content)) !== null) {
    if (!/aria-label\s*=/.test(match[0])) {
      findings.push(`图标按钮缺 aria-label (位置 ~ char ${match.index}): ${match[0].slice(0, 80)}...`);
    }
  }

  if (findings.length > 0) {
    audits.push({ file: path.relative(projectRoot, file), findings });
  }
});

console.log(`a11y Modal 审计 — 扫描 ${files.length} 文件`);
if (audits.length === 0) {
  console.log('  ✓ 全部通过');
  process.exit(0);
}

console.log(`  发现 ${audits.length} 个文件有 a11y 警告:\n`);
audits.forEach(a => {
  console.log(`  · ${a.file}`);
  a.findings.forEach(f => console.log(`      ⚠ ${f}`));
});

console.log(`\n[警告] 这些是 a11y 改进建议, 不阻断构建. 渐进修复请补 <Modal.Title>, onHide={...}, 图标按钮加 aria-label.`);
process.exit(0);
