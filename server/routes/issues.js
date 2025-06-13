const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const upload = require('../middleware/upload');

router.post('/', upload.array('files', 5), async (req, res) => {
  try {
    const { 
      projectName,
      ratedPower,
      ratedSpeed,
      application,
      legislation,
      fieSystem = '',
      egtSystem = '',
      issueTitle,
      description,
      issueType = 'Hardware'
    } = req.body;

    if (!projectName || !ratedPower || !ratedSpeed || !application || !legislation || !issueTitle || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'All required fields must be filled'
      });
    }

    const files = req.files?.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) || [];

    const newIssue = new Issue({
      projectName,
      ratedPower: Number(ratedPower),
      ratedSpeed: Number(ratedSpeed),
      application,
      legislation,
      fieSystem,
      egtSystem,
      issueTitle,
      description,
      issueType,
      files
    });

    const savedIssue = await newIssue.save();
    
    res.status(201).json({
      success: true,
      issue: savedIssue
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;