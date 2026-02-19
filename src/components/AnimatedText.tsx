'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

// Animated heading that reveals letter by letter
interface AnimatedHeadingProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean;
}

export function AnimatedHeading({ children, className, style, delay = 0, once = true }: AnimatedHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const letters = children.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.h1
      ref={ref}
      className={className}
      style={{ ...style, display: 'flex', flexWrap: 'wrap', perspective: '1000px' }}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}

// Glitch text effect
interface GlitchTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export function GlitchText({ children, className, style }: GlitchTextProps) {
  return (
    <span
      className={className}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-block',
      }}
      data-text={children}
    >
      <style jsx>{`
        span {
          animation: glitch 2s infinite;
        }
        span::before,
        span::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        span::before {
          left: 2px;
          text-shadow: -2px 0 #FF0000;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        span::after {
          left: -2px;
          text-shadow: -2px 0 #00FFFF;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip: rect(132px, 350px, 101px, 30px); }
          20% { clip: rect(1px, 350px, 147px, 30px); }
          40% { clip: rect(50px, 350px, 122px, 30px); }
          60% { clip: rect(25px, 350px, 90px, 30px); }
          80% { clip: rect(67px, 350px, 45px, 30px); }
          100% { clip: rect(89px, 350px, 155px, 30px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(129px, 350px, 36px, 30px); }
          20% { clip: rect(36px, 350px, 4px, 30px); }
          40% { clip: rect(85px, 350px, 66px, 30px); }
          60% { clip: rect(91px, 350px, 91px, 30px); }
          80% { clip: rect(12px, 350px, 59px, 30px); }
          100% { clip: rect(67px, 350px, 109px, 30px); }
        }
      `}</style>
      {children}
    </span>
  );
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  delay?: number;
}

export function Typewriter({ text, className, style, speed = 50, delay = 0 }: TypewriterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ ...style, display: 'inline-block' }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            delay: delay + index * (speed / 1000),
            duration: 0,
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          backgroundColor: '#FF0000',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
        }}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      />
    </motion.span>
  );
}

// Slide up text reveal
interface SlideUpTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
}

export function SlideUpText({ children, className, style, delay = 0, duration = 0.6 }: SlideUpTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        className={className}
        style={style}
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Staggered word reveal
interface StaggeredWordsProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delay?: number;
}

export function StaggeredWords({ text, className, style, stagger = 0.1, delay = 0 }: StaggeredWordsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <motion.p
      ref={ref}
      className={className}
      style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
          transition={{
            duration: 0.5,
            delay: delay + index * stagger,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

// Counter animation
interface AnimatedCounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, className, style, duration = 2, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {isInView && (
          <Counter from={0} to={value} duration={duration} />
        )}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useRef(() => {
    const node = nodeRef.current;
    if (!node) return;

    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(from + (to - from) * easeOutQuart);

      node.textContent = currentValue.toString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  });

  return <span ref={nodeRef}>{from}</span>;
}

// Highlight text on hover
interface HighlightTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  highlightColor?: string;
}

export function HighlightText({ children, className, style, highlightColor = '#FF0000' }: HighlightTextProps) {
  return (
    <motion.span
      className={className}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-block',
      }}
      whileHover="hover"
      initial="initial"
    >
      <motion.span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
          backgroundColor: highlightColor,
          opacity: 0.3,
          zIndex: -1,
        }}
        variants={{
          initial: { scaleX: 0, originX: 0 },
          hover: { scaleX: 1, originX: 0 },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      {children}
    </motion.span>
  );
}
