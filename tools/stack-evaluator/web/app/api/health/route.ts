import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: 'operational', // Stack database is file-based
        api: 'operational',
        evaluation_engine: 'operational'
      }
    };

    // Test evaluation engine availability
    try {
      const { evaluationEngine } = await import('@/core/index');
      healthCheck.services.evaluation_engine = 'operational';
    } catch (error) {
      healthCheck.services.evaluation_engine = 'degraded';
      console.warn('Evaluation engine health check failed:', error);
    }

    return NextResponse.json(healthCheck, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}