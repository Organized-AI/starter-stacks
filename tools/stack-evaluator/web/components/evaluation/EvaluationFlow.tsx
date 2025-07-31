'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvaluationState, EvaluationFormData, UserAnswers } from '@/types';
import { cn } from '@/lib/utils';
import QuestionStep from './QuestionStep';
import ResultsDisplay from './ResultsDisplay';
import ProgressBar from './ProgressBar';

// Define the 5 evaluation questions
const EVALUATION_QUESTIONS = [
  {
    id: 'timeline',
    question: 'What\'s your project timeline?',
    description: 'How quickly do you need to have a working prototype or MVP?',
    type: 'single-choice' as const,
    required: true,
    order: 1,
    options: [
      { value: 'immediate', label: 'ASAP (1-2 weeks)', description: 'Need something working quickly' },
      { value: 'fast', label: '1-2 months', description: 'Fast development with good foundation' },
      { value: 'standard', label: '3-6 months', description: 'Standard development timeline' },
      { value: 'thorough', label: '6+ months', description: 'Comprehensive, enterprise-ready solution' }
    ]
  },
  {
    id: 'background',
    question: 'What\'s your technical background?',
    description: 'This helps us recommend tools that match your skill level.',
    type: 'single-choice' as const,
    required: true,
    order: 2,
    options: [
      { value: 'beginner', label: 'Beginner', description: 'New to programming or AI development' },
      { value: 'intermediate', label: 'Intermediate', description: 'Some programming experience, new to AI' },
      { value: 'advanced', label: 'Advanced', description: 'Experienced developer, some AI knowledge' },
      { value: 'expert', label: 'Expert', description: 'Senior developer with AI/ML experience' }
    ]
  },
  {
    id: 'projectType',
    question: 'What type of AI tool are you building?',
    description: 'Different tools work better for different types of AI applications.',
    type: 'single-choice' as const,
    required: true,
    order: 3,
    options: [
      { value: 'chatbot', label: 'Chatbot/Conversational AI', description: 'Chat interfaces, customer support bots' },
      { value: 'content', label: 'Content Generation', description: 'Text, image, or media generation tools' },
      { value: 'analysis', label: 'Data Analysis/Insights', description: 'Processing and analyzing data with AI' },
      { value: 'automation', label: 'Workflow Automation', description: 'Automating business processes with AI' },
      { value: 'api', label: 'AI API/Service', description: 'Building AI services for other developers' }
    ]
  },
  {
    id: 'teamSize',
    question: 'What\'s your team size?',
    description: 'Team size affects architecture complexity and collaboration needs.',
    type: 'single-choice' as const,
    required: true,
    order: 4,
    options: [
      { value: 'solo', label: 'Solo Developer', description: 'Just me working on this project' },
      { value: 'small', label: '2-5 people', description: 'Small team or startup' },
      { value: 'medium', label: '6-20 people', description: 'Growing team with multiple roles' },
      { value: 'large', label: '20+ people', description: 'Large team or enterprise environment' }
    ]
  },
  {
    id: 'designPriority',
    question: 'How important is custom design?',
    description: 'This affects whether we recommend component libraries or custom solutions.',
    type: 'single-choice' as const,
    required: true,
    order: 5,
    options: [
      { value: 'minimal', label: 'Minimal', description: 'Function over form, basic UI is fine' },
      { value: 'standard', label: 'Standard', description: 'Clean, professional look with components' },
      { value: 'custom', label: 'Custom', description: 'Unique brand identity and custom design' },
      { value: 'advanced', label: 'Advanced', description: 'Complex animations and interactions' }
    ]
  }
];

const initialState: EvaluationState = {
  isLoading: false,
  isSubmitted: false,
  error: null,
  progress: {
    currentStep: 0,
    totalSteps: EVALUATION_QUESTIONS.length,
    completedSteps: [],
    isComplete: false
  },
  formData: {},
  results: null
};

export default function EvaluationFlow() {
  const [state, setState] = useState<EvaluationState>(initialState);

  const updateFormData = useCallback((field: keyof EvaluationFormData, value: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState(prev => {
      const newCompletedSteps = [...prev.progress.completedSteps];
      if (!newCompletedSteps.includes(prev.progress.currentStep)) {
        newCompletedSteps.push(prev.progress.currentStep);
      }

      const nextStep = prev.progress.currentStep + 1;
      const isComplete = nextStep >= prev.progress.totalSteps;

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentStep: isComplete ? prev.progress.currentStep : nextStep,
          completedSteps: newCompletedSteps,
          isComplete: isComplete
        }
      };
    });
  }, []);

  const goToPrevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStep: Math.max(0, prev.progress.currentStep - 1),
        isComplete: false
      }
    }));
  }, []);

  const submitEvaluation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert form data to UserAnswers format
      const userAnswers: UserAnswers = {
        userId: '123e4567-e89b-12d3-a456-426614174000', // TODO: Replace with actual user ID
        answers: [
          { questionId: 'timeline', value: state.formData.timeline || 'standard' },
          { questionId: 'background', value: state.formData.background || 'intermediate' },
          { questionId: 'project-type', value: state.formData.projectType || 'chat-interface' },
          { questionId: 'team-size', value: state.formData.teamSize || 'small' },
          { questionId: 'design-priority', value: state.formData.designPriority || 'important' }
        ],
        completedAt: new Date()
      };

      // Call the evaluation API
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAnswers }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation failed: ${response.statusText}`);
      }

      const results = await response.json();

      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
        results: results,
        progress: {
          ...prev.progress,
          isComplete: true
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get recommendations'
      }));
    }
  }, [state.formData]);

  const resetEvaluation = useCallback(() => {
    setState(initialState);
  }, []);

  const canGoNext = useCallback(() => {
    const currentQuestion = EVALUATION_QUESTIONS[state.progress.currentStep];
    if (!currentQuestion) return false;
    
    const fieldValue = state.formData[currentQuestion.id as keyof EvaluationFormData];
    return fieldValue !== undefined && fieldValue !== '';
  }, [state.formData, state.progress.currentStep]);

  const canGoPrev = useCallback(() => {
    return state.progress.currentStep > 0;
  }, [state.progress.currentStep]);

  // Handle completion of the last question
  const handleLastQuestionNext = useCallback(() => {
    goToNextStep();
    if (state.progress.currentStep === EVALUATION_QUESTIONS.length - 1) {
      submitEvaluation();
    }
  }, [state.progress.currentStep, goToNextStep, submitEvaluation]);

  if (state.isSubmitted && state.results) {
    return (
      <div className="max-w-4xl mx-auto">
        <ResultsDisplay 
          results={state.results} 
          onRestart={resetEvaluation}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={state.progress.currentStep}
        totalSteps={state.progress.totalSteps}
        completedSteps={state.progress.completedSteps}
        className="mb-8"
      />

      {/* Error Display */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-red-600">{state.error}</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Question Steps */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <AnimatePresence mode="wait">
          {state.progress.currentStep < EVALUATION_QUESTIONS.length && (
            <motion.div
              key={state.progress.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionStep
                question={EVALUATION_QUESTIONS[state.progress.currentStep]}
                value={state.formData[EVALUATION_QUESTIONS[state.progress.currentStep].id as keyof EvaluationFormData] || ''}
                onChange={(value) => updateFormData(
                  EVALUATION_QUESTIONS[state.progress.currentStep].id as keyof EvaluationFormData, 
                  value as string
                )}
                onNext={state.progress.currentStep === EVALUATION_QUESTIONS.length - 1 ? handleLastQuestionNext : goToNextStep}
                onPrev={goToPrevStep}
                canGoNext={canGoNext()}
                canGoPrev={canGoPrev()}
                isLoading={state.isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {state.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing your preferences...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Question Counter */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Question {Math.min(state.progress.currentStep + 1, EVALUATION_QUESTIONS.length)} of {EVALUATION_QUESTIONS.length}
      </div>
    </div>
  );
}