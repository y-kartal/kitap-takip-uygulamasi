import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDailyReport = async (userName: string, pagesRead: number, booksCompleted: number) => {
  const emails = process.env.NOTIFICATION_EMAILS?.split(',') || [];
  
  if (emails.length === 0 || !process.env.EMAIL_USER) {
    console.log('Email configuration not set, skipping email send');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: emails.join(','),
    subject: `📚 ${userName} - Günlük Okuma Raporu`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stat { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-number { font-size: 48px; font-weight: bold; color: #667eea; margin: 10px 0; }
          .stat-label { font-size: 18px; color: #666; }
          .emoji { font-size: 32px; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Günlük Okuma Raporu</h1>
            <p style="font-size: 18px; margin: 10px 0;">${userName}</p>
            <p style="font-size: 14px; opacity: 0.9;">${new Date().toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="content">
            <div class="stat">
              <div class="emoji">📖</div>
              <div class="stat-number">${pagesRead}</div>
              <div class="stat-label">Bugün Okunan Sayfa</div>
            </div>
            
            ${booksCompleted > 0 ? `
            <div class="stat">
              <div class="emoji">🎉</div>
              <div class="stat-number">${booksCompleted}</div>
              <div class="stat-label">Bugün Bitirilen Kitap</div>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-align: center;">
              <p style="font-size: 20px; margin: 0;">
                ${pagesRead > 0 ? '🌟 Harika! Okumaya devam et!' : '💪 Yarın daha fazla okuyalım!'}
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>Bu rapor otomatik olarak her gün saat 19:00'da gönderilir.</p>
            <p>📚 Kitap ve Test Takip Uygulaması</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Daily report sent to ${emails.join(', ')}`);
  } catch (error) {
    console.error('❌ Email send error:', error);
  }
};
