import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';

import { CLIContext, ListOptions } from '@/types';
import { Logger } from '@/utils/logger';
import { APIClient } from '@/utils/api';
import { TemplateGenerator } from '@/utils/template-generator';

interface StackInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  learningCurve: string;
  timeToProduction: string;
  popularity: number;
  tags: string[];
}

async function listStacks(
  context: CLIContext,
  logger: Logger,
  options: ListOptions
): Promise<void> {
  const apiClient = new APIClient(context.config);
  const templateGenerator = new TemplateGenerator(context, logger);

  let stacks: StackInfo[] = [];

  // Try to get stacks from API first
  if (!options.offline) {
    try {
      logger.verbose('Fetching stacks from API...');
      const apiStacks = await apiClient.getStacks();
      stacks = apiStacks.map((stack: any) => ({
        id: stack.id,
        name: stack.name,
        description: stack.description,
        category: stack.category,
        learningCurve: stack.learningCurve,
        timeToProduction: stack.timeToProduction,
        popularity: stack.popularity || 0,
        tags: stack.technologies || []
      }));
    } catch (error) {
      logger.warn('Could not fetch stacks from API, using local templates');
    }
  }

  // Fallback to local templates if API fails or offline mode
  if (stacks.length === 0) {
    const templateIds = templateGenerator.getAvailableTemplates();
    stacks = templateIds.map(id => {
      const template = templateGenerator.getTemplate(id);
      return {
        id,
        name: template?.name || id,
        description: template?.description || 'No description available',
        category: 'Web Development',
        learningCurve: 'Intermediate',
        timeToProduction: '1-2 weeks',
        popularity: 50,
        tags: []
      };
    });
  }

  // Filter by category if specified
  if (options.category) {
    stacks = stacks.filter(stack => 
      stack.category.toLowerCase().includes(options.category!.toLowerCase())
    );
  }

  // Filter by search term if specified
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    stacks = stacks.filter(stack => 
      stack.name.toLowerCase().includes(searchTerm) ||
      stack.description.toLowerCase().includes(searchTerm) ||
      stack.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Sort stacks
  const sortBy = options.sort || 'popularity';
  stacks.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'learning':
        const learningOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        return learningOrder.indexOf(a.learningCurve) - learningOrder.indexOf(b.learningCurve);
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });

  // Display results
  if (options.format === 'json') {
    logger.json(stacks);
    return;
  }

  displayStackList(stacks, logger, options);
}

function displayStackList(stacks: StackInfo[], logger: Logger, options: ListOptions): void {
  if (stacks.length === 0) {
    logger.warn('No stacks found matching your criteria');
    return;
  }

  logger.header(`🛠️  Available AI Tool Stacks (${stacks.length})`);
  logger.newLine();

  if (options.detailed) {
    // Detailed view with boxes
    stacks.forEach((stack, index) => {
      const content = 
        `${chalk.bold(stack.name)}\n\n` +
        `${chalk.gray(stack.description)}\n\n` +
        `${chalk.blue('Category:')} ${stack.category}\n` +
        `${chalk.blue('Learning:')} ${stack.learningCurve}\n` +
        `${chalk.blue('Time to Prod:')} ${stack.timeToProduction}\n` +
        `${chalk.blue('Popularity:')} ${getPopularityStars(stack.popularity)}`;

      const box = boxen(content, {
        title: `#${index + 1} ${stack.id}`,
        titleAlignment: 'left',
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: getCategoryColor(stack.category)
      });

      console.log(box);
    });
  } else {
    // Compact table view
    logger.info(chalk.bold('ID'.padEnd(20)) + 
                chalk.bold('Name'.padEnd(25)) + 
                chalk.bold('Category'.padEnd(20)) + 
                chalk.bold('Learning'.padEnd(15)) + 
                chalk.bold('Rating'));
    logger.info('─'.repeat(90));

    stacks.forEach(stack => {
      const id = chalk.cyan(stack.id.padEnd(20));
      const name = stack.name.padEnd(25);
      const category = chalk.gray(stack.category.padEnd(20));
      const learning = stack.learningCurve.padEnd(15);
      const rating = getPopularityStars(stack.popularity);

      logger.info(`${id}${name}${category}${learning}${rating}`);
    });
  }

  // Show statistics
  logger.newLine();
  logger.section('📊 Statistics');
  
  const categories = [...new Set(stacks.map(s => s.category))];
  logger.info(`Categories: ${categories.join(', ')}`);
  
  const avgLearning = stacks.length > 0 ? 
    Math.round(stacks.reduce((acc, s) => acc + getLearningScore(s.learningCurve), 0) / stacks.length * 100) / 100 : 0;
  logger.info(`Average Learning Curve: ${avgLearning}/4`);

  logger.newLine();
  logger.info(`💡 Use ${chalk.cyan('stack-eval evaluate')} to get personalized recommendations`);
  logger.info(`🚀 Use ${chalk.cyan('stack-eval generate --template <id>')} to create a project`);
}

function getPopularityStars(popularity: number): string {
  const stars = Math.ceil(popularity / 20); // Convert 0-100 to 0-5 stars
  return '⭐'.repeat(Math.min(stars, 5));
}

function getCategoryColor(category: string): 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' {
  const colors: Record<string, 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan'> = {
    'Web Development': 'blue',
    'API Development': 'green',
    'Data Science': 'magenta',
    'Mobile Development': 'cyan',
    'AI/ML': 'yellow'
  };
  return colors[category] || 'blue';
}

function getLearningScore(learningCurve: string): number {
  const scores: Record<string, number> = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
  };
  return scores[learningCurve] || 2;
}

export function listCommand(
  program: Command,
  context: CLIContext,
  logger: Logger
): void {
  program
    .command('list')
    .alias('ls')
    .description('List available AI tool stacks')
    .option('-c, --category <type>', 'filter by category')
    .option('-s, --search <term>', 'search stacks by name or description')
    .option('--sort <field>', 'sort by: name, category, learning, popularity', 'popularity')
    .option('-d, --detailed', 'show detailed information')
    .option('-o, --offline', 'use offline mode (local templates only)')
    .option('-f, --format <type>', 'output format (table|json|compact)', 'table')
    .action(async (options: ListOptions) => {
      try {
        logger.verbose('Listing stacks with options:', options);
        
        await listStacks(context, logger, options);
        
      } catch (error) {
        logger.error('Failed to list stacks:', error instanceof Error ? error.message : 'Unknown error');
        if (context.verbose && error instanceof Error) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
}