import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';

import { CLIContext, GenerateOptions, GitHubOptions } from '@/types';
import { Logger } from '@/utils/logger';
import { APIClient } from '@/utils/api';
import { TemplateGenerator } from '@/utils/template-generator';
import { GitHubClient } from '@/utils/github';

async function generateProject(
  context: CLIContext,
  logger: Logger,
  options: GenerateOptions
): Promise<void> {
  const templateGenerator = new TemplateGenerator(context, logger);
  
  // Get stack recommendation or use template
  let selectedStack: string;
  
  if (options.template) {
    selectedStack = options.template;
  } else {
    // Get fresh recommendation
    logger.info('Getting your recommended stack...');
    const apiClient = new APIClient(context.config);
    
    // Use quick evaluation to get recommendation
    const userAnswers = {
      userId: 'cli-generate-' + Date.now(),
      answers: [
        { questionId: 'timeline', value: 'standard' },
        { questionId: 'background', value: 'intermediate' },
        { questionId: 'project-type', value: 'chatbot' },
        { questionId: 'team-size', value: 'small' },
        { questionId: 'design-priority', value: 'standard' },
      ],
      completedAt: new Date(),
    };
    
    try {
      const result = await apiClient.evaluate(userAnswers);
      selectedStack = result.recommendations[0]?.stack.id || 'nextjs-vercel-ai';
      logger.info(`Using recommended stack: ${result.recommendations[0]?.stack.name}`);
    } catch (error) {
      logger.warn('Could not get recommendation, using default stack');
      selectedStack = 'nextjs-vercel-ai';
    }
  }

  // Get project details
  let projectName: string;
  let projectPath: string;
  
  if (options.directory) {
    projectName = options.directory;
    projectPath = join(process.cwd(), projectName);
  } else {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: 'my-ai-app',
        validate: (input: string) => {
          if (!input.trim()) return 'Project name is required';
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) return 'Use only letters, numbers, hyphens, and underscores';
          return true;
        },
      },
    ]);
    
    projectName = name;
    projectPath = join(process.cwd(), projectName);
  }

  // Check if directory exists
  if (existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory "${projectName}" already exists. Overwrite?`,
        default: false,
      },
    ]);
    
    if (!overwrite) {
      logger.info('Generation cancelled');
      return;
    }
  }

  // Create project directory
  if (!existsSync(projectPath)) {
    mkdirSync(projectPath, { recursive: true });
  }

  // Generate project files
  const spinner = ora('Generating project files...').start();
  
  try {
    await templateGenerator.generate(selectedStack, projectPath, {
      projectName,
      description: `AI application built with ${selectedStack}`,
    });
    
    spinner.succeed('Project files generated');
  } catch (error) {
    spinner.fail('Failed to generate project');
    throw error;
  }

  // Initialize git repository
  if (options.gitInit !== false) {
    const gitSpinner = ora('Initializing git repository...').start();
    
    try {
      const git = simpleGit(projectPath);
      await git.init();
      await git.add('.');
      await git.commit('Initial commit: AI app scaffolded with stack-evaluator');
      
      gitSpinner.succeed('Git repository initialized');
    } catch (error) {
      gitSpinner.warn('Could not initialize git repository');
      logger.verbose('Git error:', error);
    }
  }

  // Install dependencies
  if (options.installDeps !== false) {
    const installSpinner = ora('Installing dependencies...').start();
    
    try {
      await templateGenerator.installDependencies(projectPath);
      installSpinner.succeed('Dependencies installed');
    } catch (error) {
      installSpinner.warn('Could not install dependencies automatically');
      logger.info('You can install them manually with: npm install');
    }
  }

  // Success message
  logger.newLine();
  logger.success(`Project "${projectName}" created successfully!`);
  logger.newLine();
  
  logger.section('🚀 Next Steps');
  logger.info(`1. cd ${projectName}`);
  
  if (options.installDeps === false) {
    logger.info('2. npm install');
    logger.info('3. npm run dev');
  } else {
    logger.info('2. npm run dev');
  }
  
  logger.info('3. Start building your AI application!');
  logger.newLine();
  
  // Open in VS Code if requested
  if (options.openVSCode) {
    try {
      const { spawn } = require('child_process');
      spawn('code', [projectPath], { detached: true, stdio: 'ignore' });
      logger.info('Opening in VS Code...');
    } catch (error) {
      logger.verbose('Could not open VS Code:', error);
    }
  }
}

export function generateCommand(
  program: Command,
  context: CLIContext,
  logger: Logger
): void {
  program
    .command('generate')
    .alias('gen')
    .description('Generate a new AI project with recommended stack')
    .option('-t, --template <stack>', 'specific stack template to use')
    .option('-d, --directory <name>', 'project directory name')
    .option('--no-git-init', 'skip git repository initialization')
    .option('--no-install-deps', 'skip automatic dependency installation')
    .option('--open-vscode', 'open project in VS Code after generation')
    .action(async (options: GenerateOptions) => {
      try {
        logger.verbose('Starting project generation with options:', options);
        
        await generateProject(context, logger, options);
        
      } catch (error) {
        logger.error('Project generation failed:', error instanceof Error ? error.message : 'Unknown error');
        if (context.verbose && error instanceof Error) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
}