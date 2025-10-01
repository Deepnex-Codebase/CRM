import React, { useState } from 'react';

const SLAMonitoring = () => {
  // Sample data for demonstration
  const [slaData, setSlaData] = useState([
    {
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      priority: 'High',
      status: 'New',
      created_at: '2023-07-15T10:30:00',
      response_due: '2023-07-15T12:30:00',
      resolution_due: '2023-07-16T10:30:00',
      assigned_to: 'Amit Kumar',
      time_remaining: -2, // hours, negative means overdue
      sla_status: 'breached'
    },
    {
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      priority: 'Medium',
      status: 'In Progress',
      created_at: '2023-07-14T14:15:00',
      response_due: '2023-07-14T18:15:00',
      resolution_due: '2023-07-16T14:15:00',
      assigned_to: 'Neha Singh',
      time_remaining: 4, // hours
      sla_status: 'at_risk'
    },
    {
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      priority: 'Low',
      status: 'Qualified',
      created_at: '2023-07-13T09:45:00',
      response_due: '2023-07-13T17:45:00',
      resolution_due: '2023-07-17T09:45:00',
      assigned_to: 'Raj Verma',
      time_remaining: 24, // hours
      sla_status: 'on_track'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    slaStatus: '',
    assigned: ''
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter SLA data
  const filteredSLA = slaData.filter(item => {
    const matchesStatus = filters.status === '' || item.status === filters.status;
    const matchesPriority = filters.priority === '' || item.priority === filters.priority;
    const matchesSLAStatus = filters.slaStatus === '' || item.sla_status === filters.slaStatus;
    const matchesAssigned = filters.assigned === '' || item.assigned_to === filters.assigned;
    
    return matchesStatus && matchesPriority && matchesSLAStatus && matchesAssigned;
  });

  // Get SLA status badge class
  const getSLAStatusBadge = (status) => {
    switch(status) {
      case 'breached':
        return 'bg-red-100 text-red-800';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_track':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get SLA status text
  const getSLAStatusText = (status) => {
    switch(status) {
      case 'breached':
        return 'SLA Breached';
      case 'at_risk':
        return 'At Risk';
      case 'on_track':
        return 'On Track';
      default:
        return 'Unknown';
    }
  };

  // Format time remaining
  const formatTimeRemaining = (hours) => {
    if (hours < 0) {
      return `${Math.abs(hours)}h overdue`;
    }
    return `${hours}h remaining`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">SLA Monitoring</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
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
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">SLA Status</label>
            <select 
              name="slaStatus" 
              value={filters.slaStatus} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All SLA Status</option>
              <option value="breached">Breached</option>
              <option value="at_risk">At Risk</option>
              <option value="on_track">On Track</option>
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
        </div>
      </div>
      
      {/* SLA Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">SLA Breached</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>1 enquiry has breached SLA</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">At Risk</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>1 enquiry is at risk of breaching SLA</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">On Track</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>1 enquiry is on track with SLA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SLA Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Remaining
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SLA Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSLA.map((item) => (
              <tr key={item.enquiry_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.enquiry_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      item.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.response_due).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.resolution_due).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.assigned_to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`${item.time_remaining < 0 ? 'text-red-600 font-medium' : 
                    item.time_remaining < 6 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {formatTimeRemaining(item.time_remaining)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSLAStatusBadge(item.sla_status)}`}>
                    {getSLAStatusText(item.sla_status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={`/enquiry-management/detail/${item.enquiry_id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                    View
                  </a>
                  <button className="text-red-600 hover:text-red-900">
                    Escalate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* SLA Configuration Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">SLA Configuration</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Response Time SLAs</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">High</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">2 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Medium</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">4 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Low</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">8 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Resolution Time SLAs</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">High</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Medium</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">48 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Low</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">96 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input id="email-alerts" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                <label htmlFor="email-alerts" className="ml-2 block text-sm text-gray-900">
                  Email alerts for SLA breaches
                </label>
              </div>
              <div className="flex items-center">
                <input id="sms-alerts" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                <label htmlFor="sms-alerts" className="ml-2 block text-sm text-gray-900">
                  SMS alerts for SLA breaches
                </label>
              </div>
              <div className="flex items-center">
                <input id="dashboard-alerts" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                <label htmlFor="dashboard-alerts" className="ml-2 block text-sm text-gray-900">
                  Dashboard notifications for at-risk SLAs
                </label>
              </div>
              <div className="flex items-center">
                <input id="escalation-alerts" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                <label htmlFor="escalation-alerts" className="ml-2 block text-sm text-gray-900">
                  Auto-escalate breached SLAs to manager
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Save SLA Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAMonitoring;