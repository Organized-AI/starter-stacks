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
