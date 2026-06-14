const nodemailer = require('nodemailer');

// Transporter banao
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email bhejne ka function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"CRM Pro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Welcome email template
const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to CRM Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to CRM Pro, ${user.name}!</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p>You can now login and start managing your leads and deals.</p>
        <br/>
        <p style="color: #64748b; font-size: 12px;">CRM Pro Team</p>
      </div>
    `,
    text: `Welcome to CRM Pro, ${user.name}! Your account has been created with role: ${user.role}.`,
  });
};

// Lead assignment email
const sendLeadAssignmentEmail = async ({ to, leadName, assignedBy }) => {
  return sendEmail({
    to,
    subject: `New Lead Assigned: ${leadName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Lead Assigned to You</h2>
        <p>A new lead <strong>${leadName}</strong> has been assigned to you by ${assignedBy}.</p>
        <p>Login to CRM Pro to view details.</p>
        <br/>
        <p style="color: #64748b; font-size: 12px;">CRM Pro Team</p>
      </div>
    `,
    text: `New lead "${leadName}" has been assigned to you by ${assignedBy}.`,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendLeadAssignmentEmail };