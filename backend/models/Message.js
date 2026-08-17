const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' } // Admin ලාට කළමනාකරණය පහසු කිරීමට
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);