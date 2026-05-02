// src/components/Skeleton/__tests__/Skeleton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonCard, SkeletonTable, SkeletonChart } from '../index';

describe('Skeleton 组件库', () => {
  describe('SkeletonCard', () => {
    test('默认渲染 3 行内容 + 1 个标题', () => {
      const { container } = render(<SkeletonCard />);
      const lines = container.querySelectorAll('.skeleton-line');
      expect(lines.length).toBe(4); // 1 title + 3 content lines
    });

    test('lines=5 时渲染 5 行内容', () => {
      const { container } = render(<SkeletonCard lines={5} />);
      const lines = container.querySelectorAll('.skeleton-line');
      expect(lines.length).toBe(6); // 1 title + 5 content lines
    });

    test('包含 a11y role + aria-label', () => {
      render(<SkeletonCard />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', '正在加载');
    });

    test('支持自定义 className 和 style', () => {
      const { container } = render(
        <SkeletonCard className="custom-cls" style={{ width: 500 }} />
      );
      const card = container.querySelector('.skeleton-card');
      expect(card).toHaveClass('custom-cls');
      expect(card).toHaveStyle('width: 500px');
    });
  });

  describe('SkeletonTable', () => {
    test('默认 5 行 4 列, 共 20 个 cell', () => {
      const { container } = render(<SkeletonTable />);
      const cells = container.querySelectorAll('.skeleton-table-cell');
      expect(cells.length).toBe(20);
    });

    test('rows=3 cols=2 共 6 个 cell', () => {
      const { container } = render(<SkeletonTable rows={3} cols={2} />);
      const cells = container.querySelectorAll('.skeleton-table-cell');
      expect(cells.length).toBe(6);
    });

    test('a11y role status', () => {
      render(<SkeletonTable />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        '正在加载表格数据'
      );
    });
  });

  describe('SkeletonChart', () => {
    test('默认 8 根柱', () => {
      const { container } = render(<SkeletonChart />);
      const bars = container.querySelectorAll('.skeleton-bar');
      expect(bars.length).toBe(8);
    });

    test('bars=12 height=300 应用到 DOM', () => {
      const { container } = render(<SkeletonChart bars={12} height={300} />);
      const bars = container.querySelectorAll('.skeleton-bar');
      expect(bars.length).toBe(12);
      const chart = container.querySelector('.skeleton-chart');
      expect(chart).toHaveStyle('height: 300px');
    });

    test('每根柱有非零高度', () => {
      const { container } = render(<SkeletonChart />);
      const bars = container.querySelectorAll('.skeleton-bar');
      bars.forEach(bar => {
        const h = parseFloat(bar.style.height);
        expect(h).toBeGreaterThan(0);
      });
    });
  });
});
