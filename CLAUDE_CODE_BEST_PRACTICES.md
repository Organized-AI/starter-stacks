# Claude Code Phase-Based Agent Development

*Phase-driven agent development strategies for StarterStack development with token budget optimization*

## 🎯 Phase-Based Development Framework

Each StarterStack uses a **Master Orchestration Agent** that coordinates development through 4 structured phases:

### 📋 Universal Phase Structure
1. **Phase 1: Planning & Architecture** (15-25% of token budget)
2. **Phase 2: Core Implementation** (50-65% of token budget)  
3. **Phase 3: Integration & Testing** (12-20% of token budget)
4. **Phase 4: Deployment & Optimization** (8-15% of token budget)

### 🤖 Agent Architecture Per Phase
**6 Specialized Sub-Agents** coordinate across all phases:

1. **🚀 Development Workflow Agent** - Feature implementation and architecture
2. **🧪 Testing & Verification Agent** - Quality assurance and validation  
3. **💰 Token Budget Agent** - Resource optimization and phase planning
4. **🎯 Pattern & Solution Agent** - Reusable components and best practices
5. **🚀 Deployment Agent** - Production deployment and infrastructure
6. **📊 Success Metrics Agent** - Performance monitoring and optimization

## 🤖 Master Agent Prompt Template

### Universal Master Orchestration Agent Setup
```bash
# Use this foundation for every Claude Code session

**Role**: You are the Master Orchestration Agent for [FRAMEWORK_NAME] development, specializing in [STACK_SPECIFIC_FOCUS]. You coordinate 6 specialized sub-agents through structured development phases optimized for [STACK_PRIORITIES].

**Framework Context**: 
[STACK_SPECIFIC_TECHNOLOGIES_AND_TOOLS]

**Phase-Based Development**: You manage development through 4 structured phases:
- **Phase 1: [Phase 1 Name]** ([15-25]% of token budget) - [Phase 1 Focus]
- **Phase 2: [Phase 2 Name]** ([50-65]% of token budget) - [Phase 2 Focus]
- **Phase 3: [Phase 3 Name]** ([12-20]% of token budget) - [Phase 3 Focus]
- **Phase 4: [Phase 4 Name]** ([8-15]% of token budget) - [Phase 4 Focus]

**Agent Architecture**: You coordinate 6 specialized sub-agents across all phases:
1. **Development Workflow Agent** - [STACK_SPECIFIC_DEVELOPMENT_FOCUS]
2. **Testing & Verification Agent** - [STACK_SPECIFIC_TESTING_APPROACH]
3. **Token Budget Agent** - [STACK_SPECIFIC_RESOURCE_OPTIMIZATION]
4. **Pattern & Solution Agent** - [STACK_SPECIFIC_PATTERNS_AND_TEMPLATES]
5. **Deployment Agent** - [STACK_SPECIFIC_DEPLOYMENT_STRATEGY]
6. **Success Metrics Agent** - [STACK_SPECIFIC_SUCCESS_CRITERIA]

**Token Budget Context**: 
- $100 Claude Max Plan = ~20M balanced tokens (70% input, 30% output)
- Optimize for session-based development with clear phase boundaries
- Target [STACK_SPECIFIC_TOKEN_RANGE] tokens per focused development session
- Focus on [STACK_SPECIFIC_VALUE_PROPOSITION]
```

## 🚀 Phase-Based Agent Coordination

### Phase Planning and Execution
```bash
# Phase initiation template:
"Master Orchestration Agent: Execute Phase [X] [PHASE_NAME] for [PROJECT_NAME]. Coordinate [RELEVANT_SUB_AGENTS] with token budget: [TOKEN_ALLOCATION] for [PHASE_OBJECTIVES]."

**Phase Success Criteria**:
- [Specific deliverable 1]
- [Specific deliverable 2]  
- [Specific deliverable 3]
- [Quality/performance metric]
- [Handoff preparation for next phase]
```

### Inter-Phase Handoff Protocols
```bash
# Standard phase transition:
"[CURRENT_PHASE_AGENT]: Complete Phase [X] deliverables and prepare handoff documentation for Phase [X+1]. Provide clear context and requirements for [NEXT_PHASE_OBJECTIVES]."

# Quality gate validation:
"Testing & Verification Agent: Validate Phase [X] deliverables meet quality standards before Phase [X+1] initiation. Confirm all success criteria achieved."

# Token budget transition:
"Token Budget Agent: Complete Phase [X] within [TOKEN_ALLOCATION] and prepare optimized budget for Phase [X+1] based on actual usage patterns."
```

## 💰 Token Budget Management by Phase

### Phase-Based Token Allocation Framework

**Token Budget Context**: 
- **$100 Claude Max Plan** = ~20M balanced tokens (70% input, 30% output)
- **Development Sessions**: 25K-200K tokens per focused session
- **Multi-session Projects**: Clear phase boundaries prevent context loss

### Universal Token Distribution Templates

**Small Feature Development (25K-60K tokens total)**
```markdown
**Feature Type**: Single component or simple integration
**Phase Distribution**:
- Phase 1 (Planning): 4K-12K tokens (15-20%)
- Phase 2 (Implementation): 15K-39K tokens (60-65%)
- Phase 3 (Testing): 3K-7K tokens (12-15%)
- Phase 4 (Deployment): 2K-4K tokens (6-8%)

**Timeline**: 1-2 focused development sessions
**Best For**: UI components, simple integrations, feature enhancements
```

**Medium Feature Development (60K-150K tokens total)**
```markdown
**Feature Type**: Complete user flow with backend integration
**Phase Distribution**:
- Phase 1 (Planning): 12K-30K tokens (18-22%)
- Phase 2 (Implementation): 35K-95K tokens (55-65%)
- Phase 3 (Testing): 8K-22K tokens (13-17%)
- Phase 4 (Deployment): 5K-12K tokens (7-10%)

**Timeline**: 2-4 focused development sessions
**Best For**: User authentication, data management, AI integrations
```

**Large Feature Development (150K-400K tokens total)**
```markdown
**Feature Type**: Complex multi-component system
**Phase Distribution**:
- Phase 1 (Planning): 30K-80K tokens (20-25%)
- Phase 2 (Implementation): 80K-240K tokens (50-60%)
- Phase 3 (Testing): 25K-60K tokens (15-18%)
- Phase 4 (Deployment): 15K-40K tokens (8-12%)

**Timeline**: 4-8 focused development sessions
**Best For**: Multi-user systems, complex workflows, enterprise features
```

### Token Optimization Strategies by Stack Type

**⚡ Rapid Prototyping Stacks** (Lovable, v0, Zapier):
- **Phase 1**: Minimal planning (15% tokens) - Quick architecture decisions
- **Phase 2**: Heavy implementation (65% tokens) - Rapid feature development  
- **Phase 3**: Essential testing (12% tokens) - User validation focus
- **Phase 4**: Quick deployment (8% tokens) - Fast market entry

**⚖️ Balanced Development Stacks** (Windsurf, Cursor, Replit):
- **Phase 1**: Standard planning (20% tokens) - Balanced architecture
- **Phase 2**: Focused implementation (60% tokens) - Quality development
- **Phase 3**: Comprehensive testing (15% tokens) - Learning integration
- **Phase 4**: Optimized deployment (10% tokens) - Performance focus

**🏗️ Production Stacks** (Next.js, FastAPI, Astro):
- **Phase 1**: Detailed planning (25% tokens) - Comprehensive architecture
- **Phase 2**: Careful implementation (50% tokens) - Quality-first development
- **Phase 3**: Extensive testing (18% tokens) - Production readiness
- **Phase 4**: Full deployment (12% tokens) - Scaling and monitoring

## 🧪 Phase-Based Testing Integration

### Testing Agent Distribution Across Phases

**Phase 1 Testing** (Architecture Validation):
- Requirements verification and feasibility assessment
- Architecture review and dependency analysis
- Risk assessment and mitigation planning

**Phase 2 Testing** (Implementation Validation):
- Component testing and integration verification
- Code quality review and performance checks
- Security validation and compliance review

**Phase 3 Testing** (System Validation):
- End-to-end testing and user flow validation
- Performance testing and optimization
- Security audit and production readiness

**Phase 4 Testing** (Production Validation):
- Deployment verification and monitoring setup
- Performance baseline establishment
- User acceptance and feedback integration

## 📊 Success Metrics Across Development Phases

### Phase-Specific Success Metrics

**Phase 1 Success**: Planning Quality and Feasibility
- **Architecture Completeness**: All technical decisions documented
- **Resource Estimation**: Accurate token budget and timeline projections
- **Risk Mitigation**: Identified risks with mitigation strategies
- **Stakeholder Alignment**: Clear requirements and success criteria

**Phase 2 Success**: Implementation Quality and Progress
- **Feature Completeness**: All planned functionality implemented
- **Code Quality**: Consistent patterns and maintainable architecture
- **Integration Success**: Components work together seamlessly
- **Performance Baseline**: Acceptable performance characteristics

**Phase 3 Success**: System Quality and User Readiness
- **Test Coverage**: Comprehensive testing across all scenarios
- **User Experience**: Intuitive and accessible user interactions  
- **Performance Optimization**: Production-ready performance
- **Documentation**: Complete usage and maintenance documentation

**Phase 4 Success**: Production Quality and Business Value
- **Deployment Success**: Stable production deployment
- **Monitoring Active**: Performance and error tracking operational
- **User Adoption**: Successful user onboarding and engagement
- **Business Value**: Measurable improvement in key metrics

## 🎯 Stack-Specific Phase Customization

### Phase Adaptation by Stack Complexity

**Rapid Prototyping Focus**:
```bash
# Phase emphasis for speed-focused stacks:
- Phase 1: "Rapid Planning" - Quick decisions, minimal documentation
- Phase 2: "Accelerated Implementation" - Fast iteration, acceptable debt
- Phase 3: "Quick Validation" - Essential testing, user feedback focus
- Phase 4: "Rapid Deployment" - Fast launch, basic monitoring
```

**Production Application Focus**:
```bash
# Phase emphasis for quality-focused stacks:
- Phase 1: "Comprehensive Planning" - Detailed architecture, risk analysis
- Phase 2: "Quality Implementation" - Best practices, maintainable code
- Phase 3: "Thorough Validation" - Extensive testing, performance optimization
- Phase 4: "Production Deployment" - Full monitoring, scaling preparation
```

**Business Automation Focus**:
```bash
# Phase emphasis for ROI-focused stacks:
- Phase 1: "Business Analysis" - Process mapping, ROI calculation
- Phase 2: "Automation Implementation" - Workflow creation, integration
- Phase 3: "Business Validation" - Process testing, stakeholder approval
- Phase 4: "Production Deployment" - Business monitoring, change management
```

## 🔄 Phase Transition Management

### Session Boundary Optimization
```bash
# Optimal phase boundaries for session management:

**Single-Session Development** (25K-60K tokens):
- Complete 1-2 phases per session with clear handoffs
- Minimal context rebuilding between phases
- Focus on deliverable completion

**Multi-Session Development** (60K+ tokens):
- Phase boundaries aligned with session breaks
- Context handoff documentation between sessions
- Progressive refinement across phases
```

### Context Preservation Strategies
```bash
# Phase context management:
"Token Budget Agent: Prepare phase transition summary including key decisions, implementation details, and next phase requirements. Optimize context transfer to minimize token usage."

# Inter-session handoffs:
"Master Orchestration Agent: Document Phase [X] completion status and prepare Phase [X+1] initiation context for next development session."
```

## 📋 Phase-Based Development Checklists

### Pre-Phase Preparation
- [ ] **Phase Objectives Clear**: Specific deliverables and success criteria defined
- [ ] **Token Budget Allocated**: Realistic token distribution for phase scope
- [ ] **Agent Roles Defined**: Clear responsibilities for each sub-agent
- [ ] **Success Criteria Set**: Measurable outcomes for phase completion
- [ ] **Handoff Plan Ready**: Next phase requirements and context prepared

### During Phase Execution
- [ ] **Progress Tracking**: Regular token usage and deliverable progress monitoring
- [ ] **Quality Gates**: Intermediate quality checks and validation points
- [ ] **Agent Coordination**: Effective communication and handoffs between agents
- [ ] **Scope Management**: Stay within phase boundaries and token budget
- [ ] **Documentation**: Capture decisions and implementations for handoffs

### Post-Phase Validation
- [ ] **Deliverables Complete**: All phase objectives met and validated
- [ ] **Quality Standards**: Testing and verification requirements satisfied
- [ ] **Budget Performance**: Token usage within planned allocation
- [ ] **Handoff Prepared**: Next phase context and requirements documented
- [ ] **Lessons Captured**: Optimization opportunities identified for future phases

---

*This phase-based agent approach provides predictable development cycles with optimized token usage, clear quality gates, and systematic progress toward production-ready features.*
