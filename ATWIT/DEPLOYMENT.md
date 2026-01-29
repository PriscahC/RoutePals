# Deployment Guide

This guide covers deploying the Nairobi Commuter Information System to production.

## Table of Contents

- [Heroku Deployment](#heroku-deployment)
- [Railway Deployment](#railway-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [Exposing Local Server (Ngrok)](#exposing-local-server-ngrok)
- [Africa's Talking Configuration](#africas-talking-configuration)

---

## Heroku Deployment

### Prerequisites
- Heroku account ([sign up](https://signup.heroku.com/))
- Heroku CLI installed ([download](https://devcenter.heroku.com/articles/heroku-cli))

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create nairobi-commuter-info
```

3. **Set Environment Variables**
```bash
heroku config:set AT_USERNAME=your-username
heroku config:set AT_API_KEY=your-api-key
heroku config:set USSD_CODE="*384*3574#"
heroku config:set SMS_SHORTCODE=30745
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Verify Deployment**
```bash
heroku open
heroku logs --tail
```

Your app will be available at: `https://nairobi-commuter-info.herokuapp.com`

### Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check app status
heroku ps

# Open app in browser
heroku open

# Run commands in app
heroku run node -v
```

---

## Railway Deployment

### Prerequisites
- Railway account ([sign up](https://railway.app/))
- GitHub account

### Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/nairobi-commuter-info.git
git push -u origin main
```

2. **Deploy on Railway**
- Go to [Railway](https://railway.app/)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway will automatically detect it's a Node.js app

3. **Add Environment Variables**
- In Railway dashboard, go to your project
- Click "Variables" tab
- Add:
  - `AT_USERNAME`
  - `AT_API_KEY`
  - `USSD_CODE`
  - `SMS_SHORTCODE`
  - `NODE_ENV=production`

4. **Get Your URL**
- Railway provides a URL like: `https://your-app.railway.app`
- You can also add a custom domain

---

## DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- SSH key configured

### Steps

1. **Create Droplet**
- Choose Ubuntu 22.04 LTS
- Select size (Basic $6/month is sufficient to start)
- Choose datacenter region (closest to Kenya for best performance)
- Add SSH key
- Create droplet

2. **SSH into Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Install Node.js**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node -v
npm -v
```

4. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

5. **Clone Repository**
```bash
cd /var/www
git clone https://github.com/your-username/nairobi-commuter-info.git
cd nairobi-commuter-info
```

6. **Install Dependencies**
```bash
npm install
```

7. **Set Environment Variables**
```bash
nano .env
```

Add:
```env
AT_USERNAME=your-username
AT_API_KEY=your-api-key
USSD_CODE=*384*3574#
SMS_SHORTCODE=30745
PORT=3000
NODE_ENV=production
```

8. **Start Application with PM2**
```bash
pm2 start server.js --name commuter-info
pm2 save
pm2 startup
```

9. **Install and Configure Nginx**
```bash
apt install -y nginx

# Create nginx config
nano /etc/nginx/sites-available/commuter-info
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/commuter-info /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

10. **Install SSL Certificate (Let's Encrypt)**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

### Useful PM2 Commands

```bash
# View logs
pm2 logs commuter-info

# Restart app
pm2 restart commuter-info

# Stop app
pm2 stop commuter-info

# Check status
pm2 status

# Monitor
pm2 monit
```

---

## Exposing Local Server (Ngrok)

For testing callbacks from Africa's Talking without deploying.

### Prerequisites
- Ngrok installed ([download](https://ngrok.com/download))

### Steps

1. **Start Your Local Server**
```bash
npm run dev
```

2. **Expose with Ngrok**
```bash
ngrok http 3000
```

3. **Copy the HTTPS URL**
Ngrok will show something like:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

4. **Use in Africa's Talking**
- USSD Callback: `https://abc123.ngrok.io/ussd`
- SMS Callback: `https://abc123.ngrok.io/sms`

**Note:** Free ngrok URLs change each time you restart. For persistent URLs, upgrade to a paid plan.

---

## Africa's Talking Configuration

### 1. USSD Setup

1. Go to [Africa's Talking Dashboard](https://account.africastalking.com)
2. Navigate to **USSD** → **Create Channel**
3. Fill in:
   - **Service Code**: `*384*3574#` (or your chosen code)
   - **Callback URL**: `https://your-domain.com/ussd`
4. Save

### 2. SMS Setup

1. Navigate to **SMS** → **Incoming Messages**
2. Set **Callback URL**: `https://your-domain.com/sms`
3. Navigate to **SMS** → **Delivery Reports**
4. Set **Callback URL**: `https://your-domain.com/sms/delivery`

### 3. Testing

**Sandbox (Development):**
- Username: `sandbox`
- Use the USSD/SMS simulators in the dashboard
- No real charges

**Production:**
- Get production credentials
- Apply for USSD code through Africa's Talking
- Purchase SMS shortcode
- Configure callback URLs with your production domain

### 4. Callback URL Requirements

Your server must:
- Be publicly accessible (HTTPS recommended)
- Return responses within 30 seconds
- Handle POST requests
- Return correct Content-Type headers

### 5. Testing Callbacks

**Test USSD:**
```bash
curl -X POST https://your-domain.com/ussd \
  -d "sessionId=test123&serviceCode=*384*3574#&phoneNumber=+254712345678&text="
```

**Test SMS:**
```bash
curl -X POST https://your-domain.com/sms \
  -d "from=+254712345678&text=ROUTE KASARANI CBD&to=30745&id=test123&date=2024-01-01"
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AT_USERNAME` | Africa's Talking username | `sandbox` or `your-username` |
| `AT_API_KEY` | Africa's Talking API key | `abc123...` |
| `USSD_CODE` | Your USSD service code | `*384*3574#` |
| `SMS_SHORTCODE` | Your SMS shortcode | `30745` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` or `development` |

---

## Monitoring and Maintenance

### 1. Set Up Monitoring

**Using PM2 (DigitalOcean):**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Using Heroku:**
```bash
heroku addons:create papertrail
heroku addons:open papertrail
```

### 2. Database Migration (Production)

When moving to production, replace in-memory storage:

**Option 1: PostgreSQL (Recommended)**
```bash
# On Heroku
heroku addons:create heroku-postgresql:mini

# Connection string automatically set as DATABASE_URL
```

**Option 2: MongoDB**
```bash
# Install MongoDB locally or use MongoDB Atlas
npm install mongoose
```

### 3. Regular Maintenance

- Check logs daily: `pm2 logs` or `heroku logs --tail`
- Monitor error rates in Africa's Talking dashboard
- Review subscription metrics
- Update route data based on user reports
- Backup database regularly (if using one)

### 4. Scaling

**Heroku:**
```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Upgrade dyno type
heroku ps:type web=standard-1x
```

**DigitalOcean:**
```bash
# Use PM2 cluster mode
pm2 start server.js -i max --name commuter-info
```

---

## Troubleshooting

### Common Issues

**1. USSD Not Working**
- Check callback URL is accessible from outside
- Verify USSD code in Africa's Talking matches
- Check server logs for errors
- Test with ngrok first

**2. SMS Not Received**
- Verify phone number format (+254...)
- Check shortcode is active
- Review delivery reports in Africa's Talking dashboard

**3. Server Crashes**
- Check PM2 logs: `pm2 logs`
- Increase server memory if needed
- Check for unhandled promise rejections

**4. Slow Responses**
- USSD must respond in <30 seconds
- Add response time monitoring
- Optimize database queries
- Use caching for route data

---

## Security Checklist

Before going to production:

- [ ] Environment variables secured (not in code)
- [ ] HTTPS enabled (use Let's Encrypt)
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error handling doesn't expose internals
- [ ] Logging configured (but no sensitive data)
- [ ] Firewall configured (if using DigitalOcean)
- [ ] Regular security updates scheduled
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

---

## Cost Estimation (Monthly)

**Hosting:**
- Heroku Basic: $7/month
- Railway Starter: $5/month
- DigitalOcean Droplet: $6/month

**Africa's Talking:**
- USSD: ~KSh 0.50 per session
- SMS: ~KSh 0.80 per message
- Shortcode: ~KSh 5,000/month

**Example for 1,000 users:**
- 30,000 USSD sessions/month: KSh 15,000
- 10,000 SMS/month: KSh 8,000
- Shortcode: KSh 5,000
- Hosting: $6 (~KSh 900)
- **Total: ~KSh 28,900/month**

---

## Support

- **Africa's Talking Support**: support@africastalking.com
- **Documentation**: https://developers.africastalking.com
- **Community**: https://help.africastalking.com

---

Good luck with your deployment! 🚀
