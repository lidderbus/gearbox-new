import React from 'react';
import './arrangementDiagram.css';

/**
 * TwinEngineArrangementDiagram - 双机旋向示意图
 *
 * 展示船舶双机推进系统的旋转方向:
 * - 左舷 (Port) 和 右舷 (Starboard) 对称布置
 * - 输入旋向 (柴油机/电机)
 * - 输出旋向 (螺旋桨) - 根据传动级数决定
 * - GWC系列: 2级传动，输入输出同旋向
 * - HC/HCT/DT/HCM/HCQ系列: 1级传动，输入输出反旋向
 *
 * 箭头说明:
 * - 向右箭头 → = 顺时针 (CW)
 * - 向左箭头 ← = 逆时针 (CCW)
 *
 * Props:
 * - gearboxType: 'GWC' | 'HC' | 'HCT' | 'DT' - 齿轮箱类型
 * - propellerConfig: 'outward' | 'inward' - 外旋/内旋配置
 * - width: number - SVG宽度
 * - height: number - SVG高度
 */

const TwinEngineArrangementDiagram = ({
  gearboxType = 'GWC',
  propellerConfig = 'outward',
  width = 700,
  height = 450,
  // 新增：支持左右主机分别设置旋向
  portEngineRotation = null,      // 左舷主机旋向: 'clockwise' | 'counterclockwise' | null(自动)
  starboardEngineRotation = null, // 右舷主机旋向: 'clockwise' | 'counterclockwise' | null(自动)
  // 新增：支持齿轮箱使用倒车档
  portUseReverse = false,         // 左舷齿轮箱使用倒车档
  starboardUseReverse = false     // 右舷齿轮箱使用倒车档
}) => {
  // 判断传动级数 - GWC是2级同向，其他都是1级反向
  const is2Stage = gearboxType.toUpperCase().startsWith('GWC');
  const baseStageText = is2Stage ? '2级传动(同向)' : '1级传动(反向)';

  // 外旋配置: 左舷输出逆时针CCW，右舷输出顺时针CW (从船尾看螺旋桨)
  // 内旋配置: 左舷输出顺时针CW，右舷输出逆时针CCW
  const isOutward = propellerConfig === 'outward';
  const configText = isOutward ? '外旋' : '内旋';

  // 输出旋向 (从船尾看螺旋桨) - 由螺旋桨配置决定
  const portOutputCW = !isOutward;  // 左舷: 外旋=CCW, 内旋=CW
  const starboardOutputCW = isOutward;  // 右舷: 外旋=CW, 内旋=CCW

  // 计算输入旋向的逻辑：
  // 1. 如果用户指定了主机旋向，使用用户指定的值
  // 2. 如果使用倒车档，则在原来的基础上再反向一次
  // 3. 否则根据传动级数自动推算

  const calculateInputRotation = (outputCW, useReverse, engineRotation, is2Stage) => {
    if (engineRotation !== null) {
      // 用户明确指定了主机旋向
      return engineRotation === 'clockwise';
    }
    // 基础逻辑：2级传动同向，1级传动反向
    let inputCW = is2Stage ? outputCW : !outputCW;
    // 如果使用倒车档，再反向一次
    if (useReverse) {
      inputCW = !inputCW;
    }
    return inputCW;
  };

  const portInputCW = calculateInputRotation(portOutputCW, portUseReverse, portEngineRotation, is2Stage);
  const starboardInputCW = calculateInputRotation(starboardOutputCW, starboardUseReverse, starboardEngineRotation, is2Stage);

  // 生成齿轮箱状态文字
  const getGearboxStateText = (useReverse) => {
    if (useReverse) {
      return '倒档做顺车';
    }
    return baseStageText;
  };

  // 颜色配置
  const colors = {
    arrow: '#CC0000',       // 旋向箭头 - 鲜红色
    arrowStroke: '#880000', // 箭头边框 - 深红色
    engine: '#4A90D9',      // 发动机 - 蓝色
    gearbox: '#7ED321',     // 齿轮箱 - 绿色
    propeller: '#F5A623',   // 螺旋桨 - 橙色
    text: '#333333',        // 文字 - 深灰色
    labelBg: '#FFF9C4',     // 标签背景 - 浅黄色
    background: '#FFFFFF'   // 背景 - 白色
  };

  const centerX = width / 2;
  const centerY = height / 2;
  const sideOffset = 160; // 左右舷间距

  // 渲染水平旋向箭头 - 顺时针向右，逆时针向左
  const renderHorizontalArrow = (cx, cy, clockwise, label) => {
    const arrowLength = 60;
    const arrowWidth = 16;
    const lineWidth = 8;

    // 箭头方向：顺时针向右(+1)，逆时针向左(-1)
    const direction = clockwise ? 1 : -1;
    const startX = cx - (arrowLength / 2) * direction;
    const endX = cx + (arrowLength / 2) * direction;

    return (
      <g>
        {/* 组件标签 - 放在箭头上方 */}
        <text
          x={cx}
          y={cy - 35}
          textAnchor="middle"
          fill={colors.text}
          fontSize="12"
          fontWeight="bold"
        >
          {label}
        </text>
        {/* 箭头主体线条 */}
        <line
          x1={startX}
          y1={cy}
          x2={endX - (direction * arrowWidth * 0.6)}
          y2={cy}
          stroke={colors.arrow}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />
        {/* 箭头头部 */}
        <polygon
          points={`
            ${endX},${cy}
            ${endX - direction * arrowWidth},${cy - arrowWidth}
            ${endX - direction * arrowWidth},${cy + arrowWidth}
          `}
          fill={colors.arrow}
          stroke={colors.arrowStroke}
          strokeWidth="2"
        />
        {/* 旋向文字 - 放在箭头下方 */}
        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          fill={colors.text}
          fontSize="13"
          fontWeight="bold"
        >
          {clockwise ? '顺时针' : '逆时针'}
        </text>
        <text
          x={cx}
          y={cy + 45}
          textAnchor="middle"
          fill={colors.text}
          fontSize="11"
        >
          {clockwise ? '(CW) →' : '(CCW) ←'}
        </text>
      </g>
    );
  };

  // 渲染单侧推进系统
  const renderPropulsionSide = (xOffset, sideName, inputCW, outputCW, useReverse = false) => {
    const x = centerX + xOffset;
    const engineY = centerY - 110;
    const gearboxY = centerY + 30;
    const propellerY = centerY + 170;

    // 齿轮箱颜色 - 使用倒档时显示不同颜色
    const gearboxColor = useReverse ? '#FF9800' : colors.gearbox;  // 倒档时橙色
    const gearboxStroke = useReverse ? '#E65100' : '#5FB318';

    return (
      <g>
        {/* 侧面标签 */}
        <rect
          x={x - 35}
          y={35}
          width={70}
          height={26}
          fill={colors.labelBg}
          stroke="#E0E0E0"
          strokeWidth="1"
          rx="4"
        />
        <text
          x={x}
          y={53}
          textAnchor="middle"
          fill={colors.text}
          fontSize="14"
          fontWeight="bold"
        >
          {sideName}
        </text>

        {/* 输入端旋向箭头 */}
        {renderHorizontalArrow(x, engineY, inputCW, '输入(发动机)')}

        {/* 齿轮箱图标 */}
        <rect
          x={x - 40}
          y={gearboxY - 22}
          width={80}
          height={44}
          fill={gearboxColor}
          stroke={gearboxStroke}
          strokeWidth="2"
          rx="5"
        />
        <text
          x={x}
          y={gearboxY + 5}
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="bold"
        >
          {gearboxType}
        </text>
        <text
          x={x}
          y={gearboxY + 40}
          textAnchor="middle"
          fill={useReverse ? '#E65100' : colors.text}
          fontSize="10"
          fontWeight={useReverse ? 'bold' : 'normal'}
        >
          {getGearboxStateText(useReverse)}
        </text>

        {/* 连接线 - 发动机到齿轮箱 */}
        <line
          x1={x}
          y1={engineY + 35}
          x2={x}
          y2={gearboxY - 28}
          stroke={colors.text}
          strokeWidth="4"
        />
        <polygon
          points={`${x - 6},${gearboxY - 32} ${x},${gearboxY - 24} ${x + 6},${gearboxY - 32}`}
          fill={colors.text}
        />

        {/* 连接线 - 齿轮箱到螺旋桨 */}
        <line
          x1={x}
          y1={gearboxY + 28}
          x2={x}
          y2={propellerY - 50}
          stroke={colors.text}
          strokeWidth="4"
        />
        <polygon
          points={`${x - 6},${propellerY - 54} ${x},${propellerY - 46} ${x + 6},${propellerY - 54}`}
          fill={colors.text}
        />

        {/* 输出端旋向箭头 */}
        {renderHorizontalArrow(x, propellerY, outputCW, '输出(螺旋桨)')}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="twin-engine-diagram"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: 'auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}
    >
      {/* 背景 */}
      <rect width={width} height={height} fill={colors.background} />

      {/* 标题 */}
      <text
        x={centerX}
        y={25}
        textAnchor="middle"
        fill={colors.text}
        fontSize="18"
        fontWeight="bold"
      >
        双机旋向示意图 ({configText}配置)
      </text>

      {/* 左舷 */}
      {renderPropulsionSide(-sideOffset, '左舷(P)', portInputCW, portOutputCW, portUseReverse)}

      {/* 右舷 */}
      {renderPropulsionSide(sideOffset, '右舷(S)', starboardInputCW, starboardOutputCW, starboardUseReverse)}

      {/* 中线 */}
      <line
        x1={centerX}
        y1={70}
        x2={centerX}
        y2={height - 70}
        stroke="#CCCCCC"
        strokeWidth="2"
        strokeDasharray="10,5"
      />
      <text
        x={centerX}
        y={height - 50}
        textAnchor="middle"
        fill="#999999"
        fontSize="11"
      >
        船舶中线
      </text>

{/* 图例说明已移除，避免遮挡双机布局 */}

      {/* 船首方向 */}
      <g transform={`translate(40, ${height / 2})`}>
        <polygon
          points="0,0 20,-14 20,14"
          fill={colors.text}
        />
        <text x="25" y="5" fill={colors.text} fontSize="12" fontWeight="bold">
          船首
        </text>
      </g>
    </svg>
  );
};

/**
 * 生成静态SVG字符串 (用于HTML模板嵌入)
 */
export const generateDiagramHTML = (gearboxType = 'GWC', propellerConfig = 'outward') => {
  const { renderToStaticMarkup } = require('react-dom/server');
  const element = React.createElement(TwinEngineArrangementDiagram, {
    gearboxType,
    propellerConfig,
    width: 650,
    height: 420
  });
  return renderToStaticMarkup(element);
};

export default TwinEngineArrangementDiagram;
