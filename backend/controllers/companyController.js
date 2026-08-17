const JobApplication = require('../models/JobApplication');
const Vacancy = require('../models/Vacancy');
const sendEmail = require('../utils/sendEmail');

// A. තමන්ගේ සමාගමට අදාළ සියලුම Applications ලබා ගැනීම (පරණ ඒවා Fix කිරීමද ඇතුළුව)
const getCompanyApplications = async (req, res) => {
  try {
    const { companyId } = req.params;

    // 1. සමාගම සතු සියලුම Vacancies වල IDs ලබා ගැනීම
    const companyVacancies = await Vacancy.find({ companyId }).select('_id');
    const vacancyIds = companyVacancies.map(v => v._id);

    // 💡 [MAGIC FIX]: Database එකේ දැනටමත් තියෙන status field එක නැති පරණ records ඔක්කොටම auto 'Pending' දීම
    await JobApplication.updateMany(
      { vacancyId: { $in: vacancyIds }, status: { $exists: false } },
      { $set: { status: 'Pending', reviewNote: '' } }
    );

    // 2. යාවත්කාලීන වූ සියලුම Applications ලබා ගැනීම
    const applications = await JobApplication.find({ vacancyId: { $in: vacancyIds } })
      .populate('vacancyId', 'jobTitle jobType location')
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// B. Application එකක් Review කිරීම (Accept/Reject කිරීම සහ Email යැවීම)
const reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNote } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const application = await JobApplication.findById(applicationId).populate('vacancyId');
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    application.status = status;
    application.reviewNote = reviewNote || "";
    await application.save();

    // ✉️ Email Logic එක
    const isAccepted = status === 'Accepted';
    const emailSubject = isAccepted 
      ? `Update on your application for ${application.vacancyId.jobTitle}: Accepted 🎉`
      : `Update on your application for ${application.vacancyId.jobTitle}: Status Update`;

    const statusBadge = isAccepted 
      ? `<span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 50px; font-weight: bold;">Accepted</span>`
      : `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 50px; font-weight: bold;">Not Selected</span>`;

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Application Status Update</h2>
        <p>Dear <strong>${application.username}</strong>,</p>
        <p>Your job application for the position of <strong>${application.vacancyId.jobTitle}</strong> has been reviewed.</p>
        <p style="margin: 20px 0;">Current Status: ${statusBadge}</p>
        ${reviewNote ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <strong style="color: #475569;">Message from the Employer:</strong>
            <p style="margin: 5px 0 0 0; color: #334155; font-style: italic;">"${reviewNote}"</p>
          </div>
        ` : ''}
        <p>Thank you for your interest.</p>
      </div>
    `;

    sendEmail({ to: application.email, subject: emailSubject, html: emailHtml }).catch(err => console.error(err));

    res.status(200).json({ success: true, message: `Application ${status.toLowerCase()} successfully!`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCompanyApplications, reviewApplication };