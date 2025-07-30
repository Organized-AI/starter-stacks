/**
 * Recommendation generation utilities
 * Formats and enhances raw scoring data into user-friendly recommendations
 */

import type { Stack, UserAnswers } from '../types/index.js';

export class RecommendationGenerator {
  /**
   * Generate user-friendly recommendation text
   */
  public generateRecommendationText(
    stack: Stack, 
    score: number, 
    userAnswers: UserAnswers
  ): string {
    const timeline = this.findAnswer(userAnswers, 'timeline');
    const background = this.findAnswer(userAnswers, 'background');
    const projectType = this.findAnswer(userAnswers, 'project-type');

    let text = `${stack.name} is `;

    if (score >= 85) {
      text += 'an excellent choice';
    } else if (score >= 70) {
      text += 'a great option';
    } else if (score >= 55) {
      text += 'a good fit';
    } else {
      text += 'worth considering';
    }

    text += ` for your ${projectType || 'AI tool'} project`;

    if (background) {
      text += `, especially given your ${background} background`;
    }

    if (timeline) {
      text += ` and ${timeline} timeline`;
    }

    text += '.';

    return text;
  }

  /**
   * Generate detailed pros and cons analysis
   */
  public generateProsConsAnalysis(
    stack: Stack, 
    userAnswers: UserAnswers
  ): { relevantPros: string[]; relevantCons: string[]; personalizedInsights: string[] } {
    const timeline = this.findAnswer(userAnswers, 'timeline');
    const background = this.findAnswer(userAnswers, 'background');
    const projectType = this.findAnswer(userAnswers, 'project-type');
    const teamSize = this.findAnswer(userAnswers, 'team-size');

    const relevantPros = [...stack.pros];
    const relevantCons = [...stack.cons];
    const personalizedInsights: string[] = [];

    // Add personalized insights based on user context
    if (background === 'non-technical' && stack.learningCurve === 'minimal') {
      personalizedInsights.push('Perfect for non-technical users - minimal learning required');
    }

    if (timeline === '30-minutes' && stack.timeToProduction === '30-minutes') {
      personalizedInsights.push('Ideal for your urgent timeline - can be deployed in minutes');
    }

    if (teamSize === 'solo' && stack.category === 'no-code') {
      personalizedInsights.push('Great for solo founders - no team required');
    }

    if (projectType === 'chat-interface' && stack.bestFor.includes('Chat interfaces')) {
      personalizedInsights.push('Specifically optimized for chat/conversational AI applications');
    }

    return {
      relevantPros,
      relevantCons,
      personalizedInsights,
    };
  }

  /**
   * Generate getting started guide
   */
  public generateGettingStarted(stack: Stack, userAnswers: UserAnswers): GettingStartedGuide {
    const background = this.findAnswer(userAnswers, 'background');
    const timeline = this.findAnswer(userAnswers, 'timeline');

    const guide: GettingStartedGuide = {
      quickStart: this.generateQuickStartSteps(stack, background, timeline),
      prerequisites: this.generatePrerequisites(stack, background),
      firstSteps: this.generateFirstSteps(stack),
      expectedTimeCommitment: this.estimateTimeCommitment(stack, background, timeline),
      learningResources: this.suggestLearningResources(stack, background),
    };

    return guide;
  }

  /**
   * Generate cost breakdown and estimates
   */
  public generateCostAnalysis(stack: Stack, userAnswers: UserAnswers): CostAnalysis {
    const teamSize = this.findAnswer(userAnswers, 'team-size');
    const _projectType = this.findAnswer(userAnswers, 'project-type');

    return {
      setupCost: stack.pricing.setupCost,
      monthlyEstimate: this.estimateMonthlyCost(stack, teamSize, _projectType),
      freeTrialInfo: this.generateFreeTrialInfo(stack),
      scalingCosts: this.generateScalingCostInfo(stack),
      hiddenCosts: this.identifyHiddenCosts(stack),
      alternatives: this.suggestCostAlternatives(stack),
    };
  }

  /**
   * Generate implementation roadmap
   */
  public generateImplementationRoadmap(stack: Stack, userAnswers: UserAnswers): ImplementationPhase[] {
    const background = this.findAnswer(userAnswers, 'background');
    const projectType = this.findAnswer(userAnswers, 'project-type');

    const phases: ImplementationPhase[] = [
      {
        name: 'Setup & Configuration',
        duration: this.estimatePhaseDuration('setup', stack, background),
        tasks: this.generateSetupTasks(stack),
        deliverables: ['Development environment ready', 'Basic project structure'],
        blockers: this.identifySetupBlockers(stack, background),
      },
      {
        name: 'Core Implementation',
        duration: this.estimatePhaseDuration('implementation', stack, background),
        tasks: this.generateImplementationTasks(stack, projectType),
        deliverables: ['Working prototype', 'Basic AI integration'],
        blockers: this.identifyImplementationBlockers(stack, background),
      },
      {
        name: 'Polish & Deploy',
        duration: this.estimatePhaseDuration('deployment', stack, background),
        tasks: this.generateDeploymentTasks(stack),
        deliverables: ['Production deployment', 'Monitoring setup'],
        blockers: this.identifyDeploymentBlockers(stack),
      },
    ];

    return phases;
  }

  // Helper methods
  private findAnswer(userAnswers: UserAnswers, questionId: string): string | null {
    const answer = userAnswers.answers.find(a => a.questionId === questionId);
    return answer && typeof answer.value === 'string' ? answer.value : null;
  }

  private generateQuickStartSteps(stack: Stack, _background: string | null, _timeline: string | null): string[] {
    const steps: string[] = [];

    if (stack.category === 'no-code') {
      steps.push('Sign up for platform account');
      steps.push('Choose from available templates');
      steps.push('Configure AI model settings');
      steps.push('Customize UI and branding');
      steps.push('Deploy with one click');
    } else if (stack.category === 'rapid-prototype') {
      steps.push('Open development environment');
      steps.push('Clone starter template');
      steps.push('Install dependencies');
      steps.push('Configure API keys');
      steps.push('Run local development server');
    } else {
      steps.push('Set up development environment');
      steps.push('Create new project');
      steps.push('Install required dependencies');
      steps.push('Configure database and hosting');
      steps.push('Implement core features');
      steps.push('Deploy to production');
    }

    return steps;
  }

  private generatePrerequisites(stack: Stack, background: string | null): string[] {
    const prerequisites: string[] = [];

    if (background === 'non-technical') {
      prerequisites.push('Computer with internet connection');
      if (stack.category !== 'no-code') {
        prerequisites.push('Willingness to learn basic coding concepts');
      }
    } else {
      prerequisites.push('Basic programming knowledge');
      
      // Add specific technology prerequisites
      const frameworks = stack.components.filter(c => c.category === 'framework');
      if (frameworks.some(f => f.name.includes('Next.js') || f.name.includes('React'))) {
        prerequisites.push('JavaScript/TypeScript familiarity');
      }
      if (frameworks.some(f => f.name.includes('Python'))) {
        prerequisites.push('Python programming experience');
      }
    }

    prerequisites.push('API keys for AI services (if using external AI)');
    return prerequisites;
  }

  private generateFirstSteps(stack: Stack): string[] {
    return [
      `Create ${stack.name} project`,
      'Follow official documentation',
      'Build simple "Hello AI" example',
      'Explore provided templates',
      'Join community forums',
    ];
  }

  private estimateTimeCommitment(stack: Stack, background: string | null, _timeline: string | null): string {
    const baseTime = stack.timeToProduction;
    
    if (background === 'non-technical') {
      return `${baseTime} (plus learning time)`;
    } else if (background === 'expert') {
      const quickTimes = ['30-minutes', '2-hours', '1-day'];
      if (quickTimes.includes(baseTime)) {
        return `${baseTime} (potentially faster)`;
      }
    }

    return baseTime;
  }

  private suggestLearningResources(stack: Stack, background: string | null): string[] {
    const resources: string[] = [];
    
    resources.push(`Official ${stack.name} documentation`);
    
    if (background === 'non-technical' || background === 'beginner') {
      resources.push('Beginner-friendly tutorials');
      resources.push('Video walkthroughs');
      resources.push('Community Discord/Slack');
    }
    
    resources.push('Example projects and templates');
    resources.push('Stack Overflow community');
    
    return resources;
  }

  private estimateMonthlyTask(stack: Stack, teamSize: string | null, projectType: string | null): number {
    const baseCost = Math.min(...stack.pricing.monthlyCost.map(tier => tier.minCost));
    
    // Adjust for team size
    let multiplier = 1;
    if (teamSize === 'small') multiplier = 1.5;
    else if (teamSize === 'medium') multiplier = 3;
    else if (teamSize === 'large') multiplier = 5;

    // Adjust for project complexity
    if (projectType === 'complex-workflows') multiplier *= 1.5;
    else if (projectType === 'global-app') multiplier *= 2;

    return Math.round(baseCost * multiplier);
  }

  private estimateMonthlyCost(stack: Stack, teamSize: string | null, projectType: string | null): number {
    return this.estimateMonthlyTask(stack, teamSize, projectType);
  }

  private generateFreeTrialInfo(stack: Stack): string {
    if (stack.pricing.hasFreeTier) {
      return 'Free tier available for experimentation and small projects';
    } else if (stack.pricing.freeTrialDays) {
      return `${stack.pricing.freeTrialDays}-day free trial available`;
    } else {
      return 'No free tier - paid service from day one';
    }
  }

  private generateScalingCostInfo(_stack: Stack): string[] {
    return [
      'Costs typically scale with usage',
      'Monitor API calls and bandwidth',
      'Consider reserved capacity for savings',
      'Review pricing regularly as you scale',
    ];
  }

  private identifyHiddenCosts(stack: Stack): string[] {
    const hiddenCosts: string[] = [];
    
    hiddenCosts.push('AI API costs (OpenAI, Anthropic, etc.)');
    
    if (!stack.components.some((c: any) => c.category === 'database' && c.name.includes('included'))) {
      hiddenCosts.push('Database hosting costs');
    }
    
    if (stack.category === 'enterprise') {
      hiddenCosts.push('Support and training costs');
    }
    
    hiddenCosts.push('Domain name and SSL certificates');
    hiddenCosts.push('Monitoring and analytics tools');
    
    return hiddenCosts;
  }

  private suggestCostAlternatives(stack: Stack): string[] {
    const alternatives: string[] = [];
    
    if (!stack.pricing.hasFreeTier) {
      alternatives.push('Look for open-source alternatives');
    }
    
    alternatives.push('Start with free tiers and upgrade as needed');
    alternatives.push('Use local AI models to reduce API costs');
    alternatives.push('Optimize usage to stay within cheaper tiers');
    
    return alternatives;
  }

  private estimatePhaseDuration(phase: string, stack: Stack, background: string | null): string {
    const baseDurations = {
      setup: { 'minimal': '1 hour', 'easy': '2 hours', 'moderate': '4 hours', 'steep': '1 day', 'expert': '2 days' },
      implementation: { 'minimal': '2 hours', 'easy': '4 hours', 'moderate': '1 day', 'steep': '3 days', 'expert': '1 week' },
      deployment: { 'minimal': '30 min', 'easy': '1 hour', 'moderate': '2 hours', 'steep': '4 hours', 'expert': '1 day' },
    };

    const duration = baseDurations[phase as keyof typeof baseDurations]?.[stack.learningCurve] || '1 day';
    
    if (background === 'non-technical') {
      return `${duration} (may take longer)`;
    }
    
    return duration;
  }

  private generateSetupTasks(_stack: Stack): string[] {
    const tasks: string[] = [];
    
    tasks.push('Install required software');
    tasks.push('Create accounts for services');
    tasks.push('Configure development environment');
    tasks.push('Set up version control');
    
    return tasks;
  }

  private generateImplementationTasks(_stack: Stack, _projectType: string | null): string[] {
    const tasks: string[] = [];
    
    tasks.push('Build core functionality');
    tasks.push('Integrate AI services');
    tasks.push('Create user interface');
    tasks.push('Add error handling');
    tasks.push('Test basic workflows');
    
    return tasks;
  }

  private generateDeploymentTasks(_stack: Stack): string[] {
    return [
      'Configure production environment',
      'Set up hosting and domains',
      'Configure monitoring',
      'Run final tests',
      'Deploy to production',
    ];
  }

  private identifySetupBlockers(stack: Stack, background: string | null): string[] {
    const blockers: string[] = [];
    
    if (background === 'non-technical' && stack.learningCurve !== 'minimal') {
      blockers.push('Learning development tools');
    }
    
    blockers.push('Getting API keys and access');
    blockers.push('Environment configuration issues');
    
    return blockers;
  }

  private identifyImplementationBlockers(_stack: Stack, background: string | null): string[] {
    const blockers: string[] = [];
    
    if (background === 'beginner') {
      blockers.push('Understanding framework concepts');
    }
    
    blockers.push('AI model integration challenges');
    blockers.push('Debugging complex errors');
    
    return blockers;
  }

  private identifyDeploymentBlockers(_stack: Stack): string[] {
    return [
      'DNS and domain configuration',
      'SSL certificate setup',
      'Environment variable management',
      'Performance optimization',
    ];
  }
}

// Supporting interfaces
export interface GettingStartedGuide {
  quickStart: string[];
  prerequisites: string[];
  firstSteps: string[];
  expectedTimeCommitment: string;
  learningResources: string[];
}

export interface CostAnalysis {
  setupCost: number;
  monthlyEstimate: number;
  freeTrialInfo: string;
  scalingCosts: string[];
  hiddenCosts: string[];
  alternatives: string[];
}

export interface ImplementationPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  blockers: string[];
}