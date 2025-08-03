// Email Notification System for Dates.care
export interface EmailNotification {
  id: string;
  userId: string;
  type: 'like' | 'message' | 'email' | 'wink' | 'match' | 'view' | 'super_like' | 'gift';
  title: string;
  message: string;
  fromUser?: {
    name: string;
    image: string;
    id: string;
  };
  timestamp: Date;
  sent: boolean;
  emailSent: boolean;
}

export interface EmailSettings {
  userId: string;
  enableEmailNotifications: boolean;
  notificationTypes: {
    likes: boolean;
    messages: boolean;
    emails: boolean;
    winks: boolean;
    matches: boolean;
    views: boolean;
    gifts: boolean;
  };
  emailAddress: string;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

class EmailNotificationManager {
  private notifications: Map<string, EmailNotification[]> = new Map();
  private emailSettings: Map<string, EmailSettings> = new Map();
  
  // Initialize user email settings
  initializeEmailSettings(userId: string, email: string): void {
    if (!this.emailSettings.has(userId)) {
      this.emailSettings.set(userId, {
        userId,
        enableEmailNotifications: true,
        notificationTypes: {
          likes: true,
          messages: true,
          emails: true,
          winks: true,
          matches: true,
          views: true,
          gifts: true
        },
        emailAddress: email,
        frequency: 'instant'
      });
    }
  }

  // Add notification
  addNotification(
    userId: string,
    type: EmailNotification['type'],
    title: string,
    message: string,
    fromUser?: EmailNotification['fromUser']
  ): void {
    const notification: EmailNotification = {
      id: Math.random().toString(36).substring(2),
      userId,
      type,
      title,
      message,
      fromUser,
      timestamp: new Date(),
      sent: false,
      emailSent: false
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    this.notifications.get(userId)!.push(notification);
    
    // Send email notification if enabled
    this.sendEmailNotification(userId, notification);
  }

  // Send email notification
  private async sendEmailNotification(userId: string, notification: EmailNotification): Promise<void> {
    const settings = this.emailSettings.get(userId);
    
    if (!settings || !settings.enableEmailNotifications) {
      return;
    }

    if (!settings.notificationTypes[notification.type as keyof typeof settings.notificationTypes]) {
      return;
    }

    try {
      // In a real app, this would integrate with an email service like SendGrid, Mailgun, etc.
      const emailContent = this.generateEmailContent(notification);
      
      console.log(`📧 Email sent to ${settings.emailAddress}:`, emailContent);
      
      // Simulate email sending
      await this.simulateEmailSend(settings.emailAddress, emailContent);
      
      notification.emailSent = true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // Generate email content
  private generateEmailContent(notification: EmailNotification): {
    subject: string;
    html: string;
    text: string;
  } {
    const baseUrl = 'https://dates.care';
    const appUrl = 'https://beamish-clafoutis-01d1f8.netlify.app';
    
    const subject = `Dates.care - ${notification.title}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .profile-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ec4899; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💕 Dates.care</h1>
              <p>You have a new notification!</p>
            </div>
            <div class="content">
              <h2>${notification.title}</h2>
              <p>${notification.message}</p>
              
              ${notification.fromUser ? `
                <div class="profile-info">
                  <strong>From:</strong> ${notification.fromUser.name}<br>
                  <small>View their profile to learn more!</small>
                </div>
              ` : ''}
              
              <a href="${baseUrl}" class="button">Open Dates.care App</a>
              
              <p><small>This notification was sent on ${notification.timestamp.toLocaleString()}</small></p>
            </div>
            <div class="footer">
              <p>© 2025 Dates.care - Find Your Perfect Match</p>
              <p>5515 Eglinton Ave, Etobicoke, ON, Canada</p>
              <p>Phone: +1 (613) 861-5799 | Email: info@dates.care</p>
              <p><a href="${baseUrl}/unsubscribe">Unsubscribe from notifications</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Dates.care - ${notification.title}
      
      ${notification.message}
      
      ${notification.fromUser ? `From: ${notification.fromUser.name}` : ''}
      
      Open the Dates.care app to respond: ${baseUrl}
      
      This notification was sent on ${notification.timestamp.toLocaleString()}
      
      © 2025 Dates.care
      5515 Eglinton Ave, Etobicoke, ON, Canada
      Phone: +1 (613) 861-5799 | Email: info@dates.care
    `;

    return { subject, html, text };
  }

  // Simulate email sending (replace with real email service)
  private async simulateEmailSend(email: string, content: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ Email notification sent to ${email}`);
        resolve();
      }, 100);
    });
  }

  // Get user notifications
  getUserNotifications(userId: string): EmailNotification[] {
    return this.notifications.get(userId) || [];
  }

  // Update email settings
  updateEmailSettings(userId: string, settings: Partial<EmailSettings>): void {
    const current = this.emailSettings.get(userId);
    if (current) {
      this.emailSettings.set(userId, { ...current, ...settings });
    }
  }

  // Get email settings
  getEmailSettings(userId: string): EmailSettings | null {
    return this.emailSettings.get(userId) || null;
  }

  // Trigger specific notifications
  onNewLike(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'like',
      `${fromUser.name} Liked You! 💖`,
      `Great news! ${fromUser.name} just liked your profile. They seem interested in getting to know you better. Why not check out their profile and see if there's a mutual connection? You can like them back or send them a message to start a conversation!`,
      fromUser
    );
  }

  onNewMessage(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'message',
      `New Message from ${fromUser.name}! 💬`,
      `${fromUser.name} just sent you a message! They're trying to connect with you. Open the Dates app to read their message and continue the conversation. Don't keep them waiting - great connections start with great conversations!`,
      fromUser
    );
  }

  onNewEmail(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'email',
      `Private Email from ${fromUser.name}! 📧`,
      `You've received a private email from ${fromUser.name}! This is a more personal way to connect. Check your Dates inbox to read their thoughtful message and respond. Private emails often lead to deeper connections!`,
      fromUser
    );
  }

  onNewWink(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'wink',
      'Someone Sent You a Blink! 👁️',
      `${fromUser.name} sent you a blink! This is their way of catching your attention and showing interest. A blink is a quick, playful way to say "I noticed you!" Why not check out their profile and see if you'd like to connect? You could send a blink back or start a conversation!`,
      fromUser
    );
  }

  onNewMatch(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'match',
      'It\'s a Match! 🎉',
      `Congratulations! You and ${fromUser.name} liked each other. Start chatting now!`,
      fromUser
    );
  }

  onProfileView(userId: string, fromUser: { name: string; image: string; id: string }): void {
    this.addNotification(
      userId,
      'view',
      `${fromUser.name} Viewed Your Profile! 👀`,
      `Someone's interested! ${fromUser.name} just checked out your profile. This could be the start of something special. Take a look at their profile and see if you'd like to connect. If you're interested, send them a like or a message!`,
      fromUser
    );
  }

  onNewGift(userId: string, fromUser: { name: string; image: string; id: string }, giftName: string): void {
    this.addNotification(
      userId,
      'gift',
      'Gift Received! 🎁',
      `${fromUser.name} sent you a ${giftName}! How thoughtful!`,
      fromUser
    );
  }

  // Bulk notification methods
  sendDailyDigest(userId: string): void {
    const notifications = this.getUserNotifications(userId)
      .filter(n => !n.emailSent && n.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000));

    if (notifications.length > 0) {
      this.addNotification(
        userId,
        'message',
        'Daily Activity Summary 📊',
        `You have ${notifications.length} new activities today! Check the app to see all your likes, messages, and profile views.`
      );
    }
  }

  // Clear old notifications
  clearOldNotifications(userId: string, daysOld: number = 30): void {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const filtered = userNotifications.filter(n => n.timestamp > cutoffDate);
      this.notifications.set(userId, filtered);
    }
  }
}

export const emailNotificationManager = new EmailNotificationManager();

// Utility functions for easy use throughout the app
export const sendLikeNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onNewLike(userId, fromUser);
};

export const sendMessageNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onNewMessage(userId, fromUser);
};

export const sendEmailNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onNewEmail(userId, fromUser);
};

export const sendWinkNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onNewWink(userId, fromUser);
};

export const sendMatchNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onNewMatch(userId, fromUser);
};

export const sendProfileViewNotification = (userId: string, fromUser: { name: string; image: string; id: string }) => {
  emailNotificationManager.onProfileView(userId, fromUser);
};

export const sendGiftNotification = (userId: string, fromUser: { name: string; image: string; id: string }, giftName: string) => {
  emailNotificationManager.onNewGift(userId, fromUser, giftName);
};