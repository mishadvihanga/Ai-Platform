const mongoose = require('mongoose');

const ApplicationHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // හෝ mongoose.Schema.Types.ObjectId (Auth එක අනුව)
  appliedVacancies: [
    {
      vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
      appliedAt: { type: Date, default: Date.now }
    }
  ],
  savedVacancies: [
    {
      vacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
      savedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('ApplicationHistory', ApplicationHistorySchema);