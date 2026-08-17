const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Freelance'], required: true },
  salaryRange: { type: String, default: 'Negotiable' },
  location: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Vacancy', vacancySchema);