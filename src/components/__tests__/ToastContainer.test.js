// src/components/__tests__/ToastContainer.test.js
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastContainer from '../ToastContainer';
import { toast, setToastHandler } from '../../utils/toast';

describe('ToastContainer', () => {
  afterEach(() => {
    // 清理全局 toast handler 防测试间泄露
    setToastHandler(null);
  });

  test('挂载后 ARIA live region 存在', () => {
    render(<ToastContainer />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  test('挂载时无 toast → 无 toast 节点', () => {
    const { container } = render(<ToastContainer />);
    const toasts = container.querySelectorAll('.toast');
    expect(toasts.length).toBe(0);
  });

  test('toast.success 触发 → success toast 渲染含 message + 成功标签', async () => {
    render(<ToastContainer />);
    act(() => toast.success('保存成功'));
    await waitFor(() => {
      expect(screen.getByText('保存成功')).toBeInTheDocument();
      expect(screen.getByText('成功')).toBeInTheDocument();
    });
  });

  test('toast.error → danger toast + 错误标签', async () => {
    render(<ToastContainer />);
    act(() => toast.error('保存失败'));
    await waitFor(() => {
      expect(screen.getByText('保存失败')).toBeInTheDocument();
      expect(screen.getByText('错误')).toBeInTheDocument();
    });
  });

  test('toast.warning → warning 标签', async () => {
    render(<ToastContainer />);
    act(() => toast.warning('注意'));
    await waitFor(() => {
      expect(screen.getByText('警告')).toBeInTheDocument();
    });
  });

  test('toast.info → 提示标签', async () => {
    render(<ToastContainer />);
    act(() => toast.info('提示信息'));
    await waitFor(() => {
      expect(screen.getByText('提示')).toBeInTheDocument();
    });
  });

  test('多次 toast 调用 → 多条同时渲染', async () => {
    render(<ToastContainer />);
    act(() => {
      toast.success('一');
      toast.error('二');
      toast.warning('三');
    });
    await waitFor(() => {
      expect(screen.getByText('一')).toBeInTheDocument();
      expect(screen.getByText('二')).toBeInTheDocument();
      expect(screen.getByText('三')).toBeInTheDocument();
    });
  });

  test('卸载后 setToastHandler 清空 → toast 调用不再渲染', () => {
    const { unmount } = render(<ToastContainer />);
    unmount();
    // 卸载后 toast 调用不应抛错
    expect(() => toast.success('卸载后')).not.toThrow();
  });
});
