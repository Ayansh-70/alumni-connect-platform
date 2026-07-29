import nodemailer from "nodemailer";

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
      const message =
        "[SMTP] SMTP configuration is incomplete. EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS are required.";

      if (process.env.NODE_ENV === "production") {
        throw new Error(message);
      }

      console.warn(message);
      console.warn("[SMTP] Development mode detected. Falling back to mock provider.");
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),

      // Gmail: 465 -> true, 587 -> false
      secure: Number(port) === 465,

      auth: {
        user,
        pass,
      },

      // Force IPv4 (helps on Render when IPv6 SMTP is unreachable)
      family: 4,

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    try {
      await this.transporter.verify();
      console.log("[SMTP] SMTP connection verified successfully.");
    } catch (error) {
      console.error("[SMTP] SMTP verification failed:");
      console.error(error);

      if (process.env.NODE_ENV === "production") {
        throw new Error(
          `SMTP verification failed in production: ${error.message}`
        );
      }

      console.warn("[SMTP] Development mode detected. Falling back to mock provider.");
      this.transporter = null;
    }
  }

  stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
  }

  async sendEmail({ to, subject, html, text }) {
    await this.initialize();

    const fallbackUser =
      process.env.EMAIL_USER || "noreply@alumniconnect.com";

    const from =
      process.env.EMAIL_FROM ||
      `AlumniConnect <${fallbackUser}>`;

    const textContent = text || this.stripHtml(html);

    // Development Mock Sender
    if (!this.transporter) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "[SMTP] Transporter is unavailable in production. Email sending aborted."
        );
      }

      console.log("------------ MOCK EMAIL ------------");
      console.log(`[SMTP] To      : ${to}`);
      console.log(`[SMTP] From    : ${from}`);
      console.log(`[SMTP] Subject : ${subject}`);
      console.log(
        `[SMTP] HTML Length : ${html?.length || 0}`
      );
      console.log(
        `[SMTP] TEXT Length : ${textContent.length}`
      );
      console.log("------------------------------------");

      return {
        success: true,
        message: "Mock email sent successfully",
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
        text: textContent,
      });

      console.log(
        `[SMTP] Email sent successfully to ${to}`
      );
      console.log(`[SMTP] Message ID: ${info.messageId}`);

      return {
        success: true,
        data: info,
      };
    } catch (error) {
      console.error("[SMTP] Failed to send email:");
      console.error(error);

      throw error;
    }
  }
}

export default new SmtpProvider();