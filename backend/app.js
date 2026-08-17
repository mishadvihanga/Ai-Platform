const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vacancyRoutes = require('./routes/vacancyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes'); 
const chatRoutes = require('./routes/chatRoutes');
const companyRoutes = require('./routes/companyRoutes'); 
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

// Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Middleware
app.use('/api', userRoutes);    
app.use('/api/admin', adminRoutes); 
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/ai-bot', chatRoutes); 
app.use('/api/company', companyRoutes);
app.use('/api/contact', messageRoutes);

module.exports = app;