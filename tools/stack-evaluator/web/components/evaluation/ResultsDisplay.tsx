'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { StackRecommendation } from '@/types';
import { cn, generateId } from '@/lib/utils';
import RecommendationCard from './RecommendationCard';

interface ResultsDisplayProps {
  results: StackRecommendation;
  onRestart: () => void;
}

export default function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  const primaryRecommendation = results.recommendations[0];
  const alternativeRecommendations = results.recommendations.slice(1, 3);
  
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleShare = async () => {
    const shareData = {
      title: 'My AI Tech Stack Recommendations',
      text: `I found ${results.recommendations.length} great AI tech stacks for my project!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fall back to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fall back to copying to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Perfect! We found your ideal AI tech stack
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, here are the best recommendations for your project.
          </p>
        </div>

        {/* Confidence Score */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-700">
            {Math.round(primaryRecommendation.confidence * 100)}% match confidence
          </span>
        </div>
      </div>

      {/* Simple Project Specification */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 rounded-xl p-4 mb-6"
      >
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Customize your prompts (optional)
        </h3>
        
        <div className="space-y-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name (e.g., AI Content Generator)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Brief description (e.g., A web app that generates marketing content using AI)"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {/* Primary Recommendation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          🎯 Your Best Match
        </h2>
        <RecommendationCard 
          recommendation={primaryRecommendation} 
          rank={1} 
          isPrimary={true}
          projectName={projectName}
          projectDescription={projectDescription}
        />
      </div>

      {/* Alternative Recommendations */}
      {alternativeRecommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            🔄 Great Alternatives
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {alternativeRecommendations.map((rec: any, index: number) => (
              <RecommendationCard
                key={rec.stack.id}
                recommendation={rec}
                rank={index + 2}
                isPrimary={false}
                projectName={projectName}
                projectDescription={projectDescription}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Key Insights
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900 mb-1">Why this recommendation?</div>
            <p className="text-gray-600">
              This stack aligns perfectly with your project requirements and experience level.
            </p>
          </div>
          
          <div>
            <div className="font-medium text-gray-900 mb-1">What makes it special?</div>
            <ul className="text-gray-600 space-y-1">
              {primaryRecommendation.reasoning.slice(0, 3).map((reason: any, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        {/* Primary Actions */}
        <div className="flex gap-3">
          <Link
            href={`/stack/${primaryRecommendation.stack.id}`}
            className="btn-primary"
          >
            View Full Details
          </Link>
          
          <Link
            href="/compare"
            className="btn-secondary"
          >
            Compare All Options
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-3 text-sm">
          <button
            onClick={handleShare}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Results
          </button>
          
          <button
            onClick={onRestart}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </div>
      </motion.div>

      {/* Claude Code Integration Guide */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 text-center"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
          </svg>
          Ready to Build with Claude Code?
        </h3>
        <p className="text-gray-600 mb-6">
          Follow these steps to start building with your personalized agent system.
        </p>
        <Link
          href="/cli"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Get CLI Tool
        </Link>
      </motion.div>
    </motion.div>
  );
}