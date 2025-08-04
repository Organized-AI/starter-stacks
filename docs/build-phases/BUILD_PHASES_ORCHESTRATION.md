# BUILD_PHASES_ORCHESTRATION.md - AI-Powered Full Stack Development

This document orchestrates the complete transformation of StarterStacks from a scaffolding tool to an AI-powered codebase generator using specialized agents.

## 🚀 Overview

Transform Step 6 of StarterStacks into an AI orchestration powerhouse that builds complete codebases based on user descriptions.

## 📁 Project Structure Enhancement

```
starter-stacks/
├── 📋 EXISTING/                    # Current StarterStacks code
├── 🤖 AGENT-ORCHESTRATION/         # NEW orchestration system
│   ├── prd-analyzer.md            # Meta-agent for project analysis
│   ├── master-orchestrator.md     # Coordinates all agents
│   ├── workflow-templates/        # Pre-built workflows
│   └── agents/                    # Agent library
│       ├── engineering/           # Dev agents
│       ├── design/               # UI/UX agents
│       ├── product/              # Product agents
│       └── quality/              # Testing agents
├── 🔄 STEP-6-ENHANCEMENT/          # Step 6 UI changes
│   ├── PRDInput.tsx              # New PRD input component
│   ├── BuildProgress.tsx         # Real-time progress UI
│   └── AgentOrchestrator.ts      # Orchestration logic
└── 📡 WEBHOOK-SYSTEM/              # Real-time updates
    ├── webhook-handler.ts        # Progress webhooks
    ├── sse-provider.ts          # Server-sent events
    └── progress-store.ts        # Progress state management
```

## 🎯 Phase 1: PRD Analyzer Integration (2-3 hours)

**Agents**: frontend-developer + integration-engineer
**Goal**: Add PRD input capability to Step 6

### 1A. Update Step 6 UI Component
**File**: `components/steps/Step6.tsx`

```typescript
import { useState } from 'react';
import { PRDInput } from './PRDInput';
import { BuildProgress } from './BuildProgress';
import { startAIBuild } from '@/lib/orchestration';

export function Step6({ repoUrl, repoName }) {
  const [buildMethod, setBuildMethod] = useState<'basic' | 'ai'>('ai');
  const [isBuilding, setIsBuilding] = useState(false);
  const [orchestrationId, setOrchestrationId] = useState<string>();
  
  const handleAIBuild = async (projectDescription: string) => {
    setIsBuilding(true);
    const { id } = await startAIBuild({
      repoUrl,
      repoName,
      projectDescription,
      userId: user.id
    });
    setOrchestrationId(id);
  };

  return (
    <div className="step-6-container">
      <h2>Step 6: Build Your Codebase</h2>
      
      <div className="build-method-toggle">
        <button 
          className={buildMethod === 'basic' ? 'active' : ''}
          onClick={() => setBuildMethod('basic')}
        >
          Basic Scaffold
        </button>
        <button 
          className={buildMethod === 'ai' ? 'active' : ''}
          onClick={() => setBuildMethod('ai')}
        >
          🤖 AI-Powered Full Build
        </button>
      </div>

      {buildMethod === 'ai' && !isBuilding && (
        <PRDInput onSubmit={handleAIBuild} />
      )}
      
      {isBuilding && orchestrationId && (
        <BuildProgress orchestrationId={orchestrationId} />
      )}
    </div>
  );
}
```

### 1B. Create PRD Input Component
**File**: `components/steps/PRDInput.tsx`

```typescript
export function PRDInput({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  
  const templates = {
    social: "I want to build a social networking app where users can:\n- Create profiles with photos\n- Post updates with media\n- Follow other users\n- Like and comment\n- Send messages\n\nTech: Next.js, PostgreSQL, Redis",
    
    saas: "I want to build a SaaS tool for project management with:\n- User authentication and teams\n- Kanban boards\n- Time tracking\n- File attachments\n- Stripe subscriptions\n\nTech: React, Node.js, PostgreSQL",
    
    ai: "I want to build an AI writing assistant that:\n- Helps write better emails\n- Learns writing style\n- Integrates with Gmail\n- Tracks statistics\n\nTech: Next.js, Python FastAPI, OpenAI",
    
    marketplace: "I want to build a marketplace for freelancers with:\n- Service listings\n- Booking system\n- Secure payments\n- Reviews and ratings\n- Chat system\n\nTech: React Native, Node.js, Stripe"
  };

  return (
    <div className="prd-input-container">
      <h3>Describe Your Project</h3>
      <p>Tell us what you want to build and our AI agents will create the entire codebase!</p>
      
      <div className="template-selector">
        <label>Quick Start Templates:</label>
        <select onChange={(e) => setDescription(templates[e.target.value])}>
          <option value="">Choose a template...</option>
          <option value="social">Social Network</option>
          <option value="saas">SaaS Tool</option>
          <option value="ai">AI Application</option>
          <option value="marketplace">Marketplace</option>
        </select>
      </div>
      
      <textarea
        className="prd-textarea"
        placeholder="Describe your project in detail..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={12}
      />
      
      <button 
        className="start-build-btn"
        onClick={() => onSubmit(description)}
        disabled={!description.trim()}
      >
        🚀 Start AI Build
      </button>
    </div>
  );
}
```

---

## 🏗️ Phase 2: Agent Orchestration System (3-4 hours)

**Agents**: backend-architect + devops-engineer
**Goal**: Set up the orchestration infrastructure

### 2A. PRD Analyzer Agent
**File**: `AGENT-ORCHESTRATION/agents/prd-analyzer.md`

```markdown
---
name: prd-analyzer
description: Analyzes project requirements and builds agent teams
tools: file, terminal, code, git
priority: highest
---

# PRD ANALYZER - STARTERSTACKS EDITION

I analyze project descriptions and orchestrate complete codebase generation in GitHub repos.

## GITHUB INTEGRATION WORKFLOW

1. **Clone Repository**
   \`\`\`bash
   cd /tmp/builds/${orchestrationId}
   git clone ${repoUrl} .
   git checkout -b ai-generated-codebase
   \`\`\`

2. **Analyze Project Requirements**
   - Detect project type
   - Extract features
   - Identify tech stack
   - Assess complexity

3. **Build Agent Workflow**
   Based on analysis, create workflow.yaml

## PROJECT TYPE DETECTION

### Indicators for Web App
- Keywords: "website", "web app", "dashboard", "portal"
- Features: user accounts, forms, admin panel
- Suggested agents: ui-designer, frontend-dev, backend-architect

### Indicators for Mobile App  
- Keywords: "iOS", "Android", "mobile", "app"
- Features: push notifications, offline, camera
- Suggested agents: mobile-ui-designer, mobile-app-builder

### Indicators for AI/ML App
- Keywords: "AI", "machine learning", "LLM", "chatbot"
- Features: predictions, recommendations, NLP
- Suggested agents: ai-engineer, prompt-engineer

## OUTPUT WORKFLOW

Location: `.agent-orchestration/workflow.yaml`

\`\`\`yaml
project: ${projectName}
type: ${detectedType}
repository: ${repoUrl}
branch: ai-generated-codebase

phases:
  research:
    duration: 30m
    agents:
      - ux-researcher
      - market-analyzer
      
  design:
    duration: 45m
    agents:
      - ui-designer
      - design-system-creator
      
  implementation:
    duration: 2h
    parallel:
      - frontend-developer
      - backend-architect
      - test-writer
      
  optimization:
    duration: 30m
    agents:
      - performance-optimizer
      - security-auditor
\`\`\`
```

### 2B. Master Orchestrator
**File**: `AGENT-ORCHESTRATION/agents/master-orchestrator.md`

```markdown
---
name: master-orchestrator
description: Coordinates all agents for StarterStacks builds
tools: file, terminal, code, git
---

# MASTER ORCHESTRATOR - STARTERSTACKS

I coordinate the entire AI build process based on workflow.yaml.

## EXECUTION FLOW

1. **Read Workflow**
   \`\`\`javascript
   const workflow = yaml.parse(fs.readFileSync('workflow.yaml'));
   const phases = workflow.phases;
   \`\`\`

2. **Execute Phases**
   For each phase:
   - Launch agents (parallel or sequential)
   - Monitor progress
   - Handle failures
   - Update webhooks

3. **Git Integration**
   After each agent:
   \`\`\`bash
   git add -A
   git commit -m "Agent: ${agentName} - ${task} complete"
   git push origin ai-generated-codebase
   \`\`\`

4. **Create PR**
   When all complete:
   \`\`\`bash
   gh pr create \
     --title "🤖 AI-Generated Complete Codebase" \
     --body "$(cat .agent-orchestration/build-summary.md)"
   \`\`\`

## WEBHOOK UPDATES

Send progress via webhook:
\`\`\`javascript
await fetch(process.env.WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({
    orchestrationId,
    event: 'agent.progress',
    data: { agent, progress, task }
  })
});
\`\`\`
```

---

## 🔄 Phase 3: Real-time Progress System (2-3 hours)

**Agents**: frontend-developer + realtime-engineer
**Goal**: Implement live progress tracking

### 3A. Webhook Handler
**File**: `app/api/webhooks/build-progress/route.ts`

```typescript
import { redis } from '@/lib/redis';

export async function POST(req: Request) {
  const payload = await req.json();
  const { orchestrationId, event, data } = payload;
  
  // Store in Redis for SSE
  await redis.publish(`build:${orchestrationId}`, {
    event,
    data,
    timestamp: Date.now()
  });
  
  // Update database
  await updateBuildProgress(orchestrationId, event, data);
  
  return Response.json({ received: true });
}
```

### 3B. Progress Component
**File**: `components/steps/BuildProgress.tsx`

```typescript
import { useBuildProgress } from '@/hooks/useBuildProgress';

export function BuildProgress({ orchestrationId }) {
  const progress = useBuildProgress(orchestrationId);
  
  return (
    <div className="build-progress">
      {/* Phase Progress */}
      <div className="phases">
        {['Research', 'Design', 'Build', 'Optimize', 'Complete'].map(phase => (
          <div className={`phase ${progress.currentPhase === phase ? 'active' : ''}`}>
            <div className="phase-icon">{getPhaseEmoji(phase)}</div>
            <div className="phase-name">{phase}</div>
          </div>
        ))}
      </div>

      {/* Active Agents */}
      <div className="active-agents">
        <h3>AI Agents at Work</h3>
        {progress.activeAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* File Creation Feed */}
      <div className="file-feed">
        <h3>Files Being Created</h3>
        <FileCreationFeed files={progress.recentFiles} />
      </div>

      {/* Completion */}
      {progress.complete && (
        <div className="completion">
          <h2>🎉 Your Codebase is Ready!</h2>
          <div className="stats">
            <Stat label="Files Created" value={progress.stats.files} />
            <Stat label="Lines of Code" value={progress.stats.loc} />
            <Stat label="Tests Written" value={progress.stats.tests} />
          </div>
          <a href={progress.prUrl} className="view-pr-btn">
            View Pull Request →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## 🎮 Phase 4: Agent Library Setup (2 hours)

**Agents**: rapid-prototyper
**Goal**: Install the agent library from Contains-Studio

### 4A. Core Agent Set
Copy these essential agents:

```
AGENT-ORCHESTRATION/agents/
├── engineering/
│   ├── rapid-prototyper.md
│   ├── frontend-developer.md
│   ├── backend-architect.md
│   ├── mobile-app-builder.md
│   └── ai-engineer.md
├── design/
│   ├── ui-designer.md
│   ├── ux-researcher.md
│   └── whimsy-injector.md
├── product/
│   ├── sprint-prioritizer.md
│   ├── feedback-synthesizer.md
│   └── trend-researcher.md
├── quality/
│   ├── test-writer-fixer.md
│   ├── performance-optimizer.md
│   └── security-auditor.md
└── orchestration/
    ├── prd-analyzer.md
    └── master-orchestrator.md
```

### 4B. Workflow Templates

```yaml
# AGENT-ORCHESTRATION/workflow-templates/web-app.yaml
project: WebApplication
phases:
  research:
    parallel: [ux-researcher, trend-researcher]
  design:
    sequential: [ui-designer, whimsy-injector]
  build:
    parallel: [frontend-developer, backend-architect]
  quality:
    sequential: [test-writer-fixer, performance-optimizer]

# AGENT-ORCHESTRATION/workflow-templates/mobile-app.yaml
project: MobileApplication
phases:
  research:
    parallel: [ux-researcher, market-analyzer]
  design:
    sequential: [mobile-ui-designer, app-store-optimizer]
  build:
    parallel: [mobile-app-builder, backend-architect]
  quality:
    sequential: [mobile-tester, performance-optimizer]
```

---

## 🚀 Phase 5: Integration & Testing (1-2 hours)

**Agents**: test-writer-fixer + integration-tester
**Goal**: Ensure everything works together

### 5A. Integration Tests

```typescript
// tests/orchestration.test.ts
describe('AI Build Orchestration', () => {
  it('should analyze PRD correctly', async () => {
    const prd = "I want to build a social network";
    const analysis = await analyzePRD(prd);
    expect(analysis.type).toBe('web_app');
    expect(analysis.agents).toContain('ui-designer');
  });

  it('should create workflow from analysis', async () => {
    const analysis = { type: 'web_app', features: ['auth', 'social'] };
    const workflow = await createWorkflow(analysis);
    expect(workflow.phases).toHaveProperty('research');
  });

  it('should handle webhook updates', async () => {
    const update = { event: 'agent.started', agent: 'ui-designer' };
    await sendWebhook(update);
    expect(progressStore.get()).toContain('ui-designer');
  });
});
```

### 5B. End-to-End Test Flow

1. User enters PRD in Step 6
2. System analyzes and creates workflow
3. Agents execute in order
4. Progress updates in real-time
5. PR created in GitHub
6. User notified of completion

---

## 📋 Master Prompt for Claude Code

Copy and paste this when your limit resets at 5PM:

```
I need to implement AI-powered codebase generation for StarterStacks Step 6. 

The plan is in BUILD_PHASES_ORCHESTRATION.md which includes:

1. **Phase 1**: Update Step 6 UI to accept project descriptions
   - Add toggle between basic/AI build
   - Create PRD input component with templates
   - Add project description textarea

2. **Phase 2**: Set up agent orchestration
   - Create PRD analyzer agent that detects project type
   - Create master orchestrator that coordinates agents
   - Implement GitHub integration for building in repos

3. **Phase 3**: Real-time progress tracking
   - Webhook handler for agent updates
   - Server-sent events for live progress
   - BuildProgress component with animations

4. **Phase 4**: Agent library setup
   - Copy essential agents from Contains-Studio
   - Create workflow templates for common projects
   - Set up agent selection logic

5. **Phase 5**: Testing and integration
   - Integration tests for the flow
   - End-to-end testing

Start with Phase 1 by updating the Step 6 UI component to include the PRD input capability.

The goal is to transform StarterStacks from a scaffolding tool into a complete AI-powered codebase generator where users describe their app and get a full implementation via PR.
```

---

## 🎯 Success Criteria

- [ ] Step 6 has "AI-Powered Build" option
- [ ] Users can describe their project in detail
- [ ] PRD analyzer correctly identifies project types
- [ ] Agents are selected based on project needs
- [ ] Progress updates in real-time
- [ ] Complete codebase is built in GitHub
- [ ] PR is created with all generated code
- [ ] User gets notified when complete

## 🔧 Environment Variables Needed

```env
# Orchestration
ORCHESTRATION_API_URL=https://api.yourdomain.com/orchestrate
WEBHOOK_SECRET=your-webhook-secret
GITHUB_TOKEN=ghp_xxxxx
OPENAI_API_KEY=sk-xxxxx

# Redis for real-time
REDIS_URL=redis://localhost:6379

# Agent endpoints (if using external)
AGENT_RUNNER_URL=https://agents.yourdomain.com
```

This system will revolutionize StarterStacks by turning it into a complete AI-powered development platform!
