# 齿轮箱选型系统 v65 投产说明书

> **版本**: v65 投产 · **生效日期**: 2026-05-02 · **在线地址**: https://qj-gearbox.duckdns.org/gearbox-app/
> **方案档案**: `~/.claude/plans/fluttering-coalescing-finch.md` (23 人天 · A/B/C 三阶段 · 13 项)

---

## 目录

1. [总览与里程碑](#1-总览与里程碑)
2. [阶段 A 投产硬阻断](#2-阶段-a-投产硬阻断)
3. [阶段 B 外部数据融合](#3-阶段-b-外部数据融合)
4. [阶段 C 工程加固与可观测性](#4-阶段-c-工程加固与可观测性)
5. [部署与回滚](#5-部署与回滚)
6. [认证凭据管理](#6-认证凭据管理)
7. [测试与验证](#7-测试与验证)
8. [数据扩展指南](#8-数据扩展指南)
9. [故障排查](#9-故障排查)
10. [附录: 文件清单](#10-附录-文件清单)

---

## 1. 总览与里程碑

### 1.1 范围

将 React SPA(585 型号 / 354 组件 / 1144 测试)从内部工具升级为可投入船厂生产使用的"具有国际可比性的船舶推进系统集成方案平台"。

### 1.2 任务完成度

| 阶段 | 任务 | 状态 | 关键产出 |
|---|---|---|---|
| A1 | window.open noopener 加固 | ✅ | 16 文件 + ESLint 防回归规则 |
| A2 | new Function() 注入消除 | ✅ | safeParseGearboxBlob.js + 16 测试 |
| A3 | 认证存储加固 | ✅ | PBKDF2-SHA256 100k 轮 + 删 fallback hash |
| A4 | validateDatabase 启动硬阻断 | ✅ | FatalScreen + 5% 缺失阈值 |
| A5 | 原子部署 | ✅ | atomic-deploy.sh + ln -sfn swap |
| B1 | 多品牌柴油机库 | ✅ | marineEngineDatabase.js + 50 P0 型号 |
| B2 | 国外齿轮箱参数级映射 | ✅ | foreignGearboxMapping.js + ParametricCompareView |
| B3 | 标准船型库 | ✅ | standardVesselTypes.js + QuickByVesselType |
| B4 | IMO 合规引擎 | ✅ | imoComplianceEngine.js + EEDI/EEXI/CII |
| C1 | 虚拟滚动 | ✅ | react-window FixedSizeList/Grid |
| C2 | 主算法 E2E 测试 | ✅ | +59 测试(36 CPP + 23 边界) + Playwright 链路 |
| C3 | Sentry DSN | ✅ | ErrorBoundary captureException 接通 |
| C4 | 缓存破坏 + 性能预算 | ✅ | service-worker workbox + bundlesize |
| C5 | a11y 补齐 | ✅ | Modal aria + 焦点陷阱 |
| C6 | Playwright E2E + GitHub Actions | ✅ | 全链路守卫 + CI hook |

### 1.3 度量

- **测试**: 45 suites / **1144 tests** 全绿(基线 1085, +59)
- **Playwright**: e2e/*.spec.js 6 文件,含 selection-to-contract 全链路
- **Bundle**: main < 800KB gzipped(bundlesize 阈值)
- **Lighthouse**: Slow 4G FCP < 2s · LCP < 3s · TTI < 5s

---

## 2. 阶段 A 投产硬阻断

### 2.1 A1 · window.open noopener

**风险**: `window.open(url, '_blank')` 缺第三参数会让新页面通过 `window.opener` 接管原页(reverse tabnabbing)。

**已修 16 文件**: torsionalReportGenerator / selectionSummaryExport / documentExportService / EnhancedGearboxSelectionResult / DwgCompareView / DwgThumbnailGrid / AgreementDrawingSection / OutlineDrawingQuery/DwgViewer / OutlineDrawingViewer / TemplateLibrary / ManualLibrary / competitor/CompetitorPdfViewer / CouplingSelectionResultComponent / PDFLoadingModal / DatabaseManagementView / GearboxCouplingDetailModal。

**回归防护**: `package.json#eslintConfig.rules`

```json
"react/jsx-no-target-blank": "error",
"no-restricted-syntax": [
  "error",
  {
    "selector": "CallExpression[callee.object.name='window'][callee.property.name='open'][arguments.length=2][arguments.1.value='_blank']",
    "message": "window.open(url, '_blank') 必须带第三参数 'noopener,noreferrer'"
  }
]
```

ESLint 在 `npm test` / `npm run build` 时自动校验。

### 2.2 A2 · new Function() 注入消除

**风险**: `new Function('return ' + dataExpr)()` 等同 `eval`,粘贴的 JS 数据若含恶意代码可在浏览器执行。

**方案**: `src/utils/safeParseGearboxBlob.js`

- 关键字 pre-check: `eval / Function / setTimeout / import / require / fetch / document. / window. / => / 模板字面量插值 / \u00xx 转义` 全部拒绝
- 正则提取 `export const X = {...}` 对象字面量 → 标准化(单引号→双引号、剔除尾随逗号、剥注释)→ `JSON.parse`
- 8MB 输入上限

**替换点**:
- `src/utils/mergeGearboxData.js:14` (extractObjectFromString)
- `src/components/GearboxDataImporter.js:78,145`

**测试**: `src/utils/__tests__/safeParseGearboxBlob.test.js` 16 用例(合法 / 单引号 / 尾逗号 / 注释 / undefined→null / eval 拒 / Function 拒 / 箭头函数拒 / require 拒 / window 拒 / 模板字符串拒 / \u 转义拒 / 超大拒 / 提取对象 / 缺失返 null)。

### 2.3 A3 · 认证存储加固

**变更**: `src/contexts/AuthContext.js` v2

| 项 | 旧 | 新 |
|---|---|---|
| 哈希算法 | 单轮 SHA-256 | PBKDF2-SHA256 100k 轮 |
| Salt | 单一硬编码 | `${env.REACT_APP_AUTH_SALT}:${username.toLowerCase()}` 复合派生 |
| 默认 fallback | 内置 admin/user 哈希 | **删除**, 缺失即抛错 |
| 会话存储 | sessionStorage + AES-CBC | 保留(已加密, 未变) |

**环境变量**(必填,缺失登录失败):
```bash
REACT_APP_AUTH_SALT=<32 字节 hex>
REACT_APP_ADMIN_HASH=<PBKDF2 哈希>
REACT_APP_USER_HASH=<PBKDF2 哈希>
```

**生成方法** 见 [§6 认证凭据管理](#6-认证凭据管理)。

**升级前用户通知**: 登录页 banner 提前 7 天告知重新登录(旧 session 因 hash 不一致会自动失效)。

### 2.4 A4 · validateDatabase 启动硬阻断

**问题**: `src/utils/repair.js:401` 调用 `validateDatabase`(在 `dataValidator.js:285`),但失败仅 `console.warn`,白屏不可观测。

**变更**: `repair.js` 失败返回 `{ blocking: true, errors }`;`src/index.js` 在 `createRoot` 之前 await `loadAndRepairData()`,blocking=true 时渲染 `<FatalScreen errors={...}/>` 显示"数据库校验失败,请联系管理员"。

**硬阻断阈值**:
- 齿轮箱型号数 < 500 → block
- 必填字段(`model / inputSpeedRange / ratios / transferCapacity`)缺失率 > 5% → block
- `completeGearboxData` 整体 JSON 解析失败 → block

**软警告**(仅 Sentry breadcrumb): 价格缺失 / 外形图缺失 / 联轴器映射断链。

**灰度策略**: 先 warn 模式跑 1 周观察日志确认 585 型号当前能通过 5% 阈值,再切硬阻断。

### 2.5 A5 · 原子部署

**问题**: 旧 `deploy.sh` 用 `rsync --delete` 直接覆盖 `/var/www/html/gearbox-app/`,中间态可能让用户看到 404。

**新方案**: `scripts/deploy/atomic-deploy.sh`

```bash
TS=$(date +%s)
CI=false npm run build && npm test -- --watchAll=false || exit 1
rsync -az build/ root@47.99.181.195:/var/www/html/gearbox-app-$TS/
ssh ... "ln -sfn /var/www/html/gearbox-app-$TS /var/www/html/gearbox-app && nginx -s reload"
ssh ... "ls -dt /var/www/html/gearbox-app-* | tail -n +4 | xargs rm -rf"   # 保留最近 3 版
curl -fs https://qj-gearbox.duckdns.org/gearbox-app/index.html | grep -q '齿轮箱选型' || exit 1
```

**回滚**:
```bash
ssh ... "ln -sfn /var/www/html/gearbox-app-<旧TS> /var/www/html/gearbox-app && nginx -s reload"
```

**注意**: 旧 `deploy.sh`(带 chattr 锁)仍保留作为 fallback,但 v65 起推荐使用 atomic-deploy.sh。

---

## 3. 阶段 B 外部数据融合

> **数据来源约束(CLAUDE.md)**: 仅录入厂商 Project Guide + 船级社公开 EIAPP + Significant Ships 行业年鉴; 每条标 `dataSource` + `confidence` (A/B/C)。
> **海外价格**: 区间展示 + 年份口径 + 醒目免责"参考价仅作对位估算, 实际以厂商报价为准"。

### 3.1 B1 · 多品牌柴油机库

**文件**: `src/data/marineEngineDatabase.js`(新, 不改既有 schema)

**Schema**:
```js
{
  id: 'man-l27-38-9l',
  brand: 'MAN',                    // 12 品牌覆盖
  series: 'L27/38',
  model: '9L27/38',
  cylinders: 9,
  displacement_L: 158.4,
  ratedPower_kW: 3060,
  ratedSpeed_rpm: 800,
  powerRange: { min_kW, max_kW },
  speedRange: { min_rpm, max_rpm },
  torqueCurve: [{ rpm, torque_Nm, sfc_g_kWh, power_kW }, ...],   // 60/75/85/100/110% 5 点
  emissionTier: 'IMO_Tier_III',
  eiapp: { issuer: 'DNV', certNo, expires },
  fuel: ['HFO', 'MDO', 'MGO', 'B30'],
  weight_kg, dimensions: { L, W, H },
  applicationTypes: ['cargo', 'tanker'],
  referenceCases: [],
  dataSource: 'MAN PrimeServ Project Guide 2023',
  confidence: 'A',                 // A 厂商一手 / B 船级社 / C 行业聚合
  lastVerified: '2026-05-02'
}
```

**P0 50 型号品牌**: MAN(L21/31, L27/38) · Wartsila(W20/W31/W34/W46) · 潍柴(6170ZC/8170/12V190) · CAT(3508/3512/3516) · MTU(4000/8000) · Yanmar(6EY/6N/6AY) · Mitsubishi(S6R/S12R/S16R) · Cummins(复用 cumminsMatchingData.js) · 玉柴(YC6CL/YC6T) · 上柴(SC9D/SC15G) · Volvo(D13MH/IPS) · Caterpillar 3500。

**接入 UI**: `src/components/EnhancedSelectionForm/EngineInfoSection.js` 新增 MUI `<Autocomplete>`。选中后:
1. 自动填 `formData.motorPower = ratedPower_kW`
2. 自动填 `formData.motorSpeed = ratedSpeed_rpm`
3. 显示 Tier III 徽章 + EIAPP 状态

**接入算法**: `src/utils/selectionAlgorithm.ts` 当 `engineId` 提供时,用真实 SFC 曲线替代 1.5x 默认估算。

**数据校验脚本**: `scripts/validate-engine-db.js`(CI hook,必填字段 100%)。

### 3.2 B2 · 国外齿轮箱参数级映射

**文件**: `src/data/foreignGearboxMapping.js`(新)+ `src/data/competitorDataExtended.js`(包装层,不改原 5756 行 competitorData.js)

**Schema**:
```js
{
  foreignModel: 'ZF W2050',
  brand: 'ZF Marine',
  power_kW: 1850, ratios: [...], inputSpeed_rpm: 1800,
  weight_kg, dimensions, classifications: ['CCS','DNV','ABS','LR','BV'],
  referencePrice: {
    USD: { min: 90000, max: 105000 },
    year: 2024,
    disclaimer: '参考价仅作对位估算, 实际以厂商报价为准'
  },
  hangchiMatches: [
    { model: 'HCT2700', confidence: 'high', reason: '功率/速比/输入转速三参数对齐' }
  ],
  dataSource: 'ZF Marine Catalog 2023',
  lastVerified: '2026-05-02'
}
```

**40+ 型号映射**: ZF W325/W650/W1000/W1500/W2050/W3000/W4500 ↔ HC400/HC600/HCD600/HC1000/HCT1100/HC2000/HCT2700; Reintjes WAF 365L/565L/665L/1665L/2245L · LAF 5750 ↔ GW 系列; Twin Disc MG-507/5114SC/5202SC/5301 ↔ HCM 系列; Masson Marine W3300/W7800; Kanzaki KMH 小型 ↔ MV/MA。

**接入 UI**: `src/components/competitor/ParametricCompareView.js` 新 Tab。工况输入(功率 / 转速 / 速比)→ `findEquivalentSet(input)` 同时返回杭齿+ZF+Reintjes+Twin Disc 候选 + 价差表(CNY/USD/EUR)+ 醒目免责横幅。

### 3.3 B3 · 标准船型库

**文件**: `src/data/standardVesselTypes.js`(新)

**17 船型**: bulker(Handysize/Handymax/Panamax/Capesize) · container(Feeder/SubPanamax/Panamax/PostPanamax/ULCV) · tanker(LR1/LR2/Aframax/Suezmax/VLCC) · chemical · gasCarrier · roPax · tug · AHTS · PSV · workboat。

**Schema** 含 `loa / dwt / displacement / serviceSpeed / cb方形系数 / propeller(数量+类型+直径+转速) / typicalEngineRange / typicalGearboxRatio / commonSetups[]`。

**commonSetups 来源**: 一次性脚本 `scripts/backfill-vessel-from-market.js` 从 `marketEnrichment.json`(533 销售+469 采购+197 合同 → 103 型号 hash=erp-2026-04)真实订单脱敏聚合(仅型号+功率,不暴露客户/项目)。

**接入 UI**: `src/components/EnhancedSelectionForm/` 新增 "QuickByVesselType" Mode toggle,选 Capesize 散货 → 自动填 18000kW/95rpm/4.5:1。

**接入算法**: `src/utils/propulsionMatchingSolver.js` 把现有 8 类硬编码 `vesselDB` 替换为引用 `standardVesselTypes.js`。

### 3.4 B4 · IMO 合规引擎

**文件**: `src/utils/imoComplianceEngine.js`(facade,新)

**复用**: `src/utils/energyEfficiencyCompliance.js`(789 行,已有 EEXI + CII Phase 3)。

**新增**: EEDI(MEPC.328(76) Phase 3)
```
EEDI = (Pme·CFme·SFCme + Paeli·CFae·SFCae - effPTI·CFeff·SFCeff - Σ(feff·Peff·CFeff·SFCeff))
       / (fi·fc·fl·Capacity·fw·Vref)
```

**API**:
```js
evaluateCompliance({ vesselType, dwt, vRef, engineId, gearboxModel, cppOrFpp }) {
  const Pme = getOutputPower(engineId, gearboxModel) * 0.985;  // 齿轮箱效率
  return {
    eexi: { attained, required, compliant },
    eedi: { attained, required, compliant, imoVersion: 'MEPC.328(76)/2023' },
    cii: { rating: 'A'|'B'|'C'|'D'|'E', attained, required },
    recommendations
  };
}
```

**减排建议**:
- 超 10% → EPL 限功率 + 节能装置(PBCF/前置导管/球鼻艏)
- 超 20% → 双燃料(LNG/Methanol) 或更高效齿轮箱
- CII D/E → 立即降速 0.5kn + 船体清洁

**接入 UI**: `src/components/EnhancedGearboxSelectionResult.js` 新增 "IMO 合规评估" 卡片,显示 EEXI/EEDI/CII 三项及评级。

---

## 4. 阶段 C 工程加固与可观测性

### 4.1 C1 · 虚拟滚动

- `EnhancedGearboxSelectionResult.js` 多卡片(>20)用 `react-window` `FixedSizeList`
- `CompatibilityMatrixView.js` 585 型号矩阵用 `FixedSizeGrid`
- `DataQuery.js` 长列表
- **效果**: Slow 4G FCP 从 ~5s 降到 < 3s

### 4.2 C2 · 主算法 E2E 测试

新增 3 个测试文件:

| 文件 | 用例 | 覆盖 |
|---|---|---|
| `src/utils/__tests__/cppSelectionAlgorithm.test.js` | 36 | CPP 算法 5 函数全覆盖(齿轮箱/调距桨/配油器/液压单元/系统组装) |
| `src/utils/__tests__/selectionAlgorithm.boundaries.test.js` | 23 | transferCapacity ×0.95/×1.0/×1.05/×1.25/×1.5/×2.0 + 5 速度矩阵 + T=9550·P/n 扭矩 + 推力 |
| `e2e/selection-to-contract.spec.js` | 8 用例 × 2 项目 = 16 | 选型→报价→合同→PDF→localStorage 链路守卫 |

**总测试**: 1144 全绿(45 suites)。

### 4.3 C3 · Sentry DSN + ErrorBoundary

- `.env.production` 配 `REACT_APP_SENTRY_DSN`
- `src/components/ErrorBoundary.js` `componentDidCatch` 调 `Sentry.captureException(error, { extra: errorInfo })`(复用 `src/config/sentry.js#captureException`)
- 30 秒内 Sentry dashboard 验证

### 4.4 C4 · 缓存破坏 + 性能预算

- `service-worker.js` 切 `workbox` runtime: JS/CSS NetworkFirst 5s 回 cache · JSON CacheFirst 24h
- `package.json#bundlesize`: main < 800KB gzipped, vendor < 1.2MB
- Lighthouse CI 阈值: Slow 4G FCP < 2s, LCP < 3s, TTI < 5s
- `completeGearboxData.js`(906KB)按需 import: 启动只载 metadata, 详情懒加载

### 4.5 C5 · a11y

- `<Modal>` 全量加 `aria-modal="true"` + `role="dialog"` + `focus-trap-react`
- `CommandPalette.js` 键盘导航(↑↓+Enter+Esc)复核
- `<label htmlFor>` 对齐 `<input id>`
- `eslint-plugin-jsx-a11y` 全量扫描修复

### 4.6 C6 · Playwright E2E + GitHub Actions

- `e2e/full-selection-flow.spec.ts` — 登录 → Capesize → MAN 9L27/38 → 选齿轮箱 → IMO → 报价 → 合同 PDF
- `e2e/competitor-compare.spec.ts` — ZF/Reintjes/HC 三方对比
- `e2e/selection-to-contract.spec.js` — 链路守卫(本次新增)
- GitHub Actions 每 PR 跑

---

## 5. 部署与回滚

### 5.1 标准部署(原子)

```bash
cd /Users/lidder/gearbox-new
./scripts/deploy/atomic-deploy.sh
```

脚本流程:
1. `CI=false npm run build` 构建
2. `npm test -- --watchAll=false` 全套测试(失败即终止)
3. `rsync` 到 `/var/www/html/gearbox-app-<时间戳>/`
4. `ln -sfn` 原子切换 + `nginx -s reload`
5. 保留最近 3 版,旧版 `xargs rm -rf`
6. `curl` 烟测在线页面

### 5.2 回滚

```bash
# 1) 列出可用版本
ssh -i ~/.ssh/wxx.pem root@47.99.181.195 "ls -dt /var/www/html/gearbox-app-*"

# 2) 切到旧版本(替换 <旧TS>)
ssh -i ~/.ssh/wxx.pem root@47.99.181.195 \
  "ln -sfn /var/www/html/gearbox-app-<旧TS> /var/www/html/gearbox-app && nginx -s reload"

# 3) 验证
curl -fs https://qj-gearbox.duckdns.org/gearbox-app/index.html | grep -q '齿轮箱选型'
```

### 5.3 fallback: 旧 deploy.sh

仍保留(带 chattr 锁定保护),用于服务器特殊故障下的强制覆盖:
```bash
cd /Users/lidder/gearbox-new && ./deploy.sh
```

---

## 6. 认证凭据管理

### 6.1 首次生成 admin / user 哈希

```bash
cd /Users/lidder/gearbox-new

# 首次: 不传 salt, 自动生成 32 字节 hex
node scripts/generate-auth-hash.js admin <admin密码>
# 输出:
# REACT_APP_AUTH_SALT=<32 字节 hex>
# REACT_APP_ADMIN_HASH=<PBKDF2 哈希>

# 用同一 salt 生成 user
node scripts/generate-auth-hash.js user <user密码> <上一步生成的 salt>
# 输出:
# REACT_APP_USER_HASH=<PBKDF2 哈希>
```

将 3 行写入 `.env.production`(部署专用)或 `.env.local`(本地开发)。

### 6.2 修改密码

重新生成对应账号哈希并替换 `.env.production` 中的对应行,然后重新 build + deploy。

### 6.3 SALT 不要改

如需更换 SALT,所有账号哈希必须重新生成。否则现有用户全部无法登录。

### 6.4 验证

`process.env.REACT_APP_AUTH_SALT` / `REACT_APP_ADMIN_HASH` / `REACT_APP_USER_HASH` 任一缺失,登录页直接报"系统未配置 ..., 请联系管理员",拒绝登录(无 fallback)。

---

## 7. 测试与验证

### 7.1 单元测试

```bash
cd /Users/lidder/gearbox-new

# 全套
CI=true npm test -- --watchAll=false

# 单一模式
CI=true npm test -- --testPathPattern=cppSelectionAlgorithm --watchAll=false
CI=true npm test -- --testPathPattern=selectionAlgorithm.boundaries --watchAll=false
CI=true npm test -- --testPathPattern=safeParseGearboxBlob --watchAll=false
```

期望: **45 suites / 1144 tests 全绿**。

### 7.2 Playwright E2E

```bash
cd /Users/lidder/gearbox-new

# 全套
npx playwright test --project=chromium

# 仅链路守卫
npx playwright test selection-to-contract --project=chromium

# 列出所有 spec
npx playwright test --list
```

### 7.3 投产前完整冒烟清单

```bash
# 1. Build 全绿
CI=false npm run build

# 2. 单测全绿
CI=true npm test -- --watchAll=false

# 3. Lint 0 error
npm run lint

# 4. 数据库校验
node scripts/validate-engine-db.js

# 5. Playwright 主流程
npx playwright test e2e/full-selection-flow.spec.ts --project=chromium
npx playwright test selection-to-contract.spec.js --project=chromium

# 6. Bundle 预算
npx bundlesize

# 7. Lighthouse(可选)
npx lighthouse https://qj-gearbox.duckdns.org/gearbox-app/ --only-categories=performance
```

### 7.4 安全 grep 复检

```bash
# 1. 0 命中无修饰 _blank
grep -rn "window.open.*_blank[^,)]*)" src/

# 2. 0 命中 new Function
grep -rn "new Function(" src/

# 3. sessionStorage 仅密文
# 浏览器 DevTools → Application → sessionStorage → 验证 gearbox_auth_session 是 base64 密文
```

---

## 8. 数据扩展指南

### 8.1 添加新发动机型号

1. 编辑 `src/data/marineEngineDatabase.js`,按 schema 追加对象
2. 必填字段(confidence='A'): id / brand / series / model / ratedPower_kW / ratedSpeed_rpm / dataSource / lastVerified
3. 可选: torqueCurve(B/C 级允许缺失)
4. 运行 `node scripts/validate-engine-db.js` 检查
5. 重新 build + deploy

### 8.2 添加海外齿轮箱映射

1. 编辑 `src/data/foreignGearboxMapping.js`
2. **必填**: foreignModel, brand, dataSource, lastVerified, referencePrice.year, referencePrice.disclaimer
3. **价格**: 仅区间(min/max),不点估
4. **hangchiMatches**: 至少 1 条 confidence='high'/'medium'/'low' 候选
5. 重新 build + deploy

### 8.3 添加船型

1. 编辑 `src/data/standardVesselTypes.js`
2. commonSetups 必须脱敏(仅型号+功率,不含客户/项目)
3. 重新 build + deploy

### 8.4 调整 IMO 合规阈值

`src/utils/energyEfficiencyCompliance.js` 内 `imoVersion` 字段标注当前用的 MEPC 决议;月度复核 IMO MEPC 是否更新系数。

---

## 9. 故障排查

### 9.1 登录页报"系统未配置 REACT_APP_AUTH_SALT"

环境变量缺失。检查 `.env.production` 三行齐全。重新 build + deploy。

### 9.2 启动白屏 + FatalScreen "数据库校验失败"

`completeGearboxData.js` 必填字段缺失率 > 5% 或型号数 < 500。

```bash
# 检查具体缺失
node scripts/audit-data/check.js
node scripts/check-data-drift.js
```

### 9.3 Playwright 测试在 CI 失败但本地通过

- baseURL 是 `http://47.99.181.195/gearbox-app/`,CI 网络可能阻断
- 检查 selectors 是否依赖 React hydration,可能需要 `waitForLoadState('networkidle')`
- 失败时查看 `playwright-report/` 截图 + trace

### 9.4 Sentry 收不到事件

- 检查 `REACT_APP_SENTRY_DSN` 已注入构建
- 浏览器 DevTools → Network 看是否有 ingest.sentry.io 请求
- ErrorBoundary 仅捕获渲染错误,事件 handler 内的 throw 需要手动 captureException

### 9.5 atomic-deploy.sh 失败

- ssh 失败: 检查 `~/.ssh/wxx.pem` 权限(应 600)
- rsync 失败: 检查服务器磁盘空间 `df -h`
- nginx reload 失败: ssh 进服务器 `nginx -t` 看配置错误
- 烟测 curl 失败: 自动不删旧版本,可手动 `ln -sfn` 回滚

### 9.6 noopener ESLint 误报

`window.open(url, '_blank', 'noopener,noreferrer')` 是合法写法,被规则阻止的是 `window.open(url, '_blank')` 两参数版本。如需绕过(极特殊场景),用 `// eslint-disable-next-line no-restricted-syntax` 但必须在 PR 描述中说明理由。

---

## 10. 附录: 文件清单

### 10.1 新增文件

| 类型 | 路径 |
|---|---|
| 数据 | `src/data/marineEngineDatabase.js` |
| 数据 | `src/data/foreignGearboxMapping.js` |
| 数据 | `src/data/standardVesselTypes.js` |
| 数据 | `src/data/competitorDataExtended.js`(包装层) |
| 工具 | `src/utils/safeParseGearboxBlob.js` |
| 工具 | `src/utils/imoComplianceEngine.js` |
| 组件 | `src/components/competitor/ParametricCompareView.js` |
| 测试 | `src/utils/__tests__/safeParseGearboxBlob.test.js` |
| 测试 | `src/utils/__tests__/cppSelectionAlgorithm.test.js` |
| 测试 | `src/utils/__tests__/selectionAlgorithm.boundaries.test.js` |
| 测试 | `e2e/selection-to-contract.spec.js` |
| 脚本 | `scripts/codemod-window-open.js` |
| 脚本 | `scripts/validate-engine-db.js` |
| 脚本 | `scripts/backfill-vessel-from-market.js` |
| 脚本 | `scripts/deploy/atomic-deploy.sh` |
| 脚本 | `scripts/generate-auth-hash.js` |

### 10.2 修改文件

| 路径 | 变更 |
|---|---|
| `src/contexts/AuthContext.js` | A3 PBKDF2 + 删 fallback |
| `src/utils/repair.js` | A4 blocking 返回 |
| `src/index.js` | A4 渲染前阻断 |
| `src/utils/mergeGearboxData.js` | A2 替 new Function |
| `src/components/GearboxDataImporter.js` | A2 替 new Function |
| `src/utils/selectionAlgorithm.ts` | B1 真实 SFC 接入 |
| `src/components/EnhancedSelectionForm/EngineInfoSection.js` | B1 Autocomplete |
| `src/utils/propulsionMatchingSolver.js` | B3 替换 vesselDB |
| `src/components/EnhancedGearboxSelectionResult.js` | A1 + B4 + C1 |
| `src/utils/energyEfficiencyCompliance.js` | B4 补 EEDI |
| `src/components/ErrorBoundary.js` | C3 Sentry hook |
| `src/service-worker.js` | C4 workbox |
| `package.json#eslintConfig` | A1 防回归规则 |
| `.env.example` | A3 PBKDF2 三项必填注释 |
| 16 文件 | A1 window.open 加 noopener |

### 10.3 关键命令速查

| 操作 | 命令 |
|---|---|
| 构建 | `CI=false npm run build` |
| 单测全套 | `CI=true npm test -- --watchAll=false` |
| Playwright | `npx playwright test --project=chromium` |
| 部署(原子) | `./scripts/deploy/atomic-deploy.sh` |
| 部署(fallback) | `./deploy.sh` |
| 生成认证哈希 | `node scripts/generate-auth-hash.js <user> <pass> [salt]` |
| 数据校验 | `node scripts/validate-engine-db.js` |
| 价格审计 | `node scripts/audit-price-coverage.js` |
| Bundle 预算 | `npx bundlesize` |

---

## 维护

- **方案档案**: `~/.claude/plans/fluttering-coalescing-finch.md`
- **架构规则**: `CLAUDE.md`(根目录)
- **本文档维护**: 每次 v66+ 投产时更新里程碑表与文件清单。
- **IMO 合规**: 按 schema `imoVersion` 字段月度复核 MEPC 决议。
- **价格年报**: `referencePrice.year` 每年 12 月统一更新(海外厂商目录)。
