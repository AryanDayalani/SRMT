'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // State for project details
  const [projectName, setProjectName] = useState('Loading...');
  const [description, setDescription] = useState('');
  const [targetConference, setTargetConference] = useState('');
  const [googleDocsLink, setGoogleDocsLink] = useState('');
  const [track, setTrack] = useState('');
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for collaborators
  const [collaborators, setCollaborators] = useState<any[]>([]);
  
  const [editingCountry, setEditingCountry] = useState<{ [key: number]: string }>({});
  
  // State for progress tracking
  const [currentStep, setCurrentStep] = useState('abstract');

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  // Load project data from API
  useEffect(() => {
    if (params.id) {
        const fetchProject = async () => {
             try {
                 setLoading(true);
                 const res = await api.get(`/projects/${params.id}`);
                 const project = res.data;
                 
                  setProjectName(project.name || 'Unnamed Project');
                  setDescription(project.description || '');
                  setTrack(project.track || '');
                  setTargetConference(project.conference || '');
                  setTargetConference(project.conference || '');
                  setFormat(project.format || '');
                  setGoogleDocsLink(project.paperUrl || '');
                  if (project.researchStep) {
                      setCurrentStep(project.researchStep);
                  }

                  if (project.collaborators) {
                    setCollaborators(project.collaborators.map((c: any) => ({
                        isPrimary: c.role === 'guide' ? false : true,
                        email: c.email,
                        firstName: c.name.split(' ')[0] || '',
                        lastName: c.name.split(' ').slice(1).join(' ') || '',
                        organization: c.organization || 'N/A',
                        country: c.country || ''
                    })));
                  }
             } catch (error) {
                 console.error("Failed to fetch project", error);
                 setProjectName('Project Not Found');
             } finally {
                 setLoading(false);
             }
        }
        fetchProject();
    }
  }, [params.id]);

  const steps = ['abstract', 'literature', 'methodology', 'results', 'conclusion'];
  
  const getStepIndex = (step: string) => steps.indexOf(step);

  const isStepCompleted = (step: string) => {
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);
    return stepIndex <= currentIndex;
  };

  const handleAskForReview = () => {
    alert('Review request sent!');
  };

  const handleCopyLink = () => {
    if (googleDocsLink) {
      navigator.clipboard.writeText(googleDocsLink);
      alert('Link copied to clipboard!');
    } else {
      alert('Please enter a Google Docs link first');
    }
  };

  const handleCountryEdit = (collaboratorIndex: number, country: string) => {
    setEditingCountry({ ...editingCountry, [collaboratorIndex]: country });
  };

  const handleSaveCountry = (collaboratorIndex: number) => {
    const country = editingCountry[collaboratorIndex] || '';
    const updatedCollaborators = collaborators.map((c, i) => 
      i === collaboratorIndex ? { ...c, country } : c
    );
    setCollaborators(updatedCollaborators);
    const newEditing = { ...editingCountry };
    delete newEditing[collaboratorIndex];
    setEditingCountry(newEditing);
    // In a real app we would autosave this change to backend too or on main save
  };

  const handleCancelCountryEdit = (collaboratorIndex: number) => {
    const newEditing = { ...editingCountry };
    delete newEditing[collaboratorIndex];
    setEditingCountry(newEditing);
  };

  const handleDownloadTemplate = () => {
    if (!format) {
      alert('Please set a paper format first');
      return;
    }
    alert(`Downloading ${format.toUpperCase()} template...`);
  };

  const handleStepClick = async (step: string) => {
      // Only allow updating if permitted (e.g. edit mode is NOT required for progress, it's a quick action)
      // or we can require edit mode. Let's allow it always for better UX, or restrict to isEditing?
      // User request was "fix the progress bar". Quick interactive is better.
      try {
          const oldStep = currentStep;
          setCurrentStep(step); // Optimistic update
          
          await api.put(`/projects/${params.id}`, {
              researchStep: step
          });
      } catch (error) {
          console.error("Failed to update step", error);
          alert("Failed to update progress");
      }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProject = async () => {
    try {
        setIsSaving(true);
        // Correcting the payload structure to match state variables
        await api.put(`/projects/${params.id}`, {
            name: projectName,
            description,
            track,
            format,
            conference: targetConference, 
            paperUrl: googleDocsLink,
            collaborators: collaborators.map(c => ({
                name: `${c.firstName} ${c.lastName}`.trim(),
                email: c.email,
                role: c.isPrimary ? 'researcher' : 'guide',
                organization: c.organization,
                country: c.country
            }))
        });
        setIsEditing(false);
        alert('Project updated successfully!');
    } catch (error: any) {
        console.error("Failed to update project", error);
        alert(`Failed to update project: ${error.response?.data?.message || error.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        try {
            setIsDeleting(true);
            await api.delete(`/projects/${params.id}`);
            router.push('/projects');
        } catch (error) {
            console.error("Failed to delete project", error);
            alert('Failed to delete project');
            setIsDeleting(false);
        }
    }
  };

  if (loading) {
      return <div className="p-8 text-center">Loading project details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-semibold text-gray-900">{isEditing ? 'Editing Project' : projectName}</h1>
        </div>
        <div className="flex space-x-3">
            {isEditing ? (
                <>
                    <button
                        onClick={handleSaveProject}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Edit Project
                    </button>
                    <button
                        onClick={handleDeleteProject}
                        disabled={isDeleting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                </>
            )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Project Name */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Project Name</h3>
              <div className="mt-1">
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border border-gray-300 rounded-md text-gray-900 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            {/* Track - Select or ReadOnly */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Track</h3>
              <div className="mt-1">
                {isEditing ? (
                    <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    >
                        <option value="">Select a track</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="computing">Computing</option>
                        <option value="other">Other</option>
                    </select>
                ) : (
                    <input 
                      type="text" 
                      value={track}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50"
                    />
                )}
              </div>
            </div>

            {/* Target Conference */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Target Conference</h3>
              <div className="mt-1">
                <input 
                  type="text" 
                  value={targetConference}
                  onChange={(e) => setTargetConference(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full p-2 border border-gray-300 rounded-md text-gray-900 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            {/* Format - Select or ReadOnly */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Paper Format</h3>
              <div className="mt-1">
                {isEditing ? (
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    >
                         <option value="">Select a format</option>
                        <option value="ieee">IEEE</option>
                        <option value="acm">ACM</option>
                        <option value="springer">Springer</option>
                        <option value="elsevier">Elsevier</option>
                        <option value="custom">Custom</option>
                    </select>
                ) : (
                    <input 
                      type="text" 
                      value={format}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50"
                    />
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-1">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full p-2 border border-gray-300 rounded-md text-gray-900 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
            </div>

            {/* Google Docs Link */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Google Docs Link</h3>
              <div className="mt-1 flex">
                <input 
                  type="text" 
                  value={googleDocsLink}
                  onChange={(e) => setGoogleDocsLink(e.target.value)}
                  readOnly={!isEditing}
                  className={`flex-grow p-2 border border-gray-300 rounded-md text-gray-900 ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                  placeholder="Share accessible Google Doc URL"
                />
                {!isEditing && (
                    <button 
                      onClick={handleCopyLink}
                      className="ml-2 p-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
                      title="Copy link to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Template Download */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Paper Template</h3>
            <div className="mt-1">
              <button 
                onClick={handleDownloadTemplate}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Collaborators */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Collaborators</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Contact</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country/Region</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaborators.length > 0 ? collaborators.map((collaborator, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${collaborator.isPrimary ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {collaborator.isPrimary ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{collaborator.email}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{collaborator.firstName}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{collaborator.lastName}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{collaborator.organization}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                         {/* Existing country editing logic */}
                        <div className="flex items-center space-x-2">
                          {editingCountry[index] !== undefined ? (
                            <>
                              <input 
                                type="text" 
                                placeholder="Country/Region"
                                value={editingCountry[index] || ''}
                                onChange={(e) => handleCountryEdit(index, e.target.value)}
                                className="p-1 border border-gray-300 rounded-md text-sm w-24 text-gray-900"
                              />
                              <button 
                                onClick={() => handleSaveCountry(index)}
                                className="p-1 text-white bg-blue-500 rounded-md text-xs hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => handleCancelCountryEdit(index)}
                                className="p-1 text-white bg-gray-500 rounded-md text-xs hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm text-gray-500">{collaborator.country || 'Not set'}</span>
                              <button 
                                onClick={() => handleCountryEdit(index, collaborator.country || '')}
                                className="p-1 text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                      <tr>
                          <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">
                              No collaborators found.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Bar (Read Only) */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Bar</h3>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="relative mb-4">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ 
                      width: `${(getStepIndex(currentStep) + 1) * 100 / steps.length}%` 
                    }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center cursor-pointer ${isStepCompleted(step) ? 'text-blue-600' : 'text-gray-400'}`}
                    onClick={() => handleStepClick(step)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isStepCompleted(step) ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                      {isStepCompleted(step) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="mt-2 text-sm capitalize">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={handleAskForReview}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ask for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
