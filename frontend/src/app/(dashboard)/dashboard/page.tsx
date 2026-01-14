'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';

// Simple stat card component
const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl text-black font-semibold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Project card component
const ProjectCard = ({ 
  title, 
  phase, 
  deadline, 
  collaborators, 
  status,
  projectId
}: { 
  title: string; 
  phase: string; 
  deadline: string; 
  collaborators: number; 
  status: 'Completed' | 'Pending' | 'Ongoing';
  projectId?: number;
}) => {
  const statusColors = {
    Completed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Ongoing: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-l text-black font-medium">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors['Ongoing']}`}>
            {status}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">Phase:</span>
            <span className="font-medium text-black">{phase}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">Deadline:</span>
            <span className="font-medium text-black">{deadline}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">Collaborators:</span>
            <span className="font-medium text-black">{collaborators}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <Link 
          href={projectId ? `/projects/${projectId}` : "/projects"}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completed: 0,
    inProgress: 0,
    collaborators: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/projects');
            const projects = res.data;

             // Calculate stats
            const total = projects.length;
            const completed = projects.filter((p: any) => p.status === 'Completed').length;
            const inProgress = projects.filter((p: any) => p.status === 'Ongoing' || !p.status || p.status === 'In Progress').length;
            
            // Count unique collaborators across all projects
            const uniqueEmails = new Set();
            projects.forEach((p: any) => {
                if (p.collaborators) {
                    p.collaborators.forEach((c: any) => uniqueEmails.add(c.email));
                }
            });
            const collaboratorsCount = uniqueEmails.size;

            setStats({
                totalProjects: total,
                completed,
                inProgress,
                collaborators: collaboratorsCount
            });

            // Recent projects (last 3)
            const formattedRecent = projects.slice(-3).reverse().map((p: any) => ({
                id: p._id,
                title: p.name,
                phase: p.status || 'Ongoing',
                deadline: p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A',
                collaborators: p.collaborators?.length || 0,
                status: p.status || 'Ongoing'
            }));
            
            setRecentProjects(formattedRecent);

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchDashboardData();
  }, []);

  // Function to handle template download
  const handleTemplateDownload = (templateName: string) => {
    alert(`Downloading ${templateName} template...`);
  };

  // Icons for stat cards
  const projectsIcon = (
    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );

  const completedIcon = (
    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const pendingIcon = (
    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const collaboratorsIcon = (
    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link 
          href="/projects/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projects" 
          value={isLoading ? '...' : stats.totalProjects.toString()} 
          icon={projectsIcon} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Completed" 
          value={isLoading ? '...' : stats.completed.toString()} 
          icon={completedIcon} 
          color="bg-green-500" 
        />
        <StatCard 
          title="In Progress" 
          value={isLoading ? '...' : stats.inProgress.toString()} 
          icon={pendingIcon} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="Collaborators" 
          value={isLoading ? '...' : stats.collaborators.toString()} 
          icon={collaboratorsIcon} 
          color="bg-purple-500" 
        />
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Projects</h2>
        {isLoading ? (
             <div className="bg-white p-6 rounded-lg shadow">Loading projects...</div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                title={project.title} 
                phase={project.phase} 
                deadline={project.deadline} 
                collaborators={project.collaborators} 
                status={project.status}
                projectId={project.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
          </div>
        )}
      </div>

      {/* Research Tools */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Research Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg text-black font-medium">Paper Analyzer</h3>
            </div>
            <p className="text-gray-500 mb-4">Analyze your research paper for quality, structure, and readability. Get AI-powered suggestions to improve your work.</p>
            <Link 
              href="/paper-analyzer" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Analyze a paper
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg text-black font-medium">Plagiarism Checker</h3>
            </div>
            <p className="text-gray-500 mb-4">Check your paper for potential plagiarism and AI-generated content. Ensure your work is original and properly cited.</p>
            <Link 
              href="/plagiarism-checker" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Check a paper
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Paper Templates */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Paper Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['IEEE', 'Springer', 'ACM', 'Elsevier'].map((template) => (
             <button 
                key={template}
                onClick={() => handleTemplateDownload(template)}
                className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-xl text-black font-medium mb-2">{template}</div>
                <p className="text-sm text-gray-500">{template} template format</p>
              </button>
          ))}
        </div>
      </div>
    </div>
  );
}
