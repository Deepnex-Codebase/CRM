import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings,
  Shield,
  Monitor,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  Activity,
  Smartphone,
  Key,
  Lock,
  AlertTriangle,
  UserPlus,
  Clock
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  
  // Check if current path is user management related
  const isUserManagementPath = location.pathname.startsWith('/user-management');
  const [userManagementOpen, setUserManagementOpen] = useState(isUserManagementPath);

  // Auto-open/close User Management dropdown based on current route
  useEffect(() => {
    setUserManagementOpen(isUserManagementPath);
  }, [isUserManagementPath]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Leads', href: '/leads', icon: Users, current: location.pathname === '/leads' },
    { name: 'Companies', href: '/companies', icon: Building2, current: location.pathname === '/companies' },
    { name: 'Reports', href: '/reports', icon: FileText, current: location.pathname === '/reports' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, current: location.pathname === '/analytics' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];

  const userManagementItems = [
    { name: 'Users', href: '/user-management/users', icon: Users, current: location.pathname === '/user-management/users' },
    { name: 'Roles & Permissions', href: '/user-management/roles', icon: Shield, current: location.pathname === '/user-management/roles' },
    { name: 'Teams Management', href: '/user-management/teams', icon: UserCheck, current: location.pathname === '/user-management/teams' },
    { name: 'Employee Roles', href: '/user-management/employee-roles', icon: UserPlus, current: location.pathname === '/user-management/employee-roles' },
    { name: 'Sessions', href: '/user-management/sessions', icon: Monitor, current: location.pathname === '/user-management/sessions' },
    { name: 'Device Registry', href: '/user-management/devices', icon: Smartphone, current: location.pathname === '/user-management/devices' },
    { name: 'API Tokens', href: '/user-management/api-tokens', icon: Key, current: location.pathname === '/user-management/api-tokens' },
    { name: 'Security Logs', href: '/user-management/security-logs', icon: Activity, current: location.pathname === '/user-management/security-logs' },
    { name: 'Security Rules', href: '/user-management/security-rules', icon: Lock, current: location.pathname === '/user-management/security-rules' },
  ];

  const isUserManagementActive = userManagementItems.some(item => item.current);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col
        fixed inset-y-0 left-0 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64  
      `}>
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CRM</span>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4 overflow-y-auto">
          <div className="space-y-2">
            {/* Regular Navigation Items */}
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (isCollapsed) {
                // Collapsed mode - with title under icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex flex-col items-center justify-center px-2 py-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                    onClick={(e) => {
                      // Close mobile sidebar when navigating
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                      
                      // Ensure navigation happens
                      e.stopPropagation();
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 mb-1" />
                    <span className="text-center leading-tight truncate w-full max-w-[3rem]" title={item.name}>
                      {item.name.length > 6 ? `${item.name.substring(0, 6)}...` : item.name}
                    </span>
                  </NavLink>
                );
              }
              
              // Expanded mode - without tooltip
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 mr-3" />
                  {item.name}
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              );
            })}

            {/* User Management Dropdown */}
            <div className="space-y-1">
              {isCollapsed ? (
                // Collapsed mode - show user management items as individual icons
                <div className="space-y-2">
                  {userManagementItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `group relative flex flex-col items-center justify-center px-2 py-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`
                        }
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        title={item.name}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 mb-1" />
                        <span className="text-center leading-tight truncate w-full max-w-[3rem]">
                          {item.name.length > 6 ? `${item.name.substring(0, 6)}...` : item.name}
                        </span>
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              ) : (
                // Expanded mode - show dropdown
                <>
                  <button
                    onClick={() => setUserManagementOpen(!userManagementOpen)}
                    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isUserManagementActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Shield className="h-5 w-5 flex-shrink-0 mr-3" />
                    User Management
                    {userManagementOpen ? (
                      <ChevronUp className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    )}
                  </button>
                  
                  {userManagementOpen && (
                    <div className="ml-6 space-y-1">
                      {userManagementItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                              }`
                            }
                            onClick={() => {
                              // Close mobile sidebar when navigating
                              if (window.innerWidth < 1024) {
                                onClose();
                              }
                            }}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0 mr-3" />
                            {item.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>



        {/* Collapse/Expand Toggle Button - Desktop Only */}
        <div className="hidden lg:block p-4 border-t border-gray-200 dark:border-gray-700">
          
            <button
              onClick={onToggleCollapse}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 mr-3" />
                  Collapse
                </>
              )}
            </button>
         
        </div>
      </div>
    </>
  );
};

export default Sidebar;