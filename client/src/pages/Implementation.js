import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Search, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImplementationTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([]);

  const handleSearch = async () => {
    const response = await axios.get(`/api/issues?search=${searchQuery}`);
    setIssues(response.data.data); // Assuming your API returns { data: [...] }

  };

  

const handleDownload = async (issue) => {
  const zip = new JSZip();

  // Prepare data for Excel
  const issueDetails = {
    'Issue Title': issue.issueTitle,
    Description: issue.description,
    Application: issue.application,
    Project: issue.projectName || '',
    Customer: issue.customerName || '',
    'Rated Power': issue.ratedPower || '',
    'Rated Speed': issue.ratedSpeed || '',
    'Issue Type': issue.issueType || '',
    'FIE System': issue.fieSystem || '',
    'EGT System': issue.egtSystem || '',
    Legislation: issue.legislation || '',
    'Fuel Type': issue.fuelType || '',
    'Reported By': issue.ntId || '',
    'Reported Email': issue.email || ''
  };

  if (issue.solution) {
    issueDetails['Solution Type'] = issue.solution.category || '';
    issueDetails['Solution Description'] = issue.solution.solution || '';
    issueDetails['Solved By'] = issue.solution.solvedBy?.ntId || '';
    issueDetails['Solved Email'] = issue.solution.solvedBy?.email || '';
  }

  // Create worksheet and workbook
  const ws = XLSX.utils.json_to_sheet([issueDetails]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Issue Details');

  // Convert to blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  zip.file(`${issue.issueTitle.replace(/\s+/g, '_')}.xlsx`, excelBuffer);

  // Add attachments if any
  if (issue.files?.length > 0) {
    const filesFolder = zip.folder('attachments');
    await Promise.all(issue.files.map(async (file) => {
      const response = await axios.get(`/uploads/${file.filename}`, {
        responseType: 'blob'
      });
      filesFolder.file(file.originalname, response.data);
    }));
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${issue.issueTitle.replace(/\s+/g, '_')}.zip`);
};


  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Implementation</h1>
      
      <div className="flex mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search issues to download..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-r flex items-center"
        >
          <Search size={18} className="mr-1" />
          Search
        </button>
      </div>

      <div className="space-y-4">
        {issues.map(issue => (
          <div key={issue._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{issue.issueTitle}</h3>
                <p className="text-sm text-gray-600">{issue.application}</p>
              </div>
              <button
                onClick={() => handleDownload(issue)}
                className="text-green-500 hover:text-green-700 flex items-center"
              >
                <Download size={18} className="mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}