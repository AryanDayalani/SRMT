'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function CreateProjectPage() {
  const [collaborators, setCollaborators] = useState<Array<{ id: number; name: string; email: string; role: string; registrationNumber?: string }>>([]);
  const [newCollaborator, setNewCollaborator] = useState({ name: '', email: '', role: 'researcher', registrationNumber: '' });

  const handleAddCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email && newCollaborator.role) {
      setCollaborators([
        ...collaborators,
        {
          id: Date.now(),
          name: newCollaborator.name,
          email: newCollaborator.email,
          role: newCollaborator.role,
          registrationNumber: newCollaborator.registrationNumber
        }
      ]);
      setNewCollaborator({ name: '', email: '', role: 'researcher', registrationNumber: '' });
    }
  };

  const handleRemoveCollaborator = (id: number) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Collect all form data
    const projectData = {
      name: formData.get('project-name') as string,
      description: formData.get('description') as string,
      track: formData.get('track') as string,
      format: formData.get('format') as string,
      conference: formData.get('conference') as string,
      deadline: formData.get('deadline') as string,
      paperUrl: formData.get('paper-url') as string,
      collaborators: collaborators.map(c => ({
        name: c.name,
        email: c.email,
        role: c.role,
        registrationNumber: c.registrationNumber
      }))
    };
    
    try {
        await api.post('/projects', projectData);
        // Redirect to projects list
        window.location.href = '/projects';
    } catch (error) {
        console.error('Failed to create project', error);
        alert('Failed to create project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
        <Link 
          href="/projects" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Project Information</h2>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <div className="mt-1 ">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Brief description of your research project.</p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="track" className="block text-sm font-medium text-gray-700">
                  Research Track
                </label>
                <div className="mt-1">
                  <select
                    id="track"
                    name="track"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a track</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="computing">Computing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Paper Format
                </label>
                <div className="mt-1">
                  <select
                    id="format"
                    name="format"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a format</option>
                    <option value="ieee">IEEE</option>
                    <option value="acm">ACM</option>
                    <option value="springer">Springer</option>
                    <option value="elsevier">Elsevier</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="conference" className="block text-sm font-medium text-gray-700">
                  Target Conference
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="conference"
                    id="conference"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Conference Deadline
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="paper-url" className="block text-sm font-medium text-gray-700">
                  Research Paper URL (Google Docs)
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="paper-url"
                    id="paper-url"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    placeholder="https://docs.google.com/document/d/..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Optional: Link to your research paper Google Doc.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Collaborators</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="collaborator-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="collaborator-name"
                      id="collaborator-name"
                      value={newCollaborator.name}
                      onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="collaborator-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="collaborator-email"
                      id="collaborator-email"
                      value={newCollaborator.email}
                      onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="collaborator-role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="collaborator-role"
                      name="collaborator-role"
                      value={newCollaborator.role}
                      onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                    >
                      <option value="researcher">Researcher</option>
                      <option value="guide">Guide</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="registration-number" className="block text-sm font-medium text-gray-700">
                    Reg. Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="registration-number"
                      id="registration-number"
                      value={newCollaborator.registrationNumber}
                      onChange={(e) => setNewCollaborator({...newCollaborator, registrationNumber: e.target.value})}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm text-black border-gray-300 rounded-md"
                      placeholder="If researcher"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6 sm:col-start-5 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddCollaborator}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Collaborators list */}
              {collaborators.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Added Collaborators</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {collaborators.map((collaborator) => (
                        <li key={collaborator.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                              <p className="text-sm text-gray-500">{collaborator.email}</p>
                              <div className="flex space-x-2 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                                </span>
                                {collaborator.registrationNumber && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Reg: {collaborator.registrationNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link
                href="/projects"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}