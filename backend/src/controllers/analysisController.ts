import { Request, Response } from 'express';
import { analyzePaperText, checkPlagiarism } from '../services/groqService';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse');

export const analyzePaper = async (req: Request, res: Response) => {
    try {
        let text = req.body.text;

        // Handle file upload
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await pdf(req.file.buffer);
                text = pdfData.text;
            } else {
                return res.status(400).json({ message: 'Only PDF files are supported for now.' });
            }
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Text content or valid PDF file is required.' });
        }

        // Limit text length if necessary to avoid token limits
        const maxLength = 25000;
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + "\n...[truncated]";
        }

        const analysis = await analyzePaperText(text);
        res.json({ analysis });
    } catch (error: any) {
        console.error("Controller Analysis Error:", error);
        res.status(500).json({ message: error.message || 'Failed to analyze paper' });
    }
};

export const checkPlagiarismHandler = async (req: Request, res: Response) => {
    try {
        let text = req.body.text;

        // Handle file upload
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await pdf(req.file.buffer);
                text = pdfData.text;
            } else {
                return res.status(400).json({ message: 'Only PDF files are supported for now.' });
            }
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Text content or valid PDF file is required.' });
        }

        // Limit text length
        const maxLength = 25000;
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + "\n...[truncated]";
        }

        const result = await checkPlagiarism(text);
        res.json({ result });
    } catch (error: any) {
        console.error("Controller Plagiarism Error:", error);
        res.status(500).json({ message: error.message || 'Failed to check plagiarism' });
    }
};

