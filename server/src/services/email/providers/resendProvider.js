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
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        html
      });
      
      if (response.error) {
        console.error('Resend API returned an error:', response.error);
        throw new Error(response.error.message);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to send email via Resend:', error.message);
      throw error;
    }
  }
}

export default new ResendProvider();
