import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Ban,
  RefreshCw,
  Users,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';
import SessionDetails from './components/SessionDetails';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('sessions');
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Mock data for active sessions
  const mockSessions = [
    {
      session_id: 'sess_001',
      user_id: 1,
      username: 'admin',
      device_type: 'Desktop',
      browser: 'Chrome 120.0',
      ip_address: '192.168.1.100',
      location: 'Mumbai, India',
      login_time: '2024-01-20 09:30:00',
      last_activity: '2024-01-20 14:45:00',
      status: 'Active',
      is_current: true
    },
    {
      session_id: 'sess_002',
      user_id: 2,
      username: 'manager1',
      device_type: 'Mobile',
      browser: 'Safari 17.0',
      ip_address: '192.168.1.101',
      location: 'Delhi, India',
      login_time: '2024-01-20 08:15:00',
      last_activity: '2024-01-20 14:30:00',
      status: 'Active',
      is_current: false
    },
    {
      session_id: 'sess_003',
      user_id: 3,
      username: 'staff1',
      device_type: 'Tablet',
      browser: 'Firefox 121.0',
      ip_address: '192.168.1.102',
      location: 'Bangalore, India',
      login_time: '2024-01-20 10:00:00',
      last_activity: '2024-01-20 12:00:00',
      status: 'Expired',
      is_current: false
    }
  ];

  // Mock data for login attempts
  const mockLoginAttempts = [
    {
      attempt_id: 1,
      username: 'admin',
      ip_address: '192.168.1.100',
      location: 'Mumbai, India',
      device_type: 'Desktop',
      browser: 'Chrome 120.0',
      attempt_time: '2024-01-20 09:30:00',
      status: 'Success',
      failure_reason: null
    },
    {
      attempt_id: 2,
      username: 'hacker123',
      ip_address: '203.0.113.1',
      location: 'Unknown',
      device_type: 'Desktop',
      browser: 'Chrome 119.0',
      attempt_time: '2024-01-20 14:20:00',
      status: 'Failed',
      failure_reason: 'Invalid credentials'
    },
    {
      attempt_id: 3,
      username: 'manager1',
      ip_address: '192.168.1.101',
      location: 'Delhi, India',
      device_type: 'Mobile',
      browser: 'Safari 17.0',
      attempt_time: '2024-01-20 08:15:00',
      status: 'Success',
      failure_reason: null
    },
    {
      attempt_id: 4,
      username: 'admin',
      ip_address: '198.51.100.1',
      location: 'Unknown Location',
      device_type: 'Desktop',
      browser: 'Chrome 120.0',
      attempt_time: '2024-01-20 13:45:00',
      status: 'Failed',
      failure_reason: 'Suspicious location'
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
    setLoginAttempts(mockLoginAttempts);
  }, []);

  const getDeviceIcon = (deviceType) => {
    switch(deviceType.toLowerCase()) {
      case 'desktop': return <Monitor className="h-5 w-5 text-gray-600" />;
      case 'mobile': return <Smartphone className="h-5 w-5 text-blue-600" />;
      case 'tablet': return <Tablet className="h-5 w-5 text-green-600" />;
      default: return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Expired': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Terminated': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Success': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Failed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses['Expired']}`}>
        {status}
      </span>
    );
  };

  // CRUD handlers
  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const handleTerminateSession = (sessionId) => {
    const session = sessions.find(s => s.session_id === sessionId);
    if (window.confirm(`Are you sure you want to terminate the session for ${session?.username}?`)) {
      setSessions(sessions.map(session => 
        session.session_id === sessionId 
          ? { ...session, status: 'Terminated', last_activity: new Date().toISOString() }
          : session
      ));
      alert('Session terminated successfully');
      
      // Close details modal if the terminated session is currently being viewed
      if (selectedSession?.session_id === sessionId) {
        setShowSessionDetails(false);
        setSelectedSession(null);
      }
    }
  };

  const handleRefreshSession = (sessionId) => {
    // Simulate refreshing session data
    setSessions(sessions.map(session => 
      session.session_id === sessionId 
        ? { ...session, last_activity: new Date().toISOString() }
        : session
    ));
    
    // Update selected session if it's the one being refreshed
    if (selectedSession?.session_id === sessionId) {
      const updatedSession = sessions.find(s => s.session_id === sessionId);
      if (updatedSession) {
        setSelectedSession({ ...updatedSession, last_activity: new Date().toISOString() });
      }
    }
    
    alert('Session data refreshed successfully');
  };

  const handleCloseSessionDetails = () => {
    setShowSessionDetails(false);
    setSelectedSession(null);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.ip_address.includes(searchTerm) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredAttempts = loginAttempts.filter(attempt => {
    const matchesSearch = attempt.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.ip_address.includes(searchTerm) ||
                         attempt.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || attempt.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Session Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor active sessions and security events
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {sessions.filter(s => s.status === 'Active').length}
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
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Successful Logins
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {loginAttempts.filter(a => a.status === 'Success').length}
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
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Failed Attempts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {loginAttempts.filter(a => a.status === 'Failed').length}
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
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Security Alerts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {loginAttempts.filter(a => a.failure_reason === 'Suspicious location').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Sessions
            </button>
            <button
              onClick={() => setActiveTab('attempts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attempts'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Login Attempts
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {activeTab === 'sessions' ? (
                  <>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </>
                ) : (
                  <>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'sessions' ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User & Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location & IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Session Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSessions.map((session) => (
                  <tr key={session.session_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDeviceIcon(session.device_type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {session.username}
                            {session.is_current && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {session.browser}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {session.location}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {session.ip_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            Login: {getTimeAgo(session.login_time)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Active: {getTimeAgo(session.last_activity)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleViewSession(session)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Session Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {session.status === 'Active' && !session.is_current && (
                              <button 
                                onClick={() => handleTerminateSession(session.session_id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Terminate Session"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User & Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location & IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attempt Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.attempt_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDeviceIcon(attempt.device_type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {attempt.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {attempt.browser}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {attempt.location}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {attempt.ip_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getTimeAgo(attempt.attempt_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(attempt.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {attempt.failure_reason || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Session Details Modal */}
      <SessionDetails
        session={selectedSession}
        isOpen={showSessionDetails}
        onClose={handleCloseSessionDetails}
        onTerminate={handleTerminateSession}
        onRefresh={handleRefreshSession}
      />
    </div>
  );
};

export default SessionManagement;