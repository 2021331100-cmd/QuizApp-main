import quizService from '../services/quizService.js';
import { AppError } from '../middleware/errorHandler.js';

// Create a new quiz
export const createQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.createQuiz(req.body, req.user?._id);

        res.status(201).json({ 
            success: true, 
            message: 'Quiz created successfully', 
            quiz 
        });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

// Get all quizzes
export const getAllQuizzes = async (req, res, next) => {
    try {
        const { technology, level } = req.query;
        const quizzes = await quizService.getAllQuizzes({ technology, level });

        res.status(200).json({ 
            success: true, 
            count: quizzes.length,
            quizzes 
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// Get a specific quiz with questions
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id);

        res.status(200).json({ 
            success: true, 
            quiz 
        });
    } catch (error) {
        const statusCode = error.message === 'Quiz not found' ? 404 : 500;
        next(new AppError(error.message, statusCode));
    }
};

// Submit quiz answers and get results
export const submitQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const userId = req.user?._id || req.body.userId;

        const results = await quizService.submitQuiz(id, answers, userId);

        res.status(200).json({ 
            success: true, 
            results 
        });
    } catch (error) {
        const statusCode = error.message === 'Quiz not found' ? 404 : 500;
        next(new AppError(error.message, statusCode));
    }
};

// Update quiz
export const updateQuiz = async (req, res, next) => {
    try {
        const quiz = await quizService.updateQuiz(req.params.id, req.body, req.user._id);

        res.status(200).json({ 
            success: true, 
            message: 'Quiz updated successfully', 
            quiz 
        });
    } catch (error) {
        const statusCode = error.message === 'Quiz not found' ? 404 
            : error.message.includes('Not authorized') ? 403 : 400;
        next(new AppError(error.message, statusCode));
    }
};

// Delete quiz
export const deleteQuiz = async (req, res, next) => {
    try {
        await quizService.deleteQuiz(req.params.id, req.user._id);

        res.status(200).json({ 
            success: true, 
            message: 'Quiz deleted successfully' 
        });
    } catch (error) {
        const statusCode = error.message === 'Quiz not found' ? 404 
            : error.message.includes('Not authorized') ? 403 : 500;
        next(new AppError(error.message, statusCode));
    }
};
