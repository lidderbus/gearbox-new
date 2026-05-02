#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/validate-engine-db.js
 * 多品牌柴油机库 schema 校验 — B1 投产前 CI hook
 *
 * 必填字段 (任何 confidence 都需有):
 *   id / brand / series / model / cylinders /
 *   ratedPower_kW / ratedSpeed_rpm / powerRange / speedRange /
 *   emissionTier / fuel / applicationTypes / dataSource / confidence / lastVerified
 *
 * 高置信度(A) 额外必填:
 *   torqueCurve (≥1 点) / dimensions / weight_kg
 *
 * 用法: node scripts/validate-engine-db.js [--fail-on-warning]
 * 退出码: 0 OK / 1 有错误 / 2 严重 (id 重复 / 数据全空)
 */

const path = require('path');
const fs = require('fs');

// 直接 require ESM 不可行, 改用浅解析: 读文本 + 正则提取 marineEngines 数组
// 简单方案: 用 Babel 编译 (CRA 已装 @babel/register), 但更稳的做法是手写 JSON 提取
// 最稳: 用 esbuild / vm.runInThisContext, 但 node 直接支持 dynamic import
// 这里用 Node 16+ 的实验 import (CRA 装的 Node 一般支持)

(async () => {
  const projectRoot = path.resolve(__dirname, '..');
  const dataPath = path.resolve(projectRoot, 'src/data/marineEngineDatabase.js');
  if (!fs.existsSync(dataPath)) {
    console.error(`[ERR] 文件不存在: ${dataPath}`);
    process.exit(2);
  }

  // 直接通过 dynamic import 加载 (Node ESM 互操作)
  const fileUrl = 'file://' + dataPath;
  let mod;
  try {
    mod = await import(fileUrl);
  } catch (e) {
    // ESM 加载失败回退: 手动 transpile (使用 require + babel-register 是过重的)
    // 改为用 esbuild 一次性编译到字符串再 vm.runInThisContext
    const esbuild = (() => {
      try { return require('esbuild'); } catch (_) { return null; }
    })();
    if (!esbuild) {
      console.error(`[ERR] dynamic import 失败且 esbuild 不可用: ${e.message}`);
      console.error('        请在项目根目录运行: npm install --save-dev esbuild');
      process.exit(2);
    }
    const result = await esbuild.build({
      entryPoints: [dataPath],
      bundle: false,
      format: 'cjs',
      platform: 'node',
      write: false
    });
    const cjs = result.outputFiles[0].text;
    const m = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function('module', 'exports', 'require', cjs)(m, m.exports, require);
    mod = m.exports;
  }

  const { marineEngines, ENGINE_SCHEMA_VERSION, EmissionTier, FuelType, ApplicationType } = mod;
  if (!Array.isArray(marineEngines) || marineEngines.length === 0) {
    console.error('[ERR] marineEngines 数组为空或非数组');
    process.exit(2);
  }

  const failOnWarning = process.argv.includes('--fail-on-warning');
  const errors = [];
  const warnings = [];

  // id 重复检测
  const idCounts = {};
  marineEngines.forEach(e => {
    if (e.id) idCounts[e.id] = (idCounts[e.id] || 0) + 1;
  });
  Object.entries(idCounts).forEach(([id, count]) => {
    if (count > 1) errors.push(`id 重复: '${id}' 出现 ${count} 次`);
  });

  const allowedTiers = new Set(Object.values(EmissionTier || {}));
  const allowedFuels = new Set(Object.values(FuelType || {}));
  const allowedApps = new Set(Object.values(ApplicationType || {}));

  marineEngines.forEach((e, idx) => {
    const tag = `[#${idx}/${e.id || 'NO_ID'}/${e.brand || '?'}/${e.model || '?'}]`;
    const required = ['id', 'brand', 'series', 'model', 'cylinders', 'ratedPower_kW',
      'ratedSpeed_rpm', 'powerRange', 'speedRange', 'emissionTier', 'fuel',
      'applicationTypes', 'dataSource', 'confidence', 'lastVerified'];
    required.forEach(k => {
      const v = e[k];
      const missing = (v === undefined || v === null) || (typeof v === 'string' && v.trim() === '');
      if (missing) errors.push(`${tag} 缺必填字段: ${k}`);
    });

    // id 格式: 全小写 + 连字符
    if (e.id && !/^[a-z0-9-]+$/.test(e.id)) {
      errors.push(`${tag} id 格式非法 (仅小写字母/数字/连字符): '${e.id}'`);
    }

    // power / speed 数值合理性
    if (typeof e.ratedPower_kW === 'number' && (e.ratedPower_kW < 50 || e.ratedPower_kW > 100000)) {
      warnings.push(`${tag} ratedPower_kW 超出合理区间 [50, 100000]: ${e.ratedPower_kW}`);
    }
    if (typeof e.ratedSpeed_rpm === 'number' && (e.ratedSpeed_rpm < 100 || e.ratedSpeed_rpm > 5000)) {
      warnings.push(`${tag} ratedSpeed_rpm 超出合理区间 [100, 5000]: ${e.ratedSpeed_rpm}`);
    }

    if (e.powerRange && (e.powerRange.min_kW > e.powerRange.max_kW)) {
      errors.push(`${tag} powerRange.min_kW (${e.powerRange.min_kW}) > max_kW (${e.powerRange.max_kW})`);
    }
    if (e.speedRange && (e.speedRange.min_rpm > e.speedRange.max_rpm)) {
      errors.push(`${tag} speedRange.min_rpm (${e.speedRange.min_rpm}) > max_rpm (${e.speedRange.max_rpm})`);
    }

    // emissionTier 在白名单
    if (allowedTiers.size > 0 && e.emissionTier && !allowedTiers.has(e.emissionTier)) {
      warnings.push(`${tag} emissionTier '${e.emissionTier}' 不在 EmissionTier 白名单`);
    }

    // fuel 列表
    if (Array.isArray(e.fuel) && allowedFuels.size > 0) {
      e.fuel.forEach(f => {
        if (!allowedFuels.has(f)) warnings.push(`${tag} fuel '${f}' 不在 FuelType 白名单`);
      });
    }

    // applicationTypes
    if (Array.isArray(e.applicationTypes) && allowedApps.size > 0) {
      e.applicationTypes.forEach(a => {
        if (!allowedApps.has(a)) warnings.push(`${tag} applicationType '${a}' 不在 ApplicationType 白名单`);
      });
    }

    // confidence A 额外必填
    if (e.confidence === 'A') {
      if (!Array.isArray(e.torqueCurve) || e.torqueCurve.length === 0) {
        errors.push(`${tag} confidence='A' 但 torqueCurve 为空`);
      } else {
        e.torqueCurve.forEach((p, j) => {
          if (typeof p.power_kW !== 'number' || typeof p.rpm !== 'number') {
            errors.push(`${tag} torqueCurve[${j}] 缺 power_kW/rpm`);
          }
        });
      }
      if (!e.dimensions || !e.dimensions.L_mm) {
        warnings.push(`${tag} confidence='A' 但 dimensions 不全 (建议 L/W/H 都填)`);
      }
      if (!e.weight_kg) {
        warnings.push(`${tag} confidence='A' 但 weight_kg 缺失`);
      }
    }

    // confidence B/C 允许 torqueCurve 缺省, 但若有也必须合法
    if (e.confidence !== 'A' && Array.isArray(e.torqueCurve)) {
      e.torqueCurve.forEach((p, j) => {
        if (typeof p.power_kW !== 'number' || typeof p.rpm !== 'number') {
          errors.push(`${tag} torqueCurve[${j}] 缺 power_kW/rpm`);
        }
      });
    }

    // dataSource 非空
    if (e.dataSource && e.dataSource.length < 6) {
      warnings.push(`${tag} dataSource 太短 (建议含厂商+文档名): '${e.dataSource}'`);
    }

    // lastVerified 是否为 ISO 日期
    if (e.lastVerified && !/^\d{4}-\d{2}-\d{2}$/.test(e.lastVerified)) {
      errors.push(`${tag} lastVerified 不符 YYYY-MM-DD: '${e.lastVerified}'`);
    }
  });

  console.log(`marineEngineDatabase schema 版本 ${ENGINE_SCHEMA_VERSION} · 录入 ${marineEngines.length} 条`);
  console.log(`  错误 ${errors.length}, 警告 ${warnings.length}`);

  if (errors.length > 0) {
    console.error('\n=== ERRORS ===');
    errors.forEach(e => console.error('  ✗ ' + e));
  }
  if (warnings.length > 0) {
    console.warn('\n=== WARNINGS ===');
    warnings.forEach(w => console.warn('  ⚠ ' + w));
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✓ 全部通过');
  }

  if (errors.length > 0) process.exit(1);
  if (failOnWarning && warnings.length > 0) process.exit(1);
  process.exit(0);
})();
