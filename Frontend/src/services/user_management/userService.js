import api from '../../utils/api';

/**
 * User Management Service
 * Handles all user-related API operations
 */

class UserService {
  /**
   * Get all users with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term for name/email
   * @param {string} params.role_name - Filter by role name
   * @param {boolean} params.is_active - Filter by active status
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} API response with users data
   */
  async getUsers(params = {}) {
    try {
      const response = await api.get('/auth/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a single user by ID
   * @param {string} userId - User ID
   * @returns {Promise} API response with user data
   */
  async getUser(userId) {
    try {
      const response = await api.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.first_name - First name
   * @param {string} userData.last_name - Last name
   * @param {string} userData.email - Email address
   * @param {string} userData.phone - Phone number
   * @param {string} userData.role_name - Role name
   * @param {string} userData.password - Password (optional)
   * @returns {Promise} API response with created user data
   */
  async createUser(userData) {
    try {
      const response = await api.post('/auth/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response with updated user data
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Activate a user
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  async activateUser(userId) {
    try {
      const response = await api.put(`/auth/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Deactivate a user
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  async deactivateUser(userId) {
    try {
      const response = await api.put(`/auth/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user login history
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with login history
   */
  async getUserLoginHistory(userId, params = {}) {
    try {
      const response = await api.get(`/auth/users/${userId}/login-history`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user login history:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get active sessions
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with active sessions
   */
  async getActiveSessions(params = {}) {
    try {
      const response = await api.get('/auth/sessions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Revoke a session
   * @param {string} sessionId - Session ID
   * @returns {Promise} API response
   */
  async revokeSession(sessionId) {
    try {
      const response = await api.put(`/auth/sessions/${sessionId}/revoke`);
      return response.data;
    } catch (error) {
      console.error('Error revoking session:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get available roles
   * @returns {Promise} API response with roles data
   */
  async getRoles() {
    try {
      const response = await api.get('/api/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transform backend user data to frontend format
   * @param {Object} backendUser - User data from backend
   * @returns {Object} Transformed user data
   */
  transformUserData(backendUser) {
    // Extract role information from populated role_id field
    const roleData = backendUser.role_id || {};
    const roleName = roleData.role_name || 'Unknown';
    
    return {
      user_id: backendUser._id,
      username: `${backendUser.first_name} ${backendUser.last_name}`.toLowerCase().replace(/\s+/g, ''),
      email: backendUser.email,
      phone: backendUser.phone,
      status: backendUser.is_active ? 'Active' : 'Inactive',
      role: roleName, // Keep for backward compatibility
      role_assignment: {
        role_name: roleName,
        description: roleData.description || '',
        permissions: roleData.permissions || {},
        _id: roleData._id || null
      },
      created_at: backendUser.created_at ? new Date(backendUser.created_at).toISOString().split('T')[0] : null,
      last_login: backendUser.last_login ? new Date(backendUser.last_login).toLocaleString() : 'Never',
      updated_at: backendUser.updated_at ? new Date(backendUser.updated_at).toISOString() : null,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      department: backendUser.department || 'Not specified',
      team: backendUser.team || 'Not assigned',
      twoFactorEnabled: backendUser.two_factor_enabled || false,
      loginCount: backendUser.login_count || 0,
      // Additional fields for compatibility
      _id: backendUser._id,
      role_id: backendUser.role_id,
      is_active: backendUser.is_active,
      first_name: backendUser.first_name,
      last_name: backendUser.last_name
    };
  }

  /**
   * Transform frontend user data to backend format
   * @param {Object} frontendUser - User data from frontend
   * @returns {Object} Transformed user data for backend
   */
  transformUserDataForBackend(frontendUser) {
    // Extract role name from frontendUser data with improved handling
    let roleName = null;
    
    // Check all possible role formats in priority order
    if (frontendUser.role_assignment && frontendUser.role_assignment.role_name) {
      roleName = frontendUser.role_assignment.role_name;
    } else if (frontendUser.role && typeof frontendUser.role === 'object' && frontendUser.role.role_name) {
      roleName = frontendUser.role.role_name;
    } else if (frontendUser.role && typeof frontendUser.role === 'string') {
      roleName = frontendUser.role;
    } else if (frontendUser.role_id && typeof frontendUser.role_id === 'object' && frontendUser.role_id.role_name) {
      roleName = frontendUser.role_id.role_name;
    }

    
    return {
      first_name: frontendUser.firstName || frontendUser.first_name,
      last_name: frontendUser.lastName || frontendUser.last_name,
      email: frontendUser.email,
      phone: frontendUser.phone,
      role_name: roleName,
      password: frontendUser.password,
      department: frontendUser.department,
      team: frontendUser.team
    };
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - API error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      const status = error.response.status;
      const errorObj = new Error(`${message} (Status: ${status})`);
      
      // Add additional context for specific error codes
      if (status === 400) {
        errorObj.userMessage = 'Invalid request data. Please check your input and try again.';
      } else if (status === 401) {
        errorObj.userMessage = 'Authentication required. Please log in again.';
      } else if (status === 403) {
        errorObj.userMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        errorObj.userMessage = 'The requested resource was not found.';
      } else if (status === 409) {
        errorObj.userMessage = 'This operation caused a conflict. The resource may already exist.';
      } else if (status >= 500) {
        errorObj.userMessage = 'A server error occurred. Please try again later or contact support.';
      } else {
        errorObj.userMessage = 'An error occurred while processing your request.';
      }
      
      // Add response data for debugging
      errorObj.responseData = error.response.data;
      return errorObj;
    } else if (error.request) {
      // Request was made but no response received
      const errorObj = new Error('Network error: Unable to connect to server');
      errorObj.userMessage = 'Connection to server failed. Please check your internet connection and try again.';
      errorObj.isNetworkError = true;
      return errorObj;
    } else {
      // Something else happened
      const errorObj = new Error(error.message || 'An unexpected error occurred');
      errorObj.userMessage = 'Something went wrong. Please try again or contact support.';
      return errorObj;
    }
  }
}

// Export singleton instance
export default new UserService();
