import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle errors in child components
 * It displays a fallback UI when an error occurs and provides options to reload or go home
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Log the error to console and potentially to an error reporting service
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error reporting service (e.g., Sentry)
    console.error('Uncaught error:', error, errorInfo);
  }

  /**
   * Reload the current page
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigate to the home page
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-200">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Oops! Something went wrong</h2>
              <p className="text-base-content">We're sorry for the inconvenience. Please try the following options:</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary" onClick={this.handleReload}>
                  Reload Page
                </button>
                <button className="btn btn-secondary" onClick={this.handleGoHome}>
                  Go to Home
                </button>
              </div>
            </div>
          </div>
          {this.state.error && (
            <div className="mt-4 p-4 bg-base-300 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Error details:</h3>
              <pre className="text-xs overflow-auto">{this.state.error.toString()}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
