// ViewIssueModal.js
import React from 'react';

export default function ViewIssueModal({ issue, onClose }) {
  const { ntId, email, projectName, ratedPower, ratedSpeed, application, legislation, 
    fieSystem, egtSystem, issueTitle, description, issueType, customerName, fuelType, files, solution } = issue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Issue Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Reported by:</strong> {ntId}</div>
          <div><strong>Email:</strong> {email}</div>
          <div><strong>Project:</strong> {projectName}</div>
          <div><strong>Customer:</strong> {customerName}</div>
          <div><strong>Rated Power:</strong> {ratedPower} kW</div>
          <div><strong>Rated Speed:</strong> {ratedSpeed} rpm</div>
          <div><strong>Application:</strong> {application}</div>
          <div><strong>Legislation:</strong> {legislation}</div>
          <div><strong>FIE System:</strong> {fieSystem || '-'}</div>
          <div><strong>EGT System:</strong> {egtSystem || '-'}</div>
          <div><strong>Fuel Type:</strong> {fuelType}</div>
          <div><strong>Issue Type:</strong> {issueType}</div>
        </div>

        <div className="mt-4">
          <strong>Issue Title:</strong>
          <div>{issueTitle}</div>
        </div>

        <div className="mt-4">
          <strong>Description:</strong>
          <p className="whitespace-pre-wrap">{description}</p>
        </div>

        {files?.length > 0 && (
          <div className="mt-4">
            <strong>Issue Attachments:</strong>
            <ul className="list-disc ml-5 mt-2">
              {files.map((file, i) => (
                <li key={i}>
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
          <>
            <hr className="my-6" />
            <h3 className="text-lg font-semibold">Solution</h3>
            <div className="text-sm mt-2">
              <div><strong>Solved by:</strong> {solution.ntId}</div>
              <div><strong>Email:</strong> {solution.email}</div>
              <div><strong>Solution Type:</strong> {solution.category}</div>
              <div className="mt-2"><strong>Description:</strong></div>
              <p className="whitespace-pre-wrap">{solution.description}</p>

              {solution.files?.length > 0 && (
                <div className="mt-4">
                  <strong>Solution Attachments:</strong>
                  <ul className="list-disc ml-5 mt-2">
                    {solution.files.map((file, i) => (
                      <li key={i}>
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
          </>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
