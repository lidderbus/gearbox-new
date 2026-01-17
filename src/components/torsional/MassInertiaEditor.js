/**
 * 集中质量惯量编辑器组件
 * 用于编辑扭振系统中的质量惯量参数
 */
import React, { useCallback } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const MassInertiaEditor = ({ masses = [], onChange, colors = {}, theme = 'light' }) => {
  // 添加新质量
  const handleAdd = useCallback(() => {
    const newMass = {
      name: `质量${masses.length + 1}`,
      J: 1.0,
      position: masses.length > 0 ? (masses[masses.length - 1]?.position || 0) + 500 : 0
    };
    onChange([...masses, newMass]);
  }, [masses, onChange]);

  // 删除质量
  const handleDelete = useCallback((index) => {
    if (masses.length <= 2) {
      return; // 至少保留2个质量
    }
    const newMasses = masses.filter((_, i) => i !== index);
    onChange(newMasses);
  }, [masses, onChange]);

  // 更新质量属性
  const handleUpdate = useCallback((index, field, value) => {
    const newMasses = masses.map((mass, i) => {
      if (i === index) {
        return { ...mass, [field]: field === 'name' ? value : parseFloat(value) || 0 };
      }
      return mass;
    });
    onChange(newMasses);
  }, [masses, onChange]);

  const tableStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    color: colors.text || (theme === 'dark' ? '#fff' : '#333')
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff',
    color: colors.text || (theme === 'dark' ? '#fff' : '#333'),
    border: `1px solid ${colors.border || '#ced4da'}`
  };

  return (
    <div className="mass-inertia-editor">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0" style={{ color: colors.headerText || colors.text }}>
          集中质量惯量
        </h6>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAdd}
          title="添加质量"
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
            <th style={{ width: '30%', color: colors.headerText }}>部件名称</th>
            <th style={{ width: '25%', color: colors.headerText }}>惯量 J (kg·m²)</th>
            <th style={{ width: '25%', color: colors.headerText }}>位置 (mm)</th>
            <th style={{ width: '20%', color: colors.headerText }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {masses.map((mass, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  size="sm"
                  value={mass.name || ''}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td>
                <InputGroup size="sm">
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0.01"
                    value={mass.J || 0}
                    onChange={(e) => handleUpdate(index, 'J', e.target.value)}
                    style={inputStyle}
                  />
                </InputGroup>
              </td>
              <td>
                <InputGroup size="sm">
                  <Form.Control
                    type="number"
                    step="100"
                    min="0"
                    value={mass.position || 0}
                    onChange={(e) => handleUpdate(index, 'position', e.target.value)}
                    style={inputStyle}
                  />
                </InputGroup>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  disabled={masses.length <= 2}
                  title={masses.length <= 2 ? '至少需要2个质量' : '删除'}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <small className="text-muted d-block mt-1">
        提示: 飞轮位置通常为0mm，螺旋桨位置取决于轴系长度
      </small>
    </div>
  );
};

export default MassInertiaEditor;
