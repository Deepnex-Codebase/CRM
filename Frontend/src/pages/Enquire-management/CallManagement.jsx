import React, { useState } from 'react';
import { Phone, Calendar, Clock, User, MessageSquare, Check, X, PhoneCall, PhoneOff, PhoneForwarded } from 'lucide-react';

const CallManagement = () => {
  // Sample data for demonstration
  const [calls, setCalls] = useState([
    {
      id: 'CALL001',
      enquiry_id: 'ENQ001',
      customer_name: 'Rahul Sharma',
      phone_number: '+91 9876543210',
      scheduled_time: '2023-07-15T10:30:00',
      assigned_to: 'Amit Kumar',
      status: 'scheduled', // scheduled, completed, missed, rescheduled
      priority: 'High',
      notes: '',
      feedback: '',
      call_duration: null,
      call_outcome: null
    },
    {
      id: 'CALL002',
      enquiry_id: 'ENQ002',
      customer_name: 'Priya Patel',
      phone_number: '+91 9876543211',
      scheduled_time: '2023-07-14T14:15:00',
      assigned_to: 'Neha Singh',
      status: 'completed',
      priority: 'Medium',
      notes: 'Customer interested in Project X, needs pricing details',
      feedback: 'Positive response, follow-up needed with brochure',
      call_duration: '00:05:23',
      call_outcome: 'interested'
    },
    {
      id: 'CALL003',
      enquiry_id: 'ENQ003',
      customer_name: 'Vikram Malhotra',
      phone_number: '+91 9876543212',
      scheduled_time: '2023-07-13T09:45:00',
      assigned_to: 'Raj Verma',
      status: 'missed',
      priority: 'Low',
      notes: 'Customer not available, try again tomorrow',
      feedback: '',
      call_duration: '00:00:15',
      call_outcome: 'not_reached'
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    assigned_to: '',
    priority: '',
    date_from: '',
    date_to: ''
  });

  // State for new call form
  const [showNewCallForm, setShowNewCallForm] = useState(false);
  const [newCall, setNewCall] = useState({
    enquiry_id: '',
    customer_name: '',
    phone_number: '',
    scheduled_time: '',
    assigned_to: '',
    priority: 'Medium',
    notes: ''
  });

  // State for call details/feedback form
  const [selectedCall, setSelectedCall] = useState(null);
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [callFeedback, setCallFeedback] = useState({
    notes: '',
    feedback: '',
    call_duration: '',
    call_outcome: 'interested'
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter calls
  const filteredCalls = calls.filter(call => {
    const matchesStatus = filters.status === '' || call.status === filters.status;
    const matchesAssigned = filters.assigned_to === '' || call.assigned_to === filters.assigned_to;
    const matchesPriority = filters.priority === '' || call.priority === filters.priority;
    
    let matchesDateRange = true;
    if (filters.date_from && filters.date_to) {
      const callDate = new Date(call.scheduled_time);
      const fromDate = new Date(filters.date_from);
      const toDate = new Date(filters.date_to);
      matchesDateRange = callDate >= fromDate && callDate <= toDate;
    }
    
    return matchesStatus && matchesAssigned && matchesPriority && matchesDateRange;
  });

  // Handle new call form input change
  const handleNewCallChange = (e) => {
    const { name, value } = e.target;
    setNewCall(prev => ({ ...prev, [name]: value }));
  };

  // Handle call feedback form input change
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setCallFeedback(prev => ({ ...prev, [name]: value }));
  };

  // Save new call
  const handleSaveNewCall = () => {
    const newCallEntry = {
      id: `CALL${calls.length + 1}`.padStart(7, '0'),
      ...newCall,
      status: 'scheduled',
      feedback: '',
      call_duration: null,
      call_outcome: null
    };
    
    setCalls(prev => [...prev, newCallEntry]);
    setShowNewCallForm(false);
    setNewCall({
      enquiry_id: '',
      customer_name: '',
      phone_number: '',
      scheduled_time: '',
      assigned_to: '',
      priority: 'Medium',
      notes: ''
    });
  };

  // Save call feedback
  const handleSaveCallFeedback = () => {
    if (!selectedCall) return;
    
    setCalls(prev => prev.map(call => 
      call.id === selectedCall.id 
        ? { 
            ...call, 
            status: 'completed',
            notes: callFeedback.notes,
            feedback: callFeedback.feedback,
            call_duration: callFeedback.call_duration,
            call_outcome: callFeedback.call_outcome
          } 
        : call
    ));
    
    setShowCallDetails(false);
    setSelectedCall(null);
    setCallFeedback({
      notes: '',
      feedback: '',
      call_duration: '',
      call_outcome: 'interested'
    });
  };

  // Open call details/feedback form
  const handleOpenCallDetails = (call) => {
    setSelectedCall(call);
    setCallFeedback({
      notes: call.notes || '',
      feedback: call.feedback || '',
      call_duration: call.call_duration || '',
      call_outcome: call.call_outcome || 'interested'
    });
    setShowCallDetails(true);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get outcome badge class
  const getOutcomeBadge = (outcome) => {
    switch(outcome) {
      case 'interested':
        return 'bg-green-100 text-green-800';
      case 'not_interested':
        return 'bg-red-100 text-red-800';
      case 'call_back':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_reached':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Call Management</h1>
      
      {/* Filters and Actions */}
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
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select 
              name="assigned_to" 
              value={filters.assigned_to} 
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
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input 
              type="date" 
              name="date_from" 
              value={filters.date_from} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          
          <div className="w-full md:w-auto">
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
        
        <div className="flex justify-end">
          <button 
            onClick={() => setShowNewCallForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center"
          >
            <Phone className="h-4 w-4 mr-2" />
            Schedule New Call
          </button>
        </div>
      </div>
      
      {/* Call List */}
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
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Outcome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCalls.map((call) => (
              <tr key={call.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {call.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {call.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {call.phone_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(call.scheduled_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {call.assigned_to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${call.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      call.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {call.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(call.status)}`}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {call.call_outcome ? (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOutcomeBadge(call.call_outcome)}`}>
                      {call.call_outcome === 'interested' ? 'Interested' : 
                       call.call_outcome === 'not_interested' ? 'Not Interested' : 
                       call.call_outcome === 'call_back' ? 'Call Back' : 
                       call.call_outcome === 'not_reached' ? 'Not Reached' : 'Unknown'}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Not Available</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOpenCallDetails(call)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title={call.status === 'completed' ? 'View Details' : 'Log Call'}
                    >
                      {call.status === 'completed' ? 'View Details' : 'Log Call'}
                    </button>
                    
                    {call.status !== 'completed' && (
                      <button className="text-red-600 hover:text-red-900" title="Cancel Call">
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* New Call Modal */}
      {showNewCallForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule New Call</h2>
              <button onClick={() => setShowNewCallForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID</label>
                <input 
                  type="text" 
                  name="enquiry_id" 
                  value={newCall.enquiry_id} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="ENQ001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  name="customer_name" 
                  value={newCall.customer_name} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Customer Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone_number" 
                  value={newCall.phone_number} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                <input 
                  type="datetime-local" 
                  name="scheduled_time" 
                  value={newCall.scheduled_time} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select 
                  name="assigned_to" 
                  value={newCall.assigned_to} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select User</option>
                  <option value="Amit Kumar">Amit Kumar</option>
                  <option value="Neha Singh">Neha Singh</option>
                  <option value="Raj Verma">Raj Verma</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                  name="priority" 
                  value={newCall.priority} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  name="notes" 
                  value={newCall.notes} 
                  onChange={handleNewCallChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add any pre-call notes here..."
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewCallForm(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNewCall}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Call Details/Feedback Modal */}
      {showCallDetails && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedCall.status === 'completed' ? 'Call Details' : 'Log Call'}
              </h2>
              <button onClick={() => setShowCallDetails(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedCall.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCall.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Time</p>
                  <p className="font-medium">{new Date(selectedCall.scheduled_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">{selectedCall.assigned_to}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Call Duration</label>
                <input 
                  type="text" 
                  name="call_duration" 
                  value={callFeedback.call_duration} 
                  onChange={handleFeedbackChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="00:05:30"
                  disabled={selectedCall.status === 'completed'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Call Outcome</label>
                <select 
                  name="call_outcome" 
                  value={callFeedback.call_outcome} 
                  onChange={handleFeedbackChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  disabled={selectedCall.status === 'completed'}
                >
                  <option value="interested">Interested</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="call_back">Call Back</option>
                  <option value="not_reached">Not Reached</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  name="notes" 
                  value={callFeedback.notes} 
                  onChange={handleFeedbackChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add call notes here..."
                  disabled={selectedCall.status === 'completed'}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea 
                  name="feedback" 
                  value={callFeedback.feedback} 
                  onChange={handleFeedbackChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add feedback about the call..."
                  disabled={selectedCall.status === 'completed'}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowCallDetails(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
              >
                {selectedCall.status === 'completed' ? 'Close' : 'Cancel'}
              </button>
              
              {selectedCall.status !== 'completed' && (
                <button 
                  onClick={handleSaveCallFeedback}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Call Log
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Call Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Scheduled Calls</p>
              <p className="text-2xl font-semibold">{calls.filter(c => c.status === 'scheduled').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <PhoneForwarded className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Calls</p>
              <p className="text-2xl font-semibold">{calls.filter(c => c.status === 'completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <PhoneOff className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Missed Calls</p>
              <p className="text-2xl font-semibold">{calls.filter(c => c.status === 'missed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Call Duration</p>
              <p className="text-2xl font-semibold">00:04:15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallManagement;