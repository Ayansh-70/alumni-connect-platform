import nodemailer from 'nodemailer';

class SmtpProvider {
  constructor() {
    this.transporter = null;
    this.initPromise = null;
  }

  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = this._initializeInternal();
    return this.initPromise;
  }

  async _initializeInternal() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !port || !user || !pass) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[FATAL] SMTP configuration is incomplete in production. Mock provider is strictly forbidden.');
      }
      console.warn('[SMTP] Environment variables are missing. Email service will run in mock mode.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    try {
      await this.transporter.verify();
      console.log('[SMTP] SMTP connection verified successfully.');
    } catch (error) {
      console.error('[SMTP] SMTP verification failed:', error.message);
      console.warn('[SMTP] Falling back to mock mode.');
      this.transporter = null; // Revert to mock mode
    }
  }

  stripHtml(html) {
    if (!html) return '';
    // Strip HTML tags using regex
    return html.replace(/<[^>]*>?/gm, '').trim();
  }

  async sendEmail({ to, subject, html, text }) {
    await this.initialize();

    const fallbackUser = process.env.EMAIL_USER || 'noreply@alumniconnect.com';
    const from = process.env.EMAIL_FROM || `AlumniConnect <${fallbackUser}>`;
    
    const textContent = text || this.stripHtml(html);

    if (!this.transporter) {
      console.log('--- MOCK EMAIL SENDER ---');
      console.log(`[SMTP] To: ${to}`);
      console.log(`[SMTP] From: ${from}`);
      console.log(`[SMTP] Subject: ${subject}`);
      console.log(`[SMTP] HTML: (Omitted for brevity, length: ${html?.length || 0})`);
      console.log(`[SMTP] TEXT: (Omitted for brevity, length: ${textContent.length})`);
      console.log('-------------------------');
      return { success: true, message: 'Mock email sent successfully' };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: textContent,
      });

      console.log(`[SMTP] Email sent successfully to ${to}`);
      return { success: true, data: info };
    } catch (error) {
      // Log failure strictly on backend to keep responses clean.
      console.error('[SMTP] Failed to send email:', error.message);
      throw error;
    }
  }
}

export default new SmtpProvider();
