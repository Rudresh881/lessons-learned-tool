import { FileText, HardDrive, Settings, GitPullRequest } from 'lucide-react';
import React from 'react';

const IssueCard = ({ issue }) => {
  // Get appropriate icon based on issue type
  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'Hardware':
        return <HardDrive className="h-5 w-5" />;
      case 'Calibration':
        return <Settings className="h-5 w-5" />;
      case 'Process':
        return <GitPullRequest className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Issue Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{issue.issueTitle}</h3>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {getIssueTypeIcon(issue.issueType)}
              <span className="ml-2">{issue.issueType}</span>
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Project:</span> {issue.projectName}
          </div>
          <div>
            <span className="font-medium">Power:</span> {issue.ratedPower} kW
          </div>
          <div>
            <span className="font-medium">Speed:</span> {issue.ratedSpeed} rpm
          </div>
        </div>
      </div>

      {/* Issue Body */}
      <div className="px-6 py-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
          <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Application</h4>
            <p className="text-gray-700">{issue.application}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Legislation</h4>
            <p className="text-gray-700">{issue.legislation}</p>
          </div>
          {issue.fieSystem && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">FIE System</h4>
              <p className="text-gray-700">{issue.fieSystem}</p>
            </div>
          )}
          {issue.egtSystem && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">EGT System</h4>
              <p className="text-gray-700">{issue.egtSystem}</p>
            </div>
          )}
        </div>

        {/* Attachments */}
        {issue.files?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {issue.files.map((file, index) => (
                <a
                  key={index}
                  href={`http://localhost:5000/api/issues/files/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div className="truncate">
                    <div className="text-sm font-medium text-gray-700 truncate">
                      {file.originalname}
                    </div>
                    <div className="text-xs text-gray-500">
                      {file.mimetype} • {formatFileSize(file.size)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Reported on {new Date(issue.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default IssueCard;