const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// 1. Get all pending company requests
const getPendingRequests = async (req, res) => {
  try {
    const pendingUsers = await User.find({ accounttype: 'pending' }).select('-password');
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Approve or Reject Company Request
const handleCompanyRequest = async (req, res) => {
  try {
    const { userId, action } = req.body; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let emailSubject = '';
    let emailHtmlContent = '';

    if (action === 'approve') {
      user.accounttype = 'company';
      
      emailSubject = '🎉 Congratulations! Your Company Profile is Approved';
      emailHtmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2ecc71;">Dear ${user.fullname},</h2>
          <p>We are excited to inform you that your verification request for <strong>${user.companyName}</strong> has been successfully reviewed and <strong>APPROVED</strong>! 🎉</p>
          <p>You can now log in to your dashboard and start posting job vacancies.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #c0392b;">⚠️ IMPORANT ACTION REQUIRED:</p>
            <p style="margin: 5px 0 0 0;">Please <strong>LOG OUT</strong> from the platform and <strong>LOG IN AGAIN</strong> to refresh your account permissions and access your new Company Dashboard.</p>
          </div>
          
          <p>Thank you for choosing Job-AI!</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #7f8c8d;">This is an automated email. Please do not reply directly to this message.</p>
        </div>
      `;

    } else if (action === 'reject') {
      user.accounttype = 'client';
      user.brDocumentUrl = ''; 

      emailSubject = '❌ Update on your Company Verification Request';
      emailHtmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #e74c3c;">Dear ${user.fullname},</h2>
          <p>We regret to inform you that your verification request for <strong>${user.companyName}</strong> has been <strong>REJECTED</strong> after our review process.</p>
          <p>This usually happens due to unclear or invalid Business Registration (BR) documents. You can resubmit your request with the correct details at any time.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #c0392b;">⚠️ NOTE:</p>
            <p style="margin: 5px 0 0 0;">Please <strong>LOG OUT</strong> and <strong>LOG IN AGAIN</strong> to update your current account view.</p>
          </div>
          
          <p>Best regards,<br/>Job-AI Verification Team</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #7f8c8d;">This is an automated email. Please do not reply directly to this message.</p>
        </div>
      `;
    }

    await user.save();

    // Client වෙත Email එක සන්නිවේදනය කිරීම
    await sendEmail({
      to: user.email, // Client ගේ email ලිපිනය
      subject: emailSubject,
      html: emailHtmlContent
    });

    res.status(200).json({ message: `Company request ${action}ed successfully and email sent!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingRequests, handleCompanyRequest };