import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import enquiryService from '../../../services/enquire_management/enquiryService';
import { useTheme } from '../../../context/ThemeContext';

const EnquiryDetail = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        setLoading(true);
        const data = await enquiryService.getEnquiryById(id);
        setEnquiry(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load enquiry details');
        setLoading(false);
        console.error('Error fetching enquiry:', err);
      }
    };
    
    fetchEnquiryData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link 
          to="/enquiries" 
          className={`flex items-center font-medium ${
            isDark 
              ? 'text-white' 
              : 'text-black'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Enquiries
        </Link>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Enquiry Details */}
      {!loading && !error && enquiry && (
        <>
          {/* Header */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Enquiry #{enquiry.enquiry_id || enquiry._id}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    Type: {enquiry.enquiry_profile || 'N/A'}
                  </span>

                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    Source: {enquiry.source_type || 'N/A'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    enquiry.status === 'NEW' || enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    enquiry.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    enquiry.status === 'CLOSED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Status: {enquiry.status || 'N/A'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    enquiry.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    enquiry.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                    enquiry.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Priority: {enquiry.priority || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    Stage: {enquiry.stage || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Update Status
                </button>
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{enquiry.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{enquiry.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{enquiry.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pincode</p>
                <p className="font-medium">{enquiry.pincode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="font-medium">{enquiry.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="font-medium">{enquiry.district || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{enquiry.branch || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p className="font-medium">{formatDate(enquiry.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated On</p>
                <p className="font-medium">{formatDate(enquiry.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">PV Capacity (kW)</p>
                <p className="font-medium">{enquiry.pv_capacity_kw || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Type</p>
                <p className="font-medium">{enquiry.project_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{enquiry.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Connection Type</p>
                <p className="font-medium">{enquiry.connection_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Enhancement</p>
                <p className="font-medium">{enquiry.project_enhancement || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subsidy Type</p>
                <p className="font-medium">{enquiry.subsidy_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Model</p>
                <p className="font-medium">{enquiry.business_model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Metering</p>
                <p className="font-medium">{enquiry.metering || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Need Loan</p>
                <p className="font-medium">{enquiry.need_loan ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Location</p>
                <p className="font-medium">{enquiry.project_location || 'N/A'}</p>
              </div>
              {enquiry.profile_data && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Roof Type</p>
                    <p className="font-medium">{enquiry.profile_data.roof_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area (sqft)</p>
                    <p className="font-medium">{enquiry.profile_data.area_sqft || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiry.aadhaar_file && (
                <div>
                  <p className="text-sm text-gray-500">Aadhaar Card</p>
                  <button 
                    onClick={() => handleFileDownload(enquiry.aadhaar_file)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View/Download
                  </button>
                </div>
              )}
              {enquiry.electricity_bill_file && (
                <div>
                  <p className="text-sm text-gray-500">Electricity Bill</p>
                  <button 
                    onClick={() => handleFileDownload(enquiry.electricity_bill_file)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View/Download
                  </button>
                </div>
              )}
              {enquiry.bank_statement_file && (
                <div>
                  <p className="text-sm text-gray-500">Bank Statement</p>
                  <button 
                    onClick={() => handleFileDownload(enquiry.bank_statement_file)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View/Download
                  </button>
                </div>
              )}
              {enquiry.pan_file && (
                <div>
                  <p className="text-sm text-gray-500">PAN Card</p>
                  <button 
                    onClick={() => handleFileDownload(enquiry.pan_file)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View/Download
                  </button>
                </div>
              )}
              {enquiry.project_proposal_file && (
                <div>
                  <p className="text-sm text-gray-500">Project Proposal</p>
                  <button 
                    onClick={() => handleFileDownload(enquiry.project_proposal_file)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View/Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lead Information */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Lead Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type of Lead</p>
                <p className="font-medium">{enquiry.type_of_lead || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status of Lead</p>
                <p className="font-medium">{enquiry.status_of_lead || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source of Lead</p>
                <p className="font-medium">{enquiry.source_of_lead || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source of Reference</p>
                <p className="font-medium">{enquiry.source_of_reference || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Channel Type</p>
                <p className="font-medium">{enquiry.channel_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority Score</p>
                <p className="font-medium">{enquiry.priority_score || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Call Status</p>
                <p className="font-medium">{enquiry.call_status || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Called At</p>
                <p className="font-medium">{formatDate(enquiry.last_called_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Follow Up</p>
                <p className="font-medium">{formatDate(enquiry.next_follow_up)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium">
                  {enquiry.assigned_to ? 
                    (typeof enquiry.assigned_to === 'object' && enquiry.assigned_to !== null ? 
                      `${enquiry.assigned_to.first_name || ''} ${enquiry.assigned_to.last_name || ''}` : 
                      enquiry.assigned_to) : 
                    'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned Team</p>
                <p className="font-medium">{enquiry.assigned_team || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Is Duplicate</p>
                <p className="font-medium">{enquiry.is_duplicate ? 'Yes' : 'No'}</p>
              </div>
              {enquiry.duplicate_of && (
                <div>
                  <p className="text-sm text-gray-500">Duplicate Of</p>
                  <p className="font-medium">{enquiry.duplicate_of}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quotation Information */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Quotation Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Quotation Amount</p>
                <p className="font-medium">₹{enquiry.quotation_amount ? enquiry.quotation_amount.toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quotation Date</p>
                <p className="font-medium">{formatDate(enquiry.quotation_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quotation Status</p>
                <p className="font-medium">{enquiry.quotation_status || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Marketing Information */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Marketing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">UTM Source</p>
                <p className="font-medium">{enquiry.utm_source || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">UTM Medium</p>
                <p className="font-medium">{enquiry.utm_medium || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">UTM Campaign</p>
                <p className="font-medium">{enquiry.utm_campaign || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">UTM Term</p>
                <p className="font-medium">{enquiry.utm_term || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">UTM Content</p>
                <p className="font-medium">{enquiry.utm_content || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Referrer URL</p>
                <p className="font-medium">{enquiry.referrer_url || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Landing Page</p>
                <p className="font-medium">{enquiry.landing_page || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Device Information */}
          {enquiry.device_info && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Device Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Device</p>
                  <p className="font-medium">{enquiry.device_info.device || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">OS</p>
                  <p className="font-medium">{enquiry.device_info.os || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Browser</p>
                  <p className="font-medium">{enquiry.device_info.browser || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Remarks</h2>
            {enquiry.add_remarks && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Additional Remarks</p>
                <p className="font-medium whitespace-pre-wrap">{enquiry.add_remarks}</p>
              </div>
            )}
            {Array.isArray(enquiry.remarks) && enquiry.remarks.length > 0 ? (
              <div className="space-y-4">
                {enquiry.remarks.map((remark, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">{remark.text}</p>
                      <p className="text-sm text-gray-500">{formatDate(remark.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      By: {remark.user_id ? (typeof remark.user_id === 'object' ? remark.user_id.$oid : remark.user_id) : 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No remarks available</p>
            )}
          </div>

          {/* Tabs Navigation */}
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
          </div>
        </>
      )}
    </div>
  );
};

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle file download
  const handleFileDownload = (filePath) => {
    if (!filePath) return;
    console.log(`Download file: ${filePath}`);
    // You would typically make an API call to download the file
    // window.open(`/api/files/download?path=${encodeURIComponent(filePath)}`, '_blank');
  };

export default EnquiryDetail;