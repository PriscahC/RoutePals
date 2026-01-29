# Nairobi Commuter Information System

A real-time commuter information platform for Nairobi's public transport using Africa's Talking USSD and SMS APIs.

## 🚍 Features

- **USSD Service** (`*384*3574#`): Interactive menu for route finding, fare checking, and service updates
- **SMS Commands**: Text-based commands for quick information access
- **Subscription Alerts**: Daily morning and evening traffic updates
- **Real-time Status**: Live route status and disruption notifications
- **Multi-channel Access**: Works on both feature phones and smartphones

## 📋 Prerequisites

- Node.js (v14 or higher)
- Africa's Talking account ([sign up here](https://account.africastalking.com))
- SMS shortcode and USSD code from Africa's Talking

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Africa's Talking credentials:

```env
AT_USERNAME=your-username
AT_API_KEY=your-api-key
USSD_CODE=*384*3574#
SMS_SHORTCODE=30745
PORT=3000
NODE_ENV=development
```

### 3. Get Africa's Talking Credentials

1. Go to [Africa's Talking Dashboard](https://account.africastalking.com)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Copy your **Username** and **API Key**
5. For testing, use the sandbox:
   - Username: `sandbox`
   - Get your sandbox API key from the dashboard

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 🔧 Setting Up Africa's Talking

### USSD Configuration

1. Go to **USSD** → **Create Channel**
2. Enter your USSD code (e.g., `*384*3574#`)
3. Set callback URL: `https://your-domain.com/ussd`
4. Save the channel

### SMS Configuration

1. Go to **SMS** → **Shortcodes**
2. Request a shortcode or use the sandbox number
3. Set callback URL: `https://your-domain.com/sms`
4. Set delivery reports URL: `https://your-domain.com/sms/delivery`

### Testing with Simulator

Africa's Talking provides a simulator for testing:

1. Go to **Sandbox** → **USSD Simulator**
2. Enter your phone number
3. Dial your USSD code
4. Test the flow

For SMS:
1. Use the SMS Simulator
2. Send messages to your shortcode

## 📱 User Guide

### USSD Flow

Dial `*384*3574#`:

```
1. Find Route
2. Check Fare
3. Service Updates
4. My Favorites
```

Example: Finding a route from Kasarani to CBD
- Dial `*384*3574#`
- Select `1` (Find Route)
- Select `1` (CBD/Town)
- Select `1` (Kasarani)
- View available routes

### SMS Commands

| Command | Example | Description |
|---------|---------|-------------|
| `ROUTE [FROM] [TO]` | `ROUTE KASARANI CBD` | Find routes |
| `FARE [NUMBER]` | `FARE 45` | Check route fare |
| `STATUS [NUMBER]` | `STATUS 45` | Check route status |
| `SUBSCRIBE [NUMBER]` | `SUBSCRIBE 45` | Get daily alerts |
| `STOP [NUMBER]` | `STOP 45` | Unsubscribe |
| `HELP` | `HELP` | Show all commands |
| `MORE` | `MORE` | Show more results |
| `ALT` | `ALT` | Alternative routes |

### SMS Examples

**Find routes:**
```
SMS: ROUTE KASARANI CBD
Reply: Routes from Kasarani to CBD:
       45: Via Thika Rd (KSh 80-100)
       237: Via Mwiki (KSh 100)
```

**Subscribe to alerts:**
```
SMS: SUBSCRIBE 45
Reply: ✓ Subscribed to Route 45!
       You'll receive morning & evening alerts
```

**Morning alert example:**
```
☀️ Route 45 Morning Update

⚠ HEAVY TRAFFIC ALERT
Kasarani → CBD
Via: Thika Road

Expected delays: 30-45 min
Consider leaving early.

Reply ALT for alternatives
Reply STOP 45 to unsubscribe
```

## 🛠️ API Endpoints

### Public Endpoints

**USSD Callback**
```
POST /ussd
Content-Type: application/x-www-form-urlencoded

sessionId=xxx&serviceCode=*384*3574#&phoneNumber=+254712345678&text=1*2
```

**SMS Callback**
```
POST /sms
Content-Type: application/x-www-form-urlencoded

from=+254712345678&text=ROUTE KASARANI CBD&to=30745&id=xxx&date=xxx
```

### Management Endpoints

**List all routes**
```
GET /api/routes
```

**Search routes**
```
GET /api/routes/search?from=Kasarani&to=CBD
```

**Get specific route**
```
GET /api/routes/45
```

**Update route status** (Admin)
```
POST /api/routes/45/status
Content-Type: application/json

{
  "status": "heavy_traffic"
}
```

**View subscriptions** (Admin)
```
GET /api/subscriptions
```

**Send test alert**
```
POST /api/test/alert
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "routeNumber": "45"
}
```

## 📊 Data Structure

### Routes

```javascript
{
  number: '45',
  from: 'Kasarani',
  to: 'CBD',
  via: 'Thika Road',
  fareMin: 80,
  fareMax: 100,
  stage: 'Bus Station',
  status: 'normal', // normal, heavy_traffic, delay, closed
  sacco: 'Kenya Bus Service',
  landmarks: ['Roysambu', 'Pangani', 'Globe Cinema']
}
```

### Subscription

```javascript
{
  phoneNumber: '+254712345678',
  routes: ['45', '237']
}
```

## ⏰ Scheduled Alerts

The system sends automatic alerts:

- **Morning Alerts**: 7:00 AM EAT
- **Evening Alerts**: 5:00 PM EAT
- **Disruption Checks**: Every 30 minutes

Alert types:
- Normal service confirmation
- Heavy traffic warnings
- Route closures
- Alternative route suggestions

## 🗄️ Database (Production)

For production, replace the in-memory data store with a real database:

**Recommended options:**
- PostgreSQL (recommended)
- MongoDB
- MySQL

**Tables needed:**
- `routes` - Route information
- `subscriptions` - User subscriptions
- `reports` - User-submitted reports
- `alerts` - Alert history

## 🚀 Deployment

### Using Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create nairobi-commuter-info

# Set environment variables
heroku config:set AT_USERNAME=your-username
heroku config:set AT_API_KEY=your-api-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Using Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Using DigitalOcean

1. Create a droplet (Ubuntu)
2. Install Node.js
3. Clone repository
4. Install PM2: `npm install -g pm2`
5. Run: `pm2 start server.js`
6. Setup nginx as reverse proxy

## 🔒 Security

**Production checklist:**
- [ ] Use HTTPS for all endpoints
- [ ] Store API keys in environment variables
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable CORS appropriately
- [ ] Add authentication for admin endpoints
- [ ] Log all transactions
- [ ] Monitor for abuse

## 🧪 Testing

**Test USSD locally:**
```bash
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=123&serviceCode=*384*3574#&phoneNumber=+254712345678&text="
```

**Test SMS locally:**
```bash
curl -X POST http://localhost:3000/sms \
  -d "from=+254712345678&text=ROUTE KASARANI CBD&to=30745&id=123&date=2024-01-01"
```

**Test alert:**
```bash
curl -X POST http://localhost:3000/api/test/alert \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+254712345678", "routeNumber": "45"}'
```

## 📈 Monitoring

**Key metrics to track:**
- USSD session completion rate
- SMS response time
- Subscription growth
- Alert delivery rate
- Route status updates

**Recommended tools:**
- Africa's Talking Dashboard (built-in analytics)
- Google Analytics
- Sentry (error tracking)
- Datadog or New Relic (APM)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Adding New Routes

Edit `data/routes.js`:

```javascript
'999': {
  number: '999',
  from: 'New Area',
  to: 'CBD',
  via: 'New Road',
  fareMin: 50,
  fareMax: 80,
  stage: 'New Stage',
  status: 'normal',
  sacco: 'New SACCO',
  landmarks: ['Landmark 1', 'Landmark 2']
}
```

## 🐛 Troubleshooting

**Issue: USSD not working**
- Check callback URL is publicly accessible
- Verify USSD code in Africa's Talking dashboard
- Check server logs for errors

**Issue: SMS not being received**
- Verify phone number format (+254...)
- Check SMS shortcode configuration
- Review Africa's Talking delivery reports

**Issue: Alerts not sending**
- Verify cron jobs are running
- Check timezone configuration (Africa/Nairobi)
- Review alert service logs

## 📧 Support

- Africa's Talking Support: support@africastalking.com
- Documentation: https://developers.africastalking.com

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Africa's Talking for the excellent APIs
- Nairobi Matatu SACCOs for route data
- The commuter community for feedback

---

Built with ❤️ for Nairobi commuters
