import React, { useState } from 'react';

const CommunicationLog = () => {
  // Sample data for demonstration
  const [communications, setCommunications] = useState([
    {
      id: 1,
      enquiry_id: 'ENQ001',
      channel: 'Email',
      timestamp: '2023-07-16 11:45 AM',
      sender: 'Amit Kumar',
      receiver: 'Rahul Sharma',
      message: 'Dear Rahul, Thank you for your interest in our products. Please find attached the product catalog as requested.',
      subject: 'Product Catalog - Your Enquiry ENQ001'
    },
    {
      id: 2,
      enquiry_id: 'ENQ001',
      channel: 'WhatsApp',
      timestamp: '2023-07-16 03:30 PM',
      sender: 'Rahul Sharma',
      receiver: 'Amit Kumar',
      message: 'Can you please send me the pricing details for the premium range?'
    },
    {
      id: 3,
      enquiry_id: 'ENQ002',
      channel: 'SMS',
      timestamp: '2023-07-15 01:15 PM',
      sender: 'System',
      receiver: 'Priya Patel',
      message: 'Thank you for your enquiry. Our representative will contact you shortly. Your enquiry ID is ENQ002.'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    channel: '',
    enquiry: '',
    dateRange: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [commForm, setCommForm] = useState({
    channel: 'Email',
    enquiry_id: '',
    sender: '',
    receiver: '',
    subject: '',
    message: ''
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCommForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle add communication
  const handleAddCommunication = () => {
    setCommForm({
      channel: 'Email',
      enquiry_id: '',
      sender: '',
      receiver: '',
      subject: '',
      message: ''
    });
    setShowModal(true);
  };

  // Handle save communication
  const handleSaveCommunication = () => {
    const newComm = {
      id: communications.length + 1,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', ''),
      ...commForm
    };
    
    setCommunications(prev => [...prev, newComm]);
    setShowModal(false);
  };

  // Filter communications based on filters
  const filteredCommunications = communications.filter(comm => {
    return (
      (filters.channel === '' || comm.channel === filters.channel) &&
      (filters.enquiry === '' || comm.enquiry_id === filters.enquiry)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Communication Log</h1>
        <button 
          onClick={handleAddCommunication}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Add Communication
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
            <select 
              name="channel" 
              value={filters.channel} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Channels</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry</label>
            <select 
              name="enquiry" 
              value={filters.enquiry} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Enquiries</option>
              <option value="ENQ001">ENQ001</option>
              <option value="ENQ002">ENQ002</option>
              <option value="ENQ003">ENQ003</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select 
              name="dateRange" 
              value={filters.dateRange} 
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Communications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-hidden">
          <div className="space-y-4 p-4">
            {filteredCommunications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No communications found
              </div>
            ) : (
              filteredCommunications.map((comm) => (
                <div key={comm.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex flex-wrap justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        comm.channel === 'Email' ? 'bg-blue-100 text-blue-800' : 
                        comm.channel === 'WhatsApp' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {comm.channel}
                      </span>
                      <a href={`/enquiry/${comm.enquiry_id}`} className="text-indigo-600 hover:text-indigo-900 text-sm">
                        {comm.enquiry_id}
                      </a>
                    </div>
                    <div className="text-sm text-gray-500">
                      {comm.timestamp}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm">
                      <span className="font-medium">From:</span> {comm.sender}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">To:</span> {comm.receiver}
                    </p>
                    {comm.subject && (
                      <p className="text-sm">
                        <span className="font-medium">Subject:</span> {comm.subject}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200 text-gray-700">
                    <p className="whitespace-pre-wrap">{comm.message}</p>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm mr-3">
                      Reply
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 text-sm">
                      Forward
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCommunications.length}</span> of{' '}
                  <span className="font-medium">{filteredCommunications.length}</span> results
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
      
      {/* Add Communication Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Communication</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <select 
                  name="channel"
                  value={commForm.channel}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID</label>
                <select 
                  name="enquiry_id"
                  value={commForm.enquiry_id}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select Enquiry</option>
                  <option value="ENQ001">ENQ001</option>
                  <option value="ENQ002">ENQ002</option>
                  <option value="ENQ003">ENQ003</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
                <input 
                  type="text" 
                  name="sender"
                  value={commForm.sender}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Sender name or email"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver</label>
                <input 
                  type="text" 
                  name="receiver"
                  value={commForm.receiver}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Receiver name or email"
                />
              </div>
              
              {commForm.channel === 'Email' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={commForm.subject}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Email subject"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  name="message"
                  value={commForm.message}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="5"
                  placeholder="Message content"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm mr-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCommunication}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Save Communication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationLog;