# Claude Code Best Practices Checklist

*Optimized prompting strategies for StarterStack development with token budget considerations*

## 🎯 Pre-Development Setup Checklist

### Claude Code Master Prompt Template
```bash
# Use this foundation for every Claude Code session
claude --dangerously-skip-permissions

# Context Setting (Use for all sessions)
```
**Role**: You are an expert software architect and full-stack developer specializing in [FRAMEWORK_NAME] development.

**Project Context**: Building [PROJECT_TYPE] using the [STACK_NAME] starter stack with the following constraints:
- Budget: $100 Claude Max plan (optimize token usage)
- Timeline: [SESSION_COUNT] sessions (5-hour focused blocks)
- Complexity: [LEAF_NODE/CORE_ARCHITECTURE] development
- Verification: Manual testing with [SPECIFIC_TESTING_APPROACH]

**Architecture Principles**:
- Focus on leaf nodes (features that nothing depends on)
- Design for verifiability without reading every line of code
- Create clear input/output specifications
- Implement stress tests for critical functionality
- Follow [FRAMEWORK_SPECIFIC] best practices

**Development Heuristics**:
- Simple tasks: Maximum 5 tool calls
- Complex features: Maximum 15 tool calls  
- Stop when requirements are met (don't over-engineer)
- Ask for clarification when requirements are ambiguous
- Prioritize working code over perfect architecture

**Communication Style**:
- Be direct and actionable
- Explain architectural decisions
- Flag potential issues proactively
- Suggest verification approaches
- Provide token-efficient solutions
```

### Session Planning Checklist

#### Before Starting Each Session
- [ ] **Define Clear Outcome**: What specific functionality will be working at the end of this session?
- [ ] **Set Token Budget**: How many Claude Code prompts for this feature (typically 10-50)?
- [ ] **Identify Verification Method**: How will you test without reading all the code?
- [ ] **Prepare Context**: Gather all requirements, examples, and constraints upfront
- [ ] **Choose Development Type**: Vibe coding (leaf nodes) vs. Structured development (core features)

#### Session Types & Token Allocation

**🚀 Rapid Prototyping Session (10-25 prompts)**
- Single feature implementation
- UI components or API endpoints
- Database operations
- Simple integrations

**🏗️ Architecture Session (25-50 prompts)**
- System design and planning
- Database schema design
- API contract definition
- Integration strategy

**🔧 Integration Session (15-35 prompts)**
- Connecting multiple components
- Third-party API integration
- Authentication implementation
- Deployment configuration

**🧪 Testing & Polish Session (10-30 prompts)**
- Test suite creation
- Bug fixes and optimization
- Documentation generation
- Performance improvements

## 📋 Framework-Specific Prompt Enhancements

### Next.js + Vercel (Stack 01)
```bash
# Add to master prompt:
**Framework Context**: 
- App Router with TypeScript
- Vercel AI SDK integration
- Tailwind CSS for styling
- Prisma for database operations

**Specific Guidelines**:
- Use server components by default, client components only when needed
- Implement proper loading and error states
- Follow Vercel AI SDK patterns for streaming responses
- Optimize for Edge Runtime when possible
```

### FastAPI + Streamlit (Stack 02)
```bash
# Add to master prompt:
**Framework Context**:
- FastAPI backend with async/await patterns
- Streamlit frontend for rapid prototyping
- Pydantic models for data validation
- SQLAlchemy for database operations

**Specific Guidelines**:
- Use async functions for I/O operations
- Implement proper error handling with FastAPI HTTPException
- Create reusable Streamlit components
- Follow Python type hints consistently
```

### Astro + Cloudflare (Stack 03)
```bash
# Add to master prompt:
**Framework Context**:
- Astro for static site generation
- Cloudflare Workers for edge functions
- TypeScript throughout
- Tailwind CSS for styling

**Specific Guidelines**:
- Prioritize static generation over SSR
- Use Astro islands for interactive components
- Optimize for Cloudflare's edge environment
- Implement proper caching strategies
```

### Windsurf + Claude (Stack 05)
```bash
# Add to master prompt:
**Framework Context**:
- AI-assisted development environment
- Flexible tech stack (specify during session)
- Focus on learning and best practices
- Architecture guidance integration

**Specific Guidelines**:
- Explain architectural decisions
- Suggest alternative approaches
- Generate comprehensive documentation
- Provide learning resources and examples
```

### Lovable + Supabase (Stack 06)
```bash
# Add to master prompt:
**Framework Context**:
- Natural language to code generation
- Supabase backend with real-time features
- React with TypeScript frontend
- Built-in authentication and database

**Specific Guidelines**:
- Use Supabase RLS policies for security
- Implement real-time subscriptions where appropriate
- Follow React best practices for state management
- Create responsive, accessible components
```

## 🎨 Development Type Checklists

### 🚀 Vibe Coding Checklist (Leaf Nodes)
*For rapid feature development where tech debt is acceptable*

#### Pre-Session (5-10 minutes)
- [ ] **Identify Leaf Node**: Confirm nothing else depends on this feature
- [ ] **Set Constraints**: Define "good enough" criteria
- [ ] **Plan Verification**: How will you know it works without code review?
- [ ] **Gather Context**: Examples, requirements, similar features

#### During Development
- [ ] **Focus on Functionality**: Working code over perfect architecture
- [ ] **Create Verification Points**: Test cases, example inputs/outputs
- [ ] **Document Assumptions**: What shortcuts were taken and why
- [ ] **Implement Error Handling**: Basic error cases and user feedback

#### Post-Development Verification
- [ ] **Functional Testing**: Does it meet the requirements?
- [ ] **Error Testing**: How does it handle edge cases?
- [ ] **Integration Testing**: Works with existing system?
- [ ] **User Experience**: Acceptable from user perspective?

### 🏗️ Structured Development Checklist (Core Architecture)
*For foundational components that other features depend on*

#### Pre-Session (15-20 minutes)
- [ ] **Architecture Planning**: Design interfaces and contracts first
- [ ] **Dependency Analysis**: What will depend on this component?
- [ ] **Extensibility Requirements**: How might this need to change?
- [ ] **Integration Points**: How does this connect to other systems?

#### During Development
- [ ] **Interface-First Design**: Define APIs before implementation
- [ ] **Comprehensive Testing**: Unit, integration, and contract tests
- [ ] **Documentation**: Clear examples and usage patterns
- [ ] **Error Handling**: Comprehensive error cases and recovery

#### Post-Development Verification
- [ ] **Contract Testing**: Do interfaces work as specified?
- [ ] **Load Testing**: Can it handle expected usage?
- [ ] **Integration Testing**: Works with dependent components?
- [ ] **Code Review**: Human verification of critical paths

### 🤖 Agent Development Checklist
*For building AI-powered features and workflows*

#### Pre-Session Planning
- [ ] **Task Complexity Assessment**: Is this suitable for an agent?
- [ ] **Tool Definition**: What tools does the agent need?
- [ ] **Success Criteria**: How will you measure agent performance?
- [ ] **Error Recovery**: How should the agent handle failures?

#### Agent Prompt Design
- [ ] **Clear Role Definition**: What is the agent's primary function?
- [ ] **Tool Selection Guidelines**: When to use which tools
- [ ] **Budget Heuristics**: Token limits and stopping conditions
- [ ] **Quality Standards**: When to ask for clarification

#### Agent Implementation
- [ ] **Tool Testing**: Verify all tools work independently
- [ ] **Simple Prompt First**: Start basic, add complexity iteratively
- [ ] **Thinking Guidance**: Prompt for planning and reflection
- [ ] **Context Management**: Handle long conversations effectively

#### Agent Evaluation
- [ ] **Small Test Cases**: Start with 3-5 examples
- [ ] **Manual Testing**: Review agent transcripts and decisions
- [ ] **Success Rate**: Track performance over multiple runs
- [ ] **Edge Case Testing**: How does it handle unusual inputs?

## 💰 Token Budget Management

### Session Budget Allocation
```bash
# Track your usage with these estimates:

**Small Feature** (10-25 prompts):
- Planning: 2-3 prompts
- Implementation: 5-15 prompts  
- Testing: 2-5 prompts
- Documentation: 1-2 prompts

**Medium Feature** (25-50 prompts):
- Architecture: 5-10 prompts
- Core Implementation: 15-25 prompts
- Integration: 5-10 prompts
- Testing & Polish: 5-10 prompts

**Large Feature** (50-100 prompts):
- Planning & Design: 10-15 prompts
- Backend Implementation: 20-30 prompts
- Frontend Implementation: 15-25 prompts
- Integration & Testing: 10-15 prompts
- Documentation: 5-10 prompts
```

### Token Optimization Strategies
- [ ] **Use Compaction**: `claude-code compact` when approaching limits
- [ ] **Batch Similar Tasks**: Group related prompts together
- [ ] **Leverage Examples**: Show rather than explain when possible
- [ ] **Reference Previous Work**: "Similar to the component we built earlier"
- [ ] **External Files**: Store context in files rather than conversation

### Budget Tracking Template
```markdown
## Session Token Usage

**Session Goal**: [Specific outcome]
**Estimated Prompts**: [10-50]
**Actual Usage**: [Track as you go]

### Prompt Log:
1. [Prompt description] - [Result quality 1-5]
2. [Prompt description] - [Result quality 1-5]
...

### Session Outcome:
- [ ] Goal Achieved
- [ ] Under Budget  
- [ ] Quality Acceptable
- [ ] Next Session Planned
```

## 🧪 Verification & Testing Checklists

### Manual Testing Checklist
*For verifying functionality without reading all code*

#### Functional Verification
- [ ] **Happy Path**: Primary use case works as expected
- [ ] **Edge Cases**: Boundary conditions handled properly
- [ ] **Error Cases**: Appropriate error messages and handling
- [ ] **Integration**: Works with existing system components

#### User Experience Verification
- [ ] **Usability**: Intuitive for target users
- [ ] **Performance**: Acceptable response times
- [ ] **Accessibility**: Basic accessibility standards met
- [ ] **Responsive**: Works on different screen sizes

#### Technical Verification
- [ ] **Security**: No obvious security vulnerabilities
- [ ] **Data Integrity**: Data stored and retrieved correctly
- [ ] **API Contracts**: External integrations work as expected
- [ ] **Error Logging**: Errors are properly logged for debugging

### Automated Testing Setup
```bash
# Generate test suites with Claude Code:

claude-code generate-tests --type=unit --coverage=80
claude-code generate-tests --type=integration --critical-paths
claude-code generate-tests --type=e2e --user-flows

# Test verification commands:
npm test -- --coverage
npm run test:integration
npm run test:e2e
```

## 📊 Success Metrics & Iteration

### Session Success Criteria
- [ ] **Functionality Delivered**: Planned features work as specified
- [ ] **Budget Adherent**: Stayed within token allocation
- [ ] **Quality Acceptable**: Meets defined quality standards
- [ ] **Verifiable**: Can confirm correctness without code review
- [ ] **Documented**: Clear usage examples and known limitations

### Iteration Planning
```markdown
## Post-Session Retrospective

### What Worked Well:
- [Specific techniques or approaches]

### What Could Improve:
- [Areas for optimization]

### Next Session Plan:
- Goal: [Specific outcome]
- Budget: [Estimated prompts]
- Approach: [Vibe coding/Structured/Agent]
- Verification: [Testing strategy]
```

### Quality Gates
**Before Moving to Next Feature:**
- [ ] Current feature is functionally complete
- [ ] Manual testing passed
- [ ] Performance is acceptable
- [ ] Error handling is adequate
- [ ] Documentation exists for future reference

## 🎯 Framework-Specific Quick Reference

### Choose Your Approach:

**For Rapid Prototyping** (Stacks 6, 7, 8):
- Use vibe coding checklist
- Focus on UI/UX and core functionality
- Minimal backend complexity
- Quick user validation

**For Production Applications** (Stacks 1, 2, 3):
- Use structured development checklist
- Plan architecture carefully
- Implement comprehensive testing
- Focus on scalability and maintainability

**For AI-Enhanced Development** (Stacks 5, 9, 10):
- Combine structured and agent approaches
- Leverage AI for code generation and review
- Focus on learning and best practices
- Document AI-assisted patterns

**For Automation & Integration** (Stacks 4, 8):
- Use agent development checklist
- Focus on workflow automation
- Implement robust error handling
- Plan for scaling and monitoring

---

*This checklist should be customized for each specific starter stack while maintaining the core principles of efficient Claude Code usage and token budget management.*
