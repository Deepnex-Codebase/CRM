import React, { useState } from 'react';

const TaskManagement = () => {
  // Sample data for demonstration
  const [tasks, setTasks] = useState([
    {
      task_id: 'TSK001',
      enquiry_id: 'ENQ001',
      title: 'Send product catalog',
      due_date: '2023-07-18',
      assigned_to: 'Amit Kumar',
      status: 'pending'
    },
    {
      task_id: 'TSK002',
      enquiry_id: 'ENQ001',
      title: 'Follow-up call',
      due_date: '2023-07-20',
      assigned_to: 'Amit Kumar',
      status: 'pending'
    },
    {
      task_id: 'TSK003',
      enquiry_id: 'ENQ002',
      title: 'Prepare quotation',
      due_date: '2023-07-19',
      assigned_to: 'Neha Singh',
      status: 'done'
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    assigned: '',
    enquiry: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    due_date: '',
    assigned_to: '',
    enquiry_id: '',
    remarks: ''
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle add task
  const handleAddTask = () => {
    setTaskForm({
      title: '',
      due_date: '',
      assigned_to: '',
      enquiry_id: '',
      remarks: ''
    });
    setShowModal(true);
  };

  // Handle save task
  const handleSaveTask = () => {
    const newTask = {
      task_id: `TSK${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...taskForm,
      status: 'pending'
    };
    
    setTasks(prev => [...prev, newTask]);
    setShowModal(false);
  };

  // Handle mark as done
  const handleMarkAsDone = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.task_id === taskId ? { ...task, status: 'done' } : task
      )
    );
  };

  // Filter tasks based on filters
  const filteredTasks = tasks.filter(task => {
    return (
      (filters.status === '' || task.status === filters.status) &&
      (filters.assigned === '' || task.assigned_to === filters.assigned) &&
      (filters.enquiry === '' || task.enquiry_id === filters.enquiry)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button 
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
      
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
              <option value="pending">Pending</option>
              <option value="done">Done</option>
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
        </div>
      </div>
      
      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enquiry ID
              </th>
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
            {filteredTasks.map((task) => (
              <tr key={task.task_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.task_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <a href={`/enquiry/${task.enquiry_id}`} className="text-indigo-600 hover:text-indigo-900">
                    {task.enquiry_id}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    <button 
                      onClick={() => handleMarkAsDone(task.task_id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark Done
                    </button>
                  )}
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTasks.length}</span> of{' '}
                <span className="font-medium">{filteredTasks.length}</span> results
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
      
      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Task</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Task title"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  name="due_date"
                  value={taskForm.due_date}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select 
                  name="assigned_to"
                  value={taskForm.assigned_to}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select User</option>
                  <option value="Amit Kumar">Amit Kumar</option>
                  <option value="Neha Singh">Neha Singh</option>
                  <option value="Raj Verma">Raj Verma</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID</label>
                <select 
                  name="enquiry_id"
                  value={taskForm.enquiry_id}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea 
                  name="remarks"
                  value={taskForm.remarks}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Additional notes"
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
                onClick={handleSaveTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;