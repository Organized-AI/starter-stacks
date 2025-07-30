#!/usr/bin/env node
/**
 * Simple Phase 1 Demo Script
 * Tests basic functionality without complex test framework setup
 */

import { stackDatabase } from './dist/lib/data/stack-database.js';
import { evaluationEngine } from './dist/lib/evaluation/evaluation-engine.js';

async function demoPhase1() {
  console.log('🚀 Phase 1 Demo: Core Functionality Test\n');
  
  try {
    // Test 1: Load stacks
    console.log('📊 Loading stacks...');
    const stacks = await stackDatabase.getAllStacks();
    console.log(`✅ Loaded ${stacks.length} stacks\n`);
    
    // Test 2: Simple evaluation
    console.log('🔍 Running evaluation...');
    const sampleAnswers = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      answers: [
        { questionId: 'timeline', value: 'same-day' },
        { questionId: 'background', value: 'intermediate' },
        { questionId: 'project-type', value: 'chat-interface' }
      ],
      completedAt: new Date()
    };
    
    const result = await evaluationEngine.evaluate(sampleAnswers);
    console.log(`✅ Generated ${result.recommendation.recommendations.length} recommendations`);
    console.log(`⚡ Processing time: ${result.performance.responseTime}ms\n`);
    
    // Test 3: Show top recommendation
    const topRec = result.recommendation.recommendations[0];
    if (topRec) {
      console.log('🏆 Top Recommendation:');
      console.log(`   ${topRec.stack.name}`);
      console.log(`   Score: ${topRec.score.toFixed(1)}/100`);
      console.log(`   Confidence: ${(topRec.confidence * 100).toFixed(1)}%`);
      console.log(`   Learning Curve: ${topRec.stack.learningCurve}`);
      console.log(`   Time to Production: ${topRec.stack.timeToProduction}\n`);
    }
    
    console.log('🎉 Phase 1 Demo Complete - All systems working!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

demoPhase1().catch(console.error);