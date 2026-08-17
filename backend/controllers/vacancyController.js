const Vacancy = require('../models/Vacancy');

// 1. නව රැකියා අවස්ථාවක් ඇතුළත් කිරීම
const createVacancy = async (req, res) => {
  try {
    const { companyId, jobTitle, jobDescription, jobType, salaryRange, location } = req.body;
    
    const newVacancy = new Vacancy({
      companyId,
      jobTitle,
      jobDescription,
      jobType,
      salaryRange,
      location
    });

    await newVacancy.save();
    res.status(201).json({ message: 'Vacancy posted successfully!', vacancy: newVacancy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. අදාළ සමාගමට අයත් රැකියා පමණක් ලබාගැනීම
const getCompanyVacancies = async (req, res) => {
  try {
    const { companyId } = req.params;
    const vacancies = await Vacancy.find({ companyId }).sort({ createdAt: -1 });
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobTitle, jobDescription, jobType, salaryRange, location, status } = req.body;

    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      id,
      { jobTitle, jobDescription, jobType, salaryRange, location, status },
      { new: true } // අලුත් දත්ත සමඟම return කිරීමට
    );

    if (!updatedVacancy) return res.status(404).json({ message: 'Vacancy not found' });

    res.status(200).json({ message: 'Vacancy updated successfully!', vacancy: updatedVacancy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. රැකියාවක් මකා දැමීම (Delete Vacancy)
const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVacancy = await Vacancy.findByIdAndDelete(id);

    if (!deletedVacancy) return res.status(404).json({ message: 'Vacancy not found' });

    res.status(200).json({ message: 'Vacancy deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. පද්ධතියේ ඇති සියලුම සක්‍රීය රැකියා ලබාගැනීම (Explore Jobs)
const getAllVacancies = async (req, res) => {
  try {
    // තත්ත්වය 'Active' ලෙස ඇති රැකියා පමණක් ලබාගන්නා අතර, සමාගමේ නමද (companyName) මෙයට සම්බන්ධ කර ගනී.
    const vacancies = await Vacancy.find({ status: 'Active' })
                                   .populate('companyId', 'companyName')
                                   .sort({ createdAt: -1 });
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export එකට ඇතුළත් කරන්න
module.exports = { createVacancy, getCompanyVacancies, updateVacancy, deleteVacancy, getAllVacancies };

