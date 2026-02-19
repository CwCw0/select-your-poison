'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Skull,
  Dices,
  Users,
  Trophy,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Target
} from 'lucide-react';
import { hapticButton, hapticSuccess } from '@/lib/haptics';

// Onboarding state store
interface OnboardingState {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
    }),
    {
      name: 'syp-onboarding',
    }
  )
);

const onboardingSteps = [
  {
    id: 'welcome',
    icon: Skull,
    iconColor: '#FF0000',
    title: 'WELCOME TO SELECT YOUR POISON',
    subtitle: 'The ultimate Valorant drinking game',
    description: 'Track deaths, roll strats, and suffer together. This is how you turn ranked into chaos.',
  },
  {
    id: 'modes',
    icon: Dices,
    iconColor: '#A855F7',
    title: 'CHOOSE YOUR CHAOS',
    subtitle: 'Multiple game modes',
    description: 'Classic death tracking, Agent-specific rules, Strat Roulette challenges, and end-game punishments. Mix and match for maximum suffering.',
  },
  {
    id: 'agents',
    icon: Target,
    iconColor: '#7DD3FC',
    title: 'AGENT RULES',
    subtitle: 'Your main determines your pain',
    description: 'Each agent has unique drinking rules based on their abilities. Jett mains drink double when dashing into death.',
  },
  {
    id: 'party',
    icon: Users,
    iconColor: '#22C55E',
    title: 'PLAY TOGETHER',
    subtitle: 'Create or join lobbies',
    description: 'Share a lobby code with your squad. Track deaths in real-time across all devices. No one escapes.',
  },
  {
    id: 'ready',
    icon: Trophy,
    iconColor: '#F59E0B',
    title: 'READY TO SUFFER?',
    subtitle: 'One last thing...',
    description: 'Remember: Drink responsibly. Know your limits. Have water ready. And most importantly—no mercy.',
  },
];

interface OnboardingProps {
  onComplete?: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { hasSeenOnboarding, setHasSeenOnboarding } = useOnboardingStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show onboarding if user hasn't seen it
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, [hasSeenOnboarding]);

  const handleNext = () => {
    hapticButton();
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    hapticButton();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    hapticButton();
    handleComplete();
  };

  const handleComplete = () => {
    hapticSuccess();
    setHasSeenOnboarding(true);
    setIsVisible(false);
    onComplete?.();
  };

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          cursor: 'auto',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#0C0C0C',
            border: '1px solid #333333',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Skip button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 20px 0'
          }}>
            <button
              onClick={handleSkip}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: '#666666',
                fontSize: '11px',
                fontFamily: 'var(--font-space-mono), monospace',
                letterSpacing: '1px',
                cursor: 'pointer',
              }}
            >
              SKIP
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '24px 40px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '24px',
              }}
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                style={{
                  width: '96px',
                  height: '96px',
                  backgroundColor: currentStepData.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon style={{ width: '48px', height: '48px', color: '#0C0C0C' }} />
              </motion.div>

              {/* Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  color: currentStepData.iconColor,
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  {currentStepData.subtitle.toUpperCase()}
                </span>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#FFFFFF',
                }}>
                  {currentStepData.title}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#999999',
                  fontFamily: 'var(--font-space-mono), monospace',
                  lineHeight: 1.7,
                  maxWidth: '360px',
                }}>
                  {currentStepData.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '0 40px 24px',
          }}>
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  hapticButton();
                  setCurrentStep(index);
                }}
                style={{
                  width: index === currentStep ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: index === currentStep ? '#FF0000' : '#333333',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '24px',
            borderTop: '1px solid #333333',
          }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  flex: 1,
                  height: '52px',
                  backgroundColor: 'transparent',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
                BACK
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                flex: currentStep > 0 ? 1 : undefined,
                width: currentStep === 0 ? '100%' : undefined,
                height: '52px',
                backgroundColor: '#FF0000',
                border: 'none',
                color: '#0C0C0C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                fontFamily: 'var(--font-space-mono), monospace',
                cursor: 'pointer',
              }}
            >
              {isLastStep ? (
                <>
                  <Zap style={{ width: '16px', height: '16px' }} />
                  START PLAYING
                </>
              ) : (
                <>
                  NEXT
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to check if onboarding should show
export function useShowOnboarding() {
  const { hasSeenOnboarding } = useOnboardingStore();
  return !hasSeenOnboarding;
}

// Reset onboarding (for testing or settings)
export function useResetOnboarding() {
  const { setHasSeenOnboarding } = useOnboardingStore();
  return () => setHasSeenOnboarding(false);
}
