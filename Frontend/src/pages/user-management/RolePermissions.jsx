import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  Settings,
  Eye,
  Check,
  X,
  Lock,
  FileText,
  BarChart3,
  Building2
} from 'lucide-react';
import RoleForm from './components/RoleForm';
import RoleDetails from './components/RoleDetails';

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for roles
  const mockRoles = [
    {
      role_id: 1,
      role_name: 'Admin',
      description: 'Full system access with all permissions',
      user_count: 2,
      created_at: '2024-01-15',
      permissions: {
        dashboard: { read: true, write: true, delete: true, approve: true },
        users: { read: true, write: true, delete: true, approve: true },
        leads: { read: true, write: true, delete: true, approve: true },
        companies: { read: true, write: true, delete: true, approve: true },
        reports: { read: true, write: true, delete: true, approve: true },
        analytics: { read: true, write: true, delete: true, approve: true },
        settings: { read: true, write: true, delete: true, approve: true }
      }
    },
    {
      role_id: 2,
      role_name: 'Manager',
      description: 'Department management with limited admin access',
      user_count: 5,
      created_at: '2024-01-16',
      permissions: {
        dashboard: { read: true, write: true, delete: false, approve: true },
        users: { read: true, write: false, delete: false, approve: false },
        leads: { read: true, write: true, delete: true, approve: true },
        companies: { read: true, write: true, delete: false, approve: true },
        reports: { read: true, write: true, delete: false, approve: false },
        analytics: { read: true, write: false, delete: false, approve: false },
        settings: { read: true, write: false, delete: false, approve: false }
      }
    },
    {
      role_id: 3,
      role_name: 'Staff',
      description: 'Basic access for daily operations',
      user_count: 12,
      created_at: '2024-01-17',
      permissions: {
        dashboard: { read: true, write: false, delete: false, approve: false },
        users: { read: false, write: false, delete: false, approve: false },
        leads: { read: true, write: true, delete: false, approve: false },
        companies: { read: true, write: false, delete: false, approve: false },
        reports: { read: true, write: false, delete: false, approve: false },
        analytics: { read: false, write: false, delete: false, approve: false },
        settings: { read: false, write: false, delete: false, approve: false }
      }
    }
  ];

  // Module definitions
  const modules = [
    { key: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'Main dashboard and overview' },
    { key: 'users', name: 'User Management', icon: Users, description: 'Manage system users and roles' },
    { key: 'leads', name: 'Leads', icon: Users, description: 'Lead management and tracking' },
    { key: 'companies', name: 'Companies', icon: Building2, description: 'Company and client management' },
    { key: 'reports', name: 'Reports', icon: FileText, description: 'Generate and view reports' },
    { key: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Data analytics and insights' },
    { key: 'settings', name: 'Settings', icon: Settings, description: 'System configuration' }
  ];

  useEffect(() => {
    setRoles(mockRoles);
  }, []);

  const filteredRoles = roles.filter(role =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    );
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setShowRoleDetails(true);
  };

  const handleManagePermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedRole) {
        // Update existing role
        const updatedRole = {
          ...selectedRole,
          ...formData,
          updated_at: new Date().toISOString()
        };
        
        setRoles(roles.map(role => 
          role.role_id === selectedRole.role_id ? updatedRole : role
        ));
        
        alert('Role updated successfully!');
      } else {
        // Create new role
        const newRole = {
          role_id: Math.max(...roles.map(r => r.role_id)) + 1,
          ...formData,
          user_count: 0,
          created_at: new Date().toISOString()
        };
        
        setRoles([...roles, newRole]);
        alert('Role created successfully!');
      }
      
      setShowRoleModal(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
      throw error;
    }
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find(r => r.role_id === roleId);
    const confirmMessage = role?.user_count > 0 
      ? `Are you sure you want to delete "${role.role_name}"? This role is currently assigned to ${role.user_count} user(s). This action cannot be undone.`
      : `Are you sure you want to delete "${role?.role_name}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      setRoles(roles.filter(role => role.role_id !== roleId));
      alert('Role deleted successfully!');
    }
  };

  const PermissionMatrix = ({ role }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Module
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Read
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Write
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Delete
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Approve
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {modules.map((module) => {
            const permissions = role.permissions[module.key] || {};
            const Icon = module.icon;
            return (
              <tr key={module.key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {module.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {module.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getPermissionIcon(permissions.read)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getPermissionIcon(permissions.write)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getPermissionIcon(permissions.delete)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getPermissionIcon(permissions.approve)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user roles and module permissions (RBAC)
          </p>
        </div>
        <button
          onClick={handleCreateRole}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Roles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {roles.length}
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
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {roles.reduce((sum, role) => sum + role.user_count, 0)}
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
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Modules
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {modules.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.role_id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {role.role_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {role.user_count} users assigned
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewRole(role)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Role Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditRole(role)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Edit Role"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.role_id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {role.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Key Permissions
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(role.permissions).slice(0, 4).map(([module, perms]) => {
                    const hasAnyPermission = Object.values(perms).some(p => p);
                    if (hasAnyPermission) {
                      return (
                        <span key={module} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                          {modules.find(m => m.key === module)?.name || module}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <button
                onClick={() => handleManagePermissions(role)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Lock className="h-4 w-4 mr-2" />
                Manage Permissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Permissions for {selectedRole.role_name}
                </h3>
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <PermissionMatrix role={selectedRole} />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Form Modal */}
      <RoleForm
        role={selectedRole}
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedRole(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Role Details Modal */}
      <RoleDetails
        role={selectedRole}
        isOpen={showRoleDetails}
        onClose={() => {
          setShowRoleDetails(false);
          setSelectedRole(null);
        }}
        onEdit={(role) => {
          setShowRoleDetails(false);
          setSelectedRole(role);
          setShowRoleModal(true);
        }}
      />
    </div>
  );
};

export default RolePermissions;