import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Copy,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  RefreshCw,
  Settings,
  Globe,
  Lock,
  Unlock,
  Activity,
  BarChart3
} from 'lucide-react';
import TokenDetails from './components/TokenDetails';
import TokenForm from './components/TokenForm';

const ApiTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScope, setFilterScope] = useState('all');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [editingToken, setEditingToken] = useState(null);
  const [showTokenValue, setShowTokenValue] = useState({});
  const [newTokenGenerated, setNewTokenGenerated] = useState(null);

  // Mock data for API tokens
  const mockTokens = [
    {
      token_id: 'token_001',
      token_name: 'Mobile App Production',
      description: 'Production API access for mobile application',
      token_value: 'sk_live_51H7qABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ567',
      user_id: 'user_001',
      user_name: 'John Smith',
      created_at: '2024-01-15T10:30:00Z',
      expires_at: '2024-07-15T10:30:00Z',
      last_used: '2024-03-15T14:22:00Z',
      status: 'Active',
      scopes: ['read:users', 'write:users', 'read:orders', 'write:orders'],
      rate_limit: {
        requests_per_minute: 1000,
        requests_per_hour: 50000,
        requests_per_day: 1000000
      },
      usage_stats: {
        total_requests: 2456789,
        requests_today: 15432,
        requests_this_month: 456789,
        last_request_ip: '192.168.1.100',
        error_rate: 0.02
      },
      permissions: {
        can_read: true,
        can_write: true,
        can_delete: false,
        can_admin: false
      }
    },
    {
      token_id: 'token_002',
      token_name: 'Web Dashboard',
      description: 'API access for web dashboard analytics',
      token_value: 'sk_test_51H7qABC789DEF012GHI345JKL678MNO901PQR234STU567VWX890YZ123',
      user_id: 'user_002',
      user_name: 'Sarah Johnson',
      created_at: '2024-02-01T09:15:00Z',
      expires_at: '2024-08-01T09:15:00Z',
      last_used: '2024-03-15T16:45:00Z',
      status: 'Active',
      scopes: ['read:analytics', 'read:reports', 'read:users'],
      rate_limit: {
        requests_per_minute: 500,
        requests_per_hour: 25000,
        requests_per_day: 500000
      },
      usage_stats: {
        total_requests: 123456,
        requests_today: 2341,
        requests_this_month: 67890,
        last_request_ip: '192.168.1.101',
        error_rate: 0.01
      },
      permissions: {
        can_read: true,
        can_write: false,
        can_delete: false,
        can_admin: false
      }
    },
    {
      token_id: 'token_003',
      token_name: 'Third Party Integration',
      description: 'Limited access for external partner integration',
      token_value: 'sk_live_51H7qABC456DEF789GHI012JKL345MNO678PQR901STU234VWX567YZ890',
      user_id: 'user_003',
      user_name: 'Mike Wilson',
      created_at: '2024-01-20T14:20:00Z',
      expires_at: '2024-04-20T14:20:00Z',
      last_used: '2024-03-10T12:30:00Z',
      status: 'Expired',
      scopes: ['read:products', 'read:orders'],
      rate_limit: {
        requests_per_minute: 100,
        requests_per_hour: 5000,
        requests_per_day: 100000
      },
      usage_stats: {
        total_requests: 45678,
        requests_today: 0,
        requests_this_month: 1234,
        last_request_ip: '203.0.113.45',
        error_rate: 0.05
      },
      permissions: {
        can_read: true,
        can_write: false,
        can_delete: false,
        can_admin: false
      }
    },
    {
      token_id: 'token_004',
      token_name: 'Development Testing',
      description: 'Development environment testing token',
      token_value: 'sk_test_51H7qABC012DEF345GHI678JKL901MNO234PQR567STU890VWX123YZ456',
      user_id: 'user_004',
      user_name: 'Lisa Brown',
      created_at: '2024-03-01T11:00:00Z',
      expires_at: '2024-06-01T11:00:00Z',
      last_used: '2024-03-15T18:15:00Z',
      status: 'Active',
      scopes: ['read:*', 'write:*'],
      rate_limit: {
        requests_per_minute: 200,
        requests_per_hour: 10000,
        requests_per_day: 200000
      },
      usage_stats: {
        total_requests: 8901,
        requests_today: 234,
        requests_this_month: 5678,
        last_request_ip: '192.168.1.102',
        error_rate: 0.15
      },
      permissions: {
        can_read: true,
        can_write: true,
        can_delete: true,
        can_admin: false
      }
    },
    {
      token_id: 'token_005',
      token_name: 'Suspicious Token',
      description: 'Token showing unusual activity patterns',
      token_value: 'sk_live_51H7qABC999DEF888GHI777JKL666MNO555PQR444STU333VWX222YZ111',
      user_id: 'user_005',
      user_name: 'Unknown User',
      created_at: '2024-03-14T20:00:00Z',
      expires_at: '2024-09-14T20:00:00Z',
      last_used: '2024-03-15T19:45:00Z',
      status: 'Suspended',
      scopes: ['read:users', 'read:orders'],
      rate_limit: {
        requests_per_minute: 50,
        requests_per_hour: 2500,
        requests_per_day: 50000
      },
      usage_stats: {
        total_requests: 50000,
        requests_today: 10000,
        requests_this_month: 50000,
        last_request_ip: '203.0.113.1',
        error_rate: 0.25
      },
      permissions: {
        can_read: true,
        can_write: false,
        can_delete: false,
        can_admin: false
      }
    }
  ];

  const statusTypes = ['Active', 'Expired', 'Suspended', 'Revoked'];
  const scopeTypes = ['read:users', 'write:users', 'read:orders', 'write:orders', 'read:analytics', 'read:reports', 'read:products', 'read:*', 'write:*'];

  useEffect(() => {
    setTokens(mockTokens);
  }, []);

  // Filter tokens based on search, status, and scope
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.token_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.usage_stats.last_request_ip.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || token.status === filterStatus;
    const matchesScope = filterScope === 'all' || token.scopes.includes(filterScope);
    return matchesSearch && matchesStatus && matchesScope;
  });

  // CRUD handlers
  const handleCreateToken = () => {
    setEditingToken(null);
    setShowTokenModal(true);
  };

  const handleViewToken = (token) => {
    setSelectedToken(token);
    setShowTokenDetails(true);
  };

  const handleEditToken = (token) => {
    setEditingToken(token);
    setShowTokenModal(true);
  };

  const handleDeleteToken = (tokenId) => {
    const token = tokens.find(t => t.token_id === tokenId);
    if (window.confirm(`Are you sure you want to revoke token "${token?.token_name}"? This action cannot be undone and will immediately disable API access.`)) {
      setTokens(tokens.filter(t => t.token_id !== tokenId));
      alert('Token revoked successfully');
    }
  };

  const handleSuspendToken = (tokenId) => {
    setTokens(tokens.map(token => 
      token.token_id === tokenId 
        ? { ...token, status: 'Suspended', updated_at: new Date().toISOString() }
        : token
    ));
    alert('Token suspended successfully');
  };

  const handleActivateToken = (tokenId) => {
    setTokens(tokens.map(token => 
      token.token_id === tokenId 
        ? { ...token, status: 'Active', updated_at: new Date().toISOString() }
        : token
    ));
    alert('Token activated successfully');
  };

  const handleCopyToken = (tokenValue) => {
    navigator.clipboard.writeText(tokenValue);
    alert('Token copied to clipboard');
  };

  const toggleTokenVisibility = (tokenId) => {
    setShowTokenValue(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  const handleFormSubmit = (tokenData) => {
    if (editingToken) {
      // Update existing token
      setTokens(tokens.map(token => 
        token.token_id === editingToken.token_id 
          ? { ...token, ...tokenData, updated_at: new Date().toISOString() }
          : token
      ));
      alert('Token updated successfully');
    } else {
      // Create new token
      const newToken = {
        ...tokenData,
        token_id: `token_${Date.now()}`,
        token_value: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created_at: new Date().toISOString(),
        last_used: null,
        usage_stats: {
          total_requests: 0,
          requests_today: 0,
          requests_this_month: 0,
          last_request_ip: null,
          error_rate: 0
        }
      };
      setTokens([...tokens, newToken]);
      setNewTokenGenerated(newToken);
      alert('Token created successfully');
    }
    setShowTokenModal(false);
    setEditingToken(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Expired': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Suspended': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Revoked': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || statusConfig['Expired']}`}>
        {status}
      </span>
    );
  };

  const formatLastUsed = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Expires today';
    if (diffInDays === 1) return 'Expires tomorrow';
    if (diffInDays < 30) return `Expires in ${diffInDays} days`;
    return date.toLocaleDateString();
  };

  const maskToken = (token) => {
    if (token.length <= 8) return token;
    return `${token.substring(0, 8)}...${token.substring(token.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Access Tokens</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage API tokens for secure programmatic access to your CRM data
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleCreateToken}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Token
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Tokens
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tokens.length}
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
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tokens.filter(t => t.status === 'Active').length}
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
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Expiring Soon
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tokens.filter(t => {
                      const daysUntilExpiry = Math.floor((new Date(t.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                    }).length}
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
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Requests Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tokens.reduce((sum, token) => sum + token.usage_stats.requests_today, 0).toLocaleString()}
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
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Suspended
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {tokens.filter(t => t.status === 'Suspended').length}
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
                  placeholder="Search tokens, users, or IP addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-40">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Scopes</option>
                {scopeTypes.map(scope => (
                  <option key={scope} value={scope}>{scope}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Scopes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTokens.map((token) => (
                <tr key={token.token_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <Key className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {token.token_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="font-mono">
                            {showTokenValue[token.token_id] ? token.token_value : maskToken(token.token_value)}
                          </span>
                          <button
                            onClick={() => toggleTokenVisibility(token.token_id)}
                            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showTokenValue[token.token_id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={() => handleCopyToken(token.token_value)}
                            className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{token.user_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{token.usage_stats.last_request_ip || 'No requests'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {token.scopes.slice(0, 2).map((scope, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {scope}
                        </span>
                      ))}
                      {token.scopes.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                          +{token.scopes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {token.usage_stats.requests_today.toLocaleString()} today
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {token.usage_stats.total_requests.toLocaleString()} total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(token.status)}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last used: {formatLastUsed(token.last_used)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatExpiryDate(token.expires_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewToken(token)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Token Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditToken(token)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Edit Token"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {token.status === 'Suspended' ? (
                        <button 
                          onClick={() => handleActivateToken(token.token_id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Activate Token"
                        >
                          <Unlock className="h-4 w-4" />
                        </button>
                      ) : token.status === 'Active' ? (
                        <button 
                          onClick={() => handleSuspendToken(token.token_id)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Suspend Token"
                        >
                          <Lock className="h-4 w-4" />
                        </button>
                      ) : null}
                      <button 
                        onClick={() => handleDeleteToken(token.token_id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Revoke Token"
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

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tokens found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' || filterScope !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by generating your first API token.'
              }
            </p>
            {(!searchTerm && filterStatus === 'all' && filterScope === 'all') && (
              <div className="mt-6">
                <button
                  onClick={handleCreateToken}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Token
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Token Form Modal */}
      {showTokenModal && (
        <TokenForm
          token={editingToken}
          isOpen={showTokenModal}
          onClose={() => {
            setShowTokenModal(false);
            setEditingToken(null);
          }}
          onSubmit={handleFormSubmit}
          title={editingToken ? 'Edit API Token' : 'Generate New API Token'}
        />
      )}

      {/* Token Details Modal */}
      <TokenDetails
        isOpen={showTokenDetails}
        onClose={() => setShowTokenDetails(false)}
        tokenId={selectedToken?.token_id}
      />

      {/* New Token Generated Modal */}
      {newTokenGenerated && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Token Generated Successfully
                </h3>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Important: Save this token now
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This is the only time you'll be able to see the full token. Make sure to copy it and store it securely.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your new API token:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTokenGenerated.token_value}
                    readOnly
                    className="flex-1 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={() => handleCopyToken(newTokenGenerated.token_value)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setNewTokenGenerated(null)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  I've saved the token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTokens;