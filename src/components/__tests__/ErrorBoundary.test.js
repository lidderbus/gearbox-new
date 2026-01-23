// src/components/__tests__/ErrorBoundary.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Mock react-bootstrap components
jest.mock('react-bootstrap', () => ({
  Alert: ({ children, variant }) => (
    <div data-testid="alert" data-variant={variant}>{children}</div>
  ),
  Button: ({ children, onClick, disabled, variant }) => (
    <button
      onClick={onClick}
      disabled={disabled === true}
      data-variant={variant}
      aria-disabled={disabled === true ? 'true' : undefined}
    >
      {children}
    </button>
  ),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="child">Child component rendered</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child component rendered')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('catches errors and displays error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('组件渲染出错')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });

    it('displays error details in expandable section', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('查看详细错误信息')).toBeInTheDocument();
    });

    it('logs error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('retry functionality', () => {
    it('shows retry button with correct initial count', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button')).toHaveTextContent('重试 (0/3)');
    });

    it('retry button is not disabled initially', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('increments retry count on click', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button');
      fireEvent.click(retryButton);

      // After retry, error is thrown again so we see retry count
      expect(screen.getByRole('button')).toHaveTextContent('重试 (1/3)');
    });

    it('disables retry button after max retries', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify initial state
      expect(screen.getByRole('button')).toHaveTextContent('重试 (0/3)');
      expect(screen.getByRole('button')).not.toBeDisabled();

      // Click retry 3 times - each click triggers error catch cycle
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveTextContent('重试 (1/3)');

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveTextContent('重试 (2/3)');

      fireEvent.click(screen.getByRole('button'));

      // After 3 retries, button should be disabled with max retries message
      const finalButton = screen.getByRole('button');
      expect(finalButton).toHaveTextContent('已达最大重试次数');
      expect(finalButton).toHaveAttribute('disabled');
    });
  });

  describe('fallback prop', () => {
    it('renders fallback content when provided and error occurs', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="fallback">Custom fallback</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('does not render fallback when no error', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="fallback">Custom fallback</div>}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
    });
  });

  describe('getDerivedStateFromError', () => {
    it('updates state to hasError: true', () => {
      const state = ErrorBoundary.getDerivedStateFromError(new Error('test'));
      expect(state).toEqual({ hasError: true });
    });
  });
});
