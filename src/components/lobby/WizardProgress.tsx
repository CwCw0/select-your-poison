'use client';

import { motion } from 'framer-motion';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function WizardProgress({ currentStep, totalSteps, labels }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-2 w-full">
              <motion.div
                className="h-1 flex-1 rounded-full"
                style={{
                  backgroundColor: i <= currentStep
                    ? 'var(--accent-red)'
                    : 'var(--border-default)',
                }}
                initial={false}
                animate={{
                  backgroundColor: i <= currentStep
                    ? 'var(--accent-red)'
                    : 'var(--border-default)',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{
                color: i <= currentStep
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
              }}
            >
              {labels[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
