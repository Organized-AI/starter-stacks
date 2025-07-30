/**
 * Unit tests for EvaluationEngine
 * Tests core evaluation logic and recommendation generation
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EvaluationEngine } from '../../lib/evaluation/evaluation-engine.js';
import { testUtils } from '../setup.js';

describe('EvaluationEngine', () => {
  let evaluationEngine: EvaluationEngine;

  beforeEach(() => {
    evaluationEngine = new EvaluationEngine();
    evaluationEngine.clearCache(); // Clear cache between tests
  });

  describe('evaluate', () => {
    it('should return valid recommendation for valid input', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      expect(result).toBeDefined();
      expect(result.recommendation).toBeDefined();
      expect(result.performance).toBeDefined();
      
      // Check recommendation structure
      expect(result.recommendation.userId).toBe(userAnswers.userId);
      expect(result.recommendation.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendation.recommendations)).toBe(true);
      expect(result.recommendation.evaluationId).toBeDefined();
      expect(result.recommendation.timestamp).toBeInstanceOf(Date);
      expect(result.recommendation.metadata).toBeDefined();
      
      // Check performance metrics
      expect(result.performance.evaluationId).toBe(result.recommendation.evaluationId);
      expect(typeof result.performance.responseTime).toBe('number');
      expect(result.performance.responseTime).toBeGreaterThan(0);
      expect(typeof result.performance.stacksProcessed).toBe('number');
      expect(result.performance.cacheHit).toBe(false); // First call shouldn't be cached
    });

    it('should return recommendations within limits', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      expect(result.recommendation.recommendations.length).toBeLessThanOrEqual(5); // RECOMMENDATION_LIMITS.maxRecommendations
      
      // Each recommendation should have required properties
      result.recommendation.recommendations.forEach((rec, index) => {
        expect(rec.stack).toBeDefined();
        expect(rec.score).toBeGreaterThanOrEqual(0);
        expect(rec.score).toBeLessThanOrEqual(100);
        expect(rec.confidence).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
        expect(rec.rank).toBe(index + 1);
        expect(Array.isArray(rec.reasoning)).toBe(true);
        expect(Array.isArray(rec.matchedCriteria)).toBe(true);
        expect(Array.isArray(rec.mismatches)).toBe(true);
      });
    });

    it('should return recommendations sorted by score', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      const scores = result.recommendation.recommendations.map(r => r.score);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]!).toBeLessThanOrEqual(scores[i - 1]!);
      }
    });

    it('should handle cache correctly', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      // First call
      const result1 = await evaluationEngine.evaluate(userAnswers);
      expect(result1.performance.cacheHit).toBe(false);
      
      // Second call with same answers should be cached
      const result2 = await evaluationEngine.evaluate(userAnswers);
      expect(result2.performance.cacheHit).toBe(true);
      expect(result2.performance.responseTime).toBeLessThan(result1.performance.responseTime);
      
      // Recommendations should be identical
      expect(result2.recommendation.recommendations).toEqual(result1.recommendation.recommendations);
    });

    it('should reject invalid user answers', async () => {
      const invalidAnswers = {
        userId: 'invalid-uuid',
        answers: [],
        completedAt: 'not-a-date',
      };
      
      await expect(evaluationEngine.evaluate(invalidAnswers as any)).rejects.toThrow();
    });

    it('should handle empty answers array', async () => {
      const userAnswers = testUtils.createMockUserAnswers({
        answers: []
      });
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      // Should still return recommendations, but with lower confidence
      expect(result.recommendation.recommendations.length).toBeGreaterThan(0);
      result.recommendation.recommendations.forEach(rec => {
        expect(rec.confidence).toBeLessThan(0.8); // Lower confidence for incomplete data
      });
    });

    it('should generate different recommendations for different user profiles', async () => {
      const beginnerAnswers = testUtils.createMockUserAnswers({
        answers: [
          { questionId: 'timeline', value: '30-minutes' },
          { questionId: 'background', value: 'beginner' },
          { questionId: 'project-type', value: 'chat-interface' },
          { questionId: 'team-size', value: 'solo' },
          { questionId: 'design-priority', value: 'basic' },
        ]
      });
      
      const expertAnswers = testUtils.createMockUserAnswers({
        answers: [
          { questionId: 'timeline', value: '1-2-weeks' },
          { questionId: 'background', value: 'expert' },
          { questionId: 'project-type', value: 'complex-workflows' },
          { questionId: 'team-size', value: 'large' },
          { questionId: 'design-priority', value: 'critical' },
        ]
      });
      
      const beginnerResult = await evaluationEngine.evaluate(beginnerAnswers);
      const expertResult = await evaluationEngine.evaluate(expertAnswers);
      
      // Top recommendations should be different
      expect(beginnerResult.recommendation.recommendations[0]?.stack.id)
        .not.toBe(expertResult.recommendation.recommendations[0]?.stack.id);
      
      // Beginner should get recommendations with easier learning curves
      const beginnerTopStack = beginnerResult.recommendation.recommendations[0]?.stack;
      expect(['minimal', 'easy', 'moderate']).toContain(beginnerTopStack?.learningCurve);
    });

    it('should include performance metadata', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      expect(result.recommendation.metadata).toMatchObject({
        algorithmVersion: expect.any(String),
        processingTime: expect.any(Number),
        totalStacksEvaluated: expect.any(Number),
        filterCriteria: expect.any(Array),
      });
      
      expect(result.recommendation.metadata.processingTime).toBeGreaterThan(0);
      expect(result.recommendation.metadata.totalStacksEvaluated).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('should clear evaluation cache', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      // First call
      await evaluationEngine.evaluate(userAnswers);
      
      // Clear cache
      evaluationEngine.clearCache();
      
      // Second call should not be cached
      const result = await evaluationEngine.evaluate(userAnswers);
      expect(result.performance.cacheHit).toBe(false);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const stats = evaluationEngine.getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('hitRate');
      
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });

    it('should update cache size after evaluations', async () => {
      const initialStats = evaluationEngine.getCacheStats();
      expect(initialStats.size).toBe(0);
      
      const userAnswers = testUtils.createMockUserAnswers();
      await evaluationEngine.evaluate(userAnswers);
      
      const afterStats = evaluationEngine.getCacheStats();
      expect(afterStats.size).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should throw EvaluationError for malformed input', async () => {
      const malformedInput = null;
      
      await expect(evaluationEngine.evaluate(malformedInput as any))
        .rejects.toThrow('Invalid user answers format');
    });

    it('should include context in error messages', async () => {
      const invalidInput = {
        userId: 'not-a-uuid',
        answers: 'not-an-array',
        completedAt: new Date(),
      };
      
      try {
        await evaluationEngine.evaluate(invalidInput as any);
      } catch (error: any) {
        expect(error.name).toBe('EvaluationError');
        expect(error.code).toBe('INVALID_INPUT');
        expect(error.context).toBeDefined();
      }
    });
  });

  describe('recommendation quality', () => {
    it('should provide reasoning for each recommendation', async () => {
      const userAnswers = testUtils.createMockUserAnswers();
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      result.recommendation.recommendations.forEach(rec => {
        expect(rec.reasoning.length).toBeGreaterThan(0);
        expect(rec.reasoning.every(reason => typeof reason === 'string')).toBe(true);
      });
    });

    it('should identify mismatches when present', async () => {
      const userAnswers = testUtils.createMockUserAnswers({
        answers: [
          { questionId: 'timeline', value: '30-minutes' },
          { questionId: 'background', value: 'non-technical' },
          { questionId: 'project-type', value: 'complex-workflows' },
        ]
      });
      
      const result = await evaluationEngine.evaluate(userAnswers);
      
      // Should identify potential mismatches for non-technical user wanting complex workflows
      const hasRelevantMismatches = result.recommendation.recommendations.some(rec => 
        rec.mismatches.some(mismatch => 
          mismatch.toLowerCase().includes('technical') || 
          mismatch.toLowerCase().includes('complex')
        )
      );
      
      expect(hasRelevantMismatches).toBe(true);
    });
  });
});