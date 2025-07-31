import { NextRequest, NextResponse } from 'next/server';
import { EvaluationEngine, EvaluationResult, UserAnswers, UserAnswersSchema } from '@/core/index';

// Initialize the evaluation engine
const evaluationEngine = new EvaluationEngine();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Convert completedAt string to Date if needed
    const userAnswersData = {
      ...body.userAnswers,
      completedAt: body.userAnswers.completedAt ? new Date(body.userAnswers.completedAt) : new Date()
    };
    
    // Validate the user answers
    const validation = UserAnswersSchema.safeParse(userAnswersData);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const userAnswers: UserAnswers = validation.data;

    // Run the evaluation
    const result: EvaluationResult = await evaluationEngine.evaluate(userAnswers);

    // Return the recommendation
    return NextResponse.json(result.recommendation, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Evaluation API error:', error);
    
    // Return a structured error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'AI Tool Stack Evaluator API',
      version: '1.0.0',
      endpoints: {
        evaluate: 'POST /api/evaluate - Submit user answers and get stack recommendations'
      }
    },
    { status: 200 }
  );
}