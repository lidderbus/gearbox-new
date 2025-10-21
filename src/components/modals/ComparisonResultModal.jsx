/**
 * 报价单比较结果对话框组件
 *
 * 功能：
 * - 显示两个报价单的对比结果
 * - 展示价格差异明细
 * - 支持导出比较结果为Excel
 */

import React from 'react';
import { Modal, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { exportComparisonToExcel } from '../../utils/quotationManager';

const ComparisonResultModal = ({
  show,
  onHide,
  comparisonResult,
  colors,
  theme
}) => {
  if (!comparisonResult) return null;

  // 格式化价格显示
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '-';
    return price.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 格式化百分比显示
  const formatPercent = (value) => {
    if (typeof value !== 'number') return '-';
    return value.toFixed(2) + '%';
  };

  // 获取差异项的图标和样式
  const getDifferenceStyle = (type, percentChange) => {
    if (type === 'itemRemoved') {
      return {
        icon: <i className="bi bi-dash-circle text-danger me-1"></i>,
        className: 'text-danger'
      };
    } else if (type === 'itemAdded') {
      return {
        icon: <i className="bi bi-plus-circle text-success me-1"></i>,
        className: 'text-success'
      };
    } else if (percentChange > 0) {
      return {
        icon: <i className="bi bi-arrow-up-circle text-danger me-1"></i>,
        className: 'text-danger'
      };
    } else if (percentChange < 0) {
      return {
        icon: <i className="bi bi-arrow-down-circle text-success me-1"></i>,
        className: 'text-success'
      };
    }
    return {
      icon: <i className="bi bi-dash-circle text-muted me-1"></i>,
      className: ''
    };
  };

  // 处理导出
  const handleExport = () => {
    exportComparisonToExcel(
      comparisonResult,
      `报价单比较-${new Date().toISOString().slice(0, 10)}`
    );
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>报价单比较结果</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        {/* 报价单基本信息对比 */}
        <Row className="mb-4">
          <Col md={6}>
            <h6>报价单 A</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <td width="30%">报价单号</td>
                  <td>{comparisonResult.quotationA.id}</td>
                </tr>
                <tr>
                  <td>日期</td>
                  <td>{comparisonResult.quotationA.date}</td>
                </tr>
                <tr>
                  <td>总金额</td>
                  <td>{formatPrice(comparisonResult.quotationA.totalAmount)}元</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h6>报价单 B</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <td width="30%">报价单号</td>
                  <td>{comparisonResult.quotationB.id}</td>
                </tr>
                <tr>
                  <td>日期</td>
                  <td>{comparisonResult.quotationB.date}</td>
                </tr>
                <tr>
                  <td>总金额</td>
                  <td>{formatPrice(comparisonResult.quotationB.totalAmount)}元</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* 价格差异明细 */}
        <h6 className="border-bottom pb-2 mb-3">价格差异明细</h6>

        <Table bordered responsive>
          <thead>
            <tr>
              <th>项目</th>
              <th>描述</th>
              <th>报价单A价格</th>
              <th>报价单B价格</th>
              <th>差异</th>
              <th>变化率</th>
            </tr>
          </thead>
          <tbody>
            {comparisonResult.differences.map((diff, index) => {
              const { icon, className } = getDifferenceStyle(diff.type, diff.percentChange);
              return (
                <tr key={index} className={className}>
                  <td>{icon} {diff.type === 'totalAmount' ? '总金额' : diff.model}</td>
                  <td>{diff.description}</td>
                  <td className="text-end">{formatPrice(diff.valueA)}</td>
                  <td className="text-end">{formatPrice(diff.valueB)}</td>
                  <td className={`text-end ${diff.difference > 0 ? 'text-danger' : diff.difference < 0 ? 'text-success' : ''}`}>
                    {diff.difference > 0 ? '+' : ''}{formatPrice(diff.difference)}
                  </td>
                  <td className="text-end">
                    {diff.percentChange > 0 ? '+' : ''}{formatPercent(diff.percentChange)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* 总体变化提示 */}
        <Alert variant="info" className="mt-3">
          <i className="bi bi-info-circle me-2"></i>
          总体变化: 报价单B比报价单A
          {comparisonResult.differences[0]?.difference > 0 ? '增加了' : '减少了'}
          {formatPrice(Math.abs(comparisonResult.differences[0]?.difference || 0))}元
          ({formatPercent(Math.abs(comparisonResult.differences[0]?.percentChange || 0))})
        </Alert>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button variant="secondary" onClick={onHide}>
          关闭
        </Button>
        <Button variant="primary" onClick={handleExport}>
          <i className="bi bi-file-earmark-excel me-1"></i> 导出比较结果
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComparisonResultModal;
