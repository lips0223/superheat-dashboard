const { google } = require('googleapis');

class GmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set refresh token
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      console.log('Gmail API configured successfully');
    } else {
      console.error('GOOGLE_REFRESH_TOKEN environment variable is not set!');
    }

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async getAccessToken() {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async sendEmail(emailParams) {
    try {
      // Support both object and individual parameters for backward compatibility
      let to, subject, htmlContent;
      
      if (typeof emailParams === 'object' && emailParams.to) {
        // New object format: { to, subject, html }
        to = emailParams.to;
        subject = emailParams.subject;
        htmlContent = emailParams.html;
      } else {
        // Legacy format: (to, subject, htmlContent)
        to = arguments[0];
        subject = arguments[1];
        htmlContent = arguments[2];
      }

      const accessToken = await this.getAccessToken();
      
      // Create email message with proper encoding
      const message = [
        `From: Superheat <${process.env.GMAIL_USER || 'noreply@superheat.com'}>`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(htmlContent).toString('base64')
      ].join('\r\n');

      // Encode message in base64
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email
      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log(`Email sent successfully to ${to}, Message ID: ${result.data.id}`);

      return {
        success: true,
        messageId: result.data.id,
        data: result.data
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        details: error
      };
    }
  }
}

module.exports = new GmailService();

module.exports = new GmailService();