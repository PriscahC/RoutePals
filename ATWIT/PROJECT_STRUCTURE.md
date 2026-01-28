# Project Structure

```
nairobi-commuter-info/
│
├── 📄 server.js                    # Main Express server
├── 📄 package.json                 # Dependencies and scripts
├── 📄 test.js                      # Interactive test console
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 data/
│   └── routes.js                   # Route data store & management
│
├── 📁 handlers/
│   ├── ussdHandler.js              # USSD menu logic
│   └── smsHandler.js               # SMS command processing
│
├── 📁 services/
│   ├── smsService.js               # Africa's Talking SMS wrapper
│   └── alertService.js             # Scheduled alerts & notifications
│
├── 📁 public/
│   └── dashboard.html              # Web dashboard for monitoring
│
└── 📁 docs/
    ├── README.md                   # Complete documentation
    ├── QUICKSTART.md               # 5-minute setup guide
    └── DEPLOYMENT.md               # Production deployment guide
```

## File Descriptions

### Core Files

**server.js**
- Express.js server setup
- API endpoints (USSD, SMS, management)
- Route definitions
- Error handling
- Serves the web dashboard

**package.json**
- Project dependencies
- NPM scripts (start, dev, test)
- Project metadata

**test.js**
- Interactive CLI for testing
- Simulates USSD and SMS flows
- No need for Africa's Talking callbacks
- Great for local development

### Data Layer

**data/routes.js**
- In-memory data store (replace with DB in production)
- Route definitions and search
- Subscription management
- Session storage for USSD

### Handlers

**handlers/ussdHandler.js**
- USSD menu state management
- Interactive flow logic
- Menu rendering
- User input processing

**handlers/smsHandler.js**
- SMS command parsing
- Response generation
- Subscription handling
- Help text and error messages

### Services

**services/smsService.js**
- Africa's Talking SMS API wrapper
- Phone number formatting
- Bulk messaging
- Delivery tracking

**services/alertService.js**
- Scheduled alerts (morning/evening)
- Cron job management
- Disruption notifications
- Alert message generation

### Frontend

**public/dashboard.html**
- Real-time monitoring interface
- Route status display
- Quick testing tools
- System statistics

## Key Features by File

### USSD Flow (ussdHandler.js)
```
Main Menu
├── Find Route
│   ├── Select Destination
│   └── Select Origin
├── Check Fare
├── Service Updates
└── My Favorites
```

### SMS Commands (smsHandler.js)
```
ROUTE [FROM] [TO]     → Find routes
FARE [NUMBER]         → Check fare
STATUS [NUMBER]       → Route status
SUBSCRIBE [NUMBER]    → Daily alerts
STOP [NUMBER]         → Unsubscribe
HELP                  → Show commands
MORE                  → More results
ALT                   → Alternatives
```

### Scheduled Alerts (alertService.js)
```
7:00 AM  → Morning commute alerts
5:00 PM  → Evening commute alerts
Every 30min → Disruption checks
```

## API Endpoints

### Public (Africa's Talking Callbacks)
- `POST /ussd` - USSD callback
- `POST /sms` - SMS callback
- `POST /sms/delivery` - Delivery reports

### Management
- `GET /api/routes` - List all routes
- `GET /api/routes/search` - Search routes
- `GET /api/routes/:number` - Get route details
- `POST /api/routes/:number/status` - Update status
- `GET /api/subscriptions` - List subscriptions

### Testing
- `POST /api/test/sms` - Send test SMS
- `POST /api/test/alert` - Send test alert

## Technology Stack

**Backend:**
- Node.js + Express.js
- Africa's Talking SDK
- node-cron (scheduling)
- dotenv (config)

**Frontend:**
- Vanilla HTML/CSS/JS
- Fetch API
- Responsive design

**Deployment:**
- Heroku / Railway / DigitalOcean
- PM2 (process management)
- Nginx (reverse proxy)
- Let's Encrypt (SSL)

## Data Flow

### USSD Session
```
User dials code
    ↓
Africa's Talking → POST /ussd
    ↓
ussdHandler processes input
    ↓
Returns CON (continue) or END (terminate)
    ↓
Africa's Talking → Displays to user
```

### SMS Command
```
User sends SMS
    ↓
Africa's Talking → POST /sms
    ↓
smsHandler processes command
    ↓
smsService sends response
    ↓
User receives SMS
```

### Scheduled Alert
```
Cron trigger (7 AM)
    ↓
alertService gets subscriptions
    ↓
Generate personalized messages
    ↓
smsService sends bulk SMS
    ↓
Users receive alerts
```

## Configuration

### Required Environment Variables
```
AT_USERNAME      # Africa's Talking username
AT_API_KEY       # Africa's Talking API key
USSD_CODE        # Your USSD code
SMS_SHORTCODE    # Your SMS shortcode
PORT             # Server port (default: 3000)
NODE_ENV         # development/production
```

### Optional (Production)
```
DATABASE_URL     # PostgreSQL connection string
REDIS_URL        # Redis for sessions/caching
SENTRY_DSN       # Error tracking
```

## Development Workflow

1. **Setup**: `npm install` + configure `.env`
2. **Local Test**: `npm test` (interactive console)
3. **Run Server**: `npm run dev`
4. **Expose**: `ngrok http 3000`
5. **Configure AT**: Set callback URLs
6. **Test Live**: Use AT simulator
7. **Deploy**: Follow DEPLOYMENT.md

## Production Checklist

- [ ] Replace in-memory storage with database
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backups
- [ ] Add rate limiting
- [ ] Set up logging
- [ ] Configure alerts
- [ ] Document runbook
- [ ] Load testing
- [ ] Security audit

## Scaling Considerations

**For 1,000+ users:**
- Add PostgreSQL database
- Implement Redis caching
- Use message queues (Bull/RabbitMQ)
- Load balancer for multiple instances
- CDN for static assets

**For 10,000+ users:**
- Database read replicas
- Separate worker processes
- Microservices architecture
- API rate limiting
- Advanced monitoring

## Monitoring Metrics

- USSD session completion rate
- SMS delivery success rate
- Average response time
- Error rate
- Active subscriptions
- Daily active users
- Route lookup patterns
- Peak usage times

---

Need help? Check README.md for detailed documentation!
