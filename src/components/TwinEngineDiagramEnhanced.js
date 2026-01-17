import React, { useMemo } from 'react';
import './TwinEngineDiagramEnhanced.css';

/**
 * 增强版双机推进旋向示意图
 * 工业蓝图风格，与SingleEngineDiagramEnhanced保持视觉一致
 */
const TwinEngineDiagramEnhanced = ({
  portInputRotation = 'CW',
  portOutputRotation = 'CCW',
  starboardInputRotation = 'CCW',
  starboardOutputRotation = 'CW',
  gearboxType = 'HC',
  width = 780,
  height = 520,
  portReverse = false,
  starboardReverse = false,
  arrangementType = 'outward'
}) => {
  // 判断传动级数
  const transmissionStage = useMemo(() => {
    if (!gearboxType) return { stage: 1, text: '1级传动', direction: '反向' };
    const upperType = gearboxType.toUpperCase();
    if (upperType.startsWith('GWC') || upperType.startsWith('2GWH')) {
      return { stage: 2, text: '2级传动', direction: '同向' };
    }
    return { stage: 1, text: '1级传动', direction: '反向' };
  }, [gearboxType]);

  // 颜色配置
  const colors = {
    background: '#0a1628',
    grid: 'rgba(0, 245, 212, 0.08)',
    engine: 'url(#engineGradientTwin)',
    gearbox: 'url(#gearboxGradientTwin)',
    propeller: 'url(#propellerGradientTwin)',
    cwArrow: '#00f5d4',
    ccwArrow: '#ff6b6b',
    text: '#e8f4f8',
    textSecondary: '#8ba3b5',
    shaft: '#4a6785',
    centerLine: 'rgba(255, 255, 255, 0.3)',
    reverseHighlight: '#ff9f43',
    portLabel: '#00f5d4',
    starboardLabel: '#ff6b6b'
  };

  // 布局计算
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  const sideOffset = 160;
  const engineY = centerY - 140;
  const gearboxY = centerY - 20;
  const propellerY = centerY + 120;

  // 渲染圆形旋转箭头
  const renderRotationArrow = (cx, cy, isClockwise, label, size = 28) => {
    const color = isClockwise ? colors.cwArrow : colors.ccwArrow;
    const animationClass = isClockwise ? 'rotate-clockwise-twin' : 'rotate-ccw-twin';

    return (
      <g className={`rotation-arrow-twin ${animationClass}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={size + 4} fill="none" stroke={color} strokeWidth="1" opacity="0.3" filter="url(#glowTwin)" />
        <path
          d={`M ${cx} ${cy - size} A ${size} ${size} 0 1 ${isClockwise ? 1 : 0} ${cx + (isClockwise ? size : -size)} ${cy}`}
          fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        />
        <polygon
          points={isClockwise
            ? `${cx + size - 6},${cy - 8} ${cx + size + 6},${cy} ${cx + size - 6},${cy + 8}`
            : `${cx - size + 6},${cy - 8} ${cx - size - 6},${cy} ${cx - size + 6},${cy + 8}`}
          fill={color}
        />
        <text x={cx} y={cy + size + 18} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold" fontFamily="'Rajdhani', sans-serif">
          {label}
        </text>
      </g>
    );
  };

  // 渲染单侧推进系统
  const renderPropulsionSide = (side, inputCW, outputCW, isReverse, xOffset) => {
    const x = centerX + xOffset;
    const isPort = side === 'port';
    const sideLabel = isPort ? '左舷 (P)' : '右舷 (S)';
    const sideLabelColor = isPort ? colors.portLabel : colors.starboardLabel;

    return (
      <g key={side}>
        <text x={x} y={engineY - 90} textAnchor="middle" fill={sideLabelColor} fontSize="14" fontWeight="bold" fontFamily="'Orbitron', sans-serif">
          {sideLabel}
        </text>

        {/* 发动机 */}
        <g>
          <rect x={x - 50} y={engineY - 35} width={100} height={70} fill={colors.engine} stroke="#1a9fff" strokeWidth="2" rx="6" filter="url(#shadowTwin)" />
          {[-30, -15, 0, 15, 30].map((offset, i) => (
            <line key={i} x1={x + offset} y1={engineY - 32} x2={x + offset} y2={engineY - 25} stroke="#1a9fff" strokeWidth="2" opacity="0.6" />
          ))}
          <text x={x} y={engineY - 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="'Share Tech Mono', monospace">ENGINE</text>
          <text x={x} y={engineY + 12} textAnchor="middle" fill="#aaddff" fontSize="10" fontFamily="'Rajdhani', sans-serif">发动机</text>
        </g>

        {renderRotationArrow(x + (isPort ? 70 : -70), engineY, inputCW, inputCW ? 'CW' : 'CCW', 22)}

        <rect x={x - 6} y={engineY + 35} width={12} height={gearboxY - engineY - 70} fill="url(#shaftGradientTwin)" rx="2" />

        {/* 齿轮箱 */}
        <g className={isReverse ? 'reverse-gearbox-twin' : ''}>
          <rect x={x - 55} y={gearboxY - 40} width={110} height={80} fill={isReverse ? 'url(#reverseGearboxGradientTwin)' : colors.gearbox}
            stroke={isReverse ? colors.reverseHighlight : '#5FB318'} strokeWidth={isReverse ? 3 : 2} rx="6" filter="url(#shadowTwin)" />
          <circle cx={x - 25} cy={gearboxY - 5} r="12" fill="none" stroke="#7dd956" strokeWidth="2" opacity="0.4" strokeDasharray="4 2" />
          <circle cx={x + 25} cy={gearboxY - 5} r="12" fill="none" stroke="#7dd956" strokeWidth="2" opacity="0.4" strokeDasharray="4 2" />
          <text x={x} y={gearboxY - 15} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="'Share Tech Mono', monospace">GEARBOX</text>
          <text x={x} y={gearboxY + 2} textAnchor="middle" fill="#c8f7c5" fontSize="10" fontFamily="'Rajdhani', sans-serif">{gearboxType || 'auto'}</text>
          <text x={x} y={gearboxY + 18} textAnchor="middle" fill="#a8e6a3" fontSize="9" fontFamily="'Rajdhani', sans-serif">{transmissionStage.text}</text>
          {isReverse && (
            <text x={x} y={gearboxY + 50} textAnchor="middle" fill={colors.reverseHighlight} fontSize="10" fontWeight="bold" fontFamily="'Rajdhani', sans-serif">
              倒档做顺车
            </text>
          )}
        </g>

        <rect x={x - 6} y={gearboxY + 40} width={12} height={propellerY - gearboxY - 80} fill="url(#shaftGradientTwin)" rx="2" />

        {renderRotationArrow(x + (isPort ? 70 : -70), propellerY - 50, outputCW, outputCW ? 'CW' : 'CCW', 22)}

        {/* 螺旋桨 */}
        <g className={`propeller-twin ${outputCW ? 'spin-cw-twin' : 'spin-ccw-twin'}`} style={{ transformOrigin: `${x}px ${propellerY}px` }}>
          <circle cx={x} cy={propellerY} r={40} fill={colors.propeller} stroke="#D4920E" strokeWidth="2" filter="url(#shadowTwin)" />
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx={x + 25 * Math.cos((angle * Math.PI) / 180)} cy={propellerY + 25 * Math.sin((angle * Math.PI) / 180)}
              rx="12" ry="6" fill="#f5a623" opacity="0.7"
              transform={`rotate(${angle + 45} ${x + 25 * Math.cos((angle * Math.PI) / 180)} ${propellerY + 25 * Math.sin((angle * Math.PI) / 180)})`} />
          ))}
          <circle cx={x} cy={propellerY} r="10" fill="#ffd93d" />
          <text x={x} y={propellerY + 4} textAnchor="middle" fill="#333" fontSize="8" fontWeight="bold">P</text>
        </g>
        <text x={x} y={propellerY + 55} textAnchor="middle" fill={colors.textSecondary} fontSize="10" fontFamily="'Rajdhani', sans-serif">PROPELLER</text>
      </g>
    );
  };

  const portInputCW = portInputRotation === 'CW';
  const portOutputCW = portOutputRotation === 'CW';
  const starboardInputCW = starboardInputRotation === 'CW';
  const starboardOutputCW = starboardOutputRotation === 'CW';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="twin-engine-diagram-enhanced" style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="engineGradientTwin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d5a87" /><stop offset="50%" stopColor="#1e3d5c" /><stop offset="100%" stopColor="#152a3d" />
        </linearGradient>
        <linearGradient id="gearboxGradientTwin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a7c3f" /><stop offset="50%" stopColor="#3a6330" /><stop offset="100%" stopColor="#2a4a22" />
        </linearGradient>
        <linearGradient id="reverseGearboxGradientTwin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5a2b" /><stop offset="50%" stopColor="#6b4423" /><stop offset="100%" stopColor="#4a2f18" />
        </linearGradient>
        <linearGradient id="propellerGradientTwin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4920e" /><stop offset="50%" stopColor="#b87a0a" /><stop offset="100%" stopColor="#8c5d08" />
        </linearGradient>
        <linearGradient id="shaftGradientTwin" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a5068" /><stop offset="50%" stopColor="#5a7898" /><stop offset="100%" stopColor="#3a5068" />
        </linearGradient>
        <linearGradient id="bgGradientTwin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d1f35" /><stop offset="100%" stopColor="#071018" />
        </linearGradient>
        <pattern id="gridPatternTwin" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke={colors.grid} strokeWidth="0.5" />
        </pattern>
        <filter id="glowTwin" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadowTwin" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <filter id="titleGlowTwin" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width={width} height={height} fill="url(#bgGradientTwin)" />
      <rect width={width} height={height} fill="url(#gridPatternTwin)" />
      <rect x="2" y="2" width={width - 4} height={height - 4} fill="none" stroke="rgba(0, 245, 212, 0.3)" strokeWidth="1" rx="8" />

      <text x={centerX} y={35} textAnchor="middle" fill={colors.cwArrow} fontSize="18" fontWeight="bold" fontFamily="'Orbitron', sans-serif" filter="url(#titleGlowTwin)">
        双机推进旋向示意图
      </text>
      <text x={centerX} y={55} textAnchor="middle" fill={colors.textSecondary} fontSize="12" fontFamily="'Share Tech Mono', monospace" letterSpacing="2">
        TWIN ENGINE PROPULSION DIAGRAM
      </text>
      <text x={centerX} y={75} textAnchor="middle" fill={arrangementType === 'outward' ? colors.cwArrow : colors.ccwArrow} fontSize="13" fontFamily="'Rajdhani', sans-serif">
        {arrangementType === 'outward' ? '外翻配置 (OUTWARD)' : '内翻配置 (INWARD)'}
      </text>

      <line x1={centerX} y1={engineY - 70} x2={centerX} y2={propellerY + 70} stroke={colors.centerLine} strokeWidth="2" strokeDasharray="8 4" />
      <text x={centerX} y={propellerY + 85} textAnchor="middle" fill={colors.textSecondary} fontSize="10" fontFamily="'Rajdhani', sans-serif">船舶中线</text>

      {renderPropulsionSide('port', portInputCW, portOutputCW, portReverse, -sideOffset)}
      {renderPropulsionSide('starboard', starboardInputCW, starboardOutputCW, starboardReverse, sideOffset)}

      <g transform={`translate(30, ${centerY})`}>
        <polygon points="0,0 25,-15 25,15" fill={colors.cwArrow} opacity="0.8" />
        <text x="35" y="5" fill={colors.text} fontSize="12" fontFamily="'Rajdhani', sans-serif" fontWeight="bold">船首</text>
        <text x="35" y="18" fill={colors.textSecondary} fontSize="10" fontFamily="'Share Tech Mono', monospace">BOW</text>
      </g>

      <g transform={`translate(${width - 150}, ${height - 90})`}>
        <rect x="0" y="0" width="140" height="80" fill="rgba(10, 22, 40, 0.8)" stroke="rgba(0, 245, 212, 0.3)" strokeWidth="1" rx="6" />
        <text x="70" y="18" textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="bold" fontFamily="'Rajdhani', sans-serif">旋向图例</text>
        <circle cx="20" cy="38" r="8" fill="none" stroke={colors.cwArrow} strokeWidth="2" />
        <text x="35" y="42" fill={colors.cwArrow} fontSize="10" fontFamily="'Share Tech Mono', monospace">CW 顺时针</text>
        <circle cx="20" cy="60" r="8" fill="none" stroke={colors.ccwArrow} strokeWidth="2" />
        <text x="35" y="64" fill={colors.ccwArrow} fontSize="10" fontFamily="'Share Tech Mono', monospace">CCW 逆时针</text>
      </g>

      <g transform={`translate(20, ${height - 45})`}>
        <text fill={colors.textSecondary} fontSize="10" fontFamily="'Rajdhani', sans-serif">
          <tspan x="0" dy="0">传动说明：</tspan>
          <tspan x="0" dy="14">GWC/2GWH系列为2级传动（输入输出同向），HC/HCT/DT等系列为1级传动（输入输出反向）</tspan>
        </text>
      </g>
    </svg>
  );
};

export default TwinEngineDiagramEnhanced;
