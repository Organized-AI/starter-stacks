// Re-export types from the core evaluation engine
export type {
  UserAnswers,
  Stack,
  StackRecommendation,
  RecommendedStack,
  Answer,
  EvaluationQuestion,
  QuestionOption,
} from '../../../lib/types/index.js';

// Web-specific types
export interface EvaluationFormData {
  timeline: string;
  background: string;
  projectType: string;
  teamSize: string;
  designPriority: string;
}

export interface QuestionStepProps {
  question: EvaluationQuestion;
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
  results: StackRecommendation | null;
}

export interface RecommendationCardProps {
  recommendation: RecommendedStack;
  rank: number;
  isPrimary?: boolean;
}

export interface ComparisonTableProps {
  recommendations: RecommendedStack[];
  selectedStacks?: string[];
  onSelectionChange?: (stackIds: string[]) => void;
}

export interface ShareableResult {
  id: string;
  timestamp: Date;
  userAnswers: UserAnswers;
  recommendations: RecommendedStack[];
  metadata: {
    userAgent?: string;
    source?: string;
  };
}