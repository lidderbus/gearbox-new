import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // 更新状态使下一次渲染显示错误UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // 可以将错误信息发送到错误追踪服务
    console.error("组件错误:", error, errorInfo);
  }

  handleReset = () => {
    // 重置错误状态
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // 渲染错误UI
      return this.props.fallback || (
        <Alert variant="danger" className="my-3">
          <Alert.Heading>组件加载失败</Alert.Heading>
          <p>
            加载组件时发生错误。请尝试刷新页面，或联系系统管理员。
          </p>
          {this.state.error && (
            <details className="mt-2 text-muted small">
              <summary>查看详细错误信息</summary>
              <p>{this.state.error.toString()}</p>
            </details>
          )}
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={this.handleReset}>
              尝试重新加载
            </Button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;