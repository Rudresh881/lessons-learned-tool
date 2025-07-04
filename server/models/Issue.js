const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const IssueSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  customerName: {
    type: String,
    trim: true
  },
  ratedPower: {
    type: Number,
    required: [true, 'Rated power is required'],
    min: [0, 'Rated power must be positive']
  },
  ratedSpeed: {
    type: Number,
    required: [true, 'Rated speed is required'],
    min: [0, 'Rated speed must be positive']
  },
  application: {
    type: String,
    required: [true, 'Application is required'],
    trim: true
  },
  legislation: {
    type: String,
    required: [true, 'Legislation is required'],
    trim: true
  },
  fieSystem: {
    type: String,
    trim: true
  },
  egtSystem: {
    type: String,
    trim: true
  },
  fuelType: {
    type: String,
    trim: true
  },
  issueTitle: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  issueType: {
    type: String,
    enum: ['Hardware', 'Calibration', 'Process'],
    default: 'Hardware'
  },
  files: [FileSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  ntId: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  solution: {
    type: {
      type: String,
      enum: ['Known solution', 'Cross Domain solution', 'Innovation solution']
    },
    description: String,
    files: [FileSchema],
    solvedAt: Date,
    solvedBy: {
      ntId: { type: String },
      email: { type: String }
    }
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  }
});

module.exports = mongoose.model('Issue', IssueSchema);
