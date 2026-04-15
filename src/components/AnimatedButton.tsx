'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  cursorText?: string;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, onClick, disabled, variant = 'primary', size = 'md', className, style, type = 'button', cursorText }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: '#FF0000',
            color: '#0C0C0C',
            border: 'none',
            hoverBg: '#DC2626',
          };
        case 'secondary':
          return {
            backgroundColor: '#2A2A2A',
            color: '#FFFFFF',
            border: '2px solid #666666',
            hoverBg: '#3A3A3A',
          };
        case 'danger':
          return {
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            border: '2px solid #EF4444',
            hoverBg: 'rgba(239, 68, 68, 0.3)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            border: '1px solid #444444',
            hoverBg: '#1A1A1A',
          };
        default:
          return {
            backgroundColor: '#FF0000',
            color: '#0C0C0C',
            border: 'none',
            hoverBg: '#DC2626',
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return { height: '40px', padding: '0 16px', fontSize: '12px' };
        case 'md':
          return { height: '52px', padding: '0 24px', fontSize: '14px' };
        case 'lg':
          return { height: '60px', padding: '0 32px', fontSize: '15px' };
        default:
          return { height: '52px', padding: '0 24px', fontSize: '14px' };
      }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-cursor-text={cursorText}
        style={{
          ...sizeStyles,
          backgroundColor: variantStyles.backgroundColor,
          color: variantStyles.color,
          border: variantStyles.border,
          fontWeight: 700,
          letterSpacing: '2px',
          fontFamily: 'var(--font-space-mono), monospace',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        whileHover={!disabled ? {
          scale: 1.02,
          boxShadow: `0 0 20px ${variant === 'primary' ? '#FF000040' : '#FFFFFF20'}`,
        } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Shine effect on hover */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            pointerEvents: 'none',
          }}
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;

// Animated link with underline effect
interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedLink({ children, href, className, style }: AnimatedLinkProps) {
  return (
    <motion.a
      href={href}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        color: '#FF0000',
        textDecoration: 'none',
        fontWeight: 600,
        ...style,
      }}
      whileHover="hover"
      initial="initial"
    >
      {children}
      <motion.span
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: '#FF0000',
        }}
        variants={{
          initial: { scaleX: 0, originX: 0 },
          hover: { scaleX: 1, originX: 0 },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.a>
  );
}

// Card with hover effect
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'scale';
}

export function AnimatedCard({ children, className, style, onClick, hoverEffect = 'lift' }: AnimatedCardProps) {
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' };
      case 'glow':
        return { boxShadow: '0 0 30px rgba(255,0,0,0.3)' };
      case 'border':
        return { borderColor: '#FF0000' };
      case 'scale':
        return { scale: 1.02 };
      default:
        return { y: -8 };
    }
  };

  return (
    <motion.div
      className={className}
      style={{
        backgroundColor: '#1A1A1A',
        border: '1px solid #333333',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      whileHover={getHoverAnimation()}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Icon button with pulse effect
interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'danger' | 'success';
  pulse?: boolean;
  style?: React.CSSProperties;
}

export function IconButton({ icon, onClick, size = 'md', variant = 'default', pulse = false, style }: IconButtonProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { width: '32px', height: '32px' };
      case 'md': return { width: '40px', height: '40px' };
      case 'lg': return { width: '48px', height: '48px' };
      default: return { width: '40px', height: '40px' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger': return { borderColor: '#EF4444', color: '#EF4444' };
      case 'success': return { borderColor: '#22C55E', color: '#22C55E' };
      default: return { borderColor: '#444444', color: '#FFFFFF' };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <motion.button
      onClick={onClick}
      style={{
        ...sizeStyles,
        backgroundColor: 'transparent',
        border: `1px solid ${variantStyles.borderColor}`,
        color: variantStyles.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      whileHover={{
        scale: 1.1,
        borderColor: '#FF0000',
        color: '#FF0000',
      }}
      whileTap={{ scale: 0.95 }}
    >
      {pulse && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -4,
            border: `2px solid ${variantStyles.borderColor}`,
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
      {icon}
    </motion.button>
  );
}
