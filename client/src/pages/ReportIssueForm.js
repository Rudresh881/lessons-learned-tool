import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FilePlus, X, AlertCircle, ChevronDown } from 'lucide-react';

export default function ReportIssueForm() {
  const [formData, setFormData] = useState({
    ntId: '',
    email: '',
    projectName: '',
    ratedPower: '',
    ratedSpeed: '',
    application: '',
    legislation: '',
    fieSystem: '',
    egtSystem: '',
    issueTitle: '',
    description: '',
    issueType: 'Hardware',
    customerName: '',
    fuelType: ''
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file =>
      ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) &&
      file.size <= 10 * 1024 * 1024
    );
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      files.forEach(file => formDataToSend.append('files', file));

      const response = await axios.post('/api/issues', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          ntId: '',
          email: '',
          projectName: '',
          ratedPower: '',
          ratedSpeed: '',
          application: '',
          legislation: '',
          fieSystem: '',
          egtSystem: '',
          issueTitle: '',
          description: '',
          issueType: 'Hardware',
          customerName: '',
          fuelType: ''
        });
        setFiles([]);
      }
    } catch (err) {
      let errorMessage = 'Failed to submit issue';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (!err.response) {
        errorMessage = 'Server not responding. Check:\n1. Backend is running\n2. Network connection';
      } else {
        errorMessage = err.response.data?.message || err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Report New Issue</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Error:</span>
          </div>
          <div className="mt-1 whitespace-pre-line">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          Issue submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-blue-800 mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="NT ID" name="ntId" value={formData.ntId} onChange={handleChange} required />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Project Name / PIDC" name="projectName" value={formData.projectName} onChange={handleChange} required />
            <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
            <InputField label="Rated Power (kW)" name="ratedPower" type="number" value={formData.ratedPower} onChange={handleChange} required />
            <InputField label="Rated Speed (rpm)" name="ratedSpeed" type="number" value={formData.ratedSpeed} onChange={handleChange} required />
            <InputField label="Application" name="application" value={formData.application} onChange={handleChange} required />
            <InputField label="Legislation" name="legislation" value={formData.legislation} onChange={handleChange} required />
            <InputField label="FIE System (optional)" name="fieSystem" value={formData.fieSystem} onChange={handleChange} />
            <InputField label="EGT System (optional)" name="egtSystem" value={formData.egtSystem} onChange={handleChange} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Calibration">Calibration</option>
                  <option value="Process">Process</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type <span className="text-red-500">*</span></label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Fuel Type</option>
                <option value="Diesel">Diesel</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Natural Gas">Natural Gas</option>
                <option value="Biofuel">Biofuel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issue Details */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Issue Details</h2>
          <div className="space-y-6">
            <InputField label="Issue Title" name="issueTitle" value={formData.issueTitle} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="block w-full text-sm text-gray-500"
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <div className="flex items-center">
                        <FilePlus className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {(file.size / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Issue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input field component
function InputField({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
