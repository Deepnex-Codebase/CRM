import React, { useState } from 'react';
import { UserPlus, Search, Calendar, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

const AssignmentLog = () => {
  // Sample data for demonstration
  const [assignmentLogs, setAssignmentLogs] = useState([
    {
      id: 'AL001',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      previous_assignee: null,
      new_assignee: 'Amit Kumar',
      assigned_by: 'Vikram Malhotra',
      assigned_at: '2023-07-10T09:30:00',
      reason: 'Initial Assignment',
      notes: 'Assigned based on territory and expertise'
    },
    {
      id: 'AL002',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      previous_assignee: 'Amit Kumar',
      new_assignee: 'Neha Singh',
      assigned_by: 'Vikram Malhotra',
      assigned_at: '2023-07-12T14:15:00',
      reason: 'Workload Balancing',
      notes: 'Amit Kumar has high workload, reassigning to balance team capacity'
    },
    {
      id: 'AL003',
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      previous_assignee: null,
      new_assignee: 'Raj Verma',
      assigned_by: 'Vikram Malhotra',
      assigned_at: '2023-07-13T11:45:00',
      reason: 'Initial Assignment',
      notes: 'Assigned based on product knowledge'
    },
    {
      id: 'AL004',
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      previous_assignee: null,
      new_assignee: 'Amit Kumar',
      assigned_by: 'System',
      assigned_at: '2023-07-14T10:00:00',
      reason: 'Auto Assignment',
      notes: 'Automatically assigned based on round-robin algorithm'
    },
    {
      id: 'AL005',
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      previous_assignee: 'Amit Kumar',
      new_assignee: 'Neha Singh',
      assigned_by: 'Amit Kumar',
      assigned_at: '2023-07-15T16:30:00',
      reason: 'Expertise Required',
      notes: 'Customer requires specific product knowledge that Neha has'
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    enquiry_id: '',
    customer_name: '',
    previous_assignee: '',
    new_assignee: '',
    assigned_by: '',
    reason: '',
    date_from: '',
    date_to: ''
  });

  // State for advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'assigned_at',
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
  const filteredAndSortedLogs = assignmentLogs
    .filter(log => {
      const matchesEnquiryId = filters.enquiry_id === '' || log.enquiry_id.toLowerCase().includes(filters.enquiry_id.toLowerCase());
      const matchesCustomerName = filters.customer_name === '' || log.customer_name.toLowerCase().includes(filters.customer_name.toLowerCase());
      const matchesPreviousAssignee = filters.previous_assignee === '' || 
        (log.previous_assignee && log.previous_assignee.toLowerCase().includes(filters.previous_assignee.toLowerCase()));
      const matchesNewAssignee = filters.new_assignee === '' || log.new_assignee.toLowerCase().includes(filters.new_assignee.toLowerCase());
      const matchesAssignedBy = filters.assigned_by === '' || log.assigned_by.toLowerCase().includes(filters.assigned_by.toLowerCase());
      const matchesReason = filters.reason === '' || log.reason.toLowerCase().includes(filters.reason.toLowerCase());
      
      let matchesDateRange = true;
      if (filters.date_from && filters.date_to) {
        const logDate = new Date(log.assigned_at);
        const fromDate = new Date(filters.date_from);
        const toDate = new Date(filters.date_to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        matchesDateRange = logDate >= fromDate && logDate <= toDate;
      }
      
      return matchesEnquiryId && matchesCustomerName && matchesPreviousAssignee && 
             matchesNewAssignee && matchesAssignedBy && matchesReason && matchesDateRange;
    })
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (a[key] === null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (b[key] === null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (key === 'assigned_at') {
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
      'ID', 'Enquiry ID', 'Customer Name', 'Previous Assignee', 
      'New Assignee', 'Assigned By', 'Assigned At', 'Reason', 'Notes'
    ];
    
    const csvData = filteredAndSortedLogs.map(log => [
      log.id,
      log.enquiry_id,
      log.customer_name,
      log.previous_assignee || 'None',
      log.new_assignee,
      log.assigned_by,
      new Date(log.assigned_at).toLocaleString(),
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
    link.setAttribute('download', `assignment_log_${new Date().toISOString().split('T')[0]}.csv`);
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Log</h1>
      
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Assignee</label>
              <input
                type="text"
                name="previous_assignee"
                value={filters.previous_assignee}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Assignee name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Assignee</label>
              <input
                type="text"
                name="new_assignee"
                value={filters.new_assignee}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Assignee name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
              <input
                type="text"
                name="assigned_by"
                value={filters.assigned_by}
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
                <option value="Initial Assignment">Initial Assignment</option>
                <option value="Workload Balancing">Workload Balancing</option>
                <option value="Expertise Required">Expertise Required</option>
                <option value="Auto Assignment">Auto Assignment</option>
                <option value="Reassignment">Reassignment</option>
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
      
      {/* Assignment Log Table */}
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
                  onClick={() => handleSort('previous_assignee')}
                >
                  <div className="flex items-center">
                    Previous Assignee
                    {getSortIcon('previous_assignee')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('new_assignee')}
                >
                  <div className="flex items-center">
                    New Assignee
                    {getSortIcon('new_assignee')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('assigned_by')}
                >
                  <div className="flex items-center">
                    Assigned By
                    {getSortIcon('assigned_by')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('assigned_at')}
                >
                  <div className="flex items-center">
                    Date & Time
                    {getSortIcon('assigned_at')}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.previous_assignee || <span className="text-gray-400 italic">None</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.new_assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.assigned_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.assigned_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${log.reason === 'Initial Assignment' ? 'bg-green-100 text-green-800' : 
                        log.reason === 'Workload Balancing' ? 'bg-blue-100 text-blue-800' : 
                        log.reason === 'Expertise Required' ? 'bg-purple-100 text-purple-800' : 
                        log.reason === 'Auto Assignment' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {log.reason}
                    </span>
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Assignments</p>
              <p className="text-2xl font-semibold">{assignmentLogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Initial Assignments</p>
              <p className="text-2xl font-semibold">
                {assignmentLogs.filter(log => log.reason === 'Initial Assignment').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reassignments</p>
              <p className="text-2xl font-semibold">
                {assignmentLogs.filter(log => log.previous_assignee !== null).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentLog;