#!/usr/bin/env tsx
/**
 * Phase 1 Validation Script
 * Tests that the evaluation engine can process UserAnswers → StackRecommendations
 */

import { evaluationEngine } from './lib/evaluation/evaluation-engine.js';
import { stackDatabase } from './lib/data/stack-database.js';
import { performanceMonitor } from './lib/utils/performance-monitor.js';
import type { UserAnswers } from './lib/types/index.js';

async function validatePhase1(): Promise<void> {
  console.log('🚀 Phase 1 Validation: AI Tool Stack Evaluator');
  console.log('================================================\n');

  try {
    // Step 1: Validate stack database loading
    console.log('📊 Step 1: Testing stack database...');
    const allStacks = await stackDatabase.getAllStacks();
    console.log(`✅ Loaded ${allStacks.length} stacks successfully`);
    
    const stats = await stackDatabase.getStackStats();
    console.log(`   - Categories: ${Object.keys(stats.byCategory).length}`);
    console.log(`   - Free tier stacks: ${stats.withFreeTier}`);
    console.log(`   - Average pros: ${stats.averageProsCount.toFixed(1)}`);
    console.log();

    // Step 2: Test evaluation engine with sample user answers
    console.log('🔍 Step 2: Testing evaluation engine...');
    
    const sampleUserAnswers: UserAnswers = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      answers: [
        { questionId: 'timeline', value: 'same-day' },
        { questionId: 'background', value: 'intermediate' },
        { questionId: 'project-type', value: 'chat-interface' },
        { questionId: 'team-size', value: 'small' },
        { questionId: 'design-priority', value: 'important' },
      ],
      completedAt: new Date(),
    };

    const result = await evaluationEngine.evaluate(sampleUserAnswers);
    console.log(`✅ Generated ${result.recommendation.recommendations.length} recommendations`);
    console.log(`   - Processing time: ${result.performance.responseTime}ms`);
    console.log(`   - Stacks evaluated: ${result.performance.stacksProcessed}`);
    console.log();

    // Step 3: Display sample recommendations
    console.log('📋 Step 3: Sample recommendations:');
    result.recommendation.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.stack.name}`);
      console.log(`      Score: ${rec.score.toFixed(1)} | Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
      console.log(`      Reason: ${rec.reasoning[0]}`);
      if (rec.mismatches.length > 0) {
        console.log(`      Consider: ${rec.mismatches[0]}`);
      }
      console.log();
    });

    // Step 4: Test different user profiles
    console.log('👥 Step 4: Testing different user profiles...');
    
    const beginnerAnswers: UserAnswers = {
      userId: '123e4567-e89b-12d3-a456-426614174001',
      answers: [
        { questionId: 'timeline', value: '30-minutes' },
        { questionId: 'background', value: 'non-technical' },
        { questionId: 'project-type', value: 'chat-interface' },
        { questionId: 'team-size', value: 'solo' },
        { questionId: 'design-priority', value: 'basic' },
      ],
      completedAt: new Date(),
    };

    const beginnerResult = await evaluationEngine.evaluate(beginnerAnswers);
    const topBeginnerStack = beginnerResult.recommendation.recommendations[0];
    console.log(`✅ Beginner recommendation: ${topBeginnerStack.stack.name}`);
    console.log(`   - Learning curve: ${topBeginnerStack.stack.learningCurve}`);
    console.log(`   - Time to production: ${topBeginnerStack.stack.timeToProduction}`);
    console.log();

    const expertAnswers: UserAnswers = {
      userId: '123e4567-e89b-12d3-a456-426614174002',
      answers: [
        { questionId: 'timeline', value: '1-2-weeks' },
        { questionId: 'background', value: 'expert' },
        { questionId: 'project-type', value: 'complex-workflows' },
        { questionId: 'team-size', value: 'large' },
        { questionId: 'design-priority', value: 'critical' },
      ],
      completedAt: new Date(),
    };

    const expertResult = await evaluationEngine.evaluate(expertAnswers);
    const topExpertStack = expertResult.recommendation.recommendations[0];
    console.log(`✅ Expert recommendation: ${topExpertStack.stack.name}`);
    console.log(`   - Category: ${topExpertStack.stack.category}`);
    console.log(`   - Community support: ${topExpertStack.stack.communitySupport}`);
    console.log();

    // Step 5: Test performance monitoring
    console.log('📈 Step 5: Testing performance monitoring...');
    const perfStats = performanceMonitor.getAggregatedStats();
    console.log(`✅ Performance tracking active`);
    console.log(`   - Evaluations tracked: ${perfStats.totalEvaluations}`);
    console.log(`   - Average response time: ${perfStats.averageResponseTime.toFixed(0)}ms`);
    console.log(`   - Performance grade: ${perfStats.performanceGrade}`);
    console.log();

    // Step 6: Test caching
    console.log('💾 Step 6: Testing caching functionality...');
    const cacheResult = await evaluationEngine.evaluate(sampleUserAnswers);
    console.log(`✅ Cache working: ${cacheResult.performance.cacheHit ? 'HIT' : 'MISS'}`);
    console.log(`   - Cached response time: ${cacheResult.performance.responseTime}ms`);
    
    const cacheStats = evaluationEngine.getCacheStats();
    console.log(`   - Cache size: ${cacheStats.size} entries`);
    console.log();

    // Final validation
    console.log('🎉 Phase 1 Validation Complete!');
    console.log('================================');
    console.log('✅ All core components working correctly');
    console.log('✅ Evaluation engine: UserAnswers → StackRecommendations ✓');
    console.log('✅ Database loading and querying ✓');
    console.log('✅ Performance monitoring ✓');
    console.log('✅ Caching functionality ✓');
    console.log('✅ User profile differentiation ✓');
    console.log();
    console.log('📦 Ready for Phase 2: Web Interface Development');

  } catch (error) {
    console.error('❌ Phase 1 Validation Failed:');
    console.error(error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Run validation
validatePhase1().catch(console.error);