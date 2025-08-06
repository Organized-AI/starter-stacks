# ElevenLabs + Vite + Vercel - Voice-First AI Application Stack

*Lightning-fast voice-interactive applications with advanced AI voice synthesis*

## 🎯 Stack Overview

Build production-ready voice applications combining ElevenLabs' state-of-the-art voice synthesis, Vite's rapid development environment, and Vercel's optimized deployment platform.

### Core Technologies

- **ElevenLabs API** - Advanced voice synthesis and cloning
- **Vite** - Lightning-fast development with TypeScript
- **Vercel** - Serverless deployment and API proxying  
- **Web Audio API** - Real-time audio processing
- **React** - Interactive voice UI components
- **Tailwind CSS** - Responsive voice interface design

### Key Features

✅ **Real-time Voice Generation** - Stream high-quality voice synthesis  
✅ **Voice Model Management** - Multiple voice personas and switching  
✅ **Audio Processing** - Real-time effects and visualization  
✅ **Voice UI Components** - Interactive recording and playback controls  
✅ **Cross-platform Audio** - Compatible across browsers and devices  
✅ **Cost Optimization** - Efficient API usage and caching strategies  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- ElevenLabs API key
- Vercel account for deployment

### Quick Setup

```bash
# Clone and setup
npm create vite@latest my-voice-app -- --template react-ts
cd my-voice-app
npm install

# Install voice dependencies
npm install @elevenlabs/api web-audio-api
npm install -D @types/web-audio-api

# Add environment variables
echo "VITE_ELEVENLABS_API_KEY=your_api_key" > .env.local

# Start development
npm run dev
```

### Basic Voice Implementation

```typescript
// src/hooks/useElevenLabs.ts
import { useState, useCallback } from 'react';

export const useElevenLabs = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const generateVoice = useCallback(async (text: string, voiceId: string) => {
    setIsPlaying(true);
    
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId })
      });
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      await audio.play();
      
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Voice generation failed:', error);
      setIsPlaying(false);
    }
  }, []);
  
  return { generateVoice, isPlaying };
};
```

## 🎤 Voice Development Patterns

### 1. Streaming Voice Generation

```typescript
// Real-time voice streaming
const streamVoice = async (text: string) => {
  const response = await fetch('/api/voice-stream', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const reader = response.body?.getReader();
  // Process audio chunks as they arrive
};
```

### 2. Voice Model Management

```typescript
// Dynamic voice switching
const VoiceSelector = () => {
  const [selectedVoice, setSelectedVoice] = useState('default');
  const voices = ['narrator', 'assistant', 'character'];
  
  return (
    <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
      {voices.map(voice => (
        <option key={voice} value={voice}>{voice}</option>
      ))}
    </select>
  );
};
```

### 3. Audio Visualization

```typescript
// Real-time audio visualization
const AudioVisualizer = ({ audioContext }: { audioContext: AudioContext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      // Render audio visualization
      requestAnimationFrame(draw);
    };
    
    draw();
  }, [audioContext]);
  
  return <canvas ref={canvasRef} />;
};
```

## 🔧 API Routes (Vercel Functions)

### Voice Generation Endpoint

```typescript
// api/voice.ts
import { ElevenLabsApi } from '@elevenlabs/api';

const elevenlabs = new ElevenLabsApi({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text, voiceId } = req.body;
  
  try {
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_monolingual_v1"
    });
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audio));
  } catch (error) {
    res.status(500).json({ error: 'Voice generation failed' });
  }
}
```

## 📱 Responsive Voice UI

### Voice Control Component

```typescript
const VoiceControls = () => {
  const { generateVoice, isPlaying } = useElevenLabs();
  const [text, setText] = useState('');
  
  return (
    <div className="voice-controls">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
        className="w-full p-3 border rounded-lg resize-none"
      />
      
      <button
        onClick={() => generateVoice(text, 'default')}
        disabled={isPlaying || !text}
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isPlaying ? 'Speaking...' : 'Generate Voice'}
      </button>
    </div>
  );
};
```

## 🚀 Production Deployment

### Vercel Configuration

```json
// vercel.json
{
  "functions": {
    "api/voice.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "ELEVENLABS_API_KEY": "@elevenlabs-api-key"
  }
}
```

### Environment Setup

```bash
# Add secrets to Vercel
vercel env add ELEVENLABS_API_KEY production

# Deploy to production
vercel --prod
```

## 💰 Cost Optimization

### Voice Caching Strategy

```typescript
// Implement voice caching to reduce API costs
const voiceCache = new Map<string, Blob>();

const getCachedVoice = async (text: string, voiceId: string) => {
  const cacheKey = `${text}-${voiceId}`;
  
  if (voiceCache.has(cacheKey)) {
    return voiceCache.get(cacheKey);
  }
  
  const voice = await generateVoice(text, voiceId);
  voiceCache.set(cacheKey, voice);
  return voice;
};
```

## 🎯 Best Practices

### Performance Optimization
- Implement voice generation queuing for multiple requests
- Use audio preloading for common phrases
- Optimize audio compression and delivery
- Implement progressive audio loading

### User Experience
- Provide visual feedback during voice generation
- Support voice playback controls (pause, speed, volume)
- Implement voice accessibility features
- Add keyboard shortcuts for voice controls

### Security & Privacy
- Sanitize text input for voice generation
- Implement rate limiting for API protection
- Store voice data securely with proper retention policies
- Comply with voice data privacy regulations

## 🤖 Claude Code Master Prompt

```bash
**Role**: You are the Master Orchestration Agent for ElevenLabs + Vite + Vercel voice application development, specializing in voice-first AI applications with real-time audio processing.

**Framework Context**: 
- ElevenLabs API for advanced voice synthesis and cloning
- Vite for lightning-fast development with TypeScript  
- Vercel for serverless deployment and API proxying
- Web Audio API for real-time audio processing
- React for interactive voice UI components

**Agent Architecture**: You coordinate 6 specialized sub-agents:
1. **Voice Development Agent** - Audio processing, voice generation, and streaming implementation
2. **Audio Quality Agent** - Voice optimization, testing, and performance validation  
3. **Token Budget Agent** - Resource optimization for voice API usage and development phases
4. **Voice Pattern Agent** - Audio design patterns and reusable voice components
5. **Voice Deployment Agent** - Production deployment with voice service configuration
6. **Voice Metrics Agent** - Audio performance monitoring and voice usage analytics

**Development Phases**:
- **Phase 1: Voice Architecture Planning** (20-25% of token budget)
- **Phase 2: Voice Implementation** (50-60% of token budget)  
- **Phase 3: Voice Experience Testing** (15-20% of token budget)
- **Phase 4: Voice Production Deployment** (8-12% of token budget)

**Coordination Principles**:
- Follow phase-based development with clear boundaries
- Optimize for voice-focused development with 30K-120K tokens per session
- Balance development tokens with ElevenLabs API costs
- Focus on production-ready voice applications with optimal audio quality

**Getting Started**:
"Master Orchestration Agent: Begin Phase 1 voice architecture planning for [PROJECT_NAME]. Coordinate Voice System Architecture and Audio Requirements Analysis sub-agents. Token budget: 15K-25K for comprehensive voice system design."
```

---

*Build exceptional voice-first applications with ElevenLabs' advanced AI voice synthesis, optimized for performance and user experience.*