import React, { useState, useEffect } from 'react';
import { X, Key, Calendar, Shield, Eye, EyeOff, Copy, RefreshCw, Save, AlertTriangle, Clock, Globe, Lock, User, Settings } from 'lucide-react';

const TokenForm = ({ token, isOpen, onClose, onSubmit, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_id: '',
    permissions: [],
    scopes: [],
    expires_at: '',
    rate_limit: '',
    ip_whitelist: '',
    environment: 'production',
    auto_rotate: false,
    webhook_url: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  // Mock data for users
  const users = [
    { id: 'user_001', name: 'John Smith', email: 'john@company.com', role: 'Admin' },
    { id: 'user_002', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Developer' },
    { id: 'user_003', name: 'Mike Wilson', email: 'mike@company.com', role: 'API User' },
    { id: 'user_004', name: 'Lisa Brown', email: 'lisa@company.com', role: 'Integration' },
    { id: 'user_005', name: 'David Lee', email: 'david@company.com', role: 'Service Account' }
  ];

  // Available permissions
  const availablePermissions = [
    { id: 'read', name: 'Read', description: 'View data and resources' },
    { id: 'write', name: 'Write', description: 'Create and update resources' },
    { id: 'delete', name: 'Delete', description: 'Remove resources' },
    { id: 'admin', name: 'Admin', description: 'Full administrative access' },
    { id: 'user_management', name: 'User Management', description: 'Manage users and roles' },
    { id: 'analytics', name: 'Analytics', description: 'Access analytics and reports' },
    { id: 'billing', name: 'Billing', description: 'Access billing information' },
    { id: 'webhooks', name: 'Webhooks', description: 'Manage webhook configurations' }
  ];

  // Available scopes
  const availableScopes = [
    { id: 'api:read', name: 'API Read', description: 'Read access to API endpoints' },
    { id: 'api:write', name: 'API Write', description: 'Write access to API endpoints' },
    { id: 'users:read', name: 'Users Read', description: 'Read user information' },
    { id: 'users:write', name: 'Users Write', description: 'Manage user accounts' },
    { id: 'teams:read', name: 'Teams Read', description: 'Read team information' },
    { id: 'teams:write', name: 'Teams Write', description: 'Manage teams' },
    { id: 'devices:read', name: 'Devices Read', description: 'Read device information' },
    { id: 'devices:write', name: 'Devices Write', description: 'Manage devices' },
    { id: 'logs:read', name: 'Logs Read', description: 'Access security logs' },
    { id: 'reports:read', name: 'Reports Read', description: 'Access reports and analytics' }
  ];

  const environments = ['development', 'staging', 'production'];

  useEffect(() => {
    if (token) {
      setFormData({
        name: token.name || '',
        description: token.description || '',
        user_id: token.user_id || '',
        permissions: token.permissions || [],
        scopes: token.scopes || [],
        expires_at: token.expires_at ? token.expires_at.split('T')[0] : '',
        rate_limit: token.rate_limit?.toString() || '',
        ip_whitelist: token.ip_whitelist?.join(', ') || '',
        environment: token.environment || 'production',
        auto_rotate: token.auto_rotate || false,
        webhook_url: token.webhook_url || '',
        notes: token.notes || ''
      });
      setGeneratedToken(token.token || '');
    } else {
      setFormData({
        name: '',
        description: '',
        user_id: '',
        permissions: [],
        scopes: [],
        expires_at: '',
        rate_limit: '',
        ip_whitelist: '',
        environment: 'production',
        auto_rotate: false,
        webhook_url: '',
        notes: ''
      });
      setGeneratedToken('');
    }
    setErrors({});
    setShowToken(false);
  }, [token, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Token name is required';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'User assignment is required';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
    }

    if (formData.scopes.length === 0) {
      newErrors.scopes = 'At least one scope is required';
    }

    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expires_at = 'Expiry date must be in the future';
      }
    }

    if (formData.rate_limit && (isNaN(formData.rate_limit) || parseInt(formData.rate_limit) <= 0)) {
      newErrors.rate_limit = 'Rate limit must be a positive number';
    }

    if (formData.ip_whitelist) {
      const ips = formData.ip_whitelist.split(',').map(ip => ip.trim());
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      const invalidIps = ips.filter(ip => ip && !ipRegex.test(ip));
      if (invalidIps.length > 0) {
        newErrors.ip_whitelist = `Invalid IP addresses: ${invalidIps.join(', ')}`;
      }
    }

    if (formData.webhook_url && !isValidUrl(formData.webhook_url)) {
      newErrors.webhook_url = 'Please enter a valid webhook URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));

    if (errors.permissions) {
      setErrors(prev => ({
        ...prev,
        permissions: ''
      }));
    }
  };

  const handleScopeChange = (scopeId) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scopeId)
        ? prev.scopes.filter(s => s !== scopeId)
        : [...prev.scopes, scopeId]
    }));

    if (errors.scopes) {
      setErrors(prev => ({
        ...prev,
        scopes: ''
      }));
    }
  };

  const generateToken = () => {
    // Generate a random token (in real app, this would be done on the server)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'crm_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedToken(result);
    setShowToken(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform form data to match expected structure
      const tokenData = {
        ...formData,
        rate_limit: formData.rate_limit ? parseInt(formData.rate_limit) : null,
        ip_whitelist: formData.ip_whitelist 
          ? formData.ip_whitelist.split(',').map(ip => ip.trim()).filter(ip => ip)
          : [],
        token: generatedToken || undefined
      };

      await onSubmit(tokenData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save token. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Key className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title || (token ? 'Edit API Token' : 'Create New API Token')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {token ? 'Update token configuration and permissions' : 'Generate a new API token with specific permissions'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm text-red-700 dark:text-red-400">
                    {errors.submit}
                  </div>
                </div>
              </div>
            )}

            {/* Token Generation */}
            {!token && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Token Generation</h4>
                <div className="space-y-4">
                  {!generatedToken ? (
                    <button
                      type="button"
                      onClick={generateToken}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Token
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type={showToken ? 'text' : 'password'}
                            value={generatedToken}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={generateToken}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        ⚠️ Make sure to copy your token now. You won't be able to see it again!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Token Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Token Name *
                  </label>
                  <div className="mt-1 relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.name 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="e.g., Mobile App API Token"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* User Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assigned User *
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.user_id 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    >
                      <option value="">Select User</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.user_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user_id}</p>
                  )}
                </div>

                {/* Environment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Environment
                  </label>
                  <div className="mt-1 relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="environment"
                      value={formData.environment}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {environments.map(env => (
                        <option key={env} value={env}>
                          {env.charAt(0).toUpperCase() + env.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="expires_at"
                      value={formData.expires_at}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.expires_at 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                  </div>
                  {errors.expires_at && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expires_at}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty for no expiration
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe the purpose of this token"
                  />
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Permissions *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="relative">
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.permissions && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
              )}
            </div>

            {/* Scopes */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                API Scopes *
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableScopes.map(scope => (
                  <div key={scope.id} className="relative">
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.scopes.includes(scope.id)}
                        onChange={() => handleScopeChange(scope.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {scope.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {scope.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.scopes && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.scopes}</p>
              )}
            </div>

            {/* Security Settings */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rate Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rate Limit (requests/hour)
                  </label>
                  <div className="mt-1 relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="rate_limit"
                      value={formData.rate_limit}
                      onChange={handleInputChange}
                      min="1"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.rate_limit 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="1000"
                    />
                  </div>
                  {errors.rate_limit && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rate_limit}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty for no rate limit
                  </p>
                </div>

                {/* IP Whitelist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    IP Whitelist
                  </label>
                  <input
                    type="text"
                    name="ip_whitelist"
                    value={formData.ip_whitelist}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.ip_whitelist 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                  {errors.ip_whitelist && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ip_whitelist}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Comma-separated IP addresses. Leave empty to allow all IPs
                  </p>
                </div>

                {/* Webhook URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    name="webhook_url"
                    value={formData.webhook_url}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.webhook_url 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="https://your-app.com/webhooks/token-events"
                  />
                  {errors.webhook_url && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.webhook_url}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Optional webhook URL for token usage notifications
                  </p>
                </div>

                {/* Auto Rotate */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="auto_rotate"
                      checked={formData.auto_rotate}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Enable automatic token rotation (30 days before expiry)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional notes about this token"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!token && !generatedToken)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {token ? 'Update Token' : 'Create Token'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenForm;