import express from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getMe, updateUserProfile } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['researcher', 'guide']),
    registrationNumber: z.string().optional(),
    facultyId: z.string().optional(),
    phoneNumber: z.string().optional(),
    department: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phoneNumber: z.string().optional(),
    department: z.string().optional(),
    avatar: z.string().optional(),
});

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateUserProfile);

export default router;
