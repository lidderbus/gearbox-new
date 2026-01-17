/**
 * 齿轮箱3D预览组件
 * 使用 Three.js (@react-three/fiber + @react-three/drei)
 * 程序化生成齿轮箱3D模型，支持旋转、缩放、不同视角
 *
 * 2025-12-26 创建
 */
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import { Card, ButtonGroup, Button, Badge, Spinner } from 'react-bootstrap';
import * as THREE from 'three';

// 齿轮箱颜色配置
const GEARBOX_COLORS = {
  housing: '#4A5568',      // 壳体深灰
  housingLight: '#718096', // 壳体浅灰
  flange: '#2D3748',       // 法兰深色
  shaft: '#A0AEC0',        // 轴银色
  gear: '#63B3ED',         // 齿轮蓝
  oil: '#F6E05E',          // 油黄色
  highlight: '#48BB78',    // 高亮绿
};

// 系列对应的颜色主题
const SERIES_THEMES = {
  'HCM': { primary: '#3182CE', secondary: '#4299E1', accent: '#63B3ED', name: 'HCM系列' },
  'HCD': { primary: '#805AD5', secondary: '#9F7AEA', accent: '#B794F4', name: 'HCD系列' },
  'HC': { primary: '#38A169', secondary: '#48BB78', accent: '#68D391', name: 'HC系列' },
  'HCQ': { primary: '#DD6B20', secondary: '#ED8936', accent: '#F6AD55', name: 'HCQ系列' },
  'GW': { primary: '#E53E3E', secondary: '#FC8181', accent: '#FEB2B2', name: 'GW系列' },
  'DEFAULT': { primary: '#3182CE', secondary: '#4299E1', accent: '#63B3ED', name: '齿轮箱' },
};

/**
 * 齿轮组件
 */
function Gear({ position, radius, thickness, teeth = 24, color }) {
  const gearShape = useMemo(() => {
    const shape = new THREE.Shape();
    const toothDepth = radius * 0.15;
    const toothWidth = (Math.PI * 2 * radius) / (teeth * 2);

    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
      const angle3 = ((i + 0.7) / teeth) * Math.PI * 2;
      const angle4 = ((i + 1) / teeth) * Math.PI * 2;

      const r1 = radius - toothDepth;
      const r2 = radius;

      if (i === 0) {
        shape.moveTo(Math.cos(angle1) * r1, Math.sin(angle1) * r1);
      }
      shape.lineTo(Math.cos(angle2) * r2, Math.sin(angle2) * r2);
      shape.lineTo(Math.cos(angle3) * r2, Math.sin(angle3) * r2);
      shape.lineTo(Math.cos(angle4) * r1, Math.sin(angle4) * r1);
    }
    shape.closePath();
    return shape;
  }, [radius, teeth]);

  const extrudeSettings = useMemo(() => ({
    depth: thickness,
    bevelEnabled: false,
  }), [thickness]);

  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <extrudeGeometry args={[gearShape, extrudeSettings]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* 中心轴孔 */}
      <mesh position={[0, 0, thickness / 2]}>
        <cylinderGeometry args={[radius * 0.2, radius * 0.2, thickness + 0.01, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * 法兰盘组件
 */
function Flange({ position, innerRadius, outerRadius, thickness, color, boltCount = 8 }) {
  const boltHoles = useMemo(() => {
    const holes = [];
    const boltRadius = (innerRadius + outerRadius) / 2 + outerRadius * 0.15;
    for (let i = 0; i < boltCount; i++) {
      const angle = (i / boltCount) * Math.PI * 2;
      holes.push({
        x: Math.cos(angle) * boltRadius,
        z: Math.sin(angle) * boltRadius,
      });
    }
    return holes;
  }, [innerRadius, outerRadius, boltCount]);

  return (
    <group position={position}>
      {/* 法兰主体 */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[outerRadius, outerRadius, thickness, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* 中心轴孔 */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[innerRadius, innerRadius, thickness + 0.01, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* 螺栓孔 */}
      {boltHoles.map((hole, i) => (
        <mesh key={i} position={[0, hole.x, hole.z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[outerRadius * 0.08, outerRadius * 0.08, thickness + 0.02, 16]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 齿轮箱壳体组件
 */
function GearboxHousing({ dimensions, color, theme }) {
  const { length, width, height } = dimensions;

  return (
    <group>
      {/* 主壳体 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* 顶部散热片 */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x * length, height / 2 + 0.05, 0]}>
          <boxGeometry args={[length * 0.15, 0.1, width * 0.8]} />
          <meshStandardMaterial color={theme.secondary} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* 底座 */}
      <mesh position={[0, -height / 2 - 0.05, 0]}>
        <boxGeometry args={[length * 1.1, 0.1, width * 1.1]} />
        <meshStandardMaterial color={GEARBOX_COLORS.flange} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* 安装孔 (四角) */}
      {[
        [-length * 0.45, -height / 2 - 0.05, -width * 0.45],
        [-length * 0.45, -height / 2 - 0.05, width * 0.45],
        [length * 0.45, -height / 2 - 0.05, -width * 0.45],
        [length * 0.45, -height / 2 - 0.05, width * 0.45],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 完整齿轮箱3D模型
 */
function GearboxModel({ scale = 1, theme, rotating, gearboxData }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 根据型号计算尺寸
  const dimensions = useMemo(() => {
    const baseLength = gearboxData?.length ? gearboxData.length / 300 : 2;
    const baseWidth = gearboxData?.width ? gearboxData.width / 300 : 1.5;
    const baseHeight = gearboxData?.height ? gearboxData.height / 300 : 1.2;
    return {
      length: baseLength * scale,
      width: baseWidth * scale,
      height: baseHeight * scale,
    };
  }, [gearboxData, scale]);

  // 自动旋转动画
  useFrame((state, delta) => {
    if (rotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const inputShaftRadius = (gearboxData?.inputShaftDia || 80) / 1000 * scale;
  const outputShaftRadius = (gearboxData?.outputShaftDia || 100) / 1000 * scale;

  return (
    <group
      ref={groupRef}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 壳体 */}
      <GearboxHousing
        dimensions={dimensions}
        color={hovered ? theme.accent : GEARBOX_COLORS.housing}
        theme={theme}
      />

      {/* 输入法兰 (左侧) */}
      <Flange
        position={[-dimensions.length / 2 - 0.15, 0.1, 0]}
        innerRadius={inputShaftRadius}
        outerRadius={inputShaftRadius * 2.5}
        thickness={0.12}
        color={GEARBOX_COLORS.flange}
        boltCount={6}
      />

      {/* 输入轴 */}
      <mesh position={[-dimensions.length / 2 - 0.4, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[inputShaftRadius, inputShaftRadius, 0.5, 32]} />
        <meshStandardMaterial color={GEARBOX_COLORS.shaft} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 输出法兰 (右侧) */}
      <Flange
        position={[dimensions.length / 2 + 0.15, -0.15, 0]}
        innerRadius={outputShaftRadius}
        outerRadius={outputShaftRadius * 2.2}
        thickness={0.15}
        color={GEARBOX_COLORS.flange}
        boltCount={8}
      />

      {/* 输出轴 */}
      <mesh position={[dimensions.length / 2 + 0.45, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[outputShaftRadius, outputShaftRadius, 0.6, 32]} />
        <meshStandardMaterial color={GEARBOX_COLORS.shaft} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 内部齿轮 (透视效果) - 仅当悬停时显示 */}
      {hovered && (
        <group>
          <Gear
            position={[-dimensions.length * 0.2, 0.1, 0]}
            radius={0.3}
            thickness={0.15}
            teeth={18}
            color={theme.primary}
          />
          <Gear
            position={[dimensions.length * 0.15, -0.1, 0]}
            radius={0.5}
            thickness={0.2}
            teeth={36}
            color={theme.secondary}
          />
        </group>
      )}

      {/* 油标 */}
      <mesh position={[dimensions.length * 0.3, -dimensions.height * 0.3, dimensions.width / 2 + 0.02]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color={GEARBOX_COLORS.oil} roughness={0.2} metalness={0.3} />
      </mesh>

      {/* 铭牌 */}
      <mesh position={[0, dimensions.height / 2 + 0.06, dimensions.width * 0.3]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial color={theme.primary} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * 3D场景组件
 */
function Scene({ gearboxData, viewAngle, rotating, theme }) {
  const cameraPositions = {
    'iso': [4, 3, 4],
    'front': [0, 0, 5],
    'side': [5, 0, 0],
    'top': [0, 5, 0],
  };

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPositions[viewAngle]}
        fov={45}
      />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
      />

      {/* 光照 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.3} />

      {/* 环境 */}
      <Environment preset="studio" />

      {/* 齿轮箱模型 */}
      <GearboxModel
        scale={1}
        theme={theme}
        rotating={rotating}
        gearboxData={gearboxData}
      />

      {/* 地面网格 */}
      <gridHelper args={[10, 20, '#666', '#444']} position={[0, -1.5, 0]} />
    </>
  );
}

/**
 * 加载中组件
 */
function LoadingFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <Spinner animation="border" variant="primary" />
      <span className="ms-2">加载3D模型...</span>
    </div>
  );
}

/**
 * 齿轮箱3D预览主组件
 */
function Gearbox3DPreview({ gearboxData, className = '' }) {
  const [viewAngle, setViewAngle] = useState('iso');
  const [rotating, setRotating] = useState(true);

  // 确定系列和主题
  const series = useMemo(() => {
    if (!gearboxData?.model) return 'DEFAULT';
    const model = gearboxData.model.toUpperCase();
    if (model.startsWith('HCM')) return 'HCM';
    if (model.startsWith('HCD')) return 'HCD';
    if (model.startsWith('HCQ')) return 'HCQ';
    if (model.startsWith('GW')) return 'GW';
    if (model.startsWith('HC')) return 'HC';
    return 'DEFAULT';
  }, [gearboxData]);

  const theme = SERIES_THEMES[series] || SERIES_THEMES.DEFAULT;

  return (
    <Card className={`gearbox-3d-preview ${className}`}>
      <Card.Header className="d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <i className="bi bi-box me-2"></i>
          <span className="fw-bold">3D预览</span>
          {gearboxData?.model && (
            <Badge bg="primary" className="ms-2">{gearboxData.model}</Badge>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={rotating ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setRotating(!rotating)}
            title={rotating ? '停止旋转' : '开始旋转'}
          >
            <i className={`bi bi-${rotating ? 'pause' : 'play'}`}></i>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0" style={{ height: '350px', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas shadows>
            <Scene
              gearboxData={gearboxData}
              viewAngle={viewAngle}
              rotating={rotating}
              theme={theme}
            />
          </Canvas>
        </Suspense>
      </Card.Body>

      <Card.Footer className="py-2">
        <div className="d-flex justify-content-between align-items-center">
          <ButtonGroup size="sm">
            {[
              { key: 'iso', label: '等轴', icon: 'box' },
              { key: 'front', label: '正视', icon: 'square' },
              { key: 'side', label: '侧视', icon: 'layout-sidebar' },
              { key: 'top', label: '俯视', icon: 'layout-wtf' },
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                variant={viewAngle === key ? 'primary' : 'outline-secondary'}
                onClick={() => setViewAngle(key)}
                title={label}
              >
                <i className={`bi bi-${icon} me-1`}></i>
                {label}
              </Button>
            ))}
          </ButtonGroup>

          <small className="text-muted">
            拖拽旋转 | 滚轮缩放
          </small>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default Gearbox3DPreview;
