# 齿轮箱选型系统 - 代码质量审计报告

> **审计日期**: 2026-01-23
> **项目路径**: `/Users/lidder/gearbox-new`
> **在线地址**: http://47.99.181.195/gearbox-app/

---

## 执行摘要

| 指标 | 当前值 | 目标值 | 严重程度 |
|------|--------|--------|----------|
| 主包大小 | **2.8MB** | <1MB | 严重 |
| Console语句 | **540条** | 0 | 中等 |
| 语法错误文件 | **4个** | 0 | 高 |
| 未使用依赖 | **11个** | 0 | 低 |
| 图表库重复 | echarts + recharts | 统一 | 中等 |

---

## 1. Bundle分析

### 主要文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| main.a025b3a1.js | **2.8MB** | 主包 (严重过大) |
| 3490.be80a978.chunk.js | 1.1MB | 大型chunk |
| 8795.8f08797d.chunk.js | 884KB | 大型chunk |
| 3284.33889347.chunk.js | 540KB | 中型chunk |
| 9355.352e6f2c.chunk.js | 408KB | 中型chunk |

**详细报告**: `bundle-report.html`

### 数据文件大小

| 文件 | 大小 | 行数 | 优化建议 |
|------|------|------|----------|
| completeGearboxData.js | 624KB | 26,187 | 懒加载 |
| embeddedData.js | 180KB | 3,880 | 懒加载 |
| dwgTechParams.js | 168KB | 6,580 | 懒加载 |
| outlineDrawings.js | 144KB | 4,192 | 懒加载 |
| competitorData.js | 120KB | 4,176 | 懒加载 |

---

## 2. Console语句分析

**总计**: 540条分布在101个文件中

### Top 20 文件 (按console数量)

| 排名 | 文件 | 数量 | 建议 |
|------|------|------|------|
| 1 | src/utils/__tests__/torsionalAdvanced.test.js | 24 | 保留(测试) |
| 2 | src/utils/storageManager.js | 20 | 迁移到logger |
| 3 | src/utils/data-cli-tool.js | 20 | CLI工具保留 |
| 4 | src/components/SpecialRequirementsTemplateSelector.js | 20 | 迁移到logger |
| 5 | src/utils/fixData.js | 18 | 迁移到logger |
| 6 | src/utils/quotationGenerator.js | 17 | 迁移到logger |
| 7 | src/utils/dynamicImports.js | 15 | 迁移到logger |
| 8 | src/utils/enhancedPumpSelection.js | 14 | 迁移到logger |
| 9 | src/utils/AppWrapper.js | 14 | 迁移到logger |
| 10 | src/utils/dataLoader.js | 13 | 迁移到logger |
| 11 | src/utils/applyCouplingFix.js | 13 | 迁移到logger |
| 12 | src/utils/optimizedDataImport.js | 12 | 迁移到logger |
| 13 | src/utils/dataCorrector.js | 12 | 迁移到logger |
| 14 | src/utils/priceStrategy.js | 11 | 迁移到logger |
| 15 | src/utils/dataAdapter.js | 11 | 迁移到logger |
| 16 | src/utils/quotationManager.js | 10 | 迁移到logger |
| 17 | src/utils/dataLazyLoader.js | 10 | 迁移到logger |
| 18 | src/components/ContractView.js | 10 | 迁移到logger |
| 19 | src/utils/gearboxDataEnhancer.js | 9 | 迁移到logger |
| 20 | src/utils/enhancedCouplingSelection.js | 9 | 迁移到logger |

**Logger位置**: `src/config/logging.js`

---

## 3. 大文件分析

### 源代码文件 (>500行)

| 文件 | 行数 | 建议 |
|------|------|------|
| completeGearboxData.js | 26,187 | 数据文件，懒加载 |
| dwgTechParams.js | 6,580 | 数据文件，懒加载 |
| selectionAlgorithm.test.js | 6,308 | 测试文件，保留 |
| outlineDrawings.js | 4,192 | 数据文件，懒加载 |
| competitorData.js | 4,176 | 数据文件，懒加载 |
| embeddedData.js | 3,880 | 数据文件，懒加载 |
| hcmEngineMatching.js | 2,107 | 数据文件，懒加载 |
| dwgDrawings.js | 2,086 | 数据文件，懒加载 |
| cppSystemData.js | 2,058 | 数据文件，懒加载 |
| agreementTemplates.js | 1,977 | 考虑拆分 |
| initialData.js | 1,977 | 数据文件，懒加载 |
| selectionAlgorithm.ts | 1,759 | 核心算法，保留 |
| CPPSelectionView.js | 1,332 | 考虑组件拆分 |
| App.js | 1,264 | 考虑路由懒加载 |
| quotationGenerator.js | 1,220 | 考虑拆分 |
| EnhancedSelectionForm.js | 1,157 | 已拆分子组件 |

---

## 4. 语法错误文件

以下文件存在语法错误，需要修复：

| 文件 | 错误类型 | 具体问题 |
|------|----------|----------|
| src/utils/GearboxComparisonView.js | SyntaxError | 重复声明 'specialTypeNotice' (行476) |
| src/utils/gearboxMatchingMaps.js | SyntaxError | 未结束的注释 (行445) |
| src/utils/standbyPumps.js | SyntaxError | 无效的前缀操作 (行1) |
| src/data/complete-test-data.js | SyntaxError | 类定义中不允许spread操作符 (行36) |

---

## 5. 依赖分析

### 未使用的依赖 (可安全移除)

| 依赖 | 大小估计 | 建议 |
|------|----------|------|
| @emotion/react | ~50KB | 移除 |
| @emotion/styled | ~30KB | 移除 |
| @google/genai | ~100KB | 移除 |
| @testing-library/jest-dom | - | 保留(测试) |
| @testing-library/react | - | 保留(测试) |
| @testing-library/user-event | - | 保留(测试) |
| bootstrap | ~70KB | 与react-bootstrap重复，评估 |
| bootstrap-icons | ~50KB | 评估使用情况 |
| html2pdf.js | ~400KB | 移除(用jspdf替代) |
| react-to-print | ~20KB | 评估使用情况 |
| react-virtualized-auto-sizer | ~10KB | 评估使用情况 |

### 重复功能库

| 功能 | 当前库 | 建议 |
|------|--------|------|
| 图表 | echarts + recharts | 统一为recharts |
| PDF | jspdf + html2pdf.js + pdfjs-dist | 移除html2pdf.js |

---

## 6. ECharts使用位置 (需迁移到Recharts)

| 文件 | 组件/功能 |
|------|----------|
| src/pages/CouplingSelection/CouplingCharts.js | 联轴器图表 |
| src/components/EnergyDashboard.js | 能源仪表板 |
| src/components/torsional/StressSpeedChart.js | 应力速度图 |
| src/components/competitor/AdvantageReport.js | 竞品优势报告 |

---

## 7. 优化建议优先级

### P0 (立即修复)
1. 修复4个语法错误文件
2. 实现数据文件懒加载 (预计减少 1.0MB)

### P1 (高优先级)
1. 移除html2pdf.js依赖
2. 统一图表库为recharts
3. 迁移console语句到logger

### P2 (中优先级)
1. 移除未使用依赖
2. 清理构建产物目录
3. 拆分大型组件

### P3 (低优先级)
1. 优化测试文件console语句
2. 评估bootstrap/bootstrap-icons使用

---

## 8. 预期收益

| 优化项 | 预计减少 | 优先级 |
|--------|----------|--------|
| 数据懒加载 | ~1.0MB | P0 |
| 移除echarts | ~500KB | P1 |
| 移除html2pdf.js | ~400KB | P1 |
| 移除未使用依赖 | ~200KB | P2 |
| **总计** | **~2.1MB** | - |

**目标**: 主包从 2.8MB 降至 <1MB
