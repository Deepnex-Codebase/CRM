import React, { useState } from 'react';
import { 
  Search, Filter, Download, ChevronDown, ChevronUp, 
  Plus, Edit, Trash, ArrowRight, Check, X, Settings
} from 'lucide-react';

const ProfileMapping = () => {
  // Sample data for profile mapping rules
  const [mappingRules, setMappingRules] = useState([
    {
      id: 'PM001',
      name: 'Basic Lead to Customer',
      source_profile: 'Lead',
      target_profile: 'Customer',
      conditions: [
        { field: 'status', operator: 'equals', value: 'Qualified' },
        { field: 'interest_level', operator: 'greater_than', value: '7' }
      ],
      field_mappings: [
        { source_field: 'first_name', target_field: 'first_name', transformation: null },
        { source_field: 'last_name', target_field: 'last_name', transformation: null },
        { source_field: 'email', target_field: 'email', transformation: null },
        { source_field: 'phone', target_field: 'contact_number', transformation: null },
        { source_field: 'company', target_field: 'organization', transformation: null }
      ],
      is_active: true,
      created_by: 'System',
      created_at: '2023-06-15T10:00:00',
      last_run: '2023-07-20T14:30:00',
      conversion_count: 156
    },
    {
      id: 'PM002',
      name: 'Premium Lead to VIP Customer',
      source_profile: 'Lead',
      target_profile: 'VIP Customer',
      conditions: [
        { field: 'status', operator: 'equals', value: 'Qualified' },
        { field: 'interest_level', operator: 'greater_than', value: '8' },
        { field: 'budget', operator: 'greater_than', value: '100000' }
      ],
      field_mappings: [
        { source_field: 'first_name', target_field: 'first_name', transformation: null },
        { source_field: 'last_name', target_field: 'last_name', transformation: null },
        { source_field: 'email', target_field: 'email', transformation: null },
        { source_field: 'phone', target_field: 'primary_contact', transformation: null },
        { source_field: 'company', target_field: 'company_name', transformation: null },
        { source_field: 'budget', target_field: 'spending_capacity', transformation: 'multiply_by_1.5' }
      ],
      is_active: true,
      created_by: 'Vikram Malhotra',
      created_at: '2023-06-20T11:15:00',
      last_run: '2023-07-21T09:45:00',
      conversion_count: 42
    },
    {
      id: 'PM003',
      name: 'Customer to Inactive',
      source_profile: 'Customer',
      target_profile: 'Inactive Customer',
      conditions: [
        { field: 'last_purchase_date', operator: 'older_than', value: '365 days' },
        { field: 'engagement_score', operator: 'less_than', value: '3' }
      ],
      field_mappings: [
        { source_field: 'customer_id', target_field: 'former_customer_id', transformation: null },
        { source_field: 'first_name', target_field: 'first_name', transformation: null },
        { source_field: 'last_name', target_field: 'last_name', transformation: null },
        { source_field: 'email', target_field: 'email', transformation: null },
        { source_field: 'total_purchases', target_field: 'historical_purchases', transformation: null }
      ],
      is_active: false,
      created_by: 'Neha Singh',
      created_at: '2023-07-01T16:20:00',
      last_run: '2023-07-15T23:00:00',
      conversion_count: 78
    }
  ]);

  // Sample profile types
  const profileTypes = ['Lead', 'Prospect', 'Customer', 'VIP Customer', 'Inactive Customer'];
  
  // Sample field definitions for each profile type
  const profileFields = {
    'Lead': ['first_name', 'last_name', 'email', 'phone', 'company', 'source', 'status', 'interest_level', 'budget', 'created_at'],
    'Customer': ['customer_id', 'first_name', 'last_name', 'email', 'contact_number', 'organization', 'join_date', 'total_purchases', 'last_purchase_date', 'engagement_score'],
    'VIP Customer': ['customer_id', 'first_name', 'last_name', 'email', 'primary_contact', 'company_name', 'join_date', 'spending_capacity', 'account_manager', 'loyalty_tier'],
    'Inactive Customer': ['former_customer_id', 'first_name', 'last_name', 'email', 'historical_purchases', 'inactive_reason', 'last_active_date', 'reactivation_attempts']
  };

  // State for filters
  const [filters, setFilters] = useState({
    name: '',
    source_profile: '',
    target_profile: '',
    is_active: ''
  });

  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });

  // State for edit/create modal
  const [showModal, setShowModal] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort rules
  const filteredAndSortedRules = mappingRules
    .filter(rule => {
      const matchesName = filters.name === '' || rule.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesSourceProfile = filters.source_profile === '' || rule.source_profile === filters.source_profile;
      const matchesTargetProfile = filters.target_profile === '' || rule.target_profile === filters.target_profile;
      const matchesActive = filters.is_active === '' || 
        (filters.is_active === 'active' && rule.is_active) || 
        (filters.is_active === 'inactive' && !rule.is_active);
      
      return matchesName && matchesSourceProfile && matchesTargetProfile && matchesActive;
    })
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (key === 'created_at' || key === 'last_run') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      
      if (typeof a[key] === 'number') {
        return sortConfig.direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
      
      return sortConfig.direction === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'Name', 'Source Profile', 'Target Profile', 
      'Conditions', 'Field Mappings', 'Status',
      'Created By', 'Created At', 'Last Run', 'Conversion Count'
    ];
    
    const csvData = filteredAndSortedRules.map(rule => [
      rule.id,
      rule.name,
      rule.source_profile,
      rule.target_profile,
      JSON.stringify(rule.conditions),
      JSON.stringify(rule.field_mappings),
      rule.is_active ? 'Active' : 'Inactive',
      rule.created_by,
      new Date(rule.created_at).toLocaleString(),
      rule.last_run ? new Date(rule.last_run).toLocaleString() : 'Never',
      rule.conversion_count
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `profile_mapping_rules_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Open edit modal
  const openEditModal = (rule) => {
    setCurrentRule({...rule});
    setIsEditing(true);
    setShowModal(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setCurrentRule({
      id: `PM${String(mappingRules.length + 1).padStart(3, '0')}`,
      name: '',
      source_profile: '',
      target_profile: '',
      conditions: [],
      field_mappings: [],
      is_active: true,
      created_by: 'Current User', // Would be replaced with actual logged-in user
      created_at: new Date().toISOString(),
      last_run: null,
      conversion_count: 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Add condition to current rule
  const addCondition = () => {
    setCurrentRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }]
    }));
  };

  // Remove condition from current rule
  const removeCondition = (index) => {
    setCurrentRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  // Update condition
  const updateCondition = (index, field, value) => {
    setCurrentRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  // Add field mapping to current rule
  const addFieldMapping = () => {
    setCurrentRule(prev => ({
      ...prev,
      field_mappings: [...prev.field_mappings, { source_field: '', target_field: '', transformation: null }]
    }));
  };

  // Remove field mapping from current rule
  const removeFieldMapping = (index) => {
    setCurrentRule(prev => ({
      ...prev,
      field_mappings: prev.field_mappings.filter((_, i) => i !== index)
    }));
  };

  // Update field mapping
  const updateFieldMapping = (index, field, value) => {
    setCurrentRule(prev => ({
      ...prev,
      field_mappings: prev.field_mappings.map((mapping, i) => 
        i === index ? { ...mapping, [field]: value } : mapping
      )
    }));
  };

  // Save rule
  const saveRule = () => {
    if (isEditing) {
      setMappingRules(prev => 
        prev.map(rule => rule.id === currentRule.id ? currentRule : rule)
      );
    } else {
      setMappingRules(prev => [...prev, currentRule]);
    }
    setShowModal(false);
  };

  // Delete rule
  const deleteRule = (id) => {
    if (window.confirm('Are you sure you want to delete this mapping rule?')) {
      setMappingRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  // Toggle rule active status
  const toggleRuleStatus = (id) => {
    setMappingRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, is_active: !rule.is_active } : rule
      )
    );
  };

  // Run rule manually
  const runRule = (id) => {
    alert(`Rule ${id} would be executed now. In a real implementation, this would trigger the profile conversion process.`);
    // In a real implementation, this would call an API to execute the rule
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Profile Mapping</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by rule name"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.name}
                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="w-full md:w-auto">
            <button
              onClick={openCreateModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Rule
            </button>
          </div>
          
          <div className="w-full md:w-auto ml-auto">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </button>
          </div>
        </div>
        
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Profile</label>
              <select
                name="source_profile"
                value={filters.source_profile}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Source Profiles</option>
                {profileTypes.map(type => (
                  <option key={`source-${type}`} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Profile</label>
              <select
                name="target_profile"
                value={filters.target_profile}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Target Profiles</option>
                {profileTypes.map(type => (
                  <option key={`target-${type}`} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="is_active"
                value={filters.is_active}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Mapping Rules Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Rule Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('source_profile')}
                >
                  <div className="flex items-center">
                    Source Profile
                    {getSortIcon('source_profile')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('target_profile')}
                >
                  <div className="flex items-center">
                    Target Profile
                    {getSortIcon('target_profile')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conditions
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('is_active')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('is_active')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('conversion_count')}
                >
                  <div className="flex items-center">
                    Conversions
                    {getSortIcon('conversion_count')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('last_run')}
                >
                  <div className="flex items-center">
                    Last Run
                    {getSortIcon('last_run')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rule.source_profile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rule.target_profile}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {rule.conditions.length > 0 ? (
                      <div className="max-w-xs truncate">
                        {rule.conditions.map((condition, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1">
                            {condition.field} {condition.operator} {condition.value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No conditions</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rule.conversion_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rule.last_run ? new Date(rule.last_run).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => runRule(rule.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Run Rule"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`${rule.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={rule.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {rule.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(rule)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Settings className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rules</p>
              <p className="text-2xl font-semibold">{mappingRules.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Rules</p>
              <p className="text-2xl font-semibold">
                {mappingRules.filter(rule => rule.is_active).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Conversions</p>
              <p className="text-2xl font-semibold">
                {mappingRules.reduce((sum, rule) => sum + rule.conversion_count, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Edit className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Profile Types</p>
              <p className="text-2xl font-semibold">
                {profileTypes.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit/Create Modal */}
      {showModal && currentRule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{isEditing ? 'Edit Mapping Rule' : 'Create New Mapping Rule'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Enter rule name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={currentRule.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setCurrentRule({...currentRule, is_active: e.target.value === 'active'})}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Profile</label>
                <select
                  value={currentRule.source_profile}
                  onChange={(e) => {
                    setCurrentRule({
                      ...currentRule, 
                      source_profile: e.target.value,
                      field_mappings: [] // Reset field mappings when source changes
                    });
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select Source Profile</option>
                  {profileTypes.map(type => (
                    <option key={`modal-source-${type}`} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Profile</label>
                <select
                  value={currentRule.target_profile}
                  onChange={(e) => {
                    setCurrentRule({
                      ...currentRule, 
                      target_profile: e.target.value,
                      field_mappings: [] // Reset field mappings when target changes
                    });
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select Target Profile</option>
                  {profileTypes.map(type => (
                    <option key={`modal-target-${type}`} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Conditions Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-medium">Conditions</h4>
                <button
                  onClick={addCondition}
                  className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Condition
                </button>
              </div>
              
              {currentRule.conditions.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No conditions added. This rule will apply to all records.</p>
              ) : (
                <div className="space-y-2">
                  {currentRule.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={condition.field}
                        onChange={(e) => updateCondition(index, 'field', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Select Field</option>
                        {currentRule.source_profile && profileFields[currentRule.source_profile]?.map(field => (
                          <option key={`cond-field-${field}`} value={field}>{field}</option>
                        ))}
                      </select>
                      
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">not equals</option>
                        <option value="greater_than">greater than</option>
                        <option value="less_than">less than</option>
                        <option value="contains">contains</option>
                        <option value="starts_with">starts with</option>
                        <option value="ends_with">ends with</option>
                        <option value="older_than">older than</option>
                        <option value="newer_than">newer than</option>
                      </select>
                      
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Value"
                      />
                      
                      <button
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Field Mappings Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-medium">Field Mappings</h4>
                <button
                  onClick={addFieldMapping}
                  className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                  disabled={!currentRule.source_profile || !currentRule.target_profile}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field Mapping
                </button>
              </div>
              
              {!currentRule.source_profile || !currentRule.target_profile ? (
                <p className="text-sm text-gray-500 italic">Please select source and target profiles first.</p>
              ) : currentRule.field_mappings.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No field mappings added. Add mappings to define how fields are converted.</p>
              ) : (
                <div className="space-y-2">
                  {currentRule.field_mappings.map((mapping, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={mapping.source_field}
                        onChange={(e) => updateFieldMapping(index, 'source_field', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Source Field</option>
                        {currentRule.source_profile && profileFields[currentRule.source_profile]?.map(field => (
                          <option key={`src-field-${field}`} value={field}>{field}</option>
                        ))}
                      </select>
                      
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      
                      <select
                        value={mapping.target_field}
                        onChange={(e) => updateFieldMapping(index, 'target_field', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Target Field</option>
                        {currentRule.target_profile && profileFields[currentRule.target_profile]?.map(field => (
                          <option key={`tgt-field-${field}`} value={field}>{field}</option>
                        ))}
                      </select>
                      
                      <select
                        value={mapping.transformation || ''}
                        onChange={(e) => updateFieldMapping(index, 'transformation', e.target.value || null)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">No Transformation</option>
                        <option value="uppercase">Convert to Uppercase</option>
                        <option value="lowercase">Convert to Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                        <option value="trim">Trim Whitespace</option>
                        <option value="multiply_by_1.5">Multiply by 1.5</option>
                        <option value="divide_by_2">Divide by 2</option>
                        <option value="format_date">Format Date</option>
                        <option value="extract_domain">Extract Email Domain</option>
                      </select>
                      
                      <button
                        onClick={() => removeFieldMapping(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveRule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!currentRule.name || !currentRule.source_profile || !currentRule.target_profile}
              >
                {isEditing ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Profile Mapping</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Profile mapping allows you to define rules for converting contacts from one profile type to another.
                For example, converting qualified leads to customers based on specific criteria.
                Each rule consists of conditions that determine when the conversion should happen and field mappings
                that define how data should be transferred between profile types.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMapping;