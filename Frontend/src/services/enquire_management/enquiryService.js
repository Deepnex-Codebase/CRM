import api from '../../utils/api';

class EnquiryService {
  // Get all enquiries with filters
  async getEnquiries(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters with defaults if not provided
      queryParams.append('page', filters.page || 1);
      queryParams.append('limit', filters.limit || 100); // Get more results by default for dropdowns
      
      // Add filters to query params
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.source_type) queryParams.append('source_type', filters.source_type);
      if (filters.assigned_to) queryParams.append('assigned_to', filters.assigned_to);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.enquiry_type) queryParams.append('enquiry_profile', filters.enquiry_type);
      if (filters.dateFrom) queryParams.append('date_from', filters.dateFrom);
      if (filters.dateTo) queryParams.append('date_to', filters.dateTo);
      if (filters.sortBy) queryParams.append('sort', filters.sortBy);
      if (filters.sortOrder) queryParams.append('order', filters.sortOrder);
      if (filters.search) queryParams.append('search', filters.search);
      
      const response = await api.get(`/enquiries?${queryParams.toString()}`);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Invalid response format: missing data');
      }
      
      // For dropdown usage (CommunicationLog.jsx), return the structured format
      if (filters.forDropdown) {
        return {
          success: true,
          data: {
            docs: response.data.data || response.data.docs || [],
            total: response.data.total || response.data.count || 0,
            page: response.data.page || filters.page || 1,
            limit: response.data.limit || filters.limit || 100
          },
          message: response.data.message || 'Enquiries fetched successfully'
        };
      }
      
      // For EnquiryList.jsx, return the original format that it expects
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      // Return a structured error response instead of throwing
      if (filters.forDropdown) {
        return {
          success: false,
          data: { docs: [], total: 0, page: 1, limit: 10 },
          message: error.response?.data?.message || error.message || 'Failed to fetch enquiries'
        };
      }
      // For list view, return an empty array to prevent map errors
      return { data: [], total: 0 };
    }
  }

  // Get enquiry by ID
  async getEnquiryById(id) {
    try {
      const response = await api.get(`/enquiries/${id}`);
      
      // Return standardized response format
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Enquiry fetched successfully'
      };
    } catch (error) {
      console.error(`Error fetching enquiry ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || `Failed to fetch enquiry ${id}`
      };
    }
  }

  // Update enquiry status
  async updateEnquiryStatus(id, status) {
    try {
      const response = await api.put(`/enquiries/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating enquiry ${id} status:`, error);
      throw error;
    }
  }

  // Assign enquiry
  async assignEnquiry(id, userId) {
    try {
      const response = await api.put(`/enquiries/${id}/assign`, { assigned_to: userId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning enquiry ${id}:`, error);
      throw error;
    }
  }

  // Bulk update status
  async bulkUpdateStatus(ids, status) {
    try {
      const response = await api.put('/enquiries/bulk/status', { ids, status });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating status:', error);
      throw error;
    }
  }

  // Bulk assign
  async bulkAssign(ids, userId) {
    try {
      const response = await api.put('/enquiries/bulk/assign', { ids, assigned_to: userId });
      return response.data;
    } catch (error) {
      console.error('Error bulk assigning enquiries:', error);
      throw error;
    }
  }

  // Export enquiries
  async exportEnquiries(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.source_type) queryParams.append('source_type', filters.source_type);
      if (filters.assigned_to) queryParams.append('assigned_to', filters.assigned_to);
      if (filters.dateFrom) queryParams.append('date_from', filters.dateFrom);
      if (filters.dateTo) queryParams.append('date_to', filters.dateTo);
      
      const response = await api.get(`/enquiries/export?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting enquiries:', error);
      throw error;
    }
  }

  // Add remark
  async addRemark(id, remark) {
    try {
      const response = await api.post(`/enquiries/${id}/remarks`, { remark });
      return response.data;
    } catch (error) {
      console.error(`Error adding remark to enquiry ${id}:`, error);
      throw error;
    }
  }

  // Get enquiry remarks
  async getEnquiryRemarks(id) {
    try {
      const response = await api.get(`/enquiries/${id}/remarks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching remarks for enquiry ${id}:`, error);
      throw error;
    }
  }

  // Get enquiry filters
  async getEnquiryFilters() {
    try {
      const response = await api.get('/enquiries/filters');
      return response.data;
    } catch (error) {
      console.error('Error fetching enquiry filters:', error);
      throw error;
    }
  }

  // Create new enquiry
  async createEnquiry(enquiryData) {
    try {
      const response = await api.post('/enquiries', enquiryData);
      return response.data;
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  }

  // Update enquiry
  async updateEnquiry(id, enquiryData) {
    try {
      const response = await api.put(`/enquiries/${id}`, enquiryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating enquiry ${id}:`, error);
      throw error;
    }
  }

  // Delete enquiry
  async deleteEnquiry(id) {
    try {
      const response = await api.delete(`/enquiries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting enquiry ${id}:`, error);
      throw error;
    }
  }

  // Start call
  async startCall(enquiryId) {
    try {
      const response = await api.post('/enquiries/calls/start', { enquiry_id: enquiryId });
      return response.data;
    } catch (error) {
      console.error(`Error starting call for enquiry ${enquiryId}:`, error);
      throw error;
    }
  }

  // End call
  async endCall(callId, callData) {
    try {
      const response = await api.post('/enquiries/calls/end', { call_id: callId, ...callData });
      return response.data;
    } catch (error) {
      console.error(`Error ending call ${callId}:`, error);
      throw error;
    }
  }

  // Get enquiry calls
  async getEnquiryCalls(enquiryId) {
    try {
      const response = await api.get(`/enquiries/${enquiryId}/calls`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching calls for enquiry ${enquiryId}:`, error);
      throw error;
    }
  }
}

export default new EnquiryService();