/**
 * Main entry point for AI Tool Stack Evaluator library
 * Exports all core functionality
 */

// Core types and schemas
export * from './types/index';
export { 
  TechnicalBackgroundSchema,
  TimelineUrgencySchema,
  ProjectTypeSchema,
  UserProfileSchema,
  StackSchema,
  StackRecommendationSchema,
  UserAnswersSchema,
  EvaluationResultSchema 
} from './schemas/index';
export { APP_CONFIG, EVALUATION_CONFIG, DEFAULT_QUESTIONS } from './constants';

// Database and validation
export { stackDatabase, type StackSearchCriteria, type StackStats } from './data/stack-database';
export { validateStack, validateStacks, type ValidationResult } from './data/stack-validator';

// Evaluation engine
export { 
  evaluationEngine, 
  EvaluationEngine, 
  EvaluationError,
  type EvaluationResult,
  type CacheStats 
} from './evaluation/evaluation-engine';

export { ScoringAlgorithm } from './evaluation/scoring-algorithm';
export { ConfidenceCalculator, type ConfidenceLevel } from './evaluation/confidence-calculator';
export { 
  RecommendationGenerator,
  type GettingStartedGuide,
  type CostAnalysis,
  type ImplementationPhase 
} from './evaluation/recommendation-generator';

// Performance monitoring
export { 
  performanceMonitor, 
  type PerformanceStats,
  type PerformanceReport 
} from './utils/performance-monitor';

// Main evaluation function for easy use
export async function evaluateStack(userAnswers: any) {
  const { evaluationEngine } = await import('./evaluation/evaluation-engine');
  return evaluationEngine.evaluate(userAnswers);
}