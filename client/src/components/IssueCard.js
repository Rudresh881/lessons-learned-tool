import React, { useState } from 'react';
import { Eye, Edit, FileText } from 'lucide-react';
import EditSolutionModal from './EditSolutionModal';
import axios from 'axios';

export default function IssueCard({ issue, onView, onEdit }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSubmitSolution = async ({ ntId, email, solutionType, solution, files }) => {
    const formData = new FormData();
    formData.append('ntId', ntId);
    formData.append('email', email);
    formData.append('category', solutionType);
    formData.append('description', solution);

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.patch(`/api/issues/${issue._id}/solution`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowEditModal(false); // Close the modal after success
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50">
        <div>
          <h3 className="font-medium text-gray-800">{issue.issueTitle}</h3>
          <p className="text-sm text-gray-500">{issue.application}</p>
          {issue.solution && (
            <div className="mt-1 text-xs text-green-600 flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Solved by: {issue.solution?.solvedBy?.ntId || 'N/A'}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => (onView ? onView(issue) : null)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              if (onEdit) onEdit(issue);
              else setShowEditModal(true);
            }}
            className="text-green-500 hover:text-green-700"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditSolutionModal
          issue={issue}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmitSolution}
        />
      )}
    </>
  );
}
