// src/components/ErrorBoundary.js
import React from 'react';
import { Alert, Button } from 'react-bootstrap';

/**
 * 错误边界组件
 * 用于捕获子组件中的JavaScript错误并显示备用UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      key: 0 // 用于强制重新渲染
    };
  }
  
  static getDerivedStateFromError(error) {
    // 更新状态以在下一次渲染时显示备用UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error("组件错误被ErrorBoundary捕获:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // 可以在这里将错误信息报告给服务器
    // logErrorToService(error, errorInfo);
  }
  
  handleRetry = () => {
    // 重置错误状态并增加key以强制重新渲染子组件
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      key: prevState.key + 1
    }));
  }
  
  render() {
    if (this.state.hasError) {
      // 显示自定义错误UI
      return (
        <div className="error-boundary p-3 mb-3 border rounded" style={{ backgroundColor: '#fff8f8' }}>
          <h5 className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            组件渲染出错
          </h5>
          <Alert variant="danger">
            <p>{this.state.error?.message || '渲染过程中发生错误'}</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>查看详细错误信息</summary>
              <p>{this.state.error?.toString()}</p>
              <p>{this.state.errorInfo?.componentStack}</p>
            </details>
          </Alert>
          <div className="mt-3">
            <Button variant="primary" onClick={this.handleRetry}>
              <i className="bi bi-arrow-repeat me-2"></i>
              重试
            </Button>
            {this.props.fallback && (
              <div className="mt-3">
                {this.props.fallback}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // 正常情况下渲染子组件
    return (
      <React.Fragment key={this.state.key}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default ErrorBoundary;