import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import analysisRoutes from './routes/paper-analysis';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';

const app = express();
const PORT = 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads (in-memory for now)
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/', (req, res) => {
    res.send('Research Management Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
