# Claude Code Configuration

## Project Overview

**AI Tool Stack Evaluator** - A dual-interface system (Web + CLI) that helps developers choose the optimal tech stack for building AI tools from 10 curated options.

**Repository**: https://github.com/Organized-AI/starter-stacks
**Method**: BMAD (Breakthrough Method for Agile AI-Driven Development)
**Architecture**: Shared evaluation engine, Next.js web interface, Node.js CLI tool

## Development Context

### Current Phase
- **Sprint 1**: Foundation & Core Engine (Days 1-14)
- **Focus**: Building evaluation engine and stack database
- **Next**: Web interface MVP, then CLI tool

### Key Files & Structure
```
├── BMAD_IMPLEMENTATION_PLAN.md    # Complete development roadmap
├── ai/
│   ├── templates/                 # BMAD story and document templates
│   └── stories/                   # Development stories (created as we build)
├── .bmad-core/                    # BMAD methodology files
├── .claude/                       # Claude Code slash commands
├── 01-nextjs-vercel/             # Stack template 1
├── 02-fastapi-streamlit/         # Stack template 2
├── ...                           # Templates 3-10
├── evaluator/                     # Main project (to be created)
│   ├── web/                      # Next.js web interface
│   ├── cli/                      # Node.js CLI tool
│   └── shared/                   # Shared evaluation engine
└── README.md                     # Project overview
```

### Tech Stack
- **Web**: Next.js 14, TypeScript, Tailwind CSS, Vercel deployment
- **CLI**: Node.js, Commander.js, Inquirer.js, npm distribution
- **Shared**: TypeScript evaluation engine, GitHub API integration
- **Testing**: Jest, Playwright, React Testing Library

## BMAD Workflow

### Development Process
1. **Stories**: Each feature is a story in `/ai/stories/story-{epic}.{story}.md`
2. **Templates**: Use templates in `/ai/templates/` for consistency
3. **Status Tracking**: Stories move through Draft → In Progress → Complete
4. **Testing**: TDD approach with comprehensive test coverage
5. **Commits**: Commit after each completed story

### Current Epic & Stories
**Epic 1**: Foundation & Core Engine
- **Story 1.1**: Core Evaluation Logic (5 days) - IN PROGRESS
- **Story 1.2**: Stack Database (3 days) - DRAFT

## Custom Commands Available

Use these slash commands for efficient development:

- `/bmad-story` - Create a new BMAD story from template
- `/bmad-status` - Update story status and progress
- `/eval-engine` - Work on evaluation engine components
- `/stack-data` - Manage stack database and metadata
- `/web-ui` - Develop web interface components
- `/cli-tool` - Build CLI tool features
- `/github-integration` - Work on template cloning/generation
- `/test-suite` - Add tests for current component
- `/deploy-check` - Verify deployment readiness

## Key Principles

### Code Quality
- **TypeScript**: Strict mode, comprehensive type safety
- **Testing**: 90%+ coverage, TDD approach
- **Documentation**: JSDoc for all public APIs
- **Performance**: <2s load times, efficient algorithms

### BMAD Best Practices
- Work on one story at a time
- Update story status before coding
- Commit after story completion
- Reference PRD and Architecture docs
- Follow test-driven development

### Rate Limit Optimization
- Use custom slash commands for common tasks
- Reference this CLAUDE.md for project context
- Follow established patterns and templates
- Focus on incremental, well-tested features

## Current Priorities

1. **Immediate**: Complete Story 1.1 (Core Evaluation Logic)
2. **Next**: Story 1.2 (Stack Database) 
3. **Week 2**: Begin Epic 2 (Web Interface MVP)
4. **Week 3**: Start Epic 3 (CLI Tool)

## Quick Reference

### Evaluation Engine Core Interface
```typescript
interface StackEvaluator {
  evaluate(answers: UserAnswers): EvaluationResult
  getStackDetails(stackId: string): StackDetails
  compareStacks(stackIds: string[]): ComparisonMatrix
}
```

### User Answers Schema
```typescript
interface UserAnswers {
  background: 'non-technical' | 'beginner' | 'experienced' | 'ai-engineer'
  timeline: 'hours' | 'days' | 'weeks'
  projectType: 'chat' | 'data-analysis' | 'content-generation' | 'workflows'
  teamSize: 'solo' | 'small' | 'large'
  designNeeds: 'minimal' | 'good' | 'pixel-perfect'
}
```

### Stack IDs
1. `nextjs-vercel` - Next.js + Vercel AI SDK
2. `fastapi-streamlit` - FastAPI + Streamlit  
3. `astro-cloudflare` - Astro + Cloudflare Workers
4. `replit-gumloop` - Replit + Gumloop
5. `windsurf-claude` - Windsurf + Claude Code
6. `lovable-supabase` - Lovable + Supabase
7. `v0-stackblitz` - v0.dev + StackBlitz + Netlify
8. `zapier-bubble` - Zapier + Bubble + OpenAI
9. `glitch-claude` - Glitch + Claude Artifacts + Railway
10. `cursor-copilot` - Cursor + GitHub Copilot + Vercel

This configuration enables efficient, context-aware development with minimal rate limit usage.
