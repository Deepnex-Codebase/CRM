import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Main Pages
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Customers from './pages/Customers';

// User Management Pages
import UserManagement from './pages/user-management/UserManagement';
import RolePermissions from './pages/user-management/RolePermissions';
import SessionManagement from './pages/user-management/SessionManagement';
import TeamsManagement from './pages/user-management/TeamsManagement';
import EmployeeRoleAssignment from './pages/user-management/EmployeeRoleAssignment';
import DeviceRegistry from './pages/user-management/DeviceRegistry';
import ApiTokens from './pages/user-management/ApiTokens';
import SecurityLogs from './pages/user-management/SecurityLogs';
import AutomatedSecurityRules from './pages/user-management/AutomatedSecurityRules';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />
                
                {/* CRM Routes */}
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="customers" element={<Customers />} />
                
                {/* User Management Routes */}
              <Route path="/user-management/users" element={<UserManagement />} />
              <Route path="/user-management/roles" element={<RolePermissions />} />
              <Route path="/user-management/teams" element={<TeamsManagement />} />
              <Route path="/user-management/employee-roles" element={<EmployeeRoleAssignment />} />
              <Route path="/user-management/sessions" element={<SessionManagement />} />
              <Route path="/user-management/devices" element={<DeviceRegistry />} />
              <Route path="/user-management/api-tokens" element={<ApiTokens />} />
              <Route path="/user-management/security-logs" element={<SecurityLogs />} />
              <Route path="/user-management/security-rules" element={<AutomatedSecurityRules />} />
                
                {/* Legacy routes for backward compatibility */}
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RolePermissions />} />
                <Route path="sessions" element={<SessionManagement />} />
                
                {/* Placeholder routes for future implementation */}
                <Route path="leads" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Leads management coming soon...</p>
                  </div>
                } />
                
                <Route path="projects" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Project management coming soon...</p>
                  </div>
                } />
                
                <Route path="tasks" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Task management coming soon...</p>
                  </div>
                } />
                
                <Route path="calendar" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Calendar view coming soon...</p>
                  </div>
                } />
                
                <Route path="reports" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Reports and analytics coming soon...</p>
                  </div>
                } />
                
                <Route path="settings" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Application settings coming soon...</p>
                  </div>
                } />
                
                <Route path="profile" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">User profile management coming soon...</p>
                  </div>
                } />
              </Route>
              
              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;