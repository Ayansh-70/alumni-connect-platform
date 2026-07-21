import resendProvider from './providers/resendProvider.js';
import {
  applicationApprovedTemplate,
  applicationReceivedTemplate,
  applicationRejectedTemplate,
  forgotPasswordTemplate,
  passwordChangedTemplate
} from './templates.js';

class EmailService {
  constructor(provider) {
    this.provider = provider;
  }

  async sendForgotPasswordEmail(email, resetUrl) {
    const html = forgotPasswordTemplate(resetUrl);
    return this.provider.sendEmail({
      to: email,
      subject: 'AlumniConnect - Password Reset Request',
      html
    });
  }

  async sendPasswordChangedEmail(email) {
    const html = passwordChangedTemplate();
    return this.provider.sendEmail({
      to: email,
      subject: 'AlumniConnect - Password Changed',
      html
    });
  }

  async sendApplicationReceivedEmail(email, instituteName) {
    const html = applicationReceivedTemplate(instituteName);
    return this.provider.sendEmail({
      to: email,
      subject: 'AlumniConnect - Institute Application Received',
      html
    });
  }

  async sendApplicationApprovedEmail(email, instituteName, loginUrl) {
    const html = applicationApprovedTemplate(instituteName, loginUrl);
    return this.provider.sendEmail({
      to: email,
      subject: 'AlumniConnect - Institute Application Approved',
      html
    });
  }

  async sendApplicationRejectedEmail(email, instituteName, reason) {
    const html = applicationRejectedTemplate(instituteName, reason);
    return this.provider.sendEmail({
      to: email,
      subject: 'AlumniConnect - Institute Application Update',
      html
    });
  }
}

// Export a singleton instance using Resend as the default provider
// To switch providers in the future, just swap resendProvider with another provider
export default new EmailService(resendProvider);
