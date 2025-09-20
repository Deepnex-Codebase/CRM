import React from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  User,
  Calendar,
  Activity,
  Ban,
  CheckCircle,
  XCircle,
  Wifi,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';

const SessionDetails = ({ session, isOpen, onClose, onTerminate, onRefresh }) => {
  if (!isOpen || !session) return null;

  const getDeviceIcon = (deviceType) => {
    switch(deviceType?.toLowerCase()) {
      case 'desktop': return <Monitor className="h-6 w-6 text-gray-600" />;
      case 'mobile': return <Smartphone className="h-6 w-6 text-blue-600" />;
      case 'tablet': return <Tablet className="h-6 w-6 text-green-600" />;
      default: return <Globe className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle
      },
      'Expired': { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        icon: Clock
      },
      'Terminated': { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: XCircle
      }
    };
    
    const config = statusConfig[status] || statusConfig['Expired'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getSessionDuration = () => {
    const loginTime = new Date(session.login_time);
    const lastActivity = new Date(session.last_activity);
    const durationMs = lastActivity - loginTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const isSecurityRisk = () => {
    // Simple security risk assessment
    const suspiciousIPs = ['203.0.113.1', '198.51.100.1'];
    const unknownLocation = session.location.includes('Unknown');
    return suspiciousIPs.includes(session.ip_address) || unknownLocation;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {getDeviceIcon(session.device_type)}
            <div className="ml-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Session Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.username} • {session.device_type}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <button
                onClick={() => onRefresh(session.session_id)}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            )}
            {session.status === 'Active' && !session.is_current && onTerminate && (
              <button
                onClick={() => onTerminate(session.session_id)}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
              >
                <Ban className="h-4 w-4 mr-1" />
                Terminate
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Alert */}
          {isSecurityRisk() && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-sm font-medium text-red-800 dark:text-red-300">
                  Security Alert: This session may pose a security risk
                </span>
              </div>
            </div>
          )}

          {/* Session Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Session Information
              </h4>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(session.status)}
                    {session.is_current && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        <Activity className="h-3 w-3 mr-1" />
                        Current Session
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Session ID</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {session.session_id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">User</span>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {session.username}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getSessionDuration()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Device & Location */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Device & Location
              </h4>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Device Type</span>
                  <div className="flex items-center">
                    {getDeviceIcon(session.device_type)}
                    <span className="text-sm text-gray-900 dark:text-white ml-2">
                      {session.device_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Browser</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {session.browser}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</span>
                  <div className="flex items-center">
                    <Wifi className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                      {session.ip_address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</span>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {session.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Session Timeline
            </h4>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Session Started
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getTimeAgo(session.login_time)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.login_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    session.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Last Activity
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getTimeAgo(session.last_activity)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.last_activity)}
                    </p>
                  </div>
                </div>

                {session.status !== 'Active' && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Session {session.status}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getTimeAgo(session.last_activity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Session was {session.status.toLowerCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Security Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Security Score
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`text-lg font-bold ${
                    isSecurityRisk() ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isSecurityRisk() ? 'High Risk' : 'Low Risk'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Authentication
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Standard Login
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
          {session.status === 'Active' && !session.is_current && onTerminate && (
            <button
              onClick={() => {
                onTerminate(session.session_id);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
            >
              <Ban className="h-4 w-4 mr-2" />
              Terminate Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;