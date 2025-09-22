import api from '../../utils/api';

/**
 * Team Management Service
 * Handles all team-related API operations
 */

class TeamService {
  // Get all teams with pagination and filtering
  async getTeams(params = {}) {
    try {
      // Validate pagination parameters
      if (params.page && (!Number.isInteger(params.page) || params.page < 1)) {
        return {
          success: false,
          message: 'Page number must be a positive integer',
          error: 'VALIDATION_ERROR'
        };
      }
      
      if (params.limit && (!Number.isInteger(params.limit) || params.limit < 1 || params.limit > 100)) {
        return {
          success: false,
          message: 'Limit must be between 1 and 100',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.get('/teams', { params });
      return {
        success: true,
        data: response.data.teams || [],
        pagination: response.data.pagination || {},
        message: 'Teams retrieved successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Get single team by ID
  async getTeam(teamId) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.get(`/teams/${teamId}`);
      return {
        success: true,
        data: response.data,
        message: 'Team retrieved successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Create new team
  async createTeam(teamData) {
    try {
      // Validate team data
      const validation = this.constructor.validateTeamData(teamData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: 'VALIDATION_ERROR',
          details: validation.errors
        };
      }

      const response = await api.post('/teams', teamData);
      return {
        success: true,
        data: response.data,
        message: 'Team created successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Update existing team
  async updateTeam(teamId, teamData) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      // Validate team data
      const validation = this.constructor.validateTeamData(teamData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: 'VALIDATION_ERROR',
          details: validation.errors
        };
      }

      const response = await api.put(`/teams/${teamId}`, teamData);
      return {
        success: true,
        data: response.data,
        message: 'Team updated successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Delete team
  async deleteTeam(teamId) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      await api.delete(`/teams/${teamId}`);
      return {
        success: true,
        message: 'Team deleted successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Get team members
  async getTeamMembers(teamId) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.get(`/teams/${teamId}/members`);
      return {
        success: true,
        data: response.data,
        message: 'Team members retrieved successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Add member to team
  async addTeamMember(teamId, memberData) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      // Validate member data
      if (!memberData || !memberData.user_id) {
        return {
          success: false,
          message: 'User ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.post(`/teams/${teamId}/members`, memberData);
      return {
        success: true,
        data: response.data,
        message: 'Member added successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Remove member from team
  async removeTeamMember(teamId, memberId) {
    try {
      // Validate IDs
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      if (!memberId || typeof memberId !== 'string') {
        return {
          success: false,
          message: 'Valid member ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      await api.delete(`/teams/${teamId}/members/${memberId}`);
      return {
        success: true,
        message: 'Member removed successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Update member role in team
  async updateMemberRole(teamId, memberId, roleData) {
    try {
      // Validate IDs
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      if (!memberId || typeof memberId !== 'string') {
        return {
          success: false,
          message: 'Valid member ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      // Validate role data
      if (!roleData || !roleData.role) {
        return {
          success: false,
          message: 'Role is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.put(`/teams/${teamId}/members/${memberId}`, roleData);
      return {
        success: true,
        data: response.data,
        message: 'Member role updated successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Assign territory to team
  async assignTerritory(teamId, territoryData) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      // Validate territory data
      if (!territoryData || !territoryData.territory) {
        return {
          success: false,
          message: 'Territory is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.post(`/teams/${teamId}/territory`, territoryData);
      return {
        success: true,
        data: response.data,
        message: 'Territory assigned successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  // Get team performance metrics
  async getTeamMetrics(teamId, params = {}) {
    try {
      // Validate team ID
      if (!teamId || typeof teamId !== 'string') {
        return {
          success: false,
          message: 'Valid team ID is required',
          error: 'VALIDATION_ERROR'
        };
      }

      const response = await api.get(`/teams/${teamId}/metrics`, { params });
      return {
        success: true,
        data: response.data,
        message: 'Team metrics retrieved successfully'
      };
    } catch (error) {
      return this.constructor.handleApiError(error);
    }
  }

  /**
   * Get teams by department
   * @param {string} department - Department name
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with teams data
   */
  async getTeamsByDepartment(department, params = {}) {
    try {
      const response = await api.get(`/profile/teams/department/${department}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams by department:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get teams by type
   * @param {string} type - Team type
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with teams data
   */
  async getTeamsByType(type, params = {}) {
    try {
      const response = await api.get(`/profile/teams/type/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams by type:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get teams for a specific user
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with user's teams data
   */
  async getUserTeams(userId, params = {}) {
    try {
      const response = await api.get(`/profile/teams/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Assign team to a profile
   * @param {Object} assignmentData - Assignment data
   * @param {string} assignmentData.team_id - Team ID
   * @param {string} assignmentData.profile_type - Profile type
   * @param {string} assignmentData.profile_id - Profile ID
   * @returns {Promise} API response
   */
  async assignTeamToProfile(assignmentData) {
    try {
      const response = await api.post('/profile/teams/assign', assignmentData);
      return response.data;
    } catch (error) {
      console.error('Error assigning team to profile:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get team assignments
   * @param {string} teamId - Team ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with assignments data
   */
  async getTeamAssignments(teamId, params = {}) {
    try {
      const response = await api.get(`/profile/teams/${teamId}/assignments`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching team assignments:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Unassign team from a profile
   * @param {string} profileType - Profile type
   * @param {string} profileId - Profile ID
   * @returns {Promise} API response
   */
  async unassignTeamFromProfile(profileType, profileId) {
    try {
      const response = await api.delete(`/profile/teams/assign/${profileType}/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Error unassigning team from profile:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transform backend team data to frontend format
   * @param {Object} backendTeam - Team data from backend
   * @returns {Object} Transformed team data for frontend
   */
  transformTeamData(backendTeam) {
    if (!backendTeam) return null;

    return {
      team_id: backendTeam.team_id || backendTeam._id,
      team_name: backendTeam.name,
      department: backendTeam.department,
      description: backendTeam.description || '',
      team_type: backendTeam.team_type,
      status: backendTeam.is_active ? 'Active' : 'Inactive',
      created_at: backendTeam.created_at,
      updated_at: backendTeam.updated_at,
      created_by: backendTeam.created_by,
      // Additional computed fields for frontend compatibility
      member_count: backendTeam.member_count || 0,
      team_lead: backendTeam.team_lead || 'Not Assigned',
      team_lead_id: backendTeam.team_lead_id || null,
      territory: backendTeam.territory || 'Not Specified',
      members: backendTeam.members || []
    };
  }

  /**
   * Transform frontend team data to backend format
   * @param {Object} frontendTeam - Team data from frontend
   * @returns {Object} Transformed team data for backend
   */
  transformTeamDataForBackend(frontendTeam) {
    if (!frontendTeam) return null;

    return {
      name: frontendTeam.team_name || frontendTeam.name,
      description: frontendTeam.description || '',
      department: frontendTeam.department,
      team_type: frontendTeam.team_type || 'other',
      is_active: frontendTeam.status === 'Active' || frontendTeam.is_active !== false
    };
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || 'An error occurred';
      
      switch (status) {
        case 400:
          return new Error(`Invalid request: ${message}`);
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Access denied');
        case 404:
          return new Error('Team not found');
        case 409:
          return new Error(`Conflict: ${message}`);
        case 422:
          return new Error(`Validation error: ${message}`);
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(message);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Get available departments
   * @returns {Array} List of available departments
   */
  getDepartments() {
    return [
      'Sales',
      'Marketing',
      'Engineering',
      'Support',
      'Finance',
      'HR',
      'Operations',
      'Management',
      'Other'
    ];
  }

  /**
   * Get available team types
   * @returns {Array} List of available team types
   */
  getTeamTypes() {
    return [
      { value: 'project', label: 'Project Team' },
      { value: 'product', label: 'Product Team' },
      { value: 'amc', label: 'AMC Team' },
      { value: 'complaint', label: 'Complaint Team' },
      { value: 'info', label: 'Info Team' },
      { value: 'job', label: 'Job Team' },
      { value: 'site_visit', label: 'Site Visit Team' },
      { value: 'cross_functional', label: 'Cross-functional Team' },
      { value: 'other', label: 'Other' }
    ];
  }

  // Validation helpers
  static validateTeamData(teamData) {
    const errors = [];
    
    // Define departments and team types locally for static method
    const departments = [
      'Sales',
      'Marketing',
      'Engineering',
      'Support',
      'Finance',
      'HR',
      'Operations',
      'Management',
      'Other'
    ];
    
    const teamTypes = [
      'project',
      'product',
      'amc',
      'complaint',
      'info',
      'job',
      'site_visit',
      'cross_functional',
      'other'
    ];
    
    // Name validation
    if (!teamData.name || typeof teamData.name !== 'string') {
      errors.push('Team name is required');
    } else if (teamData.name.trim().length < 2) {
      errors.push('Team name must be at least 2 characters long');
    } else if (teamData.name.trim().length > 100) {
      errors.push('Team name must be less than 100 characters');
    }
    
    // Department validation
    if (!teamData.department || typeof teamData.department !== 'string') {
      errors.push('Department is required');
    } else if (!departments.includes(teamData.department)) {
      errors.push('Invalid department selected');
    }
    
    // Team lead validation
    if (!teamData.team_lead || typeof teamData.team_lead !== 'string') {
      errors.push('Team lead is required');
    } else if (teamData.team_lead.trim().length < 2) {
      errors.push('Team lead name must be at least 2 characters long');
    } else if (teamData.team_lead.trim().length > 100) {
      errors.push('Team lead name must be less than 100 characters');
    }
    
    // Description validation
    if (teamData.description) {
      if (typeof teamData.description !== 'string') {
        errors.push('Description must be a string');
      } else if (teamData.description.length > 500) {
        errors.push('Description must be less than 500 characters');
      }
    }
    
    // Team type validation
    if (teamData.team_type && !teamTypes.includes(teamData.team_type)) {
      errors.push('Invalid team type selected');
    }
    
    // Territory validation
    if (teamData.territory && typeof teamData.territory !== 'string') {
      errors.push('Territory must be a string');
    } else if (teamData.territory && teamData.territory.length > 100) {
      errors.push('Territory must be less than 100 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Enhanced error handling
  static handleApiError(error) {
    console.error('API Error:', error);
    
    // Network errors
    if (!error.response) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        error: 'NETWORK_ERROR'
      };
    }
    
    // HTTP errors
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return {
          success: false,
          message: data?.message || 'Invalid request. Please check your input.',
          error: 'VALIDATION_ERROR',
          details: data?.errors || []
        };
      case 401:
        return {
          success: false,
          message: 'Authentication required. Please log in again.',
          error: 'AUTH_ERROR'
        };
      case 403:
        return {
          success: false,
          message: 'You do not have permission to perform this action.',
          error: 'PERMISSION_ERROR'
        };
      case 404:
        return {
          success: false,
          message: 'Team not found.',
          error: 'NOT_FOUND'
        };
      case 409:
        return {
          success: false,
          message: data?.message || 'A team with this name already exists.',
          error: 'CONFLICT_ERROR'
        };
      case 422:
        return {
          success: false,
          message: data?.message || 'Invalid data provided.',
          error: 'VALIDATION_ERROR',
          details: data?.errors || []
        };
      case 500:
        return {
          success: false,
          message: 'Server error. Please try again later.',
          error: 'SERVER_ERROR'
        };
      default:
        return {
          success: false,
          message: data?.message || 'An unexpected error occurred.',
          error: 'UNKNOWN_ERROR'
        };
    }
  }
}

export default new TeamService();