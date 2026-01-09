import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    technology: '',
    level: 'basic',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  const technologies = [
    'html', 'css', 'js', 'react', 'node', 
    'mongodb', 'java', 'python', 'cpp', 'bootstrap', 
    'chemistry', 'physics', 'biology', 'mathematics', 'other'
  ];

  const levels = ['basic', 'intermediate', 'advanced'];

  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({ ...prev, [name]: value.toLowerCase() }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestion = (e) => {
    e?.preventDefault(); // Prevent form submission if inside a form
    
    console.log('Adding question...', currentQuestion);
    
    if (!currentQuestion.question.trim()) {
      toast.error('Question text is required');
      return;
    }

    const validOptions = currentQuestion.options.filter(opt => opt && opt.trim());
    console.log('Valid options:', validOptions);
    
    if (validOptions.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }

    if (!currentQuestion.correctAnswer.trim()) {
      toast.error('Correct answer is required');
      return;
    }

    if (!validOptions.includes(currentQuestion.correctAnswer.trim())) {
      toast.error('Correct answer must be one of the options exactly');
      console.log('Mismatch - Correct answer:', currentQuestion.correctAnswer);
      console.log('Available options:', validOptions);
      return;
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: currentQuestion.question.trim(),
        options: validOptions,
        correctAnswer: currentQuestion.correctAnswer.trim(),
        explanation: currentQuestion.explanation.trim()
      }]
    }));

    // Reset current question
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: ''
    });

    toast.success('Question added!');
    console.log('Question added successfully');
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    toast.info('Question removed');
  };

  const saveQuiz = async () => {
    if (!quizData.title.trim()) {
      toast.error('Quiz title is required');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:4000/api/quizzes',
        quizData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Quiz created successfully!');
        // Reset form
        setQuizData({
          title: '',
          technology: 'html',
          level: 'basic',
          questions: []
        });
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Quiz</h1>

        {/* Quiz Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizInfoChange}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology/Subject *
                </label>
                <input
                  type="text"
                  name="technology"
                  value={quizData.technology}
                  onChange={handleQuizInfoChange}
                  placeholder="e.g., Chemistry, HTML, Python"
                  list="tech-suggestions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="tech-suggestions">
                  {technologies.map(tech => (
                    <option key={tech} value={tech} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={quizData.level}
                  onChange={handleQuizInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Add Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Question</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter your question"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options * (At least 2 required)
              </label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {currentQuestion.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus size={18} /> Add Option
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
              </label>
              <input
                type="text"
                name="correctAnswer"
                value={currentQuestion.correctAnswer}
                onChange={handleQuestionChange}
                placeholder="Enter the correct answer (must match one of the options exactly)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                name="explanation"
                value={currentQuestion.explanation}
                onChange={handleQuestionChange}
                placeholder="Add an explanation for the answer"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-semibold"
            >
              <Plus size={20} /> Add Question to Quiz
            </button>
          </div>
        </div>

        {/* Questions List */}
        {quizData.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Questions ({quizData.questions.length})
            </h2>
            
            <div className="space-y-4">
              {quizData.questions.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="ml-4 space-y-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`text-sm ${
                          opt === q.correctAnswer
                            ? 'text-green-600 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        • {opt} {opt === q.correctAnswer && '✓'}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-2 ml-4 text-sm text-gray-500 italic">
                      Explanation: {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Quiz Button */}
        {quizData.questions.length > 0 && (
          <button
            type="button"
            onClick={saveQuiz}
            className="w-full px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
          >
            <Save size={24} /> Save Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
