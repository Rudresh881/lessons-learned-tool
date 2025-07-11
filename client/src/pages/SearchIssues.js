import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
import IssueCard from '../components/IssueCard';
import SolutionModal from '../components/EditSolutionModal';
import ViewIssueModal from '../components/ViewIssueModal';

export default function SearchIssues() {
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // NEW

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const refreshIssues = async () => {
    try {
      const response = await axios.get('/api/issues', {
        params: { search: searchQuery }
      });
      setIssues(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load issues');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/issues', {
        params: { search: searchQuery }
      });
      setIssues(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search issues');
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshIssues();
  }, [searchQuery, refreshKey]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Issues</h1>

      {/* Search Input */}
      <div className="flex mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by project, title, description, type..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* View Issue Modal */}
      {showViewModal && selectedIssue && (
        <ViewIssueModal
          issue={selectedIssue}
          onClose={() => {
            setShowViewModal(false);
            setSelectedIssue(null);
          }}
        />
      )}

      {/* Solution Modal */}
      {showSolutionModal && selectedIssue && (
        <SolutionModal
          issue={selectedIssue}
          onClose={() => setShowSolutionModal(false)}
          onSubmit={async (solutionData) => {
            try {
              const formData = new FormData();
              formData.append('ntId', solutionData.ntId);
              formData.append('email', solutionData.email);
              formData.append('category', solutionData.solutionType);
              formData.append('description', solutionData.solution);
              solutionData.files.forEach(file => formData.append('files', file));

              await axios.patch(`/api/issues/${selectedIssue._id}/solution`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              setShowSolutionModal(false);
              refreshIssues();
            } catch (err) {
              console.error('Error submitting solution:', err);
              alert('Failed to submit solution. Check console for details.');
            }
          }}
        />
      )}

      {/* Issue List */}
      <div className="space-y-4">
        {isLoading && !issues.length ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : issues.length > 0 ? (
          issues.map(issue => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onView={() => {
                setSelectedIssue(issue);
                setShowViewModal(true);
              }}
              onEdit={() => {
                setSelectedIssue(issue);
                setShowSolutionModal(true);
              }}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {searchQuery
              ? 'No issues found matching your search.'
              : 'No issues found. Try searching or report a new issue.'}
          </div>
        )}
      </div>
    </div>
  );
}
