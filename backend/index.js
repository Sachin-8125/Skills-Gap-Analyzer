import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const analyzeSkillsGap = async(userId) => {

    const userSkills = await prisma.userSkill.findMany({
        where: {userId},
        include: {skill: true}
    });

    const jobPostings = await prisma.jobPosting.findMany({
        include: { requiredSkills: { include: { skill: true } } },
    });

    const userSkillNames = userSkills.map(us => us.skill.name);
    const requiredSkillsCount = {};

    jobPostings.forEach(job => {
        job.requiredSkills.forEach(rs => {
            if (!requiredSkillsCount[rs.skill.name]) {
                requiredSkillsCount[rs.skill.name] = { count: 0, skill: rs.skill };
            }
            requiredSkillsCount[rs.skill.name].count++;
        });
    });

    const trendingSkills = Object.values(requiredSkillsCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const gap = trendingSkills.filter(ts => !userSkillNames.includes(ts.skill.name));

    return {
        trendingSkills,
        userSkills,
        gap,
        roadmap: gap.map(g => ({
            skill: g.skill,
            suggestion: `Consider taking a course in ${g.skill.name}.`,
        })),
    };
};

//signup user
app.post('/api/signup', async(req,res) => {
    const {email, name, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Could not create user.' });
    }
});

//login user
app.post('/api/login', async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Could not log in.' });
    }
});

//get all skills
app.get('/api/skills', async(req, res) => {
    const skills = await prisma.skill.findMany();
    res.json(skills);
});

//get user and their skills
app.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            skills: { include: { skill: true } },
        },
    });
    res.json(user);
});

// Add a skill to a user
app.post('/api/user/:id/skills', async (req, res) => {
    const { id } = req.params;
    const { skillId } = req.body;
    try {
        const userSkill = await prisma.userSkill.create({
            data: {
                userId: id,
                skillId,
            },
        });
        res.json(userSkill);
    } catch (error) {
        res.status(400).json({error: "Skill already added or invalid IDs."})
    }
});

// Analyze skills gap for a user
app.get('/api/user/:id/analyze', async (req, res) => {
    const { id } = req.params;
    const analysis = await analyzeSkillsGap(id);
    res.json(analysis);
});


// Add some dummy data if the database is empty
const seedDatabase = async () => {
    const skillsCount = await prisma.skill.count();
    if (skillsCount > 0) return; // Don't re-seed

    console.log('Seeding database...');
    // Seed skills
    await prisma.skill.createMany({
        data: [
            { name: 'JavaScript' }, { name: 'React' }, { name: 'Node.js' },
            { name: 'Python' }, { name: 'SQL' }, { name: 'AWS' },
            { name: 'Docker' }, { name: 'TypeScript' }, { name: 'Communication' },
            { name: 'Project Management' },
        ],
    });

    console.log('Database seeded with skills.');
};


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    seedDatabase();
});