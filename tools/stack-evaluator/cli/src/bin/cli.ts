#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { join } from 'path';

// Import commands
import { evaluateCommand } from '../commands/evaluate';
import { generateCommand } from '../commands/generate';
import { listCommand } from '../commands/list';
import { configCommand } from '../commands/config';
import { initCommand } from '../commands/init';

// Utils
import { Logger } from '../utils/logger';
import { ConfigManager } from '../utils/config';
import { CLIContext } from '../types';

// Get package info
const packagePath = join(__dirname, '../../package.json');
const packageInfo = JSON.parse(readFileSync(packagePath, 'utf-8'));

// Check for updates
const notifier = updateNotifier({ pkg: packageInfo });
if (notifier.update) {
  notifier.notify({
    defer: false,
    message: `Update available ${chalk.dim('{currentVersion}')} → ${chalk.green('{latestVersion}')}\nRun ${chalk.cyan('npm i -g {name}')} to update`,
  });
}

// Create CLI context
const configManager = new ConfigManager();
const cliContext: CLIContext = {
  config: configManager.get(),
  workingDir: process.cwd(),
  verbose: false,
  dryRun: false,
};

const logger = new Logger(cliContext);

// Display banner for main command
function showBanner(): void {
  const banner = figlet.textSync('Stack Eval', { 
    font: 'Small',
    horizontalLayout: 'fitted' 
  });
  
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.gray(`v${packageInfo.version} - AI Tool Stack Evaluator\n`));
}

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Unexpected error occurred:', error.message);
  if (cliContext.verbose) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

// Configure program
program
  .name('stack-eval')
  .description('AI Tool Stack Evaluator - Find your perfect tech stack in 2 minutes')
  .version(packageInfo.version)
  .option('-v, --verbose', 'enable verbose logging')
  .option('--dry-run', 'show what would be done without executing')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    
    // Update context with global options
    cliContext.verbose = opts.verbose || false;
    cliContext.dryRun = opts.dryRun || false;
    
    // Update config if verbose flag is set
    if (opts.verbose) {
      cliContext.config.verbose = true;
    }
    
    // Show banner only for main command without subcommands
    if (process.argv.length === 2) {
      showBanner();
    }
  });

// Register commands
evaluateCommand(program, cliContext, logger);
generateCommand(program, cliContext, logger);
listCommand(program, cliContext, logger);
configCommand(program, cliContext, logger, configManager);
initCommand(program, cliContext, logger);

// Handle unknown commands
program.on('command:*', (operands) => {
  logger.error(`Unknown command: ${operands[0]}`);
  logger.info('Run --help to see available commands');
  process.exit(1);
});

// Show help if no command provided
if (process.argv.length === 2) {
  showBanner();
  program.help();
}

// Parse command line arguments
program.parse();

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}