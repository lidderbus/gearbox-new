// src/components/BatchSelectionView.js
// 批量选型功能组件 - 支持多个选型需求的批量处理

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, Table, Form, Row, Col, Badge, Spinner, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { autoSelectGearbox } from '../utils/selectionAlgorithm';
import { saveSelectionToHistory } from '../utils/selectionHistory';
import { initialData } from '../data/initialData';
import { formatPrice } from '../utils/priceCalculator';

/**
 * 默认选型需求模板
 */
const DEFAULT_REQUIREMENT = {
  id: '',
  name: '',
  motorPower: '',
  motorSpeed: '',
  targetRatio: '',
  thrust: '',
  application: 'propulsion',
  workCondition: 'III类:扭矩变化中等',
  temperature: '30',
  safetyFactor: '1.2',
  notes: ''
};

/**
 * 工作条件选项
 */
const WORK_CONDITIONS = [
  'I类:扭矩变化很小',
  'II类:扭矩变化小',
  'III类:扭矩变化中等',
  'IV类:扭矩变化大',
  'V类:扭矩变化很大'
];

/**
 * 批量选型视图组件
 */
const BatchSelectionView = ({ onSelectionComplete }) => {
  // 状态管理
  const [requirements, setRequirements] = useState([
    { ...DEFAULT_REQUIREMENT, id: Date.now().toString() }
  ]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState(null);

  /**
   * 生成唯一ID
   */
  const generateId = useCallback(() => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * 添加新的选型需求
   */
  const addRequirement = useCallback(() => {
    setRequirements(prev => [
      ...prev,
      { ...DEFAULT_REQUIREMENT, id: generateId(), name: `需求 ${prev.length + 1}` }
    ]);
  }, [generateId]);

  /**
   * 删除选型需求
   */
  const removeRequirement = useCallback((id) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
    setResults(prev => prev.filter(r => r.requirementId !== id));
  }, []);

  /**
   * 更新选型需求
   */
  const updateRequirement = useCallback((id, field, value) => {
    setRequirements(prev => prev.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  }, []);

  /**
   * 复制选型需求
   */
  const duplicateRequirement = useCallback((requirement) => {
    const newReq = {
      ...requirement,
      id: generateId(),
      name: `${requirement.name} (副本)`
    };
    setRequirements(prev => [...prev, newReq]);
  }, [generateId]);

  /**
   * 执行单个选型
   */
  const performSingleSelection = useCallback(async (requirement) => {
    const numericReq = {
      ...requirement,
      motorPower: parseFloat(requirement.motorPower) || 0,
      motorSpeed: parseFloat(requirement.motorSpeed) || 0,
      targetRatio: parseFloat(requirement.targetRatio) || 0,
      thrust: parseFloat(requirement.thrust) || 0,
      temperature: parseFloat(requirement.temperature) || 30,
      safetyFactor: parseFloat(requirement.safetyFactor) || 1.2
    };

    try {
      const result = await autoSelectGearbox(numericReq, initialData);
      return {
        requirementId: requirement.id,
        requirementName: requirement.name || '未命名',
        input: numericReq,
        success: result.success,
        result: result.result,
        message: result.message,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        requirementId: requirement.id,
        requirementName: requirement.name || '未命名',
        input: numericReq,
        success: false,
        result: null,
        message: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }, []);

  /**
   * 执行批量选型
   */
  const performBatchSelection = useCallback(async () => {
    // 验证输入
    const validRequirements = requirements.filter(r =>
      r.motorPower && r.motorSpeed && r.targetRatio
    );

    if (validRequirements.length === 0) {
      setError('请至少填写一个完整的选型需求（功率、转速、速比）');
      return;
    }

    setProcessing(true);
    setError(null);
    setResults([]);
    setCurrentIndex(0);

    const batchResults = [];

    for (let i = 0; i < validRequirements.length; i++) {
      setCurrentIndex(i);
      const result = await performSingleSelection(validRequirements[i]);
      batchResults.push(result);
      setResults([...batchResults]);

      // 添加小延迟以显示进度
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setProcessing(false);

    // 保存成功的选型到历史
    const successfulResults = batchResults.filter(r => r.success);
    successfulResults.forEach(result => {
      if (result.result) {
        saveSelectionToHistory(
          result.result,
          {
            projectName: result.requirementName || `批量选型 ${new Date().toLocaleString()}`,
            customerName: '',
            projectNumber: '',
            contactPerson: '',
            contactPhone: '',
            contactEmail: '',
            engineModel: '',
            selectionType: 'batch'
          },
          {
            gearbox: result.result.gearbox,
            coupling: result.result.coupling,
            pump: result.result.pump
          },
          {
            power: result.input.motorPower,
            speed: result.input.motorSpeed
          },
          result.input
        );
      }
    });

    // 回调通知
    if (onSelectionComplete) {
      onSelectionComplete(batchResults);
    }
  }, [requirements, performSingleSelection, onSelectionComplete]);

  /**
   * 从文本导入需求
   * 格式: 名称,功率,转速,速比 (每行一个)
   */
  const handleImport = useCallback(() => {
    try {
      const lines = importText.trim().split('\n');
      const imported = lines.map((line, index) => {
        const parts = line.split(/[,\t]/);
        return {
          id: generateId(),
          name: parts[0]?.trim() || `导入需求 ${index + 1}`,
          motorPower: parts[1]?.trim() || '',
          motorSpeed: parts[2]?.trim() || '',
          targetRatio: parts[3]?.trim() || '',
          thrust: parts[4]?.trim() || '',
          application: 'propulsion',
          workCondition: 'III类:扭矩变化中等',
          temperature: '30',
          safetyFactor: '1.2',
          notes: parts[5]?.trim() || ''
        };
      });

      setRequirements(prev => [...prev, ...imported]);
      setShowImportModal(false);
      setImportText('');
    } catch (err) {
      setError('导入格式错误，请检查数据格式');
    }
  }, [importText, generateId]);

  /**
   * 导出结果为CSV
   */
  const exportResults = useCallback(() => {
    if (results.length === 0) return;

    const headers = ['需求名称', '功率(kW)', '转速(rpm)', '速比', '状态', '推荐齿轮箱', '推荐联轴器', '推荐备用泵', '总价格'];
    const rows = results.map(r => [
      r.requirementName,
      r.input.motorPower,
      r.input.motorSpeed,
      r.input.targetRatio,
      r.success ? '成功' : '失败',
      r.result?.gearbox?.model || '-',
      r.result?.coupling?.model || '-',
      r.result?.pump?.model || '-',
      r.result?.totalPrice || '-'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `批量选型结果_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [results]);

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    return { total, successful, failed };
  }, [results]);

  /**
   * 进度百分比
   */
  const progress = useMemo(() => {
    if (!processing || requirements.length === 0) return 0;
    return Math.round((currentIndex + 1) / requirements.filter(r =>
      r.motorPower && r.motorSpeed && r.targetRatio
    ).length * 100);
  }, [processing, currentIndex, requirements]);

  return (
    <div className="batch-selection-view">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">批量选型</h5>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => setShowImportModal(true)}
            >
              导入数据
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={addRequirement}
            >
              + 添加需求
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 需求列表 */}
          <div className="requirements-list mb-4">
            {requirements.map((req, index) => (
              <Card key={req.id} className="mb-2">
                <Card.Body className="py-2">
                  <Row className="align-items-center">
                    <Col xs={12} md={2}>
                      <Form.Control
                        size="sm"
                        placeholder="需求名称"
                        value={req.name}
                        onChange={(e) => updateRequirement(req.id, 'name', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="功率 (kW)"
                        value={req.motorPower}
                        onChange={(e) => updateRequirement(req.id, 'motorPower', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="转速 (rpm)"
                        value={req.motorSpeed}
                        onChange={(e) => updateRequirement(req.id, 'motorSpeed', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="速比"
                        value={req.targetRatio}
                        onChange={(e) => updateRequirement(req.id, 'targetRatio', e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={2}>
                      <Form.Select
                        size="sm"
                        value={req.workCondition}
                        onChange={(e) => updateRequirement(req.id, 'workCondition', e.target.value)}
                      >
                        {WORK_CONDITIONS.map(wc => (
                          <option key={wc} value={wc}>{wc.split(':')[0]}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={12} md={2} className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-1"
                        onClick={() => duplicateRequirement(req)}
                        title="复制"
                      >
                        📋
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeRequirement(req.id)}
                        disabled={requirements.length === 1}
                        title="删除"
                      >
                        ×
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* 执行按钮 */}
          <div className="d-flex justify-content-center mb-4">
            <Button
              variant="success"
              size="lg"
              onClick={performBatchSelection}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  处理中...
                </>
              ) : (
                `开始批量选型 (${requirements.filter(r => r.motorPower && r.motorSpeed && r.targetRatio).length} 项)`
              )}
            </Button>
          </div>

          {/* 进度条 */}
          {processing && (
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              className="mb-4"
              animated
            />
          )}

          {/* 结果统计 */}
          {results.length > 0 && (
            <div className="mb-3">
              <Badge bg="primary" className="me-2">总计: {stats.total}</Badge>
              <Badge bg="success" className="me-2">成功: {stats.successful}</Badge>
              <Badge bg="danger" className="me-2">失败: {stats.failed}</Badge>
              <Button
                variant="outline-primary"
                size="sm"
                className="float-end"
                onClick={exportResults}
              >
                导出结果
              </Button>
            </div>
          )}

          {/* 结果表格 */}
          {results.length > 0 && (
            <Table responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>需求名称</th>
                  <th>功率</th>
                  <th>转速</th>
                  <th>速比</th>
                  <th>状态</th>
                  <th>齿轮箱</th>
                  <th>联轴器</th>
                  <th>备用泵</th>
                  <th>价格</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.requirementId}>
                    <td>{result.requirementName}</td>
                    <td>{result.input.motorPower} kW</td>
                    <td>{result.input.motorSpeed} rpm</td>
                    <td>{result.input.targetRatio}</td>
                    <td>
                      <Badge bg={result.success ? 'success' : 'danger'}>
                        {result.success ? '成功' : '失败'}
                      </Badge>
                    </td>
                    <td>{result.result?.gearbox?.model || '-'}</td>
                    <td>{result.result?.coupling?.model || '-'}</td>
                    <td>{result.result?.pump?.model || '-'}</td>
                    <td>
                      {result.result?.totalPrice
                        ? formatPrice(result.result.totalPrice)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* 导入模态框 */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>导入选型需求</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">
            格式: 名称,功率(kW),转速(rpm),速比,推力(可选),备注(可选)
            <br />
            每行一个需求，使用逗号或制表符分隔
          </p>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder={`示例:\n主推进1,350,1800,4.5\n主推进2,250,1500,3.5\n辅机,100,1200,2.5`}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleImport}>
            导入
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BatchSelectionView;
