// src/components/__tests__/FatalScreen.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FatalScreen from '../FatalScreen';

const buildError = (overrides = {}) => {
  const err = new Error(overrides.message || '数据校验失败');
  err.details = overrides.details || {
    validation: {
      summary: { total: 696, valid: 690, invalid: 6, warnings: 12 },
      details: {
        hcGearboxes: {
          name: 'HC系列齿轮箱',
          invalidItems: [
            { model: 'HC400', errors: ['transferCapacity 缺失'], originalIndex: 1 },
            { model: 'HC600', errors: ['ratios 不是数组'], originalIndex: 2 }
          ],
          warningItems: []
        }
      }
    },
    repairErrors: ['修复阶段错误#1']
  };
  return err;
};

describe('FatalScreen (A4 启动硬阻断屏)', () => {
  it('显示主标题和摘要', () => {
    render(<FatalScreen error={buildError()} />);
    expect(screen.getByText(/数据校验未通过/)).toBeInTheDocument();
    expect(screen.getByText(/总数 696/)).toBeInTheDocument();
    expect(screen.getByText(/失败 6/)).toBeInTheDocument();
  });

  it('展开 invalidItems 明细', () => {
    render(<FatalScreen error={buildError()} />);
    expect(screen.getByText(/HC系列齿轮箱.*HC400.*transferCapacity 缺失/)).toBeInTheDocument();
    expect(screen.getByText(/HC系列齿轮箱.*HC600.*ratios 不是数组/)).toBeInTheDocument();
  });

  it('显示 repairErrors', () => {
    render(<FatalScreen error={buildError()} />);
    expect(screen.getByText(/修复错误.*修复阶段错误#1/)).toBeInTheDocument();
  });

  it('错误明细超过 10 条时显示"展开全部"按钮', () => {
    const manyItems = Array.from({ length: 15 }).map((_, i) => ({
      model: `HC${i}`,
      errors: [`错误${i}`],
      originalIndex: i
    }));
    const err = buildError({
      details: {
        validation: {
          summary: { total: 100, valid: 85, invalid: 15, warnings: 0 },
          details: { hcGearboxes: { name: 'HC', invalidItems: manyItems, warningItems: [] } }
        }
      }
    });
    render(<FatalScreen error={err} />);
    expect(screen.getByText(/展开全部 15 条/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/展开全部 15 条/));
    expect(screen.getByText(/HC14.*错误14/)).toBeInTheDocument();
  });

  it('点击"重新加载"调用 onRetry', () => {
    const onRetry = jest.fn();
    render(<FatalScreen error={buildError()} onRetry={onRetry} />);
    fireEvent.click(screen.getByText('重新加载'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('点击"复制详情发管理员"调 navigator.clipboard.writeText', () => {
    const writeText = jest.fn().mockResolvedValue();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText },
      configurable: true
    });
    render(<FatalScreen error={buildError()} />);
    fireEvent.click(screen.getByText('复制详情发管理员'));
    expect(writeText).toHaveBeenCalledTimes(1);
    const payload = writeText.mock.calls[0][0];
    expect(payload).toMatch(/数据校验失败/);
    expect(payload).toMatch(/HC400/);
  });

  it('error 缺 details 时也能渲染 (向下兼容)', () => {
    const err = new Error('未知错误');
    render(<FatalScreen error={err} />);
    expect(screen.getByText(/数据校验未通过/)).toBeInTheDocument();
    expect(screen.getByText(/未知错误/)).toBeInTheDocument();
  });

  it('aria-live=assertive (无障碍)', () => {
    const { container } = render(<FatalScreen error={buildError()} />);
    expect(container.firstChild).toHaveAttribute('role', 'alert');
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
  });
});
