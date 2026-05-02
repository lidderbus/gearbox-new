// 算法依据小卡片 — 在推进系统各模块顶部展示采用的工业标准/规范
// 目标:让资深用户一眼看出本工具背后的力学/规范来源,提升专业可信度
import React, { useState } from 'react';
import { Card, Badge, Collapse, Button } from 'react-bootstrap';

const AlgorithmReferenceCard = ({ module, colors = {} }) => {
  const [open, setOpen] = useState(false);
  const refs = REFERENCES[module];
  if (!refs) return null;

  return (
    <Card
      className="mb-3"
      style={{
        borderLeft: `3px solid ${colors.primary || '#2e7d32'}`,
        background: colors.background || '#f8fafc',
      }}
    >
      <Card.Body className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <i className="bi bi-patch-check-fill text-primary"></i>
            <strong style={{ fontSize: '0.9rem' }}>算法依据</strong>
            {refs.standards.slice(0, 4).map(s => (
              <Badge key={s.code} bg="light" text="dark" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                {s.code}
              </Badge>
            ))}
            {refs.standards.length > 4 && (
              <small className="text-muted">+{refs.standards.length - 4}</small>
            )}
          </div>
          <Button
            size="sm"
            variant="link"
            className="text-decoration-none p-0"
            onClick={() => setOpen(!open)}
            aria-controls={`algo-ref-${module}`}
            aria-expanded={open}
          >
            {open ? '收起' : '查看完整规范引用'} <i className={`bi bi-chevron-${open ? 'up' : 'down'}`}></i>
          </Button>
        </div>
        <Collapse in={open}>
          <div id={`algo-ref-${module}`} className="mt-2 pt-2 border-top">
            <ul className="mb-1" style={{ fontSize: '0.84rem', paddingLeft: '1.2rem' }}>
              {refs.standards.map(s => (
                <li key={s.code} className="mb-1">
                  <strong>{s.code}</strong> — {s.title}
                  {s.usage && <small className="text-muted d-block">用于:{s.usage}</small>}
                </li>
              ))}
            </ul>
            {refs.note && (
              <small className="text-muted d-block mt-2">
                <i className="bi bi-info-circle me-1"></i>{refs.note}
              </small>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

const REFERENCES = {
  'propulsion-hub': {
    standards: [
      { code: 'ITTC 7.5-02-03-01', title: '推进效率与船-机-桨一致性试验流程', usage: '系统级匹配 Hub 的推进效率核算' },
      { code: 'ISO 4867', title: '船舶机械振动 — 测量与评估', usage: '一致性匹配的振动接受度' },
      { code: 'CCS《钢质海船入级规范》第 3 篇', title: '轮机', usage: '主机—齿轮箱—轴系系统级合规' },
      { code: 'ABS Steel Vessels Rules Pt 4', title: 'Vessel Systems and Machinery', usage: '推进系统 ABS 入级参考' },
    ],
    note: '本模块的算法实现位于 src/utils/torsionalComplianceChecker.js 与 src/services/couplingSelectionService.js,集成 CCS/ABS 合规判据。',
  },
  'cpp': {
    standards: [
      { code: 'ITTC 7.5-02-03-02.5', title: '可调螺距桨敞水试验', usage: 'CPP 桨叶推力/扭矩特征曲线' },
      { code: 'CCS《钢质海船入级规范》第 3 篇 第 4 章', title: '可调螺距推进装置', usage: 'CPP 操控力液压系统合规' },
      { code: 'DNV-RU-SHIP Pt.4 Ch.5', title: 'Rotating Machinery — Shafting and Propellers', usage: 'DNV 入级 CPP 规范' },
      { code: 'LR Rules Pt 5 Ch 8', title: 'Shafting (LR — 可调螺距桨)', usage: 'Lloyd\'s Register 合规参考' },
      { code: 'ISO 484/2', title: '船用螺旋桨制造公差(2.5–25 m)', usage: 'CPP 桨叶制造公差' },
    ],
    note: '内部 CCSCompliancePanel 与 ClassificationCompliancePanel 已实现 CCS/DNV/LR/ABS 四社规范点检。',
  },
  'azimuth': {
    standards: [
      { code: 'IMO Resolution A.1024(26)', title: 'Polar Code(包括极区船 Z-drive)', usage: '极区作业全回转推力裕量' },
      { code: 'CCS《钢质海船入级规范》', title: '艉部全回转推进系统', usage: 'Z-drive 入级合规' },
      { code: 'IACS UR M70', title: 'Steering Gear / Propulsion Steering', usage: '全回转操舵性能要求' },
      { code: 'BV NR 467 Pt C Ch 1', title: 'Machinery — Azimuth Thrusters', usage: 'BV 入级全回转规范' },
    ],
    note: '系泊推力(Bollard Pull)按 IMO/SOLAS 要求计算,实现见 calculateBollardPull()。',
  },
  'thruster': {
    standards: [
      { code: 'IACS UR M70', title: 'Steering / Tunnel Thruster', usage: '侧推操控性能下限' },
      { code: 'ISO 13628-9', title: 'Subsea Production Systems — Tunnel Thrusters', usage: '海工船侧推规范' },
      { code: 'CCS《钢质海船入级规范》第 3 篇', title: '辅助推进装置', usage: '侧推合规' },
      { code: 'ITTC 7.5-02-03-02.4', title: 'Tunnel Thruster Performance Tests', usage: '侧推推力试验流程' },
    ],
    note: '推力计算采用经验公式 + 桨叶图谱插值,详见 ThrusterSelector 组件实现。',
  },
  'shaft': {
    standards: [
      { code: 'ISO 4867', title: '船舶机械振动 — 测量与评估', usage: '轴系扭振接受度' },
      { code: 'ISO 8579-2', title: '齿轮装置接收试验规范 — 振动', usage: '齿轮箱-轴系振动一致性' },
      { code: 'ISO 10816 / ISO 20816', title: '机器振动 — 旋转机械振动评定', usage: '轴系振动等级评定' },
      { code: 'CCS《钢质海船入级规范》第 3 篇 第 9 章', title: '轴系扭振', usage: 'CCS 扭振强制核算' },
      { code: 'BV NR 467', title: 'Shaft Vibration Calculation', usage: 'BV 扭振规范' },
      { code: 'GB/T 7094', title: '船用柴油机轴系扭振计算', usage: '国标扭振核算' },
    ],
    note: 'ShaftVibrationPanel 集成 ISO 10816/20816 + CCS 扭振规范,数据库见 src/data/torsionalStandardsDB.js。',
  },
};

export default AlgorithmReferenceCard;
