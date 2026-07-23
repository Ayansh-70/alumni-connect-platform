const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    .header {
      background-color: #0f172a;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.05em;
    }
    .content {
      padding: 32px;
      color: #334155;
      line-height: 1.6;
    }
    .content h2 {
      color: #0f172a;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      background-color: #0ea5e9;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 16px;
      margin-bottom: 16px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .small-text {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ALUMNICONNECT</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message from AlumniConnect. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const forgotPasswordTemplate = (resetUrl) => {
  const content = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password for your AlumniConnect account.</p>
    <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p class="small-text">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p class="small-text">If the button doesn't work, copy and paste this link into your browser: <br/>${resetUrl}</p>
  `;
  return baseTemplate('Password Reset Request', content);
};

export const passwordChangedTemplate = () => {
  const content = `
    <h2>Password Changed Successfully</h2>
    <p>Your password for your AlumniConnect account has been successfully updated.</p>
    <p>If you did not make this change, please contact your institute administrator immediately.</p>
  `;
  return baseTemplate('Password Changed', content);
};

export const applicationReceivedTemplate = (instituteName) => {
  const content = `
    <h2>Application Received</h2>
    <p>Hello Administrator,</p>
    <p>Your registration application for <strong>${instituteName}</strong> has been successfully received.</p>
    <p>Our team is currently reviewing your application. You will receive an email once a decision has been made.</p>
  `;
  return baseTemplate('Institute Application Received', content);
};

export const applicationApprovedTemplate = (instituteName, loginUrl) => {
  const content = `
    <h2>Application Approved!</h2>
    <p>Hello Administrator,</p>
    <p>Congratulations! Your registration application for <strong>${instituteName}</strong> has been approved.</p>
    <p>You can now log in to your dashboard to start managing your institute, students, and alumni.</p>
    <div style="text-align: center;">
      <a href="${loginUrl}" class="button">Go to Dashboard</a>
    </div>
  `;
  return baseTemplate('Institute Application Approved', content);
};

export const applicationRejectedTemplate = (instituteName, reason) => {
  const content = `
    <h2>Application Update</h2>
    <p>Hello Administrator,</p>
    <p>We have reviewed your registration application for <strong>${instituteName}</strong>.</p>
    <p>Unfortunately, your application has been rejected at this time. The reason provided is:</p>
    <blockquote style="border-left: 4px solid #cbd5e1; padding-left: 16px; color: #475569; font-style: italic;">
      ${reason || 'No specific reason provided.'}
    </blockquote>
    <p>If you believe this was an error, please contact support.</p>
  `;
  return baseTemplate('Institute Application Update', content);
};

export const welcomeEmailTemplate = (name, role, instituteName, email, password, loginUrl) => {
  const content = `
    <h2>Welcome to AlumniConnect!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>An administrator at <strong>${instituteName}</strong> has created a new <strong>${role}</strong> account for you on AlumniConnect.</p>
    <p>You can use the following credentials to log in for the first time:</p>
    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${password}</p>
    </div>
    <div style="text-align: center;">
      <a href="${loginUrl}" class="button">Log In to Your Account</a>
    </div>
    <p style="color: #b91c1c; font-weight: 600; margin-top: 24px;">Security Notice: You will be required to change your temporary password immediately upon your first successful login.</p>
    <p>We look forward to seeing you on the platform!</p>
  `;
  return baseTemplate('Welcome to AlumniConnect', content);
};
