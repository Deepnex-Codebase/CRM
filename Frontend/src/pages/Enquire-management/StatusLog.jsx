import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';

const StatusLog = () => {
  // Sample data for demonstration
  const [statusLogs, setStatusLogs] = useState([
    {
      id: 'SL001',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      previous_status: null,
      new_status: 'New',
      changed_by: 'System',
      changed_at: '2023-07-10T09:30:00',
      reason: 'Enquiry Created',
      notes: 'New enquiry received through website form'
    },
    {
      id: 'SL002',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      previous_status: 'New',
      new_status: 'In Progress',
      changed_by: 'Amit Kumar',
      changed_at: '2023-07-11T10:15:00',
      reason: 'Processing Started',
      notes: 'Initial contact made with customer'
    },
    {
      id: 'SL003',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      previous_status: 'In Progress',
      new_status: 'On Hold',
      changed_by: 'Neha Singh',
      changed_at: '2023-07-13T14:30:00',
      reason: 'Awaiting Information',
      notes: 'Customer needs to provide additional documents'
    },
    {
      id: 'SL004',
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      previous_status: null,
      new_status: 'New',
      changed_by: 'System',
      changed_at: '2023-07-12T11:45:00',
      reason: 'Enquiry Created',
      notes: 'New enquiry received through phone call'
    },
    {
      id: 'SL005',
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      previous_status: 'New',
      new_status: 'Qualified',
      changed_by: 'Raj Verma',
      changed_at: '2023-07-14T09:20:00',
      reason: 'Lead Qualification',
      notes: 'Customer meets all qualification criteria'
    },
    {
      id: 'SL006',
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      previous_status: 'In Progress',
      new_status: 'Closed',
      changed_by: 'Amit Kumar',
      changed_at: '2023-07-15T16:45:00',
      reason: 'Deal Won',
      notes: 'Customer signed contract for Project X'
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    enquiry_id: '',
    customer_name: '',
    previous_status: '',
    new_status: '',
    changed_by: '',
    reason: '',
    date_from: '',
    date_to: ''
  });

  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'changed_at',
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
  const filteredAndSortedLogs = statusLogs
    .filter(log => {
      const matchesEnquiryId = filters.enquiry_id === '' || log.enquiry_id.toLowerCase().includes(filters.enquiry_id.toLowerCase());
      const matchesCustomerName = filters.customer_name === '' || log.customer_name.toLowerCase().includes(filters.customer_name.toLowerCase());
      const matchesPreviousStatus = filters.previous_status === '' || 
        (log.previous_status && log.previous_status.toLowerCase().includes(filters.previous_status.toLowerCase()));
      const matchesNewStatus = filters.new_status === '' || log.new_status.toLowerCase().includes(filters.new_status.toLowerCase());
      const matchesChangedBy = filters.changed_by === '' || log.changed_by.toLowerCase().includes(filters.changed_by.toLowerCase());
      const matchesReason = filters.reason === '' || log.reason.toLowerCase().includes(filters.reason.toLowerCase());
      
      let matchesDateRange = true;
      if (filters.date_from && filters.date_to) {
        const logDate = new Date(log.changed_at);
        const fromDate = new Date(filters.date_from);
        const toDate = new Date(filters.date_to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        matchesDateRange = logDate >= fromDate && logDate <= toDate;
      }
      
      return matchesEnquiryId && matchesCustomerName && matchesPreviousStatus && 
             matchesNewStatus && matchesChangedBy && matchesReason && matchesDateRange;
    })
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (a[key] === null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (b[key] === null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (key === 'changed_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      
      return sortConfig.direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'Enquiry ID', 'Customer Name', 'Previous Status', 
      'New Status', 'Changed By', 'Changed At', 'Reason', 'Notes'
    ];
    
    const csvData = filteredAndSortedLogs.map(log => [
      log.id,
      log.enquiry_id,
      log.customer_name,
      log.previous_status || 'None',
      log.new_status,
      log.changed_by,
      new Date(log.changed_at).toLocaleString(),
      log.reason,
      log.notes
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `status_log_${new Date().toISOString().split('T')[0]}.csv`);
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

  // Get status badge class
  const getStatusBadge = (status) => {
    switch(status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Qualified':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Won':
        return 'bg-emerald-100 text-emerald-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Status Change Log</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Enquiry ID or Customer Name"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.customer_name}
                onChange={(e) => setFilters(prev => ({ ...prev, customer_name: e.target.value }))}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID</label>
              <input
                type="text"
                name="enquiry_id"
                value={filters.enquiry_id}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="ENQ001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Status</label>
              <select
                name="previous_status"
                value={filters.previous_status}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Qualified">Qualified</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select
                name="new_status"
                value={filters.new_status}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Qualified">Qualified</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Changed By</label>
              <input
                type="text"
                name="changed_by"
                value={filters.changed_by}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="User name or System"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                name="reason"
                value={filters.reason}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Reasons</option>
                <option value="Enquiry Created">Enquiry Created</option>
                <option value="Processing Started">Processing Started</option>
                <option value="Awaiting Information">Awaiting Information</option>
                <option value="Lead Qualification">Lead Qualification</option>
                <option value="Deal Won">Deal Won</option>
                <option value="Deal Lost">Deal Lost</option>
              </select>
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
      
      {/* Status Log Table */}
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
                  onClick={() => handleSort('customer_name')}
                >
                  <div className="flex items-center">
                    Customer
                    {getSortIcon('customer_name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('previous_status')}
                >
                  <div className="flex items-center">
                    Previous Status
                    {getSortIcon('previous_status')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('new_status')}
                >
                  <div className="flex items-center">
                    New Status
                    {getSortIcon('new_status')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('changed_by')}
                >
                  <div className="flex items-center">
                    Changed By
                    {getSortIcon('changed_by')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('changed_at')}
                >
                  <div className="flex items-center">
                    Date & Time
                    {getSortIcon('changed_at')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('reason')}
                >
                  <div className="flex items-center">
                    Reason
                    {getSortIcon('reason')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
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
                    {log.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.previous_status ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(log.previous_status)}`}>
                        {log.previous_status}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(log.new_status)}`}>
                      {log.new_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.changed_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.changed_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.reason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {log.notes}
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
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Status Changes</p>
              <p className="text-2xl font-semibold">{statusLogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Enquiries</p>
              <p className="text-2xl font-semibold">
                {statusLogs.filter(log => log.previous_status === null).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">
                {statusLogs.filter(log => log.new_status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Closed</p>
              <p className="text-2xl font-semibold">
                {statusLogs.filter(log => log.new_status === 'Closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Flow Visualization */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Status Flow</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">New</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">2</p>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold">In Progress</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">2</p>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">Qualified</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">1</p>
          </div>
          
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-bold">Closed</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusLog;