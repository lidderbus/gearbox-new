// src/components/DataQuery.js - 完整修改版本
import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';

/**
 * 数据查询组件
 * 用于查询数据库中的齿轮箱、联轴器、备用泵等数据
 */
const DataQuery = ({ appData, theme, colors }) => {
  const [dataType, setDataType] = useState('hcGearboxes');
  const [searchField, setSearchField] = useState('model');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const dataTypeOptions = [
    { value: 'hcGearboxes', label: 'HC系列齿轮箱' },
    { value: 'gwGearboxes', label: 'GW系列齿轮箱' },
    { value: 'hcmGearboxes', label: 'HCM系列齿轮箱' },
    { value: 'dtGearboxes', label: 'DT系列齿轮箱' },
    { value: 'hcqGearboxes', label: 'HCQ系列齿轮箱' },
    { value: 'gcGearboxes', label: 'GC系列齿轮箱' },
    { value: 'flexibleCouplings', label: '高弹性联轴器' },
    { value: 'standbyPumps', label: '备用泵' }
  ];

  const searchFieldOptions = [
    { value: 'model', label: '型号' },
    { value: 'power', label: '功率 (kW)' },
    { value: 'ratio', label: '减速比' },
    { value: 'thrust', label: '推力 (kN)' },
    { value: 'torque', label: '扭矩 (kN·m)' }
  ];

  // 格式化输入转速范围，确保使用横杠分隔
  const formatInputSpeedRange = (range) => {
    if (!range) return '-';
    
    if (Array.isArray(range) && range.length === 2) {
      return `${range[0]}-${range[1]}`;
    }
    
    if (typeof range === 'string') {
      // 检查是否是纯数字字符串，需要添加横杠
      if (/^\d+$/.test(range)) {
        // 假设前一半是最小值，后一半是最大值
        const mid = Math.floor(range.length / 2);
        return `${range.substring(0, mid)}-${range.substring(mid)}`;
      }
      return range;
    }
    
    return String(range);
  };

  // 执行搜索
  const handleSearch = () => {
    if (!appData || !Array.isArray(appData[dataType])) {
      setSearchResults([]);
      return;
    }

    let results = [...appData[dataType]];

    // 应用关键词过滤
    if (searchKeyword.trim() !== '') {
      results = results.filter(item => {
        // 确保项目有效
        if (!item) return false;

        // 通用匹配逻辑
        const matchField = (fieldName) => {
          const fieldValue = item[fieldName];
          if (fieldValue === undefined || fieldValue === null) return false;

          // 对于数组类型字段（例如减速比数组），检查每个元素
          if (Array.isArray(fieldValue)) {
            return fieldValue.some(value => 
              String(value).toLowerCase().includes(searchKeyword.toLowerCase())
            );
          }
          
          // 对于非数组类型，直接检查字符串匹配
          return String(fieldValue).toLowerCase().includes(searchKeyword.toLowerCase());
        };

        // 根据搜索字段执行相应的匹配
        switch (searchField) {
          case 'model':
            return matchField('model');
          case 'power':
            return matchField('power') || matchField('maxPower');
          case 'ratio':
            return matchField('ratio') || 
                   matchField('ratios') || 
                   (item.speedRatios && String(item.speedRatios).toLowerCase().includes(searchKeyword.toLowerCase()));
          case 'thrust':
            return matchField('maxThrust') || matchField('thrust');
          case 'torque':
            return matchField('torque') || matchField('maxTorque');
          default:
            return matchField('model');
        }
      });
    }

    // 默认按型号排序
    results.sort((a, b) => {
      if (!a.model) return 1;
      if (!b.model) return -1;
      return a.model.localeCompare(b.model);
    });

    setSearchResults(results);
  };

  // 清空搜索
  const handleReset = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setSelectedItem(null);
  };

  // 查看详情
  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  // 处理减速比和传递能力的数据转换 - 确保一一对应
  const processRatioAndPowerData = (item) => {
    if (!item) return [];

    // 获取减速比数据
    let ratios = [];
    if (Array.isArray(item.ratios)) {
      ratios = [...item.ratios];
    } else if (typeof item.ratio === 'number') {
      ratios = [item.ratio];
    } else if (item.speedRatios) {
      // 处理特殊格式的减速比数据
      const ratioStr = String(item.speedRatios);
      ratios = ratioStr.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
    }

    // 获取传递能力数据
    let powers = [];
    if (Array.isArray(item.transferCapacity)) {
      powers = [...item.transferCapacity];
    } else if (typeof item.transferCapacity === 'number') {
      powers = [item.transferCapacity];
    } else if (item.powerCapacities && Array.isArray(item.powerCapacities)) {
      powers = [...item.powerCapacities];
    } else if (typeof item.kw === 'string' && item.kw.includes(',')) {
      powers = item.kw.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    } else if (item.transmissionCapacity && Array.isArray(item.transmissionCapacity)) {
      powers = [...item.transmissionCapacity];
    } else if (item.power) {
      powers = [item.power];
    }

    // 创建配对结果 - 确保一行一对应
    const result = [];
    
    // 确保减速比和传递能力列表长度一致，采用最长的列表作为基准
    const maxLength = Math.max(ratios.length, powers.length);
    
    // 如果只有一个传递能力值，但有多个减速比，复制传递能力值以匹配减速比数量
    if (powers.length === 1 && ratios.length > 1) {
      const singlePower = powers[0];
      powers = new Array(ratios.length).fill(singlePower);
    }
    
    // 如果只有一个减速比，但有多个传递能力值，复制减速比值以匹配传递能力数量
    if (ratios.length === 1 && powers.length > 1) {
      const singleRatio = ratios[0];
      ratios = new Array(powers.length).fill(singleRatio);
    }
    
    // 创建一行一对应的数据
    for (let i = 0; i < maxLength; i++) {
      result.push({
        ratio: i < ratios.length ? ratios[i] : null,
        power: i < powers.length ? powers[i] : null
      });
    }

    return result;
  };

  useEffect(() => {
    // 当数据类型变更时重置搜索结果
    setSearchResults([]);
    setSelectedItem(null);
  }, [dataType]);

  const getTableHeaders = () => {
    if (dataType.includes('Gearboxes')) {
      return ['型号', '减速比', '传递能力 (kW/r·min)', '输入转速范围 (r/min)', '推力 (kN)', '中心距 (mm)', '重量 (kg)', '价格 (元)', '操作'];
    } else if (dataType === 'flexibleCouplings') {
      return ['型号', '扭矩 (kN·m)', '最大转速 (r/min)', '重量 (kg)', '价格 (元)', '操作'];
    } else if (dataType === 'standbyPumps') {
      return ['型号', '流量 (L/min)', '压力 (MPa)', '功率 (kW)', '重量 (kg)', '价格 (元)', '操作'];
    }
    return [];
  };

  return (
    <div>
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
          <i className="bi bi-search me-2"></i>数据查询
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>数据类别</Form.Label>
                <Form.Select 
                  value={dataType} 
                  onChange={(e) => setDataType(e.target.value)}
                  style={{ backgroundColor: colors?.inputBg, color: colors?.text, borderColor: colors?.inputBorder }}
                >
                  {dataTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>搜索字段</Form.Label>
                <Form.Select 
                  value={searchField} 
                  onChange={(e) => setSearchField(e.target.value)}
                  style={{ backgroundColor: colors?.inputBg, color: colors?.text, borderColor: colors?.inputBorder }}
                >
                  {searchFieldOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>搜索关键词</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="输入关键词"
                    style={{ backgroundColor: colors?.inputBg, color: colors?.text, borderColor: colors?.inputBorder }}
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    style={{ backgroundColor: colors?.primary, borderColor: colors?.primary }}
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleReset}
                    style={{ borderColor: colors?.inputBorder, color: colors?.text }}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {searchResults.length > 0 ? (
            <div className="mt-4">
              <h6 style={{ color: colors?.headerText }}>查询结果 ({searchResults.length})</h6>
              <div className="table-responsive">
                <Table bordered hover size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                  <thead style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                    <tr>
                      {getTableHeaders().map((header, index) => (
                        <th key={index} className="text-center">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.flatMap((item, index) => {
                      // 处理减速比和传递能力数据，确保一行一对应
                      const ratioAndPowerData = processRatioAndPowerData(item);
                      
                      if (ratioAndPowerData.length === 0) {
                        // 如果没有减速比和传递能力数据，仍创建一行
                        return (
                          <tr key={`${index}-0`}>
                            <td>{item.model || '-'}</td>
                            <td>-</td>
                            <td>-</td>
                            {dataType.includes('Gearboxes') && (
                              <>
                                <td>{formatInputSpeedRange(item.inputSpeedRange) || '-'}</td>
                                <td>{item.maxThrust || item.thrust || '-'}</td>
                                <td>{item.centerDistance || '-'}</td>
                                <td>{item.weight || '-'}</td>
                                <td>{item.price || item.marketPrice || '-'}</td>
                              </>
                            )}
                            {dataType === 'flexibleCouplings' && (
                              <>
                                <td>{item.torque || item.maxTorque || '-'}</td>
                                <td>{item.maxSpeed || '-'}</td>
                                <td>{item.weight || '-'}</td>
                                <td>{item.price || item.marketPrice || '-'}</td>
                              </>
                            )}
                            {dataType === 'standbyPumps' && (
                              <>
                                <td>{item.flow || '-'}</td>
                                <td>{item.pressure || '-'}</td>
                                <td>{item.power || '-'}</td>
                                <td>{item.weight || '-'}</td>
                                <td>{item.price || item.marketPrice || '-'}</td>
                              </>
                            )}
                            <td className="text-center">
                              <Button 
                                variant="outline-info" 
                                size="sm" 
                                onClick={() => handleViewDetails(item)}
                                title="查看详情"
                              >
                                <i className="bi bi-info-circle"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      }

                      // 为每一对减速比和传递能力创建一行
                      return ratioAndPowerData.map((pair, pairIndex) => {
                        if (pairIndex === 0) {
                          // 第一行包含型号和所有其他列
                          return (
                            <tr key={`${index}-${pairIndex}`}>
                              <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.model || '-'}</td>
                              <td className="text-center">{pair.ratio?.toFixed(2) || '-'}</td>
                              <td className="text-center">{pair.power || '-'}</td>
                              {dataType.includes('Gearboxes') && (
                                <>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{formatInputSpeedRange(item.inputSpeedRange) || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.maxThrust || item.thrust || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.centerDistance || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.weight || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.price || item.marketPrice || '-'}</td>
                                </>
                              )}
                              {dataType === 'flexibleCouplings' && (
                                <>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.torque || item.maxTorque || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.maxSpeed || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.weight || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.price || item.marketPrice || '-'}</td>
                                </>
                              )}
                              {dataType === 'standbyPumps' && (
                                <>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.flow || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.pressure || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.power || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.weight || '-'}</td>
                                  <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">{item.price || item.marketPrice || '-'}</td>
                                </>
                              )}
                              <td rowSpan={ratioAndPowerData.length} className="align-middle text-center">
                                <Button 
                                  variant="outline-info" 
                                  size="sm" 
                                  onClick={() => handleViewDetails(item)}
                                  title="查看详情"
                                >
                                  <i className="bi bi-info-circle"></i>
                                </Button>
                              </td>
                            </tr>
                          );
                        } else {
                          // 后续行只包含减速比和传递能力列
                          return (
                            <tr key={`${index}-${pairIndex}`}>
                              <td className="text-center">{pair.ratio?.toFixed(2) || '-'}</td>
                              <td className="text-center">{pair.power || '-'}</td>
                            </tr>
                          );
                        }
                      });
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            searchKeyword.trim() !== '' && (
              <Alert variant="info" style={{ backgroundColor: theme === 'dark' ? '#1e3a5a' : '#e0f0ff', color: colors?.text, borderColor: colors?.border }}>
                <i className="bi bi-info-circle me-2"></i>
                没有找到匹配的数据，请尝试其他关键词
              </Alert>
            )
          )}
        </Card.Body>
      </Card>

      {/* 详情显示 */}
      {selectedItem && (
        <Card className="mt-4 shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-info-circle me-2"></i>
                详细信息 - {selectedItem.model}
              </span>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setSelectedItem(null)}
                style={{ borderColor: colors?.inputBorder, color: colors?.text }}
              >
                <i className="bi bi-x"></i>
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 style={{ color: colors?.headerText }}>基本信息</h6>
                <Table bordered size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                  <tbody>
                    <tr>
                      <td width="30%" style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>型号</td>
                      <td>{selectedItem.model || '-'}</td>
                    </tr>
                    {dataType.includes('Gearboxes') && (
                      <>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>输入转速范围</td>
                          <td>{formatInputSpeedRange(selectedItem.inputSpeedRange) || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>中心距 (mm)</td>
                          <td>{selectedItem.centerDistance || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>最大推力 (kN)</td>
                          <td>{selectedItem.maxThrust || selectedItem.thrust || '-'}</td>
                        </tr>
                      </>
                    )}
                    {dataType === 'flexibleCouplings' && (
                      <>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>额定扭矩 (kN·m)</td>
                          <td>{selectedItem.torque || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>最大扭矩 (kN·m)</td>
                          <td>{selectedItem.maxTorque || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>最高转速 (r/min)</td>
                          <td>{selectedItem.maxSpeed || '-'}</td>
                        </tr>
                      </>
                    )}
                    {dataType === 'standbyPumps' && (
                      <>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>流量 (L/min)</td>
                          <td>{selectedItem.flow || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>压力 (MPa)</td>
                          <td>{selectedItem.pressure || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>功率 (kW)</td>
                          <td>{selectedItem.power || '-'}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>重量 (kg)</td>
                      <td>{selectedItem.weight || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6 style={{ color: colors?.headerText }}>价格信息</h6>
                <Table bordered size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                  <tbody>
                    <tr>
                      <td width="30%" style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>基础价格</td>
                      <td>{selectedItem.basePrice || selectedItem.price || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>折扣率</td>
                      <td>{selectedItem.discountRate ? (selectedItem.discountRate * 100).toFixed(2) + '%' : '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>工厂价</td>
                      <td>{selectedItem.factoryPrice || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>市场价</td>
                      <td>{selectedItem.marketPrice || '-'}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>备注</td>
                      <td>{selectedItem.notes || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            {/* 减速比和传递能力详情表格 - 一一对应显示 */}
            {dataType.includes('Gearboxes') && (
              <Row className="mt-3">
                <Col md={12}>
                  <h6 style={{ color: colors?.headerText }}>减速比和传递能力详情</h6>
                  <Table bordered size="sm" style={{ color: colors?.text, borderColor: colors?.border }}>
                    <thead style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                      <tr>
                        <th width="50%" className="text-center">减速比</th>
                        <th width="50%" className="text-center">传递能力 (kW/r·min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processRatioAndPowerData(selectedItem).map((pair, index) => (
                        <tr key={index}>
                          <td className="text-center">{pair.ratio?.toFixed(2) || '-'}</td>
                          <td className="text-center">{pair.power || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}

            {/* 其他技术参数 */}
            {selectedItem.dimensions && (
              <Row className="mt-3">
                <Col md={12}>
                  <h6 style={{ color: colors?.headerText }}>尺寸参数</h6>
                  <p style={{ color: colors?.text }}>{selectedItem.dimensions}</p>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default DataQuery;