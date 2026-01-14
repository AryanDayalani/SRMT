import { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name, description, track, format, conference, deadline, paperUrl, collaborators
        } = req.body;

        const project = new Project({
            name,
            description,
            track,
            format,
            conference,
            deadline,
            paperUrl,
            collaborators,
            owner: req.user.id,
            status: 'Idea'
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        // Fetch the full user to ensure we have the email if not in req.user
        // (Assuming protect middleware attaches a user object which might strictly be from token)
        // Ideally req.user from authMiddleware is the User model instance if implemented that way.
        // Let's assume req.user.email exists or fetch it.
        let email = req.user.email;
        if (!email) {
            const user = await User.findById(req.user.id);
            email = user?.email;
        }

        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { 'collaborators.email': email }
            ]
        }).sort({ createdAt: -1 });

        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'name email');
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to delete this project' });
            }
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to update this project' });
            }

            project.name = req.body.name || project.name;
            project.description = req.body.description || project.description;
            project.track = req.body.track || project.track;
            project.format = req.body.format || project.format;
            project.conference = req.body.conference || project.conference;
            project.deadline = req.body.deadline || project.deadline;
            project.paperUrl = req.body.paperUrl || project.paperUrl;
            project.collaborators = req.body.collaborators || project.collaborators;
            project.status = req.body.status || project.status;
            project.researchStep = req.body.researchStep || project.researchStep;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
