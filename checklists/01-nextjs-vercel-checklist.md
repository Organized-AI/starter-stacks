# Next.js + Vercel AI SDK - Claude Code Checklist

*Specialized prompting strategies for AI-native React development*

## 🎯 Stack-Specific Master Prompt

```bash
claude --dangerously-skip-permissions

**Role**: You are an expert Next.js 14 developer specializing in AI-native applications with the App Router, TypeScript, and Vercel AI SDK.

**Framework Context**: 
- Next.js 14 with App Router and TypeScript
- Vercel AI SDK for streaming AI responses
- Tailwind CSS for styling
- Prisma for database operations
- NextAuth.js for authentication
- Vercel deployment platform

**Architecture Principles**:
- Server Components by default, Client Components only when needed
- Implement proper loading and error states for AI interactions
- Follow Vercel AI SDK patterns for streaming responses
- Optimize for Edge Runtime compatibility
- Use TypeScript strict mode throughout

**Development Heuristics**:
- AI features: Maximum 20 tool calls (streaming complexity)
- UI components: Maximum 10 tool calls
- API routes: Maximum 15 tool calls
- Database operations: Maximum 12 tool calls
- Always implement loading states for AI interactions
- Use React Suspense for async operations
```

## 🚀 Development Workflows

### AI Feature Development (Vibe Coding - Leaf Nodes)
*Token Budget: 15-25 prompts*

#### Pre-Session Checklist
- [ ] **AI Provider Setup**: OpenAI/Anthropic API keys configured
- [ ] **Streaming Requirements**: Define expected response format
- [ ] **UI Components**: Identify needed loading/error states
- [ ] **Model Selection**: Choose appropriate AI model for task

#### Implementation Checklist
- [ ] **API Route Creation**: Server-side AI integration
- [ ] **Streaming Setup**: Implement AI SDK streaming
- [ ] **Client Components**: Chat interface with proper state management
- [ ] **Error Handling**: Network failures and API limits
- [ ] **Loading States**: Skeleton loaders and typing indicators

#### Verification Checklist
- [ ] **Streaming Works**: Messages appear progressively
- [ ] **Error Recovery**: Handles API failures gracefully
- [ ] **Mobile Responsive**: Works on different screen sizes
- [ ] **Performance**: No unnecessary re-renders

### Database Integration (Structured Development)
*Token Budget: 20-35 prompts*

#### Pre-Session Checklist
- [ ] **Schema Design**: Define Prisma models
- [ ] **Relationships**: Plan database relationships
- [ ] **Authentication**: User model integration
- [ ] **Data Validation**: Zod schemas for type safety

#### Implementation Checklist
- [ ] **Prisma Schema**: Complete database models
- [ ] **API Routes**: CRUD operations with proper validation
- [ ] **Server Actions**: App Router server-side mutations
- [ ] **Client Integration**: React hooks for data fetching
- [ ] **Optimistic Updates**: Immediate UI feedback

### Authentication Setup (Structured Development)
*Token Budget: 25-40 prompts*

#### Pre-Session Checklist
- [ ] **Provider Choice**: OAuth providers or credentials
- [ ] **Session Management**: Database or JWT strategy
- [ ] **Protected Routes**: Define authentication requirements
- [ ] **User Experience**: Login/logout flow design

#### Implementation Checklist
- [ ] **NextAuth Configuration**: Complete auth setup
- [ ] **Middleware**: Route protection implementation
- [ ] **UI Components**: Login/logout components
- [ ] **Session Hooks**: useSession integration
- [ ] **Database Integration**: User model in Prisma

## 🧪 Testing & Verification

### AI Feature Testing
```bash
# Test prompts for Claude Code:

"Create a test suite for the AI chat feature that verifies streaming responses work correctly"

"Generate end-to-end tests for the AI content generation workflow"

"Test error handling when AI API is unavailable"
```

### Performance Testing
```bash
# Performance verification prompts:

"Analyze the app for unnecessary client-side JavaScript"

"Optimize the AI streaming implementation for better performance"

"Check for proper image optimization and lazy loading"
```

### Security Testing
```bash
# Security verification prompts:

"Audit the authentication implementation for security vulnerabilities"

"Check for proper input validation on all AI endpoints"

"Verify that sensitive API keys are properly protected"
```

## 💰 Token Budget Templates

### Small AI Feature (15-25 prompts)
```markdown
**Goal**: Add AI-powered content suggestion to existing form
**Approach**: Vibe coding (leaf node)

**Session Plan**:
1. API route creation (3-5 prompts)
2. Client component with streaming (5-8 prompts)
3. Integration with existing form (3-5 prompts)
4. Error handling and polish (4-7 prompts)
```

### Medium Feature (25-40 prompts)
```markdown
**Goal**: Complete AI chat interface with history
**Approach**: Structured development

**Session Plan**:
1. Database schema for chat history (5-8 prompts)
2. API routes for CRUD operations (8-12 prompts)
3. Chat UI with streaming (8-12 prompts)
4. Integration and testing (4-8 prompts)
```

### Large Feature (40-60 prompts)
```markdown
**Goal**: Multi-user AI collaboration workspace
**Approach**: Structured development with sub-sessions

**Session Plan**:
1. Architecture and database design (10-15 prompts)
2. Authentication and user management (10-15 prompts)
3. Real-time collaboration features (15-20 prompts)
4. AI integration and testing (5-10 prompts)
```

## 🎯 Common Patterns & Solutions

### AI Streaming Component Template
```typescript
// Request this pattern from Claude Code:
"Create a reusable AI streaming component with the following features:
- Support for multiple AI providers
- Proper loading and error states
- Message history persistence
- Customizable UI styling
- TypeScript throughout"
```

### Server Action Pattern
```typescript
// Request this pattern:
"Create a server action pattern for AI content generation that includes:
- Input validation with Zod
- Rate limiting
- Error handling
- Database logging
- Proper TypeScript types"
```

### Database Schema Pattern
```prisma
// Request this pattern:
"Design a Prisma schema for an AI application that includes:
- User authentication
- Conversation history
- AI provider tracking
- Usage analytics
- Proper indexes"
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] **Environment Variables**: All secrets configured in Vercel
- [ ] **Database Migration**: Prisma migrations applied
- [ ] **Build Optimization**: No build errors or warnings
- [ ] **AI API Limits**: Rate limiting implemented

### Deployment Verification
- [ ] **Production Build**: Builds successfully on Vercel
- [ ] **AI Features**: All AI endpoints work in production
- [ ] **Database**: Production database connected
- [ ] **Performance**: Core Web Vitals acceptable

### Post-Deployment
- [ ] **Monitoring**: Error tracking configured
- [ ] **Analytics**: Usage analytics setup
- [ ] **Backups**: Database backup strategy
- [ ] **Scaling**: Auto-scaling configured

## 📊 Success Metrics

### Development Velocity
- **Setup Time**: Project running locally in under 10 minutes
- **Feature Development**: AI features completed in 1-2 sessions
- **Bug Resolution**: Issues resolved within same session

### Code Quality
- **TypeScript Coverage**: 100% type coverage
- **Performance**: Page load under 2 seconds
- **Accessibility**: Basic WCAG compliance
- **AI Reliability**: 95%+ successful AI responses

### User Experience
- **AI Response Time**: Under 3 seconds for first token
- **Error Recovery**: Clear error messages and retry options
- **Mobile Experience**: Fully responsive design
- **Loading States**: Smooth transitions and feedback

---

*Perfect for building production-ready AI applications with excellent developer experience and scalable architecture!* 🚀
