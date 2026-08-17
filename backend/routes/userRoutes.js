const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, loginUser, upgradeToCompany, getUserDetails, updateAccountSettings } = require('../controllers/userController');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Routes Mapping
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);

router.post('/upgrade-company', upload.single('brFile'), upgradeToCompany);
router.get('/:userId', getUserDetails);
router.put('/settings/:userId', updateAccountSettings);


module.exports = router;