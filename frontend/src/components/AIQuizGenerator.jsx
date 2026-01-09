import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AIQuizGenerator = ({ onQuestionsGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    numQuestions: 5,
    difficulty: 'intermediate',
    topic: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateFromText = async () => {
    if (!formData.text || formData.text.trim().length < 50) {
      toast.error('Please provide at least 50 characters of text');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/ai/generate-from-text', {
        text: formData.text,
        numQuestions: parseInt(formData.numQuestions),
        difficulty: formData.difficulty,
        topic: formData.topic
      });

      if (response.data.success) {
        toast.success(response.data.message);
        onQuestionsGenerated(response.data.questions);
        setFormData({ ...formData, text: '' });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI Quiz Generator</h2>
      </div>
        <button
          type="button"
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'pdf'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Upload className="w-5 h-5" />
          From PDF
        </button>
      </div>

      {/* Common Settings */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            name="numQuestions"
            value={formData.numQuestions}
            onChange={handleInputChange}
            min="1"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic (Optional)
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            placeholder="e.g., Chemistry, React"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Your Notes or Text
          </label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Paste your study notes, article, or any educational text here. The AI will generate quiz questions based on this content..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.text.length} characters (minimum 50 required)
          </p>
        </div>
        <button
          type="button"
          onClick={generateFromText}
          disabled={loading || formData.text.length < 50}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Questions...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Questions from Text
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> For best results, provide clear, well-structured content. The AI will analyze your input and create relevant multiple-choice questions with explanations.
        </p>
      </div>
    </div>
  );
};

export default AIQuizGenerator;
