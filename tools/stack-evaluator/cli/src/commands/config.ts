import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync } from 'fs';

import { CLIContext, ConfigOptions } from '@/types';
import { Logger } from '@/utils/logger';
import { ConfigManager } from '@/utils/config';

async function showConfig(
  context: CLIContext,
  logger: Logger,
  configManager: ConfigManager,
  options: ConfigOptions
): Promise<void> {
  const config = configManager.get();

  if (options.format === 'json') {
    logger.json(config);
    return;
  }

  logger.header('⚙️  CLI Configuration');
  logger.newLine();

  // Display current configuration
  logger.section('Current Settings');
  logger.info(`${chalk.blue('API URL:')} ${config.apiUrl}`);
  logger.info(`${chalk.blue('Timeout:')} ${config.timeout}ms`);
  logger.info(`${chalk.blue('Retries:')} ${config.retries}`);
  logger.info(`${chalk.blue('Offline Mode:')} ${config.offline ? 'Yes' : 'No'}`);
  logger.info(`${chalk.blue('Verbose Logging:')} ${config.verbose ? 'Yes' : 'No'}`);

  logger.newLine();
  logger.section('Configuration File');
  const configPath = configManager.getConfigPath();
  logger.info(`${chalk.blue('Location:')} ${configPath}`);
  logger.info(`${chalk.blue('Exists:')} ${configManager.exists() ? 'Yes' : 'No'}`);

  if (configManager.exists()) {
    const stats = require('fs').statSync(configPath);
    logger.info(`${chalk.blue('Modified:')} ${stats.mtime.toLocaleString()}`);
  }
}

async function setConfigValue(
  key: string,
  value: string,
  configManager: ConfigManager,
  logger: Logger
): Promise<void> {
  const config = configManager.get();
  
  // Validate key
  if (!(key in config)) {
    logger.error(`Invalid configuration key: ${key}`);
    logger.info('Valid keys: apiUrl, timeout, retries, offline, verbose');
    return;
  }

  // Type conversion based on key
  let typedValue: any = value;
  
  switch (key) {
    case 'timeout':
    case 'retries':
      typedValue = parseInt(value, 10);
      if (isNaN(typedValue)) {
        logger.error(`Invalid number value for ${key}: ${value}`);
        return;
      }
      break;
      
    case 'offline':
    case 'verbose':
      typedValue = value.toLowerCase() === 'true' || value === '1';
      break;
      
    case 'apiUrl':
      if (!value.startsWith('http')) {
        logger.error(`Invalid URL for ${key}: ${value}`);
        return;
      }
      break;
  }

  // Update configuration
  configManager.set(key as any, typedValue);
  logger.success(`Configuration updated: ${key} = ${typedValue}`);
}

async function interactiveConfig(
  configManager: ConfigManager,
  logger: Logger
): Promise<void> {
  logger.header('🔧 Interactive Configuration Setup');
  logger.info('Configure your Stack Evaluator CLI settings\\n');

  const currentConfig = configManager.get();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiUrl',
      message: 'API URL:',
      default: currentConfig.apiUrl,
      validate: (input: string) => {
        if (!input.trim()) return 'API URL is required';
        if (!input.startsWith('http')) return 'URL must start with http:// or https://';
        return true;
      }
    },
    {
      type: 'number',
      name: 'timeout',
      message: 'Request timeout (milliseconds):',
      default: currentConfig.timeout,
      validate: (input: number) => {
        if (input < 1000) return 'Timeout must be at least 1 second (1000ms)';
        if (input > 300000) return 'Timeout cannot exceed 5 minutes (300000ms)';
        return true;
      }
    },
    {
      type: 'number',
      name: 'retries',
      message: 'Number of retry attempts:',
      default: currentConfig.retries,
      validate: (input: number) => {
        if (input < 0) return 'Retries cannot be negative';
        if (input > 10) return 'Too many retries (max 10)';
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'offline',
      message: 'Enable offline mode by default?',
      default: currentConfig.offline
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Enable verbose logging by default?',
      default: currentConfig.verbose
    }
  ]);

  // Update configuration
  configManager.update(answers);
  
  logger.newLine();
  logger.success('Configuration saved successfully!');
  logger.info(`Config file: ${configManager.getConfigPath()}`);
}

async function resetConfig(
  configManager: ConfigManager,
  logger: Logger,
  force: boolean = false
): Promise<void> {
  if (!force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset all configuration to defaults?',
        default: false
      }
    ]);

    if (!confirm) {
      logger.info('Configuration reset cancelled');
      return;
    }
  }

  configManager.reset();
  logger.success('Configuration reset to defaults');
}

async function validateConfig(
  configManager: ConfigManager,
  logger: Logger
): Promise<void> {
  logger.header('🔍 Configuration Validation');
  logger.newLine();

  const config = configManager.get();
  let isValid = true;

  // Validate API URL
  logger.info('Checking API URL...');
  try {
    const url = new URL(config.apiUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      logger.error('❌ Invalid API URL protocol (must be http or https)');
      isValid = false;
    } else {
      logger.success('✅ API URL format is valid');
    }
  } catch (error) {
    logger.error('❌ Invalid API URL format');
    isValid = false;
  }

  // Validate timeout
  logger.info('Checking timeout...');
  if (config.timeout < 1000 || config.timeout > 300000) {
    logger.error('❌ Timeout out of range (must be 1000-300000ms)');
    isValid = false;
  } else {
    logger.success('✅ Timeout is valid');
  }

  // Validate retries
  logger.info('Checking retries...');
  if (config.retries < 0 || config.retries > 10) {
    logger.error('❌ Retries out of range (must be 0-10)');
    isValid = false;
  } else {
    logger.success('✅ Retries setting is valid');
  }

  // Test API connection (if not offline)
  if (!config.offline) {
    logger.info('Testing API connection...');
    try {
      const { APIClient } = require('@/utils/api');
      const apiClient = new APIClient(config);
      const isHealthy = await apiClient.healthCheck();
      
      if (isHealthy) {
        logger.success('✅ API connection successful');
      } else {
        logger.warn('⚠️  API is not responding (check if service is running)');
      }
    } catch (error) {
      logger.warn('⚠️  Could not test API connection');
    }
  }

  logger.newLine();
  if (isValid) {
    logger.success('🎉 Configuration is valid!');
  } else {
    logger.error('❌ Configuration has errors. Run "stack-eval config --interactive" to fix.');
  }
}

export function configCommand(
  program: Command,
  context: CLIContext,
  logger: Logger,
  configManager: ConfigManager
): void {
  const configCmd = program
    .command('config')
    .description('Manage CLI configuration');

  // Show current configuration
  configCmd
    .command('show')
    .description('Show current configuration')
    .option('-f, --format <type>', 'output format (table|json)', 'table')
    .action(async (options: ConfigOptions) => {
      try {
        await showConfig(context, logger, configManager, options);
      } catch (error) {
        logger.error('Failed to show configuration:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  // Set configuration value
  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(async (key: string, value: string) => {
      try {
        await setConfigValue(key, value, configManager, logger);
      } catch (error) {
        logger.error('Failed to set configuration:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  // Interactive configuration
  configCmd
    .command('setup')
    .alias('interactive')
    .description('Interactive configuration setup')
    .action(async () => {
      try {
        await interactiveConfig(configManager, logger);
      } catch (error) {
        logger.error('Failed to configure:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  // Reset configuration
  configCmd
    .command('reset')
    .description('Reset configuration to defaults')
    .option('--force', 'skip confirmation prompt')
    .action(async (options: { force?: boolean }) => {
      try {
        await resetConfig(configManager, logger, options.force);
      } catch (error) {
        logger.error('Failed to reset configuration:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  // Validate configuration
  configCmd
    .command('validate')
    .description('Validate current configuration')
    .action(async () => {
      try {
        await validateConfig(configManager, logger);
      } catch (error) {
        logger.error('Failed to validate configuration:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  // Default action (show config)
  configCmd.action(async (options: ConfigOptions) => {
    try {
      await showConfig(context, logger, configManager, options);
    } catch (error) {
      logger.error('Failed to show configuration:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });
}