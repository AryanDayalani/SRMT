'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

type Collaborator = {
  id: string; // Using string ID as it comes from MongoDB _id usually, or simple index if synthesized
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  country?: string;
  role: string;
  projects: number;
  status: 'active' | 'invited' | 'pending';
};

export default function CollaboratorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'researcher',
    organization: ''
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/projects');
            const projects = res.data;
            
            // Map email to collaborator object to aggregate stats
            const collabMap = new Map<string, Collaborator>();

            projects.forEach((p: any) => {
                if (p.collaborators) {
                    p.collaborators.forEach((c: any) => {
                        const email = c.email;
                        if (!collabMap.has(email)) {
                            collabMap.set(email, {
                                id: c._id || Math.random().toString(36).substr(2, 9),
                                firstName: c.name.split(' ')[0] || '',
                                lastName: c.name.split(' ').slice(1).join(' ') || '',
                                email: email,
                                organization: c.organization || 'N/A',
                                country: c.country || '',
                                role: c.role,
                                projects: 0,
                                status: 'active' // Assuming active if they are in a project
                            });
                        }
                        const existing = collabMap.get(email)!;
                        existing.projects += 1;
                    });
                }
            });
            
            setCollaborators(Array.from(collabMap.values()));
        } catch (error) {
            console.error("Failed to fetch collaborators", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchCollaborators();
  }, []);


  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'primary': return 'bg-purple-100 text-purple-800';
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'reviewer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusBadgeColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  const handleSendInvite = () => {
    if (!inviteData.email || !inviteData.firstName || !inviteData.lastName) {
      alert('Please fill in all required fields');
      return;
    }
    // Backend API would need an invitation endpoint
    alert(`Invitation feature under construction. Would send to ${inviteData.email}!`);
    setShowInviteModal(false);
    setInviteData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'researcher',
      organization: ''
    });
  };

  const filteredCollaborators = collaborators.filter((collaborator) => {
    const matchesSearch = 
      `${collaborator.firstName} ${collaborator.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborator.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || collaborator.role === filterRole;
    const matchesStatus = filterStatus === 'all' || collaborator.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

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
          <h1 className="text-2xl font-semibold text-gray-900">Collaborators</h1>
        </div>
        <button 
          onClick={handleInvite}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Invite Collaborator
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 text-gray-900 bg-white"
                placeholder="Search by name, email, or organization"
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="primary">Primary</option>
              <option value="researcher">Researcher</option>
              <option value="guide">Guide</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">Total Collaborators</p>
                <p className="text-xl text-black font-semibold mt-1">{isLoading ? '...' : collaborators.length}</p>
            </div>
            </div>
        </div>
         {/* ... (other stats simplified for now as they are derived) */}
      </div>

      {/* Collaborators List */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All Collaborators ({filteredCollaborators.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collaborator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredCollaborators.length > 0 ? (
                filteredCollaborators.map((collaborator) => (
                  <tr key={collaborator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                            {getInitials(collaborator.firstName, collaborator.lastName)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {collaborator.firstName} {collaborator.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{collaborator.email}</div>
                          {collaborator.country && (
                            <div className="text-xs text-gray-400">{collaborator.country}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{collaborator.organization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(collaborator.role)}`}>
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collaborator.projects} {collaborator.projects === 1 ? 'project' : 'projects'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(collaborator.status)}`}>
                        {collaborator.status.charAt(0).toUpperCase() + collaborator.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Actions could go here */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No collaborators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Invite Modal Code (Simplified/Kept similar but connected to handleInvite) ... */}
       {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite Collaborator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={inviteData.firstName}
                    onChange={(e) => setInviteData({ ...inviteData, firstName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={inviteData.lastName}
                    onChange={(e) => setInviteData({ ...inviteData, lastName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                >
                  <option value="researcher">Researcher</option>
                  <option value="primary">Primary</option>
                  <option value="guide">Guide</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={inviteData.organization}
                  onChange={(e) => setInviteData({ ...inviteData, organization: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  placeholder="Organization name"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    role: 'researcher',
                    organization: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
