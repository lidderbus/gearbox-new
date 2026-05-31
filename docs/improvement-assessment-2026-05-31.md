# gearbox-app 选型SPA 提升评估 — 验证后 backlog

生成: 2026-05-31 · 多智能体评估(12域×深读+对抗验证) · 109 条存活发现 (P0:11 P1:50 P2:48) · 0 条违反口径护栏被驳回

> 口径护栏: 选型校核不加K_A(手册已含安全系数) · 不臆造无数据工程指标 · 不改src/data schema · 价格走priceFormatter询价兜底


## P0 (11)

### P0-1 [accuracy·M·conf:high] CII 评级用硬编码绝对阈值(5/10/15/20), 完全无视船型与载重 — 评级几乎永远错
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: src/utils/energyEfficiency.js:444-450 `let rating='C'; if(rounded<=5)rating='A'; else if(rounded<=10)rating='B'; else if(rounded<=15)rating='C'; else if(rounded<=20)rating='D'; else rating='E';`。这是 EnergyDashboard.js:474 主仪表盘实际调用的 calculateCII。而同仓另一份 energyEfficiencyCompliance.js:377-409 才是正确实现(CII_ref = a×Cap^-c, 再乘 CII_RATING_BOUNDARIES 年度系数得 A/B/C/D 边界)。单测 energyEfficiency.test.js:214 还把 attainedCII≈1.0→'A' 固化成'正确'(其实只因 1.0<=5)。
- **问题**: IMO MEPC.354(78) 的 CII 评级是相对参考线的: 同一个 attained CII 值, 散货船可能是A、邮轮可能是E。用固定绝对阈值意味着评级与船型/吨位/年份脱钩, 给船东的 A-E 等级基本是错的(且 EnergyDashboard 的 CII 仪表盘指针位置也据此错排)。一个船舶选型工具给出错误的 CII 合规等级会直接误导购买/改造决策。
- **提升**: 让 EnergyDashboard 改调 energyEfficiencyCompliance.js 的 calculateCII(传 shipType/capacity/annualFuelConsumption/annualDistance/year), 复用其 CII_REFERENCE_COEFFICIENTS + CII_RATING_BOUNDARIES 得到船型相关边界; 或把 energyEfficiency.js 的 calculateCII 重写为同款相对评级。同时修正 energyEfficiency.test.js 中固化错误阈值的断言。两份 CII 实现应合并为一份权威实现。
- **风险**: 改后等级会变化, 需用几个已知船例(如 50000DWT 散货船)对账 CCS/IMO 官方边界; 不改则持续输出错误合规结论。
- **复核**: unverified

### P0-2 [accuracy·M·conf:high] 销售合同行项单价/金额取 gearbox.marketPrice 原始值,绕过 priceFormatter 询价兜底 → 404缺价型号合同里裸渲染¥0
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/contractGenerator.js:100-101 `unitPrice: gearbox.marketPrice || gearbox.factoryPrice || 0, amount: gearbox.marketPrice || gearbox.factoryPrice || 0`(联轴器140-141、泵159 同样 `||0`)。此处 gearbox 是 useExportHandlers.js:148 直接透传的 selectedComponents.gearbox(未经 useQuotationHandlers.js:94 的 correctPriceData 处理),对 CLAUDE.md 记录的404个缺价型号 marketPrice/factoryPrice 均无值→落到 0。contractExporter.js:832 的校验仅 `warnings.push('缺少有效单价')` 不阻断,合同照常导出¥0行项。
- **问题**: 项目已为报价单建了完整的 priceFormatter.getPriceBadge()/lookupPriceByModel() 询价兜底(含GW公式+去后缀反查),但合同链路完全没接,等于把'勿渲染¥0'的铁律只落实了一半。销售把缺价型号走到合同页会得到一份单价¥0的销售合同,极易误发客户。
- **提升**: contractGenerator.js 生成 products 时,对每个组件价格走 priceFormatter.lookupPriceByModel(model) 兜底: 有价用真实值,无价时 unitPrice/amount 置为字符串'询价待定'并在 remarks 标注,且让 contractExporter.validateContract 对'询价待定/0价'升级为 error 级(或在 ContractView 顶部挂醒目红条)阻止直接导出含¥0合同。
- **风险**: 需保证 totalAmount 与行项口径一致(见下条);阻断导出前给销售明确提示去补价。
- **复核**: unverified

### P0-3 [data-gap·M·conf:high] 数据备份工具的键名错配 + 漏备 IndexedDB,导致『成功备份』是假象
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: DataBackupView.js:6-14 的 DATA_SOURCES 用 keyPattern 'contractData'(合同)、'projects'(项目)、'priceHistory'(价格变更);但全仓搜索:合同真实键是 cm_contracts/QuoteDB(无 'contractData' 写入)、价格历史真实键是 'gearbox_price_history'(priceHistoryTracker.js:8),'priceHistory'/'contractData'/'projects' 在源码里没有任何 setItem。且 handleBackup line 63-68 只遍历 `d.storage==='localStorage'`,line 12 列的 QuoteDB(IndexedDB,真实报价库)被静默跳过,handleRestore 同样只写 localStorage。
- **问题**: 备份导出的 JSON 里合同/项目/价格历史几乎恒为空(键不存在),真实报价库 QuoteDB 根本没被导出。用户点了『导出备份文件』、看到绿色『上次备份』提示,实际丢了最关键的合同与报价数据 —— 灾难恢复时才会发现备份是空壳。
- **提升**: ①修正 keyPattern:合同→读 cm_contracts(及实际使用的键)、价格历史→'gearbox_price_history'、项目→核实真实键;②给 QuoteDB 实现真正的 IndexedDB 导出(openDB→getAll→塞进 backup.__indexeddb__.QuoteDB),restore 时回灌;③备份前对每个源做『有数据/0条』校验,0条的源在UI红色警告而不是默默成功。
- **风险**: restore 直接 localStorage.setItem 覆盖且无版本校验(line 95-97),错误备份文件会污染现有数据;建议 restore 前先自动导出一份当前快照兜底。
- **复核**: unverified

### P0-4 [professionalism·M·conf:high] 角色权限管理页与系统真实RBAC完全脱节,是『假权限开关』
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: RoleManagement.js 把角色/用户/权限写入 'rbac_config'/'rbac_users'/'rbac_audit_log'(line 36-38),全仓搜索 rbac_config/rbac_users 只命中 RoleManagement.js 自己——没有任何 guard/路由/菜单读取它。系统真实的权限判断走的是另一套 auth/roles.js 的 hasPermission(userRole, permission)(见 OperationAuditLogView.js:278、useLibraryPermissions.js、ProtectedRoute.js),两套 permission key 都对不上(RoleManagement用 selection/quotation/pricing... vs roles.js 用 MANAGE_USERS/SYSTEM_SETTINGS/LIBRARY_*)。
- **问题**: 管理员在这个页面上把『销售工程师』的某权限关掉,什么都不会发生——真实访问控制根本不读这份配置。这是安全/合规上极具误导性的演示UI:看似能配权限,实际是空操作,管理员会误以为已经限制了某角色。
- **提升**: 二选一:①(推荐,工作量小)把本页改造成 auth/roles.js 的真实编辑器——读写 roles.js 的 ROLE_PERMISSIONS 映射(或落到一个被 hasPermission 读取的覆盖层 LS 键),permission key 对齐 permissions 常量;②若短期做不到贯通,则在页面顶部加醒目横幅『当前为权限规划草稿,尚未接入系统强制(实际权限以登录账号角色为准)』,避免误导。同时把 DEFAULT_USERS(admin/zhangsan/lisi 假数据 line 30-34)换成真实账号或留空。
- **风险**: 若选①直接改真实RBAC,要确保不会把当前登录管理员自己锁死(保留 admin 全权兜底)。
- **复核**: unverified

### P0-5 [accuracy·S·conf:high] CPP 水动力计算被错配参数名调用 → thrust/torque/eta0 全为 NaN(整页水动力分析失效)
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: CPPSelectionView.js:93-100 调用 calculateHydrodynamics({power, speed: outputSpeed, propellerDiameter, Va, wakeField, propellerData}); 但 cppHydrodynamics.js:546-555 的函数签名解构的是 {power, engineSpeed, gearRatio, propellerDiameter, shipSpeed, vesselType, bladeGeometry}。即组件传的 speed/Va/wakeField/propellerData 这些 key 函数根本不读: engineSpeed=undefined, gearRatio=undefined → 第563行 propellerRPM=engineSpeed/gearRatio=NaN → 第564行 n=NaN → calculateThrust/calculateTorque 返回 NaN; 同时 shipSpeed 走默认 0(组件算好的 Va 被丢弃), vesselType 走默认 'tug'(忽略用户选的船型), bladeGeometry 走默认(忽略所选桨的真实盘面比/桨距比)。
- **问题**: CPP 选型主界面的'水动力分析'卡(推力/扭矩/敞水效率η0/KT/KQ)与下游 efficiencyResult(用 hydrodynamicsResult.eta0)全部基于 NaN 或硬编死的 tug 伴流系数。一线工程师看到的推力、效率数字是错的/空的, 而这恰是 CPP 选型最核心的输出。
- **提升**: 把 CPPSelectionView.js:93-100 的入参改为函数真实签名: {power: powerVal, engineSpeed: speedVal, gearRatio: selectedGearbox.selectedRatio||..., propellerDiameter: D, shipSpeed: Vs*0.5144, vesselType: 映射到 vesselWakeCoefficients 的 key, bladeGeometry: selectedPropeller.bladeGeometry}。这样函数内部会自行算 propellerRPM/n/Va, 输出真实 KT/KQ/η0。改后须实跑确认 hydrodynamicsResult.performance 不再 NaN。
- **风险**: 纯前端入参修正, 不改算法/数据结构; 风险低。须浏览器实跑一次确认数值合理(thrust 量级 kN)。
- **复核**: unverified

### P0-6 [accuracy·S·conf:high] CPP 工况点分析 analyzeOperatingPoints 同样被错配 systemConfig → 各工况推力/扭矩 NaN
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: CPPSelectionView.js:136-144 组装 systemConfig={gearbox, propeller, propellerDiameter:D, propellerSpeed:outputSpeed} 后调用 analyzeOperatingPoints(systemConfig); 而 cppHydrodynamics.js:902-936 解构 {power, engineSpeed, gearRatio, propellerDiameter, vesselType, bladeGeometry}, 第920行 propellerRPM=engineSpeed/gearRatio=undefined/undefined=NaN, 第923行 Va=J*n*D=NaN → 内部 calculateHydrodynamics 全 NaN。组件传的 propellerSpeed/gearbox/propeller 这几个 key 函数都不读。
- **问题**: 系泊/自由航行/机动/紧急倒车/拖网 5 个工况点表(经 OperatingPointsChart 渲染)全部 NaN。对拖轮/AHTS 而言系泊工况(J=0, bollard pull)是最关键卖点, 这里却拿不出有效数字。
- **提升**: 改 systemConfig 为 {power: parseFloat(power), engineSpeed: parseFloat(speed), gearRatio: selectedGearbox.selectedRatio||..., propellerDiameter: D, vesselType: 映射 key, bladeGeometry: selectedPropeller.bladeGeometry}。函数内部 operatingConditions 已含 J 值反算船速, 修参数后即出真实多工况推力曲线。
- **风险**: 同上, 纯入参修正。注意 'crash' 工况无 J 字段(cppSystemData operatingConditions.crash 只有 loadFactor), 反算 Va 会得 0, 属已知数据缺口可后续补 J。
- **复核**: unverified

### P0-7 [accuracy·S·conf:high] 工况系数K查表全部错配 — 下拉5档塌缩成单一默认值, 且显示的K标签全是假的
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: src/services/couplingSelectionService.js:36-42 WORK_CONDITIONS 的 value 是 'I类:扭矩稳定'/'II类:扭矩变化较小'/'III类:扭矩变化中等'/'IV类:扭矩变化较大'/'V类:扭矩变化剧烈', label 标注 K=1.3/1.5/1.75/2.0/2.25; 但 src/data/gearboxMatchingMaps.js:856-863 couplingWorkFactorMap_Factory 的键是 'I类:扭矩变化很小'/'II类:扭矩变化小'/'III类:扭矩变化中等'/'IV类:扭矩变化大'/'V类:扭矩变化很大' (factory值 1.0/1.2/1.4/1.6/1.8)。getWorkFactor (gearboxMatchingMaps.js:961-966) 用 factorMap[workCondition]||default 精确取键。实测: FACTORY模式下5个下拉项里只有'III类:扭矩变化中等'命中(返回1.4), 其余4项全部 fallthrough 到 default=1.4; JB_CCS模式下5项全部 fallthrough 到 default=2.5。即工况下拉框是无效操作, UI显示的 K=1.3/1.5/1.75/2.0/2.25 全是数据里根本不会被采用的假值。calculationDetails.kFactor (CouplingRecommendationList.js:364 '计算过程'横幅) 也跟着显示错误K。该 getWorkFactor 同时被 couplingSelection.ts:290 (selectFlexibleCoupling, 集成选型路径) 和 enhancedCouplingSelection.js:76 (独立联轴器页) 共用 → 两条选型链路全中招。
- **问题**: 联轴器所需扭矩 = 主机扭矩 × K × St, K 是核心放大系数。现在不管用户在'工况条件'下拉里选稳定还是剧烈冲击工况, 算出的所需扭矩完全一样(K恒为1.4或2.5), 选型结果不随工况变化; 更糟的是结果页'计算过程'横幅向客户展示的 K 值(如选III类显示K=1.75)与系统实际采用的K(1.4)不一致, 一线工程师/客户按显示的K复核会对不上账, 直接动摇选型可信度。这是准确性级别的硬伤。
- **提升**: 对齐键名: 把 WORK_CONDITIONS 的 value 改成与 couplingWorkFactorMap_Factory/JB_CCS 完全一致的键字符串(如 'III类:扭矩变化中等'保持, 其余4项改为 '扭矩变化很小/小/大/很大'); 或在 getWorkFactor 内加一层别名归一化映射(稳定→很小, 较小→小, 较大→大, 剧烈→很大)。同时让 label 的 K 标注从对应 map 动态生成而非硬编码(getWorkFactor 取到的真实值), 保证'显示的K=实际用的K'。加一条 jest 契约: 遍历 WORK_CONDITIONS.value 断言 getWorkFactor(v,'FACTORY') 互不相等且≠default(防回归)。注意 couplingSelection.test.js 已有用例需同步更新。
- **风险**: 改键名后历史选型/快速模板(QUICK_TEMPLATES condition 用 'III类:扭矩变化中等'已命中, 其余模板需核对)需回归; saveSelectionHistory 存的旧 workCondition 字符串可能失配, 加载老历史时走 default 兜底即可不崩。改完务必 build + 跑 couplingSelection.test.js。
- **复核**: unverified

### P0-8 [accuracy·S·conf:high] 对标竞品自动匹配用了错误的 findEquivalentCompetitors — curated equivalentHangchi 映射完全失效, 自动选出的竞品按型号数字瞎配
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: 存在两个同名函数: src/data/competitorData.js:5719 正确(用 Array.isArray + .includes 处理数组); src/utils/competitorAnalysis.js:26-53 错误(用 `p.equivalentHangchi === hangchiModel` 直接 === 比一个数组)。而 CompetitorComparisonView.js:24-26 import 的是 utils 的错误版, line 63 `findEquivalentCompetitors(product.model)` 自动选竞品。实测: 数据中全部 243 条 equivalentHangchi 都是数组(grep `equivalentHangchi: '` 0 命中), 故 === 永远 false → 必然走 fuzzy 分支(只按型号里的数字 ±30% 匹配)。实测 HC138 错误版返回 25 条(含 CGC150/FD120 这种纯靠'150''120'≈'138'凑的), 正确版只返 17 条工程对位型号; HCD400 错误版 63 条 vs 正确版 11 条。
- **问题**: 用户点选杭齿型号后系统 slice(0,3) 自动推荐的'对标竞品'是按型号字符串里的数字凑的, 工程上无意义(把 HC138 和 FD120 当等价), 直接喂给对比表/优势报告/雷达图/销售话术 → 给一线销售/工程师错误的竞品对位, 损害专业可信度。精心维护的 equivalentHangchi 字段(243 条人工映射)被白白浪费。
- **提升**: 删除 src/utils/competitorAnalysis.js:26-53 的本地 findEquivalentCompetitors, 改为从 '../data/competitorData' re-export 正确版(已处理数组);或就地修复 line 30-32 为 `p.equivalentHangchi && (Array.isArray(p.equivalentHangchi) ? p.equivalentHangchi.includes(hangchiModel) : p.equivalentHangchi === hangchiModel)`。修复后直接命中 curated 映射, fuzzy 分支仅作兜底。
- **风险**: 极低: 纯逻辑修复, 不动数据结构。修复后自动推荐竞品更少更准, 需顺带确认 UI 在 0-1 条匹配时的空态(已有 Alert 兜底)。
- **复核**: confirmed — 实地核实并跑了对照脚本, 三处证据全属实: ①src/data/competitorData.js:5719-5726 正确版用 Array.isArray ? .includes : === 处理数组; src/utils/competitorAnalysis.js:26-53 错误版只用 `p.equivalentHangchi === hangchiModel` 直接 === 比数组。②Co

### P0-9 [accuracy·S·conf:high] 合同大写金额转换器 convertToChinaNum 在整百万/整十万级金额漏'元整',产出残缺大写(法律金额错误)
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/numberConverter.js:62 `if (m === 0 && zeroCount < 4) { s += unit[0][q]; }` — 当整数以万位整零结尾(如1,000,000)时 zeroCount 已≥4,'元'单位被跳过;末位非'元'故第77行的→'整'兜底也失效。实测: convertToChinaNum(1000000)=>'壹佰万'(应为'壹佰万元整'); convertToChinaNum(1000000.5)=>'壹佰万伍角'(缺'元'); convertToChinaNum(50000000)=>'伍仟万'。该函数被 contractGenerator.js:63 `convertToChinaNum(totalAmount)+'元整'` 与 contractExporter.js:15 引用,用于销售合同/导出PDF·Word 的法定大写金额。对照: 报价单用的 quotationGenerator.js:572 numberToChinese(1000000)=>'壹佰万元整' 正确。
- **问题**: 船用齿轮箱合同金额恰恰高频落在整百万(如¥1,000,000、¥2,000,000)这类整数,而合同'合计人民币(大写)'是有法律效力的金额字段。残缺大写('壹佰万' 末尾莫名跟着外层硬拼的'元整'→'壹佰万元整'侥幸对,但含小数'壹佰万伍角'就彻底错且缺元字)会引发签约纠纷/审计退单。两套大写实现并存(numberToChinese 正确, convertToChinaNum 有bug)更易误用。
- **提升**: 删除 numberConverter.js 的 convertToChinaNum,改为复用 quotationGenerator.js 已验证正确的 numberToChinese(导出为公共util),contractGenerator.js:63 与 contractExporter.js 全部改引它;注意 numberToChinese 已自带'元/整',需去掉 contractGenerator.js:63 末尾多拼的 `+'元整'`。补一组单测覆盖 1000000/1000000.5/105000/1010000/50000000。
- **风险**: 改后须回归合同导出大写金额;去掉重复'+元整'拼接是关键否则变'壹佰万元整元整'。
- **复核**: confirmed — 实测 numberConverter.js:62 `if (m === 0 && zeroCount < 4)` 逻辑确有bug: convertToChinaNum(1000000)=>'壹佰万'(缺'元'), 1000000.5=>'壹佰万伍角'(缺'元'), 50000000=>'伍仟万'(缺'元'); 末位非'元'故第77行→'整'兜底失效。这些值靠 contractGenerator.j

### P0-10 [accuracy·S·conf:high] 应收账款页同屏显示两套互相矛盾的坏账计提总额
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: ReceivablesManagement.js KPI卡 line 261-262 显示 `坏账计提总额 ¥{stats.totalProvision}`,其来源 receivables.js:320-330 只有3档(1年内0% / 1-2年20% / 其余一律100%);但同页『坏账计提明细』表 ReceivablesManagement.js:112-130 用4档(<1年5% / 1-2年20% / 2-3年50% / >3年100%)算出 provisionDetail.totalProvision,并在 line 775 表尾再显示一个合计。两个总额口径不同(尤其2-3年:KPI按100%、明细表按50%,且KPI对1年内0%、明细表5%),同一屏给出两个不同的坏账计提金额。
- **问题**: 财务口径自相矛盾,销售/财务看到两个不同的坏账计提总额会无法决策,且哪个都不对(2-3年既不是50%也不是100%是随意取的);属于会被老板审计直接打回的准确性bug。
- **提升**: 统一为单一计提口径:在 receivables.js 增加 2-3年(twoToThree)档并把比率表抽成单一常量 PROVISION_RATES={current:?,oneToTwo:0.2,twoToThree:?,overThree:1.0},calculateReceivablesStats 与 provisionDetail 都引用它;比率值需老板/财务确认(常见账龄计提:1年内5%、1-2年20%、2-3年50%、3年以上100%)。KPI卡与明细表渲染同一个 totalProvision。
- **风险**: 改的是展示口径,不动真实总账(真实以用友为准);需在页面顶部加一句『计提比率为内部估算,实际以财务总账为准』避免被当成法定数字。
- **复核**: confirmed — 实读两处源码均属实。KPI卡 ReceivablesManagement.js:262 显示 stats.totalProvision,其来源 receivables.js:322-330 calculateReceivablesStats 仅3档(current 0% / oneToTwo×0.2 / else×1.0)。更严重的是 calculateAging(receivables.js:1

### P0-11 [accuracy·S·conf:high] 船级社认证矩阵用'示例数据'冒充杭齿真实认证状态, UI无任何免责声明
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: src/components/CertificationView.js:31 注释明写 `// 杭齿产品认证状态（示例数据）`, 紧接 PRODUCT_CERTS 给出 HC/GWC/HCD 等 10 个系列对 CCS/DNV/BV/LR/ABS/NK/KR/RS/RINA/IRS/PRS 11 社的 true/false 矩阵 (line 32-43, 如 'GWC系列 ... nk:true,kr:true,rs:true,rina:true,irs:true,prs:true'); 但 UI 渲染时 Card.Header 标题是 '杭齿产品认证矩阵'(line 84), 表格用 `bi-check-circle-fill text-success` 绿勾呈现(line 109), 全组件 grep 无 '示例/参考/仅供/以...为准' 任何用户可见免责横幅(仅代码注释)。
- **问题**: 销售/工程师看到的是一张权威感十足的'已通过认证'绿勾矩阵, 会据此向船东/船厂承诺'本系列已持有 XX 船级社认可'。若实际未持证(示例数据本就是编造的占位), 构成虚假合规承诺, 在投标/合同环节是真实商业与法律风险。这正是项目铁律'不臆造无数据指标'在合规域的体现。
- **提升**: 二选一: ①(快, 推荐先做)在 CertificationView 顶部加常驻黄色 Alert: '本认证矩阵为示意框架, 具体型号-船级社持证情况以杭齿质量部最新有效证书为准, 投标前请向 [质量部] 核实', 并把绿勾改为灰色'待核实'或加'?'角标; ②(根治)把 PRODUCT_CERTS 替换为质量部提供的真实型式认可证书清单(证书号+签发日+有效期+覆盖型号范围), 接 classificationCompliance.js 已有的 checkCertificationStatus(含 validity/daysRemaining/expiringSoon 逻辑, line 730-761)显示到期预警。改 src/components/CertificationView.js, 不动 src/data/。
- **风险**: 若直接删示例数据会让页面空, 应先加免责横幅再逐步替换真值; 真值需向老板/质量部索取, 不可编造。
- **复核**: confirmed — CertificationView.js:31 注释明写 `// 杭齿产品认证状态（示例数据）`, PRODUCT_CERTS (line 32-43) 给出 HC/HCD/GWC 等 10 系列对 11 社的 true/false 矩阵 (如 GWC系列 ccs..prs 全 true)。UI: line 82 Card.Header 标题 '杭齿产品认证矩阵', line 109 用 `bi-


## P1 (50)

### P1-1 [data-gap·L·conf:high] marineEngineDatabase 仅15条且缺旗舰品牌(康明斯/卡特中国机), 录入计划停滞
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: marineEngineDatabase.js:11 注释明写 '录入计划: P0 50热销(本文件15条, 待补35条)→P1 150→200+', 但实际仅15条(grep ratedPower_kW=15)且 confidence A11/B4(无C); 品牌分布(grep brand)= MAN2/Wartsila2/MTU2/CAT2/Weichai2/Yuchai1/Yanmar1/Mitsubishi1/SDEC1/Volvo1, 完全没有 Cummins(grep Cummins 仅注释命中)。而 CumminsMatchingView 全页围绕康明斯, EngineMatchingExpanded.js:53 也把康明斯列 tier1 旗舰。
- **问题**: 最权威的富数据库覆盖率仅 15/200(7.5%), 且把系统最主打的康明斯漏在外, 导致 EngineInfoSection 智能选择(:112 '库内15型号')对销售几乎没用——查康明斯/玉柴常用机型大概率查不到, 只能手填。这是'好架构空载'。
- **提升**: 按注释计划补录: 优先把 EngineMatchingExpanded.ENGINE_DATA 里已有的康明斯16条 + 潍柴/玉柴常用机, 用厂商 Project Guide 补 torqueCurve(无完整曲线的标 confidence='C'+只填额定点, 符合 :8 schema允许缺省), 让 marineEngines 至少覆盖国内成交TOP30主机。每条带 dataSource/confidence。不改 schema。
- **风险**: 录入需查一手资料, 工作量真实; 缺曲线的机型必须诚实标 confidence C/待补, 不可为凑数编造扭矩点。
- **复核**: unverified

### P1-2 [missing-feature·L·conf:high] 移动端(<768px)整站只暴露 5 个 Tab，60+ 桌面模块只能"切到桌面版"，且断点把平板也算移动
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/mobile/MobileApp.js:37-43 `TAB_CONFIG` 仅 HOME/SELECTION/PRODUCTS/DOCS/PROFILE 五项；DOCS 等深层功能靠 MobileApp.js:58-62 `switchToDesktopAt`(写 forceDesktop=true 后 reload 进桌面版)。AppWrapper.js:55 `showMobile = isMobile && !forceDesktop` 且 useIsMobile.js:57 `isMobile: width < 768`。
- **问题**: 移动端原生只覆盖 选型/产品/文档/我的，报价单、技术协议、扭振、竞品对比、项目追踪、售后等几十个模块在手机上没有原生入口，只能跳桌面版(reload+小字横向滚动)，一线在船厂/现场用手机时体验割裂。另外 768px 断点把竖屏平板(768–1024)也判成移动版小 Tab，反而损失了平板本可用的桌面布局。
- **提升**: ①MobileApp 增加一个『更多/全部功能』Tab(或 Profile 内列表)，列出桌面 NAV_GROUPS 中适合移动浏览的只读模块(报价查看、协议查看、外形图、案例、项目追踪)直接以移动卡片渲染，而非 reload 进桌面；②把 showMobile 的断点从 768 降到 600(或对 768–1024 平板默认走桌面版+提供切换按钮)，让平板拿到信息密度更高的桌面布局。
- **风险**: 中。扩 MobileApp 需复用 appData，断点调整影响平板默认视图，需多设备回归。
- **复核**: unverified

### P1-3 [data-gap·L·conf:high] 库存/应收数据是一次性硬编码审计种子,与真实业务数据不贯通且会过期
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: inventory.js:107-179 initialInventory 只有5条写死项(基于『审计报告2025-10-31』注释),receivables.js:148-289 initialReceivables 是12条写死的2020-2023年发票。两者首次加载即 setItem 进LS后就脱离来源、永不更新(InventoryManagement.js:54-75 只在LS为空时用种子)。应收里的客户(申佳船厂/镇江索普等)与系统真实 cm_contracts/gearbox_quotations 客户库无任何关联;库存5项也与696型号产品库、订单出库无联动。
- **问题**: 账龄是按 calculateAging 用『今天 - invoiceDate』实时算的(receivables.js:108-120),2021年的发票随时间推移账龄会一直涨但金额永远是种子值,越用越假;库存出库不会因真实订单发货而减少。这些页面对一线是『看起来有数据但都是历史快照』,无法用于真实运营决策。
- **提升**: ①应收:提供从真实发票/合同(gearbox_quotations converted、cm_contracts)反向生成应收的『同步/导入』入口,种子仅作空库时引导;②库存:出库单可关联订单号(createStockDocument 已留 relatedOrder 字段但UI未用,inventory.js:67),做发货自动扣减;③至少在两页顶部标注『数据来源:2025-10-31审计快照,非实时』,不冒充实时。
- **风险**: 对接真实数据需确认权威源口径(发票vs合同),不可臆造;过渡期保留种子+诚实横幅最安全。
- **复核**: unverified

### P1-4 [info-completeness·M·conf:high] 扭矩曲线/SFC油耗/EIAPP等已采集的工程数据在匹配结果中从不展示
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: marineEngineDatabase.js:116-122 每台机有完整 torqueCurve(60/75/85/100/110%工况点含 sfc_g_kWh) + :124 eiapp + :125 fuel; engineDatabaseUtils.js:67 interpolateAtRpm 已实现按 rpm 在曲线上线性插值返回 power_kW+sfc。但 grep `torqueCurve|sfc_g_kWh|interpolateAtRpm` 在 src/components 仅命中 imo/cpp/Energy 三个无关面板; EngineMatchingExpanded 的结果卡(:741-784)只显示型号/减速比/富裕量/推力/价格, EngineInfoSection 选中主机后(:116-130)只显排放等级+confidence徽章, 不显 SFC/扭矩/油耗。
- **问题**: SFC(燃油消耗率)和部分负荷扭矩曲线是船东最关心的运营成本指标, 也是 ZF/MAN/Reintjes 选型工具的标配展示。本系统数据已录入却埋没, 等于白采。销售无法回答客户'这台机巡航工况油耗多少'。
- **提升**: 在 EngineInfoSection 选中主机后, 调用 interpolateAtRpm 在工况转速点展示 SFC(g/kWh)与该点功率, 并给一个迷你扭矩曲线(已有 torqueCurve 数据可直接喂 Recharts/echarts)。在 EngineMatchingExpanded 选中主机卡片下方加一行'额定油耗 SFC: X g/kWh @ 100%负荷(数据源/confidence)'。无 torqueCurve 的机型(confidence C 或 ENGINE_DATA来源)如实标'待补'不臆造。
- **风险**: 低; 纯展示层, 缺数据走'待补'兜底即可, 不影响选型结果。
- **复核**: unverified

### P1-5 [accuracy·M·conf:high] 螺旋桨转速按船型取单一定值, 忽略船舶吨位/桨径 → 目标减速比可能失真
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: EngineMatchingExpanded.js:10-37 PROP_RPM_MAP 给每个船型一个固定桨速(如 '散货船':220, '集装箱船':150, '拖轮':280); :497 targetRatio = parseFloat((speed/propRpm).toFixed(2)) 直接据此算目标比。HCMSelectionModule.js 同理只按 power/speed 算 requiredCapacity, 不涉及桨速。对1800rpm高速机配'散货船'得 1800/220=8.18 的目标比, 全靠算法去 GW族高比箱(DB max ratio=22.18, node实测76个箱maxRatio>=7)兜, 但同吨位不同桨径实际桨速可差±40%。
- **问题**: 螺旋桨转速取决于桨径/船速/吨位, 同一'散货船'小到500吨大到5万吨桨速天差地别。用单一定值算目标比, 会让减速比推荐系统性偏差, 算法据此挑箱(:986 按 ratioDiffPercent 过滤)就可能给错档位。对一线工程师这是'看似精确实则拍脑袋'的隐患。
- **提升**: 把单值改为区间+可调: PROP_RPM_MAP 每船型给 [min,max,typical] 三档, UI(EngineMatchingExpanded:711 船型下拉旁)加一个可编辑'目标桨速/目标减速比'输入框让工程师覆盖默认值; 或在结果区标注'桨速为典型估值, 实际以桨图为准', 并允许直接输 targetRatio 反算。属逻辑增强, 不改数据schema。
- **风险**: 改默认值会影响现有匹配结果分布, 需保留'典型值'作默认并让覆盖为可选, 避免回归; 文案要诚实标估算。
- **复核**: unverified

### P1-6 [info-completeness·M·conf:high] 能效仪表盘完全不读所选齿轮箱 — 换任何型号能效结果都一样, 与'卖这台箱'脱节
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: App.js:1564 把选型首选 `selectionResult.recommendations[0]` 作为 gearbox 传入 EnergyDashboard; 但 EnergyDashboard.js:404 解构 `gearbox=null` 后全文再无引用(grep 仅 1 处)。EEDI 内部 gearboxEfficiency 用 energyEfficiency.js:281 的写死默认 0.97。对比 EnergyEfficiencyPanel.js:66-70 是会读 gearbox.efficiency / energyEfficiency.hybridReady 的。
- **问题**: 齿轮箱选型系统的能效页, 却不把'被选中的那台齿轮箱'的真实传动效率/混动能力代入计算。客户选 HC1400 还是 GWC60 看到的 EEDI/CO2 完全相同, 削弱了'选我家这台更省'的销售说服力, 也让能效页沦为通用计算器。
- **提升**: 把所选 gearbox 的真实传动效率(若 data 里有 efficiency 字段)代入 calculateAttainedEEDI 的 gearboxEfficiency 入参; 在概览卡顶部显示'当前型号 XXX, 传动效率 97.x%'。无 efficiency 实测值时, 复用 EnergyOptimizationView.js:6-16 的 EFFICIENCY_MAP 按系列取典型值并标注'按系列典型值估算'(遵守不臆造铁律, 标注来源即可)。
- **风险**: 需确认 data 中各型号是否有可信 efficiency 字段; 没有就用系列典型值并诚实标注, 不可冒充实测。
- **复核**: unverified

### P1-7 [accuracy·M·conf:high] GCH/GWC/GCST 族系价格占位符: 同族不同尺寸价格相同甚至小箱比大箱贵 (非单调)
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: 活跃源 GCH 族按 transferCapacity 排序后价格非单调: GCH320(cap0=0.57)=160000, GCH390(cap0=0.96)=34200(更大却更便宜), GCH410(1.292)=160000, GCH750(7.2)=49500, GCH760(8.111)/GCH850/GCH900/GCH880=均 160000, GCH490/540/590/660/950/1000=0(无价)。即 GCH320/350/410/760/850/900/880 七个不同尺寸都是占位 160000。GWC P 族在 completeGearboxData 同样: GWC28.30P..GWC49.54P 全部 price=450000 且 priceSource='系统估算'(脚本核出, cap0 跨度 0.865→5.5 约6倍)。GCST108/GCST91/GCSE44=均 2500000 另一组占位。
- **问题**: 这些是估算/占位价(priceSource='系统估算'), 而非真实出厂价, 却以确定数字呈现在 UI/报价。最危险的是非单调: 小箱 GCH320 报 160000、12 倍大的 GCH880 也报 160000、更大的 GCH390 反而 34200 — 销售据此报价会严重错价 (大箱报低/小箱报高)。这比 '询价' 更糟, 因为它给出一个错误的确定值而非诚实留空。
- **提升**: ①写 scripts/audit-price-monotonicity.js: 每个型号族(GCH/GCS/GWC...)按 transferCapacity[0] 升序, 标记价格非单调 + 同价占位簇(>=3 型号 price 完全相同) + priceSource∈{系统估算,估算价格} 的条目, 产出待财务核价清单(沿用 reports/price-conflicts-pending-finance.json 模式)。②财务核价前, 这些占位价应当被当作'无价'走 priceFormatter 的 '询价' 徽章, 而不是渲染 160000/450000 — 在 isPriceMissing(priceFormatter.js:68) 增加判定: priceSource 含'估算' 或命中已知占位值集合 → 视为缺价。
- **风险**: 中 — 改 isPriceMissing 判定会让一批原本显示数字的型号转为'询价', 需老板/财务确认(否则可能让本可成交的报价变保守); 占位值集合需人工框定避免误伤真实恰好相等的价格。
- **复核**: unverified

### P1-8 [data-gap·M·conf:high] embedded↔complete 36 条价格冲突自 2026-04 挂账未决, prebuild 漂移门控被 `|| true` 永久旁路
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: package.json:54 'prebuild': 'node scripts/check-data-drift.js || true' — `|| true` 使漂移检测永不阻断构建。脚本重跑(2026-05-30 再生后)仍有 36 条 >10% 价格冲突: GWC28.30P(emb 90000 vs comp 450000, 80%), 2GWH1060(emb 850000 vs comp 280000, 67%), HCM165(emb 15500 vs comp 120000, 87%), HCN120(emb 13420 vs comp 75000, 82%) 等。reports/price-conflicts-pending-finance.json(2026-04-25) 已列 30 条 '待财务签字', 一个多月后仍未回填。
- **问题**: 两个数据文件对同一型号给出差 2~9 倍的价格且无权威裁决, 是数据可信度硬伤。虽然活跃源是 embedded、completeGearboxData 仅供导出/竞品工具读取, 但只要有任一路径读 complete(如 dataExporter/competitorAnalysis), 报价就会自相矛盾。门控用 `|| true` 等于摆设, 冲突会无限期累积。
- **提升**: ①把 prebuild 改为对 A 类(complete 有 embedded 无)用 strict 阻断: 'node scripts/check-data-drift.js --strict' 去掉 `|| true`(B 类手动变体仍放行, 脚本已支持退出码区分)。②为 C 类价格冲突设阈值门控(如 >50% 的冲突阻断), 强制走 reports/price-conflicts-pending-finance.json 签字回填闭环。③确定单一权威价源(脚本注释已定 gearboxPricing.js 为主), 写脚本把签字后的价同步进 embedded+complete 两端消除冲突。
- **风险**: 中 — 直接 strict 阻断可能让当前构建立刻失败(已有 43 条 missingInComplete 等), 应先把已知 B 类变体加白名单再启用 strict, 否则阻断正常发版。
- **复核**: unverified

### P1-9 [accuracy·M·conf:high] 舵桨/侧推所需推力计算中'水流阻力'项是死代码 — UI 永远只算风载、漏掉流载
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: azimuthSelectionAlgorithm.js:52-56 currentForce = 0.5*ρ*currentSpeed²*(length*draft*0.7)*0.8/1000, 依赖 draft; 但 AzimuthThrusterSelector.js:66-70 调用时只传 {length, windArea, windSpeed}, 不传 draft/currentSpeed → draft 默认 0 → underwaterArea=0 → currentForce 恒为 0。侧推侧 ThrusterSelector.js:67-71 同样只传 length/windArea/windSpeed(其 calculateRequiredThrust 本就只算风载, 但 UI 也没暴露 draft 输入)。
- **问题**: 舵桨/全回转推进器主要用于 DP 动力定位、港作拖带、海工station-keeping, 这些场景下水流力(current)往往与风力同量级甚至更大。当前选型把流载默默算成 0, 系统性低估所需推力 → 可能选小, 是安全相关的偏差。
- **提升**: 在 AzimuthThrusterSelector 输入区增加'设计吃水 draft / 水流速度 currentSpeed'字段并透传给 calculateRequiredThrust; 在 thrustCalcDetail 结果里把 windForce 与 currentForce 分项展示, 让工程师看到两项贡献。若暂不加输入, 至少在 UI 标注'当前仅计风载, 流载需另行核算'避免误用。
- **风险**: 加输入字段属增量; 透传后 currentForce 才生效。须确认 ρ/Cd 经验系数合理(0.8 阻力系数偏经验)。
- **复核**: unverified

### P1-10 [professionalism·M·conf:high] calculateBollardPull 是从未被调用的死代码, 而算法说明卡却声称'系泊推力按 IMO/SOLAS 要求计算'
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: azimuthSelectionAlgorithm.js:20-28 定义 calculateBollardPull(power)=power×0.13(线性经验系数); AzimuthThrusterSelector.js:14 import 了它但全仓库 grep 'calculateBollardPull(' 仅在 AlgorithmReferenceCard.js:93 的说明文字里出现, 无任何实际调用点。AlgorithmReferenceCard.js:93 文案: '系泊推力(Bollard Pull)按 IMO/SOLAS 要求计算,实现见 calculateBollardPull()'。实际 UI 里 bollard pull 直接取数据表静态字段 thruster.thrust.bollard(azimuthThrusterData)。
- **问题**: ①对客户/工程师的虚假承诺: 文案声称有 IMO/SOLAS bollard pull 计算, 实际函数是 0.13 线性系数且根本没被调用; ②专业上 bollard pull≈f(功率,桨直径,导管,J=0 KT)的非线性量, 用单一 0.13 系数 ZP/LP/EP 一刀切不专业(对标 ZF/Schottel 选型工具均给 BP vs 功率曲线)。
- **提升**: 二选一: (a) 删掉 calculateBollardPull 并改 AlgorithmReferenceCard 文案为诚实表述'系泊推力取产品样本静态值'; 或 (b) 真正接入——用 propulsionMatchingSolver/Ka-19A 在 J=0 计算 KT 得 BP=KT·ρ·n²·D⁴, 并在舵桨结果卡显示'估算系泊拉力 vs 样本值'对照。推荐 (b), 因 Ka-19A 模块(propellerSeriesDB.js)已具备 J=0 推力计算能力。
- **风险**: (a) 零风险; (b) 需把 Ka 桨 BP 计算接进舵桨流程, 中等工作量, 须与样本静态 bollard 值核对量级。
- **复核**: unverified

### P1-11 [data-gap·M·conf:medium] 全回转舵桨/侧推数据多为内插占位型号(ZP-300/LP-500 等), 却无 CPP 那样的真实型号映射或诚实标注
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: azimuthThrusterData.js 的 ZP/LP/EP 12 个型号是按 300/500/750/1000/1500 整数功率档线性铺出的(thrust/weight/dimensions/price 均规律递增, 无项目/技术协议引用); 对比 cppSystemData.js:2047 的 cppModelNameMapping 把 GCS660→真实 GCS49.61/1400m滚装船、GCST450→GCST44/173mLNG 等真实型号+项目。thrusterData.js 仅 TF110(行97-135)明确标注'来自技术协议/680TEU集装箱船', 其余 TF50/80/140/180/220、TH/TC/TR 系列无来源标注。
- **问题**: 杭齿前进真实舵桨/侧推产品线与这些占位型号未必对应。销售拿 ZP-1500/2310 万这种数据报价或给客户看, 若型号/推力/价格是内插出来的, 存在报错价、承诺不存在型号的风险。CPP 已建立诚实机制, 舵桨/侧推却没有。
- **提升**: 为 azimuthThrusterData / thrusterData(非 TF110 部分)补一个与 cppModelNameMapping 同构的 realModels 映射或 dataSource 字段(real|interpolated|placeholder); UI 在选型结果卡对 interpolated 型号显示'参考估算, 请向工厂核实'徽章(类似 priceFormatter 的询价徽章思路)。不改 schema, 只加字段值+UI 标注。
- **风险**: 需老板/工厂确认哪些是真实在产型号; 在确认前 UI 诚实标注是低风险的防误用措施。
- **复核**: unverified

### P1-12 [data-gap·M·conf:medium] CPP 齿轮箱/桨数据内嵌虚构的船级社证书号与有效期
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: cppSystemData.js:340-349 GCS320 certifications 写死 CCS:'MC2024-GCS320' validity:'2029-12-31', DNV:'DNV-GL-2024-320' notation:'CLEAN DESIGN' 等; GCS660(行543-553)更列出 CCS/DNV/LR/ABS/BV/RINA/NK/KR/ClassNK 九社齐全的具体证书号+notation+到期日; cppPropellers HI-320(行1345-1350)classification.certificate:'MC2024-320HI' valid:'2027-12-31'。这些编号格式高度模板化(年份+型号拼接), 极可能为编造。
- **问题**: 船级社证书号、notation(CLEAN DESIGN/DP-2/ENVIRO+)、到期日是法律与合同强相关信息。选型算法 cppSelectionAlgorithm.js:135-148 还用 cert.certificate 真去给'船级社认证匹配'打 15 分。若证书是编的, 既误导评分排序, 又在对客户输出时构成虚假认证声明风险。
- **提升**: 把无法核实的 certificate/validity 值清空或置为 null, 仅保留'是否具备该社认证'的布尔/'可申请'状态; 评分逻辑(cppSelectionAlgorithm:135)改为按'认证可获得性'而非具体证书号打分。UI 对认证显示'以工厂出具的有效证书为准'。属补/改数据值, 不改 schema。
- **风险**: 需逐型核实真实认证状态; 在核实前置空比留假号更安全。会影响认证维度评分, 须同步调评分逻辑。
- **复核**: unverified

### P1-13 [accuracy·M·conf:high] 独立联轴器页从不应用原动机系数(柴油机1.5) — 海事柴油机联轴器扭矩偏小
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: enhancedCouplingSelection.js:80-85 requiredCouplingTorque_kNm = engineTorque × kFactor × stFactor × primeFactor / 1000, 其中 primeFactor 来自 PRIME_MOVER_CAPACITY_FACTOR[options.primeType||'none'] (selectionAlgorithm.ts: diesel=1.5/electric=1.8/none=1.0)。但调用方 couplingSelectionService.js:160-166 selectCouplingStandalone 调 enhancedCouplingSelection 时 options 只传 {workCondition,workFactorMode,temperature,hasCover,needDetachable}, 从不传 primeType → primeFactor 恒=1.0。表单 CouplingSelectionForm.js 也没有原动机类型选项可填。
- **问题**: 这是联轴器扭矩侧(T=9550·P/n·K, 护栏允许在联轴器扭矩里用应用系数), 不是齿轮箱选型硬校核, 因此应用原动机脉动系数是正确且必要的。船用主推几乎全是柴油机(扭矩脉动大), 标准做法要乘 1.5 左右。现在独立联轴器选型页对柴油机工况只用 K(且K还因上一条bug恒=1.4)×温度, 漏掉原动机脉动 → 算出的所需扭矩系统性偏小, 可能把本应过载的弹性体选小一档, 影响联轴器寿命与可靠性。注意算法层已支持该系数, 只是 UI 和服务层没接通。
- **提升**: 在 CouplingSelectionForm 增加'原动机类型'下拉(柴油机/电动机/不考虑, 默认柴油机), 把 primeType 透传进 handleSelectionSubmit → selectCouplingStandalone(params) → 加入 enhancedCouplingSelection 的 options。结果页'计算过程'横幅补充展示 ×原动机系数。或如果产品口径是'K已隐含原动机', 则应在 UI 明确标注'K已含柴油机脉动'避免一线误以为漏算 — 二选一, 但当前是默默丢失, 需修。
- **风险**: 改 default 为 diesel 会让所有历史对比的所需扭矩上升约50%, 推荐型号可能上移一档; 需与老板/工程确认船用默认口径, 并在 release note 标注。建议默认仍保留可选, 文案引导。
- **复核**: confirmed — 属实。enhancedCouplingSelection.js:80-85 primeConfig=PRIME_MOVER_CAPACITY_FACTOR[options.primeType||'none'], requiredCouplingTorque_kNm = engineTorque×kFactor×stFactor×primeFactor/1000。selectionAlgorithm

### P1-14 [info-completeness·M·conf:high] NPSH 汽蚀预警完全靠启发式打分, 无视数据里已有的 npshRequired 实测值
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: src/utils/pumpNPSHAdvisor.js:18-77 evaluatePumpNPSHRisk 只用 inputSpeed/pressure/temperature/outputSpeed 4 个因子累加 riskScore, 顶部注释(行5)明说'standbyPumps 数据表未直接包含 NPSH_required, 本模块基于高风险工况启发式判定'。但实际上 src/data/standbyPumpsEnrichment.js:20/32/43/54 已为每个系列给了 npshRequired 缺省值(2CY-D=3.5m, 2CY=3.0, 2CYA=4.0, SPF=5.0)且个别型号覆盖(2CY25/6.3=4.5)。PumpSelectionView 全部泵型表(行703 columnVisibility.npshRequired)也在展示 pump.npshRequired。也就是 NPSH_required 数据存在, 但预警逻辑没读它。
- **问题**: 预警给出的'建议核实 NPSH_available ≥ NPSH_required + 0.5m'是空泛话术, 因为它根本不知道也不展示这台泵的 NPSH_required 具体是多少。一线拿到'高风险'结论却看不到要对标的 NPSH 数值, 无法据此核算油箱液位/吸入管径, 工程价值打折。
- **提升**: 在 evaluatePumpNPSHRisk 入参里读 pump.npshRequired(若调用方传的是已 enrich 的 pump; PumpInfoSection.js:61 传的 pumpResult 应先经 formatPumpInfo/getPumpEnrichment 合并 npshRequired)。把 npshRequired 纳入因子(如 npshRequired≥4m 再 +1 score), 并在 result.factors 和建议文案里回填具体数值: '本泵 NPSH_required=4.0m, 安装时 NPSH_available 须 ≥4.5m'。这样预警从'空泛'升级为'可执行'。仍属估算口径, 文案保留'典型值, 以泵厂样本为准'诚实标注。
- **风险**: 低; 须确认 PumpInfoSection 传入的 pumpResult 已携带 enrichment 的 npshRequired(目前 enhancedSelectPump 返回对象未合并 enrichment, 可能为 undefined → 需在传入前 enrich 或在 advisor 内调 getPumpEnrichment 兜底)。
- **复核**: confirmed — 属实。pumpNPSHAdvisor.js:18-77 evaluatePumpNPSHRisk 仅用 inputSpeed/pressure/temperature/outputSpeed 4 因子累加 riskScore, :3-7 注释明说'standbyPumps 数据表未直接包含 NPSH_required, 本模块基于高风险工况启发式判定'。但 standbyPumpsEnrichme

### P1-15 [data-gap·M·conf:high] GC 系列齿轮箱备用泵靠粗暴尺寸分桶猜型号, 且引用了库里不存在的泵
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: enhancedPumpSelection.js:12-74 pumpMatchingRules 只有 GW/HC/DT 三系列, 没有 GC 条目。GC 落到 466-501 行的临时启发式: seriesNum≤200→'2CY-1.1/2.5D', ≤400→'2CY-3.3/2.5D', else→'2CY-7.5/2.5D'。实测 src/data/standbyPumps.js 全部22个型号里 grep '2CY-1.1/2.5D' = 0 (不存在!), 只有 2CY-3.3起步。而 pumpSelectionAlgorithm.js:407-410 的 needsStandbyPump 又判定所有 GC/GCH/GCS/GCSE 都需要备用泵。standbyPumps.js 里 GCS 型号其实已有 applicableGearbox 配套(如 2CY-8.3/2.5D 配 GCS320/350/390, 2CY-12/2.5D 配 GCS410/450/490)。
- **问题**: GC 是高速齿轮箱常见系列且强制需要备用泵, 但选型对它没有正经映射规则: 用 GC 后面的数字(其实是速比×10的型号码, 不是泵流量依据)粗分三桶, 还把不存在的 2CY-1.1/2.5D 当推荐 → 小型GC会推荐到一个查无此泵的型号, 走 fuzzy/默认兜底, 结果不可靠。同时 standbyPumps 里已有的 GCS 精确配套(applicableGearbox 含 GCS320 等)被 enhancedSelectPump 的系列规则路径绕过没用上。
- **提升**: ①修掉不存在的 2CY-1.1/2.5D 引用(改为库里最小的 2CY-3.3/2.5D 或按流量需求选)。②给 pumpMatchingRules 补 GC/GCS 区段映射, 或更稳妥地优先走 selectPumpByGearbox 的 directMatch(它读 applicableGearbox 数组, pumpSelectionAlgorithm.js:196-216), 让已录入的 GCS 配套生效。③把 GC 的尺寸分桶换成基于齿轮箱润滑流量需求的真实依据(若无数据则诚实标'GC系列泵配套待补充, 请联系技术', 不要猜)。
- **风险**: 中; 需核对 standbyPumps 里 GC/GCS 的 applicableGearbox 覆盖度, 缺的部分宁可标待补也不编造。改映射后跑 PumpSelectionView 手动验证几个 GCS 型号。
- **复核**: unverified

### P1-16 [data-gap·M·conf:high] 产品新鲜度元数据 88% 与真实型号对不上 — 243 条竞品里只有 29 条有 freshness 记录, 其余全显'未验证'红点
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: competitorDataEnhanced.js:26-141 的 productFreshnessData 共 89 个 key, 实测仅 28 个能匹配到 competitorProducts 真实 model(2026-03 那批 ZF301C/MGX5050/WVS430/SCV55 等), 早批 key 是 'MG-5540'/'GS301'/'ZF-W2100'/'NGC-GS228'/'WAF-362'/'FD-135'/'FJ-06' 等带连字符/前缀的虚构名, 真实 model 是 'GW10'/'CGC200'/'ZF15M'/'WAF440'/'FD135'/'FJ16'。DataFreshnessIndicator.js:19-26 getFreshnessLevel 找不到 key 即返回 {level:'red', label:'未验证'}; ComparisonTable.js:92 每个竞品表头 <FreshnessDot model={comp.model}/> 因此对 88% 型号显红。
- **问题**: 新鲜度/价格可信度体系(整个 DataFreshnessIndicator + getDataFreshnessReport 健康度面板)对绝大多数产品形同虚设, 选中竞品做对比时几乎全是刺眼红点'未验证', 反而削弱报告可信度; 健康度百分比统计严重失真。
- **提升**: 把 productFreshnessData 的 key 改成真实 model 名(参照 competitorProducts.model 清单, 我已用脚本导出全 243 个), 至少把对外可对比的主力型号(ZF/Reintjes/TwinDisc/NGC/CZCG 各系列代表)补齐对得上的 lastVerified/priceConfidence; 对确实无核实来源的型号统一标 priceConfidence:'estimated' 并在 UI 黄点而非红点。不改 schema, 只改 data 值。
- **风险**: 低: 只动 competitorDataEnhanced.js 数据值。注意要逐条核对真实型号名避免再次错位。
- **复核**: unverified

### P1-17 [missing-feature·M·conf:high] 刚完成的主选型结果(selectionResult)未联动竞品对比 — 用户被迫重新输参/重选杭齿型号
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: App.js:1644-1649 把 selectionResult 和 engineData 都传进 CompetitorComparisonView, 但 CompetitorComparisonView.js 只在 useEffect(line 49-57) 用 engineData.power/speed 自动填功率转速, selectionResult 这个 prop 在整个组件里从未被读取(grep 仅出现在 props 解构 line 33)。selectedHangchi 初始为 null(line 38), 需用户在左栏手动再点一次型号。
- **问题**: 主选型已经算出推荐杭齿型号+匹配速比+富裕度, 进竞品对比却丢失上下文, 销售要重新搜/点, 流程割裂; 而且重新走的是带 bug 的自动匹配(见 P0)。对标 ZF/Reintjes 的选型工具是'选型→直接出竞品对位'一条龙。
- **提升**: 在 CompetitorComparisonView 加 useEffect: 当 selectionResult?.recommendedModel(或首条结果)存在且 selectedHangchi 为空时, 从 hangchiData 找到对应型号 setSelectedHangchi, 并(用修复后的)findEquivalentCompetitors 预填对标竞品。让'选型→竞品对比'零点击贯通。
- **风险**: 低: 纯前端联动, 依赖 selectionResult 的字段名需先确认。
- **复核**: unverified

### P1-18 [info-completeness·M·conf:high] 两套竞品数据库割裂 — 老 competitorData(估算 CNY/弱来源) 与新 foreignGearboxMapping(catalog 区间价/三参对齐) 并存, 价值最高的参数级对比却不显杭齿价
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: ParametricCompareView.js 依赖独立的 foreignGearboxMapping.js(16 条, 真 catalog 来源/USD-EUR 区间价/year 口径/high-medium-low confidence/三参数对齐, foreignGearboxAnalysis.js:39-65 干净的 power±25%/ratio±20%/speed±20% 匹配, 无 K_A 误用), 质量明显高于 competitorData.js(243 条估算 CNY 整数价如 35000/58000/125000, efficiency 几乎全 0.96-0.97 占位)。但 ParametricCompareView line 162-172 '对位杭齿型号'只列型号名+理由, 不拉取 completeGearboxData 的真实杭齿价格/能力 → 无法直接给出价差(整个工具的卖点)。
- **问题**: 最可信的参数级对比 Tab 只展示了'海外多贵', 没把'杭齿多便宜'摆在同一行, 销售拿不到一眼可见的价差证据; 同时两套库口径(估算 CNY vs catalog USD区间)和品牌覆盖不一致, 维护分裂、用户在不同 Tab 看到的对位竞品/价格不一致。
- **提升**: ①在 ParametricCompareView 表格'对位杭齿型号'列旁增列'杭齿参考价/传递能力', 从 hangchiData(已可经 props 传入)按 m.model lookup 走 priceFormatter.getPriceBadge() (无价显'询价'徽章, 不写 ¥0), 直接算 价差% = (海外CNY中位 - 杭齿价)/海外CNY中位。②中长期: 以 foreignGearboxMapping 的数据纪律为标准, 逐步把 competitorData 的进口品牌价标注口径(CNY估算)或迁到区间价, 减少两套并存。
- **风险**: 中: 价差需明确标'海外为公开 catalog 区间估算, 实际以正式报价为准'(已有 disclaimer 可复用); 杭齿无价型号要走询价兜底不可硬算。
- **复核**: unverified

### P1-19 [accuracy·M·conf:high] GW特殊打包场景: 合同 totalAmount=打包价,但行项单价=齿轮箱单机价,两者不相加等且无打包说明
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/contractGenerator.js:62 `totalAmount = priceInfo.totalMarketPrice||priceInfo.marketPrice` 来自 useExportHandlers.js:144 `quotation.summary.totalMarketPrice`(GW打包场景=打包价,见 quotationGenerator.js:421)。而同文件 products 行项 line100 `unitPrice: gearbox.marketPrice`(单机价,未含联轴器/泵打包)。报价单侧 quotationGenerator.js:204-207 对打包会加备注'(采用市场常规打包价)'并把配件并入齿轮箱行,合同侧完全没有这套逻辑。
- **问题**: GW系列(GWC/GWL等)走打包价时,合同表格各行单价之和 ≠ 合计大写金额,客户/财务一眼能看出'明细对不上总价',显得不专业且可能被质疑算错。联轴器/泵在打包里却在合同中独立成行或缺失,口径混乱。
- **提升**: 合同生成复用报价单已算好的 quotation.items(useExportHandlers 已持有 quotation)作为合同产品行的权威来源,而非重新从 selectedComponents 取价;打包场景在齿轮箱行 remarks 注明'含高弹性联轴器及备用泵(打包价)',保证 Σ行项 = totalAmount。
- **风险**: 改取数源要确保 quotation.items 的 getter(unitPrice/amount)在传入合同前已物化为数值。
- **复核**: unverified

### P1-20 [info-completeness·M·conf:high] 销售合同缺质保期(三包)条款与增值税/发票约定 — 中国船机销售合同两项核心必备条款缺失
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/contractGenerator.js:107-130 合同对象13条条款里无质保/保修字段(grep '质保|保修|warranty' 0命中),也无 taxRate/增值税/发票类型(grep 'taxRate|增值税|含税|发票' 仅命中 buyerInfo.taxNumber 占位)。对照报价单 quotationGenerator.js:397 有 taxRate 选项与含税计算。合同 PDF 条款 line292-304 直接从'执行标准'跳到'争议解决',无质保。
- **问题**: 杭齿前进船用齿轮箱标准销售合同必含'质保期(如货到18个月/投入运行12个月孰先)'与'价格为含13%增值税价,提供增值税专用发票'。缺质保条款=售后责任边界不清(本ERP还有售后系统联动);缺税/发票约定=财务开票口径无依据。这是把工具生成的合同直接当正式合同用时的硬伤。
- **提升**: 在 contract 对象补 warrantyClause(默认'质保期为货物到达买方18个月或投入运行12个月,以先到者为准,质保期内非人为故障免费维修/更换')与 taxClause(默认'本合同价为含13%增值税价,乙方提供增值税专用发票'),PDF(contractGenerator.js 条款段)和 Word 模板各加2条;ContractView preview 同步显示。质保措辞建议标'以现行版本为准'供销售微调。
- **风险**: 质保/税率具体数值需老板/财务确认默认口径;措辞按企业现行模板,避免臆造承诺。
- **复核**: unverified

### P1-21 [professionalism·M·conf:high] 三套单据编号体系并存且格式不一,技术协议对客户可见编号需人工手填(默认空)
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: documentNumber.js:7 生成 QJ-BJ/HT/XY-YYYYMMDD-NNN(报价单/合同用,quotationGenerator.js:122、contractGenerator.js:52);documentNumbering.js:6-11 另生成 TI/QT/TA/SC-2026-0001(TechnicalAgreementView.js:72 agreementStore.save 的id、文档溯源关系用);而技术协议对客户'协议编号'是 BasicInfoForm.js:184-189 的纯手填 Form.Control(默认 editableInfo.agreementNumber||'' 为空,useAgreementGeneration.js:63)。同一笔业务三份文件: 报价QJ-BJ-..., 合同QJ-HT-..., 协议号空白或乱填,内部又记成TA-..., 互不引用。
- **问题**: 专业选型工具(ZF/Reintjes)同一项目报价→协议→合同编号同源可追溯。这里编号双轨+协议号要销售自己想,既不统一也无溯源,客户收到的三份文件编号风格不一致,降低专业可信度;内部 store id 与对客编号脱节导致文档管理难对账。
- **提升**: 统一收敛到 documentNumber.js 一套(QJ-XY-...用于协议),让 TechnicalAgreementView 生成协议时自动 genDocNumber('agreement') 回填 agreementNumber(允许销售覆盖);合同生成时把来源报价单号写入 contract.relatedQuotationNumber 并在合同抬头打印'参见报价单 QJ-BJ-...';废弃或仅内部保留 documentNumbering.js 的TA/SC映射但与对客编号绑定。
- **风险**: 改编号默认值不影响历史已存文档;协议号自动填后保留可编辑避免破坏现有手填习惯。
- **复核**: unverified

### P1-22 [info-completeness·M·conf:medium] 报价单/合同不展示选型工程依据(额定功率·转速·传递能力余量),报价缺技术绑定
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/quotationGenerator.js:202 齿轮箱行 remarks 仅 `速比: X.XX`,无额定输入功率/转速/传递能力余量;result 对象(367-425)也无 ratedPower/ratedSpeed/capacityMargin。合同 contractGenerator.js products(94-104)仅 model/数量/价格,无技术参数。selectionResult 里其实有 enginePower/engineSpeed(useAgreementGeneration.js:34-37 能取到)但报价/合同未带出。
- **问题**: ZF/Reintjes 报价单标准做法是写明'本报价针对额定输入功率 XX kW @ XX r/min,所选箱体传递能力余量 XX%',让报价在技术上可追责。当前报价只给型号+速比,客户无法核对所报箱体是否匹配其主机工况,也无法在订货时锁定工况边界。这是把'选型结果'与'商务报价'数据贯通的关键缺口,且数据已存在只是没透传。
- **提升**: 在 generateQuotation 的齿轮箱行 remarks 或新增 result.technicalBasis 字段带出 selectionResult.enginePower/engineSpeed 与所选箱体的传递能力余量(传递能力=power/speed,手册值已含安全系数,直接对比给余量%即可,不乘K_A);报价单预览(createQuotationPreview)与PDF加一'选型技术依据'小节。合同同步带'适用工况: XX kW@XX r/min'。无该工况数据时标'按客户提供工况'不臆造。
- **风险**: 余量计算须复用既有选型口径(power/speed,绝不加K_A);缺工况数据时如实留空。
- **复核**: unverified

### P1-23 [ux·M·conf:high] 侧栏主导航 60+ 条目全部用 <div onClick>，无键盘可访问性、无 ARIA、无 <nav> 语义
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/SidebarNav.js:222-274 每个导航项是 `<div key={item.key} onClick={() => { onNavigate(item.key); ... }}>`，分组头 SidebarNav.js:192-217 也是 `<div onClick>`；grep `role=|tabIndex|onKeyDown|aria-` 在该文件 0 匹配；整个组件返回的根是普通 `<div className="sidebar-nav">` 而非 `<nav>`。
- **问题**: 这是系统的主导航(11组约60入口)。div+onClick 无法 Tab 聚焦、无法回车/空格激活、屏幕阅读器读不出这是导航/不知是否可点。一线销售用键盘或读屏完全无法浏览模块，也不符合 WCAG 2.1.1(键盘可达)。顶栏 ModernNavBar 用 `<a href>` 是对的，但业务入口已全收敛到这个不可访问的侧栏(见 ModernNavBar.jsx:5-6 注释)。
- **提升**: 把每个 item 的 `<div onClick>` 换成 `<button type="button" onClick=...>`(或加 role="link" tabIndex={0} onKeyDown 处理 Enter/Space)；分组容器加 aria-expanded/aria-controls；根容器改 `<nav aria-label="主导航">`，分组头改 `<button aria-expanded={expandedGroups[gIdx]}>`。纯 markup 改造，零业务逻辑变更，CSS 用 :focus-visible 加焦点环。
- **风险**: 低。仅改语义标签和事件，需回归现有 hover/active 高亮样式(button 默认样式需 reset)。
- **复核**: confirmed — 核实 src/components/SidebarNav.js: 分组头 line 192-193 是 `<div onClick={() => collapsed ? onToggle() : toggleGroup(gIdx)}>`，导航项 line 222-225 是 `<div key={item.key} onClick={() => { onNavigate(item.key); on

### P1-24 [ux·M·conf:high] 窄屏桌面用户(<1024px)在桌面版被强制进只能触摸滑动的结果卡片，鼠标无法切换
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/EnhancedGearboxSelectionResult.js:194-208: `const { isMobile, isTablet } = useIsMobile(); const useResponsiveLayout = isMobile || isTablet;` 当 width<1024 即渲染 SwipeableResultCards。而 SwipeableResultCards.js:61-62 `trackMouse: false, trackTouch: true` —鼠标拖拽不触发切换。切换只剩 pagination dots(SwipeableResultCards.js:283-292 `<div className="dot" onClick>`，小目标且非 button)，且顶部仍显示误导文案 `← 滑动切换 →`(line 106)。
- **问题**: useIsMobile 的 isTablet 是 768–1024px(useIsMobile.js:58)。台式机/笔记本把窗口拖窄到<1024(分屏常见)，或平板用户点了"切换到桌面版"，都会落到桌面 App 但拿到触摸专用的滑动卡片：鼠标拖不动、提示却写"滑动切换"，只能靠没有箭头按钮的小圆点切换推荐型号。对鼠标用户是功能性卡顿。
- **提升**: ①SwipeableResultCards 增加显式『上一个/下一个』箭头按钮(复用已有 goToIndex)并在非触摸设备(useIsMobile().isTouchDevice===false)隐藏"滑动切换"提示改为"点击切换"；②或把 EnhancedGearboxSelectionResult.js:195 的判断从 `isMobile||isTablet` 收紧为 `isMobile || (isTablet && isTouchDevice)`，让窄屏鼠标桌面继续用表格视图；③pagination dot 改 `<button aria-label={`第${i+1}个推荐`}>` 增大触控区到≥32px。
- **风险**: 中。改判断条件影响平板/窄屏的布局选择，需在真机/缩窗下回归。
- **复核**: unverified

### P1-25 [data-gap·M·conf:high] 库存/应收/角色等管理模块数据全部漏出备份与统一审计范围
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: InventoryManagement.js:55-56/78-88 写 shanghai_inventory/shanghai_stock_documents;ReceivablesManagement.js:64-65/87-96 写 shanghai_receivables/shanghai_collection_records;RoleManagement.js 写 rbac_*。但 DataBackupView.js 的 DATA_SOURCES(line 6-14)完全不含这些键(grep 证实 DataBackupView.js 内无 inventory/receivable/rbac/shanghai 字样)。同时这些出入库/催收/盘点操作也不进 OperationAuditLogView(它只聚合 auditLog/priceHistory/importHistory 三源,OperationAuditLogView.js:182-219)。
- **问题**: 用户辛苦录入的出入库单、盘点调整、催收记录、角色配置,既备份不到(灾备丢失),也不在『操作审计日志』里留痕(合规审查查不到谁改了库存/谁记了催收)。管理模块产生的恰恰是最需要留痕和备份的运营数据。
- **提升**: ①DataBackupView.DATA_SOURCES 增补 shanghai_inventory/shanghai_stock_documents/shanghai_receivables/shanghai_collection_records/rbac_config/rbac_users;②让出入库(handleStockOperation)、盘点(handleSubmitAudit)、催收(handleRecordCollection)调用 services/auditLog 的写入API(addAudit),使其出现在统一时间线。
- **风险**: 低,纯增量;注意备份体积与 LS 容量。
- **复核**: confirmed — InventoryManagement.js:55-56/80/86 写 shanghai_inventory/shanghai_stock_documents;ReceivablesManagement.js:64-65/89/95 写 shanghai_receivables/shanghai_collection_records;RoleManagement 写 rbac_*。DataBac

### P1-26 [missing-feature·M·conf:medium] 智能定价/折扣率体系缺少『地板价/毛利下限』护栏,可能建议亏本折扣
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: smartPricingEngine.js:52 suggested = min(25, max(avg,10)+volume+loyalty),竞争报价策略 line 75 进一步 +3% 到 25%;全程只对『折扣上限25%』封顶,没有任何对『折扣后单价 ≥ 出厂价/成本价』的校验。priceManager.ts 有 calculateFactoryPrice(出厂价=基价×(1-折扣率))概念,但 smartPricingEngine 完全不引用出厂价做下限。SmartPricingCard 直接把 discountedPrice 当推荐单价展示。
- **问题**: 对于本身折扣率就高的系列(如HC标准16%),叠加批量5%+老客户3%再+竞争3%=最高25%下浮,完全可能跌破出厂价/成本线,智能建议反而引导销售亏本成交,且界面没有任何红色预警。对标 ZF/Reintjes 的报价工具都有毛利地板线。
- **提升**: 在 getPricingStrategy 里传入/查出该型号 factoryPrice(成本近似),计算每个策略的 discountedPrice 后,若 < factoryPrice 则该策略标红『低于出厂价』并禁用『竞争报价』继续加折扣;卡片显示预估毛利率。地板线口径可用出厂价或财务给的成本系数。
- **风险**: 需要拿到可信的成本/出厂价口径才能算毛利,缺数据时只做『低于出厂价』红线即可,不臆造成本。
- **复核**: unverified

### P1-27 [missing-feature·M·conf:high] 价格维护工具的『导入官方价格』是写死的13行示例文本,而非真实官方价表
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: PriceMaintenanceTool.js:441-457 handleLoadOfficialPrices 里 officialPriceText 是一段硬编码模板字符串(HC300/HC400/...GWC70.85 共13条),点『导入官方价格』永远只加载这13条示例。CLAUDE.md 明确『404个型号缺价格(69.1%)』,而这个本该批量补价的工具只能覆盖13个写死型号。
- **问题**: 这是补齐404个缺价型号的关键工具,却退化成一个固定13条的演示;管理员无法用它真正批量录入官方价表,缺价问题靠它解决不了。
- **提升**: 把官方价做成可上传/可编辑:支持粘贴或上传完整官方价表(已有 parseTextPriceTable 解析器),或把官方价存为可维护的 JSON 数据文件由本工具读取;并接入 reports/top50-price-proposal.json(CLAUDE.md 提到的TOP50补录提案)做一键合入。
- **风险**: 官方价需财务确认折扣率后才入库,导入流程应保留『预览-选择-应用』(现已有 OfficialPriceModal),不要直接写库。
- **复核**: unverified

### P1-28 [accuracy·M·conf:medium] IACS/CCS 许用扭振应力 τ_c 漏掉尺寸系数 C_D，对大轴径偏不保守（可能把不合格判为合格）
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: forcedVibrationAnalysis.js:256-260 中间轴 `T1=18+Rm/36`、桨轴 `T1=18*√(560/(Rm+160))+Rm/48`，仅基础式；torsionalStandardsDB.js:31 公式串同样只有 `tau_c=18+Rm/36`。IACS UR M68 实际限值为 τ_c=±(18+Rm/36)·C_K·C_D·C_d，其中尺寸系数 C_D=0.35+0.93·d^(-0.2)（d 单位 mm），对 d=150-400mm 约 0.55-0.62。代码未乘 C_D。
- **问题**: 省略 C_D 使许用连续应力被高估约 40-45%（大轴更甚），verifyResults(:1485-1486) 用这个偏高的 continuous 值做 `maxStress<=allowable` 判定 → 真实按 IACS 应判超标的轴系会被报告为通过。这是船级社合规校核里方向错误（偏危险侧）的系统性偏差，对外宣称'IACS UR M51/M68 合规'时尤其敏感。
- **提升**: 在 calculateAllowableStress() 增加轴径入参 d，乘以 C_D=0.35+0.93·Math.pow(d,-0.2)（M68 §标准式），C_K 默认 1.0（无键槽/横孔时）。无轴径时退化为基础式并在结果里标注'未计尺寸系数，结果偏不保守'。standardsDB 公式串同步补 ·C_D。calculateAllAllowableStresses(:281) 已能从 systemInput 取轴径，传入即可。
- **风险**: 会下调许用值、使更多工况判超标——需用 COMPASS/船级社算例回归（项目已有 COMPASS 校准基准），确认与官方计算书一致后再放开；建议先以'附加提示'形式上线，验证后再纳入硬判定。
- **复核**: unverified

### P1-29 [info-completeness·M·conf:high] 条款知识库缺条款级出处(只有标准名字符串, 无章节号/版本/核验状态)
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: 对 clause-kb.json 全量解析: 93 条 clauses 的字段仅 ['applicableSeries','category','content','faultType','id','importance','keywords','source','technicalParams','title','variants']; `source` 字段填的是标准名字符串(如 class-001 的 source='CCS《钢质海船入级规范》', energy-001 的 'IMO MEPC.333(76)'), 76/93 条有 source; 但完全没有 clauseNo/章节号/规范版本年/verified 核验字段(grep standard/standardRef/sourceClause/clauseNo/basis 均为 0)。ClauseDetailModal.js:259-265 也只展示 `来源: {clause.source}` 一行。
- **问题**: 对销售/船检报关这类需要'引哪条规范哪一章'的场景, 只给'CCS入级规范'这种笼统出处不可用——船检会问'第几篇第几章第几条'。也无法判断条款是否经人工核验、对应哪个规范版本(2024版还是更早), 知识库的'可追溯/可信赖'专业度不足, 距 ZF/Reintjes 把每条技术要求挂到具体 IACS UR/规范条款号有差距。
- **提升**: 在 clause-kb.json 给关键条款(尤其 classification-requirements/energy-efficiency/safety 三类)补 sourceClause(如 'CCS 钢质海船入级规范 2024 第3篇第3章 3.2.1')、standardVersion(如 '2024')、verified(true/已核验日期)三个值字段(改值非改schema), 并在 ClauseDetailModal 展示'规范出处+版本+核验状态'。无法核到具体条号的标'待核以现行规范为准'(沿用项目铁律, 不臆造章节号)。
- **风险**: 补出处需查规范原文, 工作量在内容侧; 不可编造章节号, 查不到就留'待核'。
- **复核**: unverified

### P1-30 [accuracy·S·conf:medium] KTA38-M2 功率上限自相矛盾 (规格卡895kW vs 实际订单1007-1044kW)
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: cumminsMatchingData.js:53-66 KTA38-M2 标 powerRange '882-1200HP', powerMin:658, powerMax:895(kW); 但同文件 typicalProjects:218-228 '48米巡逻船 KTA38-M2 1007kW HCQ700 16台' 与 orderRecords:324 'HCQ700 ... KTA38-M2 power:1007kW ... 24台' 都用 1007kW, 远超规格卡上限895kW(差112kW)。同样 K38-M typicalProjects:201 用1044kW, 而 cumminsEngines K38-M:38-51 powerMax=1044kW勉强吻合, 但 KTA38-M2 这条明显矛盾。
- **问题**: KTA38-M2 真实额定常被标 1007/1044 kW(约1350-1400 hp), 规格卡把 '1200HP' 当上限且按机械马力折算(1200×0.7457=895)偏低, 与本系统自己的订单实绩打架。销售用规格卡报895kW会低估主机能力, 也会让案例库里1007kW的同型号记录显得'超规格', 损害专业可信度。
- **提升**: 核对康明斯 KTA38-M2 官方 Project Guide(常见额定 1007kW@1900rpm 与 1044kW 变体), 把 cumminsMatchingData.js:56-58 powerMax 修到与订单实绩一致(并区分 M1/M2/额定 vs 最大), powerRange 文案改用 kW 主口径。属补正数据值, 不改 schema。
- **风险**: 需对照康明斯一手资料确认具体额定点; 改错方向会引入新偏差, 建议以已成交订单实绩(1007/1044kW)为基准回填。
- **复核**: unverified

### P1-31 [accuracy·S·conf:high] SFC 键名拼错 `mainEngine.medium`(应为 mediumSpeed)→ 三处静默回退到 default 175, 中速机油耗算偏低
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: src/utils/energyEfficiency.js:108-115 SFC_REFERENCE.mainEngine 只有 {lowSpeed:165, mediumSpeed:185, highSpeed:210, default:175}, 无 `medium` 键。但 EnergyDashboard.js:453/467/484 三处写 `SFC_REFERENCE.mainEngine.medium`(=undefined)。已用 node 验证: calculateFuelConsumption({sfc:undefined}) 因解构默认值规则回退到 default 175(emissionCalculator.js:92), 而非预期的中速机 185。另 line 453 还把 SFC 塞进 `mainEngineSFC` 键, 但 calculateAttainedEEDI 读的是 `sfcMain`(energyEfficiency.js:263) → EEDI 也吃 default 175。
- **问题**: 本想用中速机 185 g/kWh, 实际全程用 175, 燃油消耗/CO2/碳成本/EEDI 系统性偏低约 5.4%。属于'看起来在传参、其实参数没生效'的静默错误, 最难被发现。船东看到的年燃油吨数和碳成本都偏乐观。
- **提升**: EnergyDashboard.js 三处改为 `SFC_REFERENCE.mainEngine.mediumSpeed`; line 453 的 `mainEngineSFC` 改为 `sfcMain`(对齐 calculateAttainedEEDI 入参名)。更稳妥: 让 SFC 跟随用户选择的机型(低/中/高速)而非写死中速。建议补一条单测断言 EnergyDashboard 算出的年油耗在 185 口径下的期望值。
- **风险**: 极低, 纯键名修正; 不修则油耗/碳指标长期偏低。
- **复核**: unverified

### P1-32 [accuracy·S·conf:high] TCO 竞品缺价时 price=0 → 竞品总成本坍缩为近零, '节省/回本年'结论反向误导
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: tcoCalculator.js:97 `price=Number(product.price||product.estimatedPrice)||0`; 维护/大修/备件全部按 price 比例(:131/:140/:142), price=0 → 这些成本全=0, 竞品 totalTCO 仅剩同样为0。compareTCO:207 savings=competitor−hangchi 会变成大负数, breakEvenYear(:214-221) 永不触发。TCOCalculator.js:61 已意识到这点对采购成本做了 `c.competitor.totalTCO?...:0` 守卫, 但 maintenance/overhaul/spareParts(:62-64) 未守卫, 且 savings/breakEven 仍按坏数算。结合 CLAUDE.md '404型号缺价 69.1%', 竞品无价是常态。
- **问题**: 竞品没录入价格时, 系统会算出'杭齿比竞品贵几百万、永不回本'的荒谬结论, 而真相只是竞品价格缺失。这是会直接打脸销售的对客图表。
- **提升**: calculateTCO 在 price<=0 时返回 {dataIncomplete:true} 并让 compareTCO/图表显示'竞品价格待补, 无法对比 TCO'徽章(复用 priceFormatter 的询价语义), 而不是渲染 0 或负节省。breakEvenYear 在任一方价格缺失时返回 null 并提示。
- **风险**: 低; 不改则缺价竞品产出误导性对比。
- **复核**: unverified

### P1-33 [info-completeness·S·conf:high] 选型结果未显示输出(螺旋桨)轴转速 — 船用减速齿轮箱最关键的派生工程量缺失
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: EnhancedGearboxSelectionResult.js:683-712 详情表只列『输入转速』(result.engineSpeed)、减速比、目标减速比、偏差, 但全程没有『输出转速 = engineSpeed / selectedRatio』行。该派生量在系统其它处都算了 (ReverseSelectionView.js:130 `outputSpeed: speed / pr.ratio`; cpp/CPPSelectionView.js:89; torsional/TorsionalAnalysis.js:642), 唯独主选型结果不显。
- **问题**: 螺旋桨轴转速(输出转速)是船舶推进选型里工程师/船东第一眼要确认的值(决定桨径、空泡、效率), 比减速比本身更直观。主流程缺这一行, 工程师必须自己心算 engineSpeed/ratio, 报价/技术协议环节易出错。对标 ZF/Reintjes/MAN 选型工具均把 output shaft speed 作为首要输出。
- **提升**: 在 EnhancedGearboxSelectionResult.js 详情表 line 695『减速比』行后插一行『输出转速』, 值 = `(result.engineSpeed && selectedGearbox.selectedRatio) ? Math.round(result.engineSpeed / selectedGearbox.selectedRatio) + ' r/min' : '-'`; 同步加入 ComparisonTable 的 generateComparisonData (line 272-280) 与 CSV/导出列。纯展示派生, 零引擎改动。
- **复核**: unverified

### P1-34 [info-completeness·S·conf:high] 中心距(centerDistance)数据 501/501 全覆盖却从不在选型结果展示
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: embeddedData 每条齿轮箱都带 centerDistance (核查 HC400 等; 数据侧 completeGearboxData 501/501 有值)。但 EnhancedGearboxSelectionResult.js 中 grep centerDistance 仅出现在备用泵匹配逻辑 (line 186 `top?.gearbox?.centerDistance`), 详情表 line 633-756 无中心距行; ComparisonTable generateComparisonData (line 272-289) 也无。
- **问题**: 中心距是齿轮箱安装/轴系对中/基座设计的核心尺寸参数, 销售出技术协议和船厂安装都要。数据完整存在却不展示, 是纯粹的信息浪费, 工程师得另查样本手册。
- **提升**: EnhancedGearboxSelectionResult.js 详情表加一行『中心距』= `selectedGearbox.centerDistance ? selectedGearbox.centerDistance + ' mm' : '-'`(centerDistance===0 视为缺失显 '-'), 并加入对比表与导出。SelectionBasisCard 可不动(它聚焦校核); 放在详情『重量』行附近 (line 737)。
- **复核**: unverified

### P1-35 [data-gap·S·conf:high] 运行时数据源 embeddedData.js 丢失 301 个型号的外形尺寸 (主数据里有, 再生时被吞)
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: src/data/embeddedData.js (再生于 2026-05-30, 头注 '数据来源: completeGearboxData.js'): GWC63.71 'dimensions':'-' (行 7407 附近), HC300/HC400/HCD400P 均为 '-'。而 src/data/completeGearboxData.js 同型号有真实值: GWC63.71 'dimensions':'2645×2381×1740'(行7972), HC300='680×930×880', HC400='820×950×890'。脚本统计: completeGearboxData 中 491 个型号有 dimensions, 其中 301 个在活跃源 embeddedData 里变成 '-'; 全活跃源 338/544 (62%) dimensions 为空。runtime 加载链 src/index.js:39 loadAndRepairData → src/utils/repair.js:246 loadEmbeddedGearboxData() 用的就是 embeddedData。
- **问题**: 活跃源 62% 型号外形尺寸显示 '-', 而这些数据在主数据文件里真实存在, 是 scripts/generate-embedded-data.js 再生时的字段丢失/未映射 bug, 不是真缺数据。一线销售/工程师在选型结果与报价里看到 '-' 无法判断安装包络, 直接削弱工程实用性 (对标 ZF/Reintjes 选型工具外形图与尺寸是标配)。
- **提升**: 在 scripts/generate-embedded-data.js 的字段映射里补上 dimensions(及同样可能丢失的 centerDistance 校核), 或写一次性 backfill 脚本: 按 model 大写归一从 completeGearboxData 回填 embeddedData 中 dimensions==='-'||空 的记录, 重新生成 embeddedData.js。验证: 跑现成 node 比对脚本确认 lostDim 从 301→0。不改 schema, 仅补值。
- **风险**: 低 — 仅回填字符串展示字段, 不进选型硬校核; 回填后需 bump APP_DATA_VERSION(config.js:3) 让 localStorage 缓存失效拿到新尺寸。
- **复核**: unverified

### P1-36 [info-completeness·S·conf:high] 轴系选型用的是粗略轴径公式, 而代码库里已有经过测试的 CCS 规范轴径公式却没接到 UI
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: ShaftSystemSelector.js:85 用 shaftSelectionAlgorithm.js:40 的 estimateShaftDiameter(power,speed)=105×(P/n)^(1/3), 与材料无关; 而 shaftCalculations.js:191 的 calculateBasicShaftDiameter 实现了 CCS 公式 d=F×K×[Ne×560/ne/(Rm+160)]^(1/3)(区分艉轴 F=100/中间轴 F=95、柴油 K=1.0/电驱 K=0.9、材料 Rm), 且有 shaftCalculations.test.js 200+ 行专门测试覆盖。后者完全未被任何组件 import(grep 仅测试文件引用)。
- **问题**: 轴径是轴系配件选型(轴承/密封/联轴器/法兰)的输入基准, 粗算与规范算可差一个标准档位 → 连带配件选错档。更优、已验证的算法躺在仓库里没用, 一线拿到的是较弱结果, 也无法体现'按 CCS 规范+按材料'的专业度(对标 Reintjes/ZF 选型书均给规范级轴径)。
- **提升**: 在 ShaftSystemSelector 增加材料(35/45/40Cr/42CrMo, SHAFT_MATERIALS 已有)与轴类型(艉/中间)、动力源(柴油/电)选择, handleEstimateDiameter 改调 calculateBasicShaftDiameter; 同时展示 result.formula(已内置公式字符串)做透明化。两套算法可并列显示'经验估算 vs CCS 规范'。
- **风险**: 纯接线+加输入字段, 函数与测试已就绪; 风险低。需在 UI 默认材料给合理缺省(如 45 钢)避免必填阻断。
- **复核**: unverified

### P1-37 [missing-feature·S·conf:high] 1-DOF 扭振共振估算功能是死代码 — 取刚度的字段永远为空
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: src/services/couplingSelectionService.js:170-171 对每个候选取 const k = c.dynamicStiffness ?? c.staticStiffness ?? null; if(!k) return c; 但候选对象来自 enhancedCouplingSelection.js:294-306 ({...coupling, torque, maxSpeed, torqueMargin...}), 而 src/data/flexibleCouplings.js 的型号对象只有 torque/maxTorque/maxSpeed/weight/price 等, 没有 dynamicStiffness/staticStiffness 字段(grep flexibleCouplings.js 无 stiffness)。刚度数据实际在 src/data/couplingDynamicData.js 里, 须用 getCouplingDynamicData(model) 按前缀(HGTHB/HGTQ/HGT...)解析(couplingDynamicData.js:90-99)。所以 c.dynamicStiffness 恒为 undefined → k=null → 每个候选直接 return, estimateFirstResonance 永不执行。
- **问题**: 表单里专门做了'扭振参数(可选)'折叠区(CouplingSelectionForm.js:433-534, 收集飞轮/轴系/推进器惯量+避振区间), 用户填了数据点提交, 期望看到一阶共振转速与避振裕度, 但因为取刚度字段名错位, 这套 1-DOF 估算从不出结果 — 投入的 UI 和算法白做, 也是一线判断'选的联轴器会不会落在共振区'的关键工程信息缺失。
- **提升**: 在 couplingSelectionService.js:170 改为 import { getCouplingDynamicData, adjustStiffnessByTorque } from '../data/couplingDynamicData' 后取 const base = getCouplingDynamicData(c.model); const dyn = base ? adjustStiffnessByTorque(base, c.torque) : null; const k = dyn?.dynamicStiffness ?? null; (adjustStiffnessByTorque 已按额定扭矩缩放刚度, couplingDynamicData.js:104)。这样 estimateFirstResonance 能真正算出 firstNaturalSpeed_rpm/marginPct/withinAvoidanceZone。然后在 CouplingRecommendationList 卡片或技术参数区把 torsionalEstimate 展示出来(目前结果里没有任何组件读 c.torsionalEstimate)。
- **风险**: 纯加法, 不改数据结构; 仅当用户填了扭振输入才触发。须确认 couplingDynamicData 前缀覆盖到所有在售型号(HGTLX/HGTHT 等前缀未在 getCouplingDynamicData 的 prefixes 列表里, 会返回null安全降级)。
- **复核**: unverified

### P1-38 [accuracy·S·conf:high] 对比表杭齿'传递能力'恒显'-'且优势判定基准错位 — 用了数组字段而非 matchedCapacity 标量
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: selectHangchiWithScore(gearboxDataEnhancer.js:283-291) 返回 `{...g, matchedCapacity: capacity(标量,匹配速比下), margin, ...}`, 但保留原始 g.transferCapacity 为按速比的数组。ComparisonTable.js:227 `typeof hangchiProduct.transferCapacity === 'number' ? .toFixed(3) : (parseFloat(...)||'-')` → 数组走 parseFloat 取首元素或 '-' (低速比小能力)。competitorAnalysis.js:159 `parseFloat(hangchiProduct.transferCapacity)` 同样对数组 parseFloat(='0.5,0.6...'→0.5 首元素), 与竞品标量(该型号 max 能力)比 → calculateAdvantages 的 capacityAdvantage 用错基准。
- **问题**: 对比表里杭齿一栏传递能力常显示 '-' 或最小速比的值, 而竞品显示其最大值, 数量级/口径不一致 → '传递能力领先(领先)'徽章可能误判方向; 工程师看到杭齿能力空白会怀疑数据缺失。
- **提升**: 在 ComparisonTable 与 calculateAdvantages 中改用 hangchiProduct.matchedCapacity(已是匹配速比下的标量, 与所需能力 power/speed 同口径)。若 matchedCapacity 不存在再降级取数组中位/最大值。口径护栏: 只是改取数, 不引入 K_A。
- **风险**: 低: 取数字段替换。需确认非选型路径(直接列表点选未经 score 的产品)也有 matchedCapacity 兜底。
- **复核**: unverified

### P1-39 [missing-feature·S·conf:high] 销售合同不引用来源报价单/技术协议编号,文档链断点(报价→协议→合同 无交叉引用)
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/contractGenerator.js 的 contract 对象(71-130)无 relatedQuotationNumber/relatedAgreementNumber 字段;useExportHandlers.js:146-161 调 generateContract 时传入了 quotationDetails: quotation 但 generateContract 未消费其 quotationNumber。报价单侧 quotationManager.js:82 有 relationStore 溯源,协议侧 TechnicalAgreementView.js:91 有 relation,唯独合同没把报价/协议号印到合同正文。
- **问题**: 正式销售合同正文应注明'本合同依据编号XX报价单及XX技术协议签订',否则三份文件法律关系不明、价格/技术口径出现争议时无法互证。当前合同是孤立文档。
- **提升**: generateContract 接收并写入 contract.relatedQuotationNumber=priceInfo.quotationDetails?.quotationNumber 与 relatedAgreementNumber;在合同条款(PDF line286 段与 Word/ContractView)加一行'本合同依据报价单【号】及技术协议【号】订立';同时建 relationStore 合同→报价/协议关系闭合文档链。
- **风险**: 低,纯增字段+一行文本。
- **复核**: unverified

### P1-40 [accuracy·S·conf:high] 智能定价的客户专属折扣计算遗漏异常值过滤,易被默认值10%污染
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: smartPricingEngine.js:22 计算总体 avg 时对 discounts 做了 `.filter(d => d>0 && d<50)` 过滤异常;但同函数 line 26 计算 customerAvg 时直接 `q.discountPercentage || 10` 求平均,既没做 >0 && <50 过滤,又把缺失/0值兜底成字面 10。SmartPricingCard.js:104 把这个 customerAvg 显示为『该客户均X%』喂给销售。
- **问题**: 若该客户历史报价里有未填折扣的单(兜底10)或异常大折扣(如笔误90%),客户均值会被拉偏,销售据此报价会系统性偏离。同屏的总体均值做了过滤、客户均值没做,口径不一致。
- **提升**: 把 customerAvg 改为复用同一套过滤:customerQuotes 的折扣也走 `.map(q=>q.discountPercentage).filter(d=>d>0&&d<50)`,空数组则返回 null(显示『暂无该客户历史』)而非兜底10;并在卡片上标注样本量(该客户N单)让销售判断可信度。
- **风险**: 低,只影响建议值,不影响最终成交价(销售可改)。
- **复核**: unverified

### P1-41 [accuracy·S·conf:high] 价格维护工具有两套不一致的折扣率规则,且市场价倍数前后矛盾
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: PriceMaintenanceTool.js:549-560 syncToDiscountPrices 内联了一份 defaultDiscounts/specialDiscounts(如 HC1000:0.06、GWC52.59:0.10),与权威 priceManager.ts 的 getStandardDiscountRate(HC_1000_PLUS:0.06 但 GW:0.10、HCA138/HCA300=0 固定价、HCL单独12%等,line 178-217)是两套独立维护的表;两者已出现分叉(如本工具没有 HCA/HCL/固定价系列特判)。且 line 573 用 marketPrice = factoryPrice×1.12,而 priceManager 的 MARKET_PRICE_MULTIPLIER=1.1(priceManager.ts:74),同一系统两个市场价倍数。
- **问题**: 管理员用『同步折扣价』按钮批量刷价,得到的折扣率/市场价与系统其它地方(报价、产品中心)用 priceManager 算出的不一致,造成价格口径分裂;HCA138等固定价型号会被错误打上折扣。
- **提升**: 删掉 syncToDiscountPrices 内联表,改为对每条 item 调用 priceManager.getStandardDiscountRate(item.model) 与 calculateMarketPrice(item),让价格维护工具与全站共用唯一权威折扣/倍数源;市场价倍数统一取 PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER。
- **风险**: 改后部分型号折扣率会变(以 priceManager 为准才是对的),需跑一遍回归确认 HCA/HCL/固定价系列结果正确。
- **复核**: unverified

### P1-42 [accuracy·S·conf:high] 多船级社规范对比表读错返回字段，全表结论与失败数系统性失真
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: TorsionalAnalysis.js:275 `passed: compliance?.overall?.passed ?? compliance?.passed ?? null` 与 :277 `failureCount:(compliance?.checks||[]).filter(c=>!c.passed).length`，:847 `r.checks?.filter(c=>!c.passed)?.[0]?.name`。但 torsionalComplianceChecker.js:64-72 的 checkCompliance 返回的是 `{overallStatus, overallLabel, summary:{passCount,failCount}, checks:[{name,status:'pass'|'fail'|'warning'}]}` —— 既无 `overall.passed`/`passed`，每条 check 也只有 `status` 没有 `passed` 布尔。
- **问题**: `compliance.overall.passed` 与 `compliance.passed` 永远 undefined → 每家船级社的 `passed` 恒为 null → 对比表 :837-843 一律渲染蓝色'部分'徽章，无法显示通过/不通过；`!c.passed` 对每条 check 都为真 → failureCount 恒等于检查总条数（虚高）；'主要差异'列 :847 取 filter 后第一条，恒为第一条检查名（即便它通过）。这是'对标多船级社(CCS/ABS/DNV/LR/BV/IACS)'旗舰卖点，结果整表数据全错，会误导工程师判断合规性。
- **提升**: 把 :275 改为读 `passed: compliance.overallStatus === 'pass'`（或 `!== 'fail'`）；:277 改为 `compliance.checks.filter(c=>c.status==='fail').length`；:847 改为 `r.checks?.filter(c=>c.status==='fail')?.[0]?.name`。同时把 :275 的 `region/type` 已正确，无需动。改完用现有 multiCompareResults 渲染逻辑即生效。
- **风险**: 纯前端读字段修正，零数据风险；改后建议补一条断言/测试覆盖 overallStatus 三态映射。
- **复核**: unverified

### P1-43 [professionalism·S·conf:high] 选型'临界转速预检'把经验估算J/K当权威频率/裕度展示，无估算免责，违反诚实性铁律
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: criticalSpeedCheck.js:18-36 J1=`torque*0.001`、J2=`J1*0.3`、K=`2.5e6*(P/1000)^0.5` 全为 rule-of-thumb；返回 estimatedParams。EnhancedGearboxSelectionResult.js:834-849 卡片展示 `固有频率 X Hz`/`工作频率`/`裕度 Y%` 并以红绿色给出安全结论，method 文案仅'simplified-two-mass'，但 estimatedParams（J1/J2/K）从未在卡片显示，也无'输入为经验估算、非实测惯量/刚度'的提示。
- **问题**: 用户看到的是看起来精确到 Hz 与百分比裕度的'临界转速预检'结论，但其全部输入（轴系惯量、刚度）是与所选齿轮箱真实参数无关的粗略经验公式（连螺旋桨惯量都是发动机端×0.3的拍脑袋值）。这等于把'算出来的值'当工程实测呈现，正是项目铁律②禁止的行为。一线销售可能据此向客户承诺'已校核临界转速安全'。
- **提升**: ①在卡片 :835-848 顶部加常驻灰色免责条：'本预检为两质量经验估算（J/K 由功率/扭矩反推，非实测），仅作高转速/PTO 初筛；精确校核请用扭振分析模块'。②展示 estimatedParams（J1/J2/K）让用户看到输入是估算。③把结论措辞从'初步评估安全'弱化为'未见明显临界风险（估算）'。代码已返回 estimatedParams，只需在 :841 的 flex 行追加渲染。
- **风险**: 纯文案/展示增强，不改算法；降低对外承诺风险。
- **复核**: unverified

### P1-44 [accuracy·S·conf:high] PTO/PTI'散热上限'用机械额定×猜测损耗系数伪造热功率，违反'不臆造热数据'
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: ptoThermalMargin.js:48 `ratedKw = ratedCapacity*engineSpeed`（机械传递功率，非热额定），:8/:65 `thermalLimit = ratedKw*(1-efficiency)`，η 默认 0.97（:52）→ 散热上限≈3%×额定功率。EnhancedGearboxSelectionResult.js:1147 直接展示'散热上限: X kW'并据此 :1133-1141 给'过热风险'红牌。notes(:85-91) 未声明该上限是估算。
- **问题**: 齿轮箱真实热极限是油冷系统散热能力（厂家数据表独立值），与'额定机械功率×(1-η)'无任何物理对应——后者只是齿面/轴承的发热量，不是散热能力。用一个猜测的 η=0.97 把发热量当成'散热上限'两边比，分子分母同源，utilizationPct 实际只反映 throughPower/ratedKw 的功率比，'热'字纯属包装。把这个伪造值标红判'过热风险'会误导（数据里根本没有 thermal 字段，正属铁律②'缺数据应标待补'的场景）。
- **提升**: 两条路选一：①诚实降级——把标题从'散热上限'改为'额定功率占用率'，去掉'过热/散热'措辞与红牌，notes 注明'齿轮箱热平衡数据缺失，本项仅为功率裕度估算，热校核需厂家油冷散热数据'；②若坚持热模型，必须引入真实热额定字段（数据缺失则显示'热数据待补'而非算一个值）。推荐①，改 ptoThermalMargin.js:8/85-91 注释与 EnhancedGearboxSelectionResult.js:1138-1147 文案即可。
- **风险**: 改文案与判定口径，不臆造；与项目财务/数据诚实策略一致。
- **复核**: unverified

### P1-45 [accuracy·S·conf:high] 选型评分'临界转速禁区扣分'在2000-3000rpm非PTO工况静默失效（门控阈值不一致）
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: selectionAlgorithm.ts:1596-1603 注释'降低门槛到 engineSpeed>2000 以覆盖更多船用柴油机工况'，分支条件 `if(engineSpeed>2000||isPTOorPTIEnabled)` 调 performCriticalSpeedCheck。但 criticalSpeedCheck.js:49 `if(engineSpeed<=3000 && !isPTO) return null` —— 对 2000<n≤3000 的非PTO机直接返回 null，:1604 `if(csCheck)` 为假，score-22/score-10 永不触发。
- **问题**: 代码作者显式想把临界转速共振扣分门槛从3000降到2000以覆盖更多中高速船机，但只改了调用方阈值、没同步改引擎内部 gate，导致整个 2000-3000rpm 非PTO 区间的'共振禁区-22分/接近临界-10分'逻辑是死代码。该区间正是大量高速船用柴油机（如1900-2300rpm级）所在，本应排序惩罚的共振风险型号得不到降分，影响推荐排序准确性。
- **提升**: 在 criticalSpeedCheck.js:47-50 增加可选阈值参数 `triggerSpeed=3000`，或直接把 gate 改为 `if(engineSpeed<=2000 && !isPTO) return null` 与调用方对齐；并在 selectionAlgorithm.ts:1878 的 3000 门控处统一为同一常量，避免两处再次漂移。补一条 2500rpm 非PTO 应返回非 null 的单测。
- **风险**: 降低 gate 后会有更多型号进入预检（计算量小，两质量闭式解）；需确认 2000-3000rpm 段不会因经验估算误判而过度扣分——建议同时落实发现2的免责，避免估算驱动排序的连带风险。
- **复核**: unverified

### P1-46 [ux·S·conf:high] 条款详情弹窗/卡片漏配3个新分类的中文名与图标, 能效/螺旋桨/船级社条款显示英文id或undefined图标
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: clause-kb.json 的 categories 数组(line 84-101)定义了 energy-efficiency/propeller-matching/classification-requirements 三个新分类(各带中文名'能效合规'/'螺旋桨选配'/'船级社认证'和图标), 且确有 6+6+6=18 条对应 clauses; 但 ClauseDetailModal.js 的 categoryNames(line 24-37)/categoryIcons(line 8-21)/categoryColors(line 40-53) 与 ClauseCard.js 的同名 map(line 10-55) 都只硬编码了最初 12 个分类, 全无这3个 key。ClauseCard.js:136 有 `categoryNames[clause.category] || clause.category` 兜底→卡片显示原始英文 'energy-efficiency'; ClauseDetailModal.js:114-117 无兜底→Badge bg 与 icon 取到 undefined。
- **问题**: 占总条款量约 20%(18/93)的能效合规、螺旋桨选配、船级社认证三类条款——恰是最专业/最该体面展示的内容——在卡片上显示成生英文 id、在详情弹窗里图标缺失/颜色错乱, 显得不专业且分类标签失效。
- **提升**: 把 clause-kb.json categories 数组作为单一数据源, 在 ClauseCard.js 和 ClauseDetailModal.js 改为从 props/导入的 categories 派生 name/icon/color(或直接给三个硬编码 map 补上这3个 key: energy-efficiency→{name:'能效合规',icon:'bi-lightning-charge',color:'success'} 等), 并给 ClauseDetailModal 的 Badge/icon 加 `|| 'secondary'` / `|| 'bi-tag'` 兜底, 与 ClauseCard 对齐。
- **风险**: 纯展示层修改, 零数据风险; 注意两文件 map 要同步改避免再次漂移。
- **复核**: unverified

### P1-47 [accuracy·S·conf:high] DNV 全站仍用过时名称'DNV-GL'/'Det Norske Veritas Germanischer Lloyd'(2021-03已更名DNV)
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: DNV GL 已于 2021-03-01 正式更名为 'DNV'。但 src/utils/classificationCompliance.js:58-59 仍写 `name:'DNV-GL', fullName:'Det Norske Veritas Germanischer Lloyd'`; classificationCertificates.js:156 `name:'DNV-GL'`, line 368 描述 'DNV-GL认证', line 473 下拉 'DNV-GL (挪威/德国)'。注意 CertificationView.js:9 已正确用 'DNV船级社'/挪威, 说明全站不一致。
- **问题**: 对外报价单/证书清单/合规报告里出现 5 年前的废弃船级社名称, 在国际航线客户(尤其欧洲船东)面前显得资料陈旧、不专业; 与国际标杆(ZF/Reintjes 选型工具均用最新 DNV 命名)对标明显落后。
- **提升**: 全局把 'DNV-GL'→'DNV', fullName 改为 'DNV (原 DNV GL)' 或 'DNV AS', 下拉标签改 'DNV (挪威)'。涉及 classificationCompliance.js:58-59、classificationCertificates.js:20注释/156/368/473。同时核对 ABS_PART_4_CH_3 等 rulesVersion 字符串是否仍是各社最新版年号。
- **风险**: 字符串展示替换, 无逻辑风险; society code 'DNV' 作为对象 key 不要动(只改 name/fullName/label 显示字段)。
- **复核**: unverified

### P1-48 [accuracy·S·conf:medium] EEXI 规范号引用内部不一致: 标准库标 MEPC.328(76), 计算引擎与条款库标 MEPC.333(76)
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: EEXI 的强制要求与削减系数表来自 MARPOL Annex VI 修正案 MEPC.328(76); 而 MEPC.333(76) 是'计算 attained EEXI 的方法导则'。StandardsLibrary.js:9 正确写 `MEPC.328(76) ... EEXI/CII能效指标要求`; 但 energyEfficiencyCompliance.js:3/9/15/301 把整个 EEXI 归到 `MEPC.333(76)`(包括 line 261 用的 requiredEEXI 削减系数, 实际系数表出自 .328), 且 imoComplianceEngine.js:17 IMO_VERSION 字符串、clause-kb.json energy-001 也写 'IMO MEPC.333(76)' 作为 EEXI 强制依据。
- **问题**: 同一系统对同一指标引用两个不同决议号, 且把'要求依据'(.328)与'计算方法'(.333)混为一谈。客户或船检看到合规报告里规范号自相矛盾会质疑整个计算的可信度——合规工具的命门就是规范引用要精确。
- **提升**: 统一口径: required EEXI(削减系数/强制要求)引 MEPC.328(76); attained EEXI 的计算方法引 MEPC.333(76); 参考线 a/c 系数引 MEPC.231(65)(EEDI 参考线导则)。在 energyEfficiencyCompliance.js 把 `standard:'IMO MEPC.333(76)'`(line 301)的语义拆成 requirementBasis/calcMethod 两个字段, 并修 clause-kb energy-001 的 source 为 'IMO MEPC.328(76)(要求)+MEPC.333(76)(计算)'。
- **风险**: 仅改注释/展示字符串与一个 source 字段, 不动计算数值, 零回归; 改 clause-kb 是改'值'非'schema', 符合护栏。
- **复核**: unverified

### P1-49 [accuracy·S·conf:high] 安装指南与标准库自身均引 ISO 10816 振动标准, 该标准已被 ISO 20816 替代
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: ISO 10816 系列已被 ISO 20816 系列取代。InstallationGuide.js:69 试车调试步骤写 `'振动检测：参照 ISO 10816 标准'`; clause-kb 与多处仍以 10816 为现行。讽刺的是 StandardsLibrary.js 自己在 line 43 已收录 `ISO-20816 ... 机械振动测量和评价—通则(替代ISO10816)`, 却在 line 14 仍把 `ISO-10816-1 (1995) 状态:现行` 并列, 未标'已废止/被替代'。
- **问题**: 给一线工程师的安装/验收指南引用了已废止标准, 验收报告若写 ISO 10816 会被新船级社要求改 20816。标准库把废止标准标成'现行'更是直接的准确性错误。
- **提升**: ①InstallationGuide.js:69 改为 '参照 ISO 20816(替代 ISO 10816)'; ②StandardsLibrary.js / standardsData.js 把 ISO-10816-1 的 status 由 '现行' 改为 '已废止(被ISO 20816替代)' 并在 desc 加跳转提示。顺带核 ISO 8579-1 年份(line 12 标 2002, 现行版为 2022)。
- **风险**: 无; 状态字段是数据值非 schema。
- **复核**: unverified

### P1-50 [missing-feature·S·conf:high] 标准库缺 2024-2025 重大新规: FuelEU Maritime 与 EU ETS 航运纳入
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: grep 'FuelEU|EU ETS|ETS' src/components/StandardsLibrary.js 与 src/data/standardsData.js 均无结果。环保类只收到 EU-MRV(line 73)、IMO-GHG(line 72)、MARPOL-VI。但 EU ETS 已于 2024-01-01 起把航运纳入碳排放交易、FuelEU Maritime 法规已于 2025-01-01 生效, 二者是当前欧洲航线船东最关心的合规成本来源, 直接影响低能耗齿轮箱的选型卖点。
- **问题**: 标准库自我定位是'船用齿轮箱相关国际标准/船级社规范快速检索', 却漏了两条 2024-2025 最热、且与本系统'高传动效率→帮船东省碳成本'卖点强相关的法规。销售用此库给客户讲合规故事时缺了最有说服力的弹药, 也显得资料更新滞后。
- **提升**: 在 STANDARDS_DATA(同时改 StandardsLibrary.js 与 standardsData.js 两份, 见下一条)的环保类补两条: {id:'EU-FuelEU', name:'FuelEU Maritime', org:'EU', category:'环保', desc:'船用燃料温室气体强度限值(2025生效, 每5年加严)', year:2025, status:'现行'} 和 {id:'EU-ETS-Mar', name:'EU ETS (航运)', org:'EU', category:'环保', desc:'欧盟碳排放交易体系纳入海运(2024起分阶段)', year:2024, status:'现行'}; 可在条款库 energy-efficiency 分类各补一条解读其对齿轮箱效率选型的影响。
- **风险**: 纯加数据条目, 零风险; 两份 STANDARDS_DATA 须同步加。
- **复核**: unverified


## P2 (48)

### P2-1 [data-gap·L·conf:high] 三套引擎数据库各自为政, 无单一真相源 (数据碎片化)
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: src/components/EngineMatchingExpanded.js:87-395 内联硬编码 ENGINE_DATA 共272行(`{ engine: '康明斯 B6.7M', power:149, speed:2600, ...}`); src/data/cumminsMatchingData.js:6-127 另有 cumminsEngines 8条(K19/K38/K50/QSN); src/data/marineEngineDatabase.js:102 起 marineEngines 仅15条(MAN/Wartsila/CAT等, grep `ratedPower_kW:` 计15)。三者品牌/型号/功率口径不互通: marineEngineDatabase 连旗舰康明斯都没有(grep Cummins=0条真机), 而 EngineMatchingExpanded 有16条康明斯。engineDatabaseUtils 只被 EngineInfoSection.js:7 表单自动补全消费, 主匹配视图完全不用它。
- **问题**: 同一台主机(如康明斯 KTA38)在不同页面参数可能不一致, 维护时要改三处; 富schema库(marineEngineDatabase)投入了扭矩曲线/SFC/EIAPP 录入成本却被边缘化(仅autocomplete填功率转速)。销售在'多品牌主机匹配'页查到的康明斯参数 与 'CUMMINS×杭齿案例库'页参数 来源不同, 易给客户报出互相打架的数据。
- **提升**: 以 marineEngineDatabase.js 为权威源(schema最完整), 把 EngineMatchingExpanded 的 ENGINE_DATA 逐步迁入/对账到该库(补齐康明斯16条+CAT等的 torqueCurve/applicationTypes 字段), 通过 engineDatabaseUtils.searchEngines 统一供 EngineMatchingExpanded / CumminsMatchingView 读取。不动 schema, 仅做数据补录+读取层归一; 过渡期先在三处加注释标注'权威源=marineEngineDatabase'并写一个一致性校验脚本(参照 scripts/validate-engine-db.js)对账重叠型号的 power/speed。
- **风险**: 迁移期间若映射不全会导致某些主机在匹配页消失; 需逐品牌灰度并保留 ENGINE_DATA 作兜底, 不可一次性删。
- **复核**: confirmed — 实地核实三处数据源全部属实且彼此隔离: ①EngineMatchingExpanded.js:87 内联 ENGINE_DATA, grep `engine: '康明斯` 精确命中16条 (与发现描述一致); ②cumminsMatchingData.js:6-127 cumminsEngines 8条 (K19/KT19/K38-M/KTA38-M2/K50-M/KTA50/QSNT-M350/

### P2-2 [professionalism·L·conf:medium] 联轴器/泵选型未给出装配级工程参数(轴孔径/对中/许用不对中校核), 与国际标杆有差距
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: 全链路(flexibleCouplings.js 数据 + CouplingTechnicalParams.js 展示)均无轴孔径范围(bore range)、法兰接口尺寸、许用不对中量与实际安装不对中的校核。couplingDynamicData.js 有 compensation(补偿能力)但选型流程从不让用户输入实际轴系不对中量去比对。泵侧 PumpSelectionView 也只到流量/压力/NPSH, 无吸入管径/管长校核(NPSH建议里提了但无计算)。
- **问题**: ZF/Reintjes 的选型工具会做'许用不对中 vs 安装不对中'的红绿校核和轴孔径匹配提示。本系统选完联轴器只告诉扭矩够不够, 不告诉这台联轴器能不能装上客户的轴(孔径)、能容忍多大安装误差, 一线还得查纸质样本, 专业完整性不足。
- **提升**: P2 增量: ①在数据层(不改 schema, 走 enrichment 叠加文件如 couplingDynamicData 已有 compensation)给联轴器补 bore 范围, 选型后提示'适配轴径 Φx–Φy mm'。②加可选的'安装不对中输入'(轴向/径向/角向), 与 compensation 比对给绿/黄/红判定, 复用已有 compensation 数据即可, 算法极简。先做联轴器侧价值最高。
- **风险**: 低(纯叠加+UI), 但 bore/法兰数据需从样本录入, 无数据的型号如实标待补不编造。
- **复核**: unverified

### P2-3 [ux·L·conf:medium] 技术协议导出Word仅把HTML改后缀.doc(伪Word),复杂表格/中英对照在真Word中易错版
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/components/TechnicalAgreementView.js:118-137 exportToWord: `new Blob([agreement.html], {type:'application/msword'})` 后 link.download=`${filename}.doc` — 即把 agreement.html 直接当 .doc 下载,非真正 docx。对照合同走的是 contractGenerator.js:336 exportContractToWord 用 docx 库正经生成。技术协议(bilingualTemplates.js 含大量 table 布局)用伪doc打开后表格边框/分栏常错位。
- **问题**: 技术协议是中英文对照、表格密集的正式交付物,伪.doc 在不同Word版本/WPS里渲染不稳定(样式丢失、表格塌陷),销售拿去发船东/船检显得粗糙。已有 docx 库且合同已用,协议却没用。
- **提升**: 技术协议导出复用 docx 库(参考 contractGenerator.exportContractToWord),把 agreement 结构化数据渲染成真 docx 表格;过渡期至少把伪doc导出加 Word HTML 命名空间头(<html xmlns:o='urn:schemas-microsoft-com:office:office'>+mso样式)提升兼容性,并在按钮旁提示'建议用PDF交付正式版'。
- **风险**: docx 重写协议模板工作量较大;先做兼容头是低风险过渡。
- **复核**: unverified

### P2-4 [professionalism·M·conf:medium] EnergyDashboard 顶栏标 'IMO MEPC.333(76)' 却按 EEDI(建造年定phase)算合规, EEXI/EEDI 概念混用
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: EnergyDashboard.js:615 徽章 `IMO MEPC.333(76)`(=EEXI for 现有船), :1252 数据来源也写 'IMO MEPC.333(76) EEXI计算指南'; 但概览卡(:756-783)展示的是 calculateAttainedEEDI + evaluateEEDICompliance(energyEfficiency.js:364-370 按 buildYear<2015/2020/2025 选 phase0-3, 这是 EEDI 的新造船分阶段逻辑)。EEXI 不分建造阶段(对存量船一刀切, energyEfficiencyCompliance.js 才正确按固定 reductionFactor 算)。两个概念在主面板被混着用。
- **问题**: 对懂行的船东/船检, EEXI(存量船一次性达标)和 EEDI(新造船按交付年分阶段)是两套不同指标, 面板挂着 EEXI 抬头却跑 EEDI 分阶段逻辑, 显得不专业, 也可能让用户误判自己该看哪个指标。
- **提升**: 明确分区: 概览卡若展示 EEDI 就把抬头/来源改成 'IMO MEPC.245(66)/308(73) EEDI'; 若要做 EEXI 就改调 energyEfficiencyCompliance.calculateEEXI。理想是两个卡并列(新造船看 EEDI、现有船看 EEXI), 并加一句口径说明。
- **风险**: 中; 涉及面板信息架构, 需与业务确认主要面向新造还是改装客户。
- **复核**: unverified

### P2-5 [data-gap·M·conf:medium] 排放因子表混用 IMO CF 与活动排放因子, 且 NOx/PM 用固定 Tier/燃油因子未随工况联动, 缺权威出处
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: emissionCalculator.js:23-52 NOx 用 Tier1/2/3 固定 kg/t-fuel(default tier2=14.4), SOx 按 0.5%/0.1%S 固定, PM 按燃油类型固定。EnergyDashboard.js:921-932 排放因子表 NOx 标 'IMO NOx规则'、PM 标 'EPA AP-42'。但 calculateEmissions(emissionCalculator.js:191-208)对一台具体齿轮箱选型场景, NOx 实际取决于发动机转速/Tier 与是否在 ECA, 这些 UI 没让用户选(noxTier 在 dashboard 调用:490 写死隐含 default), 也没说明 14.4 等数值的版本/出处。
- **问题**: NOx/SOx/PM 这些非 CO2 排放对'选齿轮箱'本就间接, 现在又是固定因子且无法随实际机型 Tier/ECA 调整, 还混标了 IMO 与 EPA 两套来源, 数值可信度和可追溯性都弱。对要做环评/进 ECA 海域的客户参考价值有限。
- **提升**: 在 dashboard 暴露 NOx Tier(I/II/III)与 ECA 开关让用户选(calculateEmissions 已支持 options.noxTier/isECA, 只差 UI 接线); 排放因子表加'来源+版本'列(如 IMO Third GHG Study / MARPOL Annex VI Reg.13); 对无法精确的项标注'按 Tier II 全球航行估算'。CO2 之外的排放统一标注估算性质。
- **风险**: 中; 主要是 UI 接线 + 出处补全, 计算逻辑已就绪。
- **复核**: unverified

### P2-6 [missing-feature·M·conf:high] 缺少可导出的能效/排放/TCO 报告 — 标杆工具均提供 PDF/船检可用清单
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: EnergyDashboard.js 全文无 export/PDF/print 逻辑(grep jsPDF/html2pdf/导出 均无), 仅底部 :1255 一句免责声明。仓库虽装了 jsPDF/html2pdf(CLAUDE.md), 但能效页未接。energyEfficiency.js 有 generateEnergyEfficiencyReport(:534)生成结构化报告对象, 却没有 UI 把它导出。
- **问题**: 对标 ZF/Reintjes/MAN 的能效选型工具, 客户拿走的是一份可附进船检/投标的能效与排放清单。本系统算完只能截图, generateEnergyEfficiencyReport 这个现成报告生成器还被闲置, 价值没落地。
- **提升**: 在 EnergyDashboard 加'导出能效报告(PDF)'按钮, 复用已 import 的 generateEnergyEfficiencyReport 输出结构, 配 html2pdf 出 PDF, 内容含: 输入参数、EEDI/EEXI/CII 三指标+合规结论、年排放与碳成本、FuelEU 罚款估算、所选齿轮箱型号与效率, 底部带免责声明与口径说明。
- **风险**: 低; 报告生成器已存在, 主要是接 UI 与排版。
- **复核**: unverified

### P2-7 [ux·M·conf:medium] 传递能力余量上限默认 50% 把合格的偏大型号全部踢入『近似匹配』, 缺价库存型号场景下可能无主推荐
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: selectionAlgorithm.ts:848 `MAX_CAPACITY_MARGIN = ...(configTolerances.maxCapacityMargin || 50)`; line 1179-1194 余量 >50% 的型号计入 capacityTooHigh 并塞 nearMatches、`continue` 不进主推荐。表单未下传 application/tolerances(见上条), 所以全程恒用 50% 上限。
- **问题**: 工作船/拖轮/疏浚等工况常用偏大齿轮箱(余量 60-100% 是正常选择), 而手册传递能力已含安全系数、余量大不构成安全问题(项目口径), 把它们一律降级到『近似匹配』会让工程师在主列表里看不到本应推荐的库存大箱, 排序体验偏保守。注意: 这是排序/呈现策略问题, 非安全 bug。
- **提升**: 结合上一条让表单按 application 下传 tolerances(workboat=80%、special=100%); 或在 EnhancedGearboxSelectionResult 主结果区给一个『显示偏大但合格型号(余量>50%)』开关, 把 capacityTooHigh 的 nearMatch 以中性样式并入可选列表, 而非只在底部『余量不足候选』区。不改硬下限(余量≥0 合格)口径。
- **复核**: unverified

### P2-8 [accuracy·M·conf:medium] capacityEstimator 用型号数字×系数『编造』传递能力, 经 fixGearboxCapacityArrays/correctDatabase 可写回数据库(虽当前仅手动触发)
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: capacityEstimator.js:44-84 getBaseCapacityByModel 用 `modelNumber/1000` 等纯启发式估容量; fixData.js:219-224 在缺容量时 `estimateTransferCapacityArray(item, ratios)` 写入 item.transferCapacity; dataCorrector.js:66-76 correctDatabase 调用它; App.js:16/1935 correctDatabase 仅在 DiagnosticPanel(用户手动『修复数据库』)触发, 非启动自动跑。
- **问题**: 这条估算链产出的是和真实手册无关的杜撰容量(如 GW 系列一律 model/1000), 一旦工程师在诊断面板点了『修复数据库』, 缺容量型号会被填上看似合理实则编造的传递能力并参与选型——违反项目『不臆造无数据指标』铁律。当前因非自动触发危害有限, 但是个埋雷。
- **提升**: fixData.js:217-230 缺容量分支不要再调 estimateTransferCapacityArray 编值, 改为标记 `_capacityMissing=true` 并在选型中跳过该型号(或显『容量待补』), 与 priceFormatter『询价』兜底一致的诚实策略; 或在 estimateTransferCapacity 返回值上打 `_estimated:true` 让选型/展示明确区分估算 vs 手册值。
- **复核**: unverified

### P2-9 [data-gap·M·conf:high] 活跃源 141/544 (26%) 型号缺重量、87 个 GCH 族缺重量 — 拉低数据完整性评分与选型展示
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: 脚本统计活跃 embeddedData: 141 个型号 weight 缺失/为 0 (HCD400P/HCD600P/HCT 全系 P 变体, GWC63.71(带PTO) 等); completeGearboxData 中 87 个(GCH 全族 GCH320..GCH1000 + GCH 衍生)缺重量。GearboxScorer.js:59-90 的 dataCompleteness 把 weight 列为 7 个必填字段之一(行67), 缺一项扣约 14% 完整度分; 选型评分 totalScore 含 dataScore(行239)。
- **问题**: 重量是船舶配载/吊装的关键参数, 26% 活跃型号无重量。这不仅让 DataCompletenessCard 显示低分, 也削弱选型结果的工程可信度。GCH/HCT-P 变体整族缺失说明是某批次录入遗漏, 非个别。
- **提升**: ①对 P 变体(带PTO/液力): 多数与基型重量接近, 可由对应基型 weight 推算并标注 'weight 估算(基于基型)' 而非留空(遵守铁律: 标注估算不冒充实测)。②GCH 族重量需从杭齿 2025 手册补录(项目已有 pdfplumber 提取经验, 见 MEMORY GW 修复)。③在 validateGearbox(dataValidator.js:69) 把缺 weight 从 warning 升级为可统计的完整度指标, 输出缺失型号清单驱动补录。
- **风险**: 低 — 补录/估算重量不影响传递能力硬校核(不进 power/speed 公式); P 变体估算须明确标注来源避免被当实测。
- **复核**: unverified

### P2-10 [data-gap·M·conf:high] GC 全族(GCH/GCHE/GCHT/GCST/GCS)是真实询价缺口的主簇 + 含多个高营收热销型号
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: 脚本核活跃源经 inline+lookup(priceFormatter 兜底)后真实'询价'仅 55/544=10.1%(远好于 CLAUDE.md 记的 404/69.1%, 该旧值是 complete inline-only 口径), 但缺价高度集中在 GC 族: GCH490/540/590/660/950/1000、GCHE15/20/26/33、GCHT115/135/15/170/20/26/33/44、GCST115/135/15/170/20/26/33/44、GCS490/590/660/950 全无价。reports/price-coverage-20260424.json 另列 TOP50 热销中 19 个无价含高营收: HCAM403(¥445万营收)、HCD2001(¥204万)、HCM250(¥125万)、HCLN4300(¥104万)、HCAM500(¥127万)。
- **问题**: 整数据质量的'缺价'其实已被兜底链路压到 10%, 但剩余缺口非随机: GC 中大功率族整片无价(销售遇到只能全程'询价'), 且 19 个真实成交过的热销型号无标准价, 报价依赖个人经验。reports/top50-price-proposal.json 补录提案已生成却未合入 gearboxPricing.js。
- **提升**: ①优先把 reports/top50-price-proposal.json 的 19 个热销补价经财务确认折扣率后合入 src/data/gearboxPricing.js(脚本 propose-top50-prices.js 已就绪)——这 19 个有真实成交均价可锚定(如 HCAM403 avgSalePrice 120379)。②GC 大功率族向杭齿索取 2025 价表批量补录。③更新 CLAUDE.md 的 '404 个缺价/69.1%' 为活跃源真实口径 '约 55 个/10.1%(经兜底后)', 避免后续误判严重度。
- **风险**: 低 — 补价走财务签字闭环不臆造; 热销型号有成交均价可对账, 风险可控。
- **复核**: unverified

### P2-11 [missing-feature·M·conf:high] 数据校验工具只查单条字段格式, 不查跨型号族系合理性(价格单调/能力递减/占位检测)
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: dataValidator.js validateGearbox(行10) 与 DataConsistencyChecker.js(行15-25) 只校验单条记录: ratios/transferCapacity 数组长度匹配、字段>0、单位。无任何跨型号族系校验。check-data-drift.js(scripts) 也只比 ratio 长度与 price 差异, 不查同族价格单调性/占位簇。结果: GCH320=160000 而更大的 GCH390=34200 这类族内矛盾、GWC P 族 7 连 450000 占位, 现有工具全部漏检。
- **问题**: 船用齿轮箱同族型号物理上应满足: 尺寸/能力/重量/价格随机型号递增, transferCapacity 随 ratio 递减。缺乏族系级一致性校验, 使占位价、录入错位、再生丢字段这类系统性缺陷无法被自动发现(本次全靠手写脚本才查出)。
- **提升**: 新增 scripts/audit-family-consistency.js 并接入 check 流程: 按型号族(正则提取 GCH/GWC/HC...前缀+数字)分组, 校验 ①price 随 capacity 单调(允许小幅倒挂阈值, 越界报警) ②transferCapacity 数组随 ratio 单调递减 ③同族 price 完全相等簇(占位嫌疑) ④priceSource 含'估算'计数。输出报告 + 可选 --strict 阻断。这是把本次人工发现固化成长期门控, 对标成熟选型库的数据 QA。
- **风险**: 低 — 纯新增只读审计脚本, 不改数据/schema; 单调阈值需按真实价表标定避免误报。
- **复核**: unverified

### P2-12 [missing-feature·M·conf:medium] CPP 主界面无桨型(FPP/CPP、Wageningen B / Ka-19A 导管)选择, 拖轮场景拿不到导管桨结果
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: propulsionMatchingSolver.js 与 propellerSeriesDB.js 已支持 Ka-19A 导管桨(拖轮/AHTS/推船 prefer:'KA_19A', VESSEL_TYPES 行20-22)并能算 KT/KQ/η0; 但 CPPSelectionView 的水动力链(line 76-105)固定走 cppHydrodynamics 的 Wageningen B 简化系数, 无 series 下拉切换到 Ka-19A。PropulsionMatchingHub 能选 Ka 但 CPP 详细选型页不能。
- **问题**: 拖轮/AHTS(MEMORY 记录的核心目标市场, 如 5000HP 拖轮 GWC42.45)几乎都用导管桨, 其低速高拉力性能远优于敞水 B 桨。CPP 详细页只给 B 桨水动力, 对拖轮客户的核心工况(系泊拉力)不专业、偏低估。
- **提升**: 在 CPPSelectionView 加'桨型系列'下拉(listPropellerSeries() 已提供), 选 Ka-19A 时水动力走 calculateKa19APerformance(propellerSeriesDB.js:58); 船型选拖轮/AHTS 时默认 Ka-19A。复用已有 Hub 的分发逻辑(calculatePerformance)。
- **风险**: Ka-19A 当前是简化 4 阶拟合(propellerSeriesDB 注释明示完整 26 项留 P2), 须在 UI 标注'Ka 系列为工程估算拟合'。属增量功能。
- **复核**: unverified

### P2-13 [info-completeness·M·conf:medium] 联轴器丰富工程数据(动刚度/阻尼/补偿量/疲劳寿命/橡胶牌号)未在推荐卡与主参数表呈现
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: src/data/couplingDynamicData.js:5-83 每个系列都有 staticStiffness/dynamicStiffness/dampingCoefficient/compensation{axial,radial,angular}/rubberType/tempRange/fatigueLife/hardness 完整数据。但 CouplingRecommendationList 卡片(行114-141)只展示扭矩/余量/转速/重量/价格; CouplingTechnicalParams 主参数表(技术参数Tab)也只列扭矩/转速/重量。这些动态数据仅在 CouplingTorsionalAnalysis.js(扭振分析子Tab, 行162/174-188)出现, 用户要点进去才看得到。
- **问题**: 对标 ZF/Reintjes/Vulkan 的联轴器选型工具, 弹性元件的动态扭转刚度、阻尼比、轴向/径向/角向补偿能力、橡胶牌号与温度范围、疲劳寿命是工程师判断'能否吸收振动/容许多大不对中/在多高油温下可靠'的核心依据, 属于该显的关键信息。现在埋在二级Tab里, 推荐卡和主参数表只给商务参数, 专业度不足, 一线给船东做技术答疑时拿不出这些。
- **提升**: 在 CouplingTechnicalParams 主参数表(renderTechnicalParams)直接补几行: 动态扭转刚度(getCouplingDynamicData+adjustStiffnessByTorque 按本型号额定扭矩缩放)、阻尼比、轴向/径向/角向补偿、橡胶牌号、工作温度范围、设计寿命。推荐卡可加一个'弹性元件: NBR/补偿±3mm/2万h'的小摘要行。数据已现成, 纯展示层。缺数据的前缀(HGTLX/HGTHT)如实留空标'待补'。
- **风险**: 低; adjustStiffnessByTorque 是估算缩放, 展示时标注'估算刚度, 精确值以扭振计算书为准'避免被当实测。
- **复核**: unverified

### P2-14 [professionalism·M·conf:medium] 对比表杭齿综合评分硬编码 5 星 + 竞品星级由 overallScore 反推 — 缺少可解释依据, 削弱'数据驱动'专业度
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: ComparisonTable.js:404-411 杭齿综合评分写死 5 颗实心星(map [1,2,3,4,5] 全 star-fill); line 415 竞品 `score = 5 - overallScore/2` 反推星级, 而 overallScore 来自 calculateAdvantages 里一串加分常数(价格+2/交期+1.5/能力+1/重量+0.5/服务默认+1 等), 服务优势对竞品恒成立(util:210-217)给杭齿固定加分。
- **问题**: 对销售内部话术尚可, 但作为'对比报告'对外/对工程师呈现时, 杭齿恒 5 星 + 不透明评分公式显得是预设结论而非客观对比, 一旦客户追问依据难以自圆, 与国际标杆工具的可解释打分有差距。
- **提升**: ①把评分维度拆解显示(像选型 TOP5 表已做的'富裕度50+速比30+价格20'那样), 让每颗星对应可见维度。②杭齿星级也按同一公式计算而非写死, 至少在 tooltip 标注'本评分含本地化服务等主观加权, 供销售参考'。保留销售导向但增加透明度。
- **风险**: 低: UI/展示层调整, 不改业务数据。
- **复核**: unverified

### P2-15 [performance·M·conf:medium] 已实现的 VirtualizedTable 在生产组件中从未被使用，大数据表仅靠分页
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/common/VirtualizedTable.js(127行,带 virtualizationThreshold) 仅在自己的测试 src/components/common/__tests__/VirtualizedTable.test.js 出现；grep 整个 src 无任何生产组件 import 它。DataQuery.js:251-252 用 `PAGE_SIZE` 分页 slice，ProductCenter 用 grid+useProductFilter。
- **问题**: 团队造了虚拟列表轮子并写了测试，却没接到任何真实大表上(696 型号的数据查询/产品库)。当前靠分页规避了一次性渲染，所以不是 P0 性能 bug；但导出/对比/某些一次性长列表场景仍可能渲染上百行 DOM，且这块已完成的能力被闲置是浪费。
- **提升**: 把 DataQuery 的结果表或 ProductCenter 的网格在 items>100 时切到 VirtualizedTable(它已内置 threshold 自动降级)，或在『全选/导出预览』这类必须展开全量的场景启用，既复用已有代码又防极端数据卡顿。先确认实际单页最大行数是否真的够大值得虚拟化，避免过度工程。
- **风险**: 低。组件已测试，接入点可灰度。
- **复核**: confirmed — Grep VirtualizedTable 在 src 下仅命中 common/VirtualizedTable.js 自身 + common/__tests__/VirtualizedTable.test.js，无任何生产组件 import，属实。DataQuery.js:250-254 用 PAGE_SIZE 分页 slice 规避一次性渲染。提升是复用已有代码(items>100 切虚拟列表

### P2-16 [info-completeness·M·conf:medium] 桌面/移动两套并行选型实现，移动端 SelectionTab 缺少桌面已有的联轴器/备用泵配套展示
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: 桌面走 EnhancedGearboxSelectionResult.js:187-190(recommendCopilotCoupling/Pump 自动配套)+SwipeableResultCards.js:27-28(couplingResult/pumpResult)。移动端 MobileApp.js:275 `function SelectionTab` 独立用 selectionAlgorithm(MobileApp.js:354-359 selectGearbox/autoSelectGearbox)，结果映射 MobileApp.js:362-364 只 correctPriceData，未见调用 getRecommendedCoupling/Pump，结果卡片不展示推荐联轴器/备用泵。
- **问题**: 两套选型 UI 各自演进，移动端选型结果信息比桌面少一截(高弹联轴器、备用泵这些一线报价必看的配套)，且双实现长期会漂移(口径/字段不一致)。一线在手机上选完型号拿不到完整配套，还得切桌面。
- **提升**: 在 MobileApp SelectionTab 的结果卡片里复用 src/data/gearboxMatchingMaps 的 getRecommendedPump/getRecommendedCouplingInfo(SmartSearchView.js:5 已在用同一套 API)，补『推荐联轴器/备用泵』两行；中期考虑把选型结果渲染抽成共享展示组件供桌面 SwipeableResultCards 与移动 SelectionTab 共用，消除双实现漂移。
- **风险**: 低-中。加展示字段安全；抽共享组件工作量较大需回归两端。
- **复核**: unverified

### P2-17 [info-completeness·M·conf:medium] 缺价型号在产品中心/价格维护无统一可视的『缺价清单与补录入口』
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: CLAUDE.md 记录404型号(69.1%)缺价,priceFormatter 有 getPriceBadge() 兜底显示『询价』。但 ProductCenter.js 与 PriceMaintenanceTool.js 都没有一个『哪些型号缺价/已补几个/还差几个』的进度看板;PriceMaintenanceTool 的价格表(PriceTable)是按系列分页编辑,管理员无法一眼看到全局缺价覆盖率,也无『仅看缺价型号』筛选。
- **问题**: 管理层无法量化和跟踪补价进度,销售在产品中心遇到大量『询价』徽章也不知道是否在补;缺价治理缺少抓手。
- **提升**: 在 PriceMaintenanceTool 顶部加一个价格覆盖率KPI条(总数/已定价/缺价/覆盖率%,复用 scripts/audit-price-coverage.js 口径)+ 价格表加『仅显示缺价』筛选 + 缺价型号导出清单,形成补录工作流闭环。
- **风险**: 纯只读统计+筛选,无风险。
- **复核**: unverified

### P2-18 [ux·M·conf:high] 库存模块自有/代管(代管方信息)采集了但未持久化,出入库单据不可作废/冲红
- **域**: 管理与价格运营 (库存/应收/角色权限/审计日志/备份/价格维护工具/智能定价)
- **证据**: InventoryManagement.js:615-647 在出入库Modal里为 consigned 项采集了委托方名称/联系人/电话/合同编号4个字段,但 handleStockOperation(line 150-201)创建单据 createStockDocument 时完全没把这些 consignor* 值写入(inventory.js createStockDocument 也无 consignor 字段),录入的代管方信息直接丢弃。另外 stockDocuments 只能追加(line 194),没有任何作废/冲红/反向调整入口,误操作的出入库单无法纠正。
- **问题**: 代管库存的委托方信息(对账、归还的关键)填了等于白填;出入库一旦录错只能再做一笔反向单且无关联,审计上不规范(正规ERP出入库单需支持红冲)。
- **提升**: ①createStockDocument 增加 consignor 字段并在 handleStockOperation 落库;②为单据增加『红冲』操作:生成一笔反向 quantity 的关联单(remark引用原单号 documentNo),原单标记 voided。
- **风险**: 低,增量字段+冲红逻辑;冲红需 confirm 防误点。
- **复核**: unverified

### P2-19 [accuracy·M·conf:medium] 简化两质量模型在'有减速比但未选联轴器'时静默忽略 i² 折算，固有频率算错
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: torsionalVibration.js:314 `if(gearRatio>1 && couplingStiffness>0)` 才做 i² 能量折算；:329-334 else 分支 `equivalentStiffness=shaftEquivStiffness`、`J1=motorJ` 原样，完全不含 i²。UI(TorsionalAnalysis.js:633-645)允许用户单独填减速比 i 且不选联轴器（couplingStiffness 此时 undefined）。
- **问题**: 简化模式下用户填了减速比 i（界面还贴心显示 i²），但只要没选联轴器型号，引擎就跳过整个齿轮箱折算，把高速侧惯量/刚度直接当低速侧用——固有频率与临界转速结果与 i 无关，与界面展示的 i² 暗示矛盾。用户会以为减速比已被计入，实际没有，结论失真且无任何提示。
- **提升**: 把 :314 条件拆开：只要 `gearRatio>1` 就对 motorJ、shaftEquivStiffness 做 i² 折算（couplingStiffness 缺失时仅折算轴刚度，不串联联轴器），联轴器项作为可选叠加。或在 UI 侧：当 i>1 且未选联轴器时给黄条提示'未提供联轴器刚度，减速比折算已按纯轴刚度近似'。
- **风险**: 改折算分支会影响所有'有i无联轴器'算例的频率值，需回归现有 torsionalVibration.test.js / torsionalAdvanced.test.js；建议保留旧分支并新增独立路径，避免破坏已校准用例。
- **复核**: unverified

### P2-20 [accuracy·M·conf:medium] 传递矩阵固有频率求解用固定0.1Hz步长扫描0.1-1000Hz，会漏密集模态且默认上限与模板不一致
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: transferMatrixMethod.js:228 `freqStep=0.1` 固定步长，:233 从 freqMin 扫到 freqMax；runAdvancedTorsionalAnalysis 默认 :641 `freqMax=1000`（10000次全矩阵乘），而 createDefaultAdvancedInput 模板 :878 给 freqMax=500。:238 仅靠相邻点残差变号检测零点。
- **问题**: ①固定 0.1Hz 步长：两阶固有频率间距 < 0.1Hz 时只检出一个（漏阶），残差在一步内出现偶数次变号也会被错过，对刚性大、模态密的多分支系统有真实漏检风险；②默认 freqMax=1000 与模板 500 不一致，组件未显式传 analysisSettings 时会跑 2 倍迭代量（性能）且可能纳入物理上无意义的超高频伪解。
- **提升**: ①改自适应：先用粗步长定位变号区间，再二分（已有 bisection），或步长随频率取对数密化；②对每个区间检测重根（残差极小但未变号时补查导数）；③统一默认 freqMax 与模板（建议 500 或按系统最高激励频率上限动态设定 = maxOrder×maxSpeed/60×安全系数）。
- **风险**: 改求解器需用已知解析解算例（两/三质量闭式）回归确保不丢/不增伪根；纯性能项（统一 freqMax）可单独低风险先做。
- **复核**: unverified

### P2-21 [accuracy·M·conf:low] 回旋振动 Dunkerley 模型对端部螺旋桨用中跨简支刚度 48EI/L³，几何不自洽
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: whirlingVibration.js:67 `K_bending=48EI/L³`（简支梁中点集中力挠度刚度），:77 `omega_prop=√(K_bending/M_prop)` 把端部桨质量套在中跨刚度上做单自由度；注释(:8-12)自称'简支两点支承中点挠度'，但螺旋桨实际是悬伸在艉轴承外的端部质量。
- **问题**: 螺旋桨悬臂/外伸在最后轴承之外，其等效横向刚度应为悬臂或外伸梁刚度（量级 3EI/a³ 且 a 为外伸长度），而非中跨简支 48EI/L³。两者数值差可达数倍，导致回旋临界转速估算偏差较大。虽已标'工程估算用'，但 ShaftVibrationPanel 把临界转速精确到 rpm 展示并判禁区，量纲性偏差会误导。
- **提升**: 区分两个频率来源：梁自身用简支基阶（已有 :71 ω_beam 正确），端部桨质量用外伸/悬臂刚度（需用户补充桨到最后轴承的外伸距 a，缺省时退化并明确标注'桨按中跨近似，外伸效应未计'）。FormulaProvenance 已在 :208-214 列出公式，同步更新 notes 说明刚度模型假设。
- **风险**: 需新增外伸距输入，属模型增强；当前已诚实免责，优先级低于前述准确性 bug。
- **复核**: unverified

### P2-22 [info-completeness·M·conf:medium] IACS 瞬态许用应力 T2=1.7×T1 为固定系数，未实现 M68 速度相关的 λ 限值曲线
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: forcedVibrationAnalysis.js:265-266/1530 `TRANSIENT_FACTOR=1.7` 固定；standardsDB 各社 `transientFactor:1.7`。IACS UR M68 的瞬态(限速带穿越)许用应力中间轴为 τ_t=τ_c·(6-5λ²)，λ=n/n0，仅在 λ<0.9 时按此放大、并非恒 1.7。
- **问题**: 限速带(barred speed range)穿越校核用恒定 1.7 倍会高估低转速段的瞬态许用、低估高转速段，barred-speed 区间识别(:1556)与对外'IACS UR M68 合规'声明的精度受影响。对需要 barred speed range 论证的项目（多数大型主推进）是信息完整性缺口。
- **提升**: 实现 τ_t = τ_c·(6-5λ²)（中间轴，λ=运行转速/MCR转速），桨轴用对应 M68 式；calculateT1T2 增加 speedRatio 入参，identifyBarredSpeedRanges 按各速度点 λ 取动态限值。无 n0(MCR) 时退化为 1.7 并标注。
- **风险**: 需 MCR 转速输入与算例回归；属专业度提升，非功能性破坏。
- **复核**: unverified

### P2-23 [info-completeness·M·conf:medium] 船级社合规校核的振动/噪声限值与叶片厚度系数无规范出处, 叶片强度用'简化公式'未标注
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: classificationCompliance.js 的 classificationRules 给 9 社各自的 vibrationLimits(如 CCS axial:4.5/lateral:7.1/torsional:11.2, line 43-47)、noiseLimits(line 49-53)、thicknessCoefficients(line 25-33)逐社略有差异的精确数值, 但全无来源注释(grep 来源/source/依据=0); 各社差异(如 CCS torsional 11.2 vs DNV 10.0)看似精心区分实则无法追溯。叶片强度 checkBladeStrength 自己在 line 388 注明 `// 简化的厚度计算公式 (各船级社略有差异)`, 但该'简化'提示只在代码里, 校核结果对象(line 411-426)返回 pass/compliant 时不向用户透传'此为简化估算'。
- **问题**: 合规校核引擎输出'CCS 振动校核通过/叶片强度校核通过'这类强结论, 但底层限值无出处、强度公式是简化近似, 用户(销售/工程)会当成可对外的正式合规判定。校核工具的可信度建立在'限值可追溯+算法已声明精度', 二者都缺则结论的工程效力存疑。注: 此为 CPP 螺旋桨视图(CPPSelectionView)所用, 非整机硬选型, 不违反 K_A 护栏。
- **提升**: ①给 classificationRules 各社的 vibrationLimits/noiseLimits/thicknessCoefficients 补 `_source` 注释字段指向具体规范章节(查不到的标'内部估算值, 待核'); ②checkBladeStrength 返回对象加 `method:'simplified', disclaimer:'简化厚度估算, 正式强度核算以船级社认可计算书为准'`, 并在 ClassificationCompliancePanel UI 显示该免责(与 IMOCompliancePanel.js:282 已有的'计算结果仅供工程参考, 正式合规需船级社核发证书'风格一致)。
- **风险**: 限值出处需查规范, 查不到不可编造来源, 留'待核'; 加 disclaimer 字段不改算法零回归。
- **复核**: unverified

### P2-24 [professionalism·S·conf:high] CUMMINS案例库'实际订单数据'徽章 与 '约200台估算' 口径冲突, 削弱可信度
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: CumminsMatchingView.jsx:189-192 头部挂绿色徽章 '<i>实际订单数据</i>'; 但 cumminsMatchingData.js:378-380 statistics.totalUnits=200 且 totalUnitsExact:false 注释 '行业累计估算(2024财年内部统计口径)', UI:167/204 据此显示 '约200'。orderRecords(:294-325)仅约30条真实明细行(累计qty远不到200)。matchingSummary 各档 totalUnits 用 '50+/80+/30+/10+' 估值字符串(:138等)。
- **问题**: 同一页面一边盖'实际订单数据'权威章, 一边核心KPI是'约200'估算且明细只有30条, 客户/审计稍一核对就发现对不上, 反而显得数据注水。专业选型工具(ZF案例库)通常明细可逐条追溯。
- **提升**: 二选一: (a)把KPI改成可核验的真实口径——明细行 qty 求和作'已录订单台数'(诚实显示真实条数), '约200'改标'行业累计(估)'并与'已录'分两个KPI; (b)或把'实际订单数据'徽章改为'实际订单+行业估算'。matchingSummary 的 '50+' 估值标注来源。属文案/口径诚实化, 不改 schema。
- **风险**: 低; 纯口径标注, 注意别把估算值当精确值对外。
- **复核**: unverified

### P2-25 [ux·S·conf:high] 快速选型矩阵功率分档有空隙, 边界外/档间空隙返回'未找到方案'
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: cumminsMatchingData.js:328-347 quickSelectionMatrix 各系列只列窄档(K50 仅 '1200-1350','1350-1650'; QSN '250-300','300-400'); CumminsMatchingView.jsx:120-127 解析 range.split('-')逐档比对 power>=min&&power<=max。输入 1180kW(低于K50最低1200)或 1700kW(高于1650)→ 落空返回 null → :794-798 显示'未找到匹配方案'。边界值如400 同时落两档(:330/331)但'first wins'仅取首档(轻微歧义)。
- **问题**: 档位是离散区间而非连续覆盖, 客户输入略超边界就吃闭门羹, 体验突兀; 而页面 cumminsEngines 明明覆盖更宽功率(如 K50 到1641kW)。给销售'这功率没方案'的错觉。
- **提升**: 把 quickSelectionMatrix 改为该系列功率全程连续覆盖(相邻档首尾相接, 最高/最低档开区间到系列上下限), 或当落空时降级调用主算法 autoSelectGearbox 给兜底推荐而非直接'未找到'。边界重叠用 [min, max) 半开区间消歧。属逻辑/数据值完善, 不改 schema。
- **风险**: 低; 扩档需保证推荐齿轮箱仍合理, 建议落空兜底走主算法而非硬编造新档。
- **复核**: unverified

### P2-26 [info-completeness·S·conf:high] 主机匹配结果不展示主机扭矩与所需传递能力的中间量, 工程透明度不足
- **域**: 主机(柴油机)与齿轮箱匹配 (Engine ↔ Gearbox Matching)
- **证据**: EngineMatchingExpanded.js:491-537 selectionResult 算了 targetRatio/propRpm/competitor 并展示, 但没回显'主机额定扭矩 T=9550·P/n'与'所需传递能力=P/n'这两个选型根本量; HCMSelectionModule.js:113-120 算了 requiredCapacity 并展示(:370-378 '计算所需传递能力'), 做得比 EngineMatchingExpanded 好, 说明同项目内透明度不一致。marineEngineDatabase 有 calcRatedTorque_Nm(:96)可直接用。
- **问题**: EngineMatchingExpanded 是面向多品牌的主力匹配页, 却把选型的物理依据(扭矩/所需传递能力)藏起来, 只给结论(型号+富裕量)。工程师无法自查推荐是否合理, 也无法向客户解释'为何选这台箱'。对标 ZF/Reintjes 工具都会列出 input torque / required rating。
- **提升**: 在 EngineMatchingExpanded 选型参数区(:716-721 目标减速比那块)旁补两个派生量: 主机额定扭矩(calcRatedTorque_Nm(power,speed) N·m)与 所需传递能力(power/speed kW·min/r), 与 HCMSelectionModule 口径对齐。纯展示, 复用既有公式, 不加 K_A(遵守选型硬校核口径)。
- **风险**: 无; 只读派生展示。
- **复核**: unverified

### P2-27 [accuracy·S·conf:high] TCO 默认 shipType='cargo' 在 shipTypeDefaults 中无此键 → 静默套用渔船(3000h)参数
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: tcoCalculator.js:101 `shipType=config.shipType||'cargo'`; 但 competitorDataEnhanced.js:784-867 的 shipTypeDefaults 键为 fishing/inlandCargo/coastalCargo/mediumCommercial/largeCommercial/specialVessel/yacht/military — 无 'cargo'。resolveShipDefaults(:73) `shipTypeDefaults[shipType]||shipTypeDefaults.fishing` → 任何传 'cargo' 或未传船型的调用都套渔船默认(annualHours 3000, maintenanceCostBase 5000 最低档)。当前 UI(TCOCalculator.js:15)默认 'fishing' 恰好有效掩盖了它, 但属潜伏陷阱。
- **问题**: 默认键与数据键不一致, 任何不显式传船型的 calculateTCO 调用(或未来新调用方)会拿到最便宜的渔船工况, 大型商船 TCO 被严重低估。是'看似有默认、其实落到错误兜底'的隐患。
- **提升**: 把 tcoCalculator.js:101 默认改为一个真实存在的键(如 'coastalCargo')或直接复用 hangchiBaseParams; 并在 resolveShipDefaults 兜底时 console.warn 记下未命中的 shipType, 便于发现误传。
- **风险**: 极低。
- **复核**: confirmed — 属实。tcoCalculator.js:101 `shipType=config.shipType||'cargo'`; competitorDataEnhanced.js:784-865 的 shipTypeDefaults 键确为 fishing/inlandCargo/coastalCargo/mediumCommercial/largeCommercial/specialVessel/ya

### P2-28 [info-completeness·S·conf:medium] EnergyOptimizationView 节能金额按 280美元/MWh 单价直算, 货币混用且缺口径标注
- **域**: 能效排放与TCO (EEXI/CII/EEDI + 碳排放 + FuelEU + 总拥有成本)
- **证据**: EnergyOptimizationView.js:50-51 `fuelCostPerMWh=280 // 约280美元/MWh; annualFuelCost=annualLossMWh*280`, 然后 :200 直接 `$${analysis.annualFuelCost}` 展示美元。同页其余系统用人民币/万元(TCOCalculator)。且 280 美元/MWh 的折算依据(SFC×燃油单价)未给, 也没说明是基于哪种燃油/油价。loadPenalty(:37)和效率惩罚也无来源标注。
- **问题**: 给一线销售看的'年损失成本'是个无来源、币种与其它模块不一致的拍脑袋数。船东会问'按什么油价、什么 SFC 算的', 答不上来就掉价。
- **提升**: 把 fuelCostPerMWh 拆成 显式的 SFC(g/kWh)×燃油单价(可选 MDO/HFO, 复用 emissionCalculator.FUEL_PRICES)推导, 并在卡片下方一行标注口径'按 MDO $750/t、SFC 195 估算'; 货币与全站统一(给出 ¥ 等值, 用现有 ~7.2 汇率常量)。效率惩罚曲线注明'经验估算'。
- **风险**: 低; 纯透明化与口径统一。
- **复核**: unverified

### P2-29 [info-completeness·S·conf:high] 机械效率字段 544/544 有真实值(0.95~0.97)却只喂雷达评分、从不作为规格行展示, 且有永不触发的 95 编造兜底
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: embeddedData 544 个齿轮箱全部含 efficiency (0.97/0.96/0.95 三档, 实测)。EnhancedGearboxSelectionResult.js:260 `efficiencyScore: gearbox.efficiency ? gearbox.efficiency * 100 : 95` 仅把它换算成雷达图分数, 详情表无『机械效率』行; 且因数据全覆盖, `: 95` 这个编造兜底永不触发(死代码但语义上是『缺效率就假装95%』, 违项目铁律精神)。
- **问题**: 机械效率影响功率传递核算和油耗估算, 数据现成却不显; 95 兜底虽不触发但是个潜在的『缺数据编值』隐患, 一旦将来引入无效率的型号会静默呈现假 95%。
- **提升**: ①详情表加『机械效率』行, 值 `selectedGearbox.efficiency != null ? (selectedGearbox.efficiency*100).toFixed(0)+'%' : '待补'`。②line 260 兜底从 95 改为不参与评分(efficiency 缺失时该维度按数据缺失处理, 显『待补』而非假值)。
- **复核**: unverified

### P2-30 [professionalism·S·conf:high] 选型失败诊断只为 5/8 类拒绝原因配了中文标签, 系列特性/接口/轴布置不匹配会向用户暴露英文代码
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: selectionDiagnostics.js:69-78 getReasonLabel 的 labels 表只含 speedRange/ratioOutOfRange/capacityTooLow/capacityTooHigh/thrustInsufficient 五项, 缺 interfaceMismatch/shaftMismatch/seriesCapabilityMismatch; line 77 兜底 `return labels[reasonCode] || reasonCode` 直接回传原始 code。而 selectionAlgorithm.ts:883-886 把 Copilot 9 条硬约束(CPP/FPP/双机/双速/高速/船级社)排除全部计入 seriesCapabilityMismatch 桶。SmartHintsPanel.js:32 直接渲染 analyzeRejections 的 label。
- **问题**: 当用户开了 CPP/FPP 推断或船级社硬约束导致大量型号被排除时(很常见), 智能提示面板会显示『seriesCapabilityMismatch: N个 (X%)』这种英文代码, 不专业且用户看不懂。NearMatchBanner.js:81 已有正确中文标签('系列特性不匹配'), 说明标签是存在的, 只是 selectionDiagnostics 没同步。
- **提升**: selectionDiagnostics.js getReasonLabel 的 labels 补 3 项: `interfaceMismatch:'接口不匹配', shaftMismatch:'轴布置不匹配', seriesCapabilityMismatch:'系列特性/桨型/船级社不匹配'`; 同时 getReasonSuggestion (line 84) 补对应 suggestion(切系列/取消桨型推断/放宽船级社)。
- **复核**: unverified

### P2-31 [info-completeness·S·conf:high] 近似匹配候选与直接型号(directModel)结果未计算 safetyFactor, SelectionBasisCard 的『安全系数 Sf』对这些结果显 '-'
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: selectionAlgorithm.ts 主匹配路径 line 1245 算 `safetyFactor = capacity / requiredTransferCapacity` 并写入 matchingGearbox(line 1274)。但近似匹配构造 (NearMatch, 如 line 1166-1173、1209-1219) 和直接型号 fast path (line 2003-2015 directRec) 都没设 safetyFactor。SelectionBasisCard.js:24 `const safetyFactor = selectedGearbox.safetyFactor` 直接读该字段, line 82 缺失即显 '-'。
- **问题**: 用户点开一个近似匹配候选或用『直接查型号』功能时, 校核卡的安全系数 Sf 空白, 而 Sf 恰恰是这两种场景最该看的(近似匹配往往余量紧张)。校核依据卡此时信息不完整。
- **提升**: 在近似匹配构造处和 directRec(line 2003)统一补 `safetyFactor: selectedCapacity>0 && required>0 ? selectedCapacity/required : undefined`(与主路径同公式), 缺容量时留 undefined 让卡片显 '-' 而非 0。一处工具函数复用即可。
- **复核**: unverified

### P2-32 [accuracy·S·conf:high] 选型表单下传 ratioTolerance/marginLimit 字段名与引擎读取的 tolerances.* 不一致, 是被忽略的死配置
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: EnhancedSelectionForm.js:156-157 构建 requirements 时写 `ratioTolerance: 0.1` 和 `marginLimit: 0.5`(还带注释『10%速比容差』『50%余量限制』)。但 selectionAlgorithm.ts:846-849 读的是 `options.tolerances.maxRatioDiffPercent` / `maxCapacityMargin`(嵌套对象), 完全不读 ratioTolerance/marginLimit。因 options 无 tolerances, 实际落到 DEFAULT_TOLERANCES(selectionConfig.js:186, maxRatioDiffPercent:10/maxCapacityMargin:50)。
- **问题**: 巧合下默认值(10%/50%)和注释意图一致, 所以当前行为没错; 但这是一对永不生效的死字段, 误导维护者以为表单在控制容差。一旦有人想从表单调容差(如特殊应用放宽到 20%)会发现改了没反应, 或错误地把 0.1(小数)塞进期望百分数的字段。
- **提升**: EnhancedSelectionForm.js:156-157 删除 ratioTolerance/marginLimit, 改为按 formData.application 走 `tolerances: calculateAdaptiveTolerances(formData.application, {power,speed,ratio})`(selectionConfig.js:309 已实现该函数)下传 `tolerances` 对象, 让『特殊应用/工作船』等场景真正放宽容差(special=20%/100%, propulsion=10%/50%)。
- **复核**: unverified

### P2-33 [info-completeness·S·conf:medium] 缺价型号(69% 无价)在评分里被赋『有价型号价格分中位数』, 但结果列表未向工程师标注该分数是估算占位
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: selectionAlgorithm.ts:1664-1685 对缺价型号 priceScore 用『有价型号 priceScore 的中位数』(line 1684 `priceScore = medianPriceScore`)并置 `_priceDataMissing=true`(line 1624)。最终 score 含这部分但 UI 综合评分(EnhancedGearboxSelectionResult.js:452 表头『评分』列、line 475 行)不区分该分是真实性价比还是缺价中性占位。CLAUDE.md 载明 404/696 型号缺价。
- **问题**: 性价比维度(W_COST 默认 18~30 分占比不小)对 69% 缺价型号是『中位数占位』, 一个缺价型号可能因占位分排到有真实低价型号前面, 而综合评分列没有任何提示, 工程师以为是真实性价比。这影响排序可信度的透明性。
- **提升**: 在结果表/卡片对 `_priceDataMissing` 或 isPriceMissing(model)=true 的型号, 在评分旁加一个小角标/tooltip『性价比分按缺价中性估算, 以询价为准』(复用已有 getPriceBadge『询价』徽章的同一信号); ScoreBreakdownCard 里把性价比维度标注为估算。零引擎改, 仅 UI 诚实标注。
- **复核**: unverified

### P2-34 [info-completeness·S·conf:high] 速比插值估算的传递能力在主详情表未标注『插值』, 仅 SelectionBasisCard 有徽章, 工程师看主表会误以为是手册档位精确值
- **域**: 核心选型引擎 (selectionAlgorithm.ts + selectionConfig.js + EnhancedGearboxSelectionResult + SelectionBasisCard + 诊断/容差/评分)
- **证据**: selectionAlgorithm.ts:1060-1098 当目标速比落在离散档位之间时用单调三次/线性插值算 capacity。SelectionBasisCard.js:33-48 正确给了『插值估算』徽章+tooltip。但 EnhancedGearboxSelectionResult.js:643-651 主详情表『传递能力』行只显 `selectedGearbox.selectedCapacity.toFixed(6)`, 无插值标注; line 688『减速比』行也不提示该速比是插值点。
- **问题**: 校核卡有标注但主详情表(工程师/客户最常看的表)没有, 同一数字两处呈现不一致。插值容量是估算值, 在最显眼的表里当作精确手册值呈现, 专业性上有瑕疵(对标 ZF 工具会区分 nominal vs interpolated rating)。
- **提升**: EnhancedGearboxSelectionResult.js 详情表『传递能力』行(line 644-651)在 `Math.abs(selectedRatio - targetRatio) > 0.01` 时追加一个小 Badge『插值』+tooltip(复用 SelectionBasisCard 的判定逻辑), 保持两处口径一致。
- **复核**: unverified

### P2-35 [accuracy·S·conf:high] 死代码 loadAndPrepareData 引入未定义的 validateCriticalData, 是再次激活即崩的地雷
- **域**: 数据质量与一致性 (gearbox-app, 544 型号活跃数据 / 501 主数据)
- **证据**: src/utils/dataLoader.js:7 `import { validateCriticalData } from './dataValidator'` 但 dataValidator.js 的导出只有 validateGearbox/validateCoupling/validatePump/validateDatabase/correctSelectionResult(grep 全 src 仅这两处出现 validateCriticalData, 无定义)。dataLoader.js:110 调用 validateCriticalData(finalData) 会抛 TypeError。已确认活跃加载路径是 index.js:39 → repair.js loadAndRepairData(用 validateDatabase, 正确), loadAndPrepareData 全 src 无任何调用方(仅 applyMarketEnrichment 被别处 import), 故当前不影响线上。
- **问题**: 不是当前线上 bug(该 loader 已死), 但它是一颗地雷: 任何人若把数据加载切回 loadAndPrepareData(看似完整的备用实现), 会立即在 line 110 崩进 catch 返回未经价格修正/市场富化的裸数据, 且因 catch 静默吞掉真实原因难以排查。属于影响维护准确性的隐患。
- **提升**: 二选一: ①若 loadAndPrepareData 确定废弃, 删除该函数及其 validateCriticalData import(连同 dataLoader.js 中仅供它用的 import), 只保留 applyMarketEnrichment。②若想保留为备用, 把 validateCriticalData 改为已存在的 validateDatabase 或在 dataValidator.js 补一个真实导出。无论哪种都消除地雷。
- **风险**: 低 — 删/改死代码; 删前用 grep 再确认无动态引用(已确认无静态调用)。
- **复核**: partial — 事实核实属实: dataValidator.js 导出实测仅 validateGearbox/validateCoupling/validatePump/validateDatabase/correctSelectionResult(无 validateCriticalData), 而 dataLoader.js:7 import { validateCriticalData } 且 :110 调

### P2-36 [accuracy·S·conf:medium] EEDI/EEXI 估算用写死的载重量与参考线, 易给出误导性合规结论
- **域**: 推进系统 (CPP / 舵桨 / 侧推 / 轴系)
- **证据**: CPPSelectionView.js:152-160 eediResult 调 estimateEEDI 时 capacity:5000 硬编码(注释自己写 '默认载重量,实际应由用户输入'); cppHydrodynamics.js:868 referenceEEDI=50 '典型工作船参考值' 也是单一常数 + 固定削减 30%。estimateEEDI 内部用 installedPower 但组件传的是 power(主机功率 key 名也与函数 param installedPower 不一致, 行156 传 power: parseFloat(power) 而函数解构 installedPower → installedPower=undefined → eedi=NaN)。
- **问题**: EEDI 结果对载重量极敏感(分母 capacity×speed), 写死 5000t 对不同船基本无意义; 且 power/installedPower 参数名不匹配会让 eedi 直接 NaN; 参考线用单一 50 不分船型/吨位, 给出的'满足/超出 IMO Phase3'结论不可信, 反而有合规误导风险。
- **提升**: 把 capacity 接成用户输入(组件已有 deadweight state, 行46), 并修正 estimateEEDI 调用 key 为 installedPower; 参考线 referenceEEDI 至少按船型分档或标注'仅示意, 实际参考线按 MEPC.231(65) 公式 a·b^-c 计算'。或若数据不足, 直接在 UI 标注 EEDI 为'粗估, 不作合规依据'。
- **风险**: 参数名修正必要(否则 NaN); 参考线公式化需补 IMO 系数表, 数据不足时诚实降级标注即可。
- **复核**: unverified

### P2-37 [accuracy·S·conf:high] 联轴器允许负扭矩余量(-1%)候选进入推荐, 与船用最小裕度政策自相矛盾
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: enhancedCouplingSelection.js:163-167 const minTorqueThreshold = requiredCouplingTorque_kNm * 0.99; if (fixedTorque_kNm < minTorqueThreshold) return; 即额定扭矩只要 ≥ 所需的99%就保留 → 允许 -1% 负余量。评分表 215-217 行甚至给 torqueMargin∈[-1,0) 打 60% 分。而 couplingSelection.ts:484 同算法另一路径写明 MIN_TORQUE_MARGIN=10 '从5%提升到10%, 提高安全裕度', getTorqueMarginStatus(CouplingRecommendationList.js:18-19) 也把 <0 标红'负余量'。两条选型路径裕度门槛(enhanced允许-1% vs ts要求10%)不一致。
- **问题**: 高弹联轴器额定扭矩本身是按弹性体疲劳寿命标定的, 额定扭矩 = 所需扭矩意味着零安全裕度; 允许 -1% 等于让额定扭矩低于实际所需就推荐, 对船用推进是不可接受的(振动/超温/弹性体早期失效)。虽然有红色'负余量'徽章提示, 但它仍排进推荐列表且能被默认选中(setSelectedCoupling(recommendations[0])), 一线可能直接采用。两路径门槛不统一也会让集成选型与独立选型给出不同结论。
- **提升**: 把 enhancedCouplingSelection 的 minTorqueThreshold 从 *0.99 提到至少 *1.0(不允许负余量进推荐), 与 couplingSelection.ts 的 10% 政策方向对齐; 若要保留'极限可用'选项, 应把负/超低余量候选移到单独的'警示候选'分组而非混入主推荐, 并禁止其成为默认 selectedCoupling。同时把两条路径的 MIN_TORQUE_MARGIN 抽成共享常量避免再次漂移。
- **风险**: 提高门槛后某些边界算例可能从'有推荐'变成'无合适型号', 需确认数据库扭矩档位够密(flexibleCouplings 已较密集), 并给空结果时引导提示。
- **复核**: partial — 核心不一致属实, 但发现对 ts 路径门槛的描述不准。enhancedCouplingSelection.js:163-167 minTorqueThreshold=requiredCouplingTorque_kNm*0.99, fixedTorque_kNm<threshold 才 return → 允许额定扭矩低至所需的99%(-1%负余量); :215-217 评分给 torqueMarg

### P2-38 [ux·S·conf:high] 联轴器对比表引用了候选对象上不存在的字段, 多列恒显'—'
- **域**: 联轴器与泵 (Coupling & Pump Selection)
- **证据**: CouplingRecommendationList.js:295-306 compareColumns 配了 key:'ratedTorque'(额定扭矩)、key:'classificationApproved'(船检证书)。但候选对象(enhancedCouplingSelection.js:294 {...coupling, torque,...})用的字段是 torque 不是 ratedTorque(flexibleCouplings.js 里也是 torque), 且 flexibleCouplings 完全没有 classificationApproved/classificationType 字段(grep 0 命中)。GenericComparisonTable 按 key 取值, ratedTorque/classificationApproved 取到 undefined → 这两列(额定扭矩、船检证书)在联轴器对比弹窗里恒为空/—。
- **问题**: 联轴器多选对比是卖点功能, 但其中'额定扭矩'(对比的核心参数!)因 key 名错配而空白, '船检证书'列也永远空 — 对比表的信息价值大打折扣, 一线对比两个型号看不到最关键的额定扭矩。
- **提升**: 把 compareColumns 里 'ratedTorque' 改为 'torque'(并 format 成 kN·m 保留2位); 'classificationApproved' 这列若数据确实没有, 应移除或改用 getCouplingSeriesInfo 派生的适用信息, 不要保留一列恒空。同理可加入 maxSpeed/torqueMargin 已对, 但 maxTorque 字段存在(flexibleCouplings 有 maxTorque)可保留。
- **风险**: 极低, 纯 UI 字段名修正。
- **复核**: unverified

### P2-39 [info-completeness·S·conf:high] 竞品 efficiency(机械效率)数值字段全程不展示, 只显厂商级定性'效率等级' — 关键工程指标被埋没且数据扁平
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: 每条竞品都有数值 efficiency 字段(competitorData.js, 分布: 0.94×1 / 0.95×18 / 0.96×96 / 0.97×127 / 0.98×1), 但 ComparisonTable.js 技术特性区(line 371-391)只渲染来自模板的 efficiencyClass(卓越/优良/标准), 数值 efficiency 从未出现在任一对比组件。comparisonDimensions.technical(competitorData.js:5692)虽定义了 efficiency 维度但表格没用。
- **问题**: 传动效率是船东最关心的 TCO/油耗驱动指标, 国际标杆选型工具(ZF/Reintjes)都标 %效率。当前既不显数值, 现有数值又几乎全是 0.96-0.97 占位(无区分度), 既是信息缺失也是数据质量问题。
- **提升**: ①在 ComparisonTable 技术参数区加'机械效率'行, 显示数值百分比(如 97.0%), 杭齿与竞品同口径并排; 无可靠数据的标'待核实'而非编造。②把占位的 efficiency 值按各型号实际手册/公开资料校正(单级 vs 两级减速效率本应不同, 现在两级 GCD 仍 0.96 与单级几乎无差), 缺数据就如实留空。
- **风险**: 低: 加一行展示是安全的; 校正数值需有据, 无据则保持空标'待核实'(遵守不臆造铁律)。
- **复核**: unverified

### P2-40 [accuracy·S·conf:high] DataFreshnessIndicator 两处小 bug: nextPlannedReview 渲染 undefined + 'estimated' 价格被误判为'待更新'
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: DataFreshnessIndicator.js:108 `下次审核: {DATA_VERSION.nextPlannedReview}` — 但 DATA_VERSION(competitorDataEnhanced.js:14-19) 只有 version/lastFullUpdate/schema/notes, 无 nextPlannedReview → 页面显示'下次审核: undefined'。line 53 tooltip `freshness.confidence === 'estimate' ? '估算值' : '待更新'`, 而数据里写的是 'estimated'(实测 59 条 priceConfidence:'estimated'), 全部落到 else 显'待更新'而非'估算值'。同理 competitorAnalysis.js:596 getDataFreshnessReport 用 priceConfidence === 'confirmed' 判 green 是对的, 但 'estimate' 拼写不一致是隐患。
- **问题**: 对外可见的数据健康横幅出现 'undefined' 文案降低专业观感; 59 个估算价产品的可信度标签全部错显'待更新', 掩盖了它们其实是'估算值'的真实属性。
- **提升**: ①line 108 改为容错: `{DATA_VERSION.nextPlannedReview || '—'}` 或在 DATA_VERSION 补 nextPlannedReview 字段。②line 53 改成判 'estimated'(或同时兼容 'estimate'|'estimated')。统一全局 priceConfidence 枚举为 'estimated'。
- **风险**: 极低: 纯文案/枚举对齐修复。
- **复核**: unverified

### P2-41 [data-gap·S·conf:medium] DCSG/部分国产竞品厂商信息含自标'信息难独立验证/待考证', 且 marketSegments 份额为推算值 — 需在对比报告里更显眼地标注口径
- **域**: 竞品分析 (Competitor Analysis) — gearbox-app React SPA
- **证据**: competitorData.js:229 DCSG technology 字段内嵌'(注: 该独立实体信息难以独立验证, 创立日期1958待考证)'; competitorDataEnhanced.js marketSegments.*.shares(如 fishing line 342-349 HANGCHI:45/FADA:20...) 与 positioningMapData(line 871-888)均为估算坐标。AdvantageReport.js:704-707 末尾虽有一行灰色'数据可信度声明', 但 MarketSegmentView/份额图等处份额数字直接当事实展示。
- **问题**: 市场份额/定位坐标是行业推算, 若在对外报告里以确定数字呈现, 存在被客户质疑或误导风险; 个别厂商主数据自身就标注存疑, 与精确的技术对比混排会拉低整体数据可信印象。
- **提升**: ①在 MarketSegmentView 份额图与 positioning 图统一加'行业推算, 仅供参考'角标(复用 industryTrends.sources 已有的来源标注)。②对自标'待考证'的厂商(DCSG 等)在 ComparisonTable 厂商信息行加一个小 info 图标提示数据置信度。③把 AdvantageReport 末尾的可信度声明提到报告显著位置而非脚注。
- **风险**: 低: 加标注不改数据。
- **复核**: unverified

### P2-42 [data-gap·S·conf:medium] 合同/报价供方银行账号疑似占位值,且报价PDF联系信息无传真/邮箱等正式抬头要素
- **域**: 商务文档与报价 (报价单/销售合同/技术协议 生成·导出·编号·价格·双语)
- **证据**: src/utils/contractGenerator.js:91 sellerInfo.accountNumber:'1202025709900000000'(19位,且 ...990000000 大量重复0,形态可疑像占位);quotationGenerator.js:33 DEFAULT_SELLER_INFO.account:'452759227880'(两文件供方账号/开户行/抬头都不一致: 合同抬头杭州前进集团+工行,报价抬头上海前进经营+中行)。报价 sellerInfo 无邮箱/传真/统一社会信用代码。
- **问题**: 正式报价单/合同上的收款账号若是占位或两份文件不一致,客户付款会打错款或质疑真实性。缺统一社会信用代码/开票信息也不利于客户走采购流程。(卖方抬头统一本轮不动,但'账号真伪'是独立的数据正确性问题。)
- **提升**: 请财务核对并集中维护一份权威供方收款信息(抬头/开户行/账号/信用代码/开票邮箱),contractGenerator 与 quotationGenerator 共用同一常量;若账号确为占位则补真值或在UI标注'账号以财务盖章件为准'防误用。
- **风险**: 需财务确认真实账号,代码侧只做去重共享。
- **复核**: unverified

### P2-43 [ux·S·conf:high] 智能搜索结果区无 aria-live / role，结果数量与刷新对屏幕阅读器完全静默
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/SmartSearchView.js 全文 grep `aria-live|role="status"|role="region"|aria-label` 0 匹配。搜索输入 SmartSearchView.js:299 `<Form.Control ... value={query} onChange>` 无 role；结果随 query 实时变化(SmartSearchView.js:204 `useMemo(()=>searchModels(...),[query])`)但无任何 live region 宣告"找到 N 条"。
- **问题**: 对标 ZF/Reintjes 选型工具的可访问性基线，搜索是核心入口。读屏用户敲入关键词后听不到"找到 12 条结果"或"无结果"，也不知道结果已更新。同时结果列表无键盘上下键导航(只能鼠标点)。
- **提升**: 在结果容器外层加 `<div role="region" aria-label="搜索结果">`，并加一个 `<div aria-live="polite" className="visually-hidden">{results.length>0?`找到 ${results.length} 个型号`:'无匹配结果'}</div>`；为结果行加 tabIndex + onKeyDown(ArrowUp/Down 移动 selectedResult, Enter 选中)。骨架屏组件 SkeletonTable.js 已是 role=status 的好范例可参照。
- **风险**: 低。纯增量 a11y 标记。
- **复核**: unverified

### P2-44 [info-completeness·S·conf:high] 移动端优化页功能状态表与实际实现不符(SW 已注册却标 PWA"规划中"、离线"部分")
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: src/components/MobileOptimization.js:18-21 `{ feature:'离线访问', status:'partial' }` 和 `{ feature:'PWA安装', status:'planned' }`。但 src/index.js:11,178 `import * as serviceWorkerRegistration ... serviceWorkerRegistration.register({...})` 确实注册了 workbox SW(src/service-worker.js 用 precacheAndRoute/CacheFirst/NetworkFirst)，public/manifest.json 含 display:standalone + 192/512 图标 + start_url，PWA 安装实际已可用。
- **问题**: 面向用户/老板的『移动端适配进度』看板把已经上线的能力标成'规划中/部分完成'，低估了系统实际成熟度，也误导用户不知道可以"添加到主屏幕"离线用。属信息准确性问题(本项目有'二手描述需实地核查'的历史教训)。
- **提升**: 把 MobileOptimization.js:18-21 的 '离线访问' 改 status:'done'(SW NetworkFirst/CacheFirst 已生效)、'PWA安装' 改 'done' 并补一句『iOS Safari 分享→添加到主屏幕 / Android 安装横幅』引导。若想严谨，先实跑一次 Lighthouse PWA 审计确认 installable 再改标。
- **风险**: 低。纯文案/状态值。
- **复核**: unverified

### P2-45 [ux·S·conf:high] 强大的 Cmd+K 命令面板缺少可见入口提示，60+模块的快速跳转能力多数用户发现不了
- **域**: UX / 移动端 / 加载性能 / 可访问性 (gearbox-app React SPA)
- **证据**: App.js:569-578 绑定 `(e.metaKey||e.ctrlKey) && key==='k'` 打开 CommandPalette；CommandPalette.js:33-50 索引全部 NAV_GROUPS 模块+globalSearch 资料+项目。但顶栏 ModernNavBar.jsx:7-11 只有 首页/智能搜索/关于三项，无 Cmd+K 提示按钮；grep 显示仅 CommandPalette/ShortcutHelpModal 等内部文件提到快捷键，主界面无可见入口。
- **问题**: 这是解决"60+模块如何导航"的最佳武器(跨模块+资料+项目统一搜索跳转)，但纯靠隐藏快捷键，触屏/移动用户和不知道 Cmd+K 的销售根本触发不到，等于白建。对标 Linear/Notion 都会在顶栏放一个可见的搜索框/按钮提示⌘K。
- **提升**: 在 ModernNavBar 顶栏加一个可见的『🔍 搜索/跳转 ⌘K』按钮(点击 setPaletteOpen(true))，移动端也露出该入口；并在按钮上标注快捷键徽标。零新逻辑，只把已有 paletteOpen 状态接到一个可见按钮。
- **风险**: 低。
- **复核**: unverified

### P2-46 [ux·S·conf:high] 应力限值合规检查在简化模式下恒为'无强迫振动数据'告警，仅高级模式可达
- **域**: 工程计算与扭振 (Torsional / Critical-Speed / Whirling)
- **证据**: torsionalComplianceChecker.js:45 `if(analysisResult?.verification||analysisResult?.combinedResults)` 才做应力校核；:126 无 verification 时返回 status:'warning' '无强迫振动数据'。简化模式 runTorsionalAnalysis(torsionalVibration.js:378-391) 的返回对象不含 verification/combinedResults，故简化模式合规报告永远缺应力项。
- **问题**: 简化模式用户跑'合规校验'看到'应力限值校核：无强迫振动数据'的灰条，既不通过也不失败，体验上像功能坏了；而该模式本就只算频率/避开，应力校核需要强迫响应（仅高级模式有）。当前未向用户解释'应力校核请切高级模式'，造成困惑。
- **提升**: 在简化模式合规摘要里：要么隐藏应力项，要么把该项文案改为'应力限值校核需切换至高级模式（含强迫振动）'并给跳转按钮；或在 checkCompliance 入参标记 mode，简化模式不推该 check 而非推一个永久 warning。
- **风险**: 纯 UX 文案/条件渲染，无算法风险。
- **复核**: unverified

### P2-47 [professionalism·S·conf:high] STANDARDS_DATA 在组件与数据文件中重复维护(各54条), 长期易漂移
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: 标准数据存在两份硬编码副本: StandardsLibrary.js:7-74 内联 STANDARDS_DATA(54个id), 与 src/data/standardsData.js(54个id, 被 services/globalSearchService.js 引用)。当前 comm 比对两份 id 完全一致(0 差异), 但 standardsData.js 顶部注释仍写'51 条'(实际54), 说明已发生过一次不同步。两份各自独立维护, 下次任何人只改一处就会让'标准库页面'与'全局搜索'返回不同结果。
- **问题**: 同一权威数据两处硬编码是典型的单一数据源缺失。已有'51 vs 54'的注释漂移迹象; 一旦正式漂移, 全局搜索与标准库页结果不一致会让用户困惑、削弱专业可信度。
- **提升**: 让 StandardsLibrary.js 从 src/data/standardsData.js `import { STANDARDS_DATA }` 而非内联自有副本(StandardsLibrary 删 line 7-74 内联定义, 改为导入), 全站单一数据源; 顺手修 standardsData.js 头注释 '51 条'→'54 条'。前述 FuelEU/EU ETS 补条目后只需改一处。
- **风险**: 需确认两份字段结构完全一致(已核 id 一致)再合并, 改后回归标准库页与全局搜索各跑一次。
- **复核**: unverified

### P2-48 [accuracy·S·conf:medium] CII 2027-2030 评级边界为'每年约2%'外推估算, 未向用户标注'IMO 尚未正式确定'
- **域**: 知识库标准与合规 (Standards / Classification / Certification Knowledge Base)
- **证据**: energyEfficiencyCompliance.js:148 注释 `// 2027-2030年边界系数（IMO MEPC.338(76)，每年约收紧2%）`, 随后 2027-2030 的 superior/lower/upper/inferior 系数(line 149-172)是按 2%线性外推填的(2026=0.77→2027=0.755→...→2030=0.710)。截至当前 IMO 仅正式确定到 2026 年的 CII 削减率, 2027 起的加严幅度仍在 MEPC 审议中。代码注释诚实标了'约', 但计算输出(calculateCII 返回的 rating)对用户不区分'已定值(≤2026)'与'外推值(≥2027)'。
- **问题**: 用户对 2027 年及以后的船评 CII, 得到的是看似确定的 A-E 评级, 实则基于尚未生效的外推系数。若据此向船东承诺未来年份评级, 待 IMO 实际定值后可能偏差。注释里的诚实没有传导到 UI/输出。
- **提升**: 在 CII_RATING_BOUNDARIES 给 2027-2030 加 `provisional:true` 标记; calculateCII 当评估年 ≥2027 时在返回的 ratingDescription/message 追加'(基于外推系数, IMO 2027+ 削减率待正式确定)'; IMOCompliancePanel CII 行显示该 provisional 角标。
- **风险**: 纯加标注, 不改外推值本身(已是合理的占位估算, 符合'缺数据如实标'铁律); 零回归。
- **复核**: unverified

