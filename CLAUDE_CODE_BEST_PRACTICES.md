# Claude Code Agent-Based Best Practices

*Optimized agent-driven development strategies for StarterStack development with token budget considerations*

## 🎯 Agent Architecture Overview

Each StarterStack uses a **Master Orchestration Agent** that coordinates 6 specialized sub-agents:

1. **🚀 Development Workflow Agent** - Feature implementation and architecture
2. **🧪 Testing & Verification Agent** - Quality assurance and validation  
3. **💰 Token Budget Agent** - Resource optimization and session planning
4. **🎯 Pattern & Solution Agent** - Reusable components and best practices
5. **🚀 Deployment Agent** - Production deployment and infrastructure
6. **📊 Success Metrics Agent** - Performance monitoring and optimization

## 🤖 Master Agent Prompt Template

### Universal Master Orchestration Agent Setup
```bash
# Use this foundation for every Claude Code session

**Role**: You are the Master Orchestration Agent for [FRAMEWORK_NAME] development, specializing in [STACK_SPECIFIC_FOCUS]. You coordinate 6 specialized sub-agents to deliver production-ready features efficiently.

**Framework Context**: 
[STACK_SPECIFIC_TECHNOLOGIES_AND_TOOLS]

**Agent Architecture**: You manage 6 specialized sub-agents:
1. **Development Workflow Agent** - [STACK_SPECIFIC_DEVELOPMENT_FOCUS]
2. **Testing & Verification Agent** - [STACK_SPECIFIC_TESTING_APPROACH]
3. **Token Budget Agent** - [STACK_SPECIFIC_RESOURCE_OPTIMIZATION]
4. **Pattern & Solution Agent** - [STACK_SPECIFIC_PATTERNS_AND_TEMPLATES]
5. **Deployment Agent** - [STACK_SPECIFIC_DEPLOYMENT_STRATEGY]
6. **Success Metrics Agent** - [STACK_SPECIFIC_SUCCESS_CRITERIA]

**Coordination Principles**:
- Always specify which sub-agent should handle each task
- Maintain clear handoffs between agents
- Optimize token usage across all agent interactions
- Ensure agents work toward unified project goals
- Focus on [STACK_SPECIFIC_PRIORITIES]
```

## 🚀 Agent Coordination Strategies

### Session Planning with Agent Distribution
```bash
# Before starting each session:
"Master Orchestration Agent: Plan development session for [FEATURE_NAME]. Analyze requirements and create optimal agent coordination strategy with token budget allocation."

**Session Planning Questions**:
- Which primary agent should lead this feature?
- What sub-agents will be needed for this task?
- How should token budget be distributed across agents?
- What are the key handoff points between agents?
- What verification methods will confirm success?
```

### Agent Handoff Protocols
```bash
# Standard handoff pattern:
"[CURRENT_AGENT]: Complete [CURRENT_TASK] and prepare handoff to [NEXT_AGENT]. Provide clear context and requirements for [NEXT_TASK]."

# Coordination check:
"Master Orchestration Agent: Review handoff from [AGENT_A] to [AGENT_B]. Ensure all requirements are met and context is properly transferred."

# Quality gate:
"Testing & Verification Agent: Validate output from [PREVIOUS_AGENT] before proceeding to [NEXT_PHASE]. Confirm quality standards are met."
```

## 💰 Token Budget Management Across Agents

### Agent-Specific Token Allocation

**Development-Heavy Features**:
- Development Workflow Agent: 60-70%
- Testing & Verification Agent: 15-20%
- Other Agents: 15-20%

**Architecture-Heavy Features**:
- Pattern & Solution Agent: 40-50%
- Development Workflow Agent: 30-40%
- Testing & Verification Agent: 10-20%

**Deployment-Heavy Features**:
- Deployment Agent: 50-60%
- Testing & Verification Agent: 20-25%
- Development Workflow Agent: 15-25%

### Budget Optimization Strategies
```bash
# Efficient agent coordination:
"Token Budget Agent: Optimize resource allocation for [FEATURE_TYPE]. Identify which agents can work in parallel vs. sequence to minimize total token usage."

# Emergency budget management:
"Master Orchestration Agent: Session approaching token limit. Prioritize critical tasks and defer non-essential work to next session. Maintain quality standards."

# Cross-session continuity:
"Token Budget Agent: Plan multi-session feature development with clear session boundaries and minimal context rebuilding between sessions."
```

## 🎨 Development Type Classifications

### 🚀 Vibe Coding with Agents (Leaf Nodes)
*For rapid feature development where tech debt is acceptable*

**Primary Agent**: Development Workflow Agent
**Support Agents**: Testing & Verification Agent (minimal), Token Budget Agent
**Approach**: Fast iteration with acceptable quality trade-offs

```bash
# Vibe coding coordination:
"Development Workflow Agent: Rapidly implement [LEAF_NODE_FEATURE] with focus on functionality over perfect architecture. Use appropriate sub-agents for quick iterations."
```

### 🏗️ Structured Development with Agents (Core Architecture)
*For foundational components that other features depend on*

**Primary Agent**: Pattern & Solution Agent + Development Workflow Agent
**Support Agents**: All agents involved with comprehensive planning
**Approach**: Architecture-first with extensive testing and documentation

```bash
# Structured development coordination:
"Master Orchestration Agent: Plan structured development of [CORE_FEATURE]. Coordinate Pattern & Solution Agent for architecture, then Development Workflow Agent for implementation."
```

### 🤖 Agent-Enhanced Development (AI Features)
*For AI-powered features requiring specialized handling*

**Primary Agent**: Development Workflow Agent (AI-specialized sub-agents)
**Support Agents**: Testing & Verification Agent (AI quality focus), Success Metrics Agent
**Approach**: AI-specific patterns with quality assurance and performance monitoring

```bash
# AI feature coordination:
"Development Workflow Agent: Implement AI-powered [FEATURE_NAME] with specialized AI sub-agents. Coordinate with Testing Agent for AI quality assurance."
```

## 🧪 Agent-Based Testing Strategies

### Multi-Agent Testing Coordination
```bash
# Comprehensive testing approach:
"Testing & Verification Agent: Coordinate comprehensive testing of [FEATURE_NAME] using all relevant sub-agents. Ensure quality standards are met before deployment."

# Parallel testing:
"Master Orchestration Agent: Run parallel testing with Code Quality, Performance, and Security sub-agents for [COMPLEX_FEATURE]. Optimize for speed and thoroughness."

# Testing handoffs:
"Testing & Verification Agent: Complete testing of [COMPONENT] and provide clear pass/fail status to Development Workflow Agent for any necessary iterations."
```

### Quality Gates Between Agents
- **Development → Testing**: Functional completeness check
- **Testing → Deployment**: Quality and security validation
- **Deployment → Success Metrics**: Performance and reliability confirmation
- **Any Agent → Token Budget**: Resource usage optimization check

## 📊 Success Metrics Across Agent Architecture

### Agent Performance Metrics
```bash
# Agent efficiency tracking:
"Success Metrics Agent: Track efficiency metrics for each sub-agent including task completion time, quality scores, and token usage optimization."

# Cross-agent coordination metrics:
"Master Orchestration Agent: Measure handoff efficiency between agents and identify optimization opportunities for future sessions."

# Overall system performance:
"Success Metrics Agent: Evaluate overall development velocity and quality when using agent-based approach vs. traditional single-agent development."
```

### Quality Assurance Metrics
- **Agent Coordination**: Successful handoffs without information loss
- **Token Efficiency**: Optimal token usage across all agents
- **Feature Quality**: Consistent quality regardless of primary agent
- **Development Velocity**: Faster delivery through specialized agents

## 🎯 Stack-Specific Agent Customization

### Rapid Prototyping Stacks (Lovable, v0, Zapier)
**Focus**: Speed and iteration
**Agent Emphasis**: Development Workflow Agent (70%), minimal Testing
**Token Distribution**: Front-loaded development, lightweight verification

### Production Stacks (Next.js, FastAPI, Astro)
**Focus**: Scalability and maintainability
**Agent Emphasis**: Balanced across all agents
**Token Distribution**: Even distribution with emphasis on testing and patterns

### AI-Enhanced Stacks (Windsurf, Cursor, Glitch)
**Focus**: Learning and best practices
**Agent Emphasis**: Pattern & Solution Agent + Development Workflow Agent
**Token Distribution**: Heavy on documentation and explanation

## 🔄 Agent Iteration and Improvement

### Continuous Agent Optimization
```bash
# Post-session agent review:
"Master Orchestration Agent: Review session performance for each sub-agent. Identify optimization opportunities and update agent coordination strategies."

# Agent specialization evolution:
"Pattern & Solution Agent: Update agent templates and coordination patterns based on successful development sessions and identified improvements."

# Cross-stack learning:
"Success Metrics Agent: Analyze agent performance across different stacks and apply learnings to improve coordination strategies."
```

### Agent Template Updates
- **Weekly**: Review and update agent coordination patterns
- **Monthly**: Analyze cross-stack performance and optimize templates
- **Quarterly**: Major agent architecture improvements based on results

## 📋 Agent Coordination Checklists

### Before Each Session
- [ ] **Define Primary Agent**: Which agent leads this session?
- [ ] **Plan Agent Sequence**: What's the handoff order?
- [ ] **Set Quality Gates**: How do we verify each handoff?
- [ ] **Allocate Token Budget**: How are tokens distributed across agents?
- [ ] **Prepare Context**: What information does each agent need?

### During Development
- [ ] **Monitor Handoffs**: Are agents communicating effectively?
- [ ] **Track Token Usage**: Are we staying within budget per agent?
- [ ] **Validate Quality**: Is each agent meeting standards?
- [ ] **Coordinate Priorities**: Are agents working toward unified goals?
- [ ] **Document Decisions**: Are architectural decisions being captured?

### After Session
- [ ] **Review Agent Performance**: How did each agent perform?
- [ ] **Document Learnings**: What patterns worked well?
- [ ] **Plan Next Session**: How do we optimize next coordination?
- [ ] **Update Templates**: What improvements can be made?
- [ ] **Measure Success**: Did the agent approach deliver better results?

## 🚀 Implementation Roadmap

### Phase 1: Agent Template Creation (Completed)
- [x] Define 6 core agent types
- [x] Create master orchestration patterns
- [x] Build 3 example stack implementations

### Phase 2: All Stack Implementation
- [ ] Create agent templates for remaining 7 stacks
- [ ] Customize agent coordination for each framework
- [ ] Test and optimize token budgets

### Phase 3: Advanced Agent Features
- [ ] Cross-agent learning and optimization
- [ ] Automatic agent selection based on task type
- [ ] Performance analytics and improvement suggestions

---

*This agent-based approach transforms Claude Code from a single assistant into a coordinated team of specialists, dramatically improving both development quality and efficiency.*
