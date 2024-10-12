import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error reporting service (e.g., Sentry)
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="mb-6 text-gray-700">We're sorry for the inconvenience. Please try the following options:</p>
          <div className="space-x-4">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-300"
              onClick={this.handleReload}
            >
              Reload Page
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300"
              onClick={this.handleGoHome}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
