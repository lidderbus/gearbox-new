import React, { useState, useMemo, useCallback } from 'react';
import {
  Card, Row, Col, Form, Button, Badge, Table, Alert, ButtonGroup
} from 'react-bootstrap';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  getDwgDownloadUrl,
  getShareCADPreviewUrl
} from '../data/outlineDrawings';

// 尝试导入技术参数数据
let dwgTechParams = {};
try {
  const techParamsModule = require('../data/dwgTechParams');
  dwgTechParams = techParamsModule.dwgTechParams || {};
} catch (e) {
  console.log('dwgTechParams not available');
}

const DwgCompareView = () => {
  const [modelA, setModelA] = useState('');
  const [modelB, setModelB] = useState('');
  const [fileIndexA, setFileIndexA] = useState(0);
  const [fileIndexB, setFileIndexB] = useState(0);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  // 差异样式计算
  const getDiffStyle = useCallback((valA, valB) => {
    if (!valA && !valB) return { bg: 'transparent', color: 'inherit', isDiff: false };
    if (valA === valB) return { bg: '#f0f0f0', color: '#666', isDiff: false };
    return { bg: '#ffe0e0', color: '#c00', isDiff: true };
  }, []);

  // 数值差异百分比计算
  const calcDiffPercent = useCallback((valA, valB) => {
    if (!valA || !valB) return null;
    // 提取数值
    const numA = parseFloat(String(valA).replace(/[^\d.]/g, ''));
    const numB = parseFloat(String(valB).replace(/[^\d.]/g, ''));
    if (isNaN(numA) || isNaN(numB) || numA === 0) return null;
    const diff = ((numB - numA) / numA * 100).toFixed(1);
    if (diff > 0) return `↑${diff}%`;
    if (diff < 0) return `↓${Math.abs(diff)}%`;
    return '=';
  }, []);

  // 导出PDF
  const exportToPDF = useCallback(() => {
    if (!modelA && !modelB) return;

    // 构建打印内容
    const printContent = `
      <html>
      <head>
        <title>DWG对比报告 - ${modelA || '-'} vs ${modelB || '-'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          .info { text-align: center; color: #666; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; }
          .diff { background: #ffe0e0; color: #c00; }
          .same { background: #f0f0f0; color: #666; }
          .diff-col { width: 80px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>DWG型号对比报告</h1>
        <p class="info">生成时间: ${new Date().toLocaleString()}</p>
        <table>
          <tr>
            <th>参数</th>
            <th>${modelA || '-'}</th>
            <th>${modelB || '-'}</th>
            <th class="diff-col">差异</th>
          </tr>
          ${generateComparisonRows()}
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }, [modelA, modelB]);

  // 生成对比行HTML
  const generateComparisonRows = useCallback(() => {
    const paramsA = getModelData(modelA)?.techParams || {};
    const paramsB = getModelData(modelB)?.techParams || {};

    const paramRows = [
      { key: 'powerRange', label: '功率范围' },
      { key: 'speedRange', label: '转速范围' },
      { key: 'ratios', label: '可选速比', format: (v) => Array.isArray(v) ? v.join(', ') : v },
      { key: 'thrust', label: '推力' },
      { key: 'centerDistance', label: '中心距' },
      { key: 'weight', label: '重量' },
      { key: 'dimensions', label: '尺寸' },
      { key: 'controlType', label: '操纵方式' },
    ];

    return paramRows.map(row => {
      const valueA = row.format ? row.format(paramsA[row.key]) : paramsA[row.key];
      const valueB = row.format ? row.format(paramsB[row.key]) : paramsB[row.key];
      if (!valueA && !valueB) return '';

      const style = getDiffStyle(valueA, valueB);
      const diffPercent = calcDiffPercent(valueA, valueB);
      const rowClass = style.isDiff ? 'diff' : 'same';

      return `<tr class="${rowClass}">
        <td><strong>${row.label}</strong></td>
        <td>${valueA || '-'}</td>
        <td>${valueB || '-'}</td>
        <td class="diff-col">${diffPercent || (style.isDiff ? '不同' : '-')}</td>
      </tr>`;
    }).join('');
  }, [modelA, modelB, getDiffStyle, calcDiffPercent]);

  // 获取所有可用型号
  const allModels = useMemo(() => {
    const models = [];

    // 齿轮箱
    Object.keys(gearboxDwgDrawings).forEach(model => {
      models.push({
        model,
        type: 'gearbox',
        files: gearboxDwgDrawings[model]
      });
    });

    // 联轴器
    Object.keys(couplingDwgDrawings).forEach(model => {
      models.push({
        model,
        type: 'coupling',
        files: couplingDwgDrawings[model]
      });
    });

    return models.sort((a, b) => a.model.localeCompare(b.model));
  }, []);

  // 获取型号数据
  const getModelData = (model) => {
    if (!model) return null;
    const found = allModels.find(m => m.model === model);
    if (!found) return null;

    const techParams = dwgTechParams[model] || {};
    return {
      ...found,
      techParams: techParams.techParams || {}
    };
  };

  const dataA = getModelData(modelA);
  const dataB = getModelData(modelB);

  // 获取预览URL
  const getPreviewUrl = (data, fileIndex) => {
    if (!data || !data.files || !data.files[fileIndex]) return null;
    const file = data.files[fileIndex];
    return getShareCADPreviewUrl(file.filePath);
  };

  // 渲染型号选择器
  const renderModelSelector = (value, onChange, label, otherValue) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- 选择型号 --</option>
        {allModels.map(item => (
          <option
            key={item.model}
            value={item.model}
            disabled={item.model === otherValue}
          >
            {item.model} ({item.type === 'coupling' ? '联轴器' : '齿轮箱'}, {item.files.length}个文件)
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  // 渲染文件选择器
  const renderFileSelector = (data, fileIndex, onChange) => {
    if (!data || !data.files || data.files.length <= 1) return null;
    return (
      <Form.Select
        size="sm"
        value={fileIndex}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="mb-2"
      >
        {data.files.map((file, idx) => (
          <option key={idx} value={idx}>
            {file.fileName} ({file.fileSize})
          </option>
        ))}
      </Form.Select>
    );
  };

  // 渲染预览区
  const renderPreview = (data, fileIndex, side) => {
    if (!data) {
      return (
        <div
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ height: '350px' }}
        >
          <div className="text-center text-muted">
            <i className="bi bi-file-earmark-binary" style={{ fontSize: '48px' }}></i>
            <p className="mt-2">请选择{side === 'A' ? '左侧' : '右侧'}型号</p>
          </div>
        </div>
      );
    }

    const previewUrl = getPreviewUrl(data, fileIndex);
    return (
      <div style={{ height: '350px', backgroundColor: '#f5f5f5' }}>
        <iframe
          src={previewUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={`${data.model} 预览`}
          allowFullScreen
        />
      </div>
    );
  };

  // 技术参数对比表
  const renderComparisonTable = () => {
    if (!dataA && !dataB) return null;

    const paramsA = dataA?.techParams || {};
    const paramsB = dataB?.techParams || {};

    const paramRows = [
      { key: 'powerRange', label: '功率范围', unit: '' },
      { key: 'speedRange', label: '转速范围', unit: '' },
      { key: 'ratios', label: '可选速比', unit: '', format: (v) => Array.isArray(v) ? v.join(', ') : v },
      { key: 'thrust', label: '推力', unit: '' },
      { key: 'centerDistance', label: '中心距', unit: '' },
      { key: 'weight', label: '重量', unit: '' },
      { key: 'dimensions', label: '尺寸', unit: '' },
      { key: 'controlType', label: '操纵方式', unit: '' },
    ];

    // 检查是否有任何参数数据
    const hasAnyData = paramRows.some(row =>
      paramsA[row.key] || paramsB[row.key]
    );

    if (!hasAnyData) {
      return (
        <Alert variant="info" className="mt-3">
          <i className="bi bi-info-circle me-2"></i>
          选中的型号暂无技术参数数据
        </Alert>
      );
    }

    // 统计差异数量
    const diffCount = paramRows.filter(row => {
      const valueA = row.format ? row.format(paramsA[row.key]) : paramsA[row.key];
      const valueB = row.format ? row.format(paramsB[row.key]) : paramsB[row.key];
      return (valueA || valueB) && valueA !== valueB;
    }).length;

    return (
      <Card className="mt-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-table me-2"></i>
            技术参数对比
            {diffCount > 0 && (
              <Badge bg="danger" className="ms-2">{diffCount}项差异</Badge>
            )}
          </span>
          <div className="d-flex align-items-center gap-3">
            <Form.Check
              type="switch"
              id="show-diff-only"
              label="只显示差异"
              checked={showOnlyDifferences}
              onChange={(e) => setShowOnlyDifferences(e.target.checked)}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={exportToPDF}
              disabled={!modelA && !modelB}
            >
              <i className="bi bi-file-pdf me-1"></i>
              导出PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '20%' }}>参数</th>
                <th style={{ width: '30%' }}>{modelA || '-'}</th>
                <th style={{ width: '30%' }}>{modelB || '-'}</th>
                <th style={{ width: '20%', textAlign: 'center' }}>差异</th>
              </tr>
            </thead>
            <tbody>
              {paramRows.map(row => {
                const valueA = row.format ? row.format(paramsA[row.key]) : paramsA[row.key];
                const valueB = row.format ? row.format(paramsB[row.key]) : paramsB[row.key];

                // 跳过两边都没有值的行
                if (!valueA && !valueB) return null;

                const style = getDiffStyle(valueA, valueB);
                const diffPercent = calcDiffPercent(valueA, valueB);

                // 如果开启只显示差异，跳过相同的行
                if (showOnlyDifferences && !style.isDiff) return null;

                return (
                  <tr
                    key={row.key}
                    style={{ backgroundColor: style.bg }}
                  >
                    <td className="fw-bold">{row.label}</td>
                    <td style={{ color: style.isDiff ? style.color : 'inherit' }}>
                      {valueA || '-'}
                    </td>
                    <td style={{ color: style.isDiff ? style.color : 'inherit' }}>
                      {valueB || '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {diffPercent ? (
                        <Badge bg={diffPercent.startsWith('↑') ? 'success' : diffPercent.startsWith('↓') ? 'danger' : 'secondary'}>
                          {diffPercent}
                        </Badge>
                      ) : style.isDiff ? (
                        <Badge bg="warning" text="dark">不同</Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // 快速选择常用对比
  const quickCompares = [
    { a: 'HC300', b: 'HC400', label: 'HC300 vs HC400' },
    { a: 'HCD600', b: 'HCD800', label: 'HCD600 vs HCD800' },
    { a: 'HCM200', b: 'HCM300', label: 'HCM200 vs HCM300' },
  ];

  const handleQuickCompare = (a, b) => {
    setModelA(a);
    setModelB(b);
    setFileIndexA(0);
    setFileIndexB(0);
  };

  return (
    <div className="dwg-compare-view">
      {/* 工具栏 */}
      <Card className="mb-3">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              {renderModelSelector(modelA, setModelA, '选择型号 A', modelB)}
            </Col>
            <Col md={4}>
              {renderModelSelector(modelB, setModelB, '选择型号 B', modelA)}
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>快速对比</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {quickCompares.map(item => (
                    <Button
                      key={item.label}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuickCompare(item.a, item.b)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* 交换按钮 */}
          {modelA && modelB && (
            <div className="text-center mt-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  const tempModel = modelA;
                  const tempIndex = fileIndexA;
                  setModelA(modelB);
                  setFileIndexA(fileIndexB);
                  setModelB(tempModel);
                  setFileIndexB(tempIndex);
                }}
              >
                <i className="bi bi-arrow-left-right me-1"></i>
                交换位置
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 对比预览区 */}
      <Row>
        {/* 左侧 - 型号A */}
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>
                {dataA ? (
                  <>
                    <Badge bg={dataA.type === 'coupling' ? 'success' : 'primary'} className="me-2">
                      {dataA.type === 'coupling' ? '联轴器' : '齿轮箱'}
                    </Badge>
                    <strong>{modelA}</strong>
                  </>
                ) : '型号 A'}
              </span>
              {dataA && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const file = dataA.files[fileIndexA];
                    if (file) window.open(getDwgDownloadUrl(file.filePath), '_blank');
                  }}
                >
                  <i className="bi bi-download"></i>
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-2">
              {renderFileSelector(dataA, fileIndexA, setFileIndexA)}
              {renderPreview(dataA, fileIndexA, 'A')}
            </Card.Body>
          </Card>
        </Col>

        {/* 右侧 - 型号B */}
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>
                {dataB ? (
                  <>
                    <Badge bg={dataB.type === 'coupling' ? 'success' : 'primary'} className="me-2">
                      {dataB.type === 'coupling' ? '联轴器' : '齿轮箱'}
                    </Badge>
                    <strong>{modelB}</strong>
                  </>
                ) : '型号 B'}
              </span>
              {dataB && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    const file = dataB.files[fileIndexB];
                    if (file) window.open(getDwgDownloadUrl(file.filePath), '_blank');
                  }}
                >
                  <i className="bi bi-download"></i>
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-2">
              {renderFileSelector(dataB, fileIndexB, setFileIndexB)}
              {renderPreview(dataB, fileIndexB, 'B')}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 技术参数对比表 */}
      {renderComparisonTable()}

      {/* 使用说明 */}
      <Alert variant="secondary" className="mt-3">
        <i className="bi bi-lightbulb me-2"></i>
        <strong>使用说明:</strong>
        <ul className="mb-0 mt-2">
          <li>从下拉菜单中选择两个型号进行对比</li>
          <li>如果型号有多个DWG文件，可以切换查看不同文件</li>
          <li>点击下载按钮可下载原始DWG文件</li>
          <li>下方表格显示技术参数对比（如果数据可用）</li>
        </ul>
      </Alert>
    </div>
  );
};

export default DwgCompareView;
