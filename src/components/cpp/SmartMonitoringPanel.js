// src/components/cpp/SmartMonitoringPanel.js
// 智能监控面板组件 v1.0
// 显示传感器配置、预测性维护、远程监控信息
// 更新日期: 2026-01-09

import React, { useState, useMemo } from 'react';
import {
  SMART_MONITORING_SENSORS,
  REMOTE_MONITORING_PROTOCOLS
} from '../../data/cppSystemData';

/**
 * 智能监控面板
 * 显示传感器配置、预测性维护参数、远程监控接口
 */
const SmartMonitoringPanel = ({
  gearbox,             // 齿轮箱数据
  propeller = null,    // 调距桨数据（可选）
  operatingHours = 0,  // 累计运行小时
  showRecommendations = true  // 是否显示维护建议
}) => {
  const [activeSection, setActiveSection] = useState('sensors');

  // 获取智能监控配置
  const smartMonitoring = gearbox?.smartMonitoring || {};
  const predictiveMaintenance = smartMonitoring.predictiveMaintenance || {};
  const remoteMonitoring = smartMonitoring.remoteMonitoring || {};

  // 计算维护状态
  // 默认值来源: 行业标准MTBF 25000h, 轴承L10寿命 40000h, 密封件5年
  const maintenanceStatus = useMemo(() => {
    // 早返回: 没有设置保养间隔或间隔<=0则不计算
    const interval = predictiveMaintenance.maintenanceInterval;
    if (!interval || interval <= 0) return null;

    // 使用行业标准默认值防止除零，0或负值使用默认值
    const mtbf = (predictiveMaintenance.mtbf > 0) ? predictiveMaintenance.mtbf : 25000;
    const bearingLife = (predictiveMaintenance.bearingLife > 0) ? predictiveMaintenance.bearingLife : 40000;
    const sealLife = (predictiveMaintenance.sealLife > 0) ? predictiveMaintenance.sealLife : 5;

    // 下次保养剩余小时
    const hoursUntilMaintenance = interval - (operatingHours % interval);
    const maintenanceProgress = ((operatingHours % interval) / interval) * 100;

    // 轴承寿命
    const bearingRemaining = Math.max(0, bearingLife - operatingHours);
    const bearingProgress = (operatingHours / bearingLife) * 100;

    // 密封件寿命（按年计算，假设年运行4000小时）
    const annualHours = 4000;
    const sealRemainingYears = Math.max(0, sealLife - (operatingHours / annualHours));
    const sealProgress = ((operatingHours / annualHours) / sealLife) * 100;

    // MTBF状态
    const mtbfProgress = (operatingHours / mtbf) * 100;

    return {
      hoursUntilMaintenance,
      maintenanceProgress,
      bearingRemaining,
      bearingProgress,
      sealRemainingYears: Math.round(sealRemainingYears * 10) / 10,
      sealProgress,
      mtbfProgress,
      operatingHours,
      interval,
      mtbf,
      bearingLife,
      sealLife
    };
  }, [predictiveMaintenance, operatingHours]);

  // 生成维护建议
  const recommendations = useMemo(() => {
    if (!maintenanceStatus || !showRecommendations) return [];

    const recs = [];

    // 定期保养提醒
    if (maintenanceStatus.hoursUntilMaintenance < 500) {
      recs.push({
        type: 'warning',
        title: '即将到期保养',
        message: `距离下次定期保养还有 ${maintenanceStatus.hoursUntilMaintenance} 小时`,
        action: '安排保养计划'
      });
    }

    // 轴承寿命提醒
    if (maintenanceStatus.bearingProgress > 80) {
      recs.push({
        type: maintenanceStatus.bearingProgress > 95 ? 'error' : 'warning',
        title: '轴承寿命警告',
        message: `轴承已使用 ${maintenanceStatus.bearingProgress.toFixed(0)}% 寿命`,
        action: '准备更换轴承'
      });
    }

    // 密封件寿命提醒
    if (maintenanceStatus.sealProgress > 70) {
      recs.push({
        type: maintenanceStatus.sealProgress > 90 ? 'error' : 'warning',
        title: '密封件检查',
        message: `密封件剩余寿命约 ${maintenanceStatus.sealRemainingYears} 年`,
        action: '检查密封状态'
      });
    }

    // MTBF提醒
    if (maintenanceStatus.mtbfProgress > 90) {
      recs.push({
        type: 'info',
        title: '接近MTBF',
        message: `累计运行已达MTBF的 ${maintenanceStatus.mtbfProgress.toFixed(0)}%`,
        action: '增加监控频率'
      });
    }

    return recs;
  }, [maintenanceStatus, showRecommendations]);

  // 获取传感器状态颜色
  const getSensorStatusColor = (status) => {
    const colors = {
      active: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      offline: '#d9d9d9'
    };
    return colors[status] || '#d9d9d9';
  };

  if (!gearbox) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h4 style={styles.title}>智能监控</h4>
        </div>
        <div style={styles.empty}>请先选择齿轮箱</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 标题栏 */}
      <div style={styles.header}>
        <h4 style={styles.title}>智能监控</h4>
        <span style={styles.modelBadge}>{gearbox.model}</span>
      </div>

      {/* 维护建议 */}
      {recommendations.length > 0 && (
        <div style={styles.recommendationsSection}>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              style={{
                ...styles.recommendationCard,
                borderLeftColor: rec.type === 'error' ? '#ff4d4f' :
                                rec.type === 'warning' ? '#faad14' : '#1890ff'
              }}
            >
              <div style={styles.recHeader}>
                <span style={{
                  ...styles.recIcon,
                  background: rec.type === 'error' ? '#ff4d4f' :
                             rec.type === 'warning' ? '#faad14' : '#1890ff'
                }}>
                  {rec.type === 'error' ? '!' : rec.type === 'warning' ? '!' : 'i'}
                </span>
                <span style={styles.recTitle}>{rec.title}</span>
              </div>
              <div style={styles.recMessage}>{rec.message}</div>
              <div style={styles.recAction}>{rec.action}</div>
            </div>
          ))}
        </div>
      )}

      {/* 选项卡 */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'sensors' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('sensors')}
        >
          传感器
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'maintenance' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('maintenance')}
        >
          预测维护
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'remote' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('remote')}
        >
          远程监控
        </button>
      </div>

      {/* 传感器面板 */}
      {activeSection === 'sensors' && (
        <div style={styles.sectionContent}>
          {/* 螺距传感器 */}
          {smartMonitoring.pitchSensor && (
            <SensorCard
              icon="◎"
              name="螺距传感器"
              type={smartMonitoring.pitchSensor.type}
              accuracy={smartMonitoring.pitchSensor.accuracy}
              status="active"
              description={SMART_MONITORING_SENSORS.pitchSensor?.description}
            />
          )}

          {/* 振动传感器 */}
          {smartMonitoring.vibrationSensor && (
            <SensorCard
              icon="〰"
              name="振动传感器"
              type={smartMonitoring.vibrationSensor.type}
              range={smartMonitoring.vibrationSensor.range}
              status="active"
              description={SMART_MONITORING_SENSORS.vibrationSensor?.description}
            />
          )}

          {/* 温度传感器 */}
          {Array.isArray(smartMonitoring.temperatureSensors) && smartMonitoring.temperatureSensors.length > 0 && (
            <div style={styles.sensorCard}>
              <div style={styles.sensorHeader}>
                <span style={styles.sensorIcon}>🌡</span>
                <span style={styles.sensorName}>温度传感器组</span>
                <span style={{
                  ...styles.sensorStatus,
                  background: getSensorStatusColor('active')
                }}>
                  在线
                </span>
              </div>
              <div style={styles.tempSensors}>
                {smartMonitoring.temperatureSensors.map((sensor, index) => (
                  <span key={index} style={styles.tempSensorItem}>
                    {getTempSensorName(sensor)}
                  </span>
                ))}
              </div>
              <div style={styles.sensorDesc}>
                {SMART_MONITORING_SENSORS.temperatureSensor?.description}
              </div>
            </div>
          )}

          {/* 油液监测 */}
          {smartMonitoring.oilConditionMonitoring && (
            <SensorCard
              icon="💧"
              name="油液状态监测"
              type="在线监测"
              status="active"
              features={['油温', '油压', '颗粒计数', '水分含量']}
              description={SMART_MONITORING_SENSORS.oilConditionMonitor?.description}
            />
          )}

          {/* 传感器规格表 */}
          <div style={styles.specTable}>
            <div style={styles.specTitle}>传感器规格参考</div>
            <div style={styles.specGrid}>
              {Object.entries(SMART_MONITORING_SENSORS).slice(0, 4).map(([key, sensor]) => (
                <div key={key} style={styles.specItem}>
                  <div style={styles.specName}>{sensor.name}</div>
                  <div style={styles.specType}>{sensor.type}</div>
                  {sensor.accuracy && (
                    <div style={styles.specAccuracy}>精度: {sensor.accuracy}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 预测维护面板 */}
      {activeSection === 'maintenance' && maintenanceStatus && (
        <div style={styles.sectionContent}>
          {/* 运行时间 */}
          <div style={styles.operatingHours}>
            <div style={styles.hoursValue}>{operatingHours.toLocaleString()}</div>
            <div style={styles.hoursLabel}>累计运行小时</div>
          </div>

          {/* 维护进度 */}
          <div style={styles.maintenanceCards}>
            {/* 定期保养 */}
            <MaintenanceCard
              title="定期保养"
              current={operatingHours % maintenanceStatus.interval}
              max={maintenanceStatus.interval}
              remaining={maintenanceStatus.hoursUntilMaintenance}
              unit="小时"
              color="#1890ff"
            />

            {/* 轴承寿命 */}
            <MaintenanceCard
              title="轴承寿命"
              current={operatingHours}
              max={maintenanceStatus.bearingLife}
              remaining={maintenanceStatus.bearingRemaining}
              unit="小时"
              color={maintenanceStatus.bearingProgress > 80 ? '#ff4d4f' : '#52c41a'}
            />

            {/* 密封件寿命 */}
            <MaintenanceCard
              title="密封件寿命"
              current={maintenanceStatus.sealProgress}
              max={100}
              remaining={maintenanceStatus.sealRemainingYears}
              unit="年"
              color={maintenanceStatus.sealProgress > 70 ? '#faad14' : '#52c41a'}
              isPercent={true}
            />

            {/* MTBF */}
            <MaintenanceCard
              title="MTBF"
              current={operatingHours}
              max={maintenanceStatus.mtbf}
              remaining={Math.max(0, maintenanceStatus.mtbf - operatingHours)}
              unit="小时"
              color="#722ed1"
            />
          </div>

          {/* 维护参数表 */}
          <div style={styles.paramsTable}>
            <div style={styles.paramsTitle}>维护参数</div>
            <div style={styles.paramsGrid}>
              <div style={styles.paramItem}>
                <span style={styles.paramLabel}>MTBF</span>
                <span style={styles.paramValue}>{predictiveMaintenance.mtbf || '-'} h</span>
              </div>
              <div style={styles.paramItem}>
                <span style={styles.paramLabel}>轴承设计寿命</span>
                <span style={styles.paramValue}>{predictiveMaintenance.bearingLife || '-'} h</span>
              </div>
              <div style={styles.paramItem}>
                <span style={styles.paramLabel}>密封件寿命</span>
                <span style={styles.paramValue}>{predictiveMaintenance.sealLife || '-'} 年</span>
              </div>
              <div style={styles.paramItem}>
                <span style={styles.paramLabel}>保养周期</span>
                <span style={styles.paramValue}>{predictiveMaintenance.maintenanceInterval || '-'} h</span>
              </div>
            </div>
          </div>

          {/* 维护计划表 */}
          <div style={styles.scheduleTable}>
            <div style={styles.scheduleTitle}>推荐维护计划</div>
            <div style={styles.scheduleList}>
              <ScheduleItem
                hours={500}
                action="更换润滑油、检查滤芯"
                type="routine"
              />
              <ScheduleItem
                hours={2000}
                action="检查轴承间隙、振动测量"
                type="routine"
              />
              <ScheduleItem
                hours={maintenanceStatus.interval}
                action="全面保养、更换易损件"
                type="major"
              />
              <ScheduleItem
                hours={maintenanceStatus.bearingLife * 0.8}
                action="评估轴承状态、准备更换"
                type="critical"
              />
            </div>
          </div>
        </div>
      )}

      {/* 预测维护面板 - 无数据提示 */}
      {activeSection === 'maintenance' && !maintenanceStatus && (
        <div style={styles.sectionContent}>
          <div style={styles.noDataHint}>
            <div style={styles.noDataIcon}>⚙️</div>
            <div style={styles.noDataTitle}>预测维护参数未配置</div>
            <div style={styles.noDataDesc}>
              当前齿轮箱未配置预测维护参数(MTBF、轴承寿命、保养周期等)。
              <br />
              这些参数通常由制造商提供，可联系供应商获取详细维护规程。
            </div>
          </div>
        </div>
      )}

      {/* 远程监控面板 */}
      {activeSection === 'remote' && (
        <div style={styles.sectionContent}>
          {/* 协议支持 */}
          <div style={styles.protocolsSection}>
            <div style={styles.sectionTitle}>通信协议支持</div>
            <div style={styles.protocolGrid}>
              <ProtocolCard
                name="NMEA 2000"
                supported={remoteMonitoring.nmea2000}
                description={REMOTE_MONITORING_PROTOCOLS.nmea2000?.description}
                icon="🔌"
              />
              <ProtocolCard
                name="CAN Bus"
                supported={remoteMonitoring.canbus}
                description={REMOTE_MONITORING_PROTOCOLS.canbus?.description}
                icon="📡"
              />
              <ProtocolCard
                name="PROFINET"
                supported={remoteMonitoring.profinet}
                description={REMOTE_MONITORING_PROTOCOLS.profinet?.description}
                icon="🌐"
              />
              <ProtocolCard
                name="卫星通信"
                supported={remoteMonitoring.satellite}
                description={REMOTE_MONITORING_PROTOCOLS.satellite?.description}
                icon="🛰"
              />
            </div>
          </div>

          {/* 监控能力 */}
          <div style={styles.capabilitiesSection}>
            <div style={styles.sectionTitle}>远程监控能力</div>
            <div style={styles.capabilitiesList}>
              <CapabilityItem
                name="实时数据传输"
                enabled={remoteMonitoring.nmea2000 || remoteMonitoring.canbus}
              />
              <CapabilityItem
                name="故障预警推送"
                enabled={remoteMonitoring.nmea2000 || remoteMonitoring.profinet}
              />
              <CapabilityItem
                name="远程诊断"
                enabled={remoteMonitoring.profinet}
              />
              <CapabilityItem
                name="岸基监控"
                enabled={remoteMonitoring.satellite}
              />
              <CapabilityItem
                name="历史数据分析"
                enabled={true}
              />
              <CapabilityItem
                name="维护计划同步"
                enabled={remoteMonitoring.profinet || remoteMonitoring.satellite}
              />
            </div>
          </div>

          {/* 连接状态 */}
          <div style={styles.connectionStatus}>
            <div style={styles.connectionHeader}>
              <span style={styles.connectionDot} />
              <span>连接状态模拟</span>
            </div>
            <div style={styles.connectionInfo}>
              <div>数据更新频率: 1Hz</div>
              <div>最后更新: {new Date().toLocaleTimeString()}</div>
              <div>信号质量: 良好</div>
            </div>
          </div>
        </div>
      )}

      {/* 产品信息 */}
      <div style={styles.productInfo}>
        <span>型号: {gearbox.model}</span>
        <span>系列: {gearbox.series}</span>
        <span>最大功率: {gearbox.maxPower} kW</span>
      </div>
    </div>
  );
};

/**
 * 传感器卡片组件
 */
const SensorCard = ({ icon, name, type, accuracy, range, status, features, description }) => (
  <div style={styles.sensorCard}>
    <div style={styles.sensorHeader}>
      <span style={styles.sensorIcon}>{icon}</span>
      <span style={styles.sensorName}>{name}</span>
      <span style={{
        ...styles.sensorStatus,
        background: status === 'active' ? '#52c41a' : '#d9d9d9'
      }}>
        {status === 'active' ? '在线' : '离线'}
      </span>
    </div>
    <div style={styles.sensorDetails}>
      {type && <span>类型: {type}</span>}
      {accuracy && <span>精度: {accuracy}</span>}
      {range && <span>范围: {range}</span>}
    </div>
    {features && (
      <div style={styles.sensorFeatures}>
        {features.map((f, i) => (
          <span key={i} style={styles.featureTag}>{f}</span>
        ))}
      </div>
    )}
    {description && <div style={styles.sensorDesc}>{description}</div>}
  </div>
);

/**
 * 维护卡片组件
 */
const MaintenanceCard = ({ title, current, max, remaining, unit, color, isPercent = false }) => {
  const progress = isPercent ? current : (current / max) * 100;

  return (
    <div style={styles.maintenanceCard}>
      <div style={styles.mcTitle}>{title}</div>
      <div style={styles.mcProgress}>
        <div style={styles.mcProgressBg}>
          <div style={{
            ...styles.mcProgressFill,
            width: `${Math.min(100, progress)}%`,
            background: color
          }} />
        </div>
      </div>
      <div style={styles.mcInfo}>
        <span style={styles.mcRemaining}>
          剩余: {typeof remaining === 'number' ? remaining.toLocaleString() : remaining} {unit}
        </span>
        <span style={styles.mcPercent}>{progress.toFixed(0)}%</span>
      </div>
    </div>
  );
};

/**
 * 维护计划项组件
 */
const ScheduleItem = ({ hours, action, type }) => (
  <div style={{
    ...styles.scheduleItem,
    borderLeftColor: type === 'critical' ? '#ff4d4f' :
                     type === 'major' ? '#faad14' : '#1890ff'
  }}>
    <div style={styles.scheduleHours}>{hours.toLocaleString()} h</div>
    <div style={styles.scheduleAction}>{action}</div>
  </div>
);

/**
 * 协议卡片组件
 */
const ProtocolCard = ({ name, supported, description, icon }) => (
  <div style={{
    ...styles.protocolCard,
    opacity: supported ? 1 : 0.5
  }}>
    <div style={styles.protocolHeader}>
      <span style={styles.protocolIcon}>{icon}</span>
      <span style={styles.protocolName}>{name}</span>
      <span style={{
        ...styles.protocolStatus,
        background: supported ? '#52c41a' : '#d9d9d9'
      }}>
        {supported ? '✓' : '✗'}
      </span>
    </div>
    {description && <div style={styles.protocolDesc}>{description}</div>}
  </div>
);

/**
 * 能力项组件
 */
const CapabilityItem = ({ name, enabled }) => (
  <div style={styles.capabilityItem}>
    <span style={{
      ...styles.capabilityIcon,
      color: enabled ? '#52c41a' : '#d9d9d9'
    }}>
      {enabled ? '✓' : '○'}
    </span>
    <span style={{
      ...styles.capabilityName,
      color: enabled ? '#333' : '#999'
    }}>
      {name}
    </span>
  </div>
);

/**
 * 获取温度传感器名称
 */
function getTempSensorName(sensor) {
  const names = {
    oil: '油温',
    bearing: '轴承',
    blade: '桨叶',
    gearbox: '箱体',
    input: '输入轴',
    output: '输出轴'
  };
  return names[sensor] || sensor;
}

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
  modelBadge: {
    padding: '4px 12px',
    background: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px'
  },
  noDataHint: {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#fafafa',
    borderRadius: '8px',
    border: '1px dashed #d9d9d9'
  },
  noDataIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  noDataTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    marginBottom: '8px'
  },
  noDataDesc: {
    fontSize: '12px',
    color: '#999',
    lineHeight: '1.6'
  },
  recommendationsSection: {
    marginBottom: '16px'
  },
  recommendationCard: {
    padding: '12px 16px',
    background: '#fafafa',
    borderRadius: '4px',
    borderLeft: '4px solid',
    marginBottom: '8px'
  },
  recHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  recIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  recTitle: {
    fontWeight: '500',
    fontSize: '13px'
  },
  recMessage: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px'
  },
  recAction: {
    fontSize: '11px',
    color: '#1890ff'
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px'
  },
  tab: {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#666',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },
  activeTab: {
    background: '#1890ff',
    color: '#fff'
  },
  sectionContent: {
    minHeight: '300px'
  },
  sensorCard: {
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  sensorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  sensorIcon: {
    fontSize: '18px'
  },
  sensorName: {
    flex: 1,
    fontWeight: '500',
    fontSize: '13px'
  },
  sensorStatus: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '10px'
  },
  sensorDetails: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px'
  },
  sensorFeatures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '8px'
  },
  featureTag: {
    padding: '2px 8px',
    background: '#e6f7ff',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#1890ff'
  },
  sensorDesc: {
    fontSize: '11px',
    color: '#999'
  },
  tempSensors: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px'
  },
  tempSensorItem: {
    padding: '4px 10px',
    background: '#fff',
    borderRadius: '4px',
    fontSize: '12px',
    border: '1px solid #eee'
  },
  specTable: {
    marginTop: '16px',
    padding: '12px',
    background: '#f0f5ff',
    borderRadius: '8px'
  },
  specTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '12px'
  },
  specGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  specItem: {
    padding: '8px',
    background: '#fff',
    borderRadius: '4px'
  },
  specName: {
    fontSize: '12px',
    fontWeight: '500'
  },
  specType: {
    fontSize: '11px',
    color: '#666'
  },
  specAccuracy: {
    fontSize: '10px',
    color: '#1890ff'
  },
  operatingHours: {
    textAlign: 'center',
    padding: '20px',
    background: '#f0f7ff',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  hoursValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1890ff'
  },
  hoursLabel: {
    fontSize: '12px',
    color: '#666'
  },
  maintenanceCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px'
  },
  maintenanceCard: {
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  mcTitle: {
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  mcProgress: {
    marginBottom: '8px'
  },
  mcProgressBg: {
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  mcProgressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  mcInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px'
  },
  mcRemaining: {
    color: '#666'
  },
  mcPercent: {
    fontWeight: '500'
  },
  paramsTable: {
    marginBottom: '16px',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  paramsTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  paramsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  paramItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    background: '#fff',
    borderRadius: '4px'
  },
  paramLabel: {
    fontSize: '12px',
    color: '#666'
  },
  paramValue: {
    fontSize: '12px',
    fontWeight: '500'
  },
  scheduleTable: {
    padding: '12px',
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px'
  },
  scheduleTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  scheduleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    background: '#fafafa',
    borderRadius: '4px',
    borderLeft: '3px solid'
  },
  scheduleHours: {
    minWidth: '80px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#1890ff'
  },
  scheduleAction: {
    fontSize: '12px',
    color: '#333'
  },
  protocolsSection: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  protocolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  protocolCard: {
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    transition: 'opacity 0.2s'
  },
  protocolHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  protocolIcon: {
    fontSize: '16px'
  },
  protocolName: {
    flex: 1,
    fontSize: '13px',
    fontWeight: '500'
  },
  protocolStatus: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px'
  },
  protocolDesc: {
    fontSize: '11px',
    color: '#666'
  },
  capabilitiesSection: {
    marginBottom: '16px'
  },
  capabilitiesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  capabilityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#f9f9f9',
    borderRadius: '4px'
  },
  capabilityIcon: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  capabilityName: {
    fontSize: '12px'
  },
  connectionStatus: {
    padding: '12px',
    background: '#f0f7ff',
    borderRadius: '8px'
  },
  connectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '13px'
  },
  connectionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#52c41a',
    animation: 'pulse 2s infinite'
  },
  connectionInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: '#666'
  },
  productInfo: {
    marginTop: '16px',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '4px',
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: '#666'
  }
};

export default SmartMonitoringPanel;
