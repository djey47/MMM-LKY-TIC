import clsx from 'clsx';
import { useCallback } from 'react';
import './Badge.scss';

export interface BadgeProps {
  active?: boolean;
  onClick?: () => void;
  text: string;
};

const Badge = ({ active = false, onClick, text }: BadgeProps) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onClick) {
      onClick();
    }
  }, [onClick]);
  
  const className = clsx('badge', { 'badge--active': active, 'badge--clickable': !!onClick });
  return (
    <span
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-hidden="true"
      className={className} 
      onClick={onClick}>
      {text}
    </span>
  );
};

export default Badge;
