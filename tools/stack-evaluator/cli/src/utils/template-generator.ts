import { join, basename } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { spawn } from 'child_process';
import { promisify } from 'util';

import { CLIContext, TemplateOptions } from '@/types';
import { Logger } from '@/utils/logger';

const execAsync = promisify(spawn);

interface StackTemplate {
  id: string;
  name: string;
  description: string;
  files: TemplateFile[];
  dependencies: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  scripts: Record<string, string>;
  gitignore: string[];
  readme: string;
}

interface TemplateFile {
  path: string;
  content: string;
  executable?: boolean;
}

export class TemplateGenerator {
  private context: CLIContext;
  private logger: Logger;
  private templates: Map<string, StackTemplate>;

  constructor(context: CLIContext, logger: Logger) {
    this.context = context;
    this.logger = logger;
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Next.js + Vercel AI SDK Template
    this.templates.set('nextjs-vercel-ai', {
      id: 'nextjs-vercel-ai',
      name: 'Next.js + Vercel AI SDK',
      description: 'Modern React framework with Vercel AI SDK for rapid AI app development',
      files: [
        {
          path: 'app/page.tsx',
          content: `'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-8 text-center">AI Chat App</h1>
      
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap mb-4">
          <div className="font-semibold">
            {m.role === 'user' ? 'You: ' : 'AI: '}
          </div>
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="mt-8">
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
`
        },
        {
          path: 'app/api/chat/route.ts',
          content: `import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });

  return result.toAIStreamResponse();
}
`
        },
        {
          path: 'app/layout.tsx',
          content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chat App',
  description: 'Built with Next.js and Vercel AI SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`
        },
        {
          path: 'app/globals.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`
        },
        {
          path: 'next.config.js',
          content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  }
};

module.exports = nextConfig;
`
        },
        {
          path: 'tailwind.config.ts',
          content: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`
        },
        {
          path: '.env.local.example',
          content: `# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Other AI providers (optional)
# ANTHROPIC_API_KEY=your_anthropic_key
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
`
        }
      ],
      dependencies: {
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.0.0',
          'react-dom': '^18.0.0',
          'ai': '^3.0.0',
          '@ai-sdk/openai': '^0.0.12',
          '@ai-sdk/anthropic': '^0.0.11'
        },
        devDependencies: {
          'typescript': '^5.0.0',
          '@types/node': '^20.0.0',
          '@types/react': '^18.0.0',
          '@types/react-dom': '^18.0.0',
          'tailwindcss': '^3.3.0',
          'postcss': '^8.0.0',
          'autoprefixer': '^10.0.0',
          'eslint': '^8.0.0',
          'eslint-config-next': '14.0.0'
        }
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint',
        'type-check': 'tsc --noEmit'
      },
      gitignore: [
        'node_modules/',
        '.next/',
        '.env.local',
        '.env*.local',
        'npm-debug.log*',
        'yarn-debug.log*',
        'yarn-error.log*'
      ],
      readme: `# AI Chat App

Built with **Next.js** and **Vercel AI SDK** - the perfect stack for modern AI applications.

## Features

- ⚡ **Fast Development**: Next.js App Router with TypeScript
- 🤖 **AI Integration**: Vercel AI SDK with streaming responses
- 🎨 **Beautiful UI**: Tailwind CSS for rapid styling
- 🔒 **Type Safe**: Full TypeScript support
- 📱 **Responsive**: Works on all devices

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up your environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
   
   Add your OpenAI API key to \`.env.local\`.

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) to see your AI chat app!

## Deployment

Deploy easily with Vercel:

\`\`\`bash
npx vercel
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

Generated with [Stack Evaluator](https://stack.organizedai.vip) 🚀
`
    });

    // Add more templates...
    this.templates.set('python-fastapi', {
      id: 'python-fastapi',
      name: 'Python + FastAPI',
      description: 'High-performance Python API with modern async support',
      files: [
        {
          path: 'main.py',
          content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI API Service",
    description="FastAPI service for AI integration",
    version="1.0.0"
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "gpt-3.5-turbo"
    max_tokens: Optional[int] = 1000

class ChatResponse(BaseModel):
    message: str
    usage: dict

@app.get("/")
async def root():
    return {"message": "AI API Service is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await openai.ChatCompletion.acreate(
            model=request.model,
            messages=[msg.dict() for msg in request.messages],
            max_tokens=request.max_tokens
        )
        
        return ChatResponse(
            message=response.choices[0].message.content,
            usage=response.usage
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.3.8
python-dotenv==1.0.0
pydantic==2.5.0
httpx==0.25.2
`
        },
        {
          path: '.env.example',
          content: `OPENAI_API_KEY=your_openai_api_key_here
`
        }
      ],
      dependencies: {
        dependencies: {},
        devDependencies: {}
      },
      scripts: {
        'dev': 'uvicorn main:app --reload',
        'start': 'uvicorn main:app --host 0.0.0.0 --port 8000',
        'test': 'pytest'
      },
      gitignore: [
        '__pycache__/',
        '*.py[cod]',
        '*$py.class',
        '.env',
        '.venv/',
        'venv/',
        '.pytest_cache/'
      ],
      readme: `# AI API Service

High-performance **Python FastAPI** service for AI applications.

## Features

- ⚡ **High Performance**: FastAPI with async support
- 🤖 **AI Ready**: OpenAI integration built-in
- 📝 **Auto Documentation**: Automatic API docs at /docs
- 🔧 **Type Safety**: Pydantic models for validation
- 🚀 **Production Ready**: Uvicorn ASGI server

## Getting Started

1. Create virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Add your OpenAI API key to \`.env\`.

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Visit [http://localhost:8000/docs](http://localhost:8000/docs) for API documentation!

## API Endpoints

- \`GET /\` - Root endpoint
- \`GET /health\` - Health check
- \`POST /chat\` - Chat completion

Generated with [Stack Evaluator](https://stack.organizedai.vip) 🚀
`
    });

    // Add React + Vite template
    this.templates.set('react-vite', {
      id: 'react-vite',
      name: 'React + Vite',
      description: 'Lightning-fast React development with Vite',
      files: [
        {
          path: 'src/App.tsx',
          content: `import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Replace with your AI API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Chat App</h1>
        <p>Built with React + Vite</p>
      </header>

      <main className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={\`message \${msg.role}\`}>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
              <span>{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <strong>AI:</strong>
              <span className="typing">Thinking...</span>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
`
        },
        {
          path: 'src/App.css',
          content: `.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: #f5f5f5;
  margin-right: auto;
}

.message strong {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.typing {
  opacity: 0.7;
  font-style: italic;
}

.input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
}

.input-area input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.input-area button:hover:not(:disabled) {
  background: #5a6fd8;
}

.input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
`
        },
        {
          path: 'src/main.tsx',
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`
        },
        {
          path: 'src/index.css',
          content: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #fafafa;
}

#root {
  min-height: 100vh;
}
`
        },
        {
          path: 'index.html',
          content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Chat App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
        },
        {
          path: 'vite.config.ts',
          content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
`
        }
      ],
      dependencies: {
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          '@vitejs/plugin-react': '^4.0.0',
          'typescript': '^5.0.0',
          'vite': '^4.4.0'
        }
      },
      scripts: {
        'dev': 'vite',
        'build': 'tsc && vite build',
        'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        'preview': 'vite preview'
      },
      gitignore: [
        'node_modules/',
        'dist/',
        '.env.local',
        '*.local'
      ],
      readme: `# AI Chat App

Lightning-fast **React + Vite** application for AI interactions.

## Features

- ⚡ **Lightning Fast**: Vite for instant development
- ⚛️ **Modern React**: Hooks and functional components
- 🎨 **Clean UI**: Responsive chat interface
- 🔧 **TypeScript**: Full type safety
- 🚀 **Fast Build**: Optimized production builds

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:5173](http://localhost:5173) to see your app!

## Building for Production

\`\`\`bash
npm run build
\`\`\`

## Learn More

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

Generated with [Stack Evaluator](https://stack.organizedai.vip) 🚀
`
    });
  }

  async generate(stackId: string, projectPath: string, options: TemplateOptions): Promise<void> {
    const template = this.templates.get(stackId);
    if (!template) {
      throw new Error(`Template not found: ${stackId}`);
    }

    this.logger.verbose(`Generating ${template.name} project at ${projectPath}`);

    // Create project structure
    await this.createProjectStructure(template, projectPath, options);
    
    // Generate package.json
    await this.generatePackageJson(template, projectPath, options);
    
    // Generate .gitignore
    await this.generateGitignore(template, projectPath);
    
    // Generate README.md
    await this.generateReadme(template, projectPath, options);
  }

  private async createProjectStructure(
    template: StackTemplate,
    projectPath: string,
    options: TemplateOptions
  ): Promise<void> {
    for (const file of template.files) {
      const filePath = join(projectPath, file.path);
      const fileDir = join(filePath, '..');

      // Create directory if it doesn't exist
      if (!existsSync(fileDir)) {
        mkdirSync(fileDir, { recursive: true });
      }

      // Process template variables in content
      let content = file.content;
      content = content.replace(/\{\{projectName\}\}/g, options.projectName);
      content = content.replace(/\{\{description\}\}/g, options.description || '');

      // Write file
      writeFileSync(filePath, content);

      // Make executable if needed
      if (file.executable) {
        // Set executable permissions on Unix systems
        try {
          const { execSync } = require('child_process');
          execSync(`chmod +x "${filePath}"`);
        } catch (error) {
          this.logger.verbose('Could not set executable permissions:', error);
        }
      }
    }
  }

  private async generatePackageJson(
    template: StackTemplate,
    projectPath: string,
    options: TemplateOptions
  ): Promise<void> {
    // Only generate package.json for Node.js projects
    if (Object.keys(template.dependencies.dependencies).length === 0 && 
        Object.keys(template.dependencies.devDependencies).length === 0) {
      return;
    }

    const packageJson = {
      name: options.projectName,
      version: '0.1.0',
      description: options.description || `${template.name} application`,
      private: true,
      scripts: template.scripts,
      dependencies: template.dependencies.dependencies,
      devDependencies: template.dependencies.devDependencies,
      keywords: ['ai', 'typescript', 'web-app'],
      author: '',
      license: 'MIT'
    };

    const packagePath = join(projectPath, 'package.json');
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  }

  private async generateGitignore(template: StackTemplate, projectPath: string): Promise<void> {
    const gitignorePath = join(projectPath, '.gitignore');
    const content = template.gitignore.join('\n') + '\n';
    writeFileSync(gitignorePath, content);
  }

  private async generateReadme(
    template: StackTemplate,
    projectPath: string,
    options: TemplateOptions
  ): Promise<void> {
    const readmePath = join(projectPath, 'README.md');
    let content = template.readme;
    
    // Replace template variables
    content = content.replace(/# AI Chat App/g, `# ${options.projectName}`);
    content = content.replace(/AI Chat App/g, options.projectName);
    
    writeFileSync(readmePath, content);
  }

  async installDependencies(projectPath: string): Promise<void> {
    const packageJsonPath = join(projectPath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      this.logger.verbose('No package.json found, skipping dependency installation');
      return;
    }

    this.logger.verbose('Installing dependencies with npm...');

    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install'], {
        cwd: projectPath,
        stdio: this.context.verbose ? 'inherit' : 'pipe'
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`npm install failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  getTemplate(stackId: string): StackTemplate | undefined {
    return this.templates.get(stackId);
  }
}