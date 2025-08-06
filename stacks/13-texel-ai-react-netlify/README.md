# Texel AI + React + Netlify - Visual Content Creation Stack

*AI-powered image generation with advanced creative tools and seamless deployment*

## 🎯 Stack Overview

Build powerful visual content creation applications combining Texel AI's advanced text-to-image generation, React's interactive interface capabilities, and Netlify's optimized deployment platform with CDN delivery.

### Core Technologies

- **Texel AI** - High-quality text-to-image generation with advanced prompt understanding
- **React 18** - Interactive UI with TypeScript for creative interfaces
- **Netlify** - Edge deployment with image optimization and CDN
- **Canvas API** - Image manipulation and real-time editing
- **Framer Motion** - Smooth animations and interactive design elements
- **Tailwind CSS** - Responsive design-focused UI components

### Key Features

✅ **Advanced Image Generation** - High-quality text-to-image with prompt optimization  
✅ **Interactive Creative Tools** - Real-time editing and manipulation  
✅ **Batch Processing** - Queue management for multiple image generation  
✅ **Asset Management** - Comprehensive image library and organization  
✅ **Edge Optimization** - CDN delivery with image compression  
✅ **Creative Analytics** - Generation tracking and workflow insights  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Texel AI API access
- Netlify account for deployment

### Quick Setup

```bash
# Create React application
npx create-react-app my-visual-app --template typescript
cd my-visual-app

# Install visual creation dependencies
npm install framer-motion tailwindcss
npm install @types/canvas lucide-react

# Setup Texel AI integration
npm install axios

# Add environment variables
echo "REACT_APP_TEXEL_AI_API_KEY=your_api_key" > .env.local

# Start development
npm start
```

### Basic Texel AI Integration

```typescript
// src/lib/texel-ai.ts
import axios from 'axios';

export interface ImageGenerationParams {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3';
  quality?: 'standard' | 'high' | 'ultra';
}

export class TexelAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.texel.ai/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateImage(params: ImageGenerationParams): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/generate`, {
        prompt: params.prompt,
        style: params.style || 'realistic',
        aspect_ratio: params.aspectRatio || '1:1',
        quality: params.quality || 'high'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error('Failed to generate image');
    }
  }
  
  async generateBatch(prompts: string[], params?: Partial<ImageGenerationParams>): Promise<string[]> {
    const promises = prompts.map(prompt => 
      this.generateImage({ ...params, prompt })
    );
    
    return Promise.all(promises);
  }
}
```

## 🎨 Creative Interface Components

### 1. Image Generation Studio

```typescript
// src/components/ImageGenerationStudio.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TexelAIClient } from '../lib/texel-ai';

interface ImageGenerationStudioProps {
  texelClient: TexelAIClient;
}

export const ImageGenerationStudio: React.FC<ImageGenerationStudioProps> = ({ texelClient }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState('realistic');
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const imageUrl = await texelClient.generateImage({
        prompt,
        style,
        quality: 'high'
      });
      
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">AI Image Generation Studio</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe your image:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at sunset with flying cars..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Style:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="realistic">Realistic</option>
              <option value="artistic">Artistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <img
              src={generatedImage}
              alt="Generated artwork"
              className="w-full rounded-lg shadow-md"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
```

### 2. Advanced Prompt Builder

```typescript
// src/components/PromptBuilder.tsx
import React, { useState } from 'react';

interface PromptElement {
  type: 'subject' | 'style' | 'mood' | 'setting' | 'details';
  value: string;
}

export const PromptBuilder: React.FC = () => {
  const [elements, setElements] = useState<PromptElement[]>([]);
  const [builtPrompt, setBuiltPrompt] = useState('');
  
  const promptCategories = {
    subject: ['person', 'landscape', 'object', 'animal', 'building'],
    style: ['photorealistic', 'oil painting', 'watercolor', 'digital art', 'sketch'],
    mood: ['dramatic', 'peaceful', 'energetic', 'mysterious', 'joyful'],
    setting: ['outdoor', 'studio', 'urban', 'nature', 'interior'],
    details: ['high detail', 'soft lighting', 'golden hour', 'macro lens', 'wide angle']
  };
  
  const addElement = (type: keyof typeof promptCategories, value: string) => {
    const newElement: PromptElement = { type, value };
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    
    // Build prompt from elements
    const prompt = updatedElements.map(el => el.value).join(', ');
    setBuiltPrompt(prompt);
  };
  
  const removeElement = (index: number) => {
    const updatedElements = elements.filter((_, i) => i !== index);
    setElements(updatedElements);
    setBuiltPrompt(updatedElements.map(el => el.value).join(', '));
  };
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Prompt Builder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Object.entries(promptCategories).map(([category, options]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium capitalize">{category}</h4>
            <div className="space-y-1">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => addElement(category as keyof typeof promptCategories, option)}
                  className="block w-full text-left p-2 text-sm bg-white hover:bg-blue-50 border border-gray-200 rounded transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Selected Elements:</h4>
          <div className="flex flex-wrap gap-2">
            {elements.map((element, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {element.value}
                <button
                  onClick={() => removeElement(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Generated Prompt:</h4>
          <textarea
            value={builtPrompt}
            onChange={(e) => setBuiltPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Your built prompt will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
```

### 3. Image Gallery Manager

```typescript
// src/components/ImageGallery.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  createdAt: Date;
  tags: string[];
}

export const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Load images from localStorage or API
    const savedImages = localStorage.getItem('generated-images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);
  
  const filteredImages = images.filter(image => 
    filter === 'all' || image.style === filter
  );
  
  const downloadImage = async (imageUrl: string, filename: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Image Gallery</h2>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Styles</option>
          <option value="realistic">Realistic</option>
          <option value="artistic">Artistic</option>
          <option value="cartoon">Cartoon</option>
          <option value="abstract">Abstract</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <p className="text-sm text-gray-600 truncate">{image.prompt}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {image.style}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(image.url, `generated-${image.id}.png`);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl max-h-screen p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="bg-white p-4 rounded-b-lg">
                <p className="font-medium">{selectedImage.prompt}</p>
                <p className="text-sm text-gray-600">Style: {selectedImage.style}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

## 🚀 Netlify Deployment

### Build Configuration

```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Netlify Functions for Image Processing

```typescript
// netlify/functions/optimize-image.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { imageUrl, width, height, quality } = JSON.parse(event.body || '{}');
    
    // Image optimization logic here
    const optimizedUrl = await optimizeImage(imageUrl, { width, height, quality });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      },
      body: JSON.stringify({ optimizedUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Image optimization failed' })
    };
  }
};

async function optimizeImage(url: string, options: any): Promise<string> {
  // Implementation for image optimization
  return url; // Placeholder
}
```

## 🎨 Advanced Features

### Batch Image Generation

```typescript
// src/hooks/useBatchGeneration.ts
import { useState } from 'react';
import { TexelAIClient } from '../lib/texel-ai';

export const useBatchGeneration = (texelClient: TexelAIClient) => {
  const [queue, setQueue] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  
  const addToQueue = (prompts: string[]) => {
    setQueue(prev => [...prev, ...prompts]);
  };
  
  const processBatch = async () => {
    if (queue.length === 0) return;
    
    setProcessing(true);
    try {
      const batchResults = await texelClient.generateBatch(queue);
      setResults(prev => [...prev, ...batchResults]);
      setQueue([]);
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  return {
    queue,
    addToQueue,
    processBatch,
    processing,
    results
  };
};
```

## 🤖 Claude Code Master Prompt

```bash
**Role**: You are the Master Orchestration Agent for Texel AI + React + Netlify visual content creation development, specializing in AI-powered image generation with interactive creative tools.

**Framework Context**: 
- Texel AI for high-quality text-to-image generation with advanced prompt understanding
- React 18 with TypeScript for interactive creative interfaces
- Netlify for edge deployment with image optimization and CDN
- Canvas API for image manipulation and real-time editing
- Framer Motion for smooth animations and interactive design elements

**Agent Architecture**: You coordinate 6 specialized sub-agents:
1. **Visual Development Agent** - Image generation, creative tools, and visual interface implementation
2. **Image Quality Agent** - Visual output validation, generation optimization, and creative quality assurance
3. **Token Budget Agent** - Resource optimization for Texel AI usage and development efficiency
4. **Creative Pattern Agent** - Design system creation and reusable visual components
5. **Visual Deployment Agent** - Production deployment with image optimization and CDN configuration
6. **Creative Metrics Agent** - Image generation analytics and creative workflow performance monitoring

**Development Phases**:
- **Phase 1: Visual System Architecture** (18-25% of token budget)
- **Phase 2: Image Generation Implementation** (50-60% of token budget)
- **Phase 3: Visual Quality Validation** (15-20% of token budget)
- **Phase 4: Visual Content Deployment** (8-12% of token budget)

**Coordination Principles**:
- Follow phase-based development with clear boundaries
- Optimize for visual-focused development with 25K-120K tokens per session
- Balance development tokens with Texel AI image generation costs
- Focus on creative workflow efficiency and visual output quality

**Getting Started**:
"Master Orchestration Agent: Begin Phase 1 visual system architecture for [PROJECT_NAME]. Coordinate Creative System Architecture and Image Generation Planning sub-agents. Token budget: 15K-30K for comprehensive visual content creation system design."
```

---

*Create stunning visual content applications with AI-powered image generation, intuitive creative tools, and optimized deployment for exceptional user experiences.*