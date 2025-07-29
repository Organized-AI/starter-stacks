# /test-suite - Testing & Quality Assurance

Add comprehensive tests following TDD principles with 90%+ coverage.

## Usage
```
/test-suite [type] [component]
```

## Test Types
- `unit` - Individual component/function tests
- `integration` - Component interaction tests
- `e2e` - End-to-end user workflows
- `performance` - Load and speed tests
- `accessibility` - WCAG compliance tests

## Testing Stack
- **Jest**: Unit and integration tests
- **React Testing Library**: Component testing
- **Playwright**: E2E browser testing
- **Lighthouse CI**: Performance testing
- **axe-core**: Accessibility testing

## Coverage Requirements
- **Evaluation Engine**: 100% coverage (critical logic)
- **Web Components**: 90% coverage
- **CLI Commands**: 85% coverage  
- **Integration**: 80% coverage
- **Overall Target**: 90%+ coverage

## Test Structure
```
__tests__/
├── unit/
│   ├── evaluation-engine.test.ts
│   ├── stack-database.test.ts
│   └── recommendation.test.ts
├── integration/
│   ├── web-evaluation-flow.test.ts
│   └── cli-commands.test.ts
├── e2e/
│   ├── web-user-journey.spec.ts
│   └── cli-workflows.spec.ts
└── performance/
    ├── evaluation-speed.test.ts
    └── web-vitals.test.ts
```

## Key Test Scenarios

### Evaluation Engine
- All question combinations
- Edge cases and invalid inputs
- Performance under load
- Recommendation accuracy

### Web Interface  
- Complete evaluation flow
- Mobile responsiveness
- Accessibility compliance
- SEO optimization

### CLI Tool
- Interactive prompts
- Project generation
- Error handling
- Cross-platform compatibility

## TDD Workflow
1. Write failing test first
2. Implement minimal code to pass
3. Refactor for quality
4. Verify coverage metrics
5. Update documentation

Use this for adding tests to any component or feature.
