import Quiz from '../models/quizModel.js';
import Result from '../models/resultModel.js';

// Create a new quiz
export const createQuiz = async (req, res) => {
    try {
        const { title, technology, level, questions } = req.body;

        // Validate required fields
        if (!title || !technology || !level || !questions || questions.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: title, technology, level, and questions' 
            });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || !q.options || q.options.length < 2 || !q.correctAnswer) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Question ${i + 1} is invalid. Each question must have a question text, at least 2 options, and a correct answer` 
                });
            }
        }

        const quiz = new Quiz({
            title,
            technology,
            level,
            questions,
            createdBy: req.user?._id || null
        });

        await quiz.save();

        res.status(201).json({ 
            success: true, 
            message: 'Quiz created successfully', 
            quiz 
        });

    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating quiz', 
            error: error.message 
        });
    }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
    try {
        const { technology, level } = req.query;
        
        let filter = { isActive: true };
        if (technology) filter.technology = technology;
        if (level) filter.level = level;

        const quizzes = await Quiz.find(filter)
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: quizzes.length,
            quizzes 
        });

    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching quizzes', 
            error: error.message 
        });
    }
};

// Get a specific quiz with questions
export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findById(id)
            .select('-questions.correctAnswer -questions.explanation');

        if (!quiz) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quiz not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            quiz 
        });

    } catch (error) {
        console.error('Get quiz error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching quiz', 
            error: error.message 
        });
    }
};

// Submit quiz answers and get results
export const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // answers should be an array of { questionId, selectedAnswer }

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quiz not found' 
            });
        }

        // Increment attempt counter
        quiz.totalAttempts += 1;
        await quiz.save();

        let correct = 0;
        let wrong = 0;
        const results = [];

        quiz.questions.forEach((question, index) => {
            const userAnswer = answers.find(a => a.questionId === question._id.toString());
            const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
            
            if (isCorrect) {
                correct++;
            } else {
                wrong++;
            }

            results.push({
                questionId: question._id,
                question: question.question,
                userAnswer: userAnswer?.selectedAnswer || 'Not answered',
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation
            });
        });

        const totalQuestions = quiz.questions.length;
        const score = Math.round((correct / totalQuestions) * 100);

        // Save result to database if user is authenticated
        const userId = req.user?._id || req.body.userId;
        
        if (userId) {
            try {
                const resultDoc = new Result({
                    user: userId,
                    title: quiz.title,
                    technology: quiz.technology,
                    level: quiz.level,
                    totalQuestions,
                    correct,
                    wrong,
                    score
                });
                await resultDoc.save();
            } catch (saveError) {
                console.error('Error saving result:', saveError);
            }
        }

        res.status(200).json({ 
            success: true, 
            results: {
                quizTitle: quiz.title,
                technology: quiz.technology,
                level: quiz.level,
                totalQuestions,
                correct,
                wrong,
                score,
                detailedResults: results
            }
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting quiz', 
            error: error.message 
        });
    }
};

// Update quiz
export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const quiz = await Quiz.findByIdAndUpdate(id, updates, { 
            new: true, 
            runValidators: true 
        });

        if (!quiz) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quiz not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Quiz updated successfully', 
            quiz 
        });

    } catch (error) {
        console.error('Update quiz error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating quiz', 
            error: error.message 
        });
    }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findByIdAndDelete(id);

        if (!quiz) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quiz not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Quiz deleted successfully' 
        });

    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting quiz', 
            error: error.message 
        });
    }
};
