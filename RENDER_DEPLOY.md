# Render Backend Deployment Commands

## Step 1: Create PostgreSQL Database

Go to Render Dashboard → New + → PostgreSQL

**Configuration:**
```
Name: skills-gap-db
Database: skills_gap_analyzer
Region: Oregon (US West) or closest to you
PostgreSQL Version: 16
Plan: Free
```

After creation, **COPY THE INTERNAL DATABASE URL** (you'll need it in Step 3)

---

## Step 2: Create Web Service

Go to Render Dashboard → New + → Web Service

Connect your Git repository and select your branch (main)

---

## Step 3: Configure Web Service

### Basic Settings:
```
Name: skills-gap-backend
Region: Oregon (US West) - MUST MATCH DATABASE REGION
Branch: main
Root Directory: backend
Runtime: Node
```

### Build & Deploy Settings:

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma db push
```

**Start Command:**
```bash
npm start
```

### Environment Variables:

Click "Advanced" → "Add Environment Variable"

**Variable 1:**
```
Key: DATABASE_URL
Value: [PASTE YOUR INTERNAL DATABASE URL FROM STEP 1]
```

**Variable 2:**
```
Key: PORT
Value: 3001
```

### Additional Settings:
```
Auto-Deploy: Yes
Instance Type: Free
```

---

## Step 4: Deploy

Click **"Create Web Service"**

Wait 5-10 minutes for deployment to complete.

Your backend will be live at:
```
https://skills-gap-backend.onrender.com
```

---

## Step 5: Verify Deployment

### Test the API:

**Method 1: Browser**
Open in your browser:
```
https://your-backend-url.onrender.com/api/skills
```

**Method 2: cURL**
```bash
curl https://your-backend-url.onrender.com/api/skills
```

**Expected Response:**
```json
[
  {"id":"...","name":"JavaScript"},
  {"id":"...","name":"React"},
  {"id":"...","name":"Node.js"},
  ...
]
```

---

## Step 6: Update Frontend

After backend is deployed, update your frontend environment file:

**File: `frontend/.env.production`**
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render URL.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ RENDER BACKEND DEPLOYMENT - QUICK REFERENCE            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Root Directory:    backend                              │
│                                                         │
│ Build Command:     npm install &&                       │
│                    npx prisma generate &&               │
│                    npx prisma db push                   │
│                                                         │
│ Start Command:     npm start                            │
│                                                         │
│ Environment Variables:                                  │
│   DATABASE_URL = [Internal Database URL from Render]   │
│   PORT = 3001                                           │
│                                                         │
│ Runtime:           Node                                 │
│ Region:            Same as database                     │
│ Auto-Deploy:       Yes                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Important Notes

### ⚠️ Critical Points:
- ✅ Use **Internal Database URL** (not External)
- ✅ Database and Web Service must be in the **same region**
- ✅ Free tier **spins down after 15 minutes** of inactivity
- ✅ First request after spin-down takes **30-60 seconds**
- ✅ Database **seeds automatically** on first startup

### 📝 What Happens During Deployment:
1. Render clones your repository
2. Installs npm dependencies
3. Generates Prisma client
4. Pushes database schema to PostgreSQL
5. Starts the server
6. Seeds the database with initial data

---

## Troubleshooting

### Issue: Build fails with "Prisma generate error"
**Solution:** Ensure `DATABASE_URL` is set in environment variables

### Issue: "Can't reach database server"
**Solution:** 
- Use the "Internal Database URL" not "External"
- Ensure database and web service are in the same region
- Check if database is active (not paused)

### Issue: Database not seeding
**Solution:** 
- Check logs in Render dashboard
- Seeding runs automatically on server startup
- If it fails, the server continues running

### Issue: 502 Bad Gateway
**Solution:** 
- Service is starting up (wait 30-60 seconds on free tier)
- Check logs for any startup errors

### Issue: CORS errors
**Solution:** 
- Backend already has CORS enabled for all origins
- For production, consider restricting to your frontend domain

---

## Viewing Logs

To check deployment status and debug issues:

1. Go to Render Dashboard
2. Click on your web service
3. Click "Logs" tab
4. Look for:
   - ✅ "Server is running on http://localhost:3001"
   - ✅ "Database seeded successfully with skills and job postings!"

---

## Updating Your Deployment

### Automatic Updates:
- Push changes to your Git repository
- Render automatically rebuilds and redeploys

### Manual Redeploy:
1. Go to Render Dashboard
2. Click on your web service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## Cost Information

**Free Tier Includes:**
- 750 hours/month of runtime
- Automatic SSL certificates
- Automatic deploys from Git
- PostgreSQL database (90 days, then $7/month)

**Limitations:**
- Spins down after 15 minutes of inactivity
- 512 MB RAM
- Shared CPU

---

## Next Steps After Backend Deployment

1. ✅ Copy your backend URL
2. ✅ Update `frontend/.env.production`
3. ✅ Deploy frontend to Vercel/Netlify/Render
4. ✅ Test the full application
5. ✅ Share your app with users!

---

## Support

If you encounter issues:
- Check Render logs first
- Review the troubleshooting section
- Check Render status page: https://status.render.com
- Render documentation: https://render.com/docs

---

**Your backend is now deployed and ready to use! 🚀**
