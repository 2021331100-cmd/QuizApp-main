import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, selectedTech]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:4000/api/leaderboard/global';
      
      if (activeTab === 'technology' && selectedTech) {
        url = `http://localhost:4000/api/leaderboard/technology/${selectedTech}`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        setLeaderboardData(response.data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Award className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Star className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-600 font-semibold">{index + 1}</span>;
  };

  const getRankBackground = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (index === 2) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'global'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Global Rankings
            </button>
            <button
              onClick={() => setActiveTab('technology')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'technology'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Technology
            </button>
          </div>

          {/* Technology Selector */}
          {activeTab === 'technology' && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter technology (e.g., chemistry, html, python)"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value.toLowerCase())}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No leaderboard data available yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry._id}
                className={`rounded-lg border-2 p-4 transition-all hover:shadow-lg ${getRankBackground(index)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{entry.name}</h3>
                      <p className="text-gray-600 text-sm">{entry.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{entry.totalScore}</div>
                    <div className="text-sm text-gray-600">
                      {entry.totalQuizzes} quizzes | Avg: {entry.avgScore}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
