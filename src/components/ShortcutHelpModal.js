// src/components/ShortcutHelpModal.js
import React from 'react';
import { Modal, Table, Badge } from 'react-bootstrap';

const SHORTCUTS = [
  { keys: 'Ctrl + S', action: '保存当前数据', scope: '表单页面' },
  { keys: 'Ctrl + P', action: '打印当前页面', scope: '全局' },
  { keys: 'Ctrl + E', action: '导出CSV', scope: '数据页面' },
  { keys: 'Ctrl + /', action: '显示快捷键帮助', scope: '全局' },
  { keys: 'Esc', action: '关闭弹窗/取消', scope: '全局' },
  { keys: 'Ctrl + F', action: '搜索(浏览器原生)', scope: '全局' },
];

export default function ShortcutHelpModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="fs-6"><i className="bi bi-keyboard me-2"></i>快捷键</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Table size="sm" className="mb-0">
          <tbody>
            {SHORTCUTS.map((s, i) => (
              <tr key={i}>
                <td><Badge bg="secondary" className="font-monospace">{s.keys}</Badge></td>
                <td className="small">{s.action}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
