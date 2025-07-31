'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RecommendationCardProps } from '@/types';
import { cn } from '@/lib/utils';

export default function RecommendationCard({ 
  recommendation, 
  rank, 
  isPrimary = false 
}: RecommendationCardProps) {
  const { stack, confidence, reasoning } = recommendation;

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
          className={cn(
            "flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors",
            isPrimary
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-900 text-white hover:bg-gray-800"
          )}
        >
          View Details
        </Link>
        
        <Link
          href={`/stack/${stack.id}/setup`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Setup Guide
        </Link>
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