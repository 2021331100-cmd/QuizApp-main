import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key-here');

// Generate questions from text
export const generateQuestionsFromText = async (req, res) => {
    try {
        const { text, numQuestions = 5, difficulty = 'intermediate', topic } = req.body;

        if (!text || text.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Please provide sufficient text (at least 50 characters)'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert quiz generator. Based on the following text, generate ${numQuestions} multiple-choice questions.

TEXT:
${text}

REQUIREMENTS:
- Difficulty level: ${difficulty}
${topic ? `- Topic focus: ${topic}` : ''}
- Each question should have exactly 4 options
- Mark the correct answer clearly
- Provide a brief explanation for each answer
- Format the response as a valid JSON array

Return ONLY a JSON array in this exact format (no markdown, no extra text):
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 1",
    "explanation": "Brief explanation why this is correct"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let generatedText = response.text();

        // Clean up the response - remove markdown code blocks if present
        generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(generatedText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Generated text:', generatedText);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse AI response. Please try again.',
                rawResponse: generatedText
            });
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'AI did not generate valid questions. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            questions: questions.slice(0, numQuestions),
            message: `Generated ${Math.min(questions.length, numQuestions)} questions successfully`
        });

    } catch (error) {
        console.error('Generate questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating questions from text',
            error: error.message
        });
    }
};

// Generate questions from PDF
export const generateQuestionsFromPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }

        const { numQuestions = 5, difficulty = 'intermediate', topic } = req.body;

        // Parse PDF
        const pdfData = await pdfParse(req.file.buffer);
        const extractedText = pdfData.text;

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Could not extract sufficient text from PDF'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert quiz generator. Based on the following text extracted from a PDF document, generate ${numQuestions} multiple-choice questions.

TEXT:
${extractedText.substring(0, 10000)} 

REQUIREMENTS:
- Difficulty level: ${difficulty}
${topic ? `- Topic focus: ${topic}` : ''}
- Each question should have exactly 4 options
- Mark the correct answer clearly
- Provide a brief explanation for each answer
- Format the response as a valid JSON array

Return ONLY a JSON array in this exact format (no markdown, no extra text):
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 1",
    "explanation": "Brief explanation why this is correct"
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let generatedText = response.text();

        // Clean up the response
        generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(generatedText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse AI response. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            questions: questions.slice(0, numQuestions),
            extractedText: extractedText.substring(0, 500) + '...',
            message: `Generated ${Math.min(questions.length, numQuestions)} questions from PDF`
        });

    } catch (error) {
        console.error('Generate questions from PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating questions from PDF',
            error: error.message
        });
    }
};

// Generate explanations for existing questions
export const generateExplanations = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of questions'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const questionsWithExplanations = [];

        for (const q of questions) {
            if (!q.explanation || q.explanation.trim() === '') {
                const prompt = `Given this quiz question, provide a brief, clear explanation (2-3 sentences) for why the correct answer is right:

Question: ${q.question}
Options: ${q.options.join(', ')}
Correct Answer: ${q.correctAnswer}

Provide ONLY the explanation text, no additional formatting:`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const explanation = response.text().trim();

                questionsWithExplanations.push({
                    ...q,
                    explanation: explanation
                });
            } else {
                questionsWithExplanations.push(q);
            }
        }

        res.status(200).json({
            success: true,
            questions: questionsWithExplanations,
            message: 'Generated explanations successfully'
        });

    } catch (error) {
        console.error('Generate explanations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating explanations',
            error: error.message
        });
    }
};
