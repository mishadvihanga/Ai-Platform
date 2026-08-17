const express = require('express');
const router = express.Router();
const { getPendingRequests, handleCompanyRequest } = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// ආරක්ෂිතව isAdmin middleware එක හරහා පමණක් ක්‍රියාත්මක වන රවුට්ස්
router.get('/pending-requests', isAdmin, getPendingRequests);
router.post('/handle-request', isAdmin, handleCompanyRequest);

module.exports = router;