import React, { useState } from 'react';
import IssueCard from '../components/IssueCard';
import { Search } from 'lucide-react';

export default function SearchIssues() {
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      const mockIssues = [
        {
          id: 1,
          projectName: 'Project Alpha',
          issueTitle: 'Cooling system failure',
          description: 'The cooling system failed during stress testing',
          issueType: 'Hardware'
        }
      ];
      setIssues(mockIssues);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Issues</h1>
      <div className="flex mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search issues..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded-r flex items-center"
        >
          <Search className="h-5 w-5 mr-1" />
          Search
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}