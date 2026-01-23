// src/components/cpp/ClassificationCompliancePanel.js
// 多船级社合规校核面板组件 v2.0
// 支持: CCS, DNV, LR, ABS, BV, RINA, NK, KR, ClassNK
// 更新日期: 2026-01-09

import React, { useState, useMemo } from 'react';
import {
  // checkBladeStrength, // 保留以备将来使用
  checkCavitation,
  checkClassificationCompliance,
  compareClassificationSocieties,
  getAllCertificationStatus,
  classificationRules
} from '../../utils/classificationCompliance';
import { IACS_CLASSIFICATION_SOCIETIES } from '../../data/cppSystemData';

/**
 * 多船级社合规校核面板
 * 支持船级社选择、对比、认证状态检查
 */
const ClassificationCompliancePanel = ({
  propeller,           // 调距桨数据
  gearbox,             // 齿轮箱数据
  operatingParams,     // 工况参数 {power, speed, diameter, Va, depth}
  defaultSociety = 'CCS',  // 默认船级社
  showComparison = false   // 是否显示多船级社对比
}) => {
  const [selectedSociety, setSelectedSociety] = useState(defaultSociety);
  const [showAllSocieties, setShowAllSocieties] = useState(showComparison);

  // 获取所有船级社列表
  const societyList = Object.keys(IACS_CLASSIFICATION_SOCIETIES);

  // 准备校核数据
  const propellerData = useMemo(() => {
    if (!propeller || !operatingParams) return null;

    const { power, speed, diameter, Va, depth = 3 } = operatingParams;
    const D = diameter || propeller.diameterRange?.[1] || 3.0;
    const n = speed / 60;  // rpm -> rps
    const Z = propeller.bladeCount?.[0] || 4;

    return {
      power,
      n,
      D,
      Z,
      Va,
      depth,
      material: propeller.strength?.material || 'NAB',
      actualThickness: {
        r035: propeller.bladeGeometry?.thickness035R || 0.12,
        r060: propeller.bladeGeometry?.thickness060R || 0.08
      },
      vibration: propeller.vibration,
      noise: propeller.noise
    };
  }, [propeller, operatingParams]);

  // 当前船级社校核结果
  const complianceResult = useMemo(() => {
    if (!propellerData) return null;
    return checkClassificationCompliance(propellerData, selectedSociety);
  }, [propellerData, selectedSociety]);

  // 多船级社对比结果
  const comparisonResult = useMemo(() => {
    if (!propellerData || !showAllSocieties) return null;
    return compareClassificationSocieties(propellerData);
  }, [propellerData, showAllSocieties]);

  // 认证状态
  const certificationStatus = useMemo(() => {
    const certifications = gearbox?.certifications || propeller?.certifications;
    if (!certifications) return null;
    return getAllCertificationStatus(certifications);
  }, [gearbox, propeller]);

  // 获取船级社标志颜色
  const getSocietyColor = (code) => {
    const colors = {
      CCS: '#e60012',  // 红色
      DNV: '#003366',  // 深蓝
      LR: '#003c71',   // 蓝色
      ABS: '#005a9c',  // 蓝色
      BV: '#ff6600',   // 橙色
      RINA: '#00563f', // 绿色
      NK: '#c41e3a',   // 红色
      KR: '#0066b3',   // 蓝色
      ClassNK: '#c41e3a'
    };
    return colors[code] || '#666';
  };

  if (!propeller) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h4 style={styles.title}>船级社合规校核</h4>
        </div>
        <div style={styles.empty}>请先选择调距桨</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 标题栏 */}
      <div style={styles.header}>
        <h4 style={styles.title}>船级社合规校核</h4>
        {complianceResult && (
          <span style={{
            ...styles.badge,
            background: complianceResult.pass ? '#52c41a' : '#faad14'
          }}>
            {complianceResult.pass ? '全部通过' : '部分通过'}
          </span>
        )}
      </div>

      {/* 船级社选择器 */}
      <div style={styles.societySelector}>
        <label style={styles.selectorLabel}>选择船级社:</label>
        <select
          value={selectedSociety}
          onChange={(e) => setSelectedSociety(e.target.value)}
          style={styles.select}
        >
          {societyList.map(code => (
            <option key={code} value={code}>
              {IACS_CLASSIFICATION_SOCIETIES[code].name} ({code})
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAllSocieties(!showAllSocieties)}
          style={{
            ...styles.compareButton,
            background: showAllSocieties ? '#1890ff' : '#f0f0f0',
            color: showAllSocieties ? '#fff' : '#666'
          }}
        >
          {showAllSocieties ? '隐藏对比' : '多社对比'}
        </button>
      </div>

      {/* 船级社信息 */}
      <div style={styles.societyInfo}>
        <div style={{
          ...styles.societyBadge,
          background: getSocietyColor(selectedSociety)
        }}>
          {selectedSociety}
        </div>
        <div style={styles.societyDetails}>
          <div style={styles.societyName}>
            {IACS_CLASSIFICATION_SOCIETIES[selectedSociety]?.fullName}
          </div>
          <div style={styles.rulesVersion}>
            {classificationRules[selectedSociety]?.rulesVersion}
          </div>
        </div>
      </div>

      {/* 认证状态 */}
      {certificationStatus && (
        <div style={styles.certificationSection}>
          <div style={styles.sectionTitle}>认证状态</div>
          <div style={styles.certGrid}>
            {societyList.map(code => {
              const status = certificationStatus.certifications[code];
              return (
                <div
                  key={code}
                  style={{
                    ...styles.certItem,
                    opacity: status?.certified ? 1 : 0.5,
                    borderColor: code === selectedSociety ? getSocietyColor(code) : '#eee'
                  }}
                >
                  <div style={{
                    ...styles.certBadge,
                    background: status?.valid ? '#52c41a' :
                               status?.certified ? '#faad14' : '#d9d9d9'
                  }}>
                    {code}
                  </div>
                  <div style={styles.certStatus}>
                    {status?.valid ? '有效' :
                     status?.certified ? '过期' : '未认证'}
                  </div>
                  {status?.expiringSoon && (
                    <div style={styles.certWarning}>
                      {status.daysRemaining}天后到期
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={styles.certSummary}>
            有效认证: {certificationStatus.summary.valid}/{certificationStatus.summary.total}
            {certificationStatus.summary.expiringSoon > 0 && (
              <span style={styles.expiringSoonWarning}>
                ({certificationStatus.summary.expiringSoon}个即将到期)
              </span>
            )}
          </div>
        </div>
      )}

      {/* 校核结果 */}
      {complianceResult && complianceResult.success && (
        <div style={styles.resultsSection}>
          <div style={styles.sectionTitle}>
            {complianceResult.societyName}校核结果
          </div>

          {/* 总体进度 */}
          <div style={styles.summaryBar}>
            <div style={styles.progressContainer}>
              <div style={{
                ...styles.progressBar,
                width: `${(complianceResult.summary.passed / complianceResult.summary.total) * 100}%`,
                background: complianceResult.pass ? '#52c41a' : '#faad14'
              }} />
            </div>
            <span style={styles.progressText}>
              {complianceResult.summary.passed}/{complianceResult.summary.total} 项通过
            </span>
          </div>

          {/* 各项校核详情 */}
          <div style={styles.checkDetails}>
            {/* 叶片强度 */}
            <CheckResultCard
              title="叶片强度"
              result={complianceResult.checks.bladeStrength}
              expanded={true}
            />

            {/* 空泡校核 */}
            <CheckResultCard
              title="空泡校核"
              result={complianceResult.checks.cavitation}
            />

            {/* 振动校核 */}
            <CheckResultCard
              title="振动校核"
              result={complianceResult.checks.vibration}
            />

            {/* 噪声校核 */}
            <CheckResultCard
              title="噪声校核"
              result={complianceResult.checks.noise}
            />
          </div>
        </div>
      )}

      {/* 多船级社对比 */}
      {showAllSocieties && comparisonResult && (
        <div style={styles.comparisonSection}>
          <div style={styles.sectionTitle}>多船级社对比</div>

          <div style={styles.comparisonTable}>
            <div style={styles.comparisonHeader}>
              <div style={styles.comparisonCell}>船级社</div>
              <div style={styles.comparisonCell}>强度</div>
              <div style={styles.comparisonCell}>空泡</div>
              <div style={styles.comparisonCell}>振动</div>
              <div style={styles.comparisonCell}>噪声</div>
              <div style={styles.comparisonCell}>结果</div>
            </div>

            {societyList.map(code => {
              const result = comparisonResult.results[code];
              if (!result || !result.success) return null;

              return (
                <div
                  key={code}
                  style={{
                    ...styles.comparisonRow,
                    background: code === selectedSociety ? '#f0f7ff' : 'transparent'
                  }}
                >
                  <div style={styles.comparisonCell}>
                    <span style={{
                      ...styles.miniSocietyBadge,
                      background: getSocietyColor(code)
                    }}>
                      {code}
                    </span>
                  </div>
                  <div style={styles.comparisonCell}>
                    <StatusIcon pass={result.checks.bladeStrength?.pass} />
                  </div>
                  <div style={styles.comparisonCell}>
                    <StatusIcon pass={result.checks.cavitation?.pass} />
                  </div>
                  <div style={styles.comparisonCell}>
                    <StatusIcon pass={result.checks.vibration?.pass} />
                  </div>
                  <div style={styles.comparisonCell}>
                    <StatusIcon pass={result.checks.noise?.pass} />
                  </div>
                  <div style={styles.comparisonCell}>
                    <span style={{
                      ...styles.resultBadge,
                      background: result.pass ? '#d4edda' : '#f8d7da',
                      color: result.pass ? '#155724' : '#721c24'
                    }}>
                      {result.pass ? '通过' : '不通过'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 对比建议 */}
          <div style={styles.comparisonSummary}>
            <strong>建议:</strong> {comparisonResult.recommendation}
          </div>
        </div>
      )}

      {/* 规范引用 */}
      <div style={styles.referenceSection}>
        <div style={styles.referenceTitle}>
          {IACS_CLASSIFICATION_SOCIETIES[selectedSociety]?.name} 规范引用
        </div>
        <ul style={styles.referenceList}>
          <li>{classificationRules[selectedSociety]?.rulesVersion}</li>
          <li>叶片强度计算方法: {classificationRules[selectedSociety]?.bladeStrengthMethod}</li>
          <li>空泡校核标准: {classificationRules[selectedSociety]?.cavitationStandard}</li>
          <li>空泡裕度要求: {classificationRules[selectedSociety]?.cavitationMargin}</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * 单项校核结果卡片
 */
const CheckResultCard = ({ title, result, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  if (!result) {
    return (
      <div style={styles.checkCard}>
        <div style={styles.checkCardHeader}>
          <span>{title}</span>
          <span style={styles.skippedTag}>跳过</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.checkCard}>
      <div
        style={styles.checkCardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={styles.checkCardTitle}>
          <StatusIcon pass={result.pass} />
          <span>{title}</span>
        </div>
        <span style={{
          ...styles.checkStatus,
          background: result.pass ? '#d4edda' : '#f8d7da',
          color: result.pass ? '#155724' : '#721c24'
        }}>
          {result.pass ? '通过' : '不通过'}
        </span>
      </div>

      {isExpanded && result.sections && (
        <div style={styles.checkCardBody}>
          {Object.entries(result.sections).map(([key, section]) => (
            <div key={key} style={styles.sectionRow}>
              <span style={styles.sectionLabel}>{section.section || key}</span>
              <span style={styles.sectionValue}>
                最小: {section.minThickness?.toFixed(4) || '-'}
              </span>
              <span style={styles.sectionValue}>
                实际: {section.actualThickness?.toFixed(4) || '-'}
              </span>
              <span style={{
                ...styles.sectionMargin,
                color: parseFloat(section.margin) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {section.margin}%
              </span>
            </div>
          ))}
        </div>
      )}

      {isExpanded && result.sigma !== undefined && (
        <div style={styles.checkCardBody}>
          <div style={styles.cavitationInfo}>
            <div>
              <span style={styles.infoLabel}>空泡数 (σ):</span>
              <span style={styles.infoValue}>{result.sigma}</span>
            </div>
            <div>
              <span style={styles.infoLabel}>要求值:</span>
              <span style={styles.infoValue}>{result.requiredSigma}</span>
            </div>
            <div>
              <span style={styles.infoLabel}>裕度:</span>
              <span style={{
                ...styles.infoValue,
                color: parseFloat(result.margin) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {result.margin}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 状态图标组件
 */
const StatusIcon = ({ pass }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: pass ? '#52c41a' : '#ff4d4f',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  }}>
    {pass ? '✓' : '✗'}
  </span>
);

/**
 * 简化版多船级社摘要卡片
 */
export const ClassificationSummaryCard = ({ gearbox, propeller, compact = false }) => {
  const certifications = gearbox?.certifications || propeller?.certifications;

  if (!certifications) {
    return compact ? null : (
      <div style={styles.summaryCard}>
        <span style={styles.noCertText}>无认证信息</span>
      </div>
    );
  }

  const validCerts = Object.entries(certifications)
    .filter(([_, cert]) => cert && cert.validity && new Date(cert.validity) > new Date())
    .map(([code]) => code);

  if (compact) {
    return (
      <div style={styles.compactSummary}>
        {validCerts.slice(0, 3).map(code => (
          <span key={code} style={styles.compactBadge}>{code}</span>
        ))}
        {validCerts.length > 3 && (
          <span style={styles.moreBadge}>+{validCerts.length - 3}</span>
        )}
      </div>
    );
  }

  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTitle}>船级社认证</div>
      <div style={styles.summaryBadges}>
        {validCerts.map(code => (
          <span key={code} style={styles.summaryBadge}>{code}</span>
        ))}
      </div>
      <div style={styles.summaryCount}>
        {validCerts.length}/{Object.keys(IACS_CLASSIFICATION_SOCIETIES).length} 有效
      </div>
    </div>
  );
};

// 样式定义
const styles = {
  container: {
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold'
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '20px'
  },
  societySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  selectorLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#333'
  },
  select: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #d9d9d9',
    fontSize: '13px',
    cursor: 'pointer'
  },
  compareButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  societyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    background: '#fafafa',
    borderRadius: '8px'
  },
  societyBadge: {
    padding: '8px 16px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  societyDetails: {
    flex: 1
  },
  societyName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  rulesVersion: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px'
  },
  certificationSection: {
    marginBottom: '16px',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333'
  },
  certGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 1fr)',
    gap: '8px',
    marginBottom: '8px'
  },
  certItem: {
    textAlign: 'center',
    padding: '8px 4px',
    background: '#fff',
    borderRadius: '4px',
    border: '2px solid #eee',
    transition: 'all 0.2s'
  },
  certBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  certStatus: {
    fontSize: '10px',
    color: '#666'
  },
  certWarning: {
    fontSize: '9px',
    color: '#faad14',
    marginTop: '2px'
  },
  certSummary: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center'
  },
  expiringSoonWarning: {
    color: '#faad14',
    marginLeft: '8px'
  },
  resultsSection: {
    marginBottom: '16px'
  },
  summaryBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  progressContainer: {
    flex: 1,
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  progressText: {
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap'
  },
  checkDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkCard: {
    border: '1px solid #eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  checkCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: '#fafafa',
    cursor: 'pointer'
  },
  checkCardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '500'
  },
  checkStatus: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px'
  },
  skippedTag: {
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#f0f0f0',
    color: '#999',
    fontSize: '11px'
  },
  checkCardBody: {
    padding: '12px',
    background: '#fff',
    borderTop: '1px solid #eee'
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '12px'
  },
  sectionLabel: {
    width: '60px',
    fontWeight: '500'
  },
  sectionValue: {
    flex: 1,
    color: '#666'
  },
  sectionMargin: {
    width: '60px',
    textAlign: 'right',
    fontWeight: '500'
  },
  cavitationInfo: {
    display: 'flex',
    gap: '24px',
    fontSize: '12px'
  },
  infoLabel: {
    color: '#666',
    marginRight: '8px'
  },
  infoValue: {
    fontWeight: '500'
  },
  comparisonSection: {
    marginBottom: '16px',
    padding: '12px',
    background: '#f0f7ff',
    borderRadius: '8px'
  },
  comparisonTable: {
    background: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px'
  },
  comparisonHeader: {
    display: 'grid',
    gridTemplateColumns: '80px repeat(4, 1fr) 80px',
    background: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '11px'
  },
  comparisonRow: {
    display: 'grid',
    gridTemplateColumns: '80px repeat(4, 1fr) 80px',
    borderTop: '1px solid #eee',
    fontSize: '12px'
  },
  comparisonCell: {
    padding: '10px 8px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniSocietyBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  resultBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px'
  },
  comparisonSummary: {
    fontSize: '12px',
    color: '#1890ff'
  },
  referenceSection: {
    padding: '12px',
    background: '#f0f5ff',
    borderRadius: '4px'
  },
  referenceTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '8px'
  },
  referenceList: {
    margin: 0,
    paddingLeft: '16px',
    fontSize: '11px',
    color: '#666',
    lineHeight: '1.6'
  },
  summaryCard: {
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '4px'
  },
  noCertText: {
    color: '#999',
    fontSize: '12px'
  },
  summaryTitle: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '8px'
  },
  summaryBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '8px'
  },
  summaryBadge: {
    padding: '2px 6px',
    background: '#52c41a',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  summaryCount: {
    fontSize: '11px',
    color: '#666'
  },
  compactSummary: {
    display: 'inline-flex',
    gap: '4px'
  },
  compactBadge: {
    padding: '2px 6px',
    background: '#52c41a',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  moreBadge: {
    padding: '2px 6px',
    background: '#d9d9d9',
    color: '#666',
    borderRadius: '4px',
    fontSize: '10px'
  }
};

export default ClassificationCompliancePanel;
