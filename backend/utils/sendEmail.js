const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // 1. Transporter එක සකස් කිරීම (Gmail භාවිතයෙන්)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 2. Email එකේ විස්තර
    const mailOptions = {
      from: `"Job-AI Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    // 3. Email එක යැවීම
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed: ', error);
    return false;
  }
};

module.exports = sendEmail;