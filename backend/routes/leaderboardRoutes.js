import express from 'express';
import {
    getGlobalLeaderboard,
    getQuizLeaderboard,
    getTechnologyLeaderboard,
    getQuizStats
} from '../controllers/leaderboardController.js';

const router = express.Router();

// GET /api/leaderboard/global - Get global leaderboard
router.get('/global', getGlobalLeaderboard);

// GET /api/leaderboard/quiz/:quizId - Get quiz-specific leaderboard
router.get('/quiz/:quizId', getQuizLeaderboard);

// GET /api/leaderboard/technology/:technology - Get technology-specific leaderboard
router.get('/technology/:technology', getTechnologyLeaderboard);

// GET /api/leaderboard/stats/:quizId - Get quiz statistics
router.get('/stats/:quizId', getQuizStats);

export default router;
