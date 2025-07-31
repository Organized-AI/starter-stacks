import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import boxen from 'boxen';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { CLIContext, EvaluationOptions, UserAnswers, StackRecommendation, RecommendedStack } from '@/types';
import { Logger } from '@/utils/logger';
import { APIClient } from '@/utils/api';

// Evaluation questions matching web interface
const EVALUATION_QUESTIONS = [
  {
    type: 'list',
    name: 'timeline',
    message: 'What\'s your project timeline?',
    choices: [
      { name: 'ASAP (1-2 weeks) - Need something working quickly', value: 'immediate' },
      { name: '1-2 months - Fast development with good foundation', value: 'fast' },
      { name: '3-6 months - Standard development timeline', value: 'standard' },
      { name: '6+ months - Comprehensive, enterprise-ready solution', value: 'thorough' },
    ],
  },
  {
    type: 'list',
    name: 'background',
    message: 'What\'s your technical background?',
    choices: [
      { name: 'Beginner - New to programming or AI development', value: 'beginner' },
      { name: 'Intermediate - Some programming experience, new to AI', value: 'intermediate' },
      { name: 'Advanced - Experienced developer, some AI knowledge', value: 'advanced' },
      { name: 'Expert - Senior developer with AI/ML experience', value: 'expert' },
    ],
  },
  {
    type: 'list',
    name: 'projectType',
    message: 'What type of AI tool are you building?',
    choices: [
      { name: 'Chatbot/Conversational AI - Chat interfaces, customer support bots', value: 'chatbot' },
      { name: 'Content Generation - Text, image, or media generation tools', value: 'content' },
      { name: 'Data Analysis/Insights - Processing and analyzing data with AI', value: 'analysis' },
      { name: 'Workflow Automation - Automating business processes with AI', value: 'automation' },
      { name: 'AI API/Service - Building AI services for other developers', value: 'api' },
    ],
  },
  {
    type: 'list',
    name: 'teamSize',
    message: 'What\'s your team size?',
    choices: [
      { name: 'Solo Developer - Just me working on this project', value: 'solo' },
      { name: '2-5 people - Small team or startup', value: 'small' },
      { name: '6-20 people - Growing team with multiple roles', value: 'medium' },
      { name: '20+ people - Large team or enterprise environment', value: 'large' },
    ],
  },
  {
    type: 'list',
    name: 'designPriority',
    message: 'How important is custom design?',
    choices: [
      { name: 'Minimal - Function over form, basic UI is fine', value: 'minimal' },
      { name: 'Standard - Clean, professional look with components', value: 'standard' },
      { name: 'Custom - Unique brand identity and custom design', value: 'custom' },
      { name: 'Advanced - Complex animations and interactions', value: 'advanced' },
    ],
  },
];

async function runEvaluation(
  context: CLIContext,
  logger: Logger,
  options: EvaluationOptions
): Promise<StackRecommendation> {
  const apiClient = new APIClient(context.config);

  // Check API health first
  if (!options.offline) {
    const spinner = ora('Checking API connection...').start();
    const isHealthy = await apiClient.healthCheck();
    
    if (!isHealthy) {
      spinner.fail('API is not available');
      logger.warn('API is unavailable. Try running with --offline flag for cached results.');
      process.exit(1);
    }
    spinner.succeed('API connection established');
  }

  let answers: Record<string, string>;

  if (options.quick) {
    // Use defaults for quick evaluation
    answers = {
      timeline: 'standard',
      background: 'intermediate',
      projectType: 'chatbot',
      teamSize: 'small',
      designPriority: 'standard',
    };
    logger.info('Using quick evaluation with default answers');
  } else {
    // Interactive prompts
    logger.header('AI Tool Stack Evaluation');
    logger.info('Answer 5 questions to get personalized recommendations\n');
    
    answers = await inquirer.prompt(EVALUATION_QUESTIONS);
  }

  // Convert to UserAnswers format
  const userAnswers: UserAnswers = {
    userId: 'cli-user-' + Date.now(),
    answers: [
      { questionId: 'timeline', value: answers.timeline || 'standard' },
      { questionId: 'background', value: answers.background || 'intermediate' },
      { questionId: 'project-type', value: answers.projectType || 'chatbot' },
      { questionId: 'team-size', value: answers.teamSize || 'small' },
      { questionId: 'design-priority', value: answers.designPriority || 'standard' },
    ],
    completedAt: new Date(),
  };

  // Call evaluation API
  const spinner = ora('Analyzing your preferences...').start();
  
  try {
    const result = await apiClient.evaluate(userAnswers);
    spinner.succeed('Evaluation complete!');
    return result;
  } catch (error) {
    spinner.fail('Evaluation failed');
    throw error;
  }
}

function displayResults(
  result: StackRecommendation,
  logger: Logger,
  options: EvaluationOptions
): void {
  if (options.format === 'json') {
    logger.json(result);
    return;
  }

  logger.newLine();
  logger.header('🎯 Your AI Stack Recommendations');

  // Primary recommendation
  const primary = result.recommendations[0];
  if (primary) {
    const box = boxen(
      `${chalk.bold.green(primary.stack.name)}\n\n` +
      `${chalk.gray(primary.stack.description)}\n\n` +
      `${chalk.blue('Confidence:')} ${chalk.bold(Math.round(primary.confidence * 100))}%\n` +
      `${chalk.blue('Score:')} ${chalk.bold(primary.score)}/100\n` +
      `${chalk.blue('Category:')} ${primary.stack.category}\n` +
      `${chalk.blue('Learning Curve:')} ${primary.stack.learningCurve}\n` +
      `${chalk.blue('Time to Production:')} ${primary.stack.timeToProduction}`,
      {
        title: '🥇 Best Match',
        titleAlignment: 'center',
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      }
    );
    console.log(box);

    // Why this stack?
    logger.section('💡 Why this stack?');
    primary.reasoning.slice(0, 3).forEach((reason: string, index: number) => {
      logger.info(`${index + 1}. ${reason}`);
    });
  }

  // Alternative recommendations
  if (result.recommendations.length > 1) {
    logger.newLine();
    logger.section('🔄 Great Alternatives');
    
    result.recommendations.slice(1, 4).forEach((rec: RecommendedStack, index: number) => {
      logger.recommendation(rec.stack.name, rec.confidence, index + 2);
      logger.verbose(`   ${rec.stack.description}`);
    });
  }

  // Next steps
  logger.newLine();
  logger.section('🚀 Next Steps');
  logger.info('1. Run "stack-eval generate" to create a project with this stack');
  logger.info('2. Visit https://stack.organizedai.vip for detailed guides');
  logger.info('3. Check out the starter templates at https://github.com/Organized-AI/starter-stacks');
}

function saveResults(
  result: StackRecommendation,
  filename: string,
  logger: Logger
): void {
  try {
    const outputPath = join(process.cwd(), filename);
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    logger.success(`Results saved to ${outputPath}`);
  } catch (error) {
    logger.error(`Failed to save results: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function evaluateCommand(
  program: Command,
  context: CLIContext,
  logger: Logger
): void {
  program
    .command('evaluate')
    .alias('eval')
    .description('Get personalized AI stack recommendations')
    .option('-q, --quick', 'use default answers for quick evaluation')
    .option('-o, --offline', 'use offline mode (cached results)')
    .option('-s, --save <filename>', 'save results to file')
    .option('-f, --format <type>', 'output format (json|table|compact)', 'table')
    .option('--no-interactive', 'disable interactive prompts')
    .action(async (options: EvaluationOptions) => {
      try {
        logger.verbose('Starting evaluation with options:', options);
        
        const result = await runEvaluation(context, logger, options);
        
        displayResults(result, logger, options);
        
        if (options.save) {
          saveResults(result, options.save, logger);
        }
        
      } catch (error) {
        logger.error('Evaluation failed:', error instanceof Error ? error.message : 'Unknown error');
        if (context.verbose && error instanceof Error) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
}