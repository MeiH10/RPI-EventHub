# SMTP Connection Issue on Railway

## ✅ RESOLVED: Switched to SendGrid

**See `SENDGRID_SETUP.md` for setup instructions.**

---

## Original Problem
SMTP emails were failing in production on Railway with `ETIMEDOUT` errors while working fine locally.

## Root Cause
**Railway blocks outbound SMTP ports (465, 587, 2525) on free and hobby plans** for anti-spam reasons. This is a platform-level restriction.

## Why It Worked Before
Possible reasons:
- You were previously on Railway Pro/Enterprise plan
- Railway changed their port blocking policy
- Recent plan downgrade
- Infrastructure configuration changed

## Solutions (Pick One)

### Option 1: Upgrade to Railway Pro ⭐ **Fastest Fix**
- **Cost**: $20/month
- **Effort**: Minimal - just upgrade plan
- **Pros**: Unblocks SMTP ports immediately, no code changes needed
- **Cons**: Monthly cost
- **Action**: Go to Railway dashboard → Upgrade to Pro

### Option 2: Switch to Port 587 with Explicit Connection 🔧 **Try This First**
Sometimes port 587 with different settings works better:
- **Cost**: Free
- **Effort**: Small config change
- **Pros**: Might work, no code rewrite needed
- **Cons**: May still be blocked by Railway
- **Code Change**: See below

```javascript
// In emailService.js
const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: true
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});
```

### Option 3: Use Gmail API 📧 **Most Reliable**
- **Cost**: Free
- **Effort**: Moderate - code changes required
- **Pros**: No port blocking, official Google method, more reliable
- **Cons**: Requires OAuth2 setup and code refactoring
- **Documentation**: https://developers.google.com/gmail/api/guides/sending

### Option 4: Use Transactional Email Service 📮 **Best Long-term**
Services like SendGrid, Postmark, or Resend use HTTP APIs instead of SMTP ports.

**SendGrid (Recommended)**:
- Free tier: 100 emails/day
- No SMTP port issues
- Better deliverability
- Analytics included

**Quick Switch to SendGrid**:
```bash
npm install @sendgrid/mail
```

```javascript
// Replace emailService.js content
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (toOrOptions, subject, text) => {
  const msg = {
    to: toOrOptions.to || toOrOptions,
    from: process.env.EMAIL_FROM,
    subject: toOrOptions.subject || subject,
    text: toOrOptions.text || text,
  };
  await sgMail.send(msg);
};
```

### Option 5: Deploy on Different Platform 🚀
Move to platforms that don't block SMTP:
- DigitalOcean App Platform
- Heroku
- AWS EC2
- Self-hosted VPS (Linode, Vultr, Hetzner)

## Recommended Action Plan

1. **Immediate**: Try Option 2 (port 587) - quick test, might work
2. **If fails**: Check your Railway plan - if you need SMTP anyway, Pro might be worth it
3. **Long-term**: Switch to SendGrid (Option 4) - more reliable, better deliverability

## Current Status
- Added better error detection and faster timeouts (10 seconds)
- Error messages now clearly indicate Railway port blocking
- SMTP config kept at port 465 for now (works with Railway Pro)

## Next Steps
**You need to decide**:
- Can you upgrade to Railway Pro? → Do that
- Want to keep free plan? → Switch to SendGrid or Gmail API
- Want to stay on Railway free with SMTP? → Not possible, must switch email method

---

## Environment Variables Needed

### Current (SMTP):
```
EMAIL_FROM=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Not your regular password!
```

### If Switching to SendGrid:
```
EMAIL_FROM=your-email@gmail.com
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

## Verifying Gmail App Password
If using Gmail SMTP, you MUST use an App Password, not your regular password:
1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password for "Mail"
3. Use that 16-character password in `SMTP_PASSWORD`

---
**Created**: 2025-11-11
**Issue**: Railway SMTP port blocking
**Status**: Awaiting decision on solution
