import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { CLIConfig } from '@/types';

const CONFIG_DIR = join(homedir(), '.stack-evaluator');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: CLIConfig = {
  apiUrl: 'https://stack.organizedai.vip/api',
  timeout: 30000,
  retries: 3,
  offline: false,
  verbose: false,
};

export class ConfigManager {
  private config: CLIConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): CLIConfig {
    try {
      if (existsSync(CONFIG_FILE)) {
        const configData = readFileSync(CONFIG_FILE, 'utf-8');
        const parsedConfig = JSON.parse(configData);
        return { ...DEFAULT_CONFIG, ...parsedConfig };
      }
    } catch (error) {
      // If config is corrupted, use default
      console.warn('Warning: Could not load config, using defaults');
    }
    
    return { ...DEFAULT_CONFIG };
  }

  get(): CLIConfig {
    return { ...this.config };
  }

  set(key: keyof CLIConfig, value: any): void {
    (this.config as any)[key] = value;
    this.save();
  }

  update(updates: Partial<CLIConfig>): void {
    this.config = { ...this.config, ...updates };
    this.save();
  }

  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.save();
  }

  private save(): void {
    try {
      if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true });
      }
      
      writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Warning: Could not save config file');
    }
  }

  getConfigPath(): string {
    return CONFIG_FILE;
  }

  exists(): boolean {
    return existsSync(CONFIG_FILE);
  }
}