'use client';

import React, { useState } from 'react';
import api from '@/services/api';
import ReactMarkdown from 'react-markdown';

export default function PaperAnalyzerPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setText(''); // Clear text when file is selected
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !file) {
        alert('Please enter text OR upload a PDF file.');
        return;
    }

    try {
        setIsLoading(true);
        setAnalysis('');
        
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
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
      <h1 className="text-2xl font-semibold text-gray-900">AI Paper Analyzer</h1>
      <p className="text-gray-600">Powered by Llama 3.3 70B via Groq</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                 {file && (
                   <div className="mt-2 flex items-center gap-2">
                     <span className="text-sm text-green-600">📄 {file.name}</span>
                     <button 
                       onClick={clearFile}
                       className="text-xs text-red-500 hover:text-red-700"
                     >
                       (Remove)
                     </button>
                   </div>
                 )}
              </div>

              <textarea
                  className="w-full h-72 p-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder={file ? "File selected. Text input is disabled." : "Paste the abstract or full text of the research paper here..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!!file}
              ></textarea>
              <div className="mt-4 flex justify-end">
                  <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                          </>
                      ) : '🔍 Analyze Paper'}
                  </button>
              </div>
          </div>

          {/* Output Section */}
          <div className="bg-white shadow rounded-lg p-6 overflow-y-auto max-h-[700px]">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Result</h2>
              {analysis ? (
                  <div className="prose prose-sm max-w-none text-black prose-headings:text-black prose-headings:font-semibold prose-p:text-black prose-li:text-black prose-strong:text-black prose-table:text-black prose-td:text-black prose-th:text-black prose-a:text-indigo-600 [&_table]:w-full [&_table]:text-sm [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_td]:border [&_td]:border-gray-200 [&_th]:bg-gray-50">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
              ) : (
                  <div className="text-center text-gray-500 py-20">
                      <div className="text-4xl mb-4">📄</div>
                      <p>Upload a paper or paste text to see the AI analysis.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}