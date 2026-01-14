'use client';

import React, { useState } from 'react';
import api from '@/services/api';

export default function PaperAnalyzerPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !file) {
        alert('Please enter text OR upload a PDF file.');
        return;
    }

    try {
        setIsLoading(true);
        
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            // If text is also there, maybe append it? ignoring text if file exists for now or vice versa
            // Let's assume file takes precedence if both
            response = await api.post('/analysis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
             response = await api.post('/analysis', { text });
        }

        setAnalysis(response.data.analysis);
    } catch (error: any) {
        console.error("Analysis failed", error);
        alert('Failed to analyze paper. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">AI Paper Analyzer (Powered by Groq)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white shadow rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Paper Content OR Upload PDF
              </label>
              
              <div className="mb-4">
                 <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                 />
                 {file && <p className="mt-1 text-sm text-green-600">Selected: {file.name}</p>}
              </div>

              <textarea
                  className="w-full h-80 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder={file ? "File selected. Text input will be ignored." : "Paste the text of the research paper here..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!!file}
              ></textarea>
              <div className="mt-4 flex justify-end">
                  <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                          </>
                      ) : 'Analyze Text'}
                  </button>
              </div>
          </div>

          {/* Output Section */}
          <div className="bg-white shadow rounded-lg p-6 overflow-y-auto max-h-[600px]">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Result</h2>
              {analysis ? (
                  <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700">{analysis}</pre>
                  </div>
              ) : (
                  <div className="text-center text-gray-500 py-20">
                      <p>Run analysis to see the results here.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}