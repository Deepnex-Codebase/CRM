import React, { useState, useEffect } from 'react';
import { X, Users, User, Mail, Phone, MapPin, Calendar, Clock, Shield, Award, Activity, Settings, Edit, Trash2, UserPlus, UserMinus, Eye, EyeOff, MoreVertical, Download, Share2, MessageSquare, Video, FileText, Star, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TeamDetails = ({ team, isOpen, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMemberActions, setShowMemberActions] = useState(null);
  const [teamStats, setTeamStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState({});

  // Mock data for team details
  const mockTeamData = {
    team_001: {
      id: 'team_001',
      name: 'Development Team',
      description: 'Core development team responsible for product development and maintenance',
      department: 'Engineering',
      lead: {
        id: 'user_001',
        name: 'John Smith',
        email: 'john@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'Team Lead',
        phone: '+1 (555) 123-4567'
      },
      members: [
        {
          id: 'user_002',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
          role: 'Senior Developer',
          status: 'active',
          joined_date: '2023-01-15',
          last_active: '2024-01-15 10:30:00',
          permissions: ['read', 'write', 'deploy']
        },
        {
          id: 'user_003',
          name: 'Mike Wilson',
          email: 'mike@company.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          role: 'Frontend Developer',
          status: 'active',
          joined_date: '2023-03-20',
          last_active: '2024-01-15 09:45:00',
          permissions: ['read', 'write']
        },
        {
          id: 'user_004',
          name: 'Emily Davis',
          email: 'emily@company.com',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
          role: 'Backend Developer',
          status: 'inactive',
          joined_date: '2023-02-10',
          last_active: '2024-01-14 16:20:00',
          permissions: ['read', 'write', 'admin']
        }
      ],
      created_date: '2023-01-01',
      status: 'active',
      location: 'San Francisco, CA',
      timezone: 'PST',
      budget: 150000,
      tags: ['development', 'frontend', 'backend', 'agile'],
      permissions: {
        can_edit: true,
        can_delete: true,
        can_add_members: true,
        can_remove_members: true
      }
    }
  };

  const mockStats = {
    total_members: 4,
    active_members: 3,
    projects_count: 8,
    completed_projects: 5,
    avg_performance: 87,
    team_efficiency: 92,
    collaboration_score: 89,
    satisfaction_score: 91
  };

  const mockActivities = [
    {
      id: 'activity_001',
      type: 'member_added',
      user: 'John Smith',
      target: 'Emily Davis',
      action: 'added to team',
      timestamp: '2024-01-15 09:30:00',
      icon: UserPlus,
      color: 'text-green-500'
    },
    {
      id: 'activity_002',
      type: 'project_completed',
      user: 'Sarah Johnson',
      target: 'Mobile App v2.0',
      action: 'completed project',
      timestamp: '2024-01-14 16:45:00',
      icon: CheckCircle,
      color: 'text-blue-500'
    },
    {
      id: 'activity_003',
      type: 'permission_updated',
      user: 'John Smith',
      target: 'Mike Wilson',
      action: 'updated permissions',
      timestamp: '2024-01-14 14:20:00',
      icon: Shield,
      color: 'text-orange-500'
    },
    {
      id: 'activity_004',
      type: 'meeting_scheduled',
      user: 'Sarah Johnson',
      target: 'Sprint Planning',
      action: 'scheduled team meeting',
      timestamp: '2024-01-14 11:15:00',
      icon: Calendar,
      color: 'text-purple-500'
    },
    {
      id: 'activity_005',
      type: 'document_shared',
      user: 'Emily Davis',
      target: 'API Documentation',
      action: 'shared document',
      timestamp: '2024-01-13 15:30:00',
      icon: FileText,
      color: 'text-indigo-500'
    }
  ];

  const mockProjects = [
    {
      id: 'project_001',
      name: 'Mobile App v2.0',
      status: 'completed',
      progress: 100,
      deadline: '2024-01-15',
      priority: 'high',
      members_assigned: 3
    },
    {
      id: 'project_002',
      name: 'API Redesign',
      status: 'in_progress',
      progress: 75,
      deadline: '2024-02-01',
      priority: 'medium',
      members_assigned: 2
    },
    {
      id: 'project_003',
      name: 'Dashboard Analytics',
      status: 'planning',
      progress: 25,
      deadline: '2024-02-15',
      priority: 'low',
      members_assigned: 4
    }
  ];

  const mockMetrics = {
    productivity: {
      current: 87,
      previous: 82,
      trend: 'up'
    },
    collaboration: {
      current: 89,
      previous: 91,
      trend: 'down'
    },
    satisfaction: {
      current: 91,
      previous: 88,
      trend: 'up'
    },
    efficiency: {
      current: 92,
      previous: 89,
      trend: 'up'
    }
  };

  useEffect(() => {
    if (team && isOpen) {
      // Simulate loading team data
      setTeamStats(mockStats);
      setRecentActivities(mockActivities);
      setTeamProjects(mockProjects);
      setTeamMetrics(mockMetrics);
    }
  }, [team, isOpen]);

  const getTeamData = () => {
    return team || mockTeamData.team_001;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMemberAction = (action, memberId) => {
    console.log(`${action} member:`, memberId);
    setShowMemberActions(null);
  };

  const renderTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    }
    return null;
  };

  if (!isOpen) return null;

  const teamData = getTeamData();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {teamData.name}
                </h3>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teamData.status)}`}>
                    {teamData.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {teamData.department}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {teamStats.total_members} members
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {teamData.permissions?.can_edit && (
                <button
                  onClick={() => onEdit && onEdit(teamData)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: Eye },
                  { id: 'members', name: 'Members', icon: Users },
                  { id: 'projects', name: 'Projects', icon: FileText },
                  { id: 'activity', name: 'Activity', icon: Activity },
                  { id: 'metrics', name: 'Metrics', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Team Info */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Team Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{teamData.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Lead</label>
                      <div className="mt-1 flex items-center">
                        {teamData.lead?.avatar ? (
                          <img
                            className="h-6 w-6 rounded-full"
                            src={teamData.lead.avatar}
                            alt={teamData.lead.name}
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {teamData.lead?.name || teamData.team_lead || 'No lead assigned'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                      <div className="mt-1 flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{teamData.location}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
                      <div className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{formatDate(teamData.created_date)}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                      <div className="mt-1 flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{teamData.timezone}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
                      <span className="mt-1 text-sm text-gray-900 dark:text-white">${teamData.budget?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Total Members
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              {teamStats.total_members}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Active Members
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              {teamStats.active_members}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Projects
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              {teamStats.projects_count}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Star className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                              Performance
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              {teamStats.avg_performance}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {teamData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                {/* Team Lead */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Team Lead
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      {teamData.lead?.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full"
                          src={teamData.lead.avatar}
                          alt={teamData.lead.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {teamData.lead?.name || teamData.team_lead || 'No lead assigned'}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {teamData.lead?.role || 'Team Lead'}
                        </p>
                        <div className="flex items-center mt-1 space-x-4">
                          {teamData.lead?.email && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{teamData.lead.email}</span>
                            </div>
                          )}
                          {teamData.lead?.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{teamData.lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Video className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white dark:bg-gray-700 shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Team Members</h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {teamData.members?.map((member) => (
                      <div key={member.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={member.avatar}
                              alt={member.name}
                            />
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</h5>
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                  {member.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                              <div className="flex items-center mt-1 space-x-4">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{member.email}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Joined {formatDate(member.joined_date)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Last active {formatDateTime(member.last_active)}</span>
                                </div>
                              </div>
                              <div className="flex items-center mt-2">
                                <Shield className="h-3 w-3 text-gray-400 mr-1" />
                                <div className="flex space-x-1">
                                  {member.permissions?.map((permission, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                    >
                                      {permission}
                                    </span>
                                  )) || (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">No permissions assigned</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Video className="h-4 w-4" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setShowMemberActions(showMemberActions === member.id ? null : member.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {showMemberActions === member.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleMemberAction('edit', member.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                      <Edit className="h-4 w-4 inline mr-2" />
                                      Edit Member
                                    </button>
                                    <button
                                      onClick={() => handleMemberAction('permissions', member.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                      <Shield className="h-4 w-4 inline mr-2" />
                                      Manage Permissions
                                    </button>
                                    <button
                                      onClick={() => handleMemberAction('remove', member.id)}
                                      className="block px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                      <UserMinus className="h-4 w-4 inline mr-2" />
                                      Remove from Team
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-700 shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Team Projects</h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {teamProjects.map((project) => (
                      <div key={project.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</h5>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                              </span>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="text-gray-900 dark:text-white">{project.progress}%</span>
                              </div>
                              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Due {formatDate(project.deadline)}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{project.members_assigned} members</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-700 shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h4>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <Icon className={`h-5 w-5 ${activity.color}`} />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDateTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(teamMetrics).map(([key, metric]) => (
                    <div key={key} className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate capitalize">
                              {key}
                            </dt>
                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                              {metric.current}%
                            </dd>
                          </div>
                          <div className="flex items-center">
                            {renderTrendIcon(metric.trend)}
                            <span className={`ml-1 text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                              {Math.abs(metric.current - metric.previous)}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${metric.current}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Trends</h4>
                  <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">Performance chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {teamData.permissions?.can_delete && (
                <button
                  onClick={() => onDelete && onDelete(teamData)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Team
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;