import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#222', color: 'white', height: '100vh', zIndex: 9999, position: 'relative' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ fontSize: '10px' }}>{this.state.info && this.state.info.componentStack}</pre>
          <button onClick={this.props.onClose} style={{ padding: '10px', marginTop: '20px' }}>Close</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
