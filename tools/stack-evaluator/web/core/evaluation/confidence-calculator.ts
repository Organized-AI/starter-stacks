/**
 * Confidence calculation for stack recommendations
 * Determines how certain we are about each recommendation
 */

import type { UserAnswers, Stack } from '../types/index';

export class ConfidenceCalculator {
  /**
   * Calculate confidence score for a recommendation
   */
  public calculateConfidence(userAnswers: UserAnswers, stack: Stack, score: number): number {
    const factors = {
      answerCompleteness: this.calculateCompletenessConfidence(userAnswers),
      stackMaturity: this.calculateMaturityConfidence(stack),
      scoreConsistency: this.calculateScoreConsistency(score),
      dataQuality: this.calculateDataQuality(stack),
      userSpecificity: this.calculateUserSpecificity(userAnswers),
    };

    // Weighted average of confidence factors
    const confidence = 
      factors.answerCompleteness * 0.25 +
      factors.stackMaturity * 0.20 +
      factors.scoreConsistency * 0.20 +
      factors.dataQuality * 0.20 +
      factors.userSpecificity * 0.15;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Calculate confidence based on answer completeness
   */
  private calculateCompletenessConfidence(userAnswers: UserAnswers): number {
    const totalQuestions = 5; // Based on DEFAULT_QUESTIONS in constants
    const answeredQuestions = userAnswers.answers.length;
    
    const completenessRatio = answeredQuestions / totalQuestions;
    
    // Higher completeness = higher confidence
    if (completenessRatio >= 1.0) return 1.0;
    if (completenessRatio >= 0.8) return 0.9;
    if (completenessRatio >= 0.6) return 0.7;
    if (completenessRatio >= 0.4) return 0.5;
    return 0.3;
  }

  /**
   * Calculate confidence based on stack maturity and reliability
   */
  private calculateMaturityConfidence(stack: Stack): number {
    let confidence = 0.5; // Base confidence

    // Ecosystem maturity
    switch (stack.metadata.ecosystem) {
      case 'mature':
        confidence += 0.3;
        break;
      case 'stable':
        confidence += 0.2;
        break;
      case 'emerging':
        confidence += 0.1;
        break;
      case 'experimental':
        confidence -= 0.2;
        break;
      case 'legacy':
        confidence -= 0.1;
        break;
    }

    // Documentation quality
    switch (stack.metadata.documentation) {
      case 'outstanding':
        confidence += 0.2;
        break;
      case 'excellent':
        confidence += 0.15;
        break;
      case 'good':
        confidence += 0.1;
        break;
      case 'basic':
        confidence += 0.05;
        break;
      case 'poor':
        confidence -= 0.1;
        break;
    }

    // Community support
    switch (stack.communitySupport) {
      case 'massive':
        confidence += 0.15;
        break;
      case 'vibrant':
        confidence += 0.1;
        break;
      case 'active':
        confidence += 0.05;
        break;
      case 'growing':
        confidence += 0.0;
        break;
      case 'minimal':
        confidence -= 0.1;
        break;
    }

    // Recency of updates
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (stack.metadata.lastUpdated > oneYearAgo) {
      confidence += 0.05;
    } else {
      confidence -= 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Calculate confidence based on score consistency
   */
  private calculateScoreConsistency(score: number): number {
    // Higher scores generally indicate better matches and higher confidence
    if (score >= 85) return 0.95;
    if (score >= 75) return 0.9;
    if (score >= 65) return 0.8;
    if (score >= 55) return 0.7;
    if (score >= 45) return 0.6;
    if (score >= 35) return 0.5;
    return 0.4;
  }

  /**
   * Calculate confidence based on data quality
   */
  private calculateDataQuality(stack: Stack): number {
    let confidence = 0.5;

    // Complete information increases confidence
    if (stack.pros.length >= 3) confidence += 0.1;
    if (stack.cons.length >= 2) confidence += 0.1;
    if (stack.bestFor.length >= 3) confidence += 0.1;
    if (stack.avoidIf.length >= 2) confidence += 0.1;
    if (stack.components.length >= 3) confidence += 0.1;

    // Pricing information completeness
    if (stack.pricing.monthlyCost.length >= 2) confidence += 0.05;
    if (stack.pricing.hasFreeTier !== undefined) confidence += 0.05;

    // Metadata completeness
    if (stack.metadata.githubStars !== undefined) confidence += 0.05;
    if (stack.metadata.npmDownloads !== undefined) confidence += 0.05;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Calculate confidence based on user answer specificity
   */
  private calculateUserSpecificity(userAnswers: UserAnswers): number {
    let confidence = 0.5;

    // Check for specific vs generic answers
    for (const answer of userAnswers.answers) {
      if (this.isSpecificAnswer(answer.questionId, answer.value)) {
        confidence += 0.1;
      }
    }

    // Bonus for consistent answer patterns
    if (this.hasConsistentAnswers(userAnswers)) {
      confidence += 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Check if an answer is specific rather than generic
   */
  private isSpecificAnswer(questionId: string, value: unknown): boolean {
    if (typeof value !== 'string') return false;

    // Specific timeline answers
    if (questionId === 'timeline' && ['30-minutes', '2-hours'].includes(value)) {
      return true;
    }

    // Specific background answers
    if (questionId === 'background' && ['expert', 'non-technical'].includes(value)) {
      return true;
    }

    // Specific project type answers
    if (questionId === 'project-type' && value !== 'general') {
      return true;
    }

    return false;
  }

  /**
   * Check if user answers show consistent patterns
   */
  private hasConsistentAnswers(userAnswers: UserAnswers): boolean {
    const timeline = this.findAnswer(userAnswers, 'timeline');
    const background = this.findAnswer(userAnswers, 'background');

    // Consistency check: non-technical users usually need longer timelines
    if (background === 'non-technical' && ['30-minutes', '2-hours'].includes(timeline)) {
      return false; // Inconsistent
    }

    // Consistency check: experts can handle shorter timelines
    if (background === 'expert' && timeline === '1-2-weeks') {
      return false; // Potentially inconsistent
    }

    return true;
  }

  /**
   * Get confidence level as human-readable string
   */
  public getConfidenceLevel(confidence: number): ConfidenceLevel {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    if (confidence >= 0.4) return 'low';
    return 'very-low';
  }

  /**
   * Generate confidence explanation
   */
  public generateConfidenceExplanation(
    userAnswers: UserAnswers, 
    stack: Stack, 
    confidence: number
  ): string {
    const level = this.getConfidenceLevel(confidence);
    
    let explanation = `We have ${level} confidence in this recommendation because `;

    const reasons: string[] = [];

    // Answer completeness
    const completeness = userAnswers.answers.length / 5;
    if (completeness >= 0.8) {
      reasons.push('you provided complete information');
    } else if (completeness >= 0.6) {
      reasons.push('you provided most required information');
    } else {
      reasons.push('limited information was provided');
    }

    // Stack maturity
    if (stack.metadata.ecosystem === 'mature') {
      reasons.push('this is a well-established technology stack');
    } else if (stack.metadata.ecosystem === 'experimental') {
      reasons.push('this stack is still experimental');
    }

    // Documentation quality
    if (['excellent', 'outstanding'].includes(stack.metadata.documentation)) {
      reasons.push('excellent documentation is available');
    } else if (stack.metadata.documentation === 'poor') {
      reasons.push('documentation quality is limited');
    }

    explanation += reasons.slice(0, 2).join(' and ');
    
    if (level === 'high') {
      explanation += '. This recommendation should work well for your needs.';
    } else if (level === 'medium') {
      explanation += '. Consider trying this option while keeping alternatives in mind.';
    } else {
      explanation += '. We recommend researching additional options before deciding.';
    }

    return explanation;
  }

  // Helper methods
  private findAnswer(userAnswers: UserAnswers, questionId: string): string {
    const answer = userAnswers.answers.find(a => a.questionId === questionId);
    return answer && typeof answer.value === 'string' ? answer.value : '';
  }
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'very-low';