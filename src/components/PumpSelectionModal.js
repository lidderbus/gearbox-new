import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Alert, InputGroup } from 'react-bootstrap';

const PumpSelectionModal = React.memo(({
  show,
  onHide,
  pumpList,
  gearboxModel,
  gearboxPower,
  onSelectPump,
  suggestedModel,
  colors
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPumps, setFilteredPumps] = useState([]);
  const [selectedPump, setSelectedPump] = useState(null);
  const [error, setError] = useState('');
  
  // 初始化时过滤出可能匹配的泵
  useEffect(() => {
    if (show) {
      // 如果有建议型号，自动填入搜索框
      if (suggestedModel) {
        setSearchTerm(suggestedModel);
      } else {
        // 根据功率范围筛选初始泵列表
        // 泵功率一般是齿轮箱功率的10-15%
        const targetPumpPower = gearboxPower * 0.125;
        const minPumpPower = gearboxPower * 0.1;
        const maxPumpPower = gearboxPower * 0.15;
        
        // 从泵名称中提取系列信息
        let seriesPrefix = '';
        if (gearboxModel.startsWith('GW') || gearboxModel.startsWith('HC')) {
          seriesPrefix = '2CY';
        } else if (gearboxModel.startsWith('DT')) {
          seriesPrefix = '2CYA';
        }
        
        if (seriesPrefix) {
          setSearchTerm(seriesPrefix);
        }
      }
    }
  }, [show, suggestedModel, gearboxModel, gearboxPower]);
  
  // 当搜索词变化时更新过滤后的泵列表
  useEffect(() => {
    if (!Array.isArray(pumpList)) {
      setFilteredPumps([]);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredPumps(pumpList.slice(0, 20)); // 显示前20个结果
      return;
    }
    
    // 对泵进行过滤和排序
    const filtered = pumpList
      .filter(pump => {
        if (!pump || !pump.model) return false;
        
        return pump.model.toLowerCase().includes(term);
      })
      .sort((a, b) => {
        // 精确匹配的排在前面
        const aExact = a.model.toLowerCase() === term;
        const bExact = b.model.toLowerCase() === term;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // 其次按开头匹配排序
        const aStarts = a.model.toLowerCase().startsWith(term);
        const bStarts = b.model.toLowerCase().startsWith(term);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // 最后按字母顺序排序
        return a.model.localeCompare(b.model);
      });
    
    setFilteredPumps(filtered.slice(0, 50)); // 限制最多50个结果
  }, [pumpList, searchTerm]);
  
  // 处理泵选择
  const handlePumpSelect = (pump) => {
    setSelectedPump(pump);
    setError('');
  };
  
  // 确认选择
  const handleConfirm = () => {
    if (!selectedPump) {
      setError('请先选择一个备用泵');
      return;
    }
    
    onSelectPump(selectedPump);
    onHide();
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
        <Modal.Title>选择备用泵</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Form.Group className="mb-3">
          <Form.Label>搜索备用泵型号</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="输入型号关键字，如 2CY"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: colors?.inputBg,
                color: colors?.text,
                borderColor: colors?.inputBorder
              }}
            />
            <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
              <i className="bi bi-x-circle"></i>
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            提示: 常用备用泵系列为2CY (GW和HC系列) 和 2CYA (DT系列)
          </Form.Text>
        </Form.Group>
        
        {suggestedModel && (
          <Alert variant="info" className="mb-3">
            <i className="bi bi-lightbulb-fill me-2"></i>
            系统推荐的备用泵型号: <strong>{suggestedModel}</strong>
          </Alert>
        )}
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table hover size="sm">
            <thead>
              <tr>
                <th>型号</th>
                <th>流量</th>
                <th>压力</th>
                <th>电机功率</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPumps.length > 0 ? (
                filteredPumps.map((pump, index) => (
                  <tr 
                    key={index}
                    className={selectedPump?.model === pump.model ? 'table-primary' : ''}
                    onClick={() => handlePumpSelect(pump)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{pump.model}</td>
                    <td>{pump.flow || '-'}</td>
                    <td>{pump.pressure || '-'}</td>
                    <td>{pump.motorPower || '-'} kW</td>
                    <td>
                      <Button 
                        variant={selectedPump?.model === pump.model ? "primary" : "outline-primary"} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePumpSelect(pump);
                        }}
                      >
                        {selectedPump?.model === pump.model ? "已选择" : "选择"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    {searchTerm ? '没有找到匹配的备用泵' : '请输入搜索关键字'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          取消
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={!selectedPump}
        >
          确认选择
        </Button>
      </Modal.Footer>
    </Modal>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，仅在关键属性变化时才重新渲染
  return prevProps.show === nextProps.show && 
         prevProps.gearboxModel === nextProps.gearboxModel &&
         prevProps.suggestedModel === nextProps.suggestedModel &&
         prevProps.pumpList === nextProps.pumpList;
});

export default PumpSelectionModal;