# StarterStacks AI Build Implementation Guide

## 🚀 Quick Start for 5PM

When your Claude Code limit resets, follow these steps:

### 1. Copy the Master Prompt

```
I need to implement AI-powered codebase generation for StarterStacks Step 6. 

The plan is in BUILD_PHASES_ORCHESTRATION.md which outlines 5 phases:
1. Update Step 6 UI with PRD input
2. Set up agent orchestration system  
3. Add real-time progress tracking
4. Install agent library
5. Test integration

Please start with Phase 1: Update the Step 6 UI to accept project descriptions.
```

### 2. Key Files to Create/Modify

#### Step 6 UI Enhancement
- `components/steps/Step6.tsx` - Add AI build option
- `components/steps/PRDInput.tsx` - Project description input
- `components/steps/BuildProgress.tsx` - Real-time progress display

#### API Routes
- `app/api/orchestrate/route.ts` - Start orchestration
- `app/api/webhooks/build-progress/route.ts` - Progress updates
- `app/api/build-progress/[id]/route.ts` - SSE endpoint

#### Orchestration Logic  
- `lib/orchestration/prd-analyzer.ts` - Analyze project descriptions
- `lib/orchestration/workflow-builder.ts` - Create agent workflows
- `lib/orchestration/agent-runner.ts` - Execute agents

### 3. Implementation Order

**Hour 1: UI Components**
- Update Step 6 with build method toggle
- Create PRD input with templates
- Add basic progress skeleton

**Hour 2: Backend Setup**
- Create orchestration API endpoint
- Set up webhook handler
- Add SSE for real-time updates

**Hour 3: Agent System**
- Copy PRD analyzer agent
- Copy master orchestrator
- Add workflow templates

**Hour 4: Integration**
- Connect UI to backend
- Test full flow
- Add error handling

### 4. Testing Checklist

- [ ] User can toggle between basic/AI build
- [ ] PRD input accepts descriptions
- [ ] Templates populate correctly
- [ ] API endpoint triggers orchestration
- [ ] Progress updates in real-time
- [ ] Agents execute in correct order
- [ ] GitHub integration works
- [ ] PR is created successfully

## 📝 Code Snippets to Speed Development

### Quick TypeScript Types

```typescript
// types/orchestration.ts
export interface ProjectAnalysis {
  type: 'web_app' | 'mobile_app' | 'ai_app' | 'api';
  features: string[];
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
  };
  complexity: 'simple' | 'medium' | 'complex';
  estimatedAgents: number;
  estimatedHours: number;
}

export interface AgentWorkflow {
  project: string;
  repository: string;
  phases: {
    [phase: string]: {
      duration: string;
      agents: string[] | { parallel?: string[]; sequential?: string[] };
    };
  };
}

export interface BuildProgress {
  orchestrationId: string;
  currentPhase: string;
  activeAgents: Array<{
    id: string;
    name: string;
    emoji: string;
    progress: number;
    currentTask: string;
  }>;
  completedPhases: string[];
  recentFiles: Array<{
    path: string;
    type: string;
    linesOfCode: number;
  }>;
  stats?: {
    files: number;
    loc: number;
    tests: number;
  };
  prUrl?: string;
  complete: boolean;
}
```

### Webhook Handler Template

```typescript
// app/api/webhooks/build-progress/route.ts
import { verifyWebhookSignature } from '@/lib/webhook-security';
import { updateBuildProgress } from '@/lib/progress-store';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-webhook-signature');
  
  if (!verifyWebhookSignature(body, signature!, process.env.WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const payload = JSON.parse(body);
  await updateBuildProgress(payload);
  
  // Publish to Redis for SSE
  await redis.publish(`build:${payload.orchestrationId}`, payload);
  
  return Response.json({ success: true });
}
```

### PRD Templates Object

```typescript
export const PROJECT_TEMPLATES = {
  social: {
    name: "Social Network",
    description: `I want to build a social networking app where users can:
- Create profiles with photos and bio
- Post updates with text, images, and videos
- Follow other users and see their posts
- Like and comment on posts
- Send direct messages
- Get notifications

Tech preferences: Next.js for web, PostgreSQL for database, Redis for caching`,
    emoji: "👥"
  },
  
  saas: {
    name: "SaaS Tool",
    description: `I want to build a project management SaaS tool with:
- User authentication and team workspaces
- Kanban boards for task management
- Time tracking on tasks
- File attachments and comments
- Email notifications
- Stripe integration for subscriptions
- Admin dashboard

Tech preferences: React with TypeScript, Node.js backend, PostgreSQL`,
    emoji: "💼"
  },
  
  ai: {
    name: "AI Application", 
    description: `I want to build an AI writing assistant that:
- Helps users write better emails
- Learns from their writing style
- Suggests improvements and alternatives
- Integrates with Gmail and Outlook
- Tracks writing statistics
- Uses GPT-4 for suggestions

Tech preferences: Next.js frontend, Python FastAPI backend, OpenAI API`,
    emoji: "🤖"
  },
  
  marketplace: {
    name: "Marketplace",
    description: `I want to build a marketplace for freelance services:
- Service provider profiles and portfolios
- Service listings with pricing tiers
- Booking and scheduling system
- Secure payments with escrow
- Reviews and ratings
- Real-time chat between clients and providers
- Admin panel for disputes

Tech preferences: React Native for mobile, Node.js backend, Stripe Connect`,
    emoji: "🛍️"
  }
};
```

## 🎯 Critical Success Factors

1. **Keep Phase 1 Simple** - Just get the UI working first
2. **Mock the Backend Initially** - Use setTimeout to simulate progress
3. **Test with a Simple Project** - Start with "todo app" before complex ones
4. **Use Existing StarterStacks Patterns** - Follow their code style
5. **Incremental Progress** - Get each phase working before the next

## 🐛 Common Issues & Solutions

**Issue**: Webhook not receiving updates
**Solution**: Check CORS settings and webhook URL in env

**Issue**: Progress not updating in UI
**Solution**: Verify SSE connection and Redis pub/sub

**Issue**: Agents not executing
**Solution**: Check agent file paths and permissions

**Issue**: GitHub integration failing  
**Solution**: Verify GITHUB_TOKEN has repo permissions

## 🚦 Go Time!

At 5PM:
1. Open Claude Code in StarterStacks directory
2. Paste the master prompt
3. Follow the phase-by-phase implementation
4. Test each phase before moving on
5. Celebrate when users can generate full codebases! 🎉
