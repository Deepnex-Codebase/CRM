import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const EnquiryDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for demonstration
  const enquiry = {
    enquiry_id: 'ENQ001',
    type: 'Product',
    source: 'Web',
    status: 'In Progress',
    priority: 'High',
    assigned_user: 'Amit Kumar',
    customer_name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    remarks: 'Customer is interested in our premium product range. Needs a detailed quotation.',
    created_at: '2023-07-15'
  };

  // Sample data for tabs
  const activityTimeline = [
    { id: 1, type: 'status_change', from: 'New', to: 'In Progress', user: 'Amit Kumar', timestamp: '2023-07-16 10:30 AM' },
    { id: 2, type: 'assignment', from: 'Unassigned', to: 'Amit Kumar', user: 'System', timestamp: '2023-07-15 02:15 PM' }
  ];

  const tasks = [
    { id: 1, title: 'Send product catalog', due_date: '2023-07-18', assigned_to: 'Amit Kumar', status: 'pending' },
    { id: 2, title: 'Follow-up call', due_date: '2023-07-20', assigned_to: 'Amit Kumar', status: 'pending' }
  ];

  const communications = [
    { id: 1, channel: 'Email', timestamp: '2023-07-16 11:45 AM', sender: 'Amit Kumar', receiver: 'Rahul Sharma', message: 'Dear Rahul, Thank you for your interest in our products...' },
    { id: 2, channel: 'WhatsApp', timestamp: '2023-07-16 03:30 PM', sender: 'Rahul Sharma', receiver: 'Amit Kumar', message: 'Can you please send me the pricing details?' }
  ];

  const calls = [
    { id: 1, type: 'upcoming', scheduled_date: '2023-07-20 11:00 AM', purpose: 'Follow-up', assigned_to: 'Amit Kumar' },
    { id: 2, type: 'done', date: '2023-07-16 10:30 AM', duration: '15 mins', outcome: 'Positive', feedback: 'Customer requested for a detailed quotation', agent: 'Amit Kumar' }
  ];

  const auditLog = [
    { id: 1, action: 'Created', user: 'System', timestamp: '2023-07-15 02:15 PM', details: 'Enquiry created from web form' },
    { id: 2, action: 'Updated', user: 'Amit Kumar', timestamp: '2023-07-16 10:35 AM', details: 'Status changed from New to In Progress' }
  ];

  // Handle status change
  const handleStatusChange = (e) => {
    console.log(`Status changed to: ${e.target.value}`);
    // Implementation would go here
  };

  // Handle assignment
  const handleAssign = () => {
    console.log('Open assign modal');
    // Implementation would go here
  };

  // Handle add task
  const handleAddTask = () => {
    console.log('Open add task modal');
    // Implementation would go here
  };

  // Handle add communication
  const handleAddCommunication = () => {
    console.log('Open add communication modal');
    // Implementation would go here
  };

  // Handle log call
  const handleLogCall = () => {
    console.log('Open log call modal');
    // Implementation would go here
  };

  // Handle convert enquiry
  const handleConvert = () => {
    console.log('Open conversion wizard');
    // Implementation would go here
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{enquiry.enquiry_id}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Type: {enquiry.type}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Source: {enquiry.source}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full 
                ${enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                  enquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                  enquiry.status === 'Qualified' ? 'bg-green-100 text-green-800' : 
                  enquiry.status === 'Converted' ? 'bg-purple-100 text-purple-800' : 
                  'bg-gray-100 text-gray-800'}`}>
                Status: {enquiry.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full 
                ${enquiry.priority === 'High' ? 'bg-red-100 text-red-800' : 
                  enquiry.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                  'bg-green-100 text-green-800'}`}>
                Priority: {enquiry.priority}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Assigned: {enquiry.assigned_user}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <select 
              onChange={handleStatusChange}
              defaultValue={enquiry.status}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
            
            <button 
              onClick={handleAssign}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Assign
            </button>
            
            <button 
              onClick={handleConvert}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
            >
              Convert
            </button>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{enquiry.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{enquiry.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{enquiry.email}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity Timeline
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'communication'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('communication')}
            >
              Communication Log
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'calls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('calls')}
            >
              Calls
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('audit')}
            >
              Audit Log
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Enquiry Details</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-gray-700">{enquiry.remarks}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>Created on: {enquiry.created_at}</p>
              </div>
            </div>
          )}
          
          {/* Activity Timeline Tab */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Activity Timeline</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {activityTimeline.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== activityTimeline.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              activity.type === 'status_change' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                              {activity.type === 'status_change' ? (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.type === 'status_change' 
                                  ? `Status changed from ${activity.from} to ${activity.to}` 
                                  : `Assigned from ${activity.from} to ${activity.to}`}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <p>{activity.user}</p>
                              <p>{activity.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <button 
                  onClick={handleAddTask}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.due_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.assigned_to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {task.status === 'pending' ? 'Pending' : 'Done'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          {task.status === 'pending' && (
                            <button className="text-green-600 hover:text-green-900">
                              Mark Done
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Communication Log Tab */}
          {activeTab === 'communication' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Communication Log</h3>
                <button 
                  onClick={handleAddCommunication}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Add Communication
                </button>
              </div>
              <div className="space-y-4">
                {communications.map((comm) => (
                  <div key={comm.id} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          comm.channel === 'Email' ? 'bg-blue-100 text-blue-800' : 
                          comm.channel === 'WhatsApp' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {comm.channel}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {comm.timestamp}
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm">
                        <span className="font-medium">{comm.sender}</span> to <span className="font-medium">{comm.receiver}</span>
                      </p>
                    </div>
                    <div className="text-gray-700">
                      <p>{comm.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Calls Tab */}
          {activeTab === 'calls' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Calls</h3>
                <button 
                  onClick={handleLogCall}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                  Log Call
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Upcoming Calls</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheduled Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {calls.filter(call => call.type === 'upcoming').map((call) => (
                        <tr key={call.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.scheduled_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.purpose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.assigned_to}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              Reschedule
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Complete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">Call History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Outcome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {calls.filter(call => call.type === 'done').map((call) => (
                        <tr key={call.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              call.outcome === 'Positive' ? 'bg-green-100 text-green-800' : 
                              call.outcome === 'Neutral' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {call.outcome}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.agent}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {call.feedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Audit Log</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLog.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetail;