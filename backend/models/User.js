const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  // accounttype එකට දැන් 'pending' සහ 'employer' ඇතුළත් කර ඇත
  accounttype: { type: String, enum: ['client', 'pending', 'company','admin'], default: 'client', required: true },
  password: { type: String, required: true },
  profileurl: { type: String, default: '' },
  
  // ---- අලුතින් එකතු කළ Company විස්තර ----
  companyName: { type: String, default: '' },
  companyEmail: { type: String, default: '' },
  companyAddress: { type: String, default: '' },
  companyContact: { type: String, default: '' },
  brDocumentUrl: { type: String, default: '' } // BR file link එක
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);