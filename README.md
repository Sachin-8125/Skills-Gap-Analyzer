# Skills Gap Analyzer

A full-stack web application that helps users identify skill gaps by analyzing their current skills against trending job market requirements and provides personalized learning roadmaps.

## Features

- 🔐 User authentication (signup/login)
- 📊 Skills management
- 🎯 Skills gap analysis
- 🗺️ Personalized learning roadmap
- 💼 Job market trend analysis

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (via Prisma ORM)
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- Modern ES6+ JavaScript

## Project Structure

```
Skills-Gap-Analyzer/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── index.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── .env
│   └── .env.production
├── DEPLOYMENT.md
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or use Neon/Render)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your PostgreSQL database URL:
     ```
     DATABASE_URL="your_postgresql_connection_string"
     PORT=3001
     ```

4. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Update `.env` file:
     ```
     VITE_API_BASE_URL=http://localhost:3001/api
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login

### Skills
- `GET /api/skills` - Get all available skills
- `GET /api/user/:id` - Get user profile with skills
- `POST /api/user/:id/skills` - Add skill to user profile

### Analysis
- `GET /api/user/:id/analyze` - Analyze user's skills gap

## Database Schema

The application uses the following models:
- **User** - User accounts with authentication
- **Skill** - Available skills in the system
- **UserSkill** - Many-to-many relationship between users and skills
- **JobPosting** - Job postings with required skills
- **JobSkill** - Many-to-many relationship between jobs and skills

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Render, Vercel, and Netlify.

### Quick Deploy to Render

1. Create PostgreSQL database on Render
2. Create Web Service with:
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
   - **Environment Variables**: 
     - `DATABASE_URL` (from Render PostgreSQL)
     - `PORT=3001`

## Features in Detail

### Skills Gap Analysis
The application analyzes:
- User's current skills
- Trending skills from job postings
- Skills gap (missing trending skills)
- Personalized learning recommendations

### Automatic Database Seeding
On first startup, the database is automatically seeded with:
- 10 common tech skills
- 5 sample job postings
- Required skills for each job posting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
