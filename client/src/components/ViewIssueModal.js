// ViewIssueModal.js
import React from 'react';
import { X } from 'lucide-react';

export default function ViewIssueModal({ issue, onClose }) {
  if (!issue) return null;

  const solution = issue.solution || (Array.isArray(issue.solutions) ? issue.solutions[0] : null);
  const solvedBy = solution?.solvedBy || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Issue Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Reported By</h3>
            <p><strong>NT ID:</strong> {issue.ntId || '-'}</p>
            <p><strong>Email:</strong> {issue.email || '-'}</p>
          </div>

          {solution && typeof solution === 'object' && (
            <div>
              <h3 className="text-lg font-semibold">Solved By</h3>
              <p><strong>NT ID:</strong> {solvedBy.ntId || '-'}</p>
              <p><strong>Email:</strong> {solvedBy.email || '-'}</p>
              <p><strong>Solution Type:</strong> {solution.category || '-'}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Project Details</h3>
            <p><strong>Project Name:</strong> {issue.projectName || '-'}</p>
            <p><strong>Customer:</strong> {issue.customerName || '-'}</p>
            <p><strong>Rated Power:</strong> {issue.ratedPower || '-'} kW</p>
            <p><strong>Rated Speed:</strong> {issue.ratedSpeed || '-'} rpm</p>
            <p><strong>Application:</strong> {issue.application || '-'}</p>
            <p><strong>Legislation:</strong> {issue.legislation || '-'}</p>
            <p><strong>FIE System:</strong> {issue.fieSystem || '-'}</p>
            <p><strong>EGT System:</strong> {issue.egtSystem || '-'}</p>
            <p><strong>Fuel Type:</strong> {issue.fuelType || '-'}</p>
            <p><strong>Issue Type:</strong> {issue.issueType || '-'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Issue Description</h3>
            <p>{issue.description || '-'}</p>
          </div>

          {Array.isArray(issue.files) && issue.files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Attachments</h3>
              <ul className="list-disc list-inside">
                {issue.files.map((file) => (
                  <li key={file.filename}>
                    <a
                      href={`/uploads/${file.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {file.originalname}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {solution && (
            <div>
              <h3 className="text-lg font-semibold">Solution</h3>
              <p><strong>Description:</strong> {solution.description || '-'}</p>
              {Array.isArray(solution.files) && solution.files.length > 0 && (
                <div>
                  <h4 className="font-semibold mt-2">Solution Attachments</h4>
                  <ul className="list-disc list-inside">
                    {solution.files.map((file) => (
                      <li key={file.filename}>
                        <a
                          href={`/uploads/${file.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {file.originalname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
