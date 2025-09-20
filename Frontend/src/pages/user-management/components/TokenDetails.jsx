import React, { useState, useEffect } from 'react';
import { X, Key, Calendar, Activity, Shield, AlertTriangle, Copy, Eye, EyeOff } from 'lucide-react';

const TokenDetails = ({ isOpen, onClose, tokenId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tokenData, setTokenData] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock token data
  const mockTokenData = {
    id: 'token_001',
    name: 'Production API Key',
    token_value: 'sk_live_51H7qYKJ2eZvKYlo2C8ZJQXhYcVSaEiB9qI',
    type: 'API Key',
    status: 'active',
    created_at: '2024-01-15 10:30:00',
    last_used: '2024-01-20 14:22:00',
    expires_at: '2024-12-31 23:59:59',
    permissions: ['read', 'write', 'delete'],
    scope: 'full_access',
    rate_limit: '1000/hour',
    usage_stats: {
      total_requests: 15420,
      requests_today: 234,
      requests_this_month: 8750,
      success_rate: 98.5,
      error_rate: 1.5
    },
    recent_activity: [
      {
        id: 'activity_001',
        action: 'API Call',
        endpoint: '/api/v1/users',
        method: 'GET',
        status: 'success',
        timestamp: '2024-01-20 14:22:00',
        ip_address: '192.168.1.100'
      },
      {
        id: 'activity_002',
        action: 'API Call',
        endpoint: '/api/v1/orders',
        method: 'POST',
        status: 'success',
        timestamp: '2024-01-20 14:15:00',
        ip_address: '192.168.1.100'
      },
      {
        id: 'activity_003',
        action: 'API Call',
        endpoint: '/api/v1/products',
        method: 'GET',
        status: 'error',
        timestamp: '2024-01-20 14:10:00',
        ip_address: '192.168.1.100'
      }
    ],
    security_events: [
      {
        id: 'security_001',
        type: 'Rate Limit Exceeded',
        severity: 'medium',
        timestamp: '2024-01-20 13:45:00',
        details: 'Rate limit of 1000/hour exceeded'
      },
      {
        id: 'security_002',
        type: 'Unusual IP Access',
        severity: 'low',
        timestamp: '2024-01-20 12:30:00',
        details: 'Access from new IP address: 203.0.113.1'
      }
    ]
  };

  useEffect(() => {
    if (isOpen && tokenId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTokenData(mockTokenData);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, tokenId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {loading ? 'Loading...' : tokenData?.name}
              </h2>
              <p className="text-sm text-gray-500">API Token Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Key },
                  { id: 'usage', label: 'Usage Analytics', icon: Activity },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'activity', label: 'Recent Activity', icon: Calendar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Token Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Token Information</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Token Name</label>
                          <p className="mt-1 text-sm text-gray-900">{tokenData.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Token Type</label>
                          <p className="mt-1 text-sm text-gray-900">{tokenData.type}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tokenData.status)}`}>
                            {tokenData.status}
                          </span>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Token Value</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {showToken ? tokenData.token_value : '••••••••••••••••••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => setShowToken(!showToken)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(tokenData.token_value)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Configuration</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Scope</label>
                          <p className="mt-1 text-sm text-gray-900">{tokenData.scope}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rate Limit</label>
                          <p className="mt-1 text-sm text-gray-900">{tokenData.rate_limit}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Permissions</label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {tokenData.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Created</label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(tokenData.created_at)}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Used</label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(tokenData.last_used)}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Expires</label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(tokenData.expires_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{tokenData.usage_stats.total_requests.toLocaleString()}</div>
                      <div className="text-sm text-blue-600">Total Requests</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{tokenData.usage_stats.requests_today}</div>
                      <div className="text-sm text-green-600">Requests Today</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{tokenData.usage_stats.requests_this_month.toLocaleString()}</div>
                      <div className="text-sm text-purple-600">This Month</div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{tokenData.usage_stats.success_rate}%</div>
                      <div className="text-sm text-yellow-600">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Rate Limit Status</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">650 / 1000 requests used this hour</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Security Events</h3>
                  
                  <div className="space-y-3">
                    {tokenData.security_events.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">{event.type}</h4>
                              <p className="text-sm text-gray-600">{event.details}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(event.timestamp)}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  
                  <div className="space-y-3">
                    {tokenData.recent_activity.map((activity) => (
                      <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{activity.method}</span>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{activity.endpoint}</code>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                activity.status === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              From {activity.ip_address} • {formatDate(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;