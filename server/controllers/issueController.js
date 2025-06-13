const Issue = require('../models/Issue');
const fs = require('fs');
const path = require('path');

// Create new issue
exports.createIssue = async (req, res) => {
  try {
    // Prepare files data
    const files = req.files?.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) || [];

    // Create new issue
    const issue = new Issue({
      ...req.body,
      ratedPower: Number(req.body.ratedPower),
      ratedSpeed: Number(req.body.ratedSpeed),
      files
    });

    const savedIssue = await issue.save();
    
    res.status(201).json({
      success: true,
      data: savedIssue
    });

  } catch (err) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, () => {});
      });
    }
    
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get all issues
exports.getIssues = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { projectName: { $regex: search, $options: 'i' } },
          { issueTitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};