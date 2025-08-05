# Zapier + Bubble + OpenAI - Claude Code Checklist

*Specialized prompting strategies for no-code automation and AI workflow development*

## 🎯 Stack-Specific Master Prompt

```bash
claude --dangerously-skip-permissions

**Role**: You are an expert in no-code automation using Zapier for workflows, Bubble for web applications, and OpenAI for AI capabilities, focusing on creating sophisticated automations without traditional coding.

**Framework Context**: 
- Zapier for workflow automation and API integrations
- Bubble for visual web application development
- OpenAI API for AI processing and generation
- No-code approach with visual interfaces
- Integration-first architecture

**Architecture Principles**:
- Design workflows before implementing automations
- Use Zapier's built-in apps before custom webhooks
- Optimize Bubble workflows for performance
- Implement proper error handling in all automations
- Design for scalability with usage-based triggers

**Development Heuristics**:
- Workflow design: Maximum 10 tool calls
- Bubble app structure: Maximum 15 tool calls
- AI integration setup: Maximum 12 tool calls
- Testing automation: Maximum 8 tool calls
- Focus on user flow over technical complexity
- Leverage existing integrations before building custom ones
```

## 🚀 Development Workflows

### Workflow Automation (Vibe Coding - Leaf Nodes)
*Token Budget: 8-15 prompts*

#### Pre-Session Checklist
- [ ] **Trigger Definition**: What event starts the automation?
- [ ] **Data Flow**: What data moves between which systems?
- [ ] **Error Scenarios**: What could go wrong and how to handle it?
- [ ] **Rate Limits**: API limits and usage considerations

#### Implementation Checklist
- [ ] **Zapier Trigger**: Configure the starting event
- [ ] **Data Transformation**: Format data between systems
- [ ] **AI Processing**: OpenAI API integration
- [ ] **Output Actions**: Final destination and formatting
- [ ] **Error Handling**: Failed step recovery

#### Verification Checklist
- [ ] **End-to-End Testing**: Full workflow execution
- [ ] **Error Recovery**: Handles failures gracefully
- [ ] **Data Accuracy**: Correct information passed through
- [ ] **Performance**: Workflow completes in reasonable time

### Bubble App Development (Structured Development)
*Token Budget: 20-35 prompts*

#### Pre-Session Checklist
- [ ] **User Interface**: Define pages and navigation
- [ ] **Database Structure**: Plan data types and relationships
- [ ] **User Permissions**: Define access levels and privacy
- [ ] **External Integrations**: APIs and third-party services

#### Implementation Checklist
- [ ] **Database Design**: Create data types and fields
- [ ] **UI Components**: Build responsive interface elements
- [ ] **Workflows**: Configure Bubble's visual workflows
- [ ] **API Integration**: Connect external services
- [ ] **Privacy Rules**: Secure data access

### AI Integration Setup (Structured Development)
*Token Budget: 15-25 prompts*

#### Pre-Session Checklist
- [ ] **AI Use Cases**: Define what AI will do
- [ ] **Input/Output Format**: Data structure for AI processing
- [ ] **API Configuration**: OpenAI settings and models
- [ ] **Usage Monitoring**: Track API costs and limits

#### Implementation Checklist
- [ ] **OpenAI Configuration**: API keys and model selection
- [ ] **Prompt Engineering**: Optimize AI prompts for consistency
- [ ] **Data Processing**: Format inputs for AI consumption
- [ ] **Response Handling**: Process and use AI outputs
- [ ] **Cost Management**: Usage tracking and limits

## 🧪 Testing & Verification

### Automation Testing
```bash
# Test prompts for Claude Code:

"Design a testing strategy for Zapier workflows that includes multiple data scenarios and error conditions"

"Create a comprehensive test plan for Bubble workflows with different user permission levels"

"Test OpenAI integration with various input types and edge cases"
```

### Performance Testing
```bash
# Performance verification prompts:

"Analyze the Bubble app for workflow optimization opportunities"

"Check Zapier automation for potential bottlenecks and rate limit issues"

"Optimize AI prompt usage to reduce token costs while maintaining quality"
```

### Integration Testing
```bash
# Full system testing prompts:

"Create an end-to-end test for the complete user journey from Bubble app to Zapier automation"

"Test the integration between all systems under high usage scenarios"

"Verify data consistency across Bubble, Zapier, and external APIs"
```

## 💰 Token Budget Templates

### Simple Automation (8-15 prompts)
```markdown
**Goal**: Automate email processing with AI sentiment analysis
**Approach**: Vibe coding (leaf node)

**Session Plan**:
1. Zapier email trigger setup (2-3 prompts)
2. OpenAI sentiment analysis integration (3-5 prompts)
3. Response action configuration (2-4 prompts)
4. Testing and refinement (1-3 prompts)
```

### Medium Integration (15-25 prompts)
```markdown
**Goal**: Customer service app with AI-powered responses
**Approach**: Structured development

**Session Plan**:
1. Bubble app structure and database (6-9 prompts)
2. Zapier workflow for incoming requests (4-6 prompts)
3. OpenAI integration for response generation (3-5 prompts)
4. Testing and user flow optimization (2-5 prompts)
```

### Complex System (25-40 prompts)
```markdown
**Goal**: Multi-channel marketing automation with AI personalization
**Approach**: Structured development with multiple integrations

**Session Plan**:
1. Bubble dashboard and data management (8-12 prompts)
2. Zapier multi-trigger workflow setup (8-12 prompts)
3. OpenAI personalization engine (6-10 prompts)
4. Integration testing and optimization (3-6 prompts)
```

## 🎯 Common Patterns & Solutions

### Zapier Workflow Pattern
```yaml
# Request this pattern from Claude Code:
"Design a robust Zapier workflow template that includes:
- Multiple trigger conditions
- Data validation and formatting
- Error handling with notifications
- Conditional logic for different scenarios
- Usage tracking and monitoring"
```

### Bubble Database Pattern
```yaml
# Request this pattern:
"Create a Bubble database structure for a SaaS application that includes:
- User management with roles
- Subscription and billing data
- Activity logging and analytics
- Privacy rules for data security
- Optimized for performance"
```

### AI Processing Pattern
```javascript
// Request this pattern:
"Design an OpenAI integration pattern that includes:
- Prompt template management
- Response validation and parsing
- Error handling and retries
- Cost tracking and optimization
- Quality assurance checks"
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] **API Keys**: All service keys properly configured
- [ ] **Zapier Testing**: All workflows tested in live mode
- [ ] **Bubble Deployment**: App deployed to live version
- [ ] **Usage Limits**: Rate limits and quotas configured

### Deployment Verification
- [ ] **Live Workflows**: All Zapier zaps running correctly
- [ ] **Bubble App**: Production app fully functional
- [ ] **AI Integration**: OpenAI API working in production
- [ ] **Error Notifications**: Alert systems configured

### Post-Deployment
- [ ] **Monitoring**: Usage dashboards and alerts setup
- [ ] **Cost Tracking**: API usage and billing monitoring
- [ ] **User Feedback**: Collection and analysis system
- [ ] **Scaling**: Auto-scaling rules configured

## 📊 Success Metrics

### Development Velocity
- **Workflow Creation**: Basic automations ready in under 1 hour
- **App Development**: Functional Bubble app in 2-4 hours
- **AI Integration**: OpenAI features working in under 2 hours

### Operational Efficiency
- **Automation Success Rate**: 95%+ successful workflow executions
- **Response Time**: AI processing under 5 seconds
- **Error Recovery**: Automatic retry and notification systems
- **Cost Efficiency**: AI usage optimized for budget constraints

### User Experience
- **Interface Usability**: Intuitive Bubble app navigation
- **Workflow Reliability**: Consistent automation performance
- **AI Quality**: Relevant and accurate AI responses
- **Support**: Clear error messages and user guidance

## 🔧 No-Code Specific Tips

### Zapier Best Practices
```bash
# Effective Zapier prompts:
"Design a multi-step workflow that handles e-commerce order processing with inventory management and customer notifications"

"Create an error handling strategy for a workflow that processes user-uploaded files"

"Build a conditional workflow that routes different types of customer inquiries to appropriate team members"
```

### Bubble Development
```bash
# Effective Bubble prompts:
"Design a responsive dashboard interface for a project management app with drag-and-drop functionality"

"Create a user authentication system with role-based permissions and profile management"

"Build a data visualization component that displays real-time analytics from external APIs"
```

### OpenAI Integration
```bash
# Effective AI prompts:
"Design a prompt template system that maintains consistency across different types of content generation"

"Create a quality control system that validates AI responses before sending them to users"

"Build a cost optimization strategy that uses different models based on task complexity"
```

## 🎨 Advanced Patterns

### Multi-System Integration
```bash
# Complex integration patterns:
"Design a workflow that synchronizes data between CRM, email marketing, and customer support systems"

"Create a feedback loop system where user interactions in Bubble trigger improvements in Zapier workflows"

"Build a reporting system that aggregates data from multiple sources into a unified dashboard"
```

---

*Perfect for non-technical founders who want to build sophisticated AI-powered automations without coding!* 🚀
