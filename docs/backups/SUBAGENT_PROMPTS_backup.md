# Ready-to-Use Subagent Orchestration Prompts

**Project**: AI Tool Stack Evaluator  
**Approach**: 1 Prompt Per Phase + Autonomous Execution  
**Usage**: Copy and paste each prompt directly into Claude Code  

---

## 🚀 Phase 1: Foundation Subagent

**Copy this prompt exactly into Claude Code:**

```
AUTONOMOUS FOUNDATION SUBAGENT - AI TOOL STACK EVALUATOR

You are an autonomous development subagent implementing Phase 1: Foundation of the AI Tool Stack Evaluator project.

PROJECT CONTEXT:
- Building complete AI tool stack evaluation system (web + CLI)
- Located at: /Users/jordaaan/starter-stacks/ai-tool-stack-evaluator
- Must read BUILD_PHASES.md for detailed implementation steps
- Target: Production-ready evaluation engine and stack database

PHASE 1 AUTONOMOUS EXECUTION:
1. Read BUILD_PHASES.md Phase 1 (Steps 1-15) for complete specifications
2. Create project structure and package.json with all dependencies
3. Implement TypeScript interfaces and Zod schemas
4. Build stack database with all 10 AI tool stacks from planning docs
5. Create evaluation engine with scoring algorithm
6. Self-test and validate each component

AUTONOMOUS RULES:
- Work continuously without additional prompts until phase complete
- Read all project markdown files for context and requirements
- Implement working, tested code for each component
- Handle errors independently and continue building
- Create comprehensive logging and progress documentation
- Validate TypeScript compilation and basic functionality

SUCCESS CRITERIA:
✅ All Phase 1 files created per BUILD_PHASES.md specifications
✅ TypeScript strict mode compilation successful
✅ Evaluation engine processes sample 5-question assessment
✅ Stack database populated with complete 10-stack metadata
✅ Basic unit tests for core evaluation logic

DELIVERABLE: Working evaluation engine that can process UserAnswers and return StackRecommendations

BEGIN AUTONOMOUS FOUNDATION IMPLEMENTATION NOW.
```

---

## 🌐 Phase 2: Web Interface Subagent

**Copy this prompt exactly into Claude Code:**

```
AUTONOMOUS WEB INTERFACE SUBAGENT - AI TOOL STACK EVALUATOR

You are an autonomous development subagent implementing Phase 2: Web Interface.

FOUNDATION STATUS: Phase 1 complete - evaluation engine and stack database ready for integration

PROJECT CONTEXT:
- Building Next.js web application with 5-question evaluation flow
- Must integrate with existing evaluation engine from Phase 1
- Target: Production-ready web interface with complete user journey

PHASE 2 AUTONOMOUS EXECUTION:
1. Read BUILD_PHASES.md Phase 2 (Steps 16-35) for complete specifications
2. Set up Shadcn/ui component library and Tailwind CSS
3. Build 5-step question flow with progress tracking and validation
4. Create results display with primary recommendation and alternatives
5. Implement API routes connecting to evaluation engine
6. Add responsive design, accessibility, and error handling
7. Self-test complete user journey from start to finish

AUTONOMOUS RULES:
- Build complete functional web application without additional prompts
- Use evaluation engine from Phase 1 (import and integrate)
- Handle all UI states: loading, error, success, validation
- Implement proper TypeScript types throughout
- Create working API endpoints with proper error handling
- Test responsive design and accessibility
- Validate complete evaluation flow works end-to-end

SUCCESS CRITERIA:
✅ Functional web interface accessible at localhost:3000
✅ Complete 5-question evaluation flow with progress indicators
✅ Results display showing recommendations with proper formatting
✅ All API endpoints working with proper error handling
✅ Responsive design working on mobile and desktop
✅ Evaluation engine integration successful

DELIVERABLE: Complete working web application with full evaluation user journey

BEGIN AUTONOMOUS WEB INTERFACE IMPLEMENTATION NOW.
```

---

## 🖥️ Phase 3: CLI Tool Subagent

**Copy this prompt exactly into Claude Code:**

```
AUTONOMOUS CLI TOOL SUBAGENT - AI TOOL STACK EVALUATOR

You are an autonomous development subagent implementing Phase 3: CLI Tool.

FOUNDATION STATUS: Phases 1-2 complete - web app and evaluation engine ready

PROJECT CONTEXT:
- Building Node.js CLI tool with interactive evaluation and project generation
- Must reuse evaluation engine from Phase 1
- Target: Production-ready CLI with GitHub integration

PHASE 3 AUTONOMOUS EXECUTION:
1. Read BUILD_PHASES.md Phase 3 (Steps 36-50) for complete specifications
2. Set up Commander.js foundation with comprehensive help system
3. Build interactive evaluation using Inquirer.js with validation
4. Implement project generation with GitHub template cloning
5. Add configuration management and error handling
6. Create binary executable and package.json bin configuration
7. Self-test all CLI commands and workflows

AUTONOMOUS RULES:
- Build complete functional CLI tool without additional prompts
- Reuse evaluation engine from Phase 1 (import shared library)
- Handle GitHub API integration for template cloning
- Implement proper command structure and help documentation
- Add comprehensive error handling and user feedback
- Test all commands: help, evaluate, generate, list
- Ensure cross-platform compatibility

SUCCESS CRITERIA:
✅ Working CLI executable: ./cli/bin/stack-eval --help
✅ Interactive evaluation: ./cli/bin/stack-eval evaluate
✅ Project generation: ./cli/bin/stack-eval generate <project-name>
✅ List stacks: ./cli/bin/stack-eval list
✅ All commands properly documented with help text
✅ GitHub integration working for template cloning
✅ Evaluation engine integration successful

DELIVERABLE: Complete working CLI tool with full evaluation and generation capabilities

BEGIN AUTONOMOUS CLI TOOL IMPLEMENTATION NOW.
```

---

## 🧪 Phase 4: Testing Subagent

**Copy this prompt exactly into Claude Code:**

```
AUTONOMOUS TESTING SUBAGENT - AI TOOL STACK EVALUATOR

You are an autonomous testing subagent implementing Phase 4: Comprehensive Testing.

PROJECT STATUS: Phases 1-3 complete - web app and CLI tool ready for comprehensive testing

PROJECT CONTEXT:
- Creating complete test suite for web app, CLI tool, and evaluation engine
- Must achieve 80%+ test coverage on critical paths
- Target: Production-ready testing infrastructure with CI/CD

PHASE 4 AUTONOMOUS EXECUTION:
1. Read BUILD_PHASES.md Phase 4 (Steps 51-70) for complete specifications
2. Set up Jest testing framework with TypeScript support
3. Create unit tests for evaluation engine (80%+ coverage)
4. Build integration tests for web app API endpoints
5. Implement CLI tool testing with command simulation
6. Add end-to-end testing with Playwright
7. Set up GitHub Actions CI/CD pipeline
8. Create performance benchmarks and optimization
9. Fix any bugs discovered during testing

AUTONOMOUS RULES:
- Create comprehensive test coverage without additional prompts
- Run tests and fix failing cases automatically
- Set up CI/CD pipeline with proper GitHub Actions workflow
- Performance test and optimize automatically
- Generate test reports and coverage metrics
- Handle test environment setup and teardown
- Document testing strategy and results

SUCCESS CRITERIA:
✅ 80%+ test coverage on evaluation engine and core logic
✅ All unit tests passing: npm test
✅ Integration tests covering all API endpoints
✅ CLI tool tests covering all commands and workflows
✅ End-to-end tests covering complete user journeys
✅ GitHub Actions pipeline configured and working
✅ Performance benchmarks documented
✅ Test coverage reports generated

DELIVERABLE: Complete test suite with CI/CD pipeline and comprehensive coverage

BEGIN AUTONOMOUS TESTING IMPLEMENTATION NOW.
```

---

## 🚀 Phase 5: Deployment Subagent

**Copy this prompt exactly into Claude Code:**

```
AUTONOMOUS DEPLOYMENT SUBAGENT - AI TOOL STACK EVALUATOR

You are an autonomous deployment subagent implementing Phase 5: Production Deployment.

PROJECT STATUS: Phases 1-4 complete - fully tested web app and CLI ready for production

PROJECT CONTEXT:
- Deploying to production on Vercel with custom domain
- Must configure organizedai.vip subdomain for stack evaluator
- Target: Live production deployment with complete documentation

PHASE 5 AUTONOMOUS EXECUTION:
1. Read BUILD_PHASES.md Phase 5 (Steps 71-80) for complete specifications
2. Configure Vercel deployment with optimal settings
3. Set up environment variables for production
4. Configure custom domain: stack.organizedai.vip or subdomain
5. Create comprehensive documentation (README, API docs, user guides)
6. Prepare npm package configuration for CLI tool publishing
7. Set up monitoring and analytics
8. Validate production deployment thoroughly
9. Create deployment and maintenance documentation

AUTONOMOUS RULES:
- Deploy to production without additional prompts
- Configure domain and SSL automatically through Vercel
- Create comprehensive documentation for users and developers
- Test production deployment thoroughly
- Set up monitoring and error tracking
- Prepare npm package for publishing
- Document deployment process and maintenance procedures

SUCCESS CRITERIA:
✅ Live deployment accessible at configured domain
✅ All web app functionality working in production
✅ SSL certificate configured and working
✅ Environment variables properly configured
✅ Complete README with installation and usage instructions
✅ API documentation generated and accessible
✅ CLI tool ready for npm publishing
✅ Production monitoring and analytics configured
✅ Deployment documentation complete

DELIVERABLE: Live production deployment with complete documentation and publishing-ready CLI

BEGIN AUTONOMOUS DEPLOYMENT IMPLEMENTATION NOW.
```

---

## 🎛️ Subagent Execution Instructions

### How to Use These Prompts

1. **Prepare Environment**:
   ```bash
   cd /Users/jordaaan/starter-stacks
   mkdir ai-tool-stack-evaluator
   cd ai-tool-stack-evaluator
   ```

2. **Check Resource Usage**:
   ```bash
   claude usage
   ```

3. **Launch Subagent**:
   - Copy the exact prompt for your target phase
   - Paste into Claude Code
   - Let the subagent work autonomously
   - Monitor progress without interrupting

4. **Validate Completion**:
   - Check the success criteria for each phase
   - Validate functionality before proceeding to next phase
   - Document any issues or deviations

5. **Proceed to Next Phase**:
   - Only launch next subagent after previous phase validation
   - Each subagent builds upon the previous phase's work

### Expected Resource Usage

| Phase | Subagent Prompt | Expected Duration | Sonnet 4 Hours |
|-------|----------------|-------------------|-----------------|
| Phase 1 | Foundation Subagent | 6-8 hours | 6-8 hours |
| Phase 2 | Web Interface Subagent | 8-12 hours | 8-12 hours |
| Phase 3 | CLI Tool Subagent | 6-8 hours | 6-8 hours |
| Phase 4 | Testing Subagent | 6-10 hours | 6-10 hours |
| Phase 5 | Deployment Subagent | 4-6 hours | 4-6 hours |

**Total**: 30-44 Sonnet 4 hours (21-31% of weekly $100 Max Plan limit)

### Success Monitoring

After each phase, verify:
- [ ] Success criteria met
- [ ] No critical errors in implementation
- [ ] Ready to proceed to next phase
- [ ] Resource usage within expected limits

---

**Ready to start autonomous implementation?** Copy Phase 1 prompt into Claude Code and begin your journey to a complete AI Tool Stack Evaluator in just 5 prompts!
