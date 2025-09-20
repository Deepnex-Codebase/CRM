import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Crown, 
  Star, 
  Award, 
  Briefcase,
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  X, 
  Check, 
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Building,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Settings,
  History,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Layers,
  GitBranch,
  Network,
  Workflow
} from 'lucide-react';

const EmployeeRoleAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showRoleHierarchy, setShowRoleHierarchy] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, hierarchy
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockDepartments = [
    { id: 'dept_001', name: 'Sales', description: 'Sales and Business Development', employee_count: 25, manager: 'John Smith' },
    { id: 'dept_002', name: 'Marketing', description: 'Marketing and Communications', employee_count: 18, manager: 'Sarah Johnson' },
    { id: 'dept_003', name: 'Engineering', description: 'Software Development', employee_count: 45, manager: 'Mike Chen' },
    { id: 'dept_004', name: 'HR', description: 'Human Resources', employee_count: 12, manager: 'Lisa Brown' },
    { id: 'dept_005', name: 'Finance', description: 'Finance and Accounting', employee_count: 15, manager: 'David Wilson' }
  ];

  const mockRoles = [
    { 
      id: 'role_001', 
      name: 'Admin', 
      level: 1, 
      permissions: ['all'], 
      color: 'red',
      description: 'Full system access',
      parent_role: null,
      employee_count: 3
    },
    { 
      id: 'role_002', 
      name: 'Manager', 
      level: 2, 
      permissions: ['manage_team', 'view_reports'], 
      color: 'blue',
      description: 'Team management and reporting',
      parent_role: 'role_001',
      employee_count: 12
    },
    { 
      id: 'role_003', 
      name: 'Team Lead', 
      level: 3, 
      permissions: ['manage_tasks', 'view_team'], 
      color: 'green',
      description: 'Task management and team coordination',
      parent_role: 'role_002',
      employee_count: 18
    },
    { 
      id: 'role_004', 
      name: 'Senior Employee', 
      level: 4, 
      permissions: ['edit_data', 'view_data'], 
      color: 'purple',
      description: 'Senior level access and responsibilities',
      parent_role: 'role_003',
      employee_count: 35
    },
    { 
      id: 'role_005', 
      name: 'Employee', 
      level: 5, 
      permissions: ['view_data'], 
      color: 'gray',
      description: 'Basic employee access',
      parent_role: 'role_004',
      employee_count: 47
    }
  ];

  const mockEmployees = [
    {
      employee_id: 'emp_001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'dept_001',
      current_role: 'role_002',
      hire_date: '2022-01-15',
      status: 'active',
      avatar: null,
      location: 'New York, NY',
      manager: 'emp_010',
      direct_reports: ['emp_015', 'emp_016', 'emp_017'],
      last_role_change: '2023-06-01',
      performance_rating: 4.5,
      access_level: 'high'
    },
    {
      employee_id: 'emp_002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      department: 'dept_002',
      current_role: 'role_002',
      hire_date: '2021-08-20',
      status: 'active',
      avatar: null,
      location: 'Los Angeles, CA',
      manager: 'emp_011',
      direct_reports: ['emp_018', 'emp_019'],
      last_role_change: '2023-03-15',
      performance_rating: 4.8,
      access_level: 'high'
    },
    {
      employee_id: 'emp_003',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      department: 'dept_003',
      current_role: 'role_001',
      hire_date: '2020-03-10',
      status: 'active',
      avatar: null,
      location: 'San Francisco, CA',
      manager: null,
      direct_reports: ['emp_020', 'emp_021', 'emp_022', 'emp_023'],
      last_role_change: '2022-12-01',
      performance_rating: 4.9,
      access_level: 'admin'
    },
    {
      employee_id: 'emp_004',
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      phone: '+1 (555) 456-7890',
      department: 'dept_004',
      current_role: 'role_003',
      hire_date: '2022-05-12',
      status: 'active',
      avatar: null,
      location: 'Chicago, IL',
      manager: 'emp_012',
      direct_reports: ['emp_024', 'emp_025'],
      last_role_change: '2023-09-01',
      performance_rating: 4.3,
      access_level: 'medium'
    },
    {
      employee_id: 'emp_005',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      phone: '+1 (555) 567-8901',
      department: 'dept_005',
      current_role: 'role_004',
      hire_date: '2023-01-08',
      status: 'active',
      avatar: null,
      location: 'Boston, MA',
      manager: 'emp_013',
      direct_reports: [],
      last_role_change: '2023-01-08',
      performance_rating: 4.1,
      access_level: 'medium'
    }
  ];

  const mockAssignmentHistory = [
    {
      history_id: 'hist_001',
      employee_id: 'emp_001',
      employee_name: 'John Smith',
      previous_role: 'role_003',
      new_role: 'role_002',
      changed_by: 'emp_003',
      changed_by_name: 'Mike Chen',
      change_date: '2023-06-01T10:30:00Z',
      reason: 'Promotion to Manager',
      effective_date: '2023-06-01',
      approval_status: 'approved',
      notes: 'Excellent performance and leadership skills demonstrated'
    },
    {
      history_id: 'hist_002',
      employee_id: 'emp_002',
      employee_name: 'Sarah Johnson',
      previous_role: 'role_003',
      new_role: 'role_002',
      changed_by: 'emp_003',
      changed_by_name: 'Mike Chen',
      change_date: '2023-03-15T14:20:00Z',
      reason: 'Department Restructuring',
      effective_date: '2023-03-15',
      approval_status: 'approved',
      notes: 'Role change due to marketing department expansion'
    },
    {
      history_id: 'hist_003',
      employee_id: 'emp_004',
      employee_name: 'Lisa Brown',
      previous_role: 'role_004',
      new_role: 'role_003',
      changed_by: 'emp_003',
      changed_by_name: 'Mike Chen',
      change_date: '2023-09-01T09:15:00Z',
      reason: 'Performance Recognition',
      effective_date: '2023-09-01',
      approval_status: 'approved',
      notes: 'Promoted to Team Lead based on outstanding performance'
    }
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
    setRoles(mockRoles);
    setDepartments(mockDepartments);
    setAssignmentHistory(mockAssignmentHistory);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    const matchesRole = !selectedRole || employee.current_role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'department':
        aValue = getDepartmentName(a.department);
        bValue = getDepartmentName(b.department);
        break;
      case 'role':
        aValue = getRoleName(a.current_role);
        bValue = getRoleName(b.current_role);
        break;
      case 'hire_date':
        aValue = new Date(a.hire_date);
        bValue = new Date(b.hire_date);
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Unknown';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.color : 'gray';
  };

  const getRoleIcon = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return Users;
    
    switch (role.level) {
      case 1: return Crown;
      case 2: return Shield;
      case 3: return Star;
      case 4: return Award;
      default: return Users;
    }
  };

  const handleAssignRole = (employeeId, newRoleId, reason = '') => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedEmployees = employees.map(emp => {
        if (emp.employee_id === employeeId) {
          const previousRole = emp.current_role;
          return {
            ...emp,
            current_role: newRoleId,
            last_role_change: new Date().toISOString().split('T')[0]
          };
        }
        return emp;
      });
      
      setEmployees(updatedEmployees);
      
      // Add to history
      const newHistoryEntry = {
        history_id: `hist_${Date.now()}`,
        employee_id: employeeId,
        employee_name: employees.find(e => e.employee_id === employeeId)?.name,
        previous_role: employees.find(e => e.employee_id === employeeId)?.current_role,
        new_role: newRoleId,
        changed_by: 'current_user',
        changed_by_name: 'Current User',
        change_date: new Date().toISOString(),
        reason: reason || 'Role Assignment',
        effective_date: new Date().toISOString().split('T')[0],
        approval_status: 'approved',
        notes: reason
      };
      
      setAssignmentHistory([newHistoryEntry, ...assignmentHistory]);
      setLoading(false);
      setShowAssignmentModal(false);
      alert('Role assigned successfully!');
    }, 1500);
  };

  const handleBulkAssign = (employeeIds, roleId, reason = '') => {
    setLoading(true);
    
    setTimeout(() => {
      const updatedEmployees = employees.map(emp => {
        if (employeeIds.includes(emp.employee_id)) {
          return {
            ...emp,
            current_role: roleId,
            last_role_change: new Date().toISOString().split('T')[0]
          };
        }
        return emp;
      });
      
      setEmployees(updatedEmployees);
      
      // Add bulk history entries
      const newHistoryEntries = employeeIds.map(empId => ({
        history_id: `hist_${Date.now()}_${empId}`,
        employee_id: empId,
        employee_name: employees.find(e => e.employee_id === empId)?.name,
        previous_role: employees.find(e => e.employee_id === empId)?.current_role,
        new_role: roleId,
        changed_by: 'current_user',
        changed_by_name: 'Current User',
        change_date: new Date().toISOString(),
        reason: reason || 'Bulk Role Assignment',
        effective_date: new Date().toISOString().split('T')[0],
        approval_status: 'approved',
        notes: reason
      }));
      
      setAssignmentHistory([...newHistoryEntries, ...assignmentHistory]);
      setSelectedEmployees([]);
      setLoading(false);
      setShowBulkAssignModal(false);
      alert(`Roles assigned to ${employeeIds.length} employees successfully!`);
    }, 2000);
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getAccessLevelBadge = (level) => {
    const levelConfig = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelConfig[level] || levelConfig['low']}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const RoleHierarchyView = () => {
    const buildHierarchy = (parentRole = null, level = 0) => {
      return roles
        .filter(role => role.parent_role === parentRole)
        .map(role => (
          <div key={role.id} className={`ml-${level * 6}`}>
            <div className="flex items-center py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
              <div className="flex items-center flex-1">
                {React.createElement(getRoleIcon(role.id), { 
                  className: `h-5 w-5 text-${role.color}-600 dark:text-${role.color}-400 mr-3` 
                })}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{role.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {role.employee_count} employees
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Level {role.level}
                </div>
              </div>
            </div>
            {buildHierarchy(role.id, level + 1)}
          </div>
        ));
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Role Hierarchy</h3>
        {buildHierarchy()}
      </div>
    );
  };

  const AssignmentModal = () => {
    const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState('');
    const [assignmentReason, setAssignmentReason] = useState('');
    const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Assign Role
              </h3>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {selectedEmployee && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{selectedEmployee.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current: {getRoleName(selectedEmployee.current_role)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Role
              </label>
              <select
                value={selectedRoleForAssignment}
                onChange={(e) => setSelectedRoleForAssignment(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} (Level {role.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Change
              </label>
              <textarea
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for role assignment..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              onClick={() => setShowAssignmentModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedEmployee && handleAssignRole(selectedEmployee.employee_id, selectedRoleForAssignment, assignmentReason)}
              disabled={!selectedRoleForAssignment || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Assign Role
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Role Assignment</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage employee roles and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRoleHierarchy(!showRoleHierarchy)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
          >
            <Network className="h-4 w-4 mr-2" />
            {showRoleHierarchy ? 'Hide' : 'Show'} Hierarchy
          </button>
          <button
            onClick={() => setShowBulkAssignModal(true)}
            disabled={selectedEmployees.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Bulk Assign ({selectedEmployees.length})
          </button>
        </div>
      </div>

      {/* Role Hierarchy */}
      {showRoleHierarchy && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <RoleHierarchyView />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Employees
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="department-asc">Department (A-Z)</option>
              <option value="role-asc">Role (A-Z)</option>
              <option value="hire_date-desc">Hire Date (Newest)</option>
              <option value="hire_date-asc">Hire Date (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Employees ({sortedEmployees.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Layers className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEmployees.map((employee) => {
                const RoleIcon = getRoleIcon(employee.current_role);
                return (
                  <div key={employee.employee_id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.employee_id)}
                          onChange={() => handleSelectEmployee(employee.employee_id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowAssignmentModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{employee.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <RoleIcon className={`h-4 w-4 text-${getRoleColor(employee.current_role)}-600 dark:text-${getRoleColor(employee.current_role)}-400 mr-2`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {getRoleName(employee.current_role)}
                          </span>
                        </div>
                        {getAccessLevelBadge(employee.access_level)}
                      </div>

                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {getDepartmentName(employee.department)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Hired: {new Date(employee.hire_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {employee.location}
                        </div>
                      </div>

                      {employee.direct_reports.length > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {employee.direct_reports.length} direct reports
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEmployees.map((employee) => {
                const RoleIcon = getRoleIcon(employee.current_role);
                return (
                  <div key={employee.employee_id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.employee_id)}
                          onChange={() => handleSelectEmployee(employee.employee_id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900 dark:text-white">{employee.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {getDepartmentName(employee.department)}
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center">
                            <RoleIcon className={`h-4 w-4 text-${getRoleColor(employee.current_role)}-600 dark:text-${getRoleColor(employee.current_role)}-400 mr-1`} />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {getRoleName(employee.current_role)}
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          {getAccessLevelBadge(employee.access_level)}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowAssignmentModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sortedEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Role Changes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {assignmentHistory.slice(0, 5).map((history) => (
              <div key={history.history_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                    <History className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {history.employee_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getRoleName(history.previous_role)} → {getRoleName(history.new_role)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {history.reason} • {formatTimestamp(history.change_date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Changed by: {history.changed_by_name}
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {history.approval_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAssignmentModal && <AssignmentModal />}
      
      {showBulkAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bulk Role Assignment
                </h3>
                <button
                  onClick={() => setShowBulkAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected Employees ({selectedEmployees.length})
                </h4>
                <div className="space-y-1">
                  {selectedEmployees.slice(0, 3).map(empId => {
                    const emp = employees.find(e => e.employee_id === empId);
                    return emp ? (
                      <div key={empId} className="text-sm text-gray-600 dark:text-gray-400">
                        {emp.name} - {getRoleName(emp.current_role)}
                      </div>
                    ) : null;
                  })}
                  {selectedEmployees.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{selectedEmployees.length - 3} more...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} (Level {role.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Bulk Assignment
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter reason for bulk role assignment..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkAssignModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkAssign(selectedEmployees, selectedRole, 'Bulk Assignment')}
                disabled={!selectedRole || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Assign to {selectedEmployees.length} Employees
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRoleAssignment;