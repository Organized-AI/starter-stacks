/**
 * Application constants and configuration
 * Central place for all magic numbers and configuration values
 */

export const APP_CONFIG = {
  name: 'AI Tool Stack Evaluator',
  version: '1.0.0',
  description: 'Find the perfect tech stack for your AI project',
} as const;

export const EVALUATION_CONFIG = {
  minQuestions: 5,
  maxQuestions: 10,
  defaultTimeout: 30000, // 30 seconds
  maxRetries: 3,
  cacheExpiry: 3600000, // 1 hour
} as const;

export const SCORING_WEIGHTS = {
  technicalMatch: 0.25,
  timelineMatch: 0.20,
  budgetMatch: 0.15,
  scalingMatch: 0.15,
  teamMatch: 0.10,
  preferenceMatch: 0.10,
  communityMatch: 0.05,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  high: 0.8,
  medium: 0.6,
  low: 0.4,
} as const;

export const RECOMMENDATION_LIMITS = {
  maxRecommendations: 5,
  minScore: 50,
  minConfidence: 0.4,
} as const;

export const PERFORMANCE_THRESHOLDS = {
  responseTime: {
    excellent: 100,
    good: 500,
    acceptable: 1000,
    slow: 2000,
  },
  stackProcessing: {
    small: 10,
    medium: 50,
    large: 100,
  },
} as const;

export const ERROR_MESSAGES = {
  INVALID_USER_PROFILE: 'Invalid user profile data',
  INVALID_ANSWERS: 'Invalid or incomplete answers provided',
  NO_MATCHING_STACKS: 'No stacks match your criteria',
  EVALUATION_TIMEOUT: 'Evaluation timed out',
  DATABASE_ERROR: 'Error accessing stack database',
  ALGORITHM_ERROR: 'Error in recommendation algorithm',
} as const;

export const STACK_FILTERS = {
  excludeExperimental: true,
  excludeLegacy: true,
  requireDocumentation: 'basic',
  maxLearningCurve: 'steep',
} as const;

export const CACHE_KEYS = {
  stacks: 'stacks:all',
  evaluation: (userId: string) => `evaluation:${userId}`,
  recommendation: (evalId: string) => `recommendation:${evalId}`,
} as const;

export const MONITORING_EVENTS = {
  EVALUATION_START: 'evaluation.start',
  EVALUATION_COMPLETE: 'evaluation.complete',
  EVALUATION_ERROR: 'evaluation.error',
  RECOMMENDATION_GENERATED: 'recommendation.generated',
  CACHE_HIT: 'cache.hit',
  CACHE_MISS: 'cache.miss',
} as const;

export const DEFAULT_QUESTIONS = [
  {
    id: 'timeline',
    question: 'How quickly do you need a working prototype?',
    description: 'This helps us recommend stacks that match your urgency',
    type: 'single-choice' as const,
    options: [
      { value: '30-minutes', label: '30 minutes', description: 'Need something immediately' },
      { value: '2-hours', label: '2 hours', description: 'Same day prototype' },
      { value: 'same-day', label: 'Same day', description: 'By end of today' },
      { value: 'weekend', label: 'This weekend', description: '2-3 days' },
      { value: '1-2-weeks', label: '1-2 weeks', description: 'Have time to learn' },
    ],
    required: true,
    order: 1,
  },
  {
    id: 'background',
    question: "What's your technical background?",
    description: 'We\'ll recommend stacks that match your experience level',
    type: 'single-choice' as const,
    options: [
      { value: 'non-technical', label: 'Non-technical', description: 'Designer, PM, or Founder' },
      { value: 'beginner', label: 'Beginner Developer', description: 'Learning to code' },
      { value: 'intermediate', label: 'Intermediate Developer', description: '1-3 years experience' },
      { value: 'experienced', label: 'Experienced Developer', description: '3+ years experience' },
      { value: 'expert', label: 'Expert/Architect', description: 'Deep technical expertise' },
    ],
    required: true,
    order: 2,
  },
  {
    id: 'project-type',
    question: 'What type of AI tool are you building?',
    description: 'Different project types benefit from different stacks',
    type: 'single-choice' as const,
    options: [
      { value: 'chat-interface', label: 'Chat Interface', description: 'Conversational AI' },
      { value: 'data-analysis', label: 'Data Analysis', description: 'Processing and insights' },
      { value: 'content-generation', label: 'Content Generation', description: 'Text, image, or code' },
      { value: 'complex-workflows', label: 'Complex Workflows', description: 'Multi-step AI processes' },
      { value: 'global-app', label: 'Global App', description: 'Performance-critical, worldwide' },
      { value: 'research-tool', label: 'Research Tool', description: 'Experimental or academic' },
    ],
    required: true,
    order: 3,
  },
  {
    id: 'team-size',
    question: "What's your team composition?",
    description: 'Some stacks work better for different team sizes',
    type: 'single-choice' as const,
    options: [
      { value: 'solo', label: 'Solo', description: 'Just me' },
      { value: 'small', label: 'Small Team', description: '2-5 people' },
      { value: 'medium', label: 'Medium Team', description: '6-20 people' },
      { value: 'large', label: 'Large Team', description: '20+ people' },
    ],
    required: true,
    order: 4,
  },
  {
    id: 'design-priority',
    question: 'How important is the design/UI?',
    description: 'Some stacks include better design tools and components',
    type: 'single-choice' as const,
    options: [
      { value: 'none', label: "Don't care", description: 'Function over form' },
      { value: 'basic', label: 'Basic is fine', description: 'Clean and usable' },
      { value: 'important', label: 'Important', description: 'Should look professional' },
      { value: 'critical', label: 'Critical', description: 'Pixel-perfect required' },
    ],
    required: true,
    order: 5,
  },
] as const;