import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function Implementation() {
  const [ntId, setNtId] = useState('');
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [solution, setSolution] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIssues = async () => {
    if (!ntId.trim()) return;
    try {
      const response = await axios.get(`/api/issues?ntId=${ntId}&status=Open`);
      setIssues(response.data.data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('solutionDescription', solution);
      formData.append('solvedBy', ntId);
      files.forEach(file => formData.append('solutionFiles', file));

      await axios.patch(`/api/issues/${selectedIssue._id}/resolve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSelectedIssue(null);
      setSolution('');
      setFiles([]);
      fetchIssues();
    } catch (err) {
      console.error('Error submitting solution:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Implementation</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter your NT ID
        </label>
        <div className="flex">
          <input
            type="text"
            value={ntId}
            onChange={(e) => setNtId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your NT ID"
          />
          <button
            onClick={fetchIssues}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Get My Issues
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Your Open Issues</h2>
          <div className="space-y-3">
            {issues.map(issue => (
              <div 
                key={issue._id} 
                className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{issue.issueTitle}</h3>
                  <span className="text-sm text-gray-500">{issue.projectName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedIssue && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Solution for: {selectedIssue.issueTitle}</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solution Description
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supporting Files
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>{file.name}</span>
                    <button 
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Resolved
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
   return <div>Implementation Content</div>;
}