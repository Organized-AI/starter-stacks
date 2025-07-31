#!/usr/bin/env node
/**
 * Simple test script to verify the evaluation API works
 */

const testUserAnswers = {
  userId: '123e4567-e89b-12d3-a456-426614174000',
  answers: [
    { questionId: 'timeline', value: 'standard' },
    { questionId: 'background', value: 'intermediate' },
    { questionId: 'project-type', value: 'chat-interface' },
    { questionId: 'team-size', value: 'small' },
    { questionId: 'design-priority', value: 'important' }
  ],
  completedAt: new Date().toISOString()
};

async function testEvaluationAPI() {
  try {
    console.log('🧪 Testing Evaluation API...\n');
    
    const response = await fetch('http://localhost:3000/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswers: testUserAnswers }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ API Response successful!');
    console.log(`📊 Received ${result.recommendations?.length || 0} recommendations`);
    
    if (result.recommendations && result.recommendations.length > 0) {
      console.log('\n🎯 Top Recommendation:');
      const top = result.recommendations[0];
      console.log(`   Stack: ${top.stack.name}`);
      console.log(`   Confidence: ${Math.round(top.confidence * 100)}%`);
      console.log(`   Score: ${top.score}`);
      console.log(`   Category: ${top.stack.category}`);
    }
    
    console.log('\n✅ End-to-end evaluation flow working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run test if server is running
testEvaluationAPI();