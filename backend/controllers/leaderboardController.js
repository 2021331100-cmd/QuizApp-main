import Result from '../models/resultModel.js';
import User from '../models/userModel.js';

// Get global leaderboard (top scores across all quizzes)
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const leaderboard = await Result.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    totalQuizzes: { $count: {} },
                    avgScore: { $avg: '$score' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 1,
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    totalScore: 1,
                    totalQuizzes: 1,
                    avgScore: { $round: ['$avgScore', 2] }
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {
        console.error('Global leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching global leaderboard',
            error: error.message
        });
    }
};

// Get quiz-specific leaderboard
export const getQuizLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        const leaderboard = await Result.find({ quiz: quizId })
            .populate('user', 'name email')
            .sort({ score: -1, createdAt: 1 })
            .limit(limit)
            .select('user score percentage createdAt');

        res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {
        console.error('Quiz leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quiz leaderboard',
            error: error.message
        });
    }
};

// Get technology-specific leaderboard
export const getTechnologyLeaderboard = async (req, res) => {
    try {
        const { technology } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        const leaderboard = await Result.aggregate([
            {
                $match: { technology: technology.toLowerCase() }
            },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    totalQuizzes: { $count: {} },
                    avgScore: { $avg: '$score' },
                    bestScore: { $max: '$score' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 1,
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    totalScore: 1,
                    totalQuizzes: 1,
                    avgScore: { $round: ['$avgScore', 2] },
                    bestScore: 1
                }
            },
            {
                $sort: { totalScore: -1 }
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({
            success: true,
            technology: technology,
            leaderboard
        });

    } catch (error) {
        console.error('Technology leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching technology leaderboard',
            error: error.message
        });
    }
};

// Get quiz statistics
export const getQuizStats = async (req, res) => {
    try {
        const { quizId } = req.params;

        const stats = await Result.aggregate([
            {
                $match: { quiz: quizId }
            },
            {
                $group: {
                    _id: null,
                    totalAttempts: { $count: {} },
                    avgScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {
                totalAttempts: 0,
                avgScore: 0,
                highestScore: 0,
                lowestScore: 0
            }
        });

    } catch (error) {
        console.error('Quiz stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quiz statistics',
            error: error.message
        });
    }
};
