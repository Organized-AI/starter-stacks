/**
 * Stack data validation utilities
 * Comprehensive validation for stack database integrity
 */

import type { Stack } from '../types/index.js';
import { StackSchema } from '../schemas/index.js';
import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stackId?: string;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
  suggestion?: string;
}

export class StackValidator {
  /**
   * Validate a single stack with comprehensive checks
   */
  public static validateStack(stackData: unknown): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Basic schema validation
      const validated = StackSchema.parse(stackData);
      result.stackId = validated.id;

      // Business logic validation
      this.validateBusinessLogic(validated, result);
      
      // Data quality checks
      this.validateDataQuality(validated, result);

      // Consistency checks
      this.validateConsistency(validated, result);

    } catch (error) {
      result.isValid = false;
      if (error instanceof z.ZodError) {
        result.errors.push(...this.convertZodErrors(error));
      } else {
        result.errors.push({
          code: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown validation error',
        });
      }
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Validate business logic rules
   */
  private static validateBusinessLogic(stack: Stack, result: ValidationResult): void {
    // Pricing validation
    if (stack.pricing.hasFreeTier) {
      const hasZeroCostTier = stack.pricing.monthlyCost.some(tier => tier.minCost === 0);
      if (!hasZeroCostTier) {
        result.errors.push({
          code: 'INVALID_FREE_TIER',
          message: 'Stack claims to have free tier but no pricing tier has zero cost',
          field: 'pricing',
        });
      }
    }

    // Time to production vs learning curve consistency
    const timeOrder = ['30-minutes', '2-hours', '1-day', '1-week', '2-weeks', '1-month'];
    const curveOrder = ['minimal', 'easy', 'moderate', 'steep', 'expert'];
    
    const timeIndex = timeOrder.indexOf(stack.timeToProduction);
    const curveIndex = curveOrder.indexOf(stack.learningCurve);

    // If learning curve is high but time to production is very low, that's suspicious
    if (curveIndex >= 3 && timeIndex <= 1) {
      result.warnings.push({
        code: 'INCONSISTENT_TIME_COMPLEXITY',
        message: 'High learning curve but very fast time to production seems inconsistent',
        field: 'learningCurve,timeToProduction',
        suggestion: 'Review if learning curve or time to production is accurate',
      });
    }

    // Validate component categories
    const requiredCategories = ['framework', 'hosting'] as const;
    const presentCategories = stack.components.map(c => c.category);
    
    for (const required of requiredCategories) {
      if (!presentCategories.includes(required)) {
        result.warnings.push({
          code: 'MISSING_COMPONENT_CATEGORY',
          message: `Stack missing ${required} component`,
          field: 'components',
          suggestion: `Consider adding a ${required} component`,
        });
      }
    }
  }

  /**
   * Validate data quality
   */
  private static validateDataQuality(stack: Stack, result: ValidationResult): void {
    // Check for empty arrays that should have content
    if (stack.pros.length === 0) {
      result.warnings.push({
        code: 'EMPTY_PROS',
        message: 'Stack has no pros listed',
        field: 'pros',
        suggestion: 'Add at least 2-3 advantages',
      });
    }

    if (stack.cons.length === 0) {
      result.warnings.push({
        code: 'EMPTY_CONS',
        message: 'Stack has no cons listed',
        field: 'cons',
        suggestion: 'Add at least 1-2 disadvantages for balance',
      });
    }

    if (stack.bestFor.length === 0) {
      result.errors.push({
        code: 'EMPTY_BEST_FOR',
        message: 'Stack must specify what it is best for',
        field: 'bestFor',
      });
    }

    // Check description quality
    if (stack.description.length < 20) {
      result.warnings.push({
        code: 'SHORT_DESCRIPTION',
        message: 'Stack description is very short',
        field: 'description',
        suggestion: 'Provide a more detailed description (at least 20 characters)',
      });
    }

    // Check for placeholder text
    const placeholderPatterns = [/TODO/i, /FIXME/i, /placeholder/i, /example/i];
    const textFields = [stack.description, ...stack.pros, ...stack.cons, ...stack.bestFor];
    
    for (const text of textFields) {
      for (const pattern of placeholderPatterns) {
        if (pattern.test(text)) {
          result.warnings.push({
            code: 'PLACEHOLDER_TEXT',
            message: 'Text appears to contain placeholder content',
            value: text,
            suggestion: 'Replace placeholder text with actual content',
          });
        }
      }
    }

    // Validate GitHub stars if present
    if (stack.metadata.githubStars !== undefined && stack.metadata.githubStars < 0) {
      result.errors.push({
        code: 'INVALID_GITHUB_STARS',
        message: 'GitHub stars cannot be negative',
        field: 'metadata.githubStars',
        value: stack.metadata.githubStars,
      });
    }

    // Check last updated date
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (stack.metadata.lastUpdated < oneYearAgo) {
      result.warnings.push({
        code: 'OUTDATED_STACK',
        message: 'Stack data is more than a year old',
        field: 'metadata.lastUpdated',
        suggestion: 'Update stack information with recent data',
      });
    }
  }

  /**
   * Validate internal consistency
   */
  private static validateConsistency(stack: Stack, result: ValidationResult): void {
    // Check pricing tier consistency
    for (const tier of stack.pricing.monthlyCost) {
      if (tier.minCost > tier.maxCost) {
        result.errors.push({
          code: 'INVALID_PRICING_RANGE',
          message: `Pricing tier "${tier.name}" has min cost greater than max cost`,
          field: 'pricing.monthlyCost',
          value: tier,
        });
      }
    }

    // Check for duplicate component categories
    const categories = stack.components.map(c => c.category);
    const duplicates = categories.filter((cat, index) => categories.indexOf(cat) !== index);
    
    if (duplicates.length > 0) {
      result.warnings.push({
        code: 'DUPLICATE_COMPONENT_CATEGORIES',
        message: 'Stack has multiple components in the same category',
        field: 'components',
        value: [...new Set(duplicates)],
        suggestion: 'Consider if multiple components in same category are necessary',
      });
    }

    // Validate that enterprise/performance-optimized stacks have appropriate characteristics
    if (stack.category === 'enterprise' || stack.category === 'performance-optimized') {
      if (stack.communitySupport === 'minimal' || stack.communitySupport === 'growing') {
        result.warnings.push({
          code: 'ENTERPRISE_LOW_COMMUNITY',
          message: 'Enterprise/performance stack should have strong community support',
          field: 'communitySupport',
          suggestion: 'Verify community support level for enterprise stack',
        });
      }

      if (stack.metadata.documentation === 'poor' || stack.metadata.documentation === 'basic') {
        result.warnings.push({
          code: 'ENTERPRISE_POOR_DOCS',
          message: 'Enterprise/performance stack should have good documentation',
          field: 'metadata.documentation',
          suggestion: 'Enterprise stacks typically need excellent documentation',
        });
      }
    }

    // Rapid prototype stacks should be quick to learn and deploy
    if (stack.category === 'rapid-prototype') {
      const slowTime = ['2-weeks', '1-month'];
      const hardCurve = ['steep', 'expert'];
      
      if (slowTime.includes(stack.timeToProduction)) {
        result.warnings.push({
          code: 'SLOW_RAPID_PROTOTYPE',
          message: 'Rapid prototype stack should have faster time to production',
          field: 'timeToProduction',
          suggestion: 'Consider if this truly qualifies as rapid prototyping',
        });
      }

      if (hardCurve.includes(stack.learningCurve)) {
        result.warnings.push({
          code: 'HARD_RAPID_PROTOTYPE',
          message: 'Rapid prototype stack should have easier learning curve',
          field: 'learningCurve',
          suggestion: 'Consider if this truly qualifies as rapid prototyping',
        });
      }
    }
  }

  /**
   * Convert Zod validation errors to our format
   */
  private static convertZodErrors(zodError: z.ZodError): ValidationError[] {
    return zodError.errors.map(error => ({
      code: 'SCHEMA_VALIDATION_ERROR',
      message: error.message,
      field: error.path.join('.'),
      value: error.code,
    }));
  }

  /**
   * Validate multiple stacks
   */
  public static validateStacks(stacksData: unknown[]): ValidationResult[] {
    return stacksData.map(stackData => this.validateStack(stackData));
  }

  /**
   * Get summary of validation results
   */
  public static getValidationSummary(results: ValidationResult[]): ValidationSummary {
    const valid = results.filter(r => r.isValid).length;
    const invalid = results.length - valid;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    const errorCounts = results
      .flatMap(r => r.errors)
      .reduce((acc, error) => {
        acc[error.code] = (acc[error.code] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const warningCounts = results
      .flatMap(r => r.warnings)
      .reduce((acc, warning) => {
        acc[warning.code] = (acc[warning.code] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalStacks: results.length,
      validStacks: valid,
      invalidStacks: invalid,
      totalErrors,
      totalWarnings,
      errorsByType: errorCounts,
      warningsByType: warningCounts,
    };
  }
}

export interface ValidationSummary {
  totalStacks: number;
  validStacks: number;
  invalidStacks: number;
  totalErrors: number;
  totalWarnings: number;
  errorsByType: Record<string, number>;
  warningsByType: Record<string, number>;
}

// Helper function for quick stack validation
export function validateStack(stackData: unknown): ValidationResult {
  return StackValidator.validateStack(stackData);
}

// Helper function for batch validation
export function validateStacks(stacksData: unknown[]): ValidationResult[] {
  return StackValidator.validateStacks(stacksData);
}