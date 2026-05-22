// src/components/selection/StructuralFormIcons.js
// GW 4 个结构桶的 SVG 示意图
//
// 视图统一: 输出面正视 (looking at the output-face of the gearbox)
// 约定:
//   ● 实心圆 = 输入轴位置 (input shaft axis projection)
//   ○ 空心圆 = 输出轴位置 (output shaft axis projection)
//   外框    = 齿轮箱壳体
//
// 4 个结构桶在输出面上的几何关系:
//   - 同中心:     输入输出同轴 → 圆套圆 (圆心重合)
//   - 垂直异中心: 输入上, 输出下
//   - 水平异中心: 输入左, 输出右
//   - 角向异中心: 输入输出对角分布 + 虚线连接 (示意成角度)

import React from 'react';

const STROKE = 'currentColor';

// 通用外框 + 输入实心圆 + 输出空心圆
const ShellWithDots = ({ ix, iy, ox, oy, dashed = false }) => (
  <>
    <rect x="4" y="4" width="24" height="24" rx="3" ry="3" fill="none" stroke={STROKE} strokeWidth="1.4" />
    <circle cx={ix} cy={iy} r="2.6" fill={STROKE} />
    <circle cx={ox} cy={oy} r="2.6" fill="none" stroke={STROKE} strokeWidth="1.4" />
    {dashed && (
      <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={STROKE} strokeWidth="0.9" strokeDasharray="2 1.5" />
    )}
  </>
);

const baseSvgProps = (size = 20) => ({
  viewBox: '0 0 32 32',
  width: size,
  height: size,
  className: 'structural-icon',
  'aria-hidden': 'true',
});

// 同中心: 圆套圆
export const ConcentricIcon = ({ size = 20 }) => (
  <svg {...baseSvgProps(size)}>
    <rect x="4" y="4" width="24" height="24" rx="3" ry="3" fill="none" stroke={STROKE} strokeWidth="1.4" />
    <circle cx="16" cy="16" r="6" fill="none" stroke={STROKE} strokeWidth="1.2" />
    <circle cx="16" cy="16" r="2.4" fill={STROKE} />
  </svg>
);

// 垂直异中心: 输入上, 输出下
export const VerticalOffsetIcon = ({ size = 20 }) => (
  <svg {...baseSvgProps(size)}>
    <ShellWithDots ix={16} iy={11} ox={16} oy={22} />
  </svg>
);

// 水平异中心: 输入左, 输出右
export const HorizontalOffsetIcon = ({ size = 20 }) => (
  <svg {...baseSvgProps(size)}>
    <ShellWithDots ix={11} iy={16} ox={22} oy={16} />
  </svg>
);

// 角向异中心: 输入左上, 输出右下, 虚线连接示意成角度
export const AngularOffsetIcon = ({ size = 20 }) => (
  <svg {...baseSvgProps(size)}>
    <ShellWithDots ix={11} iy={11} ox={22} oy={22} dashed />
  </svg>
);

// bucket 名 → 对应图标组件
export const BUCKET_ICON_MAP = {
  同中心: ConcentricIcon,
  垂直异中心: VerticalOffsetIcon,
  水平异中心: HorizontalOffsetIcon,
  角向异中心: AngularOffsetIcon,
};

/**
 * 按 bucket 名称渲染图标
 * @param {{ bucket: string, size?: number }} props
 */
export const BucketIcon = ({ bucket, size = 20 }) => {
  const IconComp = BUCKET_ICON_MAP[bucket];
  if (!IconComp) return null;
  return <IconComp size={size} />;
};

/**
 * 图例: 解释 ● = 输入, ○ = 输出
 */
export const StructuralIconLegend = ({ className = '' }) => (
  <small className={`text-muted ${className}`}>
    <svg viewBox="0 0 16 8" width="14" height="7" aria-hidden="true" className="me-1">
      <circle cx="4" cy="4" r="2.4" fill={STROKE} />
    </svg>
    输入轴
    <svg viewBox="0 0 16 8" width="14" height="7" aria-hidden="true" className="ms-2 me-1">
      <circle cx="4" cy="4" r="2.4" fill="none" stroke={STROKE} strokeWidth="1.4" />
    </svg>
    输出轴
    <span className="ms-2">(图示为齿轮箱输出面正视)</span>
  </small>
);
