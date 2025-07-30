/**
 * Unit tests for StackDatabase
 * Tests database loading, validation, and querying functionality
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { StackDatabase } from '../../lib/data/stack-database.js';
import { testUtils } from '../setup.js';

describe('StackDatabase', () => {
  let stackDatabase: StackDatabase;

  beforeEach(() => {
    stackDatabase = StackDatabase.getInstance();
    // Clear any cached data
    stackDatabase.reload();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = StackDatabase.getInstance();
      const instance2 = StackDatabase.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAllStacks', () => {
    it('should load and return all stacks', async () => {
      const stacks = await stackDatabase.getAllStacks();
      
      expect(stacks).toBeDefined();
      expect(Array.isArray(stacks)).toBe(true);
      expect(stacks.length).toBeGreaterThan(0);
      
      // Verify each stack has required properties
      stacks.forEach(stack => {
        expect(stack).toHaveProperty('id');
        expect(stack).toHaveProperty('name');
        expect(stack).toHaveProperty('description');
        expect(stack).toHaveProperty('category');
        expect(stack).toHaveProperty('components');
        expect(stack).toHaveProperty('pros');
        expect(stack).toHaveProperty('cons');
      });
    });

    it('should return same data on subsequent calls (caching)', async () => {
      const stacks1 = await stackDatabase.getAllStacks();
      const stacks2 = await stackDatabase.getAllStacks();
      
      expect(stacks1).toEqual(stacks2);
      expect(stacks1.length).toBe(stacks2.length);
    });
  });

  describe('getStackById', () => {
    it('should return stack by valid ID', async () => {
      const allStacks = await stackDatabase.getAllStacks();
      const firstStack = allStacks[0];
      
      const foundStack = await stackDatabase.getStackById(firstStack.id);
      
      expect(foundStack).toBeDefined();
      expect(foundStack?.id).toBe(firstStack.id);
      expect(foundStack?.name).toBe(firstStack.name);
    });

    it('should return null for invalid ID', async () => {
      const foundStack = await stackDatabase.getStackById('non-existent-id');
      expect(foundStack).toBeNull();
    });

    it('should return null for empty ID', async () => {
      const foundStack = await stackDatabase.getStackById('');
      expect(foundStack).toBeNull();
    });
  });

  describe('getStacksByCategory', () => {
    it('should return stacks for valid category', async () => {
      const traditionalStacks = await stackDatabase.getStacksByCategory('traditional');
      
      expect(Array.isArray(traditionalStacks)).toBe(true);
      traditionalStacks.forEach(stack => {
        expect(stack.category).toBe('traditional');
      });
    });

    it('should return empty array for non-existent category', async () => {
      const stacks = await stackDatabase.getStacksByCategory('non-existent' as any);
      expect(stacks).toEqual([]);
    });

    it('should return stacks for each valid category', async () => {
      const categories = ['rapid-prototype', 'no-code', 'traditional', 'enterprise', 'performance-optimized'];
      
      for (const category of categories) {
        const stacks = await stackDatabase.getStacksByCategory(category as any);
        expect(Array.isArray(stacks)).toBe(true);
        // Each returned stack should have the correct category
        stacks.forEach(stack => {
          expect(stack.category).toBe(category);
        });
      }
    });
  });

  describe('searchStacks', () => {
    it('should return all stacks with empty criteria', async () => {
      const allStacks = await stackDatabase.getAllStacks();
      const searchResults = await stackDatabase.searchStacks({});
      
      expect(searchResults.length).toBe(allStacks.length);
    });

    it('should filter by categories', async () => {
      const results = await stackDatabase.searchStacks({
        categories: ['traditional', 'no-code']
      });
      
      results.forEach(stack => {
        expect(['traditional', 'no-code']).toContain(stack.category);
      });
    });

    it('should filter by maxLearningCurve', async () => {
      const results = await stackDatabase.searchStacks({
        maxLearningCurve: 'easy'
      });
      
      const curveOrder = ['minimal', 'easy', 'moderate', 'steep', 'expert'];
      results.forEach(stack => {
        const stackIndex = curveOrder.indexOf(stack.learningCurve);
        const maxIndex = curveOrder.indexOf('easy');
        expect(stackIndex).toBeLessThanOrEqual(maxIndex);
      });
    });

    it('should filter by maxTimeToProduction', async () => {
      const results = await stackDatabase.searchStacks({
        maxTimeToProduction: '1-day'
      });
      
      const timeOrder = ['30-minutes', '2-hours', '1-day', '1-week', '2-weeks', '1-month'];
      results.forEach(stack => {
        const stackIndex = timeOrder.indexOf(stack.timeToProduction);
        const maxIndex = timeOrder.indexOf('1-day');
        expect(stackIndex).toBeLessThanOrEqual(maxIndex);
      });
    });

    it('should filter by requireFreeTier', async () => {
      const results = await stackDatabase.searchStacks({
        requireFreeTier: true
      });
      
      results.forEach(stack => {
        expect(stack.pricing.hasFreeTier).toBe(true);
      });
    });

    it('should filter by maxMonthlyCost', async () => {
      const maxCost = 50;
      const results = await stackDatabase.searchStacks({
        maxMonthlyCost: maxCost
      });
      
      results.forEach(stack => {
        const minCost = Math.min(...stack.pricing.monthlyCost.map(tier => tier.minCost));
        expect(minCost).toBeLessThanOrEqual(maxCost);
      });
    });

    it('should exclude experimental stacks when specified', async () => {
      const results = await stackDatabase.searchStacks({
        excludeExperimental: true
      });
      
      results.forEach(stack => {
        expect(stack.metadata.ecosystem).not.toBe('experimental');
      });
    });

    it('should exclude legacy stacks when specified', async () => {
      const results = await stackDatabase.searchStacks({
        excludeLegacy: true
      });
      
      results.forEach(stack => {
        expect(stack.metadata.ecosystem).not.toBe('legacy');
      });
    });

    it('should filter by minimum documentation quality', async () => {
      const results = await stackDatabase.searchStacks({
        minDocumentationQuality: 'good'
      });
      
      const qualityOrder = ['poor', 'basic', 'good', 'excellent', 'outstanding'];
      results.forEach(stack => {
        const stackIndex = qualityOrder.indexOf(stack.metadata.documentation);
        const minIndex = qualityOrder.indexOf('good');
        expect(stackIndex).toBeGreaterThanOrEqual(minIndex);
      });
    });

    it('should combine multiple criteria', async () => {
      const results = await stackDatabase.searchStacks({
        requireFreeTier: true,
        maxLearningCurve: 'moderate',
        categories: ['traditional', 'rapid-prototype']
      });
      
      results.forEach(stack => {
        expect(stack.pricing.hasFreeTier).toBe(true);
        expect(['traditional', 'rapid-prototype']).toContain(stack.category);
        
        const curveOrder = ['minimal', 'easy', 'moderate', 'steep', 'expert'];
        const stackIndex = curveOrder.indexOf(stack.learningCurve);
        const maxIndex = curveOrder.indexOf('moderate');
        expect(stackIndex).toBeLessThanOrEqual(maxIndex);
      });
    });
  });

  describe('getStackStats', () => {
    it('should return valid statistics', async () => {
      const stats = await stackDatabase.getStackStats();
      
      expect(stats).toHaveProperty('totalStacks');
      expect(stats).toHaveProperty('byCategory');
      expect(stats).toHaveProperty('byLearningCurve');
      expect(stats).toHaveProperty('byTimeToProduction');
      expect(stats).toHaveProperty('averageProsCount');
      expect(stats).toHaveProperty('averageConsCount');
      expect(stats).toHaveProperty('withFreeTier');
      
      expect(stats.totalStacks).toBeGreaterThan(0);
      expect(typeof stats.averageProsCount).toBe('number');
      expect(typeof stats.averageConsCount).toBe('number');
      expect(typeof stats.withFreeTier).toBe('number');
    });

    it('should have consistent totals', async () => {
      const stats = await stackDatabase.getStackStats();
      const allStacks = await stackDatabase.getAllStacks();
      
      expect(stats.totalStacks).toBe(allStacks.length);
      
      // Check category totals
      const categoryTotal = Object.values(stats.byCategory).reduce((sum, count) => sum + count, 0);
      expect(categoryTotal).toBe(stats.totalStacks);
    });
  });

  describe('validateStack', () => {
    it('should validate valid stack data', () => {
      const validStack = testUtils.createMockStack();
      
      expect(() => {
        stackDatabase.validateStack(validStack);
      }).not.toThrow();
    });

    it('should throw error for invalid stack data', () => {
      const invalidStack = {
        id: 'test',
        // Missing required fields
      };
      
      expect(() => {
        stackDatabase.validateStack(invalidStack);
      }).toThrow();
    });

    it('should validate all required fields', () => {
      const incompleteStack = testUtils.createMockStack();
      delete (incompleteStack as any).name;
      
      expect(() => {
        stackDatabase.validateStack(incompleteStack);
      }).toThrow();
    });
  });

  describe('isLoaded and getLoadError', () => {
    it('should return loading state correctly', async () => {
      expect(stackDatabase.isLoaded()).toBe(false);
      
      await stackDatabase.getAllStacks();
      
      expect(stackDatabase.isLoaded()).toBe(true);
      expect(stackDatabase.getLoadError()).toBeNull();
    });
  });

  describe('reload', () => {
    it('should reload stack data', async () => {
      // Load initial data
      const stacks1 = await stackDatabase.getAllStacks();
      expect(stackDatabase.isLoaded()).toBe(true);
      
      // Reload
      await stackDatabase.reload();
      
      // Should still be loaded with same data
      expect(stackDatabase.isLoaded()).toBe(true);
      const stacks2 = await stackDatabase.getAllStacks();
      expect(stacks2.length).toBe(stacks1.length);
    });
  });
});