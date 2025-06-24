import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';

export default function Implementation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/issues?search=${searchQuery}`);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const downloadIssue = async (issue) => {
    try {
      const zip = new JSZip();

      // Add issue details as text file
      zip.file(`${issue.issueTitle}.txt`, 
        `Issue: ${issue.issueTitle}\n` +
        `Project: ${issue.projectName}\n` +
        `Description: ${issue.description}\n` +
        `Solution: ${issue.solution?.description || 'No solution yet'}`
      );

      // Add attachments if they exist
      if (issue.files?.length > 0) {
        const attachments = zip.folder('attachments');
        await Promise.all(issue.files.map(async (file) => {
          try {
            const response = await fetch(`/uploads/${file.filename}`);
            const blob = await response.blob();
            attachments.file(file.originalname, blob);
          } catch (err) {
            console.error(`Failed to fetch file: ${file.filename}`, err);
          }
        }));
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${issue.issueTitle}_${new Date().toISOString().split('T')[0]}.zip`);
    } catch (error) {
      console.error("Error downloading issue:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Implementation</h1>
      
      <div className="flex mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search issues..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center"
        >
          <Search className="h-5 w-5 mr-1" />
          Search
        </button>
      </div>

      <div className="space-y-2">
        {issues.map(issue => (
          <div key={issue._id} className="flex justify-between items-center p-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium">{issue.issueTitle}</h3>
              <p className="text-sm text-gray-500">{issue.projectName}</p>
            </div>
            <button 
              onClick={() => downloadIssue(issue)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
