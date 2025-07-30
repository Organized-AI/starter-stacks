/**
 * Core evaluation engine for AI tool stack recommendations
 * Implements sophisticated scoring algorithm with ai-engineer patterns
 */

import type { 
  UserAnswers, 
  Stack, 
  StackRecommendation, 
  RecommendedStack,
  PerformanceMetrics 
} from '../types/index.js';
import type { StackSearchCriteria } from '../data/stack-database.js';
import { stackDatabase } from '../data/stack-database.js';
import { ScoringAlgorithm } from './scoring-algorithm.js';
import { RecommendationGenerator } from './recommendation-generator.js';
import { ConfidenceCalculator } from './confidence-calculator.js';
import { EVALUATION_CONFIG, RECOMMENDATION_LIMITS } from '../constants.js';
import { UserAnswersSchema } from '../schemas/index.js';
import { v4 as uuidv4 } from 'uuid';

export class EvaluationEngine {
  private scoringAlgorithm: ScoringAlgorithm;
  private recommendationGenerator: RecommendationGenerator;
  private confidenceCalculator: ConfidenceCalculator;
  private cache: Map<string, StackRecommendation> = new Map();

  constructor() {
    this.scoringAlgorithm = new ScoringAlgorithm();
    this.recommendationGenerator = new RecommendationGenerator();
    this.confidenceCalculator = new ConfidenceCalculator();
  }

  /**
   * Main evaluation method - processes user answers and returns recommendations
   */
  public async evaluate(userAnswers: UserAnswers): Promise<EvaluationResult> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validatedAnswers = this.validateUserAnswers(userAnswers);
      
      // Check cache first
      const cacheKey = this.generateCacheKey(validatedAnswers);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return {
          recommendation: cached,
          performance: {
            evaluationId: cached.evaluationId,
            responseTime: Date.now() - startTime,
            stacksProcessed: 0,
            cacheHit: true,
            timestamp: new Date(),
          },
        };
      }

      // Get filtered stacks based on user criteria
      const searchCriteria = this.extractSearchCriteria(validatedAnswers);
      const availableStacks = await stackDatabase.searchStacks(searchCriteria);

      if (availableStacks.length === 0) {
        throw new Error('No stacks match your criteria');
      }

      // Score each stack
      const scoredStacks = await this.scoreStacks(validatedAnswers, availableStacks);

      // Filter by minimum requirements
      const qualifiedStacks = scoredStacks.filter(
        stack => stack.score >= RECOMMENDATION_LIMITS.minScore &&
                stack.confidence >= RECOMMENDATION_LIMITS.minConfidence
      );

      if (qualifiedStacks.length === 0) {
        throw new Error('No stacks meet the minimum requirements');
      }

      // Generate final recommendations
      const recommendations = this.generateRecommendations(qualifiedStacks);

      // Create recommendation object
      const recommendation: StackRecommendation = {
        userId: validatedAnswers.userId,
        recommendations,
        evaluationId: uuidv4(),
        timestamp: new Date(),
        metadata: {
          algorithmVersion: '1.0.0',
          processingTime: Date.now() - startTime,
          totalStacksEvaluated: availableStacks.length,
          filterCriteria: Object.keys(searchCriteria),
        },
      };

      // Cache the result
      this.cache.set(cacheKey, recommendation);

      return {
        recommendation,
        performance: {
          evaluationId: recommendation.evaluationId,
          responseTime: Date.now() - startTime,
          stacksProcessed: availableStacks.length,
          cacheHit: false,
          timestamp: new Date(),
        },
      };

    } catch (error) {
      throw new EvaluationError(
        error instanceof Error ? error.message : 'Unknown evaluation error',
        'EVALUATION_FAILED',
        { userAnswers, processingTime: Date.now() - startTime }
      );
    }
  }

  /**
   * Validate user answers against schema
   */
  private validateUserAnswers(userAnswers: UserAnswers): UserAnswers {
    try {
      return UserAnswersSchema.parse(userAnswers);
    } catch (error) {
      throw new EvaluationError(
        'Invalid user answers format',
        'INVALID_INPUT',
        { userAnswers, validationError: error }
      );
    }
  }

  /**
   * Extract search criteria from user answers
   */
  private extractSearchCriteria(userAnswers: UserAnswers): StackSearchCriteria {
    const criteria: StackSearchCriteria = {};

    for (const answer of userAnswers.answers) {
      switch (answer.questionId) {
        case 'timeline':
          if (typeof answer.value === 'string') {
            criteria.maxTimeToProduction = this.mapTimelineToProduction(answer.value);
          }
          break;
        
        case 'background':
          if (typeof answer.value === 'string') {
            criteria.maxLearningCurve = this.mapBackgroundToLearning(answer.value);
          }
          break;

        case 'budget':
          if (typeof answer.value === 'number') {
            criteria.maxMonthlyCost = answer.value;
          }
          break;

        case 'free-tier':
          if (typeof answer.value === 'string' && answer.value === 'required') {
            criteria.requireFreeTier = true;
          }
          break;
      }
    }

    // Apply default filters
    criteria.excludeExperimental = true;
    criteria.excludeLegacy = true;
    criteria.minDocumentationQuality = 'basic';

    return criteria;
  }

  /**
   * Score all available stacks against user criteria
   */
  private async scoreStacks(
    userAnswers: UserAnswers, 
    stacks: Stack[]
  ): Promise<ScoredStack[]> {
    const scoredStacks: ScoredStack[] = [];

    for (const stack of stacks) {
      const score = await this.scoringAlgorithm.calculateScore(userAnswers, stack);
      const confidence = this.confidenceCalculator.calculateConfidence(userAnswers, stack, score);
      const reasoning = this.generateReasoning(userAnswers, stack, score);
      const matchedCriteria = this.extractMatchedCriteria(userAnswers, stack, score);
      const mismatches = this.extractMismatches(userAnswers, stack);

      scoredStacks.push({
        stack,
        score: Math.round(score * 100) / 100, // Round to 2 decimal places
        confidence: Math.round(confidence * 1000) / 1000, // Round to 3 decimal places
        reasoning,
        matchedCriteria,
        mismatches,
      });
    }

    return scoredStacks.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate final recommendations with ranking
   */
  private generateRecommendations(scoredStacks: ScoredStack[]): RecommendedStack[] {
    return scoredStacks
      .slice(0, RECOMMENDATION_LIMITS.maxRecommendations)
      .map((scored, index) => ({
        ...scored,
        rank: index + 1,
      }));
  }

  /**
   * Generate reasoning for a stack recommendation
   */
  private generateReasoning(userAnswers: UserAnswers, stack: Stack, score: number): string[] {
    const reasoning: string[] = [];

    // Add primary match reasons
    if (score >= 80) {
      reasoning.push(`Excellent match for your requirements (${Math.round(score)}% compatibility)`);
    } else if (score >= 60) {
      reasoning.push(`Good match for your requirements (${Math.round(score)}% compatibility)`);
    } else {
      reasoning.push(`Partial match for your requirements (${Math.round(score)}% compatibility)`);
    }

    // Add specific strengths
    const timeline = this.findAnswer(userAnswers, 'timeline');
    if (timeline && this.matchesTimeline(stack, timeline)) {
      reasoning.push(`Matches your ${timeline} timeline requirement`);
    }

    const background = this.findAnswer(userAnswers, 'background');
    if (background && this.matchesBackground(stack, background)) {
      reasoning.push(`Appropriate for your ${background} experience level`);
    }

    const projectType = this.findAnswer(userAnswers, 'project-type');
    if (projectType && stack.bestFor.some(use => use.toLowerCase().includes(projectType.toLowerCase()))) {
      reasoning.push(`Specifically designed for ${projectType} applications`);
    }

    // Add stack-specific advantages
    if (stack.pros.length > 0) {
      reasoning.push(`Key advantage: ${stack.pros[0]}`);
    }

    return reasoning;
  }

  /**
   * Extract matched criteria with scores
   */
  private extractMatchedCriteria(userAnswers: UserAnswers, stack: Stack, totalScore: number): any[] {
    // This would be implemented based on the scoring algorithm breakdown
    return [
      {
        criterion: 'Overall Compatibility',
        weight: 1.0,
        score: totalScore / 100,
        explanation: `Stack matches ${Math.round(totalScore)}% of your requirements`,
      },
    ];
  }

  /**
   * Extract mismatches and concerns
   */
  private extractMismatches(userAnswers: UserAnswers, stack: Stack): string[] {
    const mismatches: string[] = [];

    // Check for common mismatches
    const timeline = this.findAnswer(userAnswers, 'timeline');
    if (timeline === '30-minutes' && !['30-minutes', '2-hours'].includes(stack.timeToProduction)) {
      mismatches.push('May take longer than your desired timeline');
    }

    const background = this.findAnswer(userAnswers, 'background');
    if (background === 'non-technical' && ['steep', 'expert'].includes(stack.learningCurve)) {
      mismatches.push('May be too technical for non-technical users');
    }

    if (stack.cons.length > 0) {
      mismatches.push(`Consider: ${stack.cons[0]}`);
    }

    return mismatches;
  }

  /**
   * Generate cache key from user answers
   */
  private generateCacheKey(userAnswers: UserAnswers): string {
    const answersHash = JSON.stringify(
      userAnswers.answers.sort((a, b) => a.questionId.localeCompare(b.questionId))
    );
    return Buffer.from(answersHash).toString('base64');
  }

  /**
   * Clear evaluation cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): CacheStats {
    return {
      size: this.cache.size,
      maxSize: 1000, // Could be configurable
      hitRate: 0, // Would need tracking
    };
  }

  // Helper methods
  private findAnswer(userAnswers: UserAnswers, questionId: string): string | null {
    const answer = userAnswers.answers.find(a => a.questionId === questionId);
    return answer && typeof answer.value === 'string' ? answer.value : null;
  }

  private mapTimelineToProduction(timeline: string): Stack['timeToProduction'] {
    const mapping: Record<string, Stack['timeToProduction']> = {
      '30-minutes': '30-minutes',
      '2-hours': '2-hours',
      'same-day': '1-day',
      'weekend': '1-week',
      '1-2-weeks': '2-weeks',
    };
    return mapping[timeline] || '1-week';
  }

  private mapBackgroundToLearning(background: string): Stack['learningCurve'] {
    const mapping: Record<string, Stack['learningCurve']> = {
      'non-technical': 'minimal',
      'beginner': 'easy',
      'intermediate': 'moderate',
      'experienced': 'steep',
      'expert': 'expert',
    };
    return mapping[background] || 'moderate';
  }

  private matchesTimeline(stack: Stack, timeline: string): boolean {
    const userMax = this.mapTimelineToProduction(timeline);
    const timeOrder = ['30-minutes', '2-hours', '1-day', '1-week', '2-weeks', '1-month'];
    const userIndex = timeOrder.indexOf(userMax);
    const stackIndex = timeOrder.indexOf(stack.timeToProduction);
    return stackIndex <= userIndex;
  }

  private matchesBackground(stack: Stack, background: string): boolean {
    const userMax = this.mapBackgroundToLearning(background);
    const curveOrder = ['minimal', 'easy', 'moderate', 'steep', 'expert'];
    const userIndex = curveOrder.indexOf(userMax);
    const stackIndex = curveOrder.indexOf(stack.learningCurve);
    return stackIndex <= userIndex;
  }
}

// Supporting interfaces and types
interface ScoredStack {
  stack: Stack;
  score: number;
  confidence: number;
  reasoning: string[];
  matchedCriteria: any[];
  mismatches: string[];
}

export interface EvaluationResult {
  recommendation: StackRecommendation;
  performance: PerformanceMetrics;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
}

export class EvaluationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'EvaluationError';
  }
}

// Export singleton instance
export const evaluationEngine = new EvaluationEngine();