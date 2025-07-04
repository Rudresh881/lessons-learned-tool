import { useState } from 'react';

export default function SolutionModal({ issue, onClose, onSubmit }) {
  const [ntId, setNtId] = useState('');
  const [email, setEmail] = useState('');
  const [solutionType, setSolutionType] = useState('Known solution');
  const [solution, setSolution] = useState('');
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    if (solution.length < 150) {
      alert('Solution must be at least 150 characters');
      return;
    }
    onSubmit({
      ntId,
      email,
      solutionType,
      solution,
      files
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add Solution for: {issue.issueTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NT ID</label>
            <input
              type="text"
              value={ntId}
              onChange={(e) => setNtId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Solution Type</label>
          <select
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Known solution">Known solution</option>
            <option value="Cross Domain solution">Cross Domain solution</option>
            <option value="Innovation solution">Innovation solution</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solution (min 150 characters) - {solution.length}/150
          </label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            minLength={150}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documentation (optional)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={solution.length < 150}
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};