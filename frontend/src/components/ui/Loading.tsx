import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-primary rounded-full animate-spin`}></div>
        {text && <span className={`text-muted ${textSizeClasses[size]}`}>{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1">
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`}></div>
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce animate-delay-100`}></div>
          <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce animate-delay-200`}></div>
        </div>
        {text && <span className={`text-muted ${textSizeClasses[size]}`}>{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse-glow`}></div>
        {text && <span className={`text-muted ${textSizeClasses[size]}`}>{text}</span>}
      </div>
    );
  }

  return null;
};

export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className="h-4 bg-gray-200/20 rounded skeleton"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
};

export interface LoadingCardProps {
  count?: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="card-media bg-gray-200/20 skeleton"></div>
          <div className="card-body">
            <Skeleton lines={2} />
            <div className="mt-4">
              <div className="h-8 bg-gray-200/20 rounded skeleton w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};