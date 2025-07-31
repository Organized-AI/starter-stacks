// Import types from the core evaluation engine
import type {
  UserAnswers as CoreUserAnswers,
  Stack as CoreStack,
  StackRecommendation as CoreStackRecommendation,
  RecommendedStack as CoreRecommendedStack,
  Answer as CoreAnswer,
  EvaluationQuestion as CoreEvaluationQuestion,
  QuestionOption as CoreQuestionOption,
} from '@/core/index';

// Re-export core types
export type UserAnswers = CoreUserAnswers;
export type Stack = CoreStack;
export type StackRecommendation = CoreStackRecommendation;
export type RecommendedStack = CoreRecommendedStack;
export type Answer = CoreAnswer;
export type EvaluationQuestion = CoreEvaluationQuestion;
export type QuestionOption = CoreQuestionOption;

// Web-specific types
export interface EvaluationFormData {
  timeline: string;
  background: string;
  projectType: string;
  teamSize: string;
  designPriority: string;
}

export interface QuestionStepProps {
  question: CoreEvaluationQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLoading?: boolean;
}

export interface ProgressState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  isComplete: boolean;
}

export interface EvaluationState {
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | null;
  progress: ProgressState;
  formData: Partial<EvaluationFormData>;
  results: CoreStackRecommendation | null;
}

export interface RecommendationCardProps {
  recommendation: CoreRecommendedStack;
  rank: number;
  isPrimary?: boolean;
}

export interface ComparisonTableProps {
  recommendations: CoreRecommendedStack[];
  selectedStacks?: string[];
  onSelectionChange?: (stackIds: string[]) => void;
}

export interface ShareableResult {
  id: string;
  timestamp: Date;
  userAnswers: CoreUserAnswers;
  recommendations: CoreRecommendedStack[];
  metadata: {
    userAgent?: string;
    source?: string;
  };
}