/**
 * 轴段刚度编辑器组件
 * 支持直接输入K值或通过直径/长度自动计算
 */
import React, { useCallback, useState } from 'react';
import { Table, Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateShaftStiffness } from '../../utils/torsionalVibration';

const ShaftStiffnessEditor = ({ shafts = [], onChange, colors = {}, theme = 'light' }) => {
  // 每个轴段的输入模式: 'direct' 或 'calculate'
  const [inputModes, setInputModes] = useState(
    shafts.reduce((acc, _, i) => ({ ...acc, [i]: 'direct' }), {})
  );

  // 添加新轴段
  const handleAdd = useCallback(() => {
    const newShaft = {
      name: `轴段${shafts.length + 1}`,
      K: 1e6,
      length: 500,
      diameter: 80
    };
    onChange([...shafts, newShaft]);
    setInputModes(prev => ({ ...prev, [shafts.length]: 'direct' }));
  }, [shafts, onChange]);

  // 删除轴段
  const handleDelete = useCallback((index) => {
    if (shafts.length <= 1) {
      return; // 至少保留1个轴段
    }
    const newShafts = shafts.filter((_, i) => i !== index);
    onChange(newShafts);
    // 重新映射inputModes
    const newModes = {};
    Object.keys(inputModes).forEach(key => {
      const keyNum = parseInt(key);
      if (keyNum < index) newModes[keyNum] = inputModes[key];
      else if (keyNum > index) newModes[keyNum - 1] = inputModes[key];
    });
    setInputModes(newModes);
  }, [shafts, onChange, inputModes]);

  // 更新轴段属性
  const handleUpdate = useCallback((index, field, value) => {
    const newShafts = shafts.map((shaft, i) => {
      if (i === index) {
        const updated = { ...shaft, [field]: field === 'name' ? value : parseFloat(value) || 0 };
        // 如果是计算模式且更新了直径或长度，自动计算K值
        if (inputModes[index] === 'calculate' && (field === 'diameter' || field === 'length')) {
          if (updated.diameter > 0 && updated.length > 0) {
            const result = calculateShaftStiffness({
              diameter: updated.diameter,
              length: updated.length
            });
            updated.K = result.stiffness;
          }
        }
        return updated;
      }
      return shaft;
    });
    onChange(newShafts);
  }, [shafts, onChange, inputModes]);

  // 切换输入模式
  const toggleMode = useCallback((index) => {
    const newMode = inputModes[index] === 'direct' ? 'calculate' : 'direct';
    setInputModes(prev => ({ ...prev, [index]: newMode }));

    // 如果切换到计算模式，立即计算
    if (newMode === 'calculate') {
      const shaft = shafts[index];
      if (shaft.diameter > 0 && shaft.length > 0) {
        const result = calculateShaftStiffness({
          diameter: shaft.diameter,
          length: shaft.length
        });
        handleUpdate(index, 'K', result.stiffness);
      }
    }
  }, [inputModes, shafts, handleUpdate]);

  const tableStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    color: colors.text || (theme === 'dark' ? '#fff' : '#333')
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff',
    color: colors.text || (theme === 'dark' ? '#fff' : '#333'),
    border: `1px solid ${colors.border || '#ced4da'}`
  };

  const formatK = (K) => {
    if (K >= 1e6) return `${(K / 1e6).toFixed(2)}×10⁶`;
    if (K >= 1e3) return `${(K / 1e3).toFixed(2)}×10³`;
    return K.toFixed(2);
  };

  return (
    <div className="shaft-stiffness-editor">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0" style={{ color: colors.headerText || colors.text }}>
          轴段扭转刚度
        </h6>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAdd}
          title="添加轴段"
        >
          <AddIcon fontSize="small" /> 添加
        </Button>
      </div>

      <Table
        bordered
        size="sm"
        className="mb-0"
        style={tableStyle}
      >
        <thead>
          <tr style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
            <th style={{ width: '18%', color: colors.headerText }}>轴段名称</th>
            <th style={{ width: '22%', color: colors.headerText }}>刚度 K (N·m/rad)</th>
            <th style={{ width: '18%', color: colors.headerText }}>直径 (mm)</th>
            <th style={{ width: '18%', color: colors.headerText }}>长度 (mm)</th>
            <th style={{ width: '12%', color: colors.headerText }}>模式</th>
            <th style={{ width: '12%', color: colors.headerText }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {shafts.map((shaft, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  size="sm"
                  value={shaft.name || ''}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td>
                {inputModes[index] === 'direct' ? (
                  <Form.Control
                    type="number"
                    size="sm"
                    step="1e5"
                    min="1e4"
                    value={shaft.K || 0}
                    onChange={(e) => handleUpdate(index, 'K', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    size="sm"
                    value={formatK(shaft.K || 0)}
                    readOnly
                    style={{ ...inputStyle, backgroundColor: theme === 'dark' ? '#4a4a4a' : '#e9ecef' }}
                    title="由直径和长度自动计算"
                  />
                )}
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  step="5"
                  min="10"
                  value={shaft.diameter || 0}
                  onChange={(e) => handleUpdate(index, 'diameter', e.target.value)}
                  style={inputStyle}
                  disabled={inputModes[index] === 'direct'}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  size="sm"
                  step="100"
                  min="10"
                  value={shaft.length || 0}
                  onChange={(e) => handleUpdate(index, 'length', e.target.value)}
                  style={inputStyle}
                  disabled={inputModes[index] === 'direct'}
                />
              </td>
              <td className="text-center">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {inputModes[index] === 'direct'
                        ? '切换到自动计算模式'
                        : '切换到直接输入模式'}
                    </Tooltip>
                  }
                >
                  <Button
                    variant={inputModes[index] === 'calculate' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => toggleMode(index)}
                  >
                    <CalculateIcon fontSize="small" />
                  </Button>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  disabled={shafts.length <= 1}
                  title={shafts.length <= 1 ? '至少需要1个轴段' : '删除'}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <small className="text-muted d-block mt-1">
        提示: 点击计算器图标切换模式，自动计算模式下K = G×Ip/L (G=8.1×10¹⁰Pa)
      </small>
    </div>
  );
};

export default ShaftStiffnessEditor;
