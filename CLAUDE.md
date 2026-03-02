# 齿轮箱选型系统 (gearbox-new)

## 架构
- React 18 SPA + Electron 桌面应用
- 696 个齿轮箱型号，191 个组件文件，42 个数据文件
- 构建工具: Create React App (Webpack)
- UI: React Bootstrap + MUI + Emotion
- 3D: Three.js + @react-three/fiber
- 报表: ECharts + Recharts
- 文档: jsPDF + html2pdf + XLSX + Docx

## 构建与部署
```bash
# 构建（必须加 CI=false 跳过 warning-as-error）
CI=false npm run build

# 部署到服务器
rsync -avz --delete -e "ssh -i ~/.ssh/wxx.pem" build/ root@47.99.181.195:/var/www/html/gearbox-app/

# 在线地址
http://47.99.181.195/gearbox-app/
```

## 关键规则
- **不修改 `src/data/` 目录下的数据结构**，这些文件是核心业务数据
- 核心数据文件 `completeGearboxData.js` (635KB) 包含全部 696 型号
- 传递能力公式: `requiredCapacity = power / speed` (kW/(r/min))
- 联轴器扭矩公式: `T = 9550 * P / n * K` (K=1.5)
- 208 个型号缺失价格数据，显示时需优雅处理（显示"询价"而非空白）
- ESLint 配置在 package.json 中: `react-app` + `react-app/jest`

## 目录结构
```
src/
├── components/     # 20个功能模块（191个组件文件）
├── pages/          # 页面级组件
├── data/           # 42个数据文件（不要随意修改）
├── utils/          # 工具函数
├── hooks/          # 自定义钩子
├── services/       # 业务逻辑
├── contexts/       # React Context 状态管理
├── config/         # 配置文件
└── styles/         # 全局样式
```

## 详细技术文档
- 完整文档: `~/_已整理/05_技术文档/CLAUDE.md`
- 修复记录: `~/_已整理/05_技术文档/CLAUDE_FIXES.md`
