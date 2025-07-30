/**
 * Performance monitoring utilities
 * Tracks evaluation performance and generates metrics
 */

import type { PerformanceMetrics } from '../types/index.js';
import { PERFORMANCE_THRESHOLDS, MONITORING_EVENTS } from '../constants.js';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private listeners: Map<string, EventListener[]> = new Map();

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Record performance metrics for an evaluation
   */
  public recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.set(metrics.evaluationId, metrics);
    this.emitEvent(MONITORING_EVENTS.EVALUATION_COMPLETE, metrics);
    
    // Check for performance issues
    this.checkPerformanceThresholds(metrics);
  }

  /**
   * Get metrics for a specific evaluation
   */
  public getMetrics(evaluationId: string): PerformanceMetrics | undefined {
    return this.metrics.get(evaluationId);
  }

  /**
   * Get aggregated performance statistics
   */
  public getAggregatedStats(): PerformanceStats {
    const allMetrics = Array.from(this.metrics.values());
    
    if (allMetrics.length === 0) {
      return {
        totalEvaluations: 0,
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        averageStacksProcessed: 0,
        cacheHitRate: 0,
        performanceGrade: 'N/A',
        trends: {
          responseTimeImproving: false,
          cacheEfficiencyImproving: false,
        },
      };
    }

    const responseTimes = allMetrics.map(m => m.responseTime).sort((a, b) => a - b);
    const stacksProcessed = allMetrics.map(m => m.stacksProcessed);
    const cacheHits = allMetrics.filter(m => m.cacheHit).length;

    return {
      totalEvaluations: allMetrics.length,
      averageResponseTime: this.average(responseTimes),
      medianResponseTime: this.median(responseTimes),
      p95ResponseTime: this.percentile(responseTimes, 95),
      averageStacksProcessed: this.average(stacksProcessed),
      cacheHitRate: cacheHits / allMetrics.length,
      performanceGrade: this.calculatePerformanceGrade(responseTimes),
      trends: this.calculateTrends(allMetrics),
    };
  }

  /**
   * Get recent performance metrics
   */
  public getRecentMetrics(hours: number = 24): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.metrics.values())
      .filter(m => m.timestamp >= cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Check if performance exceeds thresholds
   */
  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    if (metrics.responseTime > PERFORMANCE_THRESHOLDS.responseTime.slow) {
      this.emitEvent('performance.slow_response', {
        evaluationId: metrics.evaluationId,
        responseTime: metrics.responseTime,
        threshold: PERFORMANCE_THRESHOLDS.responseTime.slow,
      });
    }

    if (metrics.stacksProcessed > PERFORMANCE_THRESHOLDS.stackProcessing.large) {
      this.emitEvent('performance.large_dataset', {
        evaluationId: metrics.evaluationId,
        stacksProcessed: metrics.stacksProcessed,
      });
    }
  }

  /**
   * Calculate overall performance grade
   */
  private calculatePerformanceGrade(responseTimes: number[]): string {
    const avgResponseTime = this.average(responseTimes);
    
    if (avgResponseTime <= PERFORMANCE_THRESHOLDS.responseTime.excellent) return 'A+';
    if (avgResponseTime <= PERFORMANCE_THRESHOLDS.responseTime.good) return 'A';
    if (avgResponseTime <= PERFORMANCE_THRESHOLDS.responseTime.acceptable) return 'B';
    if (avgResponseTime <= PERFORMANCE_THRESHOLDS.responseTime.slow) return 'C';
    return 'D';
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(metrics: PerformanceMetrics[]): PerformanceTrends {
    if (metrics.length < 10) {
      return {
        responseTimeImproving: false,
        cacheEfficiencyImproving: false,
      };
    }

    // Sort by timestamp
    const sorted = metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Split into two halves and compare
    const midPoint = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, midPoint);
    const secondHalf = sorted.slice(midPoint);

    const firstHalfAvgTime = this.average(firstHalf.map(m => m.responseTime));
    const secondHalfAvgTime = this.average(secondHalf.map(m => m.responseTime));

    const firstHalfCacheRate = firstHalf.filter(m => m.cacheHit).length / firstHalf.length;
    const secondHalfCacheRate = secondHalf.filter(m => m.cacheHit).length / secondHalf.length;

    return {
      responseTimeImproving: secondHalfAvgTime < firstHalfAvgTime,
      cacheEfficiencyImproving: secondHalfCacheRate > firstHalfCacheRate,
    };
  }

  /**
   * Add event listener for performance events
   */
  public addEventListener(event: string, listener: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(event: string, listener: EventListener): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit performance event
   */
  private emitEvent(event: string, data: unknown): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in performance event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Clear old metrics to prevent memory leaks
   */
  public cleanup(olderThanHours: number = 168): void { // Default: 1 week
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    
    for (const [evaluationId, metrics] of this.metrics.entries()) {
      if (metrics.timestamp < cutoff) {
        this.metrics.delete(evaluationId);
      }
    }
  }

  /**
   * Export metrics for analysis
   */
  public exportMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Generate performance report
   */
  public generateReport(): PerformanceReport {
    const stats = this.getAggregatedStats();
    const recentMetrics = this.getRecentMetrics(24);
    
    return {
      summary: stats,
      recentActivity: recentMetrics.length,
      recommendations: this.generateRecommendations(stats),
      alerts: this.generateAlerts(stats),
      timestamp: new Date(),
    };
  }

  /**
   * Generate performance improvement recommendations
   */
  private generateRecommendations(stats: PerformanceStats): string[] {
    const recommendations: string[] = [];

    if (stats.averageResponseTime > PERFORMANCE_THRESHOLDS.responseTime.acceptable) {
      recommendations.push('Consider optimizing the scoring algorithm');
      recommendations.push('Implement result caching for common queries');
    }

    if (stats.cacheHitRate < 0.3) {
      recommendations.push('Improve cache key generation for better hit rates');
      recommendations.push('Increase cache size or retention time');
    }

    if (!stats.trends.responseTimeImproving) {
      recommendations.push('Monitor for performance regressions');
      recommendations.push('Consider database query optimization');
    }

    return recommendations;
  }

  /**
   * Generate performance alerts
   */
  private generateAlerts(stats: PerformanceStats): string[] {
    const alerts: string[] = [];

    if (stats.averageResponseTime > PERFORMANCE_THRESHOLDS.responseTime.slow) {
      alerts.push('High average response time detected');
    }

    if (stats.cacheHitRate < 0.1) {
      alerts.push('Very low cache hit rate');
    }

    if (stats.performanceGrade === 'D') {
      alerts.push('Poor overall performance grade');
    }

    return alerts;
  }

  // Utility methods
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private median(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private percentile(numbers: number[], p: number): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

// Supporting interfaces
export interface PerformanceStats {
  totalEvaluations: number;
  averageResponseTime: number;
  medianResponseTime: number;
  p95ResponseTime: number;
  averageStacksProcessed: number;
  cacheHitRate: number;
  performanceGrade: string;
  trends: PerformanceTrends;
}

export interface PerformanceTrends {
  responseTimeImproving: boolean;
  cacheEfficiencyImproving: false;
}

export interface PerformanceReport {
  summary: PerformanceStats;
  recentActivity: number;
  recommendations: string[];
  alerts: string[];
  timestamp: Date;
}

type EventListener = (data: unknown) => void;

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();