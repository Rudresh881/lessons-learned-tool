const express = require('express');
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');
const Issue = require('../models/Issue');
const upload = require('../utils/uploadMiddleware');

// GET all issues (with search and filtering)
router.get('/', async (req, res) => {
  try {
    const { search, ntId, status } = req.query;
    let query = {};

    if (ntId) query.ntId = ntId;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { issueTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ntId: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: issues.map(issue => ({
        ...issue.toObject(),
        hasSolution: !!issue.solution
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE new issue
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files?.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) || [];

    const issue = new Issue({
      ...req.body,
      files,
      status: 'Open'
    });

    await issue.save();
    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// RESOLVE issue (old method)
router.patch('/:id/resolve', upload.array('solutionFiles'), async (req, res) => {
  try {
    const solutionFiles = req.files?.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) || [];

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Resolved',
        solution: {
          description: req.body.solutionDescription,
          files: solutionFiles,
          solvedAt: new Date(),
          solvedBy: req.body.solvedBy
        }
      },
      { new: true }
    );

    res.json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 🆕 ADD solution to an issue (new endpoint)
router.patch('/:id/solution', upload.array('files'), async (req, res) => {
  try {
    const { ntId, email, category, description } = req.body;

    const solution = {
      category,
      description,
      files: req.files?.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })) || [],
      solvedAt: new Date(),
      solvedBy: { ntId, email }
    };

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: { solution, status: 'Resolved' } },
      { new: true }
    );

    res.json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// EDIT/UPDATE issue
router.patch('/:id', async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET issues by NT ID
router.get('/nt/:ntId', async (req, res) => {
  try {
    const issues = await Issue.find({
      ntId: req.params.ntId,
      status: 'Open'
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// EXPORT issue
router.get('/:id/export', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const archive = archiver('zip');
    res.attachment(`issue-${issue._id}.zip`);
    archive.pipe(res);

    // Add issue details as JSON
    archive.append(JSON.stringify(issue.toObject(), null, 2), {
      name: 'issue-details.json'
    });

    // Add issue files
    if (issue.files && issue.files.length > 0) {
      issue.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          archive.file(file.path, { name: `attachments/${file.originalname}` });
        }
      });
    }

    // Add solution files
    if (issue.solution?.files?.length > 0) {
      issue.solution.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          archive.file(file.path, { name: `solutions/${file.originalname}` });
        }
      });
    }

    archive.finalize();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
