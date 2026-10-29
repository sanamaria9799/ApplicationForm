const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    applicationDate: {
      type: Date,
      required: [true, 'Application date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    jobType: {
      type: String,
      required: true,
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        message: '{VALUE} is not a valid job type',
      },
      default: 'Full-time',
    },
    jobPostingUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up dashboard queries and text search
applicationSchema.index({ company: 'text', jobTitle: 'text', notes: 'text' });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
