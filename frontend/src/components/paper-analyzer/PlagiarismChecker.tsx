'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

type CheckResult = {
  score: number;
  matches: Array<{
    text: string;
    source: string;
    similarity: number;
  }>;
  summary: string;
};

export default function PlagiarismChecker() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl('');
      setError('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
    setError('');
  };

  const handleCheck = async () => {
    if (!url && !file) {
      setError('Please provide either a URL or upload a file');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      // In a real application, you would make an API call to check for plagiarism
      // For now, we'll just simulate a successful check with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setResult({
        score: 92, // 92% original, 8% potential plagiarism
        matches: [
          {
            text: "The implementation of machine learning algorithms has shown significant improvements in predictive accuracy.",
            source: "Smith, J. (2021). Advances in Machine Learning. Journal of AI Research, 15(2), 112-128.",
            similarity: 85
          },
          {
            text: "Data preprocessing is a crucial step that can significantly impact the performance of the model.",
            source: "https://www.example.com/research/data-science-best-practices",
            similarity: 72
          },
          {
            text: "The results indicate a strong correlation between feature selection and model accuracy.",
            source: "Johnson, A. & Williams, B. (2022). Feature Selection Techniques. Data Science Review, 8(3), 45-60.",
            similarity: 65
          }
        ],
        summary: "Your document appears to be mostly original with a few potential matches to existing sources. Consider reviewing the highlighted sections and ensuring proper citations are included where appropriate."
      });
    } catch {
      setError('Failed to check for plagiarism. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Plagiarism & AI Content Checker</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="paper-url" className="block text-sm font-medium text-gray-700 mb-1">
            Paper URL (Google Docs, PDF, etc.)
          </label>
          <input
            type="url"
            id="paper-url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://docs.google.com/document/d/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
            disabled={isChecking}
          />
        </div>
        
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Paper (PDF, DOCX, TXT)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload-plag"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload-plag"
                    name="file-upload-plag"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    disabled={isChecking}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, Word Document, or Text file up to 10MB</p>
              {file && (
                <p className="text-sm text-indigo-600 font-medium">{file.name}</p>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div>
          <Button
            onClick={handleCheck}
            disabled={isChecking || (!url && !file)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </>
            ) : 'Check for Plagiarism & AI Content'}
          </Button>
        </div>
      </div>
      
      {result && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Originality Report</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Originality Score</span>
              <span className="text-sm font-medium text-gray-900">{result.score}% Original</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${result.score >= 90 ? 'bg-green-600' : result.score >= 75 ? 'bg-yellow-400' : 'bg-red-600'}`}
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
            <p className="text-sm text-gray-700">{result.summary}</p>
          </div>
          
          {result.matches.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Potential Matches</h4>
              <div className="space-y-4">
                {result.matches.map((match, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                          {match.similarity}%
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700 italic">&quot;{match.text}&quot;</p>
                        <p className="text-sm text-gray-500">Source: {match.source}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}