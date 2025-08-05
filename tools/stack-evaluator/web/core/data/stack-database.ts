/**
 * Stack database management utilities
 * Implements efficient loading, caching, and querying of stacks
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { Stack } from '../types/index';
import { StackSchema } from '../schemas/index';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class StackDatabase {
  private static instance: StackDatabase;
  private stacks: Map<string, Stack> = new Map();
  private loaded = false;
  private loadError: Error | null = null;

  private constructor() {}

  public static getInstance(): StackDatabase {
    if (!StackDatabase.instance) {
      StackDatabase.instance = new StackDatabase();
    }
    return StackDatabase.instance;
  }

  /**
   * Load stacks from JSON file with validation
   */
  private async loadStacks(): Promise<void> {
    if (this.loaded) return;

    try {
      const dataPath = join(__dirname, '../../data/stacks.json');
      const rawData = readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(rawData) as { stacks: unknown[] };

      if (!parsed.stacks || !Array.isArray(parsed.stacks)) {
        throw new Error('Invalid stacks.json format');
      }

      // Validate and load each stack
      for (const stackData of parsed.stacks) {
        try {
          // Convert date strings to Date objects
          const rawStack = stackData as any;
          const processedData = {
            ...rawStack,
            metadata: {
              ...rawStack.metadata,
              lastUpdated: new Date(rawStack.metadata.lastUpdated)
            }
          };
          const validated = StackSchema.parse(processedData);
          this.stacks.set(validated.id, validated);
        } catch (error) {
          console.error(`Failed to validate stack: ${JSON.stringify(stackData)}`);
          throw new Error(`Stack validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      this.loaded = true;
    } catch (error) {
      this.loadError = error instanceof Error ? error : new Error('Unknown error loading stacks');
      throw this.loadError;
    }
  }

  /**
   * Get all stacks
   */
  public async getAllStacks(): Promise<Stack[]> {
    await this.loadStacks();
    return Array.from(this.stacks.values());
  }

  /**
   * Get stack by ID
   */
  public async getStackById(id: string): Promise<Stack | null> {
    await this.loadStacks();
    return this.stacks.get(id) || null;
  }

  /**
   * Get stacks by category
   */
  public async getStacksByCategory(category: Stack['category']): Promise<Stack[]> {
    await this.loadStacks();
    return Array.from(this.stacks.values()).filter(stack => stack.category === category);
  }

  /**
   * Search stacks by criteria
   */
  public async searchStacks(criteria: StackSearchCriteria): Promise<Stack[]> {
    await this.loadStacks();
    let results = Array.from(this.stacks.values());

    if (criteria.categories?.length) {
      results = results.filter(stack => criteria.categories!.includes(stack.category));
    }

    if (criteria.maxLearningCurve) {
      const curveOrder = ['minimal', 'easy', 'moderate', 'steep', 'expert'];
      const maxIndex = curveOrder.indexOf(criteria.maxLearningCurve);
      results = results.filter(stack => {
        const stackIndex = curveOrder.indexOf(stack.learningCurve);
        return stackIndex <= maxIndex;
      });
    }

    if (criteria.maxTimeToProduction) {
      const timeOrder = ['30-minutes', '2-hours', '1-day', '1-week', '2-weeks', '1-month'];
      const maxIndex = timeOrder.indexOf(criteria.maxTimeToProduction);
      results = results.filter(stack => {
        const stackIndex = timeOrder.indexOf(stack.timeToProduction);
        return stackIndex <= maxIndex;
      });
    }

    if (criteria.requireFreeTier) {
      results = results.filter(stack => stack.pricing.hasFreeTier);
    }

    if (criteria.maxMonthlyCost !== undefined) {
      results = results.filter(stack => {
        const minCost = Math.min(...stack.pricing.monthlyCost.map(tier => tier.minCost));
        return minCost <= criteria.maxMonthlyCost!;
      });
    }

    if (criteria.excludeExperimental) {
      results = results.filter(stack => stack.metadata.ecosystem !== 'experimental');
    }

    if (criteria.excludeLegacy) {
      results = results.filter(stack => stack.metadata.ecosystem !== 'legacy');
    }

    if (criteria.minDocumentationQuality) {
      const qualityOrder = ['poor', 'basic', 'good', 'excellent', 'outstanding'];
      const minIndex = qualityOrder.indexOf(criteria.minDocumentationQuality);
      results = results.filter(stack => {
        const stackIndex = qualityOrder.indexOf(stack.metadata.documentation);
        return stackIndex >= minIndex;
      });
    }

    return results;
  }

  /**
   * Get stack statistics
   */
  public async getStackStats(): Promise<StackStats> {
    await this.loadStacks();
    const stacks = Array.from(this.stacks.values());

    return {
      totalStacks: stacks.length,
      byCategory: this.groupBy(stacks, 'category'),
      byLearningCurve: this.groupBy(stacks, 'learningCurve'),
      byTimeToProduction: this.groupBy(stacks, 'timeToProduction'),
      averageProsCount: this.average(stacks.map(s => s.pros.length)),
      averageConsCount: this.average(stacks.map(s => s.cons.length)),
      withFreeTier: stacks.filter(s => s.pricing.hasFreeTier).length,
    };
  }

  /**
   * Validate stack data
   */
  public validateStack(stackData: unknown): z.infer<typeof StackSchema> {
    return StackSchema.parse(stackData);
  }

  /**
   * Check if database is loaded
   */
  public isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Get load error if any
   */
  public getLoadError(): Error | null {
    return this.loadError;
  }

  /**
   * Reload stacks (useful for testing or updates)
   */
  public async reload(): Promise<void> {
    this.stacks.clear();
    this.loaded = false;
    this.loadError = null;
    await this.loadStacks();
  }

  // Helper methods
  private groupBy<K extends keyof Stack>(stacks: Stack[], key: K): Record<string, number> {
    return stacks.reduce((acc, stack) => {
      const value = String(stack[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
}

export interface StackSearchCriteria {
  categories?: Stack['category'][];
  maxLearningCurve?: Stack['learningCurve'];
  maxTimeToProduction?: Stack['timeToProduction'];
  requireFreeTier?: boolean;
  maxMonthlyCost?: number;
  excludeExperimental?: boolean;
  excludeLegacy?: boolean;
  minDocumentationQuality?: Stack['metadata']['documentation'];
}

export interface StackStats {
  totalStacks: number;
  byCategory: Record<string, number>;
  byLearningCurve: Record<string, number>;
  byTimeToProduction: Record<string, number>;
  averageProsCount: number;
  averageConsCount: number;
  withFreeTier: number;
}

// Export singleton instance
export const stackDatabase = StackDatabase.getInstance();