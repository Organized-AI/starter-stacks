# Option 3: Astro + Cloudflare Workers

⚡ **The Vibe Stack** - Fast, global, and cost-effective AI at the edge.

## What You Get

- **Frontend**: Astro with React islands, TypeScript, Tailwind
- **Backend**: Cloudflare Workers with Hono framework  
- **AI Integration**: Cloudflare AI Workers, OpenAI API
- **Database**: Cloudflare D1 + Vectorize for embeddings
- **Deployment**: Cloudflare Pages + Workers

## Features

✅ **Lightning fast** - Global edge deployment  
✅ **Cost effective** - Cloudflare's generous free tier  
✅ **Modern architecture** - Islands and edge computing  
✅ **Zero latency** - AI runs on the edge globally  
✅ **Integrated platform** - Everything on Cloudflare  

## Quick Start

1. **Clone and setup**
   ```bash
   git clone <repo> my-ai-tool
   cd my-ai-tool/03-astro-cloudflare
   npm install
   ```

2. **Set up Cloudflare**
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler d1 create ai-tool-db
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

4. **Development**
   ```bash
   npm run dev          # Astro frontend
   npm run dev:worker   # Cloudflare Worker
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

## Project Structure

```
03-astro-cloudflare/
├── src/
│   ├── components/
│   │   ├── Chat.tsx              # AI chat component
│   │   ├── AITool.astro          # Main AI tool
│   │   └── ui/                   # UI components
│   ├── pages/
│   │   ├── index.astro           # Home page
│   │   └── api/                  # API routes
│   ├── layouts/
│   │   └── Layout.astro          # Base layout
│   └── styles/
├── workers/
│   ├── src/
│   │   ├── index.ts              # Main worker
│   │   ├── ai.ts                 # AI integrations
│   │   └── db.ts                 # Database operations
│   └── wrangler.toml             # Worker configuration
├── package.json
├── astro.config.mjs
└── README.md
```

## Example AI Chat Component

```typescript
// src/components/Chat.tsx
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
```

## Cloudflare Worker Example

```typescript
// workers/src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

// AI Chat endpoint
app.post('/api/chat', async (c) => {
  try {
    const { message } = await c.req.json()

    // Use Cloudflare AI Workers
    const response = await c.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message }
      ]
    })

    return c.json({ response: response.response })
  } catch (error) {
    return c.json({ error: 'Failed to process message' }, 500)
  }
})

// Store chat history in D1
app.post('/api/save-chat', async (c) => {
  try {
    const { message, response } = await c.req.json()
    
    await c.env.DB.prepare(
      'INSERT INTO chat_history (message, response, timestamp) VALUES (?, ?, ?)'
    ).bind(message, response, new Date().toISOString()).run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to save chat' }, 500)
  }
})

export default app
```

## Best For

- 🌍 **Global applications** needing low latency worldwide
- 💰 **Cost-conscious** projects with high traffic expectations  
- ⚡ **Performance-critical** AI tools
- 📄 **Content-focused** AI applications (blogs, docs, landing pages)
- 🔮 **Bleeding-edge** technology enthusiasts

## Cloudflare AI Integration

### Available Models
```typescript
// Text Generation
const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
  messages: [{ role: 'user', content: 'Hello!' }]
})

// Image Classification  
const result = await env.AI.run('@cf/microsoft/resnet-50', {
  image: imageBuffer
})

// Text Embeddings
const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: 'Your text here'
})
```

### Vector Search with Vectorize
```typescript
// Store embeddings
await env.VECTORIZE_INDEX.insert([
  {
    id: '1',
    values: embeddings,
    metadata: { text: 'Original text' }
  }
])

// Search similar content
const results = await env.VECTORIZE_INDEX.query(queryEmbedding, {
  topK: 5
})
```

## Deployment Configuration

```toml
# workers/wrangler.toml
name = "ai-tool-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "ai-tool-worker-prod"

[[env.production.d1_databases]]
binding = "DB"
database_name = "ai-tool-db"
database_id = "your-database-id"

[[env.production.vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "ai-embeddings"

[env.production.ai]
binding = "AI"
```

## Performance Benefits

- **Global CDN**: Content delivered from 300+ locations
- **Edge computing**: AI processing near users
- **Zero cold starts**: Workers are always warm
- **Automatic scaling**: Handles traffic spikes seamlessly
- **Cost efficiency**: Pay only for what you use

Start building your edge-first AI tool! ⚡🌍
