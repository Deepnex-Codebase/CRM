import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  UserMinus,
  Building2,
  MapPin,
  Calendar,
  Activity,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';
import TeamForm from './components/TeamForm';
import TeamDetails from './components/TeamDetails';

const TeamsManagement = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);

  // Mock data for teams
  const mockTeams = [
    {
      team_id: 'team_001',
      team_name: 'Sales Team North',
      department: 'Sales',
      description: 'Handles sales operations for northern region',
      team_lead: 'John Smith',
      team_lead_id: 'user_001',
      member_count: 8,
      territory: 'North India',
      created_at: '2024-01-15T10:30:00Z',
      status: 'Active',
      members: [
        { user_id: 'user_001', name: 'John Smith', role: 'Team Lead', email: 'john@company.com' },
        { user_id: 'user_002', name: 'Sarah Johnson', role: 'Senior Sales Rep', email: 'sarah@company.com' },
        { user_id: 'user_003', name: 'Mike Wilson', role: 'Sales Rep', email: 'mike@company.com' },
        { user_id: 'user_004', name: 'Lisa Brown', role: 'Sales Rep', email: 'lisa@company.com' },
        { user_id: 'user_005', name: 'David Lee', role: 'Sales Rep', email: 'david@company.com' },
        { user_id: 'user_006', name: 'Emma Davis', role: 'Sales Rep', email: 'emma@company.com' },
        { user_id: 'user_007', name: 'Tom Anderson', role: 'Sales Rep', email: 'tom@company.com' },
        { user_id: 'user_008', name: 'Amy Taylor', role: 'Sales Rep', email: 'amy@company.com' }
      ]
    },
    {
      team_id: 'team_002',
      team_name: 'Marketing Team',
      department: 'Marketing',
      description: 'Digital marketing and brand management',
      team_lead: 'Jennifer Wilson',
      team_lead_id: 'user_009',
      member_count: 6,
      territory: 'Pan India',
      created_at: '2024-01-20T14:15:00Z',
      status: 'Active',
      members: [
        { user_id: 'user_009', name: 'Jennifer Wilson', role: 'Marketing Manager', email: 'jennifer@company.com' },
        { user_id: 'user_010', name: 'Alex Chen', role: 'Digital Marketing Specialist', email: 'alex@company.com' },
        { user_id: 'user_011', name: 'Maria Garcia', role: 'Content Creator', email: 'maria@company.com' },
        { user_id: 'user_012', name: 'Ryan Murphy', role: 'SEO Specialist', email: 'ryan@company.com' },
        { user_id: 'user_013', name: 'Sophie Turner', role: 'Social Media Manager', email: 'sophie@company.com' },
        { user_id: 'user_014', name: 'James Rodriguez', role: 'Graphic Designer', email: 'james@company.com' }
      ]
    },
    {
      team_id: 'team_003',
      team_name: 'Support Team',
      department: 'Customer Support',
      description: 'Customer support and technical assistance',
      team_lead: 'Robert Johnson',
      team_lead_id: 'user_015',
      member_count: 12,
      territory: 'Global',
      created_at: '2024-02-01T09:00:00Z',
      status: 'Active',
      members: [
        { user_id: 'user_015', name: 'Robert Johnson', role: 'Support Manager', email: 'robert@company.com' },
        { user_id: 'user_016', name: 'Linda White', role: 'Senior Support Agent', email: 'linda@company.com' },
        { user_id: 'user_017', name: 'Kevin Brown', role: 'Technical Support', email: 'kevin@company.com' }
        // ... more members
      ]
    },
    {
      team_id: 'team_004',
      team_name: 'Development Team',
      department: 'IT',
      description: 'Software development and maintenance',
      team_lead: 'Michael Chang',
      team_lead_id: 'user_020',
      member_count: 10,
      territory: 'Remote',
      created_at: '2024-01-10T11:45:00Z',
      status: 'Active',
      members: [
        { user_id: 'user_020', name: 'Michael Chang', role: 'Tech Lead', email: 'michael@company.com' },
        { user_id: 'user_021', name: 'Anna Kowalski', role: 'Senior Developer', email: 'anna@company.com' },
        { user_id: 'user_022', name: 'Carlos Silva', role: 'Full Stack Developer', email: 'carlos@company.com' }
        // ... more members
      ]
    }
  ];

  const departments = ['Sales', 'Marketing', 'Customer Support', 'IT', 'HR', 'Finance'];

  useEffect(() => {
    setTeams(mockTeams);
  }, []);

  // Filter teams based on search and department
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.team_lead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || team.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // CRUD handlers
  const handleCreateTeam = () => {
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  const handleDeleteTeam = (teamId) => {
    const team = teams.find(t => t.team_id === teamId);
    if (window.confirm(`Are you sure you want to delete team "${team?.team_name}"? This action cannot be undone.`)) {
      setTeams(teams.filter(t => t.team_id !== teamId));
      alert('Team deleted successfully');
    }
  };

  const handleFormSubmit = (teamData) => {
    if (editingTeam) {
      // Update existing team
      setTeams(teams.map(team => 
        team.team_id === editingTeam.team_id 
          ? { ...team, ...teamData, updated_at: new Date().toISOString() }
          : team
      ));
      alert('Team updated successfully');
    } else {
      // Create new team
      const newTeam = {
        ...teamData,
        team_id: `team_${Date.now()}`,
        created_at: new Date().toISOString(),
        member_count: 1, // Team lead
        members: [
          {
            user_id: 'temp_user',
            name: teamData.team_lead,
            role: 'Team Lead',
            email: 'temp@company.com'
          }
        ]
      };
      setTeams([...teams, newTeam]);
      alert('Team created successfully');
    }
    setShowTeamModal(false);
    setEditingTeam(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Suspended': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig['Inactive']}`}>
        {status}
      </span>
    );
  };

  const getDepartmentIcon = (department) => {
    const icons = {
      'Sales': Users,
      'Marketing': Activity,
      'Customer Support': Users,
      'IT': Building2,
      'HR': Users,
      'Finance': Building2
    };
    const Icon = icons[department] || Building2;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teams Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage teams, departments, and team assignments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleCreateTeam}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Teams
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {teams.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Teams
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {teams.filter(t => t.status === 'Active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Departments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Set(teams.map(t => t.department)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {teams.reduce((sum, team) => sum + team.member_count, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Team Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Territory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTeams.map((team) => (
                <tr key={team.team_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          {getDepartmentIcon(team.department)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {team.team_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {team.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDepartmentIcon(team.department)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {team.department}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {team.team_lead}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {team.member_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {team.territory}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(team.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewTeam(team)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Team Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditTeam(team)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Edit Team"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTeam(team.team_id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterDepartment !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new team.'
              }
            </p>
            {(!searchTerm && filterDepartment === 'all') && (
              <div className="mt-6">
                <button
                  onClick={handleCreateTeam}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals will be added here */}
      {/* Team Form Modal */}
      <TeamForm
        team={editingTeam}
        isOpen={showTeamModal}
        onClose={() => {
          setShowTeamModal(false);
          setEditingTeam(null);
        }}
        onSubmit={(teamData) => {
          handleFormSubmit(teamData);
        }}
        title={editingTeam ? 'Edit Team' : 'Create New Team'}
      />

      {/* Team Details Modal */}
      <TeamDetails
        team={selectedTeam}
        isOpen={showTeamDetails}
        onClose={() => setShowTeamDetails(false)}
        onEdit={(team) => {
          setShowTeamDetails(false);
          setEditingTeam(team);
          setShowTeamModal(true);
        }}
        onDelete={(team) => {
          setShowTeamDetails(false);
          handleDeleteTeam(team);
        }}
      />
    </div>
  );
};

export default TeamsManagement;