/**
 * Core TypeScript interfaces for AI Tool Stack Evaluator
 * Following backend-architect patterns for clean API design
 */

export interface UserProfile {
  id: string;
  technicalBackground: TechnicalBackground;
  projectRequirements: ProjectRequirements;
  teamComposition: TeamComposition;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type TechnicalBackground = 
  | 'non-technical'
  | 'beginner'
  | 'intermediate'
  | 'experienced'
  | 'expert';

export interface ProjectRequirements {
  timelineUrgency: TimelineUrgency;
  projectType: ProjectType;
  scalingNeeds: ScalingNeeds;
  budgetRange: BudgetRange;
  performanceRequirements: PerformanceRequirements;
}

export type TimelineUrgency = 
  | '30-minutes'
  | '2-hours'
  | 'same-day'
  | 'weekend'
  | '1-2-weeks';

export type ProjectType = 
  | 'chat-interface'
  | 'data-analysis'
  | 'content-generation'
  | 'complex-workflows'
  | 'global-app'
  | 'research-tool';

export interface ScalingNeeds {
  expectedUsers: number;
  dataVolume: DataVolume;
  globalReach: boolean;
  realTimeRequirements: boolean;
}

export type DataVolume = 'small' | 'medium' | 'large' | 'massive';

export interface BudgetRange {
  monthly: number;
  maxSetupCost: number;
  preferFreeTier: boolean;
}

export interface PerformanceRequirements {
  responseTime: ResponseTimeRequirement;
  availability: AvailabilityRequirement;
  concurrentUsers: number;
}

export type ResponseTimeRequirement = 'relaxed' | 'normal' | 'fast' | 'real-time';
export type AvailabilityRequirement = 'hobby' | 'business' | 'critical';

export interface TeamComposition {
  size: TeamSize;
  hasDesigner: boolean;
  hasDevOps: boolean;
  hasPM: boolean;
}

export type TeamSize = 'solo' | 'small' | 'medium' | 'large';

export interface UserPreferences {
  preferredLanguages: ProgrammingLanguage[];
  avoidTechnologies: string[];
  designPriority: DesignPriority;
  deploymentPreference: DeploymentPreference;
}

export type ProgrammingLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'csharp'
  | 'no-code';

export type DesignPriority = 'none' | 'basic' | 'important' | 'critical';
export type DeploymentPreference = 'managed' | 'self-hosted' | 'hybrid' | 'no-preference';

export interface EvaluationQuestion {
  id: string;
  question: string;
  description: string;
  type: QuestionType;
  options: QuestionOption[];
  required: boolean;
  order: number;
}

export type QuestionType = 'single-choice' | 'multiple-choice' | 'range';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface UserAnswers {
  userId: string;
  answers: Answer[];
  completedAt: Date;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface Stack {
  id: string;
  name: string;
  description: string;
  category: StackCategory;
  components: StackComponent[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  avoidIf: string[];
  pricing: StackPricing;
  learningCurve: LearningCurve;
  timeToProduction: TimeToProduction;
  communitySupport: CommunitySupport;
  metadata: StackMetadata;
}

export type StackCategory = 
  | 'rapid-prototype'
  | 'no-code'
  | 'traditional'
  | 'enterprise'
  | 'performance-optimized';

export interface StackComponent {
  name: string;
  category: ComponentCategory;
  description: string;
  version?: string;
  alternatives?: string[];
}

export type ComponentCategory = 
  | 'framework'
  | 'ui-library'
  | 'database'
  | 'hosting'
  | 'ai-provider'
  | 'authentication'
  | 'monitoring'
  | 'tool';

export interface StackPricing {
  setupCost: number;
  monthlyCost: MonthlyTier[];
  hasFreeTier: boolean;
  freeTrialDays?: number;
}

export interface MonthlyTier {
  name: string;
  minCost: number;
  maxCost: number;
  includedResources: string[];
}

export type LearningCurve = 'minimal' | 'easy' | 'moderate' | 'steep' | 'expert';
export type TimeToProduction = '30-minutes' | '2-hours' | '1-day' | '1-week' | '2-weeks' | '1-month';
export type CommunitySupport = 'minimal' | 'growing' | 'active' | 'vibrant' | 'massive';

export interface StackMetadata {
  githubStars?: number;
  npmDownloads?: number;
  lastUpdated: Date;
  documentation: DocumentationQuality;
  ecosystem: EcosystemMaturity;
}

export type DocumentationQuality = 'poor' | 'basic' | 'good' | 'excellent' | 'outstanding';
export type EcosystemMaturity = 'experimental' | 'emerging' | 'stable' | 'mature' | 'legacy';

export interface StackRecommendation {
  userId: string;
  recommendations: RecommendedStack[];
  evaluationId: string;
  timestamp: Date;
  metadata: RecommendationMetadata;
}

export interface RecommendedStack {
  stack: Stack;
  score: number;
  confidence: number;
  reasoning: string[];
  matchedCriteria: MatchedCriteria[];
  mismatches: string[];
  rank: number;
}

export interface MatchedCriteria {
  criterion: string;
  weight: number;
  score: number;
  explanation: string;
}

export interface RecommendationMetadata {
  algorithmVersion: string;
  processingTime: number;
  totalStacksEvaluated: number;
  filterCriteria: string[];
}

export interface EvaluationResult {
  userAnswers: UserAnswers;
  recommendation: StackRecommendation;
  feedback?: UserFeedback;
}

export interface UserFeedback {
  helpful: boolean;
  selectedStackId?: string;
  comments?: string;
  rating?: number;
}

export interface PerformanceMetrics {
  evaluationId: string;
  responseTime: number;
  stacksProcessed: number;
  cacheHit: boolean;
  timestamp: Date;
}

export interface ErrorLog {
  id: string;
  error: string;
  context: Record<string, unknown>;
  stack?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}