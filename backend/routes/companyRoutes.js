const { Router } = require('express');
const { getCompanyApplications, reviewApplication } = require('../controllers/companyController');

const router = Router();

// නව Routes දෙක
router.get('/:companyId/applications', getCompanyApplications);
router.put('/applications/:applicationId/review', reviewApplication);

module.exports = router;