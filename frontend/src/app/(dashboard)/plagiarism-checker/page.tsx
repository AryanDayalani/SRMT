'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PlagiarismChecker from '@/components/paper-analyzer/PlagiarismChecker';

export default function PlagiarismCheckerPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Plagiarism & AI Content Checker</h1>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Check your research paper for potential plagiarism and AI-generated content. 
            Our tool compares your paper against a vast database of academic sources and can detect content created by AI tools.
          </p>
          
          <PlagiarismChecker />
        </div>
      </div>
    </div>
  );
}