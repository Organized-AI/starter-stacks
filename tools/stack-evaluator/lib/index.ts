/**
 * Main entry point for AI Tool Stack Evaluator library
 * Exports all core functionality
 */

// Core types and schemas
export * from './types/index.js';
export { 
  TechnicalBackgroundSchema,
  TimelineUrgencySchema,
  ProjectTypeSchema,
  UserProfileSchema,
  StackSchema,
  StackRecommendationSchema,
  UserAnswersSchema,
  EvaluationResultSchema 
} from './schemas/index.js';
export { APP_CONFIG, EVALUATION_CONFIG, DEFAULT_QUESTIONS } from './constants.js';

// Database and validation
export { stackDatabase, type StackSearchCriteria, type StackStats } from './data/stack-database.js';
export { validateStack, validateStacks, type ValidationResult } from './data/stack-validator.js';

// Evaluation engine
export { 
  evaluationEngine, 
  EvaluationEngine, 
  EvaluationError,
  type EvaluationResult,
  type CacheStats 
} from './evaluation/evaluation-engine.js';

export { ScoringAlgorithm } from './evaluation/scoring-algorithm.js';
export { ConfidenceCalculator, type ConfidenceLevel } from './evaluation/confidence-calculator.js';
export { 
  RecommendationGenerator,
  type GettingStartedGuide,
  type CostAnalysis,
  type ImplementationPhase 
} from './evaluation/recommendation-generator.js';

// Performance monitoring
export { 
  performanceMonitor, 
  type PerformanceStats,
  type PerformanceReport 
} from './utils/performance-monitor.js';

// Main evaluation function for easy use
export async function evaluateStack(userAnswers: any) {
  const { evaluationEngine } = await import('./evaluation/evaluation-engine.js');
  return evaluationEngine.evaluate(userAnswers);
}