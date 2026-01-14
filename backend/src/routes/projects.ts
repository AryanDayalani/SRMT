import express from 'express';
import { z } from 'zod';
import { createProject, getProjects, getProjectById, deleteProject, updateProject } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

const router = express.Router();

const createProjectSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    track: z.string(),
    format: z.string(),
    conference: z.string().optional(),
    deadline: z.string().optional(), // Could be updated to z.union([z.string(), z.date()]) but sticky with string for now as it comes from JSON
    paperUrl: z.string().optional().or(z.literal('')),
    collaborators: z.array(z.object({
        name: z.string(),
        email: z.string().email(),
        role: z.string(),
        registrationNumber: z.string().optional(),
        organization: z.string().optional(),
        country: z.string().optional(),
    })).optional(),
});

const updateProjectSchema = createProjectSchema.partial().extend({
    status: z.enum(['Idea', 'In Progress', 'Submitted', 'Accepted', 'Published']).optional(),
    researchStep: z.enum(['abstract', 'literature', 'methodology', 'results', 'conclusion']).optional()
});

router.route('/')
    .post(protect, validate(createProjectSchema), createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, getProjectById)
    .delete(protect, deleteProject)
    .put(protect, validate(updateProjectSchema), updateProject);

export default router;
