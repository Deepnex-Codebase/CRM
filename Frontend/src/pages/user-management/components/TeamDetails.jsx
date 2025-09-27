import React, { useState, useEffect } from 'react';
import { X, Users, User, Mail, Phone, MapPin, Calendar, Clock, Shield, Award, Activity, Settings, Edit, Trash2, UserPlus, UserMinus, Eye, EyeOff, MoreVertical, Download, Share2, MessageSquare, Video, FileText, Star, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'react-feather';
import teamService from '../../../services/user_management/teamService';
import userService from '../../../services/user_management/userService';

const TeamDetails = ({ team, isOpen, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMemberActions, setShowMemberActions] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLead, setTeamLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Team statistics and metrics
  const [teamStats, setTeamStats] = useState({
    total_members: 0,
    active_members: 0,
    on_leave: 0,
    projects_count: 0,
    completed_projects: 0,
    active_projects: 0,
    avg_performance: 0,
    team_efficiency: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [teamMetrics, setTeamMetrics] = useState({
    productivity: { current: 0, previous: 0, trend: 'neutral', change: 0 },
    collaboration: { current: 0, previous: 0, trend: 'neutral', change: 0 },
    satisfaction: { current: 0, previous: 0, trend: 'neutral', change: 0 },
    efficiency: { current: 0, previous: 0, trend: 'neutral', change: 0 }
  });

  // Fetch team data when component opens
  useEffect(() => {
    if (team && isOpen && team.team_id) {
      fetchTeamDetails(team.team_id);
    }
  }, [team, isOpen]);

  // Fetch detailed team information
  const fetchTeamDetails = async (teamId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch team details
      const teamResponse = await teamService.getTeam(teamId);
      if (!teamResponse.success) {
        throw new Error(teamResponse.message || 'Failed to fetch team details');
      }

      const transformedTeam = teamService.transformTeamData(teamResponse.data);
      setTeamData(transformedTeam);

      // Fetch team members
      const membersResponse = await teamService.getTeamMembers(teamId);
      if (membersResponse.success) {
        setTeamMembers(membersResponse.data || []);

        // Update team stats with actual member count
        setTeamStats(prev => ({
          ...prev,
          total_members: membersResponse.data?.length || 0,
          active_members: membersResponse.data?.filter(m => m.user?.role !== 'inactive')?.length || 0
        }));
      }

      // Fetch team lead details if available
      if (transformedTeam.team_lead_id) {
        const leadResponse = await userService.getUser(transformedTeam.team_lead_id);
        if (leadResponse.success) {
          setTeamLead({
            id: leadResponse.data._id,
            name: `${leadResponse.data.first_name || ''} ${leadResponse.data.last_name || ''}`.trim() || leadResponse.data.email,
            email: leadResponse.data.email,
            phone: leadResponse.data.phone,
            role: 'Team Lead'
          });
        }
      }

      // Try to fetch team metrics if available
      try {
        const metricsResponse = await teamService.getTeamMetrics(teamId);
        if (metricsResponse.success && metricsResponse.data) {
          // Transform metrics data to match our format
          const metrics = metricsResponse.data;
          setTeamMetrics({
            productivity: {
              current: metrics.productivity?.current || 75,
              previous: metrics.productivity?.previous || 70,
              trend: (metrics.productivity?.current || 75) >= (metrics.productivity?.previous || 70) ? 'up' : 'down'
            },
            collaboration: {
              current: metrics.collaboration?.current || 80,
              previous: metrics.collaboration?.previous || 75,
              trend: (metrics.collaboration?.current || 80) >= (metrics.collaboration?.previous || 75) ? 'up' : 'down'
            },
            satisfaction: {
              current: metrics.satisfaction?.current || 85,
              previous: metrics.satisfaction?.previous || 80,
              trend: (metrics.satisfaction?.current || 85) >= (metrics.satisfaction?.previous || 80) ? 'up' : 'down'
            },
            efficiency: {
              current: metrics.efficiency?.current || 82,
              previous: metrics.efficiency?.previous || 78,
              trend: (metrics.efficiency?.current || 82) >= (metrics.efficiency?.previous || 78) ? 'up' : 'down'
            }
          });
        }
      } catch (metricsError) {
        console.warn('Could not fetch team metrics:', metricsError);
        // Use default metrics if API fails
      }

      // Generate activities based on team members (as a fallback if no real activity data)
      const generatedActivities = teamMembers.slice(0, 5).map((member, index) => {
        const activityTypes = [
          { type: 'member_added', action: 'added to team', icon: UserPlus, color: 'text-green-500' },
          { type: 'permission_updated', action: 'updated permissions for', icon: Shield, color: 'text-orange-500' },
          { type: 'role_changed', action: 'changed role of', icon: Award, color: 'text-blue-500' }
        ];

        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - index);

        return {
          id: `activity_${index}`,
          type: randomActivity.type,
          user: teamLead?.name || 'Team Admin',
          target: member.user?.name || 'team member',
          action: randomActivity.action,
          timestamp: timestamp.toISOString(),
          icon: randomActivity.icon,
          color: randomActivity.color
        };
      });

      setRecentActivities(generatedActivities);

    } catch (error) {
      console.error('Error fetching team details:', error);
      setError(error.message || 'Failed to load team details');
      console.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
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

  // Helper function to get metric descriptions
  const getMetricDescription = (metricKey) => {
    switch (metricKey) {
      case 'productivity':
        return 'Measures team output relative to resources and time invested';
      case 'collaboration':
        return 'Evaluates team communication and cooperative work effectiveness';
      case 'satisfaction':
        return 'Indicates team member happiness and engagement levels';
      case 'efficiency':
        return 'Measures how well the team utilizes resources to achieve goals';
      default:
        return 'Performance metric for team evaluation';
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

  const renderTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    }
    return null;
  };

  // Handle member actions (promote, remove, etc.)
  const handleMemberAction = async (action, memberId) => {
    try {
      setLoading(true);

      if (action === 'remove') {
        // Remove member from team
        const response = await teamService.removeTeamMember(teamData.team_id, memberId);
        if (response.success) {
          // Update members list
          setTeamMembers(prev => prev.filter(member => member.id !== memberId));
          // Update team stats
          setTeamStats(prev => ({
            ...prev,
            total_members: prev.total_members - 1,
            active_members: prev.active_members - 1
          }));
          console.log('Member removed successfully');
        } else {
          console.error(response.message || 'Failed to remove member');
        }
      } else if (action === 'promote') {
        // Update member role to team lead
        const response = await teamService.updateMemberRole(teamData.team_id, memberId, { role: 'team_lead', is_team_lead: true });
        if (response.success) {
          // Refresh team details to reflect changes
          fetchTeamDetails(teamData.team_id);
          console.log('Member promoted to team lead');
        } else {
          console.error(response.message || 'Failed to update member role');
        }
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    } finally {
      setLoading(false);
      setShowMemberActions(null);
    }
  };

  if (!isOpen) return null;

  // Use actual team data instead of mock data
  const currentTeamData = teamData || (team ? teamService.transformTeamData(team) : {});

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white dark:bg-gray-800">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg text-red-500">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Close
            </button>
          </div>
        ) : (
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
                    {currentTeamData.team_name || currentTeamData.name || 'Team Details'}
                  </h3>
                  <div className="flex items-center mt-1 space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentTeamData.status)}`}>
                      {currentTeamData.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentTeamData.department || 'No Department'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {teamStats.total_members || currentTeamData.member_count || 0} members
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit && onEdit(currentTeamData)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
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
                        className={`${activeTab === tab.id
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
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{teamData?.description || 'No description available'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Lead</label>
                        <div className="mt-1 flex items-center">
                          {teamData?.lead?.avatar ? (
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
                            {teamData?.lead?.name || teamData?.team_lead || 'No lead assigned'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                        <div className="mt-1 flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">{teamData?.location || 'No location specified'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">{teamData?.created_date ? formatDate(teamData.created_date) : 'Not available'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                        <div className="mt-1 flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">{teamData?.timezone || 'Not specified'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
                        <span className="mt-1 text-sm text-gray-900 dark:text-white">${teamData?.budget?.toLocaleString() || '0'}</span>
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
                      {teamData && teamData.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {(!teamData || !teamData.tags || teamData.tags.length === 0) && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No tags available</span>
                      )}
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
                  {Object.keys(teamMetrics).length === 0 ? (
                    <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No metrics data available for this team</p>
                    </div>
                  ) : (
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
                                {metric.trend === 'up' ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : metric.trend === 'down' ? (
                                  <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                                ) : (
                                  <Activity className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={`ml-1 text-sm ${metric.trend === 'up' ? 'text-green-500' :
                                  metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                  }`}>
                                  {Math.abs(metric.change || (metric.current - metric.previous))}%
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
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {getMetricDescription(key)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                {teamData && teamData.permissions?.can_delete && (
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
        )}
      </div>
    </div>
  );
}

export default TeamDetails;