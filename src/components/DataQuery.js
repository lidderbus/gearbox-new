// components/DataQuery.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Row, Col, InputGroup, Badge, Accordion } from 'react-bootstrap';

/**
 * Component for querying and displaying gearbox and related data
 * @param {Object} props - Component props
 * @param {Object} props.appData - Application data containing all gearbox, coupling, and pump data
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} Data query component
 */
const DataQuery = ({ appData = {}, colors = {} }) => {
  // State for search parameters
  const [category, setCategory] = useState('hcGearboxes');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('model');
  const [sortField, setSortField] = useState('model');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchRange, setSearchRange] = useState({
    minPower: '',
    maxPower: '',
    minRatio: '',
    maxRatio: '',
    minThrust: '',
    maxThrust: '',
  });
  
  // State for displaying results
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState('请输入搜索条件');
  
  // Category options for search
  const categoryOptions = [
    { value: 'hcGearboxes', label: 'HC系列齿轮箱', isGearbox: true },
    { value: 'gwGearboxes', label: 'GW系列齿轮箱', isGearbox: true },
    { value: 'hcmGearboxes', label: 'HCM系列齿轮箱', isGearbox: true },
    { value: 'dtGearboxes', label: 'DT系列齿轮箱', isGearbox: true },
    { value: 'hcqGearboxes', label: 'HCQ系列齿轮箱', isGearbox: true },
    { value: 'gcGearboxes', label: 'GC系列齿轮箱', isGearbox: true },
    { value: 'flexibleCouplings', label: '高弹性联轴器', isGearbox: false },
    { value: 'standbyPumps', label: '备用泵', isGearbox: false },
  ];

  // Get current category info
  const currentCategory = categoryOptions.find(opt => opt.value === category) || categoryOptions[0];
  
  // Fields for search and display based on category
  const [searchFields, setSearchFields] = useState([]);
  const [displayFields, setDisplayFields] = useState([]);
  
  // Update fields based on selected category
  useEffect(() => {
    if (currentCategory.isGearbox) {
      setSearchFields([
        { value: 'model', label: '型号' },
        { value: 'ratios', label: '减速比' },
        { value: 'transferCapacity', label: '传递能力' },
        { value: 'thrust', label: '推力' },
        { value: 'centerDistance', label: '中心距' },
        { value: 'weight', label: '重量' },
      ]);
      
      setDisplayFields([
        { value: 'model', label: '型号', width: '15%' },
        { value: 'ratios', label: '减速比', width: '15%' },
        { value: 'transferCapacity', label: '传递能力 (kW/r·min)', width: '15%' },
        { value: 'inputSpeedRange', label: '输入转速范围 (r/min)', width: '15%' },
        { value: 'thrust', label: '推力 (kN)', width: '10%' },
        { value: 'centerDistance', label: '中心距 (mm)', width: '10%' },
        { value: 'weight', label: '重量 (kg)', width: '10%' },
        { value: 'price', label: '价格 (元)', width: '10%' },
      ]);
    } else if (category === 'flexibleCouplings') {
      setSearchFields([
        { value: 'model', label: '型号' },
        { value: 'torque', label: '扭矩' },
        { value: 'weight', label: '重量' },
      ]);
      
      setDisplayFields([
        { value: 'model', label: '型号', width: '20%' },
        { value: 'torque', label: '扭矩 (kN·m)', width: '15%' },
        { value: 'weight', label: '重量 (kg)', width: '15%' },
        { value: 'maxSpeed', label: '最高转速 (r/min)', width: '15%' },
        { value: 'price', label: '价格 (元)', width: '15%' },
        { value: 'factoryPrice', label: '成本价 (元)', width: '15%' },
      ]);
    } else if (category === 'standbyPumps') {
      setSearchFields([
        { value: 'model', label: '型号' },
        { value: 'flow', label: '流量' },
        { value: 'pressure', label: '压力' },
      ]);
      
      setDisplayFields([
        { value: 'model', label: '型号', width: '20%' },
        { value: 'flow', label: '流量 (m³/h)', width: '15%' },
        { value: 'pressure', label: '压力 (MPa)', width: '15%' },
        { value: 'motorPower', label: '电机功率 (kW)', width: '15%' },
        { value: 'weight', label: '重量 (kg)', width: '15%' },
        { value: 'price', label: '价格 (元)', width: '15%' },
      ]);
    }
    
    // Reset search field if it's no longer valid for the new category
    if (!searchFields.some(field => field.value === searchField)) {
      setSearchField(searchFields[0]?.value || 'model');
    }
    
    // Reset search results
    setSearchResults([]);
    setSelectedItem(null);
    setMessage('请输入搜索条件');
  }, [category, currentCategory.isGearbox]);
  
  // Helper function for safely displaying field values
  const formatFieldValue = (item, field) => {
    if (!item) return '-';
    
    const value = item[field];
    
    if (value === undefined || value === null) return '-';
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (field === 'ratios') {
        return value.join(', ');
      } else if (field === 'transferCapacity') {
        return value.map(v => typeof v === 'number' ? v.toFixed(3) : v).join(', ');
      } else if (field === 'inputSpeedRange') {
        return value.join('-');
      } else {
        return value.join(', ');
      }
    }
    
    // Handle numbers
    if (typeof value === 'number') {
      if (['price', 'factoryPrice', 'marketPrice'].includes(field)) {
        return value.toLocaleString('zh-CN');
      } else if (field === 'transferCapacity') {
        return value.toFixed(3);
      } else if (['ratios', 'thrust', 'torque'].includes(field)) {
        return value.toFixed(2);
      } else {
        return value.toString();
      }
    }
    
    // Handle strings and other values
    return value.toString();
  };
  
  // Handle search
  const handleSearch = () => {
    const currentData = appData[category] || [];
    if (!currentData || currentData.length === 0) {
      setMessage(`没有${currentCategory.label}数据可供搜索`);
      setSearchResults([]);
      return;
    }
    
    // Filter based on search term
    let filtered = [...currentData];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(item => {
        const fieldValue = item[searchField];
        
        if (fieldValue === undefined || fieldValue === null) return false;
        
        // Handle array fields
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(v => 
            v !== undefined && 
            v !== null && 
            v.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Handle regular fields
        return fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply range filters for gearboxes
    if (currentCategory.isGearbox) {
      // Filter by power capacity (using transferCapacity field)
      if (searchRange.minPower && !isNaN(parseFloat(searchRange.minPower))) {
        filtered = filtered.filter(item => {
          const transferCapacity = Array.isArray(item.transferCapacity) ? 
            Math.max(...item.transferCapacity) : item.transferCapacity;
          return transferCapacity >= parseFloat(searchRange.minPower);
        });
      }
      
      if (searchRange.maxPower && !isNaN(parseFloat(searchRange.maxPower))) {
        filtered = filtered.filter(item => {
          const transferCapacity = Array.isArray(item.transferCapacity) ? 
            Math.max(...item.transferCapacity) : item.transferCapacity;
          return transferCapacity <= parseFloat(searchRange.maxPower);
        });
      }
      
      // Filter by ratio
      if (searchRange.minRatio && !isNaN(parseFloat(searchRange.minRatio))) {
        filtered = filtered.filter(item => {
          const ratios = Array.isArray(item.ratios) ? item.ratios : [item.ratios];
          return ratios.some(ratio => ratio >= parseFloat(searchRange.minRatio));
        });
      }
      
      if (searchRange.maxRatio && !isNaN(parseFloat(searchRange.maxRatio))) {
        filtered = filtered.filter(item => {
          const ratios = Array.isArray(item.ratios) ? item.ratios : [item.ratios];
          return ratios.some(ratio => ratio <= parseFloat(searchRange.maxRatio));
        });
      }
      
      // Filter by thrust
      if (searchRange.minThrust && !isNaN(parseFloat(searchRange.minThrust))) {
        filtered = filtered.filter(item => {
          return item.thrust >= parseFloat(searchRange.minThrust);
        });
      }
      
      if (searchRange.maxThrust && !isNaN(parseFloat(searchRange.maxThrust))) {
        filtered = filtered.filter(item => {
          return item.thrust <= parseFloat(searchRange.maxThrust);
        });
      }
    }
    
    // Sort results
    filtered.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle array fields for sorting
      if (Array.isArray(fieldA) && Array.isArray(fieldB)) {
        // Use the first element for comparison
        fieldA = fieldA[0];
        fieldB = fieldB[0];
      }
      
      // Handle undefined values
      if (fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      // Compare numbers
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      // Compare strings
      const strA = String(fieldA).toLowerCase();
      const strB = String(fieldB).toLowerCase();
      
      if (sortDirection === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
    
    setSearchResults(filtered);
    setMessage(filtered.length > 0 ? 
      `找到 ${filtered.length} 条符合条件的记录` : 
      '没有找到符合条件的记录');
  };
  
  // Handle range input change
  const handleRangeChange = (field, value) => {
    setSearchRange({
      ...searchRange,
      [field]: value
    });
  };
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset direction to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle row click to display detailed information
  const handleRowClick = (item) => {
    setSelectedItem(item);
  };
  
  // Reset search form
  const handleReset = () => {
    setSearchTerm('');
    setSearchField('model');
    setSortField('model');
    setSortDirection('asc');
    setSearchRange({
      minPower: '',
      maxPower: '',
      minRatio: '',
      maxRatio: '',
      minThrust: '',
      maxThrust: '',
    });
    setSearchResults([]);
    setSelectedItem(null);
    setMessage('请输入搜索条件');
  };
  
  return (
    <div className="data-query">
      <Row className="mb-4">
        <Col md={12}>
          <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
              <h5 className="mb-0">数据查询</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>数据类别</Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      >
                        {categoryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>搜索字段</Form.Label>
                      <Form.Select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      >
                        {searchFields.map(field => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>搜索关键词</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder={`请输入${searchFields.find(f => f.value === searchField)?.label || '关键词'}`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            borderColor: colors.inputBorder
                          }}
                        />
                        <Button 
                          variant="primary"
                          onClick={handleSearch}
                          style={{
                            backgroundColor: colors.primary,
                            borderColor: colors.primary
                          }}
                        >
                          <i className="bi bi-search me-1"></i> 搜索
                        </Button>
                        <Button 
                          variant="outline-secondary"
                          onClick={handleReset}
                          style={{
                            borderColor: colors.inputBorder,
                            color: colors.text
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i> 重置
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Advanced search options for gearboxes */}
                {currentCategory.isGearbox && (
                  <Accordion className="mb-3">
                    <Accordion.Item eventKey="0" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                      <Accordion.Header>高级搜索选项</Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>传递能力范围 (kW/r·min)</Form.Label>
                              <Row>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最小值"
                                    value={searchRange.minPower}
                                    onChange={(e) => handleRangeChange('minPower', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                                <Col xs="auto" style={{ padding: '0 5px', display: 'flex', alignItems: 'center', color: colors.text }}>
                                  至
                                </Col>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最大值"
                                    value={searchRange.maxPower}
                                    onChange={(e) => handleRangeChange('maxPower', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>减速比范围</Form.Label>
                              <Row>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最小值"
                                    value={searchRange.minRatio}
                                    onChange={(e) => handleRangeChange('minRatio', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                                <Col xs="auto" style={{ padding: '0 5px', display: 'flex', alignItems: 'center', color: colors.text }}>
                                  至
                                </Col>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最大值"
                                    value={searchRange.maxRatio}
                                    onChange={(e) => handleRangeChange('maxRatio', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>推力范围 (kN)</Form.Label>
                              <Row>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最小值"
                                    value={searchRange.minThrust}
                                    onChange={(e) => handleRangeChange('minThrust', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                                <Col xs="auto" style={{ padding: '0 5px', display: 'flex', alignItems: 'center', color: colors.text }}>
                                  至
                                </Col>
                                <Col>
                                  <Form.Control
                                    type="number"
                                    placeholder="最大值"
                                    value={searchRange.maxThrust}
                                    onChange={(e) => handleRangeChange('maxThrust', e.target.value)}
                                    style={{
                                      backgroundColor: colors.inputBg,
                                      color: colors.text,
                                      borderColor: colors.inputBorder
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
              </Form>
              
              {/* Search status */}
              <div className="search-status mb-3 p-2" style={{ 
                backgroundColor: colors.headerBg, 
                color: colors.headerText,
                borderRadius: '0.25rem',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem'
              }}>
                <i className="bi bi-info-circle me-2"></i> {message}
                {searchResults.length > 0 && (
                  <Badge 
                    bg="primary" 
                    pill 
                    className="ms-2"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.primaryText
                    }}
                  >
                    {searchResults.length}
                  </Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={selectedItem ? 8 : 12}>
          <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">搜索结果</h5>
                <div className="sort-info" style={{ fontSize: '0.85rem' }}>
                  排序: {displayFields.find(f => f.value === sortField)?.label || sortField} 
                  <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              {searchResults.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <Table 
                    bordered 
                    hover 
                    responsive 
                    style={{ 
                      marginBottom: 0,
                      color: colors.text
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: colors.headerBg }}>
                        {displayFields.map(field => (
                          <th 
                            key={field.value} 
                            style={{ 
                              width: field.width,
                              cursor: 'pointer',
                              color: sortField === field.value ? colors.primary : colors.headerText
                            }}
                            onClick={() => handleSort(field.value)}
                          >
                            {field.label}
                            {sortField === field.value && (
                              <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((item, index) => (
                        <tr 
                          key={`${item.model}-${index}`}
                          onClick={() => handleRowClick(item)}
                          style={{ 
                            cursor: 'pointer',
                            backgroundColor: selectedItem && selectedItem.model === item.model ? 
                              (colors.headerBg + '80') : 'transparent' // Add 50% transparency to header bg color
                          }}
                        >
                          {displayFields.map(field => (
                            <td key={field.value}>
                              {formatFieldValue(item, field.value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4" style={{ color: colors.text }}>
                  <i className="bi bi-search me-2"></i> 
                  {searchTerm.trim() || Object.values(searchRange).some(v => v !== '') ? 
                    '没有找到符合条件的记录' : 
                    '请输入搜索条件'}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Item details panel */}
        {selectedItem && (
          <Col md={4}>
            <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">详细信息</h5>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0"
                    onClick={() => setSelectedItem(null)}
                    style={{ color: colors.text }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table bordered style={{ color: colors.text, borderColor: colors.border }}>
                  <tbody>
                    {selectedItem && Object.keys(selectedItem).sort().map(key => {
                      // Skip empty or null values
                      if (selectedItem[key] === undefined || selectedItem[key] === null) return null;
                      
                      // Get a more readable field name
                      const fieldLabel = displayFields.find(f => f.value === key)?.label || key;
                      
                      return (
                        <tr key={key}>
                          <td style={{ width: '40%', fontWeight: 'bold' }}>{fieldLabel}</td>
                          <td>{formatFieldValue(selectedItem, key)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DataQuery;