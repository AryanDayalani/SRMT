'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  registrationNumber?: string;
  facultyId?: string;
  phoneNumber?: string;
  department?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : 'U';
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
    </div>
  );

  if (!profile) return <div className="p-6">User not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header / Profile Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-indigo-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md">
                {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <span className="text-3xl">{getInitials(profile.name || profile.email)}</span>
                )}
            </div>
            <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name || 'User'}</h1>
                <p className="text-sm font-medium text-indigo-600 capitalize">{profile.role}</p>
            </div>
            <div className="ml-auto mb-1">
                <button 
                    onClick={() => window.location.href = '/settings'}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Edit Profile
                </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-8 text-sm text-gray-600 mt-2">
            <div className="flex items-center mt-2 sm:mt-0">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile.email}
            </div>
             {profile.phoneNumber && (
                <div className="flex items-center mt-2 sm:mt-0">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profile.phoneNumber}
                </div>
            )}
            {profile.department && (
                 <div className="flex items-center mt-2 sm:mt-0">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {profile.department}
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Academic Details */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
             <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{profile.role}</dd>
                </div>
                {profile.role === 'researcher' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.registrationNumber || 'Not provided'}</dd>
                  </div>
                )}
                 {profile.role === 'guide' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Faculty ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.facultyId || 'Not provided'}</dd>
                  </div>
                )}
                <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.department || 'Not designated'}</dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">Organization</dt>
                    <dd className="mt-1 text-sm text-gray-900">University Institute of Tech</dd>
                </div>
                <div>
                     <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                     <dd className="mt-1 text-sm text-gray-900">Jan 2024</dd>
                </div>
             </dl>
        </div>

        {/* Stats */}
        <div className="bg-white shadow rounded-lg p-6">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Research Overview</h3>
             <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                     <div>
                         <p className="text-sm font-medium text-gray-500">Active Projects</p>
                         <p className="text-2xl font-bold text-indigo-600">0</p>
                     </div>
                     <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                     </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                     <div>
                         <p className="text-sm font-medium text-gray-500">Papers Published</p>
                         <p className="text-2xl font-bold text-green-600">0</p>
                     </div>
                     <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
