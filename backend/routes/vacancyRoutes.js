const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const { createVacancy, getCompanyVacancies, updateVacancy, deleteVacancy, getAllVacancies} = require('../controllers/vacancyController');

router.post('/create', createVacancy);
router.get('/all', getAllVacancies);
router.get('/company/:companyId', getCompanyVacancies);

router.get('/:id', async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id).populate('companyId');
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:id', updateVacancy);   // Edit සඳහා
router.delete('/delete/:id', deleteVacancy);

module.exports = router;