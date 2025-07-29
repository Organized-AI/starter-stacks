# /eval-engine - Evaluation Engine Development

Work on core evaluation engine components with full context.

## Usage
```
/eval-engine [component]
```

## Components
- `algorithm` - Recommendation scoring algorithm
- `engine` - Main StackEvaluator class
- `database` - Stack data management
- `types` - TypeScript interfaces
- `tests` - Unit tests for engine
- `utils` - Helper functions

## Context Provided
- Current UserAnswers and EvaluationResult interfaces
- Stack database schema and all 10 stack definitions
- Weighting algorithms for different user types
- Performance requirements (<30s evaluation)
- Test coverage expectations (90%+)

## Key Files
- `evaluator/shared/evaluation-engine.ts` - Main engine
- `evaluator/shared/stack-database.ts` - Stack data
- `evaluator/shared/types.ts` - Type definitions
- `evaluator/shared/__tests__/` - Test files

## Architecture Context
```typescript
interface StackEvaluator {
  evaluate(answers: UserAnswers): EvaluationResult
  getStackDetails(stackId: string): StackDetails
  compareStacks(stackIds: string[]): ComparisonMatrix
}

class RecommendationEngine {
  private weightingAlgorithm: WeightingStrategy
  private stackDatabase: StackDatabase
  
  calculateScores(answers: UserAnswers): ScoredStack[]
  generateRecommendation(scores: ScoredStack[]): Recommendation
  explainRecommendation(rec: Recommendation): string
}
```

## Current Requirements
- Support all 10 AI tool stacks
- Handle 5-question evaluation flow
- Generate confidence scores and reasoning
- Return primary + 2-3 alternative recommendations
- Optimize for speed and accuracy

Use this command when working on any evaluation engine functionality.
