const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

const createMessage = async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    // මූලික දත්ත පරීක්ෂාව
    if (!fullname || !email || !message) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    // අලුත් පණිවිඩය සුරැකීම
    const newMessage = new Message({ fullname, email, message });
    await newMessage.save();

    res.status(201).json({ 
      success: true, 
      message: "Your message has been sent successfully! We will get back shortly." 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. පණිවිඩයට පිළිතුරු දීම සහ ඔයාගේ sendEmail util එකෙන් Email එකක් යැවීම
const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { replyText } = req.body;

    if (!replyText || replyText.trim() === "") {
      return res.status(400).json({ success: false, message: "Reply text cannot be empty." });
    }

    // අදාළ පණිවිඩය සොයා ගැනීම
    const userMessage = await Message.findById(messageId);
    if (!userMessage) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    // Email එක සඳහා HTML අන්තර්ගතය සකස් කිරීම
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; rounded: 12px;">
        <h2 style="color: #2563eb;">Hello ${userMessage.fullname},</h2>
        <p>Thank you for contacting Job-AI Platform. Here is the official response to your inquiry:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; border-radius: 4px;">
          <strong>Your Message:</strong><br/>
          <span style="font-style: italic; color: #4b5563;">"${userMessage.message}"</span>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; border-radius: 4px;">
          <strong>Admin Reply:</strong><br/>
          <span style="color: #1e40af;">"${replyText}"</span>
        </div>
        
        <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">Best regards,<br/><strong>Job-AI Support Team</strong></p>
      </div>
    `;

    // ඔයාගේ sendEmail Utility එක පාවිච්චි කරලා email එක යැවීම
    const emailSent = await sendEmail({
      to: userMessage.email,
      subject: `Reply to your inquiry - Job-AI Platform`,
      text: `Hello ${userMessage.fullname},\n\nYour Message: ${userMessage.message}\n\nAdmin Reply: ${replyText}`, // Plain text version
      html: emailHtml
    });

    if (!emailSent) {
      return res.status(500).json({ success: false, message: "Email sending failed. Please check SMTP configuration." });
    }

    // Email එක සාර්ථකව ගියා නම් පමණක් DB එකේ status එක update කිරීම
    userMessage.status = 'replied';
    await userMessage.save();

    res.status(200).json({ success: true, message: "Reply sent via email successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMessage , getAllMessages, replyToMessage };