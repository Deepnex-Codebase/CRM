import axios from 'axios';

// Base API URL - should be configured from environment variables in a real application
const API_URL = '/api/enquiries';

// Mock data for development (remove in production)
const mockEnquiries = [
  {
    id: 1,
    title: 'Website Development Enquiry',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh@example.com',
    contactPhone: '+91 9876543210',
    source: 'Website',
    status: 'new',
    priority: 'high',
    assignedTo: 'Amit Sharma',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T10:30:00',
    description: 'Looking for a company website development with e-commerce functionality',
    tags: ['website', 'e-commerce', 'development'],
    tasks: [
      { id: 1, title: 'Send proposal', status: 'pending', dueDate: '2023-06-20' },
      { id: 2, title: 'Schedule call', status: 'completed', dueDate: '2023-06-16' }
    ],
    communications: [
      { 
        id: 1, 
        type: 'email', 
        direction: 'incoming', 
        content: 'I would like to discuss website development for my company', 
        timestamp: '2023-06-15T10:30:00',
        sender: 'Rajesh Kumar'
      },
      { 
        id: 2, 
        type: 'email', 
        direction: 'outgoing', 
        content: 'Thank you for your enquiry. We would be happy to discuss your requirements.', 
        timestamp: '2023-06-15T11:45:00',
        sender: 'Amit Sharma'
      }
    ],
    calls: [
      {
        id: 1,
        scheduledAt: '2023-06-16T14:00:00',
        duration: 30,
        status: 'completed',
        notes: 'Discussed website requirements and budget',
        participants: ['Rajesh Kumar', 'Amit Sharma']
      }
    ]
  },
  {
    id: 2,
    title: 'Mobile App Development',
    contactName: 'Priya Singh',
    contactEmail: 'priya@example.com',
    contactPhone: '+91 8765432109',
    source: 'Referral',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'Neha Patel',
    createdAt: '2023-06-10T14:20:00',
    updatedAt: '2023-06-14T09:15:00',
    description: 'Interested in developing a mobile app for food delivery service',
    tags: ['mobile', 'app', 'food-delivery'],
    tasks: [
      { id: 3, title: 'Prepare cost estimate', status: 'completed', dueDate: '2023-06-12' },
      { id: 4, title: 'Create project timeline', status: 'in-progress', dueDate: '2023-06-18' }
    ],
    communications: [
      { 
        id: 3, 
        type: 'phone', 
        direction: 'incoming', 
        content: 'Initial call about app development requirements', 
        timestamp: '2023-06-10T14:20:00',
        sender: 'Priya Singh'
      },
      { 
        id: 4, 
        type: 'email', 
        direction: 'outgoing', 
        content: 'Sending you the initial proposal as discussed', 
        timestamp: '2023-06-12T16:30:00',
        sender: 'Neha Patel'
      }
    ],
    calls: [
      {
        id: 2,
        scheduledAt: '2023-06-19T11:00:00',
        duration: 45,
        status: 'scheduled',
        notes: 'Follow-up call to discuss proposal',
        participants: ['Priya Singh', 'Neha Patel', 'Dev Team Lead']
      }
    ]
  },
  {
    id: 3,
    title: 'IT Support Services',
    contactName: 'Vikram Malhotra',
    contactEmail: 'vikram@example.com',
    contactPhone: '+91 7654321098',
    source: 'Email',
    status: 'converted',
    priority: 'low',
    assignedTo: 'Rahul Verma',
    createdAt: '2023-05-25T09:10:00',
    updatedAt: '2023-06-05T13:40:00',
    description: 'Looking for ongoing IT support for small business with 15 employees',
    tags: ['IT support', 'maintenance', 'small business'],
    tasks: [
      { id: 5, title: 'Prepare service agreement', status: 'completed', dueDate: '2023-05-30' },
      { id: 6, title: 'Schedule onboarding', status: 'completed', dueDate: '2023-06-05' }
    ],
    communications: [
      { 
        id: 5, 
        type: 'email', 
        direction: 'incoming', 
        content: 'Request for IT support services quote', 
        timestamp: '2023-05-25T09:10:00',
        sender: 'Vikram Malhotra'
      },
      { 
        id: 6, 
        type: 'whatsapp', 
        direction: 'outgoing', 
        content: 'Service agreement has been sent to your email', 
        timestamp: '2023-05-30T15:20:00',
        sender: 'Rahul Verma'
      }
    ],
    calls: [
      {
        id: 3,
        scheduledAt: '2023-05-28T10:30:00',
        duration: 25,
        status: 'completed',
        notes: 'Discussed IT support requirements and service options',
        participants: ['Vikram Malhotra', 'Rahul Verma']
      }
    ]
  }
];

// Fetch all enquiries with optional filters
export const fetchEnquiries = async (filters = {}) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.get(API_URL, { params: filters });
    // return response.data;
    
    // For development, return mock data with filtering
    let filteredData = [...mockEnquiries];
    
    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter(e => e.status === filters.status);
    }
    
    if (filters.source && filters.source !== 'all') {
      filteredData = filteredData.filter(e => e.source === filters.source);
    }
    
    if (filters.dateRange && filters.dateRange !== 'all') {
      // Implement date filtering logic here
      // This is a simplified example
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      if (filters.dateRange === 'last30days') {
        filteredData = filteredData.filter(e => new Date(e.createdAt) >= thirtyDaysAgo);
      }
    }
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
};

// Fetch a single enquiry by ID
export const fetchEnquiryById = async (id) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.get(`${API_URL}/${id}`);
    // return response.data;
    
    // For development, return mock data
    const enquiry = mockEnquiries.find(e => e.id === id);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    return enquiry;
  } catch (error) {
    console.error(`Error fetching enquiry ${id}:`, error);
    throw error;
  }
};

// Create a new enquiry
export const createEnquiry = async (enquiryData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.post(API_URL, enquiryData);
    // return response.data;
    
    // For development, simulate creating a new enquiry
    const newEnquiry = {
      id: mockEnquiries.length + 1,
      ...enquiryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
      communications: [],
      calls: []
    };
    
    mockEnquiries.push(newEnquiry);
    return newEnquiry;
  } catch (error) {
    console.error('Error creating enquiry:', error);
    throw error;
  }
};

// Update an existing enquiry
export const updateEnquiry = async (id, enquiryData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.put(`${API_URL}/${id}`, enquiryData);
    // return response.data;
    
    // For development, simulate updating an enquiry
    const index = mockEnquiries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Enquiry not found');
    }
    
    const updatedEnquiry = {
      ...mockEnquiries[index],
      ...enquiryData,
      updatedAt: new Date().toISOString()
    };
    
    mockEnquiries[index] = updatedEnquiry;
    return updatedEnquiry;
  } catch (error) {
    console.error(`Error updating enquiry ${id}:`, error);
    throw error;
  }
};

// Add a task to an enquiry
export const addTask = async (enquiryId, taskData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.post(`${API_URL}/${enquiryId}/tasks`, taskData);
    // return response.data;
    
    // For development, simulate adding a task
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const newTask = {
      id: enquiry.tasks.length > 0 ? Math.max(...enquiry.tasks.map(t => t.id)) + 1 : 1,
      ...taskData
    };
    
    enquiry.tasks.push(newTask);
    enquiry.updatedAt = new Date().toISOString();
    
    return newTask;
  } catch (error) {
    console.error(`Error adding task to enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Update a task
export const updateTask = async (enquiryId, taskId, taskData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.put(`${API_URL}/${enquiryId}/tasks/${taskId}`, taskData);
    // return response.data;
    
    // For development, simulate updating a task
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const taskIndex = enquiry.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...enquiry.tasks[taskIndex],
      ...taskData
    };
    
    enquiry.tasks[taskIndex] = updatedTask;
    enquiry.updatedAt = new Date().toISOString();
    
    return updatedTask;
  } catch (error) {
    console.error(`Error updating task ${taskId} for enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (enquiryId, taskId) => {
  try {
    // In a real application, this would be an API call
    // await axios.delete(`${API_URL}/${enquiryId}/tasks/${taskId}`);
    
    // For development, simulate deleting a task
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const taskIndex = enquiry.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    enquiry.tasks.splice(taskIndex, 1);
    enquiry.updatedAt = new Date().toISOString();
    
    return true;
  } catch (error) {
    console.error(`Error deleting task ${taskId} for enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Add a communication log
export const addCommunication = async (enquiryId, communicationData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.post(`${API_URL}/${enquiryId}/communications`, communicationData);
    // return response.data;
    
    // For development, simulate adding a communication log
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const newCommunication = {
      id: enquiry.communications.length > 0 ? Math.max(...enquiry.communications.map(c => c.id)) + 1 : 1,
      timestamp: new Date().toISOString(),
      ...communicationData
    };
    
    enquiry.communications.push(newCommunication);
    enquiry.updatedAt = new Date().toISOString();
    
    return newCommunication;
  } catch (error) {
    console.error(`Error adding communication to enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Schedule a call
export const scheduleCall = async (enquiryId, callData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.post(`${API_URL}/${enquiryId}/calls`, callData);
    // return response.data;
    
    // For development, simulate scheduling a call
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const newCall = {
      id: enquiry.calls.length > 0 ? Math.max(...enquiry.calls.map(c => c.id)) + 1 : 1,
      status: 'scheduled',
      ...callData
    };
    
    enquiry.calls.push(newCall);
    enquiry.updatedAt = new Date().toISOString();
    
    return newCall;
  } catch (error) {
    console.error(`Error scheduling call for enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Update call status and add feedback
export const updateCall = async (enquiryId, callId, callData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.put(`${API_URL}/${enquiryId}/calls/${callId}`, callData);
    // return response.data;
    
    // For development, simulate updating a call
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    const callIndex = enquiry.calls.findIndex(c => c.id === callId);
    if (callIndex === -1) {
      throw new Error('Call not found');
    }
    
    const updatedCall = {
      ...enquiry.calls[callIndex],
      ...callData
    };
    
    enquiry.calls[callIndex] = updatedCall;
    enquiry.updatedAt = new Date().toISOString();
    
    return updatedCall;
  } catch (error) {
    console.error(`Error updating call ${callId} for enquiry ${enquiryId}:`, error);
    throw error;
  }
};

// Convert enquiry to profile
export const convertEnquiryToProfile = async (enquiryId, profileData) => {
  try {
    // In a real application, this would be an API call
    // const response = await axios.post(`${API_URL}/${enquiryId}/convert`, profileData);
    // return response.data;
    
    // For development, simulate converting an enquiry
    const enquiry = mockEnquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    // Update the enquiry status to converted
    enquiry.status = 'converted';
    enquiry.updatedAt = new Date().toISOString();
    
    // In a real application, this would create a new profile in the profiles collection
    // and link it to this enquiry
    
    return {
      success: true,
      enquiryId,
      profileId: Math.floor(Math.random() * 1000) + 1, // Simulate a new profile ID
      profileType: profileData.profileType
    };
  } catch (error) {
    console.error(`Error converting enquiry ${enquiryId} to profile:`, error);
    throw error;
  }
};