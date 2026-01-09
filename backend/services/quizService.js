import Quiz from '../models/quizModel.js';
import Result from '../models/resultModel.js';
import validationService from './validationService.js';

// Quiz Service - Single Responsibility: Business logic for quizzes
class QuizService {
    async createQuiz(quizData, userId) {
        // Validation
        const quizValidation = validationService.validateQuizData(quizData);
        if (!quizValidation.isValid) {
            throw new Error(quizValidation.errors.join(', '));
        }

        const questionsValidation = validationService.validateQuestions(quizData.questions);
        if (!questionsValidation.isValid) {
            throw new Error(questionsValidation.errors.join(', '));
        }

        // Business logic
        const quiz = new Quiz({
            title: quizData.title,
            technology: quizData.technology,
            level: quizData.level,
            questions: quizData.questions,
            createdBy: userId || null
        });

        return await quiz.save();
    }

    async getAllQuizzes(filters = {}) {
        const { technology, level } = filters;
        
        let filter = { isActive: true };
        if (technology) filter.technology = technology;
        if (level) filter.level = level;

        return await Quiz.find(filter)
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });
    }

    async getQuizById(quizId, includeAnswers = false) {
        const selectFields = includeAnswers 
            ? '' 
            : '-questions.correctAnswer -questions.explanation';

        const quiz = await Quiz.findById(quizId).select(selectFields);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        return quiz;
    }

    async submitQuiz(quizId, answers, userId) {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        // Increment attempt counter
        quiz.totalAttempts += 1;
        await quiz.save();

        // Calculate results
        const results = this.calculateResults(quiz.questions, answers);
        
        // Save result if user is authenticated
        if (userId) {
            await this.saveUserResult(quiz, results, userId);
        }

        return {
            quizTitle: quiz.title,
            technology: quiz.technology,
            level: quiz.level,
            ...results
        };
    }

    calculateResults(questions, answers) {
        let correct = 0;
        let wrong = 0;
        const detailedResults = [];

        questions.forEach((question) => {
            const userAnswer = answers.find(a => a.questionId === question._id.toString());
            const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
            
            if (isCorrect) {
                correct++;
            } else {
                wrong++;
            }

            detailedResults.push({
                questionId: question._id,
                question: question.question,
                userAnswer: userAnswer?.selectedAnswer || 'Not answered',
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation
            });
        });

        const totalQuestions = questions.length;
        const score = Math.round((correct / totalQuestions) * 100);

        return {
            totalQuestions,
            correct,
            wrong,
            score,
            detailedResults
        };
    }

    async saveUserResult(quiz, results, userId) {
        const resultDoc = new Result({
            user: userId,
            title: quiz.title,
            technology: quiz.technology,
            level: quiz.level,
            totalQuestions: results.totalQuestions,
            correct: results.correct,
            wrong: results.wrong,
            score: results.score
        });

        return await resultDoc.save();
    }

    async updateQuiz(quizId, updateData, userId) {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        // Authorization check
        if (quiz.createdBy && quiz.createdBy.toString() !== userId.toString()) {
            throw new Error('Not authorized to update this quiz');
        }

        // Validate if questions are being updated
        if (updateData.questions) {
            const questionsValidation = validationService.validateQuestions(updateData.questions);
            if (!questionsValidation.isValid) {
                throw new Error(questionsValidation.errors.join(', '));
            }
        }

        Object.assign(quiz, updateData);
        return await quiz.save();
    }

    async deleteQuiz(quizId, userId) {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        // Authorization check
        if (quiz.createdBy && quiz.createdBy.toString() !== userId.toString()) {
            throw new Error('Not authorized to delete this quiz');
        }

        // Soft delete
        quiz.isActive = false;
        return await quiz.save();
    }

    async getQuizStats(quizId) {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        return {
            totalAttempts: quiz.totalAttempts,
            participants: quiz.participants,
            technology: quiz.technology,
            level: quiz.level,
            questionCount: quiz.questions.length
        };
    }
}

export default new QuizService();
