// src/components/EnhancedSelectionForm/__tests__/QuickByVesselType.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickByVesselType from '../QuickByVesselType';

describe('QuickByVesselType', () => {
  it('渲染分类下拉与按钮', () => {
    render(<QuickByVesselType />);
    expect(screen.getByText(/按船型快速选型/)).toBeInTheDocument();
    expect(screen.getByLabelText('船型分类')).toBeInTheDocument();
    expect(screen.getByLabelText('船型尺度')).toBeInTheDocument();
  });

  it('选择 Capesize 显示预览参数', () => {
    render(<QuickByVesselType />);
    fireEvent.change(screen.getByLabelText('船型分类'), { target: { value: 'bulker' } });
    fireEvent.change(screen.getByLabelText('船型尺度'), { target: { value: 'bulker_capesize' } });
    // 名称会出现在 option + alert 两处, 用 getAllByText
    expect(screen.getAllByText(/好望角型散货船/).length).toBeGreaterThan(0);
    expect(screen.getByText(/18500 kW/)).toBeInTheDocument();
  });

  it('点击"带入主表单"调用 onApply', () => {
    const onApply = jest.fn();
    render(<QuickByVesselType onApply={onApply} />);
    fireEvent.change(screen.getByLabelText('船型分类'), { target: { value: 'bulker' } });
    fireEvent.change(screen.getByLabelText('船型尺度'), { target: { value: 'bulker_capesize' } });
    fireEvent.click(screen.getByText(/带入主表单/));
    expect(onApply).toHaveBeenCalledTimes(1);
    const arg = onApply.mock.calls[0][0];
    expect(arg.motorPower).toBe(18500);
    expect(arg.targetRatio).toBe(4.7);
  });

  it('未选船型时按钮禁用', () => {
    const onApply = jest.fn();
    render(<QuickByVesselType onApply={onApply} />);
    const btn = screen.getByText(/带入主表单/).closest('button');
    expect(btn).toBeDisabled();
  });

  it('切换分类 (tug) 显示对应船型变体', () => {
    render(<QuickByVesselType />);
    fireEvent.change(screen.getByLabelText('船型分类'), { target: { value: 'tug' } });
    fireEvent.change(screen.getByLabelText('船型尺度'), { target: { value: 'tug_harbor' } });
    expect(screen.getAllByText(/港作 ASD 拖轮/).length).toBeGreaterThan(0);
  });
});
