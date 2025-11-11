# SendGrid Setup Guide

The application now uses **SendGrid** instead of SMTP for sending emails. This solves the Railway SMTP port blocking issue and provides better deliverability.

## Why SendGrid?

- ✅ No SMTP port blocking issues on Railway
- ✅ Better email deliverability rates
- ✅ Free tier: 100 emails/day
- ✅ Professional email infrastructure
- ✅ Analytics and monitoring included
- ✅ Easy to scale

---

## Setup Steps

### 1. Create SendGrid Account

1. Go to https://signup.sendgrid.com/
2. Sign up for a free account
3. Verify your email address

### 2. Verify Sender Identity

**Important**: SendGrid requires sender verification to prevent spam.

#### Option A: Single Sender Verification (Recommended for testing)
1. Go to https://app.sendgrid.com/settings/sender_auth/senders
2. Click "Create New Sender"
3. Fill in your details (use the email you want to send FROM)
4. Verify the email address via the confirmation email SendGrid sends
5. This email becomes your `EMAIL_FROM`

#### Option B: Domain Authentication (Recommended for production)
1. Go to https://app.sendgrid.com/settings/sender_auth
2. Click "Authenticate Your Domain"
3. Follow the DNS setup instructions
4. Once verified, you can send from any email on that domain

### 3. Create API Key

1. Go to https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Name it something like "RPI-EventHub-Production"
4. Select "Full Access" (or "Restricted Access" with "Mail Send" permission)
5. Click "Create & View"
6. **Copy the API key immediately** (you won't see it again!)

### 4. Configure Environment Variables

Add these to your Railway environment variables:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=your-verified-email@example.com  # Must be verified in SendGrid!
```

#### How to add to Railway:
1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Add `SENDGRID_API_KEY` with your API key
5. Update `EMAIL_FROM` if needed (must match verified sender)
6. Click "Deploy" to restart with new variables

### 5. For Local Development

Update your local `.env` file in `rpi-eventhub/backend/`:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=your-verified-email@example.com
```

---

## Testing

Test that emails work:

1. Try signing up with a new account
2. Check that you receive the verification email
3. Check SendGrid dashboard for email activity: https://app.sendgrid.com/email_activity

---

## Troubleshooting

### Error: "The from email does not contain a valid address"
- Make sure `EMAIL_FROM` is set correctly
- Make sure the sender is verified in SendGrid

### Error: "Unauthorized"
- Check that `SENDGRID_API_KEY` is set correctly
- Make sure the API key has "Mail Send" permission
- Try creating a new API key with Full Access

### Emails not arriving
- Check SendGrid Activity Feed: https://app.sendgrid.com/email_activity
- Check spam folder
- Verify the recipient email is correct
- Make sure you're within the 100 emails/day free tier limit

### Error: "API key is invalid"
- The API key might be wrong or deleted
- Create a new API key and update the environment variable

---

## Free Tier Limits

- **100 emails/day** (3,000/month)
- Email activity history for 3 days
- Basic analytics

If you need more, upgrade to:
- **Essentials**: $15/month for 40,000 emails
- **Pro**: $60/month for 100,000 emails

---

## Migration Complete! 🎉

The app is now using SendGrid. The old nodemailer/SMTP code has been replaced.

**Next steps:**
1. Set up SendGrid account
2. Verify sender
3. Get API key
4. Add to Railway environment variables
5. Redeploy

Your signup emails will work perfectly on Railway!

---

## Support

- SendGrid Docs: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- Free tier info: https://sendgrid.com/pricing/
