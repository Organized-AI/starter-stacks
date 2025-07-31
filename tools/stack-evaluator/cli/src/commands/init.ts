import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

import { CLIContext, InitOptions } from '@/types';
import { Logger } from '@/utils/logger';
import { ConfigManager } from '@/utils/config';
import { GitHubClient } from '@/utils/github';

async function initializeProject(
  context: CLIContext,
  logger: Logger,
  options: InitOptions
): Promise<void> {
  const workingDir = process.cwd();
  const projectName = options.directory || require('path').basename(workingDir);

  logger.header('🚀 Initialize AI Project');
  logger.info(`Setting up AI development environment in: ${workingDir}\\n`);

  // Check if already initialized
  const stackEvalFile = join(workingDir, '.stackeval');
  const packageJsonFile = join(workingDir, 'package.json');
  
  if (existsSync(stackEvalFile) && !options.force) {
    logger.warn('Project already initialized. Use --force to reinitialize.');
    return;
  }

  // Gather project information
  let projectInfo: any = {};

  if (!options.quick) {
    projectInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: projectName,
        validate: (input: string) => {
          if (!input.trim()) return 'Project name is required';
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: `AI application: ${projectName}`
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: process.env.USER || process.env.USERNAME || ''
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of AI project is this?',
        choices: [
          { name: 'Chatbot/Conversational AI', value: 'chatbot' },
          { name: 'Content Generation Tool', value: 'content' },
          { name: 'Data Analysis/Insights', value: 'analysis' },
          { name: 'Workflow Automation', value: 'automation' },
          { name: 'AI API/Service', value: 'api' },
          { name: 'Other/Mixed', value: 'other' }
        ],
        default: 'chatbot'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features do you plan to use?',
        choices: [
          { name: 'Web Interface', value: 'web' },
          { name: 'API Endpoints', value: 'api' },
          { name: 'Database Storage', value: 'database' },
          { name: 'User Authentication', value: 'auth' },
          { name: 'File Processing', value: 'files' },
          { name: 'Real-time Features', value: 'realtime' },
          { name: 'Testing Suite', value: 'testing' },
          { name: 'CI/CD Pipeline', value: 'cicd' }
        ]
      },
      {
        type: 'confirm',
        name: 'useGit',
        message: 'Initialize Git repository?',
        default: !existsSync(join(workingDir, '.git'))
      }
    ]);
  } else {
    // Quick mode - use sensible defaults
    projectInfo = {
      name: projectName,
      description: `AI application: ${projectName}`,
      author: process.env.USER || process.env.USERNAME || '',
      projectType: 'chatbot',
      features: ['web', 'api'],
      useGit: !existsSync(join(workingDir, '.git'))
    };
    logger.info('Using quick setup with default settings');
  }

  // Create .stackeval configuration file
  const stackEvalConfig = {
    version: '1.0.0',
    project: {
      name: projectInfo.name,
      description: projectInfo.description,
      author: projectInfo.author,
      type: projectInfo.projectType,
      features: projectInfo.features,
      createdAt: new Date().toISOString()
    },
    stack: {
      recommendation: null,
      template: null,
      lastEvaluated: null
    },
    github: {
      repository: null,
      lastSync: null
    }
  };

  writeFileSync(stackEvalFile, JSON.stringify(stackEvalConfig, null, 2));
  logger.success('Created .stackeval configuration file');

  // Initialize package.json if it doesn't exist
  if (!existsSync(packageJsonFile)) {
    const packageJson = {
      name: projectInfo.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      description: projectInfo.description,
      main: 'index.js',
      scripts: {
        'test': 'echo "Error: no test specified" && exit 1'
      },
      keywords: ['ai', projectInfo.projectType],
      author: projectInfo.author,
      license: 'MIT'
    };

    writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2));
    logger.success('Created package.json');
  }

  // Initialize Git repository if requested
  if (projectInfo.useGit) {
    const gitClient = new GitHubClient(context, logger);
    const hasGit = await gitClient.checkGitInstallation();
    
    if (!hasGit) {
      logger.warn('Git not found. Install Git to enable version control.');
    } else {
      const repoInfo = await gitClient.getRepositoryInfo(workingDir);
      
      if (!repoInfo.hasGit) {
        try {
          const simpleGit = require('simple-git');
          const git = simpleGit(workingDir);
          
          await git.init();
          
          // Create .gitignore
          if (!existsSync(join(workingDir, '.gitignore'))) {
            const gitignoreContent = [
              'node_modules/',
              '.env',
              '.env.local',
              '.env.*.local',
              'dist/',
              'build/',
              '.DS_Store',
              '*.log',
              '.stackeval.cache'
            ].join('\\n');
            
            writeFileSync(join(workingDir, '.gitignore'), gitignoreContent);
            logger.info('Created .gitignore');
          }
          
          logger.success('Initialized Git repository');
        } catch (error) {
          logger.warn('Could not initialize Git repository:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
  }

  // Create basic project structure
  if (options.createStructure) {
    const dirs = ['src', 'docs', 'tests'];
    
    dirs.forEach(dir => {
      const dirPath = join(workingDir, dir);
      if (!existsSync(dirPath)) {
        require('fs').mkdirSync(dirPath, { recursive: true });
        logger.info(`Created directory: ${dir}/`);
      }
    });

    // Create a basic README.md
    if (!existsSync(join(workingDir, 'README.md'))) {
      const readmeContent = `# ${projectInfo.name}

${projectInfo.description}

## Getting Started

This project was initialized with [Stack Evaluator](https://stack.organizedai.vip).

### Next Steps

1. Run stack evaluation to get personalized recommendations:
   \`\`\`bash
   stack-eval evaluate
   \`\`\`

2. Generate a project with your recommended stack:
   \`\`\`bash
   stack-eval generate
   \`\`\`

3. Start building your AI application!

## Features

${projectInfo.features.map((f: string) => `- ${f}`).join('\\n')}

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
`;

      writeFileSync(join(workingDir, 'README.md'), readmeContent);
      logger.success('Created README.md');
    }
  }

  // Final summary
  logger.newLine();
  logger.success(`🎉 Project "${projectInfo.name}" initialized successfully!`);
  logger.newLine();
  
  logger.section('📋 What was created:');
  logger.info('✅ .stackeval - Project configuration');
  if (!existsSync(packageJsonFile)) logger.info('✅ package.json - Node.js project file');
  if (projectInfo.useGit) logger.info('✅ Git repository - Version control');
  if (options.createStructure) logger.info('✅ Project structure - Basic directories');
  
  logger.newLine();
  logger.section('🚀 Next Steps:');
  logger.info(`1. ${chalk.cyan('stack-eval evaluate')} - Get your personalized stack recommendation`);
  logger.info(`2. ${chalk.cyan('stack-eval generate')} - Generate project with recommended stack`);
  logger.info(`3. ${chalk.cyan('stack-eval list')} - Browse available stacks`);
  
  logger.newLine();
  logger.info(`💡 Run ${chalk.cyan('stack-eval --help')} for more commands`);
}

export function initCommand(
  program: Command,
  context: CLIContext,
  logger: Logger
): void {
  program
    .command('init')
    .description('Initialize a new AI project in current directory')
    .option('-d, --directory <name>', 'project directory name (defaults to current directory name)')
    .option('-q, --quick', 'quick setup with minimal prompts')
    .option('-f, --force', 'overwrite existing configuration')
    .option('--create-structure', 'create basic project structure (src/, docs/, tests/)')
    .option('--no-git', 'skip Git repository initialization')
    .action(async (options: InitOptions) => {
      try {
        logger.verbose('Initializing project with options:', options);
        
        await initializeProject(context, logger, options);
        
      } catch (error) {
        logger.error('Project initialization failed:', error instanceof Error ? error.message : 'Unknown error');
        if (context.verbose && error instanceof Error) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
}