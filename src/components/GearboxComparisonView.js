// components/GearboxComparisonView.js
import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

/**
 * Component for comparing multiple gearbox options
 * @param {Object} props - Component props
 * @param {Array} props.recommendations - Array of recommended gearboxes
 * @param {number} props.selectedIndex - Index of the currently selected gearbox
 * @param {Function} props.onSelect - Function to handle selection of a gearbox
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} Gearbox comparison component
 */
const GearboxComparisonView = ({ 
  recommendations = [], 
  selectedIndex = 0, 
  onSelect,
  theme = 'light',
  colors = {}
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          齿轮箱比较
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>没有可用的齿轮箱数据</p>
        </Card.Body>
      </Card>
    );
  }

  // Get capacity margin status text and color
  const getCapacityMarginStatus = (margin) => {
    if (margin <= 5) {
      return { text: '偏小', color: theme === 'light' ? 'warning' : 'warning' };
    } else if (margin > 5 && margin <= 15) {
      return { text: '合适', color: theme === 'light' ? 'success' : 'info' };
    } else if (margin > 15 && margin <= 30) {
      return { text: '良好', color: theme === 'light' ? 'primary' : 'primary' };
    } else {
      return { text: '过大', color: theme === 'light' ? 'danger' : 'danger' };
    }
  };

  // Helper function for safely handling nested values or array values
  const safeNumberFormat = (value, decimals = 2) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(decimals);
    }
    if (Array.isArray(value) && value.length > 0) {
      const firstValue = value[0];
      if (typeof firstValue === 'number' && !isNaN(firstValue)) {
        return firstValue.toFixed(decimals);
      }
    }
    return '-';
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        齿轮箱比较 ({recommendations.length} 个候选)
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <Table hover bordered responsive style={{ marginBottom: 0, color: colors.text }}>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>选择</th>
                <th>型号</th>
                <th>减速比</th>
                <th>传递能力</th>
                <th>传递能力余量</th>
                <th>推力 (kN)</th>
                <th>重量 (kg)</th>
                <th>尺寸 (mm)</th>
                <th style={{ width: '100px', textAlign: 'center' }}>匹配度</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((gearbox, index) => {
                // Get capacity margin status
                const marginStatus = getCapacityMarginStatus(gearbox.capacityMargin);
                
                return (
                  <tr
                    key={`${gearbox.model}-${index}`}
                    onClick={() => onSelect(index)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: index === selectedIndex ? 
                        (theme === 'light' ? '#e8f5e9' : '#1a365d') : 
                        'transparent'
                    }}
                  >
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <input
                        type="radio"
                        checked={index === selectedIndex}
                        onChange={() => onSelect(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td>{gearbox.model}</td>
                    <td>{gearbox.ratio?.toFixed(2) || '-'}</td>
                    <td>
                      {Array.isArray(gearbox.transferCapacity) && gearbox.ratios?.indexOf(gearbox.ratio) >= 0 ? 
                        safeNumberFormat(gearbox.transferCapacity[gearbox.ratios.indexOf(gearbox.ratio)], 4) : 
                        safeNumberFormat(gearbox.transferCapacity, 4)
                      }
                    </td>
                    <td>
                      {safeNumberFormat(gearbox.capacityMargin, 2)}%
                    </td>
                    <td>{gearbox.thrust || '-'}</td>
                    <td>{gearbox.weight || '-'}</td>
                    <td>{gearbox.dimensions || '-'}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <Badge 
                        bg={marginStatus.color}
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '0.35em 0.65em',
                          fontWeight: 'normal'
                        }}
                      >
                        {marginStatus.text}
                      </Badge>
                      {gearbox.score && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: colors.muted }}>
                          得分: {gearbox.score}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GearboxComparisonView;