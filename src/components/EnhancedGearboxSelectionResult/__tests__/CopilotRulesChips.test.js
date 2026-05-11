// CopilotRulesChips Phase 3 UI 单元测试
import React from 'react';
import { render } from '@testing-library/react';
import CopilotRulesChips from '../CopilotRulesChips';

describe('CopilotRulesChips Phase 3 UI', () => {
  test('diagnostics 缺失时不渲染', () => {
    const { container } = render(<CopilotRulesChips diagnostics={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('空 diagnostics (无任何 chip) 不渲染', () => {
    const { container } = render(<CopilotRulesChips diagnostics={{}} />);
    expect(container.firstChild).toBeNull();
  });

  test('isDirectModelHit 单独渲染 fast-path chip', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{ isDirectModelHit: true, appliedRules: ['R-DIRECT-MODEL'] }} />
    );
    expect(getByText(/直接型号 fast path/)).toBeTruthy();
  });

  test('inferredPropellerType 渲染推断 chip', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{ inferredPropellerType: 'CPP', appliedRules: ['R-PROP-INFER'] }} />
    );
    expect(getByText(/推断桨型: CPP/)).toBeTruthy();
  });

  test('多规则同时触发各自渲染对应 chip', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{
        appliedRules: ['R-PROP-CPP', 'R-TWIN-2GWH', 'R-THRUST-MIN', 'R-CERT-MATCH'],
        scoringProfile: 'copilot',
      }} />
    );
    expect(getByText(/CPP→GC\/DT/)).toBeTruthy();
    expect(getByText(/双机并车 2GWH/)).toBeTruthy();
    expect(getByText(/推力下限/)).toBeTruthy();
    expect(getByText(/船级社强匹配/)).toBeTruthy();
    expect(getByText(/评分模式: Copilot/)).toBeTruthy();
  });

  test('copilotExclusions 累加后显示已排除型号数', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{
        appliedRules: ['R-PROP-CPP'],
        copilotExclusions: { 'R-PROP-CPP': 12, 'R-CERT-MATCH': 3 },
      }} />
    );
    expect(getByText(/硬约束已排除 15 型号/)).toBeTruthy();
  });

  test('legacy profile 显示 Legacy 标签', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{ scoringProfile: 'legacy' }} />
    );
    expect(getByText(/评分模式: Legacy/)).toBeTruthy();
  });

  test('copilot-strict profile 显示 严格 标签', () => {
    const { getByText } = render(
      <CopilotRulesChips diagnostics={{ scoringProfile: 'copilot-strict' }} />
    );
    expect(getByText(/评分模式: Copilot 严格/)).toBeTruthy();
  });
});
