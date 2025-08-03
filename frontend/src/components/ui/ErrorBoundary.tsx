'use client';

import React from 'react';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full text-center animate-fade-in">
            <div className="card-body">
              <div className="text-6xl mb-6">💥</div>
              <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
              <p className="text-muted mb-6">
                We&apos;re sorry, but something unexpected happened. Our team has been notified 
                and we&apos;re working to fix this issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-bold mb-2">Error Details:</h3>
                  <pre className="text-sm text-red-400 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface ErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-2xl mb-4">Oops!</h3>
      <p className="text-muted mb-6">{error}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};