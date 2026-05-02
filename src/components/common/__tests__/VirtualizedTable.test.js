// src/components/common/__tests__/VirtualizedTable.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VirtualizedTable from '../VirtualizedTable';

// Mock react-window 以便快照可控 (FixedSizeList 实际渲染会基于尺寸算可视区, jsdom 没尺寸)
jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, itemData }) => (
    <div data-testid="vt-window-mock">
      {Array.from({ length: Math.min(itemCount, 12) }).map((_, idx) => (
        <div key={idx}>{children({ index: idx, style: {}, data: itemData })}</div>
      ))}
    </div>
  )
}));

const buildItems = (n) =>
  Array.from({ length: n }).map((_, i) => ({ id: `m-${i}`, model: `MODEL-${i}`, power: 1000 + i }));

const headers = [
  { key: 'model', label: '型号', width: 160 },
  { key: 'power', label: '功率 kW', width: 100 }
];

describe('VirtualizedTable', () => {
  describe('空数据', () => {
    it('items=[] 时显示 emptyText', () => {
      render(<VirtualizedTable items={[]} headers={headers} emptyText="无齿轮箱" />);
      expect(screen.getByTestId('vt-empty')).toHaveTextContent('无齿轮箱');
    });
  });

  describe('小数据 (< threshold) 走标准 table', () => {
    it('items=10 走 <table>', () => {
      render(<VirtualizedTable items={buildItems(10)} headers={headers} virtualizationThreshold={100} />);
      expect(screen.getByTestId('vt-fulltable')).toBeInTheDocument();
      expect(screen.queryByTestId('vt-window-mock')).not.toBeInTheDocument();
      // 全部 10 行均渲染
      expect(screen.getByTestId('vt-row-9')).toBeInTheDocument();
    });

    it('renderCell 被调用并返回自定义内容', () => {
      const renderCell = jest.fn((item, key) => key === 'power' ? `${item.power} kW` : item[key]);
      render(<VirtualizedTable items={buildItems(3)} headers={headers} renderCell={renderCell} virtualizationThreshold={100} />);
      expect(renderCell).toHaveBeenCalled();
      expect(screen.getByText('1000 kW')).toBeInTheDocument();
    });
  });

  describe('大数据 (>= threshold) 启用虚拟化', () => {
    it('items=200 启用 FixedSizeList', () => {
      render(<VirtualizedTable items={buildItems(200)} headers={headers} virtualizationThreshold={100} />);
      expect(screen.getByTestId('vt-window-mock')).toBeInTheDocument();
      // 表头仍可见
      expect(screen.getByText('型号')).toBeInTheDocument();
      // 提示文本
      expect(screen.getByText(/共 200 行/)).toBeInTheDocument();
    });

    it('aria-rowcount = items.length', () => {
      render(<VirtualizedTable items={buildItems(150)} headers={headers} />);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-rowcount', '150');
    });
  });

  describe('阈值边界', () => {
    it('items=99 不启用 (默认 100)', () => {
      render(<VirtualizedTable items={buildItems(99)} headers={headers} />);
      expect(screen.queryByTestId('vt-window-mock')).not.toBeInTheDocument();
      expect(screen.getByTestId('vt-fulltable')).toBeInTheDocument();
    });

    it('items=100 启用', () => {
      render(<VirtualizedTable items={buildItems(100)} headers={headers} />);
      expect(screen.getByTestId('vt-window-mock')).toBeInTheDocument();
    });

    it('自定义阈值', () => {
      render(<VirtualizedTable items={buildItems(20)} headers={headers} virtualizationThreshold={10} />);
      expect(screen.getByTestId('vt-window-mock')).toBeInTheDocument();
    });
  });

  describe('getRowKey', () => {
    it('默认用 item.id', () => {
      const { container } = render(<VirtualizedTable items={[{ id: 'unique-1', model: 'X' }]} headers={headers} />);
      // 仅渲染成功即视为 key 取值正确 (重复 key 会 React 警告)
      expect(container.querySelector('[data-testid="vt-row-0"]')).toBeInTheDocument();
    });

    it('自定义 getRowKey', () => {
      const getRowKey = jest.fn((item, idx) => `custom-${item.model}-${idx}`);
      render(<VirtualizedTable items={buildItems(3)} headers={headers} getRowKey={getRowKey} />);
      expect(getRowKey).toHaveBeenCalled();
    });
  });
});
