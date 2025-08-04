# AI Integration Patterns

Common patterns and best practices for integrating AI into your applications.

## Streaming Response Pattern

### Implementation across stacks:

**Next.js + Vercel AI SDK:**
```typescript
import { useChat } from 'ai/react'
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
```

**FastAPI + Streamlit:**
```python
import streamlit as st
def stream_response():
    for chunk in ai_client.stream():
        yield chunk
```

**Cloudflare Workers:**
```typescript
const stream = await env.AI.run(model, { stream: true })
```

## Error Handling Pattern

### Rate limiting, retry logic, and graceful degradation

**Universal Pattern:**
```typescript
async function callAI(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await aiProvider.generate(prompt)
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        await delay(Math.pow(2, i) * 1000) // Exponential backoff
        continue
      }
      throw error
    }
  }
}
```

## Multi-Provider Pattern

### Switch between AI providers seamlessly

```typescript
interface AIProvider {
  name: string
  generate: (prompt: string) => Promise<string>
  stream: (prompt: string) => AsyncIterable<string>
}

class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map()
  
  async generate(prompt: string, providerName?: string) {
    const provider = providerName 
      ? this.providers.get(providerName)
      : this.getOptimalProvider(prompt)
    
    return provider.generate(prompt)
  }
}
```

## Vector Search Pattern

### Semantic search across all stacks

**Supabase (pgvector):**
```sql
SELECT content, 1 - (embedding <=> query_embedding) as similarity
FROM documents
WHERE 1 - (embedding <=> query_embedding) > 0.8
ORDER BY similarity DESC
LIMIT 10;
```

**Cloudflare Vectorize:**
```typescript
const results = await env.VECTORIZE.query(embedding, { topK: 10 })
```

## Token Management Pattern

### Track usage and costs across providers

```typescript
interface TokenUsage {
  provider: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

class TokenTracker {
  async trackUsage(usage: TokenUsage) {
    await database.insertUsage(usage)
    await this.checkQuota(usage.userId)
  }
}
```

More patterns available in individual stack documentation.
