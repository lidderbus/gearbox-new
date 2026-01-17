/**
 * 高弹联轴器选型 - 3D预览组件
 * 使用 Three.js (@react-three/fiber + @react-three/drei)
 * 展示联轴器3D模型，支持旋转、缩放、不同视角
 */
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Html } from '@react-three/drei';
import { Card, ButtonGroup, Button, Badge, Spinner } from 'react-bootstrap';
import * as THREE from 'three';

// 联轴器颜色配置
const COUPLING_COLORS = {
  metal: '#8B8B8B',      // 金属灰
  rubber: '#2C2C2C',     // 橡胶黑
  highlight: '#FF6B35',  // 高亮橙
  shaft: '#A0A0A0',      // 轴银色
  flange: '#707070',     // 法兰深灰
};

// 系列对应的颜色主题
const SERIES_THEMES = {
  'HGTQ': { primary: '#1890ff', secondary: '#40a9ff', accent: '#69c0ff' },
  'HGT': { primary: '#52c41a', secondary: '#73d13d', accent: '#95de64' },
  'HGTHB': { primary: '#722ed1', secondary: '#9254de', accent: '#b37feb' },
  'HGTHJB': { primary: '#eb2f96', secondary: '#f759ab', accent: '#ff85c0' },
  'DEFAULT': { primary: '#1890ff', secondary: '#40a9ff', accent: '#69c0ff' },
};

/**
 * 弹性体齿块组件 - 联轴器的核心减震部件
 */
function ElasticElement({ position, rotation, size, color }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[size.width, size.height, size.depth]} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

/**
 * 法兰盘组件
 */
function Flange({ position, innerRadius, outerRadius, thickness, color, boltCount = 6 }) {
  const boltHoles = useMemo(() => {
    const holes = [];
    const boltRadius = (innerRadius + outerRadius) / 2;
    for (let i = 0; i < boltCount; i++) {
      const angle = (i / boltCount) * Math.PI * 2;
      holes.push({
        x: Math.cos(angle) * boltRadius,
        y: Math.sin(angle) * boltRadius,
      });
    }
    return holes;
  }, [innerRadius, outerRadius, boltCount]);

  return (
    <group position={position}>
      {/* 法兰主体 */}
      <mesh>
        <cylinderGeometry args={[outerRadius, outerRadius, thickness, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* 中心孔 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[innerRadius, innerRadius, thickness + 0.01, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* 螺栓孔 */}
      {boltHoles.map((hole, i) => (
        <mesh key={i} position={[hole.x, 0, hole.y]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, thickness + 0.02, 16]} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * HGTQ系列高弹联轴器3D模型
 * 特点: 高扭矩齿式弹性联轴器，带橡胶弹性体
 */
function HGTQCoupling({ scale = 1, theme, rotating, torqueRatio = 0.5 }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 自动旋转动画
  useFrame((state, delta) => {
    if (rotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // 根据扭矩比例调整弹性体变形（视觉效果）
  const elasticDeform = 1 + torqueRatio * 0.05;

  return (
    <group ref={groupRef} scale={scale}>
      {/* 输入端法兰 */}
      <Flange
        position={[-0.8, 0, 0]}
        innerRadius={0.3}
        outerRadius={0.9}
        thickness={0.15}
        color={theme.primary}
        boltCount={8}
      />

      {/* 输入端连接套筒 */}
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.5, 0.35, 32]} />
        <meshStandardMaterial color={COUPLING_COLORS.metal} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 弹性体环 - 核心减震部件 */}
      <group position={[0, 0, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 0.55;
          return (
            <ElasticElement
              key={i}
              position={[
                0,
                Math.sin(angle) * radius,
                Math.cos(angle) * radius
              ]}
              rotation={[angle, 0, 0]}
              size={{ width: 0.5 * elasticDeform, height: 0.15, depth: 0.2 }}
              color={hovered ? theme.accent : COUPLING_COLORS.rubber}
            />
          );
        })}

        {/* 弹性体外环 */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.55, 0.08, 16, 32]} />
          <meshStandardMaterial
            color={COUPLING_COLORS.rubber}
            roughness={0.9}
            metalness={0.05}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* 输出端连接套筒 */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.45, 0.35, 32]} />
        <meshStandardMaterial color={COUPLING_COLORS.metal} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 输出端法兰 */}
      <Flange
        position={[0.8, 0, 0]}
        innerRadius={0.3}
        outerRadius={0.9}
        thickness={0.15}
        color={theme.secondary}
        boltCount={8}
      />

      {/* 交互高亮效果 */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color={theme.accent} transparent opacity={0.1} />
        </mesh>
      )}

      {/* 不可见的交互检测区域 */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

/**
 * 尺寸标注线组件
 */
function DimensionLine({ start, end, label, offset = 0.3 }) {
  const midPoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + offset,
    (start[2] + end[2]) / 2
  ];

  return (
    <group>
      {/* 标注线 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([...start, ...end])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" linewidth={1} />
      </line>

      {/* 尺寸文字 */}
      <Html position={midPoint} center>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '10px',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

/**
 * 3D场景组件
 */
function Scene({ coupling, rotating, showDimensions, viewMode }) {
  const series = coupling?.model?.match(/^(HGTQ|HGT|HGTHB|HGTHJB)/)?.[1] || 'DEFAULT';
  const theme = SERIES_THEMES[series] || SERIES_THEMES.DEFAULT;

  // 根据联轴器扭矩计算显示比例
  const torqueRatio = coupling?.maxTorque
    ? Math.min(coupling.maxTorque / 100, 1)
    : 0.5;

  // 根据外径计算缩放
  const scale = coupling?.outerDiameter
    ? Math.max(0.5, Math.min(1.5, 300 / coupling.outerDiameter))
    : 1;

  // 相机位置根据视角模式调整
  const cameraPosition = useMemo(() => {
    switch (viewMode) {
      case 'front': return [0, 0, 4];
      case 'side': return [4, 0, 0];
      case 'top': return [0, 4, 0];
      case 'iso':
      default: return [3, 2, 3];
    }
  }, [viewMode]);

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={rotating}
        autoRotateSpeed={1}
      />

      {/* 环境光照 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.4} />

      {/* 联轴器模型 */}
      <HGTQCoupling
        scale={scale}
        theme={theme}
        rotating={rotating}
        torqueRatio={torqueRatio}
      />

      {/* 尺寸标注 */}
      {showDimensions && coupling && (
        <group>
          <DimensionLine
            start={[-1, -1.2, 0]}
            end={[1, -1.2, 0]}
            label={`L: ${coupling.length || 240}mm`}
            offset={-0.3}
          />
          <DimensionLine
            start={[1.2, -0.9, 0]}
            end={[1.2, 0.9, 0]}
            label={`Φ: ${coupling.outerDiameter || 320}mm`}
            offset={0.3}
          />
        </group>
      )}

      {/* 地面网格 */}
      <gridHelper args={[10, 20, '#444', '#333']} position={[0, -1.5, 0]} />

      {/* 环境贴图 */}
      <Environment preset="studio" />
    </>
  );
}

/**
 * 加载占位组件
 */
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-center">
        <Spinner animation="border" variant="primary" size="sm" />
        <div className="mt-2 small text-muted">加载3D模型...</div>
      </div>
    </Html>
  );
}

/**
 * 主组件 - 3D联轴器预览
 */
export default function Coupling3DPreview({ coupling, colors }) {
  const [rotating, setRotating] = useState(true);
  const [showDimensions, setShowDimensions] = useState(false);
  const [viewMode, setViewMode] = useState('iso');

  if (!coupling) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
          <div className="text-center text-muted">
            <i className="bi bi-box fs-1 mb-2 d-block"></i>
            <p>选择联轴器后显示3D预览</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-2">
        <div>
          <i className="bi bi-box me-2 text-primary"></i>
          <strong>3D预览</strong>
          <Badge bg="info" className="ms-2">{coupling.model}</Badge>
        </div>
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant={rotating ? 'primary' : 'outline-secondary'}
            onClick={() => setRotating(!rotating)}
            title={rotating ? '停止旋转' : '自动旋转'}
          >
            <i className={`bi bi-${rotating ? 'pause' : 'play'}`}></i>
          </Button>
          <Button
            size="sm"
            variant={showDimensions ? 'primary' : 'outline-secondary'}
            onClick={() => setShowDimensions(!showDimensions)}
            title="显示尺寸标注"
          >
            <i className="bi bi-rulers"></i>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0" style={{ height: 350 }}>
        <Canvas shadows dpr={[1, 2]} style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Scene
              coupling={coupling}
              rotating={rotating}
              showDimensions={showDimensions}
              viewMode={viewMode}
            />
          </Suspense>
        </Canvas>
      </Card.Body>

      <Card.Footer className="bg-white py-2">
        <div className="d-flex justify-content-between align-items-center">
          <ButtonGroup size="sm">
            {[
              { key: 'iso', icon: 'grid-3x3', label: '等轴' },
              { key: 'front', icon: 'square', label: '正视' },
              { key: 'side', icon: 'layout-sidebar', label: '侧视' },
              { key: 'top', icon: 'layout-wtf', label: '俯视' },
            ].map(view => (
              <Button
                key={view.key}
                variant={viewMode === view.key ? 'primary' : 'outline-secondary'}
                onClick={() => setViewMode(view.key)}
                title={view.label}
              >
                <i className={`bi bi-${view.icon}`}></i>
              </Button>
            ))}
          </ButtonGroup>

          <small className="text-muted">
            <i className="bi bi-mouse me-1"></i>
            拖拽旋转 | 滚轮缩放
          </small>
        </div>
      </Card.Footer>
    </Card>
  );
}
