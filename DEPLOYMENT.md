# Deployment Guide for Skills Gap Analyzer

## Backend Deployment on Render

### Prerequisites
- A Render account (https://render.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Steps to Deploy Backend on Render

1. **Create a PostgreSQL Database on Render**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Name: `skills-gap-db` (or any name you prefer)
   - Select a region close to your users
   - Choose the Free plan (or paid plan for production)
   - Click "Create Database"
   - Copy the "Internal Database URL" (it will look like: `postgresql://user:password@host/database`)

2. **Create a Web Service on Render**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: `skills-gap-backend`
     - **Region**: Same as your database
     - **Branch**: `main` (or your default branch)
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid for production)

3. **Add Environment Variables**
   - In the "Environment" section, add:
     - **Key**: `DATABASE_URL`
     - **Value**: Paste the Internal Database URL from step 1
     - **Key**: `PORT`
     - **Value**: `3001`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Wait for the deployment to complete (you'll see "Live" status)
   - Copy your backend URL (e.g., `https://skills-gap-backend.onrender.com`)

### Important Notes for Render Deployment

- The Free tier on Render spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- The database will be automatically seeded on first startup
- Render automatically runs the build command on every deploy

### Testing Your Deployed Backend

Test your API endpoints:
```bash
# Test skills endpoint
curl https://your-backend-url.onrender.com/api/skills

# Test signup
curl -X POST https://your-backend-url.onrender.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

## Frontend Deployment

### Update Frontend Environment Variable

Before deploying the frontend, update the API URL:

1. Create a production environment file: `frontend/.env.production`
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

### Deploy Frontend on Vercel/Netlify

**Option 1: Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Run: `vercel`
4. Follow the prompts

**Option 2: Netlify**
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to frontend: `cd frontend`
3. Build: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`

**Option 3: Render (Static Site)**
1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct in Render environment variables
- Check that the database is in the same region as your web service
- Ensure the database is not paused (Free tier databases can be paused)

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### CORS Issues
- The backend already has CORS enabled for all origins
- For production, consider restricting CORS to your frontend domain only

### Seeding Issues
- The database seeds automatically on first startup
- If seeding fails, check the logs in Render dashboard
- You can manually trigger seeding by restarting the service
