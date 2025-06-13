import { FileText, HardDrive, Settings, GitPullRequest } from 'lucide-react';

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

export default function IssueCard({ issue }) {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {issue.issueTitle}
          </h3>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getIssueTypeIcon(issue.issueType)}
              <span className="ml-1">{issue.issueType}</span>
            </span>
          </div>
        </div>
        <div className="mt-1 max-w-2xl text-sm text-gray-500">
          <p>Project: {issue.projectName}</p>
          <p>Power: {issue.ratedPower} kW | Speed: {issue.ratedSpeed} rpm</p>
          <p>Application: {issue.application} | Legislation: {issue.legislation}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-700">{issue.description}</p>
        
        {issue.files && issue.files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {issue.files.map((file, index) => (
                <a
                  key={index}
                  href={`http://localhost:5000/uploads/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {file.originalname}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Reported on {new Date(issue.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}