import fetch from 'node-fetch';
import { spawn } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';

import { CLIContext, GitHubOptions } from '@/types';
import { Logger } from '@/utils/logger';

const execAsync = promisify(spawn);

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  private: boolean;
}

interface GitHubUser {
  login: string;
  name: string;
  email: string;
}

export class GitHubClient {
  private context: CLIContext;
  private logger: Logger;
  private token?: string;

  constructor(context: CLIContext, logger: Logger) {
    this.context = context;
    this.logger = logger;
    this.token = process.env.GITHUB_TOKEN;
  }

  async checkAuthentication(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'stack-evaluator-cli/1.0.0'
        }
      });

      return response.ok;
    } catch (error) {
      this.logger.verbose('GitHub authentication check failed:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<GitHubUser | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'stack-evaluator-cli/1.0.0'
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json() as GitHubUser;
    } catch (error) {
      this.logger.verbose('Failed to get GitHub user:', error);
      return null;
    }
  }

  async createRepository(
    name: string,
    description: string,
    options: GitHubOptions = {}
  ): Promise<GitHubRepository | null> {
    if (!this.token) {
      this.logger.warn('GitHub token not found. Set GITHUB_TOKEN environment variable.');
      return null;
    }

    const requestBody = {
      name,
      description,
      private: options.private || false,
      auto_init: false, // We'll initialize locally
      gitignore_template: null,
      license_template: null
    };

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'stack-evaluator-cli/1.0.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Failed to create repository: ${response.status} ${errorText}`);
        return null;
      }

      const repository = await response.json() as GitHubRepository;
      this.logger.success(`Repository created: ${repository.html_url}`);
      return repository;

    } catch (error) {
      this.logger.error('Failed to create GitHub repository:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  async pushToRepository(
    projectPath: string,
    repository: GitHubRepository,
    options: GitHubOptions = {}
  ): Promise<boolean> {
    try {
      // Check if git is initialized
      const gitConfigPath = `${projectPath}/.git`;
      const { existsSync } = require('fs');
      
      if (!existsSync(gitConfigPath)) {
        this.logger.verbose('Initializing git repository...');
        await this.runGitCommand(['init'], projectPath);
        await this.runGitCommand(['add', '.'], projectPath);
        await this.runGitCommand(['commit', '-m', 'Initial commit'], projectPath);
      }

      // Add remote origin
      const remoteUrl = options.useSsh ? repository.ssh_url : repository.clone_url;
      this.logger.verbose(`Adding remote origin: ${remoteUrl}`);
      
      try {
        await this.runGitCommand(['remote', 'add', 'origin', remoteUrl], projectPath);
      } catch (error) {
        // Remote might already exist, try to set URL instead
        await this.runGitCommand(['remote', 'set-url', 'origin', remoteUrl], projectPath);
      }

      // Push to repository
      this.logger.verbose('Pushing to GitHub...');
      await this.runGitCommand(['push', '-u', 'origin', 'main'], projectPath);

      this.logger.success(`Code pushed to: ${repository.html_url}`);
      return true;

    } catch (error) {
      this.logger.error('Failed to push to GitHub:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  async setupGitHubIntegration(
    projectName: string,
    projectPath: string,
    description: string
  ): Promise<GitHubRepository | null> {
    // Check if GitHub token is available
    if (!this.token) {
      this.logger.info('🔗 GitHub Integration');
      this.logger.warn('No GitHub token found.');
      this.logger.info('To enable GitHub integration:');
      this.logger.info('1. Create a personal access token at: https://github.com/settings/tokens');
      this.logger.info('2. Set the token: export GITHUB_TOKEN=your_token_here');
      this.logger.info('3. Re-run the generate command');
      return null;
    }

    // Check authentication
    const isAuthenticated = await this.checkAuthentication();
    if (!isAuthenticated) {
      this.logger.error('GitHub authentication failed. Please check your GITHUB_TOKEN.');
      return null;
    }

    // Get current user
    const user = await this.getCurrentUser();
    if (!user) {
      this.logger.error('Could not get GitHub user information.');
      return null;
    }

    this.logger.info(`🔗 GitHub Integration (authenticated as ${user.login})`);

    // Ask if user wants to create a repository
    const { createRepo } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createRepo',
        message: 'Create a GitHub repository for this project?',
        default: true
      }
    ]);

    if (!createRepo) {
      return null;
    }

    // Ask for repository options
    const repoOptions = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Repository name:',
        default: projectName,
        validate: (input: string) => {
          if (!input.trim()) return 'Repository name is required';
          if (!/^[a-zA-Z0-9-_.]+$/.test(input)) return 'Invalid repository name';
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Repository description:',
        default: description
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Make repository private?',
        default: false
      },
      {
        type: 'confirm',
        name: 'pushCode',
        message: 'Push code to repository after creation?',
        default: true
      }
    ]);

    // Create repository
    this.logger.verbose(`Creating repository: ${repoOptions.name}`);
    const repository = await this.createRepository(
      repoOptions.name,
      repoOptions.description,
      { private: repoOptions.private }
    );

    if (!repository) {
      return null;
    }

    // Push code if requested
    if (repoOptions.pushCode) {
      const success = await this.pushToRepository(projectPath, repository);
      if (!success) {
        this.logger.warn('Repository created but failed to push code.');
        this.logger.info(`You can push manually: git remote add origin ${repository.clone_url}`);
      }
    }

    return repository;
  }

  private async runGitCommand(args: string[], cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('git', args, {
        cwd,
        stdio: this.context.verbose ? 'inherit' : 'pipe'
      });

      let stdout = '';
      let stderr = '';

      if (child.stdout) {
        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });
      }

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Git command failed: ${stderr || stdout}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async checkGitInstallation(): Promise<boolean> {
    try {
      await this.runGitCommand(['--version'], process.cwd());
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRepositoryInfo(projectPath: string): Promise<{
    hasGit: boolean;
    hasRemote: boolean;
    remoteUrl?: string;
    currentBranch?: string;
  }> {
    const info = {
      hasGit: false,
      hasRemote: false,
      remoteUrl: undefined as string | undefined,
      currentBranch: undefined as string | undefined
    };

    try {
      // Check if git is initialized
      await this.runGitCommand(['status'], projectPath);
      info.hasGit = true;

      // Get current branch
      try {
        info.currentBranch = await this.runGitCommand(['branch', '--show-current'], projectPath);
      } catch (error) {
        // Might be initial commit with no branch yet
      }

      // Check for remote
      try {
        info.remoteUrl = await this.runGitCommand(['remote', 'get-url', 'origin'], projectPath);
        info.hasRemote = true;
      } catch (error) {
        // No remote configured
      }

    } catch (error) {
      // Not a git repository
    }

    return info;
  }
}