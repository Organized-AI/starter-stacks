import fetch from 'node-fetch';
import { UserAnswers, StackRecommendation, CLIConfig } from '@/types';

export class APIClient {
  private config: CLIConfig;

  constructor(config: CLIConfig) {
    this.config = config;
  }

  async evaluate(userAnswers: UserAnswers): Promise<StackRecommendation> {
    const url = `${this.config.apiUrl}/evaluate`;
    
    let attempt = 0;
    while (attempt < this.config.retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'stack-evaluator-cli/1.0.0',
          },
          body: JSON.stringify({ userAnswers }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json() as StackRecommendation;
        return result;
      } catch (error) {
        attempt++;
        
        if (attempt >= this.config.retries) {
          throw new Error(
            `Failed to evaluate after ${this.config.retries} attempts: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Unexpected error in evaluation');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const url = `${this.config.apiUrl}/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.ok;
    } catch {
      return false;
    }
  }

  async getStacks(): Promise<any[]> {
    try {
      const url = `${this.config.apiUrl}/stacks`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch stacks: ${response.statusText}`);
      }

      return await response.json() as any[];
    } catch (error) {
      throw new Error(
        `Unable to fetch stacks: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  setConfig(config: CLIConfig): void {
    this.config = config;
  }
}