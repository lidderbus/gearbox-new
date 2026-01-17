/**
 * 多单元轴系编辑器组件
 *
 * 用于配置完整的船舶推进轴系参数
 * 支持多分支系统、齿轮啮合、弹性联轴器
 *
 * @module SystemLayoutEditor
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Alert,
  Tabs,
  Tab,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FiPlus,
  FiTrash2,
  FiSettings,
  FiInfo,
  FiCpu,
  FiAnchor,
  FiLink,
  FiDisc
} from 'react-icons/fi';
import { calculateTorsionalFlexibility } from '../../utils/transferMatrixMethod';

// ============================================================
// 单元类型配置
// ============================================================

const UNIT_TYPES = {
  motor: { label: '电动机', icon: FiCpu, color: '#3498db' },
  diesel: { label: '柴油机', icon: FiCpu, color: '#e74c3c' },
  gear: { label: '齿轮', icon: FiSettings, color: '#9b59b6' },
  shaft: { label: '轴段', icon: FiLink, color: '#2ecc71' },
  coupling: { label: '联轴器', icon: FiDisc, color: '#f39c12' },
  propeller: { label: '螺旋桨', icon: FiAnchor, color: '#1abc9c' }
};

const ENGINE_TYPES = [
  { value: 'diesel', label: '柴油机' },
  { value: 'electric', label: '电动机' }
];

const CYLINDER_OPTIONS = [4, 6, 8, 12];
const BLADE_OPTIONS = [3, 4, 5, 6];

// ============================================================
// 主组件
// ============================================================

/**
 * 系统布置编辑器组件
 *
 * @param {Object} props
 * @param {Object} props.systemInput - 系统输入数据
 * @param {Function} props.onChange - 数据变更回调
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.theme - 主题模式
 */
const SystemLayoutEditor = ({
  systemInput,
  onChange,
  colors = {},
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [editingUnit, setEditingUnit] = useState(null);

  // 主题样式
  const cardStyle = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    borderColor: theme === 'dark' ? '#333' : '#dee2e6',
    color: theme === 'dark' ? '#e0e0e0' : '#212529'
  }), [theme]);

  // 更新系统数据
  const updateSystem = useCallback((path, value) => {
    const newInput = { ...systemInput };
    const keys = path.split('.');
    let current = newInput;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onChange(newInput);
  }, [systemInput, onChange]);

  // 添加单元
  const addUnit = useCallback(() => {
    const units = [...(systemInput.units || [])];
    const newNumber = units.length > 0
      ? Math.max(...units.map(u => u.unitNumber)) + 1
      : 1;

    units.push({
      unitNumber: newNumber,
      name: `单元${newNumber}`,
      type: 'shaft',
      speedRatio: 1.0,
      inertia: 0.5,
      torsionalFlexibility: 5000,
      outerDiameter: 60,
      innerDiameter: 0
    });

    onChange({ ...systemInput, units });
  }, [systemInput, onChange]);

  // 删除单元
  const removeUnit = useCallback((unitNumber) => {
    const units = systemInput.units.filter(u => u.unitNumber !== unitNumber);
    onChange({ ...systemInput, units });
  }, [systemInput, onChange]);

  // 更新单元
  const updateUnit = useCallback((unitNumber, field, value) => {
    const units = systemInput.units.map(u => {
      if (u.unitNumber === unitNumber) {
        const updated = { ...u, [field]: value };

        // 自动计算柔度（当更改尺寸时）
        if ((field === 'outerDiameter' || field === 'innerDiameter' || field === 'length')
            && updated.outerDiameter > 0 && updated.length > 0) {
          updated.torsionalFlexibility = calculateTorsionalFlexibility({
            length: updated.length || 500,
            outerDiameter: updated.outerDiameter,
            innerDiameter: updated.innerDiameter || 0
          });
        }

        return updated;
      }
      return u;
    });

    onChange({ ...systemInput, units });
  }, [systemInput, onChange]);

  // 添加齿轮啮合
  const addGearMesh = useCallback(() => {
    const gearMeshes = [...(systemInput.gearMeshes || [])];
    const newLevel = gearMeshes.length + 1;

    gearMeshes.push({
      meshLevel: newLevel,
      drivingUnit: 1,
      drivenUnit: 2,
      ratio: 1.0,
      meshStiffness: 0
    });

    onChange({ ...systemInput, gearMeshes });
  }, [systemInput, onChange]);

  // 删除齿轮啮合
  const removeGearMesh = useCallback((level) => {
    const gearMeshes = systemInput.gearMeshes.filter(g => g.meshLevel !== level);
    onChange({ ...systemInput, gearMeshes });
  }, [systemInput, onChange]);

  // 更新齿轮啮合
  const updateGearMesh = useCallback((level, field, value) => {
    const gearMeshes = systemInput.gearMeshes.map(g => {
      if (g.meshLevel === level) {
        return { ...g, [field]: value };
      }
      return g;
    });

    onChange({ ...systemInput, gearMeshes });
  }, [systemInput, onChange]);

  // 添加弹性联轴器
  const addCoupling = useCallback(() => {
    const couplings = [...(systemInput.elasticCouplings || [])];
    const newId = couplings.length + 1;

    couplings.push({
      couplingId: newId,
      manufacturer: '',
      type: 'Normal',
      unitNumber: 2,
      dampingCoefficient: 1.15,
      continuousAllowableTorque: 1.8,
      transientAllowableTorque: 6.75,
      torsionalStiffness: 277777
    });

    onChange({ ...systemInput, elasticCouplings: couplings });
  }, [systemInput, onChange]);

  // 删除弹性联轴器
  const removeCoupling = useCallback((id) => {
    const couplings = systemInput.elasticCouplings.filter(c => c.couplingId !== id);
    onChange({ ...systemInput, elasticCouplings: couplings });
  }, [systemInput, onChange]);

  // 更新弹性联轴器
  const updateCoupling = useCallback((id, field, value) => {
    const couplings = systemInput.elasticCouplings.map(c => {
      if (c.couplingId === id) {
        return { ...c, [field]: value };
      }
      return c;
    });

    onChange({ ...systemInput, elasticCouplings: couplings });
  }, [systemInput, onChange]);

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Header className="d-flex align-items-center justify-content-between"
        style={{ backgroundColor: colors.primary || '#3b82f6', color: '#fff' }}>
        <div className="d-flex align-items-center">
          <FiSettings className="me-2" />
          <span className="fw-bold">轴系布置数据</span>
        </div>
        <Badge bg="light" text="dark">
          {systemInput?.units?.length || 0} 个单元
        </Badge>
      </Card.Header>

      <Card.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="mb-3"
        >
          {/* 基本参数标签页 */}
          <Tab eventKey="basic" title="基本参数">
            <BasicParametersForm
              systemInput={systemInput}
              updateSystem={updateSystem}
              theme={theme}
            />
          </Tab>

          {/* 单元数据标签页 */}
          <Tab eventKey="units" title="单元数据">
            <UnitsDataTable
              units={systemInput?.units || []}
              addUnit={addUnit}
              removeUnit={removeUnit}
              updateUnit={updateUnit}
              theme={theme}
              colors={colors}
            />
          </Tab>

          {/* 齿轮啮合标签页 */}
          <Tab eventKey="gears" title="齿轮啮合">
            <GearMeshEditor
              gearMeshes={systemInput?.gearMeshes || []}
              units={systemInput?.units || []}
              addGearMesh={addGearMesh}
              removeGearMesh={removeGearMesh}
              updateGearMesh={updateGearMesh}
              theme={theme}
              colors={colors}
            />
          </Tab>

          {/* 弹性联轴器标签页 */}
          <Tab eventKey="couplings" title="弹性联轴器">
            <ElasticCouplingEditor
              couplings={systemInput?.elasticCouplings || []}
              units={systemInput?.units || []}
              addCoupling={addCoupling}
              removeCoupling={removeCoupling}
              updateCoupling={updateCoupling}
              theme={theme}
              colors={colors}
            />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

// ============================================================
// 基本参数表单
// ============================================================

const BasicParametersForm = ({ systemInput, updateSystem, theme }) => {
  // 防御性编程：确保 systemInput 不为 undefined
  const { systemLayout = {}, powerSource = {}, propeller = {}, metadata = {} } = systemInput || {};

  return (
    <div>
      {/* 项目信息 */}
      <h6 className="text-muted mb-3">项目信息</h6>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>控制号</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={metadata.controlNumber || ''}
              onChange={(e) => updateSystem('metadata.controlNumber', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>船名/项目名</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={metadata.projectName || ''}
              onChange={(e) => updateSystem('metadata.projectName', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>设计单位</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={metadata.designOrg || ''}
              onChange={(e) => updateSystem('metadata.designOrg', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>计算者</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={metadata.calculator || ''}
              onChange={(e) => updateSystem('metadata.calculator', e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <hr />

      {/* 系统布置 */}
      <h6 className="text-muted mb-3">系统布置</h6>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>主机类型</Form.Label>
            <Form.Select
              size="sm"
              value={systemLayout.mainEngineType || 'diesel'}
              onChange={(e) => updateSystem('systemLayout.mainEngineType', e.target.value)}
            >
              {ENGINE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>主机数量</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              min={1}
              max={4}
              value={systemLayout.mainEngineCount || 1}
              onChange={(e) => updateSystem('systemLayout.mainEngineCount', parseInt(e.target.value))}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>总分支点数</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              min={0}
              max={4}
              value={systemLayout.totalBranchCount || 0}
              onChange={(e) => updateSystem('systemLayout.totalBranchCount', parseInt(e.target.value))}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>冰区</Form.Label>
            <Form.Select
              size="sm"
              value={systemLayout.iceClass || 'none'}
              onChange={(e) => updateSystem('systemLayout.iceClass', e.target.value)}
            >
              <option value="none">无冰区</option>
              <option value="ic">IC</option>
              <option value="ib">IB</option>
              <option value="ia">IA</option>
              <option value="ias">IA Super</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <hr />

      {/* 动力源参数 */}
      <h6 className="text-muted mb-3">动力源参数</h6>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>制造厂/型号</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              value={powerSource.model || ''}
              onChange={(e) => updateSystem('powerSource.model', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>额定功率 (kW)</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              value={powerSource.ratedPower || 400}
              onChange={(e) => updateSystem('powerSource.ratedPower', parseFloat(e.target.value))}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>额定转速 (rpm)</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              value={powerSource.ratedSpeed || 1500}
              onChange={(e) => updateSystem('powerSource.ratedSpeed', parseFloat(e.target.value))}
            />
          </Form.Group>
        </Col>
        {systemLayout.mainEngineType === 'diesel' && (
          <Col md={2}>
            <Form.Group>
              <Form.Label>气缸数</Form.Label>
              <Form.Select
                size="sm"
                value={powerSource.cylinderCount || 6}
                onChange={(e) => updateSystem('powerSource.cylinderCount', parseInt(e.target.value))}
              >
                {CYLINDER_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}缸</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
        <Col md={3}>
          <Form.Group>
            <Form.Label>所处单元号</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              min={1}
              value={powerSource.unitNumber || 1}
              onChange={(e) => updateSystem('powerSource.unitNumber', parseInt(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <hr />

      {/* 螺旋桨参数 */}
      <h6 className="text-muted mb-3">螺旋桨参数</h6>
      <Row className="mb-3">
        <Col md={2}>
          <Form.Group>
            <Form.Label>类型</Form.Label>
            <Form.Select
              size="sm"
              value={propeller.type || 'fixed_pitch'}
              onChange={(e) => updateSystem('propeller.type', e.target.value)}
            >
              <option value="fixed_pitch">定距桨</option>
              <option value="controllable_pitch">可调桨</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>叶片数</Form.Label>
            <Form.Select
              size="sm"
              value={propeller.bladeCount || 4}
              onChange={(e) => updateSystem('propeller.bladeCount', parseInt(e.target.value))}
            >
              {BLADE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}叶</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>所处单元号</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              min={1}
              value={propeller.unitNumber || 4}
              onChange={(e) => updateSystem('propeller.unitNumber', parseInt(e.target.value))}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>轴抗拉强度 (MPa)</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              value={propeller.shaftTensileStrength || 520}
              onChange={(e) => updateSystem('propeller.shaftTensileStrength', parseFloat(e.target.value))}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>附连水惯量 (kg.m²)</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              step={0.01}
              value={propeller.addedInertia || 0.5}
              onChange={(e) => updateSystem('propeller.addedInertia', parseFloat(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="考虑螺旋桨激励"
            checked={propeller.considerPropellerExcitation !== false}
            onChange={(e) => updateSystem('propeller.considerPropellerExcitation', e.target.checked)}
          />
        </Col>
      </Row>
    </div>
  );
};

// ============================================================
// 单元数据表格
// ============================================================

const UnitsDataTable = ({
  units,
  addUnit,
  removeUnit,
  updateUnit,
  theme,
  colors
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Alert variant="info" className="mb-0 py-2 px-3">
          <FiInfo className="me-2" />
          单元按从动力源到螺旋桨的顺序排列。柔度单位为 ×10⁻¹⁰ rad/N·m
        </Alert>
        <Button
          variant="primary"
          size="sm"
          onClick={addUnit}
          style={{ backgroundColor: colors.primary || '#3b82f6' }}
        >
          <FiPlus className="me-1" /> 添加单元
        </Button>
      </div>

      <Table
        striped
        bordered
        hover
        size="sm"
        responsive
        className={theme === 'dark' ? 'table-dark' : ''}
      >
        <thead>
          <tr>
            <th style={{ width: '60px' }}>单元号</th>
            <th style={{ width: '120px' }}>名称</th>
            <th style={{ width: '100px' }}>类型</th>
            <th style={{ width: '80px' }}>速比</th>
            <th style={{ width: '100px' }}>惯量 (kg.m²)</th>
            <th style={{ width: '120px' }}>柔度 (E-10)</th>
            <th style={{ width: '80px' }}>外径 (mm)</th>
            <th style={{ width: '80px' }}>内径 (mm)</th>
            <th style={{ width: '60px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={unit.unitNumber}>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  value={unit.unitNumber}
                  onChange={(e) => updateUnit(unit.unitNumber, 'unitNumber', parseInt(e.target.value))}
                  style={{ width: '50px' }}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  size="sm"
                  value={unit.name || ''}
                  onChange={(e) => updateUnit(unit.unitNumber, 'name', e.target.value)}
                />
              </td>
              <td>
                <Form.Select
                  size="sm"
                  value={unit.type || 'shaft'}
                  onChange={(e) => updateUnit(unit.unitNumber, 'type', e.target.value)}
                >
                  {Object.entries(UNIT_TYPES).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  step={0.001}
                  value={unit.speedRatio || 1}
                  onChange={(e) => updateUnit(unit.unitNumber, 'speedRatio', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  step={0.0001}
                  value={unit.inertia || 0}
                  onChange={(e) => updateUnit(unit.unitNumber, 'inertia', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  step={0.01}
                  value={unit.torsionalFlexibility?.toFixed(4) || 0}
                  onChange={(e) => updateUnit(unit.unitNumber, 'torsionalFlexibility', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  value={unit.outerDiameter || 0}
                  onChange={(e) => updateUnit(unit.unitNumber, 'outerDiameter', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  value={unit.innerDiameter || 0}
                  onChange={(e) => updateUnit(unit.unitNumber, 'innerDiameter', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeUnit(unit.unitNumber)}
                  disabled={units.length <= 2}
                >
                  <FiTrash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// ============================================================
// 齿轮啮合编辑器
// ============================================================

const GearMeshEditor = ({
  gearMeshes,
  units,
  addGearMesh,
  removeGearMesh,
  updateGearMesh,
  theme,
  colors
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">配置齿轮组各级啮合关系</span>
        <Button
          variant="primary"
          size="sm"
          onClick={addGearMesh}
          style={{ backgroundColor: colors.primary || '#3b82f6' }}
        >
          <FiPlus className="me-1" /> 添加啮合
        </Button>
      </div>

      {gearMeshes.length === 0 ? (
        <Alert variant="secondary">
          暂无齿轮啮合配置。如果轴系包含齿轮箱，请添加啮合数据。
        </Alert>
      ) : (
        <Table
          striped
          bordered
          hover
          size="sm"
          className={theme === 'dark' ? 'table-dark' : ''}
        >
          <thead>
            <tr>
              <th style={{ width: '80px' }}>级数</th>
              <th>主动单元</th>
              <th>从动单元</th>
              <th>传动比</th>
              <th>啮合刚度 (N·m/rad)</th>
              <th style={{ width: '60px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {gearMeshes.map((mesh) => (
              <tr key={mesh.meshLevel}>
                <td>{mesh.meshLevel}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={mesh.drivingUnit}
                    onChange={(e) => updateGearMesh(mesh.meshLevel, 'drivingUnit', parseInt(e.target.value))}
                  >
                    {units.map(u => (
                      <option key={u.unitNumber} value={u.unitNumber}>
                        {u.unitNumber} - {u.name || '未命名'}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={mesh.drivenUnit}
                    onChange={(e) => updateGearMesh(mesh.meshLevel, 'drivenUnit', parseInt(e.target.value))}
                  >
                    {units.map(u => (
                      <option key={u.unitNumber} value={u.unitNumber}>
                        {u.unitNumber} - {u.name || '未命名'}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    size="sm"
                    step={0.001}
                    value={mesh.ratio}
                    onChange={(e) => updateGearMesh(mesh.meshLevel, 'ratio', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <InputGroup size="sm">
                    <Form.Control
                      type="number"
                      value={mesh.meshStiffness || 0}
                      onChange={(e) => updateGearMesh(mesh.meshLevel, 'meshStiffness', parseFloat(e.target.value))}
                    />
                    <InputGroup.Text>0=刚性</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeGearMesh(mesh.meshLevel)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

// ============================================================
// 弹性联轴器编辑器
// ============================================================

const ElasticCouplingEditor = ({
  couplings,
  units,
  addCoupling,
  removeCoupling,
  updateCoupling,
  theme,
  colors
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">配置弹性联轴器参数（如HGTHT、VULKAN等）</span>
        <Button
          variant="primary"
          size="sm"
          onClick={addCoupling}
          style={{ backgroundColor: colors.primary || '#3b82f6' }}
        >
          <FiPlus className="me-1" /> 添加联轴器
        </Button>
      </div>

      {couplings.length === 0 ? (
        <Alert variant="secondary">
          暂无弹性联轴器配置。高弹联轴器对扭振特性有重要影响，建议添加。
        </Alert>
      ) : (
        couplings.map((coupling) => (
          <Card key={coupling.couplingId} className="mb-2">
            <Card.Header className="py-2 d-flex justify-content-between align-items-center">
              <span>联轴器 #{coupling.couplingId}</span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeCoupling(coupling.couplingId)}
              >
                <FiTrash2 />
              </Button>
            </Card.Header>
            <Card.Body className="py-2">
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">制造厂/型号</Form.Label>
                    <Form.Control
                      type="text"
                      size="sm"
                      value={coupling.manufacturer || ''}
                      onChange={(e) => updateCoupling(coupling.couplingId, 'manufacturer', e.target.value)}
                      placeholder="如: HGTHT4.5/14"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">所处单元</Form.Label>
                    <Form.Select
                      size="sm"
                      value={coupling.unitNumber}
                      onChange={(e) => updateCoupling(coupling.couplingId, 'unitNumber', parseInt(e.target.value))}
                    >
                      {units.map(u => (
                        <option key={u.unitNumber} value={u.unitNumber}>
                          {u.unitNumber}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">阻尼系数</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      step={0.01}
                      value={coupling.dampingCoefficient || 1.15}
                      onChange={(e) => updateCoupling(coupling.couplingId, 'dampingCoefficient', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">持续许用 (kN·m)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      step={0.1}
                      value={coupling.continuousAllowableTorque || 1.8}
                      onChange={(e) => updateCoupling(coupling.couplingId, 'continuousAllowableTorque', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">瞬时许用 (kN·m)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      step={0.1}
                      value={coupling.transientAllowableTorque || 6.75}
                      onChange={(e) => updateCoupling(coupling.couplingId, 'transientAllowableTorque', parseFloat(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default SystemLayoutEditor;
