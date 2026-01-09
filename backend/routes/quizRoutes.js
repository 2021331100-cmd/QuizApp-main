import express from 'express';
import { 
    createQuiz, 
    getAllQuizzes, 
    getQuizById, 
    submitQuiz, 
    updateQuiz, 
    deleteQuiz 
} from '../controllers/quizController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', optionalAuth, submitQuiz);

// Protected routes (require authentication)
router.post('/', authenticateToken, createQuiz);
router.put('/:id', authenticateToken, updateQuiz);
router.delete('/:id', authenticateToken, deleteQuiz);

export default router;
