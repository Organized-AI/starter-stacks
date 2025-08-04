# 🚀 MASTER PROMPT - Copy/Paste at 5PM

Copy and paste this entire prompt into Claude Code when your limit resets:

---

## StarterStacks AI-Powered Build Implementation

I need to transform StarterStacks Step 6 from a basic scaffolding tool into an AI-powered complete codebase generator.

**Current State**: Step 6 creates a basic Next.js scaffold
**Desired State**: Step 6 accepts a project description and generates a complete, production-ready codebase using AI agents

### Implementation Plan Overview

I have prepared the following files in the StarterStacks directory:
- `BUILD_PHASES_ORCHESTRATION.md` - Complete implementation plan
- `IMPLEMENTATION_GUIDE.md` - Step-by-step guide
- `AGENT-ORCHESTRATION/agents/orchestration/prd-analyzer.md` - Sample PRD analyzer agent

### Phase 1: Update Step 6 UI (Start Here)

Please implement the following changes to Step 6:

1. **Update `components/steps/Step6.tsx`**:
   - Add a toggle between "Basic Scaffold" and "AI-Powered Full Build"
   - When AI build is selected, show a project description input
   - Include template buttons for common project types

2. **Create `components/steps/PRDInput.tsx`**:
   - Large textarea for project description
   - Template selector with 4 options (Social, SaaS, AI App, Marketplace)
   - Character count and validation
   - Submit button that triggers the build

3. **Create `components/steps/BuildProgress.tsx`**:
   - Show build phases (Research → Design → Build → Optimize → Complete)
   - Display active AI agents with progress bars
   - Show files being created in real-time
   - Display final stats and PR link when complete

### Phase 2: Backend Orchestration

4. **Create `app/api/orchestrate/route.ts`**:
   - Endpoint that receives project description
   - Triggers PRD analysis
   - Returns orchestration ID for tracking

5. **Create `app/api/webhooks/build-progress/route.ts`**:
   - Receives progress updates from agents
   - Stores in Redis for real-time updates
   - Broadcasts via Server-Sent Events

### Phase 3: Real-time Progress

6. **Create `app/api/build-progress/[id]/route.ts`**:
   - SSE endpoint for live progress
   - Streams updates to the frontend

7. **Create `hooks/useBuildProgress.ts`**:
   - React hook that subscribes to SSE
   - Updates progress state in real-time

### Key Features to Implement:

1. **Project Templates**:
   - Social Network: "Build a social app with profiles, posts, follows, messaging"
   - SaaS Tool: "Project management with teams, tasks, payments"
   - AI Application: "AI assistant with chat, learning, integrations"
   - Marketplace: "Service marketplace with listings, bookings, payments"

2. **Real-time Updates**:
   - Show each agent as it activates (with emoji and name)
   - Progress bars for each agent's work
   - File creation feed showing paths and line counts
   - Git commits as they happen

3. **GitHub Integration**:
   - Build happens in a new branch: `ai-generated-codebase`
   - Commits after each agent completes
   - Creates PR when finished

### Success Criteria:
- User can describe their project in Step 6
- System analyzes and selects appropriate agents
- Progress updates in real-time
- Complete codebase is generated
- PR is created in their GitHub repo

### Start Implementation:

Begin with Phase 1 - updating the Step 6 UI component. Focus on getting the toggle and PRD input working first, then we'll add the orchestration backend.

The goal is to give StarterStacks users the ability to go from idea → complete codebase in one seamless flow!

---

## Additional Context

**Tech Stack**:
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS
- Backend: Next.js API routes
- Real-time: Server-Sent Events (SSE)
- State: React hooks
- Styling: Tailwind CSS (follow existing patterns)

**Existing Code Style**:
- Components in `components/`
- API routes in `app/api/`
- Utilities in `lib/`
- Types in `types/`

Please follow the existing StarterStacks patterns and code style throughout the implementation.

Let's start with updating the Step 6 UI!
