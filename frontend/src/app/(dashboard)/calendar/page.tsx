'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'deadline' | 'meeting' | 'milestone' | 'other';
  project?: string;
};

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'other',
    project: ''
  });

  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Project Submission Deadline',
      date: '2024-12-15',
      time: '11:59 PM',
      type: 'deadline',
      project: 'Machine Learning Research'
    },
    {
      id: 2,
      title: 'Team Meeting',
      date: '2024-12-10',
      time: '2:00 PM',
      type: 'meeting',
      project: 'Blockchain Implementation'
    },
    {
      id: 3,
      title: 'Paper Review Deadline',
      date: '2024-12-20',
      time: '5:00 PM',
      type: 'deadline',
      project: 'IoT Sensor Network'
    },
    {
      id: 4,
      title: 'Milestone: Methodology Complete',
      date: '2024-12-12',
      time: 'All Day',
      type: 'milestone',
      project: 'Natural Language Processing'
    },
    {
      id: 5,
      title: 'Conference Registration',
      date: '2024-12-18',
      time: 'All Day',
      type: 'other',
      project: 'Quantum Computing Applications'
    }
  ]);

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'milestone':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleNewEvent = () => {
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert('Please fill in all required fields');
      return;
    }

    const event: Event = {
      id: Date.now(),
      title: newEvent.title!,
      date: newEvent.date!,
      time: newEvent.time || 'All Day',
      type: newEvent.type || 'other',
      project: newEvent.project || undefined
    };

    setEvents([...events, event]);
    setShowEventModal(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'other',
      project: ''
    });
    alert('Event created successfully!');
  };

  // Generate calendar days
  const today = new Date();
  const displayDate = currentDate;
  const currentMonth = displayDate.getMonth();
  const currentYear = displayDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: Array<{ day: number; date: string; isToday: boolean }> = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: 0, date: '', isToday: false });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    calendarDays.push({ day, date: dateStr, isToday });
  }

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'day')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button 
            onClick={handleNewEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white shadow overflow-hidden rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Today
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((calendarDay, index) => {
                const dayEvents = calendarDay.date ? getEventsForDate(calendarDay.date) : [];
                
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-1 border border-gray-200 rounded ${calendarDay.isToday ? 'bg-indigo-50 border-indigo-300' : 'bg-white'}`}
                  >
                    {calendarDay.day > 0 && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${calendarDay.isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {calendarDay.day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate border ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          {event.project && (
                            <p className="text-xs text-gray-500 mt-1">{event.project}</p>
                          )}
                          <div className="flex items-center mt-2 space-x-3">
                            <div className="flex items-center text-xs text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {event.date}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              {event.time}
                            </div>
                          </div>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No upcoming events</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Types Legend */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Event Types</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">Deadline</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">Meeting</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">Milestone</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-3"></div>
                  <span className="text-sm text-gray-700">Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={newEvent.date || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newEvent.time || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  value={newEvent.type || 'other'}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                >
                  <option value="deadline">Deadline</option>
                  <option value="meeting">Meeting</option>
                  <option value="milestone">Milestone</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project (Optional)</label>
                <input
                  type="text"
                  value={newEvent.project || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                  placeholder="Project name"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setNewEvent({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    type: 'other',
                    project: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

