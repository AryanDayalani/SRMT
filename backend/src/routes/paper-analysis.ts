import express from 'express';
import multer from 'multer';
import { analyzePaper } from '../controllers/analysisController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('file'), analyzePaper);

export default router;
