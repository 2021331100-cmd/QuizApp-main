import Result from '../models/resultModel.js';
import mongoose from 'mongoose';
import validationService from './validationService.js';

// Result Service - Single Responsibility: Result business logic
class ResultService {
    async createResult(resultData, userId) {
        if (!userId) {
            throw new Error('User authentication required');
        }

        const { title, technology, level, totalQuestions, correct, wrong } = resultData;

        // Validation
        const validation = validationService.validateResultData({
            title,
            technology,
            level,
            totalQuestions,
            correct
        });

        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Calculate wrong answers if not provided
        const computedWrong = wrong !== undefined
            ? Number(wrong)
            : Math.max(0, Number(totalQuestions) - Number(correct));

        // Create result
        const result = await Result.create({
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: userId
        });

        return result;
    }

    async getUserResults(userId, technology = null) {
        if (!userId) {
            throw new Error('User authentication required');
        }

        const query = { user: new mongoose.Types.ObjectId(userId) };

        if (technology && technology.toLowerCase() !== 'all') {
            query.technology = technology;
        }

        const results = await Result.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return results;
    }

    async getResultById(resultId, userId) {
        const result = await Result.findById(resultId);

        if (!result) {
            throw new Error('Result not found');
        }

        // Authorization check
        if (result.user.toString() !== userId.toString()) {
            throw new Error('Not authorized to view this result');
        }

        return result;
    }

    async deleteResult(resultId, userId) {
        const result = await Result.findById(resultId);

        if (!result) {
            throw new Error('Result not found');
        }

        // Authorization check
        if (result.user.toString() !== userId.toString()) {
            throw new Error('Not authorized to delete this result');
        }

        await result.deleteOne();
        return { message: 'Result deleted successfully' };
    }

    async getUserStatistics(userId) {
        if (!userId) {
            throw new Error('User authentication required');
        }

        const results = await Result.find({ user: userId });

        const totalQuizzes = results.length;
        const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
        const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
        const averageScore = totalQuestions > 0 
            ? Math.round((totalCorrect / totalQuestions) * 100) 
            : 0;

        const byTechnology = {};
        results.forEach(result => {
            if (!byTechnology[result.technology]) {
                byTechnology[result.technology] = {
                    count: 0,
                    correct: 0,
                    total: 0
                };
            }
            byTechnology[result.technology].count++;
            byTechnology[result.technology].correct += result.correct;
            byTechnology[result.technology].total += result.totalQuestions;
        });

        return {
            totalQuizzes,
            totalCorrect,
            totalQuestions,
            averageScore,
            byTechnology
        };
    }
}

export default new ResultService();
