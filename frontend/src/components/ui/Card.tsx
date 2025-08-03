import React from 'react';
import Image from 'next/image';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = !!onClick
}) => {
  const classes = [
    'card',
    hoverable ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export interface CardMediaProps {
  src?: string;
  videoSrc?: string;
  alt: string;
  overlay?: React.ReactNode;
  imageRendering?: 'auto' | 'pixelated';
}

export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  videoSrc,
  alt,
  overlay,
  imageRendering = 'auto'
}) => {
  return (
    <div className="card-media">
      {videoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={videoSrc}
        />
      )}
      {src && (
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering }}
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      )}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};