import chalk from 'chalk';
import { CLIContext } from '@/types';

export class Logger {
  private context: CLIContext;

  constructor(context: CLIContext) {
    this.context = context;
  }

  info(message: string, ...args: unknown[]): void {
    console.log(chalk.blue('ℹ'), message, ...args);
  }

  success(message: string, ...args: unknown[]): void {
    console.log(chalk.green('✅'), message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.log(chalk.yellow('⚠️'), message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(chalk.red('❌'), message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.context.verbose) {
      console.log(chalk.gray('🐛'), chalk.gray(message), ...args);
    }
  }

  verbose(message: string, ...args: unknown[]): void {
    if (this.context.verbose) {
      console.log(chalk.cyan('📝'), message, ...args);
    }
  }

  step(step: number, total: number, message: string): void {
    const progress = `[${step}/${total}]`;
    console.log(chalk.blue(progress), message);
  }

  header(text: string): void {
    console.log('\n' + chalk.bold.blue('='.repeat(50)));
    console.log(chalk.bold.blue(text));
    console.log(chalk.bold.blue('='.repeat(50)) + '\n');
  }

  section(text: string): void {
    console.log('\n' + chalk.bold(text));
    console.log(chalk.gray('-'.repeat(text.length)));
  }

  table(data: Record<string, string | number>): void {
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));
    
    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength);
      console.log(`  ${chalk.cyan(paddedKey)}: ${value}`);
    });
  }

  json(data: unknown): void {
    console.log(JSON.stringify(data, null, 2));
  }

  newLine(): void {
    console.log('');
  }

  // Specialized logging methods
  recommendation(stack: string, confidence: number, rank: number): void {
    const stars = '⭐'.repeat(Math.ceil(confidence * 5));
    const confidenceText = `${Math.round(confidence * 100)}%`;
    
    console.log(
      `${chalk.yellow(`#${rank}`)} ${chalk.bold(stack)} ${stars} ${chalk.green(confidenceText)}`
    );
  }

  progress(message: string, current: number, total: number): void {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    
    process.stdout.write(`\r${progressBar} ${percentage}% ${message}`);
    
    if (current === total) {
      console.log(''); // New line when complete
    }
  }

  private createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    return `[${chalk.green('█'.repeat(filled))}${chalk.gray('░'.repeat(empty))}]`;
  }
}