import React from 'react';
import { Alert, Button, Card } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <Card className="m-4 border-danger">
          <Card.Header className="bg-danger text-white">
            <h5 className="mb-0">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              出现了一个错误
            </h5>
          </Card.Header>
          <Card.Body>
            <Alert variant="danger">
              <h6>错误信息：</h6>
              <pre className="mb-2" style={{ fontSize: '0.875rem' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  <summary>详细错误堆栈（开发模式）</summary>
                  <pre style={{ fontSize: '0.75rem', maxHeight: '300px', overflow: 'auto' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </Alert>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.resetError}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                重试
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-repeat me-1"></i>
                刷新页面
              </Button>
            </div>
          </Card.Body>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;