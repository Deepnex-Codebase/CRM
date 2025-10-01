import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp, Clock, FileText, User, Edit } from 'lucide-react';

const AuditLog = () => {
  // Sample data for demonstration
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AL001',
      enquiry_id: 'ENQ001',
      entity_type: 'Enquiry',
      action: 'Create',
      field: null,
      old_value: null,
      new_value: null,
      performed_by: 'System',
      performed_at: '2023-07-10T09:30:00',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    {
      id: 'AL002',
      enquiry_id: 'ENQ001',
      entity_type: 'Enquiry',
      action: 'Update',
      field: 'status',
      old_value: 'New',
      new_value: 'In Progress',
      performed_by: 'Amit Kumar',
      performed_at: '2023-07-11T10:15:00',
      ip_address: '192.168.1.2',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: 'AL003',
      enquiry_id: 'ENQ001',
      entity_type: 'Enquiry',
      action: 'Update',
      field: 'assignee',
      old_value: 'Amit Kumar',
      new_value: 'Neha Singh',
      performed_by: 'Vikram Malhotra',
      performed_at: '2023-07-12T14:15:00',
      ip_address: '192.168.1.3',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    {
      id: 'AL004',
      enquiry_id: 'ENQ002',
      entity_type: 'Enquiry',
      action: 'Create',
      field: null,
      old_value: null,
      new_value: null,
      performed_by: 'System',
      performed_at: '2023-07-12T11:45:00',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    {
      id: 'AL005',
      enquiry_id: 'ENQ001',
      entity_type: 'Communication',
      action: 'Create',
      field: null,
      old_value: null,
      new_value: null,
      performed_by: 'Neha Singh',
      performed_at: '2023-07-13T09:20:00',
      ip_address: '192.168.1.4',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)'
    },
    {
      id: 'AL006',
      enquiry_id: 'ENQ003',
      entity_type: 'Enquiry',
      action: 'Delete',
      field: null,
      old_value: null,
      new_value: null,
      performed_by: 'Admin',
      performed_at: '2023-07-15T16:45:00',
      ip_address: '192.168.1.5',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    enquiry_id: '',
    entity_type: '',
    action: '',
    performed_by: '',
    date_from: '',
    date_to: ''
  });

  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'performed_at',
    direction: 'desc'
  });

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

  // Filter and sort logs
  const filteredAndSortedLogs = auditLogs
    .filter(log => {
      const matchesEnquiryId = filters.enquiry_id === '' || log.enquiry_id.toLowerCase().includes(filters.enquiry_id.toLowerCase());
      const matchesEntityType = filters.entity_type === '' || log.entity_type === filters.entity_type;
      const matchesAction = filters.action === '' || log.action === filters.action;
      const matchesPerformedBy = filters.performed_by === '' || log.performed_by.toLowerCase().includes(filters.performed_by.toLowerCase());
      
      let matchesDateRange = true;
      if (filters.date_from && filters.date_to) {
        const logDate = new Date(log.performed_at);
        const fromDate = new Date(filters.date_from);
        const toDate = new Date(filters.date_to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        matchesDateRange = logDate >= fromDate && logDate <= toDate;
      }
      
      return matchesEnquiryId && matchesEntityType && matchesAction && matchesPerformedBy && matchesDateRange;
    })
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (key === 'performed_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      
      if (a[key] === null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (b[key] === null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      return sortConfig.direction === 'asc'
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'Enquiry ID', 'Entity Type', 'Action', 'Field', 
      'Old Value', 'New Value', 'Performed By', 'Performed At', 
      'IP Address', 'User Agent'
    ];
    
    const csvData = filteredAndSortedLogs.map(log => [
      log.id,
      log.enquiry_id,
      log.entity_type,
      log.action,
      log.field || '',
      log.old_value || '',
      log.new_value || '',
      log.performed_by,
      new Date(log.performed_at).toLocaleString(),
      log.ip_address,
      log.user_agent
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Get action badge class
  const getActionBadge = (action) => {
    switch(action) {
      case 'Create':
        return 'bg-green-100 text-green-800';
      case 'Update':
        return 'bg-blue-100 text-blue-800';
      case 'Delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Enquiry ID"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.enquiry_id}
                onChange={(e) => setFilters(prev => ({ ...prev, enquiry_id: e.target.value }))}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select
                name="entity_type"
                value={filters.entity_type}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Types</option>
                <option value="Enquiry">Enquiry</option>
                <option value="Communication">Communication</option>
                <option value="Task">Task</option>
                <option value="Document">Document</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Actions</option>
                <option value="Create">Create</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Performed By</label>
              <input
                type="text"
                name="performed_by"
                value={filters.performed_by}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="User name or System"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Audit Log Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('enquiry_id')}
                >
                  <div className="flex items-center">
                    Enquiry ID
                    {getSortIcon('enquiry_id')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('entity_type')}
                >
                  <div className="flex items-center">
                    Entity Type
                    {getSortIcon('entity_type')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('action')}
                >
                  <div className="flex items-center">
                    Action
                    {getSortIcon('action')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Changes
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('performed_by')}
                >
                  <div className="flex items-center">
                    Performed By
                    {getSortIcon('performed_by')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('performed_at')}
                >
                  <div className="flex items-center">
                    Date & Time
                    {getSortIcon('performed_at')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    <a href={`/enquiry-management/enquiry-detail/${log.enquiry_id}`}>
                      {log.enquiry_id}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.entity_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.field ? (
                      <div>
                        <span className="font-medium">{log.field}:</span> 
                        <span className="line-through text-red-500 ml-1">{log.old_value}</span> 
                        <span className="text-green-500 ml-1">{log.new_value}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">
                        {log.action === 'Create' ? 'New record created' : 
                         log.action === 'Delete' ? 'Record deleted' : 'No specific field changes'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.performed_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.performed_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip_address}
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
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Audit Records</p>
              <p className="text-2xl font-semibold">{auditLogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Edit className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Create Actions</p>
              <p className="text-2xl font-semibold">
                {auditLogs.filter(log => log.action === 'Create').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Edit className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Update Actions</p>
              <p className="text-2xl font-semibold">
                {auditLogs.filter(log => log.action === 'Update').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <Edit className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delete Actions</p>
              <p className="text-2xl font-semibold">
                {auditLogs.filter(log => log.action === 'Delete').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Immutable Audit Records</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                All audit records are immutable and cannot be modified or deleted. 
                This ensures compliance with regulatory requirements and provides a complete 
                history of all actions performed in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;