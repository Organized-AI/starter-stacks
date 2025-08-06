# Option 1: Next.js + Vercel AI SDK

🚀 **The AI-Native Stack** - Everything should be fast, simple, and AI-first.

## What You Get

- **Frontend**: Next.js 14+ with React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes + Vercel AI SDK  
- **AI Integration**: OpenAI, Anthropic, Ollama APIs with streaming
- **Database**: Supabase (PostgreSQL) + Vector embeddings
- **Deployment**: Vercel with edge functions

## Features

✅ **Built-in AI streaming** - No WebSocket complexity  
✅ **Single language** - TypeScript throughout  
✅ **Zero deployment friction** - `vercel deploy` and you're live  
✅ **Modern design system** - Tailwind CSS + Shadcn/ui  
✅ **Real-time chat** - Working AI chat in 3 lines of code  

## Quick Start

1. **Clone this template**
   ```bash
   npx create-next-app@latest my-ai-tool --template ./01-nextjs-vercel
   cd my-ai-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your API keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

## Environment Variables

```env
# AI Provider Keys
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Project Structure

```
01-nextjs-vercel/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat API endpoint
│   ├── components/
│   │   ├── ui/                   # Shadcn/ui components
│   │   ├── chat.tsx              # Chat interface
│   │   └── ai-tool.tsx           # Main AI tool component
│   ├── lib/
│   │   ├── ai.ts                 # AI configuration
│   │   └── supabase.ts           # Database client
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Example AI Chat Component

```typescript
'use client'

import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
              m.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
```

## Best For

- 🎯 **Vibe coders** who want things to just work
- 💬 **Chat interfaces** and conversational AI
- ⚡ **Rapid prototyping** and MVP development
- 🎨 **Content generation** tools
- 🚀 **Startup projects** that need to ship fast

## Learning Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)

## Common Patterns

### Streaming AI Responses
```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

### Database Integration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Save chat message
export async function saveChatMessage(message: string, response: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([
      { message, response, created_at: new Date().toISOString() }
    ])
  
  return { data, error }
}
```

Start building your AI tool with this template! 🎉

## 🤖 Claude Code Master Prompt

Use this foundation for every Claude Code session when building with this stack:

```bash
# Use this foundation for every Claude Code session

**Role**: You are the Master Orchestration Agent for Next.js 14 development, specializing in AI-native applications with App Router, TypeScript, and Vercel AI SDK. You coordinate specialized sub-agents through structured development phases.

**Framework Context**: 
- Next.js 14 with App Router and TypeScript
- Vercel AI SDK for streaming AI responses
- Tailwind CSS for styling
- Prisma for database operations
- NextAuth.js for authentication
- Vercel deployment platform

**Phase-Based Development**: You manage development through 4 structured phases:
- **Phase 1: Planning & Architecture** (20-25% of token budget)
- **Phase 2: Core Implementation** (45-55% of token budget)
- **Phase 3: Integration & Testing** (15-20% of token budget)
- **Phase 4: Deployment & Optimization** (10-15% of token budget)

**Agent Architecture**: You coordinate 6 specialized sub-agents across all phases:
1. **Development Workflow Agent** - Feature implementation and component creation
2. **Testing & Verification Agent** - Quality assurance and bug detection
3. **Token Budget Agent** - Resource optimization and phase planning
4. **Pattern & Solution Agent** - Best practices and reusable components
5. **Deployment Agent** - Production deployment and infrastructure
6. **Success Metrics Agent** - Performance monitoring and optimization

**Token Budget Context**: 
- $100 Claude Max Plan = ~20M balanced tokens (70% input, 30% output)
- Optimize for session-based development with clear phase boundaries
- Target 50K-200K tokens per focused development session
```

Copy this prompt into Claude Code to activate the full agent orchestration system for Next.js development!
