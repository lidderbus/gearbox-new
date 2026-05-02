// src/components/competitor/__tests__/ParametricCompareView.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParametricCompareView from '../ParametricCompareView';

describe('ParametricCompareView', () => {
  it('默认渲染并展示免责横幅', () => {
    render(<ParametricCompareView />);
    expect(screen.getByText(/参数级三方对比/)).toBeInTheDocument();
    expect(screen.getByText(/参考价仅作对位估算/)).toBeInTheDocument();
  });

  it('默认 1850/3.5/1800 工况命中 ZF W2050', () => {
    render(<ParametricCompareView />);
    expect(screen.getByText('ZF W2050')).toBeInTheDocument();
    expect(screen.getByText(/HCT2700/)).toBeInTheDocument();
  });

  it('修改功率到 350 切换到小型海外候选', () => {
    render(<ParametricCompareView />);
    const powerInput = screen.getByDisplayValue('1850');
    fireEvent.change(powerInput, { target: { value: '350' } });
    fireEvent.change(screen.getByDisplayValue('3.5'), { target: { value: '2.5' } });
    fireEvent.change(screen.getByDisplayValue('1800'), { target: { value: '2300' } });
    // 输入更换后应有候选 (W325 或 WAF 365L)
    const tableTextContent = document.body.textContent;
    expect(tableTextContent).toMatch(/W325|WAF 365L|MG-5114SC/);
  });

  it('品牌过滤 ZF Marine 后只显示 ZF', () => {
    render(<ParametricCompareView />);
    const brandSelect = screen.getByDisplayValue(/全部/);
    fireEvent.change(brandSelect, { target: { value: 'ZF Marine' } });
    // ZF W2050 仍在
    expect(screen.getByText('ZF W2050')).toBeInTheDocument();
    // Reintjes/Twin Disc 应该不在表格内
    expect(screen.queryByText(/Reintjes WAF/)).not.toBeInTheDocument();
  });

  it('参数三维全偏时显示无候选提示', () => {
    render(<ParametricCompareView />);
    // 三维都远超所有候选: 50000kW + ratio=15 + speed=100
    fireEvent.change(screen.getByDisplayValue('1850'), { target: { value: '50000' } });
    fireEvent.change(screen.getByDisplayValue('3.5'), { target: { value: '15' } });
    fireEvent.change(screen.getByDisplayValue('1800'), { target: { value: '100' } });
    expect(screen.getByText(/未找到匹配海外型号/)).toBeInTheDocument();
  });

  it('支持 defaultPower/Ratio/Speed props 初始化', () => {
    render(<ParametricCompareView defaultPower={985} defaultRatio={3.0} defaultSpeed={1900} />);
    // ZF W1000 应被命中
    expect(screen.getByText('ZF W1000')).toBeInTheDocument();
  });
});
