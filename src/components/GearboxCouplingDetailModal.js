import React, { useMemo, useState } from 'react';
import { Modal, Table, Badge, Tabs, Tab, Alert, Row, Col, Card, Button } from 'react-bootstrap';
import { detailedCouplingMappings, getTechImagesForGearbox } from '../data/hcCouplingData';

/**
 * 齿轮箱联轴器详情模态框
 * 显示指定齿轮箱系列的详细联轴器-接口配置信息
 */
const GearboxCouplingDetailModal = ({ show, onHide, gearboxModels, seriesName }) => {

  // 获取该系列所有型号的详细配置（去重合并）
  const detailedOptions = useMemo(() => {
    const options = {
      standard: [],
      withCover: [],
      detachable: [],
      gearTooth: []
    };

    if (!gearboxModels || gearboxModels.length === 0) {
      return options;
    }

    gearboxModels.forEach(model => {
      const mapping = detailedCouplingMappings[model];
      if (mapping) {
        Object.keys(options).forEach(type => {
          if (mapping[type] && Array.isArray(mapping[type])) {
            mapping[type].forEach(item => {
              // 去重：检查是否已存在相同型号
              if (!options[type].find(o => o.model === item.model)) {
                options[type].push({
                  ...item,
                  sourceGearbox: model // 记录来源齿轮箱
                });
              }
            });
          }
        });
      }
    });

    return options;
  }, [gearboxModels]);

  // 统计有数据的型号
  const modelsWithData = useMemo(() => {
    if (!gearboxModels) return [];
    return gearboxModels.filter(model => detailedCouplingMappings[model]);
  }, [gearboxModels]);

  // 获取技术图纸（去重）
  const techImages = useMemo(() => {
    if (!gearboxModels || gearboxModels.length === 0) return [];

    const imageMap = new Map();
    gearboxModels.forEach(model => {
      const images = getTechImagesForGearbox(model);
      images.forEach(img => {
        if (!imageMap.has(img.src)) {
          imageMap.set(img.src, img);
        }
      });
    });

    return Array.from(imageMap.values());
  }, [gearboxModels]);

  // 图片预览状态
  const [previewImage, setPreviewImage] = useState(null);

  // 接口类型表格组件
  const InterfaceTable = ({ items, type }) => {
    if (!items || items.length === 0) {
      return (
        <Alert variant="info" className="mt-3">
          该系列暂无{type === 'standard' ? '标准' : type === 'withCover' ? '带罩' : type === 'detachable' ? '可拆式' : '齿形块'}配置数据
        </Alert>
      );
    }

    return (
      <Table striped bordered hover size="sm" className="mt-3">
        <thead className="table-dark">
          <tr>
            <th style={{ width: '35%' }}>联轴器型号</th>
            <th style={{ width: '45%' }}>接口规格</th>
            <th style={{ width: '20%' }}>适用齿轮箱</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <Badge bg="primary" className="me-1">{item.model}</Badge>
              </td>
              <td>
                {item.interface ? (
                  <span className={item.interface.includes('SAE') ? 'text-success' : 'text-info'}>
                    {item.interface}
                  </span>
                ) : '-'}
              </td>
              <td>
                <small className="text-muted">{item.sourceGearbox}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  // Tab标题带数量
  const getTabTitle = (type, count) => {
    const titles = {
      standard: '标准配置',
      withCover: '带罩配置',
      detachable: '可拆式',
      gearTooth: '齿形块'
    };
    return `${titles[type]} (${count})`;
  };

  // 总数统计
  const totalCount = detailedOptions.standard.length +
                     detailedOptions.withCover.length +
                     detailedOptions.detachable.length +
                     detailedOptions.gearTooth.length;

  return (
    <>
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-gear-wide-connected me-2"></i>
          {seriesName}系列 - 详细联轴器配置
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* 系列信息摘要 */}
        <div className="mb-3 p-2 bg-light rounded">
          <small className="text-muted">
            <strong>包含型号:</strong> {gearboxModels?.join(', ') || '-'}
            <br />
            <strong>有数据型号:</strong> {modelsWithData.length > 0 ? modelsWithData.join(', ') : '暂无'}
            <br />
            <strong>联轴器选项:</strong> 共 {totalCount} 种配置
          </small>
        </div>

        {totalCount === 0 ? (
          <Alert variant="warning">
            <Alert.Heading>暂无详细配置数据</Alert.Heading>
            <p>
              该系列齿轮箱暂未录入详细的联轴器-接口映射数据。
              请联系技术部门获取更多信息。
            </p>
          </Alert>
        ) : (
          <Tabs defaultActiveKey="standard" id="coupling-detail-tabs" className="mb-3">
            <Tab
              eventKey="standard"
              title={getTabTitle('standard', detailedOptions.standard.length)}
            >
              <InterfaceTable items={detailedOptions.standard} type="standard" />
            </Tab>

            <Tab
              eventKey="withCover"
              title={getTabTitle('withCover', detailedOptions.withCover.length)}
            >
              <InterfaceTable items={detailedOptions.withCover} type="withCover" />
            </Tab>

            <Tab
              eventKey="detachable"
              title={getTabTitle('detachable', detailedOptions.detachable.length)}
            >
              <InterfaceTable items={detailedOptions.detachable} type="detachable" />
            </Tab>

            {detailedOptions.gearTooth.length > 0 && (
              <Tab
                eventKey="gearTooth"
                title={getTabTitle('gearTooth', detailedOptions.gearTooth.length)}
              >
                <InterfaceTable items={detailedOptions.gearTooth} type="gearTooth" />
              </Tab>
            )}

            {/* 技术图纸Tab */}
            {techImages.length > 0 && (
              <Tab
                eventKey="techDrawings"
                title={`技术图纸 (${techImages.length})`}
              >
                <Row className="mt-3 g-3">
                  {techImages.map((img, idx) => (
                    <Col md={6} key={idx}>
                      <Card className="h-100 shadow-sm">
                        <Card.Img
                          variant="top"
                          src={img.src}
                          style={{
                            cursor: 'zoom-in',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            backgroundColor: '#f8f9fa'
                          }}
                          onClick={() => setPreviewImage(img)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          style={{
                            display: 'none',
                            height: '200px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            color: '#6c757d'
                          }}
                        >
                          <i className="bi bi-image fs-1"></i>
                        </div>
                        <Card.Body className="py-2">
                          <Card.Title style={{ fontSize: '0.9rem' }}>
                            {img.title}
                          </Card.Title>
                          <Card.Text style={{ fontSize: '0.8rem' }} className="text-muted">
                            {img.description}
                          </Card.Text>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => window.open(img.src, '_blank')}
                          >
                            <i className="bi bi-zoom-in me-1"></i>
                            查看原图
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab>
            )}
          </Tabs>
        )}

        {/* 接口说明 */}
        <div className="mt-3 p-2 border rounded" style={{ fontSize: '0.85em' }}>
          <strong>接口说明:</strong>
          <ul className="mb-0 mt-1">
            <li><span className="text-success">SAE接口</span>: 国际标准接口，如SAE14"、SAE16"、SAE18"、SAE21"</li>
            <li><span className="text-info">国内机接口</span>: 国产主机适配接口，如φ505、φ518、φ640等</li>
            <li><strong>X后缀</strong>: 可拆式联轴器</li>
            <li><strong>B后缀</strong>: 带罩壳配置</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <small className="text-muted me-auto">
          数据来源: HC高弹及主机配套汇总表
        </small>
        <button className="btn btn-secondary" onClick={onHide}>
          关闭
        </button>
      </Modal.Footer>
    </Modal>

    {/* 图片预览模态框 */}
    <Modal
        show={!!previewImage}
        onHide={() => setPreviewImage(null)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{previewImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {previewImage && (
            <img
              src={previewImage.src}
              alt={previewImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <small className="text-muted me-auto">
            {previewImage?.description}
          </small>
          <Button
            variant="primary"
            onClick={() => window.open(previewImage?.src, '_blank')}
          >
            <i className="bi bi-box-arrow-up-right me-1"></i>
            新窗口打开
          </Button>
          <Button variant="secondary" onClick={() => setPreviewImage(null)}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GearboxCouplingDetailModal;
