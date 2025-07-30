'use client';

import { motion } from 'framer-motion';
import { QuestionStepProps } from '@/types';
import { cn } from '@/lib/utils';

export default function QuestionStep({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  isLoading = false
}: QuestionStepProps) {
  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-gray-600 max-w-md mx-auto">
            {question.description}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleOptionSelect(option.value)}
            className={cn(
              "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              value === option.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:shadow-sm"
            )}
            disabled={isLoading}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="flex-shrink-0 mt-0.5">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  value === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                )}>
                  {value === option.value && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
              
              {/* Option Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 mb-1">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                )}
              </div>

              {/* Selected Indicator */}
              {value === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0"
                >
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={onPrev}
          disabled={!canGoPrev || isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
            canGoPrev && !isLoading
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors",
            canGoNext && !isLoading
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}