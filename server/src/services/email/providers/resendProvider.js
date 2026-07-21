import { Resend } from 'resend';

class ResendProvider {
  constructor() {
    this.resend = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;
    
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not defined. Email service will run in mock mode.');
      return;
    }
    
    this.resend = new Resend(apiKey);
    this.isInitialized = true;
  }

  async sendEmail({ to, subject, html }) {
    this.initialize();
    
    const from = process.env.EMAIL_FROM || 'AlumniConnect <noreply@alumniconnect.com>';

    if (!this.resend) {
      console.log('--- MOCK EMAIL SENDER ---');
      console.log(`To: ${to}`);
      console.log(`From: ${from}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: (Omitted for brevity, length: ${html.length})`);
      console.log('-------------------------');
      return { success: true, message: 'Mock email sent successfully' };
    }

    try {
      const data = await this.resend.emails.send({
        from,
        to,
        subject,
        html
      });
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      throw new Error('Email sending failed');
    }
  }
}

export default new ResendProvider();
