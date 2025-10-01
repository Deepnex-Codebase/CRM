import React, { useState } from 'react';

// Function to export data to CSV
const exportToCSV = (data, filename) => {
  // Create column headers
  const headers = Object.keys(data[0]).join(',');
  
  // Create rows
  const rows = data.map(item => 
    Object.values(item).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  ).join('\n');
  
  // Combine headers and rows
  const csv = `${headers}\n${rows}`;
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const EnquiryList = () => {
  // Sample data for demonstration
  const [enquiries, setEnquiries] = useState([
    {
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      contact_number: '9876543210',
      enquiry_type: 'Product',
      status: 'New',
      priority: 'High',
      assigned_to: 'Amit Kumar',
      created_at: '2023-07-15',
      next_task_due: '2023-07-20'
    },
    {
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      contact_number: '8765432109',
      enquiry_type: 'Service',
      status: 'In Progress',
      priority: 'Medium',
      assigned_to: 'Neha Singh',
      created_at: '2023-07-14',
      next_task_due: '2023-07-19'
    },
    {
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      contact_number: '7654321098',
      enquiry_type: 'AMC',
      status: 'Qualified',
      priority: 'Low',
      assigned_to: 'Raj Verma',
      created_at: '2023-07-13',
      next_task_due: '2023-07-18'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    assigned: '',
    dateRange: '',
    priority: '',
    enquiryType: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filter visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (action === 'export') {
      exportToCSV(sortedEnquiries, `enquiries_export_${new Date().toISOString().slice(0,10)}.csv`);
    } else {
      console.log(`Bulk action: ${action}`);
      // Implementation would go here
    }
  };

  // Filter enquiries based on search term and filters
  const filteredEnquiries = enquiries.filter(enquiry => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      enquiry.enquiry_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.contact_number.includes(searchTerm);
    
    // Status filter
    const matchesStatus = filters.status === '' || enquiry.status === filters.status;
    
    // Priority filter
    const matchesPriority = filters.priority === '' || enquiry.priority === filters.priority;
    
    // Assigned filter
    const matchesAssigned = filters.assigned === '' || enquiry.assigned_to === filters.assigned;
    
    // Enquiry type filter
    const matchesType = filters.enquiryType === '' || enquiry.enquiry_type === filters.enquiryType;
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateFrom && filters.dateTo) {
      const enquiryDate = new Date(enquiry.created_at);
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day
      
      matchesDateRange = enquiryDate >= fromDate && enquiryDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && 
           matchesAssigned && matchesType && matchesDateRange;
  });
  
  // Sort the filtered enquiries
  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    const sortField = filters.sortBy;
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Enquiry Management</h1>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select 
              name="source" 
              value={filters.source} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Sources</option>
              <option value="Web">Web</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="IndiaMart">IndiaMart</option>
              <option value="JustDial">JustDial</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select 
              name="assigned" 
              value={filters.assigned} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Users</option>
              <option value="Amit Kumar">Amit Kumar</option>
              <option value="Neha Singh">Neha Singh</option>
              <option value="Raj Verma">Raj Verma</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select 
              name="priority" 
              value={filters.priority} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input 
              type="text" 
              placeholder="Search by ID, name, phone..." 
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleBulkAction('assign')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Assign
            </button>
            <button 
              onClick={() => handleBulkAction('status')}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              Update Status
            </button>
            <button 
              onClick={() => handleBulkAction('export')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
            >
              Export
            </button>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100 flex items-center"
            >
              {showAdvancedFilters ? 'Hide Advanced' : 'Advanced Filters'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-3">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
                <select 
                  name="enquiryType" 
                  value={filters.enquiryType} 
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                  <option value="AMC">AMC</option>
                  <option value="Project">Project</option>
                  <option value="Complaint">Complaint</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input 
                  type="date" 
                  name="dateFrom" 
                  value={filters.dateFrom} 
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input 
                  type="date" 
                  name="dateTo" 
                  value={filters.dateTo} 
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select 
                  name="sortBy" 
                  value={filters.sortBy} 
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="created_at">Date Created</option>
                  <option value="customer_name">Customer Name</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="next_task_due">Next Task Due</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <select 
                  name="sortOrder" 
                  value={filters.sortOrder} 
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    // Reset all filters
                    setFilters({
                      status: '',
                      source: '',
                      assigned: '',
                      dateRange: '',
                      priority: '',
                      enquiryType: '',
                      dateFrom: '',
                      dateTo: '',
                      sortBy: 'created_at',
                      sortOrder: 'desc'
                    });
                    setSearchTerm('');
                  }}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded text-blue-600" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEnquiries.map((enquiry) => (
              <tr key={enquiry.enquiry_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded text-blue-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {enquiry.enquiry_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.contact_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.enquiry_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                      enquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                      enquiry.status === 'Qualified' ? 'bg-green-100 text-green-800' : 
                      enquiry.status === 'Converted' ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {enquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${enquiry.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      enquiry.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {enquiry.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.assigned_to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {enquiry.next_task_due}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/enquiry/${enquiry.enquiry_id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
                <span className="font-medium">3</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryList;