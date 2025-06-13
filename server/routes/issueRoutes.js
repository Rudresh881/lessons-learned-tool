const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const upload = require('../utils/uploadMiddleware');


// Create new issue with file uploads
router.post('/', upload.array('files'), issueController.createIssue);

// Get all issues (with optional search)
router.get('/', issueController.getIssues);

module.exports = router;
router.get('/files/:filename', (req, res) => {
  const file = path.join(__dirname, '../../uploads', req.params.filename);
  res.download(file, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });
});

// Add this to your existing routes/issues.js
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { projectName: { $regex: search, $options: 'i' } },
          { issueTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { issueType: { $regex: search, $options: 'i' } },
          { application: { $regex: search, $options: 'i' } },
          { legislation: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});