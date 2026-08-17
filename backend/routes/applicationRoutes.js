const express = require('express');
const router = express.Router();
const { getUserHistory, toggleSaveVacancy, applyToVacancy } = require('../controllers/applicationController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/history/:userId', getUserHistory);
router.post('/save-toggle', toggleSaveVacancy);
router.post('/apply', upload.single('cv'), applyToVacancy); 

module.exports = router;