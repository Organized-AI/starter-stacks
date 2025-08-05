# Lovable + Supabase - Claude Code Checklist

*Specialized prompting strategies for natural language to production app development*

## 🎯 Stack-Specific Master Prompt

```bash
claude --dangerously-skip-permissions

**Role**: You are an expert in rapid application development using Lovable (natural language to code) and Supabase (backend-as-a-service), focusing on pixel-perfect UI and real-time features.

**Framework Context**: 
- Lovable for AI-generated React components and logic
- Supabase for database, authentication, and real-time features
- React with TypeScript for frontend
- Tailwind CSS for styling
- Real-time subscriptions for live updates

**Architecture Principles**:
- Design-first approach with pixel-perfect implementations
- Use Supabase RLS (Row Level Security) for all data access
- Implement real-time subscriptions where appropriate
- Follow React best practices for state management
- Create responsive, accessible components

**Development Heuristics**:
- UI components: Maximum 8 tool calls (Lovable handles generation)
- Database operations: Maximum 12 tool calls
- Real-time features: Maximum 15 tool calls
- Authentication flow: Maximum 10 tool calls
- Focus on user experience over complex architecture
- Leverage Supabase built-in features before custom solutions
```

## 🚀 Development Workflows

### UI Component Development (Vibe Coding - Leaf Nodes)
*Token Budget: 10-20 prompts*

#### Pre-Session Checklist
- [ ] **Design Requirements**: Clear visual specifications or mockups
- [ ] **Component Props**: Define expected inputs and behaviors
- [ ] **Responsive Needs**: Mobile, tablet, desktop requirements
- [ ] **Accessibility**: Basic a11y requirements

#### Implementation Checklist
- [ ] **Lovable Prompt**: Natural language component description
- [ ] **Styling Refinement**: Tailwind CSS customizations
- [ ] **State Management**: React hooks for component state
- [ ] **Event Handling**: User interactions and callbacks
- [ ] **Responsive Design**: Mobile-first implementation

#### Verification Checklist
- [ ] **Visual Accuracy**: Matches design specifications
- [ ] **Responsive Behavior**: Works across screen sizes
- [ ] **Accessibility**: Basic keyboard and screen reader support
- [ ] **Performance**: No unnecessary re-renders

### Database & Real-time Setup (Structured Development)
*Token Budget: 20-35 prompts*

#### Pre-Session Checklist
- [ ] **Data Model**: Define tables and relationships
- [ ] **Security Rules**: Plan RLS policies
- [ ] **Real-time Needs**: Identify live update requirements
- [ ] **User Permissions**: Define access levels

#### Implementation Checklist
- [ ] **Supabase Schema**: Database tables and relationships
- [ ] **RLS Policies**: Secure data access rules
- [ ] **React Integration**: Supabase client setup
- [ ] **Real-time Subscriptions**: Live data updates
- [ ] **Error Handling**: Database operation failures

### Authentication Integration (Structured Development)
*Token Budget: 15-25 prompts*

#### Pre-Session Checklist
- [ ] **Auth Providers**: Email, OAuth, or magic links
- [ ] **User Flow**: Registration and login experience
- [ ] **Profile Management**: User data requirements
- [ ] **Protected Routes**: Authentication boundaries

#### Implementation Checklist
- [ ] **Supabase Auth**: Authentication configuration
- [ ] **React Auth Hooks**: useUser, useSession setup
- [ ] **Protected Routes**: Route-level protection
- [ ] **Auth UI Components**: Login/signup forms
- [ ] **User Profile**: Profile management interface

## 🧪 Testing & Verification

### Component Testing
```bash
# Test prompts for Claude Code:

"Create a test suite that verifies all UI components render correctly across different screen sizes"

"Generate tests for user interactions like form submissions and button clicks"

"Test component accessibility with keyboard navigation and screen readers"
```

### Database Testing
```bash
# Database verification prompts:

"Test all RLS policies to ensure users can only access their own data"

"Verify real-time subscriptions update the UI when data changes"

"Test database operations under high concurrent user scenarios"
```

### Integration Testing
```bash
# Full flow testing prompts:

"Create end-to-end tests for the complete user registration and onboarding flow"

"Test the real-time collaboration features with multiple simulated users"

"Verify the app works correctly when offline and reconnecting"
```

## 💰 Token Budget Templates

### Small Feature (10-20 prompts)
```markdown
**Goal**: Add a new dashboard widget with real-time data
**Approach**: Vibe coding (leaf node)

**Session Plan**:
1. Lovable component generation (2-4 prompts)
2. Supabase data integration (3-5 prompts)
3. Real-time subscription setup (3-5 prompts)
4. Styling and responsiveness (2-6 prompts)
```

### Medium Feature (20-35 prompts)
```markdown
**Goal**: Complete user profile management system
**Approach**: Structured development

**Session Plan**:
1. Database schema for profiles (5-8 prompts)
2. RLS policies and security (5-8 prompts)
3. Profile UI components (6-10 prompts)
4. Integration and testing (4-9 prompts)
```

### Large Feature (35-50 prompts)
```markdown
**Goal**: Multi-user collaborative workspace
**Approach**: Structured development with real-time focus

**Session Plan**:
1. Database design for collaboration (8-12 prompts)
2. Real-time infrastructure setup (10-15 prompts)
3. Collaborative UI components (12-18 prompts)
4. Testing and optimization (5-5 prompts)
```

## 🎯 Common Patterns & Solutions

### Real-time Component Pattern
```typescript
// Request this pattern from Claude Code:
"Create a reusable real-time component pattern that:
- Subscribes to Supabase real-time changes
- Handles connection states (connecting, connected, error)
- Automatically cleans up subscriptions
- Provides loading and error states
- Supports filtering and sorting"
```

### Secure Data Access Pattern
```sql
-- Request this pattern:
"Design RLS policies for a multi-tenant application that ensures:
- Users can only see their own data
- Team members can collaborate on shared resources
- Admins have appropriate access levels
- Performance is optimized with proper indexes"
```

### Form Handling Pattern
```typescript
// Request this pattern:
"Create a form handling pattern with:
- React Hook Form integration
- Supabase data mutations
- Real-time validation
- Optimistic updates
- Error handling and recovery"
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] **Environment Variables**: Supabase keys configured
- [ ] **Database Setup**: All tables and policies deployed
- [ ] **Build Process**: Lovable-generated code properly bundled
- [ ] **Performance**: Images optimized and lazy loaded

### Deployment Verification
- [ ] **Production Database**: Connected to production Supabase
- [ ] **Authentication**: All auth providers working
- [ ] **Real-time**: Live updates functioning
- [ ] **Mobile Experience**: Responsive on all devices

### Post-Deployment
- [ ] **Monitoring**: Supabase dashboard monitoring enabled
- [ ] **Analytics**: User interaction tracking
- [ ] **Backups**: Database backup strategy
- [ ] **Scaling**: Usage-based scaling configured

## 📊 Success Metrics

### Development Velocity
- **Component Creation**: UI components ready in under 30 minutes
- **Feature Development**: Complete features in 1-2 sessions
- **Database Setup**: Schema and security in under 1 hour

### User Experience
- **Load Time**: App interactive in under 2 seconds
- **Real-time Updates**: Changes appear within 100ms
- **Mobile Performance**: 60fps on mobile devices
- **Visual Accuracy**: 95%+ match to design specifications

### Technical Quality
- **Security**: All RLS policies properly tested
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals in green
- **Reliability**: 99.9% uptime for real-time features

## 🎨 Lovable-Specific Tips

### Natural Language Prompts
```bash
# Effective Lovable prompts:
"Create a modern dashboard card that displays user analytics with a clean, minimalist design using Tailwind CSS"

"Build a responsive navigation sidebar that collapses on mobile with smooth animations"

"Design a chat interface with message bubbles, typing indicators, and emoji support"
```

### Component Enhancement
```bash
# After Lovable generates base component:
"Enhance this component with proper TypeScript types and error handling"

"Add accessibility features like ARIA labels and keyboard navigation"

"Optimize this component for performance with React.memo and useMemo"
```

---

*Perfect for rapid MVP development with production-quality UI and real-time features!* ⚡
