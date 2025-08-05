'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Stack {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  checklistPath: string;
}

const STACKS: Stack[] = [
  {
    id: '01-nextjs-vercel',
    name: 'Next.js + Vercel AI SDK',
    description: 'Phase-based agent development workflows for AI-native React applications',
    technologies: ['Next.js 14', 'TypeScript', 'Vercel AI SDK', 'Tailwind CSS'],
    checklistPath: '01-nextjs-vercel-checklist.md'
  },
  {
    id: '02-fastapi-streamlit', 
    name: 'FastAPI + Streamlit',
    description: 'Agent-based data-driven application development with Python backend',
    technologies: ['FastAPI', 'Streamlit', 'Pydantic', 'SQLAlchemy'],
    checklistPath: '02-fastapi-streamlit-checklist.md'
  },
  {
    id: '03-astro-cloudflare',
    name: 'Astro + Cloudflare',
    description: 'Static-first development with edge computing capabilities',
    technologies: ['Astro', 'Cloudflare Pages', 'TypeScript', 'Tailwind CSS'],
    checklistPath: '03-astro-cloudflare-checklist.md'
  },
  {
    id: '04-replit-gumloop',
    name: 'Replit + Gumloop',
    description: 'Rapid prototyping with no-code automation workflows',
    technologies: ['Replit', 'Gumloop', 'Python', 'JavaScript'],
    checklistPath: '04-replit-gumloop-checklist.md'
  },
  {
    id: '05-windsurf-claude',
    name: 'Windsurf + Claude',
    description: 'AI-assisted development with intelligent code completion',
    technologies: ['Windsurf IDE', 'Claude AI', 'TypeScript', 'React'],
    checklistPath: '05-windsurf-claude-checklist.md'
  }
];

export default function ChecklistViewer() {
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [copiedStack, setCopiedStack] = useState<string | null>(null);

  const generateMasterPrompt = (stack: Stack) => {
    const basePrompt = getBasePromptForStack(stack);
    
    const projectSpecification = `
**PROJECT SPECIFICATION**
- **Project Name**: ${projectName || '[PROJECT_NAME]'}
- **Project Description**: ${projectDescription || '[PROJECT_DESCRIPTION]'}
- **Tech Stack**: ${stack.name}
- **Development Framework**: ${stack.description}

**INSTRUCTIONS FOR CLAUDE CODE**
1. Use the above project specification to replace placeholders throughout the agent prompts
2. Begin with Phase 1: Planning & Architecture for detailed project setup
3. Follow the phase-based development approach with proper token budget allocation
4. Coordinate between specialized agents as outlined in the checklist

---

${basePrompt}`;

    return projectSpecification.trim();
  };

  const getBasePromptForStack = (stack: Stack) => {
    // This would typically fetch the actual checklist content
    // For now, returning a simplified version based on the stack
    return `**Role**: You are the Master Orchestration Agent for ${stack.name} development, specializing in ${stack.description.toLowerCase()}.

**Framework Context**: 
${stack.technologies.map(tech => `- ${tech}`).join('\n')}

**Agent Architecture**: You coordinate 6 specialized sub-agents:
1. **Development Workflow Agent** - Feature implementation and architecture
2. **Testing & Verification Agent** - Quality assurance and validation  
3. **Token Budget Agent** - Resource optimization and planning
4. **Pattern & Solution Agent** - Best practices and reusable components
5. **Deployment Agent** - Production deployment and infrastructure
6. **Success Metrics Agent** - Performance monitoring and optimization

**Development Phases**:
- **Phase 1: Planning & Architecture** (20-25% of token budget)
- **Phase 2: Core Implementation** (45-55% of token budget)  
- **Phase 3: Integration & Testing** (15-20% of token budget)
- **Phase 4: Deployment & Optimization** (10-15% of token budget)

**Coordination Principles**:
- Follow phase-based development with clear boundaries
- Optimize for session-based development with token efficiency
- Maintain quality gates between phases
- Focus on production-ready, scalable solutions`;
  };

  const handleCopyPrompt = async (stack: Stack) => {
    const prompt = generateMasterPrompt(stack);
    
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedStack(stack.id);
      setTimeout(() => setCopiedStack(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Claude Code Stack Checklists
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Choose a tech stack and generate a master prompt for Claude Code development
        </p>
        
        {/* Project Specification Form */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Project Specification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., AI Content Generator"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="e.g., A web application that generates marketing content using AI, with user authentication and content management features"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stack Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STACKS.map((stack, index) => (
          <motion.div
            key={stack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {stack.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {stack.description}
              </p>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {stack.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleCopyPrompt(stack)}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  copiedStack === stack.id
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copiedStack === stack.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied to Clipboard!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Master Prompt
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setSelectedStack(selectedStack?.id === stack.id ? null : stack)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {selectedStack?.id === stack.id ? 'Hide Preview' : 'Preview Prompt'}
              </button>
            </div>

            {/* Prompt Preview */}
            {selectedStack?.id === stack.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-md border"
              >
                <h4 className="font-medium text-gray-900 mb-2">Generated Prompt Preview:</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {generateMasterPrompt(stack)}
                </pre>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Usage Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How to Use These Prompts
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <h4 className="font-medium">Fill Project Details</h4>
            <p className="text-gray-600">
              Enter your project name and description above to customize the prompt
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <h4 className="font-medium">Copy & Paste</h4>
            <p className="text-gray-600">
              Click "Copy Master Prompt" to copy the complete agent system to your clipboard
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <h4 className="font-medium">Start Building</h4>
            <p className="text-gray-600">
              Paste into Claude Code and begin your phase-based development workflow
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}