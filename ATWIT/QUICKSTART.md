# Quick Setup Guide

Get started with the Nairobi Commuter Information System in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Africa's Talking Credentials

### For Testing (Sandbox):
1. Go to https://account.africastalking.com/auth/register
2. Sign up for a free account
3. Go to **Sandbox** app (automatically created)
4. Click **Settings** → **API Key** → **Generate**
5. Copy your API Key

### Your Sandbox Credentials:
- **Username**: `sandbox`
- **API Key**: `[Your generated key]`

## Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your credentials
# On Mac/Linux:
nano .env

# On Windows:
notepad .env
```

Update these values:
```env
AT_USERNAME=sandbox
AT_API_KEY=your-api-key-here
USSD_CODE=*384*3574#
SMS_SHORTCODE=30745
PORT=3000
```

## Step 4: Test Locally

### Option A: Interactive Test Console
```bash
npm test
```

This will open an interactive console where you can test:
- USSD flows
- SMS commands
- Without needing to set up callbacks

### Option B: Start Server
```bash
npm run dev
```

Then open your browser to:
- Dashboard: http://localhost:3000/dashboard.html
- API: http://localhost:3000/api/routes

## Step 5: Test with Africa's Talking Simulator

### USSD Simulator:
1. In Africa's Talking Dashboard, go to **Sandbox** → **USSD**
2. You need a public URL for callbacks. Use **ngrok**:

```bash
# Install ngrok (if not installed)
# Download from https://ngrok.com/download

# Start your server
npm run dev

# In another terminal, start ngrok
ngrok http 3000
```

3. Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. In Africa's Talking Dashboard:
   - Go to **USSD** → **Create Channel**
   - Service Code: `*384*3574#`
   - Callback URL: `https://abc123.ngrok.io/ussd`
   - Click **Create**

5. Test in USSD Simulator:
   - Enter your phone number
   - Dial `*384*3574#`
   - Interact with the menu

### SMS Simulator:
1. Configure SMS callback:
   - Go to **SMS** → **Settings**
   - Callback URL: `https://abc123.ngrok.io/sms`

2. Test in SMS Simulator:
   - From Number: Your phone number
   - To Number: Your shortcode (30745)
   - Message: `ROUTE KASARANI CBD`
   - Click Send

## Quick Test Commands

### Test USSD (without simulator):
```bash
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*384*3574#&phoneNumber=+254712345678&text="
```

### Test SMS (without simulator):
```bash
curl -X POST http://localhost:3000/sms \
  -d "from=+254712345678&text=ROUTE KASARANI CBD&to=30745"
```

### Test via Dashboard:
1. Open http://localhost:3000/dashboard.html
2. Use the "Quick Test" section
3. Enter a phone number
4. Send test messages

## Common Issues

### "Module not found" error:
```bash
npm install
```

### Port already in use:
```bash
# Change PORT in .env to 3001 or another port
PORT=3001
```

### ngrok connection refused:
```bash
# Make sure your server is running first
npm run dev

# Then in another terminal
ngrok http 3000
```

## Next Steps

1. **Add Real Routes**: Edit `data/routes.js` to add actual Nairobi routes
2. **Customize Messages**: Modify handlers in `handlers/` folder
3. **Deploy to Production**: See `DEPLOYMENT.md` for full guide
4. **Set up Database**: For production use (see README.md)

## Testing Checklist

- [ ] Server starts without errors
- [ ] Dashboard loads at http://localhost:3000/dashboard.html
- [ ] USSD simulator works with ngrok
- [ ] SMS simulator works with ngrok
- [ ] Test console (`npm test`) works
- [ ] Can find routes via USSD
- [ ] Can check fares via SMS
- [ ] Subscriptions work

## Support

- **Documentation**: See README.md and DEPLOYMENT.md
- **Africa's Talking Docs**: https://developers.africastalking.com
- **Node.js Help**: https://nodejs.org/en/docs/

---

🎉 **You're ready to go!** Start with `npm test` to explore the features.
