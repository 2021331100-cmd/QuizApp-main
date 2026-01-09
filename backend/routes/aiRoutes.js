import express from 'express';
import multer from 'multer';
import {
    generateQuestionsFromText,
    generateQuestionsFromPDF,
    generateExplanations
} from '../controllers/aiController.js';

const router = express.Router();

// Configure multer for file uploads (store in memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// POST /api/ai/generate-from-text - Generate questions from text input
router.post('/generate-from-text', generateQuestionsFromText);

// POST /api/ai/generate-from-pdf - Generate questions from PDF upload
router.post('/generate-from-pdf', upload.single('pdf'), generateQuestionsFromPDF);

// POST /api/ai/generate-explanations - Generate explanations for existing questions
router.post('/generate-explanations', generateExplanations);

export default router;
