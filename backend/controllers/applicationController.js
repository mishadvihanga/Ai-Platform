const ApplicationHistory = require('../models/ApplicationHistory');
const JobApplication = require('../models/JobApplication');
const Vacancy = require('../models/Vacancy'); 
const sendEmail = require('../utils/sendEmail'); 

const getUserHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    let history = await ApplicationHistory.findOne({ userId })
      .populate({
        path: 'appliedVacancies.vacancyId',
        populate: { path: 'companyId' }
      })
      .populate({
        path: 'savedVacancies.vacancyId',
        populate: { path: 'companyId' }
      });

    if (!history) {
      history = await ApplicationHistory.create({ userId, appliedVacancies: [], savedVacancies: [] });
    }
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSaveVacancy = async (req, res) => {
  const { userId, vacancyId } = req.body;
  try {
    let history = await ApplicationHistory.findOne({ userId });
    if (!history) {
      history = new ApplicationHistory({ userId, savedVacancies: [], appliedVacancies: [] });
    }

    const isSaved = history.savedVacancies.some(item => item.vacancyId.toString() === vacancyId);

    if (isSaved) {
      history.savedVacancies = history.savedVacancies.filter(item => item.vacancyId.toString() !== vacancyId);
    } else {
      history.savedVacancies.push({ vacancyId });
    }

    await history.save();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyToVacancy = async (req, res) => {
  try {
    const { vacancyId, userId, username, email, phoneNumber } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload your CV.' });
    }

    const vacancyDetails = await Vacancy.findById(vacancyId).populate('companyId');
    if (!vacancyDetails) {
      return res.status(404).json({ message: 'Vacancy not found.' });
    }

    const jobTitle = vacancyDetails.jobTitle;
    const companyName = vacancyDetails.companyId.companyName || vacancyDetails.companyId.fullname;
    const companyEmail = vacancyDetails.companyId.companyEmail || vacancyDetails.companyId.email;

    const cvUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const newApplication = new JobApplication({
      vacancyId, userId, username, email, phoneNumber, cvUrl
    });
    await newApplication.save();

    let history = await ApplicationHistory.findOne({ userId });
    if (!history) {
      history = new ApplicationHistory({ userId, appliedVacancies: [], savedVacancies: [] });
    }

    const isApplied = history.appliedVacancies.some(item => item.vacancyId.toString() === vacancyId);
    if (!isApplied) {
      history.appliedVacancies.push({ vacancyId });
      await history.save();
    }

    const userMailOptions = {
      to: email,
      subject: `Application Submitted: ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Hello ${username},</h2>
          <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted!</p>
          <p>The company will review your profile and contact you if you are shortlisted.</p>
          <br/>
          <p>Best Regards,<br/><strong>AI Job Platform Team</strong></p>
        </div>
      `
    };

    const companyMailOptions = {
      to: companyEmail,
      subject: `New Job Application Received - ${jobTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Hello ${companyName},</h2>
          <p>You have received a new application for the vacancy: <strong>${jobTitle}</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <h3>Applicant Details:</h3>
          <p><strong>Name:</strong> ${username}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>CV/Resume:</strong> <a href="${cvUrl}" style="color: #4f46e5; text-decoration: underline;">View Uploaded CV</a></p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p>Please log in to your dashboard to manage this application.</p>
        </div>
      `
    };

    Promise.all([
      sendEmail(userMailOptions),
      sendEmail(companyMailOptions)
    ]).then(() => {
      console.log('Both confirmation and notification emails sent successfully.');
    }).catch(mailErr => {
      console.error('Error sending application emails:', mailErr);
    });


    res.status(201).json({ message: 'Application submitted successfully!', history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserHistory, toggleSaveVacancy, applyToVacancy };