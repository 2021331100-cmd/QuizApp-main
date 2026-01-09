// Validation Service - Single Responsibility: Validation only
class ValidationService {
    validateQuizData(data) {
        const errors = [];
        const { title, technology, level, questions } = data;

        if (!title || typeof title !== 'string' || !title.trim()) {
            errors.push('Title is required and must be a valid string');
        }

        if (!technology || typeof technology !== 'string' || !technology.trim()) {
            errors.push('Technology is required and must be a valid string');
        }

        if (!level || !['basic', 'intermediate', 'advanced'].includes(level.toLowerCase())) {
            errors.push('Level must be one of: basic, intermediate, advanced');
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            errors.push('At least one question is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateQuestion(question, index) {
        const errors = [];

        if (!question.question || typeof question.question !== 'string' || !question.question.trim()) {
            errors.push(`Question ${index + 1}: Question text is required`);
        }

        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            errors.push(`Question ${index + 1}: At least 2 options are required`);
        }

        if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
            errors.push(`Question ${index + 1}: Correct answer is required`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateQuestions(questions) {
        const allErrors = [];

        questions.forEach((question, index) => {
            const validation = this.validateQuestion(question, index);
            if (!validation.isValid) {
                allErrors.push(...validation.errors);
            }
        });

        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    }

    validateUserRegistration(data) {
        const errors = [];
        const { name, email, password } = data;

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
            errors.push('Valid email is required');
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateUserLogin(data) {
        const errors = [];
        const { email, password } = data;

        if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
            errors.push('Valid email is required');
        }

        if (!password || typeof password !== 'string') {
            errors.push('Password is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateResultData(data) {
        const errors = [];
        const { title, technology, level, totalQuestions, correct } = data;

        if (!title || typeof title !== 'string' || !title.trim()) {
            errors.push('Title is required');
        }

        if (!technology || typeof technology !== 'string') {
            errors.push('Technology is required');
        }

        if (!level || typeof level !== 'string') {
            errors.push('Level is required');
        }

        if (totalQuestions === undefined || typeof totalQuestions !== 'number' || totalQuestions < 1) {
            errors.push('Total questions must be a positive number');
        }

        if (correct === undefined || typeof correct !== 'number' || correct < 0) {
            errors.push('Correct answers must be a non-negative number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export default new ValidationService();
