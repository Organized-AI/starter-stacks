/**
 * Advanced scoring algorithm for stack evaluation
 * Implements weighted multi-criteria scoring with ai-engineer optimization patterns
 */

import type { UserAnswers, Stack } from '../types/index';
import { SCORING_WEIGHTS } from '../constants';

export class ScoringAlgorithm {
  /**
   * Calculate comprehensive score for a stack against user requirements
   */
  public async calculateScore(userAnswers: UserAnswers, stack: Stack): Promise<number> {
    const scores = {
      technicalMatch: this.calculateTechnicalMatch(userAnswers, stack),
      timelineMatch: this.calculateTimelineMatch(userAnswers, stack),
      budgetMatch: this.calculateBudgetMatch(userAnswers, stack),
      scalingMatch: this.calculateScalingMatch(userAnswers, stack),
      teamMatch: this.calculateTeamMatch(userAnswers, stack),
      preferenceMatch: this.calculatePreferenceMatch(userAnswers, stack),
      communityMatch: this.calculateCommunityMatch(userAnswers, stack),
    };

    // Apply weighted scoring
    const weightedScore = 
      scores.technicalMatch * SCORING_WEIGHTS.technicalMatch +
      scores.timelineMatch * SCORING_WEIGHTS.timelineMatch +
      scores.budgetMatch * SCORING_WEIGHTS.budgetMatch +
      scores.scalingMatch * SCORING_WEIGHTS.scalingMatch +
      scores.teamMatch * SCORING_WEIGHTS.teamMatch +
      scores.preferenceMatch * SCORING_WEIGHTS.preferenceMatch +
      scores.communityMatch * SCORING_WEIGHTS.communityMatch;

    // Apply bonus/penalty modifiers
    const finalScore = this.applyModifiers(weightedScore, userAnswers, stack);

    return Math.max(0, Math.min(100, finalScore));
  }

  /**
   * Calculate technical background match
   */
  private calculateTechnicalMatch(userAnswers: UserAnswers, stack: Stack): number {
    const background = this.findAnswerValue(userAnswers, 'background') as string;
    if (!background) return 0;

    const learningCurveScore = this.scoreLearningCurve(background, stack.learningCurve);
    const documentationScore = this.scoreDocumentation(background, stack.metadata.documentation);
    
    return (learningCurveScore * 0.7) + (documentationScore * 0.3);
  }

  /**
   * Calculate timeline/urgency match
   */
  private calculateTimelineMatch(userAnswers: UserAnswers, stack: Stack): number {
    const timeline = this.findAnswerValue(userAnswers, 'timeline') as string;
    if (!timeline) return 0;

    const timeOrder = ['30-minutes', '2-hours', 'same-day', 'weekend', '1-2-weeks'];
    const productionOrder = ['30-minutes', '2-hours', '1-day', '1-week', '2-weeks', '1-month'];

    const userIndex = timeOrder.indexOf(timeline);
    const stackIndex = productionOrder.indexOf(stack.timeToProduction);

    if (userIndex === -1 || stackIndex === -1) return 50;

    // Perfect match gets 100, each step away reduces score
    if (stackIndex <= userIndex) {
      return 100; // Stack is faster than required
    } else {
      const penalty = (stackIndex - userIndex) * 20;
      return Math.max(0, 100 - penalty);
    }
  }

  /**
   * Calculate budget constraints match
   */
  private calculateBudgetMatch(userAnswers: UserAnswers, stack: Stack): number {
    const budget = this.findAnswerValue(userAnswers, 'budget') as number;
    const preferFreeTier = this.findAnswerValue(userAnswers, 'free-tier-preference') as boolean;

    // If user prefers free tier
    if (preferFreeTier || budget === 0) {
      return stack.pricing.hasFreeTier ? 100 : 20;
    }

    if (!budget) return 75; // Neutral if no budget specified

    // Find minimum monthly cost
    const minMonthlyCost = Math.min(...stack.pricing.monthlyCost.map(tier => tier.minCost));

    if (minMonthlyCost === 0) return 100; // Free tier available
    if (minMonthlyCost <= budget * 0.5) return 90; // Well within budget
    if (minMonthlyCost <= budget) return 75; // Within budget
    if (minMonthlyCost <= budget * 1.5) return 50; // Slightly over budget
    
    return 20; // Significantly over budget
  }

  /**
   * Calculate scaling requirements match
   */
  private calculateScalingMatch(userAnswers: UserAnswers, stack: Stack): number {
    const projectType = this.findAnswerValue(userAnswers, 'project-type') as string;
    const teamSize = this.findAnswerValue(userAnswers, 'team-size') as string;

    let score = 75; // Default neutral score

    // Project type scaling considerations
    if (projectType === 'global-app' && stack.category === 'performance-optimized') {
      score += 15;
    } else if (projectType === 'global-app' && stack.category === 'rapid-prototype') {
      score -= 20;
    }

    if (projectType === 'complex-workflows' && stack.category === 'enterprise') {
      score += 10;
    }

    // Team size considerations
    if (teamSize === 'solo' && stack.category === 'no-code') {
      score += 10;
    } else if (teamSize === 'large' && stack.category === 'enterprise') {
      score += 15;
    } else if (teamSize === 'large' && stack.category === 'rapid-prototype') {
      score -= 10;
    }

    // Community support for scaling
    const communityBonus = this.mapCommunityToScore(stack.communitySupport) * 0.2;
    score += communityBonus;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate team composition match
   */
  private calculateTeamMatch(userAnswers: UserAnswers, stack: Stack): number {
    const teamSize = this.findAnswerValue(userAnswers, 'team-size') as string;
    const hasDesigner = this.findAnswerValue(userAnswers, 'has-designer') as boolean;
    const hasDevOps = this.findAnswerValue(userAnswers, 'has-devops') as boolean;

    let score = 75;

    // Team size considerations
    switch (teamSize) {
      case 'solo':
        if (stack.category === 'no-code' || stack.category === 'rapid-prototype') score += 15;
        if (stack.learningCurve === 'expert') score -= 20;
        break;
      case 'small':
        if (stack.category === 'traditional') score += 10;
        break;
      case 'large':
        if (stack.category === 'enterprise') score += 15;
        if (stack.category === 'no-code') score -= 10;
        break;
    }

    // Designer considerations
    if (hasDesigner && stack.metadata.ecosystem === 'mature') {
      score += 5;
    } else if (!hasDesigner && stack.components.some(c => c.category === 'ui-library')) {
      score += 10;
    }

    // DevOps considerations
    if (hasDevOps && stack.category === 'performance-optimized') {
      score += 10;
    } else if (!hasDevOps && stack.components.some(c => c.category === 'hosting' && c.name.includes('managed'))) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate user preferences match
   */
  private calculatePreferenceMatch(userAnswers: UserAnswers, stack: Stack): number {
    const designPriority = this.findAnswerValue(userAnswers, 'design-priority') as string;
    const deploymentPreference = this.findAnswerValue(userAnswers, 'deployment-preference') as string;

    let score = 75;

    // Design priority considerations
    if (designPriority === 'critical' && stack.category === 'no-code') {
      score += 15;
    } else if (designPriority === 'none' && stack.category === 'performance-optimized') {
      score += 10;
    }

    // Deployment preference considerations
    if (deploymentPreference === 'managed' && stack.components.some(c => c.category === 'hosting')) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate community and ecosystem match
   */
  private calculateCommunityMatch(userAnswers: UserAnswers, stack: Stack): number {
    const background = this.findAnswerValue(userAnswers, 'background') as string;
    
    let score = this.mapCommunityToScore(stack.communitySupport);

    // Beginners need more community support
    if ((background === 'beginner' || background === 'non-technical') && 
        ['minimal', 'growing'].includes(stack.communitySupport)) {
      score -= 20;
    }

    // Documentation quality bonus
    score += this.mapDocumentationToScore(stack.metadata.documentation) * 0.3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Apply bonus/penalty modifiers based on specific conditions
   */
  private applyModifiers(baseScore: number, userAnswers: UserAnswers, stack: Stack): number {
    let modifiedScore = baseScore;

    // Timeline urgency bonuses
    const timeline = this.findAnswerValue(userAnswers, 'timeline') as string;
    if (timeline === '30-minutes' && stack.timeToProduction === '30-minutes') {
      modifiedScore += 5; // Bonus for perfect timeline match
    }

    // Category-specific bonuses
    const projectType = this.findAnswerValue(userAnswers, 'project-type') as string;
    if (stack.bestFor.some(use => use.toLowerCase().includes(projectType?.toLowerCase() || ''))) {
      modifiedScore += 3; // Bonus for explicit best-for match
    }

    // Penalty for mismatched experience levels
    const background = this.findAnswerValue(userAnswers, 'background') as string;
    if (background === 'non-technical' && stack.learningCurve === 'expert') {
      modifiedScore -= 10; // Heavy penalty for skill mismatch
    }

    // Penalty for outdated stacks
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (stack.metadata.lastUpdated < oneYearAgo) {
      modifiedScore -= 2; // Small penalty for outdated stacks
    }

    return modifiedScore;
  }

  // Helper methods
  private findAnswerValue(userAnswers: UserAnswers, questionId: string): unknown {
    const answer = userAnswers.answers.find(a => a.questionId === questionId);
    return answer?.value;
  }

  private scoreLearningCurve(background: string, learningCurve: Stack['learningCurve']): number {
    const backgroundCurveMatch: Record<string, Record<string, number>> = {
      'non-technical': { 'minimal': 100, 'easy': 80, 'moderate': 40, 'steep': 10, 'expert': 0 },
      'beginner': { 'minimal': 90, 'easy': 100, 'moderate': 70, 'steep': 30, 'expert': 10 },
      'intermediate': { 'minimal': 80, 'easy': 90, 'moderate': 100, 'steep': 80, 'expert': 50 },
      'experienced': { 'minimal': 70, 'easy': 80, 'moderate': 90, 'steep': 100, 'expert': 90 },
      'expert': { 'minimal': 60, 'easy': 70, 'moderate': 80, 'steep': 90, 'expert': 100 },
    };

    return backgroundCurveMatch[background]?.[learningCurve] || 50;
  }

  private scoreDocumentation(background: string, documentation: Stack['metadata']['documentation']): number {
    const docScores = {
      'poor': 20,
      'basic': 50,
      'good': 75,
      'excellent': 90,
      'outstanding': 100,
    };

    let baseScore = docScores[documentation] || 50;

    // Beginners need better documentation
    if ((background === 'beginner' || background === 'non-technical') && documentation === 'poor') {
      baseScore -= 20;
    }

    return Math.max(0, baseScore);
  }

  private mapCommunityToScore(community: Stack['communitySupport']): number {
    const scores = {
      'minimal': 20,
      'growing': 50,
      'active': 75,
      'vibrant': 90,
      'massive': 100,
    };
    return scores[community] || 50;
  }

  private mapDocumentationToScore(documentation: Stack['metadata']['documentation']): number {
    const scores = {
      'poor': 20,
      'basic': 50,
      'good': 75,
      'excellent': 90,
      'outstanding': 100,
    };
    return scores[documentation] || 50;
  }
}