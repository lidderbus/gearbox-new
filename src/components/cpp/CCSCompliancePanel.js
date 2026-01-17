// src/components/cpp/CCSCompliancePanel.js
// CCS规范校核面板组件

import React, { useMemo } from 'react';
import { checkBladeStrength, checkCavitation } from '../../utils/cppHydrodynamics';

/**
 * CCS规范校核结果面板
 * 显示叶片强度、空泡校核、认证状态
 */
const CCSCompliancePanel = ({
  propeller,           // 调距桨数据
  operatingParams,     // 工况参数 {power, speed, diameter, Va, depth}
  gearbox = null       // 齿轮箱数据（可选）
}) => {
  // 叶片强度校核结果
  const strengthResult = useMemo(() => {
    if (!propeller || !operatingParams) return null;

    const { power, speed } = operatingParams;
    const D = operatingParams.diameter || propeller.diameterRange?.[1] || 3.0;
    const Z = propeller.bladeCount?.[0] || 4;

    return checkBladeStrength({
      power,
      n: speed / 60, // rpm -> rps
      D,
      Z,
      propellerStrength: propeller.strength,
      propellerGeometry: propeller.bladeGeometry
    });
  }, [propeller, operatingParams]);

  // 空泡校核结果
  const cavitationResult = useMemo(() => {
    if (!propeller || !operatingParams?.Va) return null;

    const { Va, depth = 3 } = operatingParams;
    const D = operatingParams.diameter || propeller.diameterRange?.[1] || 3.0;
    const n = operatingParams.speed / 60;

    return checkCavitation({
      Va,
      n,
      D,
      depth,
      pa: 101325, // 标准大气压
      pv: 2340,   // 25°C水蒸气压
      propellerCavitation: propeller.cavitation
    });
  }, [propeller, operatingParams]);

  // 认证信息
  const classification = propeller?.classification;
  const strength = propeller?.strength;

  // 计算总体合规状态
  const overallCompliance = useMemo(() => {
    const checks = [];

    // CCS认证
    if (classification?.ccsCompliant !== false && classification?.society === 'CCS') {
      checks.push({ name: 'CCS认证', pass: true });
    } else {
      checks.push({ name: 'CCS认证', pass: false });
    }

    // 强度校核
    if (strengthResult) {
      checks.push({ name: '叶片强度', pass: strengthResult.pass });
    }

    // 空泡校核
    if (cavitationResult) {
      checks.push({ name: '空泡裕度', pass: cavitationResult.pass });
    }

    // CCS材料符合性
    if (strength?.ccsCompliant) {
      checks.push({ name: '材料规范', pass: true });
    }

    const passCount = checks.filter(c => c.pass).length;
    const totalCount = checks.length;

    return {
      checks,
      passCount,
      totalCount,
      allPass: passCount === totalCount,
      status: passCount === totalCount ? '全部通过' :
              passCount > totalCount / 2 ? '部分通过' : '需要关注'
    };
  }, [classification, strengthResult, cavitationResult, strength]);

  if (!propeller) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h4 style={styles.title}>CCS规范校核</h4>
        </div>
        <div style={styles.empty}>请先选择调距桨</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 标题栏 */}
      <div style={styles.header}>
        <h4 style={styles.title}>CCS规范校核</h4>
        <span style={{
          ...styles.badge,
          background: overallCompliance.allPass ? '#52c41a' : '#faad14'
        }}>
          {overallCompliance.status}
        </span>
      </div>

      {/* 总体状态 */}
      <div style={styles.summaryBar}>
        <div style={styles.progressContainer}>
          <div style={{
            ...styles.progressBar,
            width: `${(overallCompliance.passCount / overallCompliance.totalCount) * 100}%`,
            background: overallCompliance.allPass ? '#52c41a' : '#faad14'
          }} />
        </div>
        <span style={styles.progressText}>
          {overallCompliance.passCount}/{overallCompliance.totalCount} 项通过
        </span>
      </div>

      {/* 校核项目列表 */}
      <div style={styles.checkList}>
        {overallCompliance.checks.map((check, index) => (
          <div key={index} style={styles.checkItem}>
            <span style={{
              ...styles.checkIcon,
              color: check.pass ? '#52c41a' : '#ff4d4f'
            }}>
              {check.pass ? '✓' : '✗'}
            </span>
            <span style={styles.checkName}>{check.name}</span>
          </div>
        ))}
      </div>

      {/* 认证信息 */}
      {classification && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>认证信息</div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>船级社</span>
              <span style={styles.infoValue}>{classification.society || '-'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>证书编号</span>
              <span style={styles.infoValue}>{classification.certificate || '-'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>冰区等级</span>
              <span style={{
                ...styles.infoValue,
                color: classification.iceClass ? '#1890ff' : '#999'
              }}>
                {classification.iceClass || '无'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>有效期至</span>
              <span style={styles.infoValue}>{classification.valid || '-'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 叶片强度校核 */}
      {strengthResult && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            叶片强度校核
            <span style={{
              ...styles.statusTag,
              background: strengthResult.pass ? '#d4edda' : '#f8d7da',
              color: strengthResult.pass ? '#155724' : '#721c24'
            }}>
              {strengthResult.pass ? '合格' : '不合格'}
            </span>
          </div>

          {/* 0.35R和0.60R截面 */}
          <div style={styles.strengthTable}>
            <div style={styles.strengthRow}>
              <div style={styles.strengthHeader}>截面</div>
              <div style={styles.strengthHeader}>最小厚度</div>
              <div style={styles.strengthHeader}>实际厚度</div>
              <div style={styles.strengthHeader}>裕度</div>
            </div>
            <div style={styles.strengthRow}>
              <div style={styles.strengthCell}>0.35R</div>
              <div style={styles.strengthCell}>{strengthResult.t035R?.minThickness?.toFixed(4) || '-'}</div>
              <div style={styles.strengthCell}>{strengthResult.t035R?.actualThickness?.toFixed(4) || '-'}</div>
              <div style={{
                ...styles.strengthCell,
                color: (strengthResult.t035R?.margin || 0) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {strengthResult.t035R?.margin?.toFixed(1) || '-'}%
              </div>
            </div>
            <div style={styles.strengthRow}>
              <div style={styles.strengthCell}>0.60R</div>
              <div style={styles.strengthCell}>{strengthResult.t060R?.minThickness?.toFixed(4) || '-'}</div>
              <div style={styles.strengthCell}>{strengthResult.t060R?.actualThickness?.toFixed(4) || '-'}</div>
              <div style={{
                ...styles.strengthCell,
                color: (strengthResult.t060R?.margin || 0) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {strengthResult.t060R?.margin?.toFixed(1) || '-'}%
              </div>
            </div>
          </div>

          {/* 材料信息 */}
          <div style={styles.materialInfo}>
            <span>材料: {strength?.material || 'NAB'}</span>
            <span>屈服强度: {strength?.yieldStrength || 245} MPa</span>
            <span>安全系数: {strength?.safetyFactor || 2.5}</span>
          </div>
        </div>
      )}

      {/* 空泡校核 */}
      {cavitationResult && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            空泡校核
            <span style={{
              ...styles.statusTag,
              background: cavitationResult.pass ? '#d4edda' : '#f8d7da',
              color: cavitationResult.pass ? '#155724' : '#721c24'
            }}>
              {cavitationResult.pass ? '合格' : '不合格'}
            </span>
          </div>

          <div style={styles.cavitationGrid}>
            <div style={styles.cavitationItem}>
              <div style={styles.cavitationLabel}>空泡数 (σ)</div>
              <div style={styles.cavitationValue}>{cavitationResult.sigma?.toFixed(3) || '-'}</div>
            </div>
            <div style={styles.cavitationItem}>
              <div style={styles.cavitationLabel}>临界空泡数</div>
              <div style={styles.cavitationValue}>{cavitationResult.criticalSigma?.toFixed(3) || '-'}</div>
            </div>
            <div style={styles.cavitationItem}>
              <div style={styles.cavitationLabel}>安全裕度</div>
              <div style={{
                ...styles.cavitationValue,
                color: parseFloat(cavitationResult.margin) >= 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {cavitationResult.margin || '-'}%
              </div>
            </div>
            <div style={styles.cavitationItem}>
              <div style={styles.cavitationLabel}>裕度系数</div>
              <div style={styles.cavitationValue}>{cavitationResult.marginFactor || 1.15}</div>
            </div>
          </div>

          {/* 空泡可视化 */}
          <div style={styles.cavitationBar}>
            <div style={styles.cavitationBarLabel}>空泡裕度</div>
            <div style={styles.cavitationBarContainer}>
              <div style={{
                ...styles.cavitationBarFill,
                width: `${Math.min(100, Math.max(0, parseFloat(cavitationResult.margin) + 50))}%`,
                background: parseFloat(cavitationResult.margin) >= 15 ? '#52c41a' :
                           parseFloat(cavitationResult.margin) >= 0 ? '#faad14' : '#ff4d4f'
              }} />
              <div style={styles.cavitationBarMarker} />
            </div>
            <div style={styles.cavitationBarScale}>
              <span>-50%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>
        </div>
      )}

      {/* CCS规范引用 */}
      <div style={styles.referenceSection}>
        <div style={styles.referenceTitle}>参考规范</div>
        <ul style={styles.referenceList}>
          <li>CCS钢质海船入级规范 2024/2025</li>
          <li>第3篇 轮机 第6章 螺旋桨</li>
          <li>第6.2节 桨叶厚度要求</li>
          <li>第6.3节 空泡性能要求</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * 简化版CCS校核摘要卡片
 */
export const CCSComplianceSummary = ({ propeller, compact = false }) => {
  const classification = propeller?.classification;
  const strength = propeller?.strength;

  if (!propeller) {
    return null;
  }

  const isCCSCompliant = classification?.society === 'CCS' && strength?.ccsCompliant;

  if (compact) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        background: isCCSCompliant ? '#d4edda' : '#fff3cd',
        color: isCCSCompliant ? '#155724' : '#856404'
      }}>
        {isCCSCompliant ? '✓ CCS' : '○ 非CCS'}
        {classification?.iceClass && ` | ${classification.iceClass}`}
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      background: '#f5f5f5',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <span style={{
        padding: '2px 8px',
        borderRadius: '4px',
        background: isCCSCompliant ? '#52c41a' : '#faad14',
        color: '#fff',
        fontWeight: 'bold'
      }}>
        {classification?.society || '无认证'}
      </span>
      {classification?.certificate && (
        <span>证书: {classification.certificate}</span>
      )}
      {classification?.iceClass && (
        <span style={{ color: '#1890ff' }}>
          冰区: {classification.iceClass}
        </span>
      )}
      {strength?.material && (
        <span>材料: {strength.material}</span>
      )}
    </div>
  );
};

/**
 * CCS校核警告组件
 */
export const CCSWarningBanner = ({ warnings = [] }) => {
  if (warnings.length === 0) return null;

  return (
    <div style={{
      padding: '12px 16px',
      background: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '4px',
      marginBottom: '16px'
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#856404'
      }}>
        CCS规范校核警告
      </div>
      <ul style={{
        margin: 0,
        paddingLeft: '20px',
        color: '#856404',
        fontSize: '13px'
      }}>
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
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
    marginBottom: '12px'
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
  checkList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    background: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '12px'
  },
  checkIcon: {
    fontWeight: 'bold'
  },
  checkName: {
    color: '#333'
  },
  section: {
    borderTop: '1px solid #eee',
    paddingTop: '12px',
    marginTop: '12px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333'
  },
  statusTag: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'normal'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 8px',
    background: '#f9f9f9',
    borderRadius: '4px',
    fontSize: '12px'
  },
  infoLabel: {
    color: '#666'
  },
  infoValue: {
    fontWeight: '500',
    color: '#333'
  },
  strengthTable: {
    border: '1px solid #eee',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  strengthRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    borderBottom: '1px solid #eee'
  },
  strengthHeader: {
    padding: '8px',
    background: '#f5f5f5',
    fontSize: '11px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666'
  },
  strengthCell: {
    padding: '8px',
    fontSize: '12px',
    textAlign: 'center'
  },
  materialInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: '#666'
  },
  cavitationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '12px'
  },
  cavitationItem: {
    textAlign: 'center',
    padding: '8px',
    background: '#f9f9f9',
    borderRadius: '4px'
  },
  cavitationLabel: {
    fontSize: '10px',
    color: '#666',
    marginBottom: '4px'
  },
  cavitationValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  },
  cavitationBar: {
    marginTop: '8px'
  },
  cavitationBarLabel: {
    fontSize: '11px',
    color: '#666',
    marginBottom: '4px'
  },
  cavitationBarContainer: {
    position: 'relative',
    height: '12px',
    background: 'linear-gradient(to right, #ff4d4f, #faad14, #52c41a)',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  cavitationBarFill: {
    height: '100%',
    borderRadius: '6px'
  },
  cavitationBarMarker: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '2px',
    background: '#333',
    transform: 'translateX(-50%)'
  },
  cavitationBarScale: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#999',
    marginTop: '2px'
  },
  referenceSection: {
    marginTop: '16px',
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
  }
};

export default CCSCompliancePanel;
