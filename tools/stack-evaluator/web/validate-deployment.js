#!/usr/bin/env node
/**
 * Production Deployment Validation Script
 * Tests all critical endpoints and functionality
 */

const BASE_URL = process.env.DEPLOYMENT_URL || 'https://stack.organizedai.vip';

async function validateDeployment() {
  console.log('🚀 Validating Production Deployment...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Health Check
  try {
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok && healthData.status === 'healthy') {
      console.log('✅ Health check passed');
      results.passed++;
      results.tests.push({ name: 'Health Check', status: 'PASS' });
    } else {
      throw new Error(`Health check failed: ${healthData.status}`);
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Health Check', status: 'FAIL', error: error.message });
  }

  // Test 2: Main Page Load
  try {
    console.log('🔍 Testing main page...');
    const pageResponse = await fetch(BASE_URL);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      if (html.includes('AI Tool Stack Evaluator') && html.includes('Find Your Perfect')) {
        console.log('✅ Main page loads correctly');
        results.passed++;
        results.tests.push({ name: 'Main Page Load', status: 'PASS' });
      } else {
        throw new Error('Page content validation failed');
      }
    } else {
      throw new Error(`Page load failed: ${pageResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Main page test failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Main Page Load', status: 'FAIL', error: error.message });
  }

  // Test 3: Evaluation API
  try {
    console.log('🔍 Testing evaluation API...');
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

    const evalResponse = await fetch(`${BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAnswers: testUserAnswers }),
    });

    if (evalResponse.ok) {
      const evalData = await evalResponse.json();
      if (evalData.recommendations && evalData.recommendations.length > 0) {
        console.log(`✅ Evaluation API working (${evalData.recommendations.length} recommendations)`);
        results.passed++;
        results.tests.push({ name: 'Evaluation API', status: 'PASS' });
      } else {
        throw new Error('No recommendations returned');
      }
    } else {
      const errorText = await evalResponse.text();
      throw new Error(`API failed: ${evalResponse.status} - ${errorText}`);
    }
  } catch (error) {
    console.log('❌ Evaluation API test failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Evaluation API', status: 'FAIL', error: error.message });
  }

  // Test 4: SEO Endpoints
  try {
    console.log('🔍 Testing SEO endpoints...');
    const [sitemapResponse, robotsResponse] = await Promise.all([
      fetch(`${BASE_URL}/sitemap.xml`),
      fetch(`${BASE_URL}/robots.txt`)
    ]);

    if (sitemapResponse.ok && robotsResponse.ok) {
      console.log('✅ SEO endpoints accessible');
      results.passed++;
      results.tests.push({ name: 'SEO Endpoints', status: 'PASS' });
    } else {
      throw new Error('SEO endpoints failed');
    }
  } catch (error) {
    console.log('❌ SEO endpoints test failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'SEO Endpoints', status: 'FAIL', error: error.message });
  }

  // Test 5: Security Headers
  try {
    console.log('🔍 Testing security headers...');
    const securityResponse = await fetch(BASE_URL);
    const headers = securityResponse.headers;

    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy'
    ];

    const missingHeaders = requiredHeaders.filter(header => !headers.get(header));
    
    if (missingHeaders.length === 0) {
      console.log('✅ Security headers present');
      results.passed++;
      results.tests.push({ name: 'Security Headers', status: 'PASS' });
    } else {
      throw new Error(`Missing headers: ${missingHeaders.join(', ')}`);
    }
  } catch (error) {
    console.log('❌ Security headers test failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Security Headers', status: 'FAIL', error: error.message });
  }

  // Summary
  console.log('\n📊 Deployment Validation Summary:');
  console.log('═'.repeat(50));
  results.tests.forEach(test => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${test.name}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  console.log('\n📈 Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED - DEPLOYMENT SUCCESSFUL!');
    console.log(`🌐 Application is live at: ${BASE_URL}`);
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed - please check the deployment');
    process.exit(1);
  }
}

// Run validation
validateDeployment().catch(error => {
  console.error('❌ Validation script failed:', error);
  process.exit(1);
});