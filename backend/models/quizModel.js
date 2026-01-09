import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        trim: true
    }
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    technology: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    level: {
        type: String,
        required: true,
        enum: ["basic", "intermediate", "advanced"]
    },
    questions: [QuestionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    participants: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', QuizSchema);

export default Quiz;
