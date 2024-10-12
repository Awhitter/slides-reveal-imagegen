import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

/**
 * LoadingSpinner component
 * Displays a loading spinner with customizable size, color, and label
 *
 * @param {LoadingSpinnerProps} props - The props for the LoadingSpinner component
 * @returns {React.FC} A React functional component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'lg', 
  color = 'primary', 
  label = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span 
        className={`loading loading-spinner loading-${size} text-${color}`}
        role="status"
        aria-label={label}
      ></span>
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
