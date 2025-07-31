// Core types for evaluation engine compatibility
export interface Stack {
  id: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  learningCurve: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeToProduction: string;
  popularity: number;
  pros: string[];
  cons: string[];
  bestFor: string[];
  alternatives: string[];
}

export interface Answer {
  questionId: string;
  value: string;
}

export interface UserAnswers {
  userId: string;
  answers: Answer[];
  completedAt: Date;
}

export interface RecommendedStack {
  stack: Stack;
  confidence: number;
  score: number;
  reasoning: string[];
}

export interface StackRecommendation {
  userId: string;
  recommendations: RecommendedStack[];
  metadata: {
    evaluatedAt: Date;
    model: string;
    version: string;
  };
}

export interface EvaluationResult extends StackRecommendation {}

// CLI-specific types
export interface CLIConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  offline: boolean;
  verbose: boolean;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  stack: Stack;
  gitUrl?: string;
  localPath?: string;
  files: TemplateFile[];
  dependencies: string[];
  scripts: Record<string, string>;
  instructions: string[];
}

export interface TemplateFile {
  path: string;
  content: string;
  template: boolean; // Whether to process as template with variables
}

export interface CLIContext {
  config: CLIConfig;
  workingDir: string;
  verbose: boolean;
  dryRun: boolean;
}

export interface CommandOptions {
  verbose?: boolean;
  output?: string;
  format?: 'json' | 'table' | 'compact';
  interactive?: boolean;
  dryRun?: boolean;
}

export interface EvaluationOptions extends CommandOptions {
  quick?: boolean;
  offline?: boolean;
  save?: string;
}

export interface GenerateOptions extends CommandOptions {
  template?: string;
  directory?: string;
  gitInit?: boolean;
  installDeps?: boolean;
  openVSCode?: boolean;
}

export interface GitHubOptions {
  token?: string;
  organization?: string;
  private?: boolean;
  description?: string;
  topics?: string[];
  useSsh?: boolean;
}

export interface ListOptions extends CommandOptions {
  category?: string;
  search?: string;
  sort?: 'name' | 'category' | 'learning' | 'popularity';
  detailed?: boolean;
  offline?: boolean;
}

export interface ConfigOptions extends CommandOptions {
}

export interface InitOptions extends CommandOptions {
  directory?: string;
  quick?: boolean;
  force?: boolean;
  createStructure?: boolean;
  git?: boolean;
}

export interface TemplateOptions {
  projectName: string;
  description?: string;
}

export interface CliError extends Error {
  code: string;
  exitCode: number;
  context?: Record<string, unknown>;
}

export interface UpdateInfo {
  current: string;
  latest: string;
  updateAvailable: boolean;
  changelog?: string;
}