import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { BookOpen, Plus, List } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar/>
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Quiz App</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <BookOpen size={48} className="text-blue-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Browse Quizzes</h2>
                <p className="text-gray-600 mb-4">Explore available quizzes and test your knowledge</p>
                <button
                  onClick={() => navigate('/quizzes')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  View Quizzes
                </button>
              </div>

              {isLoggedIn && (
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                  <Plus size={48} className="text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Quiz</h2>
                  <p className="text-gray-600 mb-4">Create your own custom quiz for any topic</p>
                  <button
                    onClick={() => navigate('/create-quiz')}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    Create New
                  </button>
                </div>
              )}

              {isLoggedIn && (
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                  <List size={48} className="text-purple-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">My Results</h2>
                  <p className="text-gray-600 mb-4">View your quiz performance and history</p>
                  <button
                    onClick={() => navigate('/result')}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
                  >
                    View Results
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Browse or Create</h3>
                    <p className="text-gray-600">Choose from existing quizzes or create your own custom quiz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Take the Quiz</h3>
                    <p className="text-gray-600">Answer questions at your own pace and submit when ready</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Get Results</h3>
                    <p className="text-gray-600">See your score, correct answers, and detailed explanations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
