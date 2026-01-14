'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Task = {
  id: number;
  name: string;
  selected?: boolean;
};

type Checkpoint = {
  id: number;
  name: string;
  completed: boolean;
  date?: string;
};

export default function ProjectProgressPage() {
  const router = useRouter();
  
  // State for project details
  const [projectName, setProjectName] = useState('Project Name');
  const [customTaskName, setCustomTaskName] = useState('');
  const [editingDateIndex, setEditingDateIndex] = useState<number | null>(null);
  const [tempDate, setTempDate] = useState('');
  
  // State for tasks and checkpoints
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Abstract', selected: false },
    { id: 2, name: 'Literature Survey', selected: false },
    { id: 3, name: 'Methodology', selected: false },
    { id: 4, name: 'Result', selected: false },
    { id: 5, name: 'Conclusion', selected: false },
    { id: 6, name: 'References', selected: false }
  ]);
  
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [timeline, setTimeline] = useState<Array<{ name: string; date: string; completed: boolean }>>([]);

  useEffect(() => {
    // Try to get project name from localStorage or URL params
    const savedProjectName = localStorage.getItem('currentProjectName');
    if (savedProjectName) {
      setProjectName(savedProjectName);
    }
    
    // Check URL params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      if (nameParam) {
        setProjectName(nameParam);
      }
    }
  }, []);

  // Get tasks that are not yet in checkpoints
  const availableTasks = tasks.filter(task => 
    !checkpoints.some(checkpoint => checkpoint.name === task.name)
  );

  // Function to toggle task selection
  const toggleTaskSelection = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, selected: !task.selected } : task
    ));
  };

  // Function to toggle checkpoint completion
  const toggleCheckpointCompletion = (id: number) => {
    setCheckpoints(checkpoints.map(checkpoint => 
      checkpoint.id === id ? { ...checkpoint, completed: !checkpoint.completed } : checkpoint
    ));
  };

  // Function to add selected tasks to checkpoints
  const addSelectedTasksToCheckpoints = () => {
    const selectedTasks = availableTasks.filter(task => task.selected);
    if (selectedTasks.length === 0) {
      alert('Please select at least one task to add to checkpoints');
      return;
    }

    const newCheckpoints: Checkpoint[] = selectedTasks.map(task => ({
      id: Date.now() + Math.random(), // Generate unique ID
      name: task.name,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }));

    setCheckpoints([...checkpoints, ...newCheckpoints]);
    
    // Clear selection and remove added tasks from available tasks
    setTasks(tasks.map(task => ({ ...task, selected: false })));
    
    alert(`${selectedTasks.length} task(s) added to checkpoints`);
  };

  // Function to create a custom task
  const createCustomTask = () => {
    if (!customTaskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      name: customTaskName.trim(),
      selected: false
    };

    setTasks([...tasks, newTask]);
    setCustomTaskName('');
  };

  // Function to remove checkpoint
  const removeCheckpoint = (id: number) => {
    setCheckpoints(checkpoints.filter(checkpoint => checkpoint.id !== id));
  };

  // Function to edit checkpoint date
  const startEditingDate = (index: number, currentDate: string) => {
    setEditingDateIndex(index);
    setTempDate(currentDate || '');
  };

  // Function to save checkpoint date
  const saveCheckpointDate = (checkpointId: number) => {
    setCheckpoints(checkpoints.map(checkpoint => 
      checkpoint.id === checkpointId ? { ...checkpoint, date: tempDate } : checkpoint
    ));
    setEditingDateIndex(null);
    setTempDate('');
  };

  // Function to cancel date editing
  const cancelDateEditing = () => {
    setEditingDateIndex(null);
    setTempDate('');
  };

  // Function to save progress and generate timeline
  const saveProgress = () => {
    if (checkpoints.length === 0) {
      alert('Please add at least one checkpoint before saving');
      return;
    }

    // Generate timeline from checkpoints
    const timelineData = checkpoints.map((checkpoint, index) => {
      const daysFromNow = index * 7; // Spread checkpoints weekly
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      
      return {
        name: checkpoint.name,
        date: checkpoint.date || date.toISOString().split('T')[0],
        completed: checkpoint.completed
      };
    });

    setTimeline(timelineData);
    
    // Get project data from create form
    const savedProjectData = localStorage.getItem('currentProjectData');
    let projectFormData: any = {};
    if (savedProjectData) {
      try {
        projectFormData = JSON.parse(savedProjectData);
      } catch (e) {
        console.error('Error parsing project data:', e);
      }
    }

    // Format deadline date
    const lastCheckpointDate = timelineData[timelineData.length - 1]?.date || new Date().toISOString().split('T')[0];
    const deadlineDate = new Date(lastCheckpointDate);
    const formattedDeadline = deadlineDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' -');

    // Save project data to localStorage (in a real app, this would be an API call)
    const projectData = {
      id: Date.now(), // Generate unique ID
      title: projectName,
      description: projectFormData.description || '',
      phase: 'Planning',
      deadline: formattedDeadline,
      deadlineDate: lastCheckpointDate,
      collaborators: projectFormData.collaborators?.length || 1,
      collaboratorsList: projectFormData.collaborators || [],
      guide: projectFormData.collaborators?.find((c: any) => c.role === 'guide')?.name || '',
      status: 'Ongoing' as const,
      track: projectFormData.track || '',
      conference: projectFormData.conference || '',
      format: projectFormData.format || '',
      paperUrl: projectFormData.paperUrl || '',
      timeline: timelineData,
      checkpoints: checkpoints
    };

    // Save to localStorage
    localStorage.setItem('projectTimeline', JSON.stringify(timelineData));
    localStorage.setItem('currentProjectName', projectName);
    
    // Get existing projects and add new one
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    existingProjects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(existingProjects));
    
    alert(`Timeline saved! Redirecting to project details...`);
    
    // Route to project details page
    setTimeout(() => {
      router.push(`/projects/${projectData.id}`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Project Name Header with Back Button */}
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
          <h1 className="text-2xl font-semibold text-gray-900">{projectName}</h1>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Tasks Section (Left Pane) */}
        <div className="flex-1 bg-white shadow overflow-hidden rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{projectName}</h2>
              <button 
                onClick={addSelectedTasksToCheckpoints}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </div>

            {/* Custom Task Input */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTaskName}
                  onChange={(e) => setCustomTaskName(e.target.value)}
                  placeholder="Enter custom task name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      createCustomTask();
                    }
                  }}
                />
                <button
                  onClick={createCustomTask}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {availableTasks.length > 0 ? (
                availableTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 border rounded-md flex items-center justify-between ${
                      task.selected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => toggleTaskSelection(task.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={task.selected || false}
                        onChange={() => toggleTaskSelection(task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-900 flex-1">{task.name}</span>
                      {task.selected && (
                        <span className="ml-2 text-xs text-blue-600 font-medium">Selected</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>All tasks have been added to checkpoints.</p>
                  <p className="text-sm mt-2">Create a custom task to add more.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checkpoints Section (Right Pane) */}
        <div className="flex-1 bg-white shadow overflow-hidden rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Checkpoints</h2>
            
            {checkpoints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No checkpoints yet.</p>
                <p className="text-sm mt-2">Select tasks from the left and click "Add Task" to create checkpoints.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {checkpoints.map((checkpoint, index) => (
                  <div key={checkpoint.id} className="p-4 border border-gray-200 rounded-md flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={checkpoint.completed}
                        onChange={() => toggleCheckpointCompletion(checkpoint.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-gray-900">{checkpoint.name}</span>
                        {editingDateIndex === index ? (
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="date"
                              value={tempDate}
                              onChange={(e) => setTempDate(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  saveCheckpointDate(checkpoint.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => saveCheckpointDate(checkpoint.id)}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelDateEditing}
                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              {checkpoint.date || 'No date set'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {editingDateIndex !== index && (
                        <button 
                          onClick={() => startEditingDate(index, checkpoint.date || '')}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit deadline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={() => removeCheckpoint(checkpoint.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove checkpoint"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      {timeline.length > 0 && (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Timeline</h2>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className={`w-3 h-3 rounded-full mr-3 ${item.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <span className={`text-gray-900 ${item.completed ? 'line-through' : ''}`}>{item.name}</span>
                    <span className="ml-3 text-sm text-gray-500">{item.date}</span>
                  </div>
                  {item.completed && (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveProgress}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Timeline
        </button>
      </div>
    </div>
  );
}
