import { API_URL } from '../lib/api-config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import { 
  Calendar, Plus, ArrowLeft, AlertCircle, CheckCircle2, Clock, 
  Filter, Search, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
}

interface Deadline {
  id: number;
  client_id: number;
  client_name: string;
  title: string;
  description: string;
  deadline_date: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  created_at: string;
}

// Mini Calendar Component
function MiniCalendar({ deadlines, onDateClick }: { deadlines: Deadline[], onDateClick: (date: Date) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getDeadlinesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return deadlines.filter(d => d.deadline_date.split('T')[0] === dateStr);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayDeadlines = getDeadlinesForDate(date);
    const isToday = new Date().toDateString() === date.toDateString();
    const hasHighPriority = dayDeadlines.some(d => d.priority === 'high');
    const hasMediumPriority = dayDeadlines.some(d => d.priority === 'medium');
    
    days.push(
      <button
        key={day}
        onClick={() => onDateClick(date)}
        className={`aspect-square p-1 rounded-lg text-sm flex flex-col items-center justify-center transition-colors relative ${
          isToday ? 'bg-blue-100 font-bold text-blue-600' : 'hover:bg-slate-100'
        } ${dayDeadlines.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className={isToday ? 'text-blue-600' : 'text-slate-700'}>{day}</span>
        {dayDeadlines.length > 0 && (
          <div className="flex gap-0.5 mt-1">
            {hasHighPriority && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
            {hasMediumPriority && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>}
            {!hasHighPriority && !hasMediumPriority && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={previousMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="font-semibold text-slate-900">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-slate-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComplianceCalendar() {
  const router = useRouter();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredDeadlines, setFilteredDeadlines] = useState<Deadline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    deadline_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending'
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  useEffect(() => {
    let filtered = deadlines;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.client_name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(d => d.priority === filterPriority);
    }

    setFilteredDeadlines(filtered);
  }, [searchQuery, filterPriority, deadlines]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const [deadlinesRes, clientsRes] = await Promise.all([
        fetch(`${API_URL}/api/deadlines`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/clients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const deadlinesData = await deadlinesRes.json();
      const clientsData = await clientsRes.json();

      if (deadlinesData.success) {
        setDeadlines(deadlinesData.deadlines);
        setFilteredDeadlines(deadlinesData.deadlines);
      }
      if (clientsData.success) {
        setClients(clientsData.clients);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDeadline = () => {
    setEditingDeadline(null);
    setFormData({
      client_id: '',
      title: '',
      description: '',
      deadline_date: '',
      priority: 'medium',
      status: 'pending'
    });
    setShowModal(true);
  };

  const handleEditDeadline = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setFormData({
      client_id: deadline.client_id.toString(),
      title: deadline.title,
      description: deadline.description,
      deadline_date: deadline.deadline_date.split('T')[0],
      priority: deadline.priority,
      status: deadline.status
    });
    setShowModal(true);
  };

  const handleSaveDeadline = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingDeadline 
        ? `${API_URL}/api/deadlines/${editingDeadline.id}`
        : `${API_URL}/api/deadlines`;
      
      const response = await fetch(url, {
        method: editingDeadline ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          client_id: parseInt(formData.client_id)
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        loadData();
      }
    } catch (error) {
      console.error('Failed to save deadline:', error);
    }
  };

  const handleDeleteDeadline = async (id: number) => {
    if (!confirm('Are you sure you want to delete this deadline?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/deadlines/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to delete deadline:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntil = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Compliance Calendar</h1>
                <p className="text-sm text-slate-600">Track and manage compliance deadlines</p>
              </div>
            </div>
            <button
              onClick={handleAddDeadline}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Deadline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deadlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{deadlines.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">High Priority</p>
                <p className="text-2xl font-bold text-slate-900">
                  {deadlines.filter(d => d.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Due Soon</p>
                <p className="text-2xl font-bold text-slate-900">
                  {deadlines.filter(d => getDaysUntil(d.deadline_date) <= 7 && getDaysUntil(d.deadline_date) >= 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {deadlines.filter(d => d.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Deadlines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mini Calendar */}
          <div className="lg:col-span-1">
            <MiniCalendar deadlines={deadlines} onDateClick={(date) => {
              const dateStr = date.toISOString().split('T')[0];
              const deadline = deadlines.find(d => d.deadline_date.split('T')[0] === dateStr);
              if (deadline) {
                handleEditDeadline(deadline);
              }
            }} />
          </div>

          {/* Deadlines List */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-600">Loading deadlines...</p>
              </div>
            ) : filteredDeadlines.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {searchQuery || filterPriority !== 'all' ? 'No deadlines found' : 'No deadlines yet'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery || filterPriority !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first compliance deadline'}
                </p>
                {!searchQuery && filterPriority === 'all' && (
                  <button
                    onClick={handleAddDeadline}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Deadline</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeadlines.map((deadline) => {
                  const daysUntil = getDaysUntil(deadline.deadline_date);
                  const isOverdue = daysUntil < 0;
                  const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

                  return (
                <div
                  key={deadline.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow ${
                    isOverdue ? 'border-red-500' : isDueSoon ? 'border-yellow-500' : 'border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{deadline.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{deadline.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(deadline.deadline_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{deadline.client_name}</span>
                        </div>
                        {isOverdue ? (
                          <span className="text-red-600 font-medium">Overdue by {Math.abs(daysUntil)} days</span>
                        ) : daysUntil === 0 ? (
                          <span className="text-yellow-600 font-medium">Due today</span>
                        ) : (
                          <span className={isDueSoon ? 'text-yellow-600 font-medium' : ''}>
                            {daysUntil} days remaining
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditDeadline(deadline)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeadline(deadline.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingDeadline ? 'Edit Deadline' : 'Add New Deadline'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Client *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tax filing deadline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deadline Date *
                </label>
                <input
                  type="date"
                  value={formData.deadline_date}
                  onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {editingDeadline && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeadline}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingDeadline ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
