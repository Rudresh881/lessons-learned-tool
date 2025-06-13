const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  path: String
}, { _id: false });

const IssueSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  ratedPower: { type: Number, required: true },
  ratedSpeed: { type: Number, required: true },
  application: { type: String, required: true },
  legislation: { type: String, required: true },
  fieSystem: String,
  egtSystem: String,
  issueTitle: { type: String, required: true },
  description: { type: String, required: true },
  issueType: { 
    type: String, 
    enum: ['Hardware', 'Calibration', 'Process'],
    default: 'Hardware'
  },
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);