/**
 * Zod validation schemas for all types
 * Implements runtime validation with comprehensive error messages
 */

import { z } from 'zod';

// Enums as Zod schemas for runtime validation
export const TechnicalBackgroundSchema = z.enum([
  'non-technical',
  'beginner',
  'intermediate',
  'experienced',
  'expert'
]);

export const TimelineUrgencySchema = z.enum([
  '30-minutes',
  '2-hours',
  'same-day',
  'weekend',
  '1-2-weeks'
]);

export const ProjectTypeSchema = z.enum([
  'chat-interface',
  'data-analysis',
  'content-generation',
  'complex-workflows',
  'global-app',
  'research-tool'
]);

export const DataVolumeSchema = z.enum(['small', 'medium', 'large', 'massive']);

export const ResponseTimeRequirementSchema = z.enum(['relaxed', 'normal', 'fast', 'real-time']);

export const AvailabilityRequirementSchema = z.enum(['hobby', 'business', 'critical']);

export const TeamSizeSchema = z.enum(['solo', 'small', 'medium', 'large']);

export const ProgrammingLanguageSchema = z.enum([
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'csharp',
  'no-code'
]);

export const DesignPrioritySchema = z.enum(['none', 'basic', 'important', 'critical']);

export const DeploymentPreferenceSchema = z.enum(['managed', 'self-hosted', 'hybrid', 'no-preference']);

export const QuestionTypeSchema = z.enum(['single-choice', 'multiple-choice', 'range']);

export const StackCategorySchema = z.enum([
  'rapid-prototype',
  'no-code',
  'traditional',
  'enterprise',
  'performance-optimized'
]);

export const ComponentCategorySchema = z.enum([
  'framework',
  'ui-library',
  'database',
  'hosting',
  'ai-provider',
  'authentication',
  'monitoring',
  'tool'
]);

export const LearningCurveSchema = z.enum(['minimal', 'easy', 'moderate', 'steep', 'expert']);

export const TimeToProductionSchema = z.enum([
  '30-minutes',
  '2-hours',
  '1-day',
  '1-week',
  '2-weeks',
  '1-month'
]);

export const CommunitySupportSchema = z.enum(['minimal', 'growing', 'active', 'vibrant', 'massive']);

export const DocumentationQualitySchema = z.enum(['poor', 'basic', 'good', 'excellent', 'outstanding']);

export const EcosystemMaturitySchema = z.enum(['experimental', 'emerging', 'stable', 'mature', 'legacy']);

// Complex schemas
export const ScalingNeedsSchema = z.object({
  expectedUsers: z.number().min(0).max(1000000000),
  dataVolume: DataVolumeSchema,
  globalReach: z.boolean(),
  realTimeRequirements: z.boolean()
});

export const BudgetRangeSchema = z.object({
  monthly: z.number().min(0).max(1000000),
  maxSetupCost: z.number().min(0).max(1000000),
  preferFreeTier: z.boolean()
});

export const PerformanceRequirementsSchema = z.object({
  responseTime: ResponseTimeRequirementSchema,
  availability: AvailabilityRequirementSchema,
  concurrentUsers: z.number().min(1).max(10000000)
});

export const ProjectRequirementsSchema = z.object({
  timelineUrgency: TimelineUrgencySchema,
  projectType: ProjectTypeSchema,
  scalingNeeds: ScalingNeedsSchema,
  budgetRange: BudgetRangeSchema,
  performanceRequirements: PerformanceRequirementsSchema
});

export const TeamCompositionSchema = z.object({
  size: TeamSizeSchema,
  hasDesigner: z.boolean(),
  hasDevOps: z.boolean(),
  hasPM: z.boolean()
});

export const UserPreferencesSchema = z.object({
  preferredLanguages: z.array(ProgrammingLanguageSchema),
  avoidTechnologies: z.array(z.string()),
  designPriority: DesignPrioritySchema,
  deploymentPreference: DeploymentPreferenceSchema
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  technicalBackground: TechnicalBackgroundSchema,
  projectRequirements: ProjectRequirementsSchema,
  teamComposition: TeamCompositionSchema,
  preferences: UserPreferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export const QuestionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional()
});

export const EvaluationQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  description: z.string(),
  type: QuestionTypeSchema,
  options: z.array(QuestionOptionSchema),
  required: z.boolean(),
  order: z.number()
});

export const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.number()])
});

export const UserAnswersSchema = z.object({
  userId: z.string().uuid(),
  answers: z.array(AnswerSchema),
  completedAt: z.date()
});

export const StackComponentSchema = z.object({
  name: z.string(),
  category: ComponentCategorySchema,
  description: z.string(),
  version: z.string().optional(),
  alternatives: z.array(z.string()).optional()
});

export const MonthlyTierSchema = z.object({
  name: z.string(),
  minCost: z.number().min(0),
  maxCost: z.number().min(0),
  includedResources: z.array(z.string())
});

export const StackPricingSchema = z.object({
  setupCost: z.number().min(0),
  monthlyCost: z.array(MonthlyTierSchema),
  hasFreeTier: z.boolean(),
  freeTrialDays: z.number().min(0).optional()
});

export const StackMetadataSchema = z.object({
  githubStars: z.number().min(0).optional(),
  npmDownloads: z.number().min(0).optional(),
  lastUpdated: z.date(),
  documentation: DocumentationQualitySchema,
  ecosystem: EcosystemMaturitySchema
});

export const StackSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: StackCategorySchema,
  components: z.array(StackComponentSchema),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  bestFor: z.array(z.string()),
  avoidIf: z.array(z.string()),
  pricing: StackPricingSchema,
  learningCurve: LearningCurveSchema,
  timeToProduction: TimeToProductionSchema,
  communitySupport: CommunitySupportSchema,
  metadata: StackMetadataSchema
});

export const MatchedCriteriaSchema = z.object({
  criterion: z.string(),
  weight: z.number().min(0).max(1),
  score: z.number().min(0).max(1),
  explanation: z.string()
});

export const RecommendedStackSchema = z.object({
  stack: StackSchema,
  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  reasoning: z.array(z.string()),
  matchedCriteria: z.array(MatchedCriteriaSchema),
  mismatches: z.array(z.string()),
  rank: z.number().min(1)
});

export const RecommendationMetadataSchema = z.object({
  algorithmVersion: z.string(),
  processingTime: z.number().min(0),
  totalStacksEvaluated: z.number().min(0),
  filterCriteria: z.array(z.string())
});

export const StackRecommendationSchema = z.object({
  userId: z.string().uuid(),
  recommendations: z.array(RecommendedStackSchema),
  evaluationId: z.string().uuid(),
  timestamp: z.date(),
  metadata: RecommendationMetadataSchema
});

export const UserFeedbackSchema = z.object({
  helpful: z.boolean(),
  selectedStackId: z.string().optional(),
  comments: z.string().optional(),
  rating: z.number().min(1).max(5).optional()
});

export const EvaluationResultSchema = z.object({
  userAnswers: UserAnswersSchema,
  recommendation: StackRecommendationSchema,
  feedback: UserFeedbackSchema.optional()
});

export const PerformanceMetricsSchema = z.object({
  evaluationId: z.string().uuid(),
  responseTime: z.number().min(0),
  stacksProcessed: z.number().min(0),
  cacheHit: z.boolean(),
  timestamp: z.date()
});

export const ErrorLogSchema = z.object({
  id: z.string().uuid(),
  error: z.string(),
  context: z.record(z.unknown()),
  stack: z.string().optional(),
  timestamp: z.date(),
  severity: z.enum(['low', 'medium', 'high', 'critical'])
});

// Export type inference helpers
export type TechnicalBackground = z.infer<typeof TechnicalBackgroundSchema>;
export type TimelineUrgency = z.infer<typeof TimelineUrgencySchema>;
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Stack = z.infer<typeof StackSchema>;
export type StackRecommendation = z.infer<typeof StackRecommendationSchema>;
export type UserAnswers = z.infer<typeof UserAnswersSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;