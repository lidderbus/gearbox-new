// src/components/SingleEngineDiagramEnhanced.js
// 单机推进旋向示意图 - 工业蓝图风格增强版
// 版本: v2.0 (2025-12-26)
// 特性: 动态旋转动画、3D机械风格、深色蓝图主题

import React, { useMemo } from 'react';
import './SingleEngineDiagramEnhanced.css';

/**
 * 增强版单机旋向示意图
 * 工业蓝图风格设计，带动态旋转动画
 */
const SingleEngineDiagramEnhanced = ({
  inputRotation = 'clockwise',
  outputRotation = 'clockwise',
  gearboxType = 'HC',
  width = 700,
  height = 380
}) => {
  const inputCW = inputRotation === 'clockwise';
  const outputCW = outputRotation === 'clockwise';

  // 判断传动级数 - GWC是2级同向，其他都是1级反向
  const is2Stage = gearboxType?.toUpperCase()?.startsWith('GWC');
  const stageText = is2Stage ? '2级传动' : '1级传动';
  const stageSubText = is2Stage ? '同向输出' : '反向输出';

  // 组件布局计算
  const layout = useMemo(() => ({
    engineX: width * 0.14,
    gearboxX: width * 0.5,
    propellerX: width * 0.86,
    centerY: height * 0.52,
    arrowY: height * 0.22
  }), [width, height]);

  // 生成唯一ID用于动画和渐变
  const uniqueId = useMemo(() => `sed-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className="single-engine-diagram-enhanced" style={{ width, height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="diagram-svg"
      >
        {/* 定义渐变和滤镜 */}
        <defs>
          {/* 发光效果 */}
          <filter id={`${uniqueId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id={`${uniqueId}-glow-strong`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* 发动机渐变 */}
          <linearGradient id={`${uniqueId}-engine-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a5298"/>
            <stop offset="50%" stopColor="#1e3c72"/>
            <stop offset="100%" stopColor="#0f2744"/>
          </linearGradient>

          {/* 齿轮箱渐变 */}
          <linearGradient id={`${uniqueId}-gearbox-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a6b4a"/>
            <stop offset="50%" stopColor="#0d4f35"/>
            <stop offset="100%" stopColor="#063323"/>
          </linearGradient>

          {/* 螺旋桨渐变 */}
          <radialGradient id={`${uniqueId}-propeller-grad`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="#d4920e"/>
            <stop offset="70%" stopColor="#b87d0a"/>
            <stop offset="100%" stopColor="#8a5d07"/>
          </radialGradient>

          {/* 轴渐变 */}
          <linearGradient id={`${uniqueId}-shaft-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6a6a6a"/>
            <stop offset="50%" stopColor="#4a4a4a"/>
            <stop offset="100%" stopColor="#2a2a2a"/>
          </linearGradient>

          {/* 顺时针箭头渐变 - 青色 */}
          <linearGradient id={`${uniqueId}-cw-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5d4"/>
            <stop offset="100%" stopColor="#00b894"/>
          </linearGradient>

          {/* 逆时针箭头渐变 - 橙色 */}
          <linearGradient id={`${uniqueId}-ccw-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b"/>
            <stop offset="100%" stopColor="#ee5a24"/>
          </linearGradient>

          {/* 网格图案 */}
          <pattern id={`${uniqueId}-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 180, 216, 0.08)" strokeWidth="0.5"/>
          </pattern>

          {/* 精细网格 */}
          <pattern id={`${uniqueId}-grid-fine`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 180, 216, 0.04)" strokeWidth="0.3"/>
          </pattern>
        </defs>

        {/* 背景 */}
        <rect x="0" y="0" width={width} height={height} fill="#0a1628" rx="12"/>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${uniqueId}-grid-fine)`} rx="12"/>
        <rect x="0" y="0" width={width} height={height} fill={`url(#${uniqueId}-grid)`} rx="12"/>

        {/* 边框发光效果 */}
        <rect
          x="2" y="2"
          width={width - 4} height={height - 4}
          fill="none"
          stroke="rgba(0, 180, 216, 0.3)"
          strokeWidth="1"
          rx="10"
        />

        {/* 标题区域 */}
        <g className="title-group">
          <text
            x={width / 2}
            y={32}
            textAnchor="middle"
            className="diagram-title"
          >
            单机推进旋向示意图
          </text>
          <text
            x={width / 2}
            y={52}
            textAnchor="middle"
            className="diagram-subtitle"
          >
            SINGLE ENGINE PROPULSION DIAGRAM
          </text>
        </g>

        {/* 船首方向指示 */}
        <g className="bow-indicator" transform={`translate(25, ${layout.centerY})`}>
          <polygon
            points="0,0 25,-15 25,15"
            fill="rgba(0, 180, 216, 0.6)"
            filter={`url(#${uniqueId}-glow)`}
          />
          <text x="32" y="5" className="label-text">船首</text>
          <text x="32" y="18" className="label-text-small">BOW</text>
        </g>

        {/* ===== 输入端旋转箭头 ===== */}
        <g className="rotation-indicator input-rotation" transform={`translate(${(layout.engineX + layout.gearboxX) / 2}, ${layout.arrowY})`}>
          {/* 旋转动画容器 */}
          <g className={`rotating-arrow ${inputCW ? 'rotate-cw' : 'rotate-ccw'}`}>
            {/* 圆形轨道 */}
            <circle
              cx="0" cy="0" r="28"
              fill="none"
              stroke={inputCW ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 107, 107, 0.2)'}
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            {/* 旋转箭头弧线 */}
            <path
              d={inputCW
                ? "M 0 -28 A 28 28 0 1 1 -24 14"
                : "M 0 -28 A 28 28 0 1 0 24 14"
              }
              fill="none"
              stroke={`url(#${uniqueId}-${inputCW ? 'cw' : 'ccw'}-grad)`}
              strokeWidth="5"
              strokeLinecap="round"
              filter={`url(#${uniqueId}-glow)`}
            />
            {/* 箭头头部 */}
            <polygon
              points={inputCW
                ? "-24,14 -34,6 -28,20"
                : "24,14 34,6 28,20"
              }
              fill={inputCW ? '#00f5d4' : '#ff6b6b'}
              filter={`url(#${uniqueId}-glow)`}
            />
          </g>
          {/* 标签 */}
          <text y="55" textAnchor="middle" className="rotation-label">输入端</text>
          <text y="72" textAnchor="middle" className={`rotation-value ${inputCW ? 'cw' : 'ccw'}`}>
            {inputCW ? '顺时针 CW' : '逆时针 CCW'}
          </text>
        </g>

        {/* ===== 输出端旋转箭头 ===== */}
        <g className="rotation-indicator output-rotation" transform={`translate(${(layout.gearboxX + layout.propellerX) / 2}, ${layout.arrowY})`}>
          {/* 旋转动画容器 */}
          <g className={`rotating-arrow ${outputCW ? 'rotate-cw' : 'rotate-ccw'}`}>
            {/* 圆形轨道 */}
            <circle
              cx="0" cy="0" r="28"
              fill="none"
              stroke={outputCW ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 107, 107, 0.2)'}
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            {/* 旋转箭头弧线 */}
            <path
              d={outputCW
                ? "M 0 -28 A 28 28 0 1 1 -24 14"
                : "M 0 -28 A 28 28 0 1 0 24 14"
              }
              fill="none"
              stroke={`url(#${uniqueId}-${outputCW ? 'cw' : 'ccw'}-grad)`}
              strokeWidth="5"
              strokeLinecap="round"
              filter={`url(#${uniqueId}-glow)`}
            />
            {/* 箭头头部 */}
            <polygon
              points={outputCW
                ? "-24,14 -34,6 -28,20"
                : "24,14 34,6 28,20"
              }
              fill={outputCW ? '#00f5d4' : '#ff6b6b'}
              filter={`url(#${uniqueId}-glow)`}
            />
          </g>
          {/* 标签 */}
          <text y="55" textAnchor="middle" className="rotation-label">输出端</text>
          <text y="72" textAnchor="middle" className={`rotation-value ${outputCW ? 'cw' : 'ccw'}`}>
            {outputCW ? '顺时针 CW' : '逆时针 CCW'}
          </text>
        </g>

        {/* ===== 发动机 ===== */}
        <g className="engine-group" transform={`translate(${layout.engineX}, ${layout.centerY})`}>
          {/* 发动机主体 - 3D效果 */}
          <rect
            x="-42" y="-40"
            width="84" height="80"
            fill={`url(#${uniqueId}-engine-grad)`}
            stroke="#4a90d9"
            strokeWidth="2"
            rx="6"
          />
          {/* 高光边 */}
          <rect
            x="-40" y="-38"
            width="80" height="4"
            fill="rgba(255,255,255,0.15)"
            rx="2"
          />
          {/* 散热片纹理 */}
          {[-25, -12, 0, 12, 25].map((y, i) => (
            <line key={i} x1="-38" y1={y} x2="38" y2={y} stroke="rgba(0,0,0,0.3)" strokeWidth="3"/>
          ))}
          {/* 发动机轴承 */}
          <ellipse cx="42" cy="0" rx="8" ry="18" fill="#3a3a3a" stroke="#555" strokeWidth="2"/>
          {/* 标签 */}
          <text y="5" textAnchor="middle" className="component-label-main">发动机</text>
          <text y="58" textAnchor="middle" className="component-label-sub">ENGINE</text>
        </g>

        {/* ===== 输入轴 ===== */}
        <g className="shaft input-shaft">
          <rect
            x={layout.engineX + 50}
            y={layout.centerY - 8}
            width={layout.gearboxX - layout.engineX - 100}
            height="16"
            fill={`url(#${uniqueId}-shaft-grad)`}
            rx="2"
          />
          {/* 轴上的旋转纹理动画 */}
          <g className={`shaft-texture ${inputCW ? 'rotate-cw' : 'rotate-ccw'}`}>
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={layout.engineX + 60 + i * 30}
                y={layout.centerY - 6}
                width="4"
                height="12"
                fill="rgba(255,255,255,0.1)"
                rx="1"
              />
            ))}
          </g>
          {/* 法兰盘 */}
          <circle cx={layout.gearboxX - 52} cy={layout.centerY} r="14" fill="#4a4a4a" stroke="#666" strokeWidth="2"/>
          <circle cx={layout.gearboxX - 52} cy={layout.centerY} r="6" fill="#333"/>
        </g>

        {/* ===== 齿轮箱 ===== */}
        <g className="gearbox-group" transform={`translate(${layout.gearboxX}, ${layout.centerY})`}>
          {/* 齿轮箱主体 */}
          <rect
            x="-55" y="-50"
            width="110" height="100"
            fill={`url(#${uniqueId}-gearbox-grad)`}
            stroke="#2ecc71"
            strokeWidth="2"
            rx="8"
          />
          {/* 高光边 */}
          <rect
            x="-52" y="-47"
            width="104" height="5"
            fill="rgba(255,255,255,0.12)"
            rx="2"
          />
          {/* 齿轮装饰 */}
          <g className="gear-decoration">
            <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(46, 204, 113, 0.4)" strokeWidth="2" strokeDasharray="8 4"/>
            <circle cx="0" cy="0" r="20" fill="rgba(46, 204, 113, 0.15)" stroke="rgba(46, 204, 113, 0.5)" strokeWidth="1"/>
            {/* 齿轮齿 */}
            {[...Array(12)].map((_, i) => (
              <rect
                key={i}
                x="-3" y="-32"
                width="6" height="8"
                fill="rgba(46, 204, 113, 0.5)"
                transform={`rotate(${i * 30})`}
                rx="1"
              />
            ))}
          </g>
          {/* 输入输出轴承 */}
          <ellipse cx="-55" cy="0" rx="6" ry="16" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
          <ellipse cx="55" cy="0" rx="6" ry="16" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
          {/* 标签 */}
          <text y="-58" textAnchor="middle" className="component-label-main">齿轮箱</text>
          <text y="68" textAnchor="middle" className="gearbox-model">{gearboxType || 'HC'}</text>
          <text y="82" textAnchor="middle" className="gearbox-stage">{stageText}</text>
          <text y="96" textAnchor="middle" className="gearbox-stage-sub">{stageSubText}</text>
        </g>

        {/* ===== 输出轴 ===== */}
        <g className="shaft output-shaft">
          <rect
            x={layout.gearboxX + 62}
            y={layout.centerY - 8}
            width={layout.propellerX - layout.gearboxX - 100}
            height="16"
            fill={`url(#${uniqueId}-shaft-grad)`}
            rx="2"
          />
          {/* 轴上的旋转纹理动画 */}
          <g className={`shaft-texture ${outputCW ? 'rotate-cw' : 'rotate-ccw'}`}>
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={layout.gearboxX + 75 + i * 30}
                y={layout.centerY - 6}
                width="4"
                height="12"
                fill="rgba(255,255,255,0.1)"
                rx="1"
              />
            ))}
          </g>
          {/* 法兰盘 */}
          <circle cx={layout.gearboxX + 60} cy={layout.centerY} r="14" fill="#4a4a4a" stroke="#666" strokeWidth="2"/>
          <circle cx={layout.gearboxX + 60} cy={layout.centerY} r="6" fill="#333"/>
        </g>

        {/* ===== 螺旋桨 ===== */}
        <g className="propeller-group" transform={`translate(${layout.propellerX}, ${layout.centerY})`}>
          {/* 轴毂 */}
          <circle cx="-35" cy="0" r="12" fill="#555" stroke="#666" strokeWidth="2"/>
          {/* 螺旋桨主体 */}
          <g className={`propeller-blades ${outputCW ? 'spin-cw' : 'spin-ccw'}`}>
            {/* 中心毂 */}
            <circle cx="0" cy="0" r="18" fill={`url(#${uniqueId}-propeller-grad)`} stroke="#c67d0a" strokeWidth="2"/>
            {/* 三片桨叶 */}
            {[0, 120, 240].map((angle, i) => (
              <g key={i} transform={`rotate(${angle})`}>
                <ellipse
                  cx="0" cy="-38"
                  rx="14" ry="28"
                  fill={`url(#${uniqueId}-propeller-grad)`}
                  stroke="#c67d0a"
                  strokeWidth="1.5"
                  transform="rotate(-15)"
                />
              </g>
            ))}
          </g>
          {/* 标签 */}
          <text y="65" textAnchor="middle" className="component-label-main">螺旋桨</text>
          <text y="80" textAnchor="middle" className="component-label-sub">PROPELLER</text>
        </g>

        {/* ===== 图例 ===== */}
        <g className="legend" transform={`translate(${width - 155}, ${height - 75})`}>
          <rect x="0" y="0" width="145" height="65" fill="rgba(10, 22, 40, 0.9)" stroke="rgba(0, 180, 216, 0.3)" rx="6"/>
          <text x="72" y="16" textAnchor="middle" className="legend-title">旋向说明</text>
          <g transform="translate(12, 28)">
            <circle cx="8" cy="6" r="6" fill="rgba(0, 245, 212, 0.3)" stroke="#00f5d4" strokeWidth="1.5"/>
            <path d="M 5 6 A 3 3 0 1 1 8 10" fill="none" stroke="#00f5d4" strokeWidth="1.5"/>
            <text x="22" y="10" className="legend-text">顺时针 CW</text>
          </g>
          <g transform="translate(12, 48)">
            <circle cx="8" cy="6" r="6" fill="rgba(255, 107, 107, 0.3)" stroke="#ff6b6b" strokeWidth="1.5"/>
            <path d="M 11 6 A 3 3 0 1 0 8 10" fill="none" stroke="#ff6b6b" strokeWidth="1.5"/>
            <text x="22" y="10" className="legend-text">逆时针 CCW</text>
          </g>
        </g>

        {/* 技术标注线 */}
        <g className="tech-annotations">
          {/* 输入轴标注 */}
          <line
            x1={(layout.engineX + layout.gearboxX) / 2}
            y1={layout.centerY - 25}
            x2={(layout.engineX + layout.gearboxX) / 2}
            y2={layout.arrowY + 80}
            stroke="rgba(0, 180, 216, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* 输出轴标注 */}
          <line
            x1={(layout.gearboxX + layout.propellerX) / 2}
            y1={layout.centerY - 25}
            x2={(layout.gearboxX + layout.propellerX) / 2}
            y2={layout.arrowY + 80}
            stroke="rgba(0, 180, 216, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </g>
      </svg>
    </div>
  );
};

export default SingleEngineDiagramEnhanced;
