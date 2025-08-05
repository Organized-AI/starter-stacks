'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { RecommendationCardProps } from '@/types';
import { cn } from '@/lib/utils';

export default function RecommendationCard({ 
  recommendation, 
  rank, 
  isPrimary = false,
  projectName = '',
  projectDescription = ''
}: RecommendationCardProps & { projectName?: string; projectDescription?: string }) {
  const { stack, confidence, reasoning } = recommendation;
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const formatTimeline = (days: number) => {
    if (days <= 7) return `${days} days`;
    if (days <= 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  };

  const getDifficultyColor = (learningCurve: string) => {
    switch (learningCurve.toLowerCase()) {
      case 'minimal': return 'text-green-600 bg-green-100';
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'steep': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateMasterPrompt = () => {
    const projectSpec = `**PROJECT SPECIFICATION**
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

`;

    const basePrompt = `**Role**: You are the Master Orchestration Agent for ${stack.name} development, specializing in ${stack.description.toLowerCase()}.

**Framework Context**: 
${stack.components.slice(0, 4).map((comp: any) => `- ${comp.name}`).join('\n')}

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
- Focus on production-ready, scalable solutions

**Why This Stack Was Recommended**:
${reasoning.slice(0, 3).map((reason: string, i: number) => `${i + 1}. ${reason}`).join('\n')}

**Getting Started**:
"Master Orchestration Agent: Begin Phase 1 planning for ${projectName || '[PROJECT_NAME]'}. Coordinate with Architecture Planning and Requirements Analysis sub-agents. Token budget: 15K-30K for comprehensive planning phase."`;

    return projectSpec + basePrompt;
  };

  const handleCopyPrompt = async () => {
    const prompt = generateMasterPrompt();
    
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg",
        isPrimary 
          ? "border-blue-500 shadow-sm" 
          : "border-gray-200 hover:border-blue-300"
      )}
    >
      {/* Rank Badge */}
      <div className={cn(
        "absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        isPrimary 
          ? "bg-blue-600 text-white" 
          : "bg-gray-600 text-white"
      )}>
        #{rank}
      </div>

      {/* Primary Badge */}
      {isPrimary && (
        <div className="absolute -top-2 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
          Best Match
        </div>
      )}

      {/* Header */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {stack.name}
            </h3>
            <p className="text-gray-600">
              {stack.description}
            </p>
          </div>
          
          {/* Confidence Score */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(confidence * 100)}%
            </div>
            <div className="text-xs text-gray-500">
              confidence
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getDifficultyColor(stack.learningCurve)
          )}>
            {stack.learningCurve}
          </span>
          
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {stack.category}
          </span>
          
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {stack.timeToProduction} setup
          </span>
        </div>
      </div>

      {/* Tech Stack Components */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Tech Stack</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {stack.components.slice(0, 6).map((component: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-700 font-medium">{component.name}</span>
            </div>
          ))}
          {stack.components.length > 6 && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
              <span>+{stack.components.length - 6} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Why This Stack */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Why this stack?</h4>
        <ul className="space-y-2">
          {reasoning.slice(0, 3).map((reason: any, index: number) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pros & Cons Preview */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <h5 className="font-medium text-green-700 mb-2">✓ Pros</h5>
          <ul className="space-y-1 text-gray-600">
            {stack.pros.slice(0, 2).map((pro: any, index: number) => (
              <li key={index} className="text-xs">• {pro}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium text-orange-700 mb-2">⚠ Considerations</h5>
          <ul className="space-y-1 text-gray-600">
            {stack.cons.slice(0, 2).map((con: any, index: number) => (
              <li key={index} className="text-xs">• {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-gray-50 rounded-lg p-3 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Estimated monthly cost:</span>
          <span className="font-semibold text-gray-900">
            {stack.pricing.hasFreeTier ? 'Free - ' : ''}${Math.min(...stack.pricing.monthlyCost.map((t: any) => t.minCost))} - ${Math.max(...stack.pricing.monthlyCost.map((t: any) => t.maxCost))}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/stack/${stack.id}`}
          className="flex-1 text-center py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Template
        </Link>
        
        <button
          onClick={handleCopyPrompt}
          className={cn(
            "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
            copiedPrompt
              ? "bg-green-600 text-white"
              : isPrimary
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900"
          )}
        >
          {copiedPrompt ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Master Prompt
            </>
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Updated: {new Date(stack.metadata.lastUpdated).toLocaleDateString()}</span>
          <span>⭐ {stack.metadata.githubStars ? `${(stack.metadata.githubStars / 1000).toFixed(0)}k stars` : 'Community project'}</span>
        </div>
      </div>
    </motion.div>
  );
}