# 移动端响应式选型界面设计

> **日期**: 2026-01-18
> **状态**: 已确认，待实现
> **适用范围**: 屏幕宽度 < 1024px (手机和平板)

## 概述

优化齿轮箱选型功能在移动端的用户体验，通过分步骤输入和可滑动结果卡片减少滚动，提升操作便捷性。

## 设计目标

1. 减少页面滚动长度
2. 核心参数优先展示，次要信息折叠
3. 结果以卡片形式滑动切换，便于对比
4. 触摸友好的交互设计

## 架构设计

### 新增文件

```
src/components/responsive/
├── ResponsiveSelectionForm.js   # 响应式输入表单
├── ResponsiveSelectionForm.css
├── SwipeableResultCards.js      # 可滑动结果卡片
└── SwipeableResultCards.css
```

### 条件渲染逻辑

在 `InputForm.js` 中：

```javascript
import { useIsMobile } from '../hooks/useIsMobile';
import ResponsiveSelectionForm from './responsive/ResponsiveSelectionForm';

const InputForm = (props) => {
  const { isMobile, isTablet } = useIsMobile();
  const useResponsiveLayout = isMobile || isTablet; // width < 1024px

  if (useResponsiveLayout) {
    return <ResponsiveSelectionForm {...props} />;
  }

  // 原有桌面端布局...
};
```

### 依赖

- `react-swipeable` (~3KB) - 滑动手势支持
- Bootstrap Collapse - 折叠动画（已有）

## 输入表单设计

### 核心参数区（始终展开）

```
┌─────────────────────────────┐
│ 齿轮箱类型: [HC系列 ▼]      │
├─────────────────────────────┤
│ 功率      转速      速比    │
│ [___]kW  [___]rpm  [___]   │
│                             │
│ 常用速比: [2] [2.5] [3] [4] │
└─────────────────────────────┘
```

**包含：**
- 齿轮箱类型选择（下拉）
- 功率输入 (kW)
- 转速输入 (rpm)
- 目标速比输入
- 常用速比快捷按钮

### 折叠区

```
[▶] 项目信息 ─────────────────
    - 项目名称
    - 客户名称
    - 联系人
    - 联系电话

[▶] 高级配置 ─────────────────
    - 推力要求
    - 混合动力配置
    - 评分权重配置
    - 容差配置
```

**交互：**
- 点击整行可展开/收起
- 默认折叠状态
- 展开时带动画过渡

### 底部操作按钮

```
┌─────────────────────────────┐
│      [ 🔍 开始选型 ]        │
└─────────────────────────────┘
```

**样式：**
- `position: sticky; bottom: 0`
- 高度 56px
- 主色调背景
- 安全区域适配 (iOS)

## 结果卡片设计

### 卡片容器

```
┌─────────────────────────────┐
│  ← 滑动切换 →   1/5        │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 🏆 HCM400A          │    │
│  │ ━━━━━━━━━━━━━━━━━━  │    │
│  │ 功率: 70-220 kW     │    │
│  │ 转速: 1000-3000 rpm │    │
│  │ 速比: 2.0, 2.5, 3.0 │    │
│  │ 余量: 15.2%  ✓      │    │
│  │                     │    │
│  │ [查看详情] [加入对比]│    │
│  └─────────────────────┘    │
│         ● ○ ○ ○ ○           │
└─────────────────────────────┘
```

### 详情展开

点击"查看详情"后：

```
┌─────────────────────────────┐
│ [▼] 联轴器匹配              │
│     型号: HGTH8             │
│     扭矩余量: 23%           │
├─────────────────────────────┤
│ [▶] 备用泵信息              │
├─────────────────────────────┤
│ [▶] 技术参数                │
└─────────────────────────────┘
│  [生成报价] [生成协议]      │
```

### 手势支持

- **左滑**: 下一个结果
- **右滑**: 上一个结果
- **点击分页点**: 跳转到指定结果
- **滑动阈值**: 50px

## 样式规范

### 触摸优化

```css
/* 输入框 */
.responsive-input {
  height: 48px;
  font-size: 16px; /* 防止 iOS 缩放 */
  border-radius: 8px;
}

/* 按钮 */
.responsive-btn {
  min-height: 44px;
  min-width: 44px;
}

/* 快捷按钮 */
.ratio-quick-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
}
```

### 折叠区

```css
.collapsible-section {
  border-bottom: 1px solid var(--border-color);
}

.collapsible-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.collapsible-header:active {
  background-color: var(--hover-bg);
}
```

### 卡片滑动

```css
.swipe-container {
  overflow: hidden;
  touch-action: pan-y;
}

.cards-track {
  display: flex;
  transition: transform 0.3s ease-out;
}

.result-card {
  flex: 0 0 100%;
  padding: 16px;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted-color);
}

.dot.active {
  background: var(--primary-color);
}
```

## 实现步骤

1. **安装依赖**
   ```bash
   npm install react-swipeable
   ```

2. **创建响应式组件**
   - ResponsiveSelectionForm.js
   - SwipeableResultCards.js

3. **修改 InputForm.js**
   - 添加条件渲染逻辑

4. **修改 EnhancedGearboxSelectionResult.js**
   - 添加移动端卡片视图

5. **测试验证**
   - Chrome DevTools 移动端模拟
   - 真机测试

## 兼容性

- iOS Safari 12+
- Android Chrome 70+
- 支持 PWA 安装后使用

## 后续优化（可选）

- 添加结果缓存，返回输入页时保留结果
- 支持对比模式的移动端优化
- 添加下拉刷新手势
