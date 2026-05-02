// src/components/OutlineDrawingQuery/DataQualityPanel.js
// A+ 增强#8：DWG 数据质量面板 — 覆盖率 + 缺口 TOP10 + 简易可视化
import React, { useMemo } from 'react';
import { Card, Row, Col, ProgressBar, Table, Badge, Alert } from 'react-bootstrap';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  dwgSeriesInfo
} from '../../data/dwgDrawings';

/**
 * @param {Object} props
 * @param {Array<{model:string, series?:string}>} props.allModels  全量型号库
 */
const DataQualityPanel = ({ allModels = [] }) => {
  const stats = useMemo(() => {
    const gearboxCovered = new Set(Object.keys(gearboxDwgDrawings));
    const couplingCovered = new Set(Object.keys(couplingDwgDrawings));
    const total = allModels.length || 1;

    const coveredCount = allModels.filter(
      (m) => gearboxCovered.has(m.model) || couplingCovered.has(m.model)
    ).length;

    // 系列维度统计
    const seriesMap = {};
    allModels.forEach((m) => {
      const s = m.series || '其他';
      if (!seriesMap[s]) seriesMap[s] = { total: 0, covered: 0 };
      seriesMap[s].total++;
      if (gearboxCovered.has(m.model) || couplingCovered.has(m.model)) {
        seriesMap[s].covered++;
      }
    });

    // 缺口 TOP10：按系列总数倒序
    const gaps = Object.entries(seriesMap)
      .map(([s, v]) => ({
        series: s,
        total: v.total,
        covered: v.covered,
        missing: v.total - v.covered,
        rate: v.total ? (v.covered / v.total) * 100 : 0
      }))
      .sort((a, b) => b.missing - a.missing)
      .slice(0, 10);

    return {
      total,
      coveredCount,
      coverageRate: (coveredCount / total) * 100,
      gearboxFiles: Array.from(gearboxCovered).length,
      couplingFiles: Array.from(couplingCovered).length,
      gaps
    };
  }, [allModels]);

  return (
    <Card>
      <Card.Header>
        <i className="bi bi-clipboard-data me-2" aria-hidden="true"></i>
        DWG 数据质量
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <small className="text-muted d-block mb-1">总覆盖率</small>
            <ProgressBar
              now={stats.coverageRate}
              label={`${stats.coverageRate.toFixed(1)}%`}
              variant={stats.coverageRate >= 50 ? 'success' : stats.coverageRate >= 20 ? 'warning' : 'danger'}
              aria-label={`总覆盖率 ${stats.coverageRate.toFixed(1)}%`}
            />
            <small className="text-muted">
              {stats.coveredCount} / {stats.total} 个型号有图
            </small>
          </Col>
          <Col md={4}>
            <small className="text-muted d-block mb-1">齿轮箱 DWG</small>
            <h4 className="mb-0">{stats.gearboxFiles}</h4>
            <small className="text-muted">条记录</small>
          </Col>
          <Col md={4}>
            <small className="text-muted d-block mb-1">联轴器 DWG</small>
            <h4 className="mb-0">{stats.couplingFiles}</h4>
            <small className="text-muted">条记录</small>
          </Col>
        </Row>

        {stats.gaps.length === 0 ? (
          <Alert variant="success" className="mb-0">
            <i className="bi bi-check-circle me-1" aria-hidden="true"></i>所有系列均无缺口
          </Alert>
        ) : (
          <>
            <h6>缺口 TOP {stats.gaps.length} (按缺失数量)</h6>
            <Table size="sm" hover responsive>
              <thead>
                <tr>
                  <th>系列</th>
                  <th>系列名</th>
                  <th>覆盖率</th>
                  <th>缺失</th>
                  <th>合计</th>
                </tr>
              </thead>
              <tbody>
                {stats.gaps.map((g) => (
                  <tr key={g.series}>
                    <td><Badge bg="primary">{g.series}</Badge></td>
                    <td>{dwgSeriesInfo[g.series]?.name || `${g.series}系列`}</td>
                    <td style={{ minWidth: 120 }}>
                      <ProgressBar
                        now={g.rate}
                        label={`${g.rate.toFixed(0)}%`}
                        variant={g.rate >= 50 ? 'success' : g.rate >= 20 ? 'warning' : 'danger'}
                        style={{ height: 14 }}
                      />
                    </td>
                    <td>
                      <Badge bg={g.missing > 0 ? 'danger' : 'success'}>{g.missing}</Badge>
                    </td>
                    <td>{g.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <small className="text-muted">
              提示：缺失数据可由 CAD 工程师补录，或运行 <code>node scripts/audit-dwg-coverage.js</code> 生成补录提案。
            </small>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataQualityPanel;
