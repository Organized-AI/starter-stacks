'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  className?: string;
}

export default function ProgressBar({ 
  currentStep, 
  totalSteps, 
  completedSteps, 
  className 
}: ProgressBarProps) {
  const progress = Math.min(((completedSteps.length + (currentStep < totalSteps ? 1 : 0)) / totalSteps) * 100, 100);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
        </span>
        <span className="font-medium text-blue-600">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute inset-0 flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;
            const isPast = index < currentStep;

            return (
              <motion.div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-300",
                  isCompleted || isPast
                    ? "bg-blue-600 border-blue-600"
                    : isCurrent
                    ? "bg-white border-blue-600 shadow-sm"
                    : "bg-white border-gray-300"
                )}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isPast ? "#2563eb" : "#ffffff"
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center w-full h-full"
                  >
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-gray-500 pt-2">
        <span>Start</span>
        <span>Complete</span>
      </div>
    </div>
  );
}