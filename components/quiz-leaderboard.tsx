"use client"

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Target, Calendar } from 'lucide-react';
import { getLeaderboard } from '@/lib/quiz-storage';
import { LeaderboardEntry } from '@/types/quiz';

interface QuizLeaderboardProps {
  category?: string;
  difficulty?: string;
}

export default function QuizLeaderboard({ category, difficulty }: QuizLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    let entries = getLeaderboard();
    
    // Filter by category and difficulty if specified
    if (category) {
      entries = entries.filter(entry => entry.category === category);
    }
    if (difficulty) {
      entries = entries.filter(entry => entry.difficulty === difficulty);
    }

    // Filter by time period
    const now = new Date();
    if (filter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      entries = entries.filter(entry => entry.completedAt >= today);
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      entries = entries.filter(entry => entry.completedAt >= weekAgo);
    }

    setLeaderboard(entries.slice(0, 10));
  }, [category, difficulty, filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Trophy className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        
        <div className="flex gap-2">
          {['all', 'today', 'week'].map((period) => (
            <button
              key={period}
              onClick={() => setFilter(period as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No entries yet</h3>
          <p className="text-gray-500">Be the first to make it onto the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                index < 3
                  ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(index + 1)}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {entry.playerName}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Level {entry.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(entry.difficulty)}`}>
                    {entry.difficulty}
                  </span>
                  <span>{entry.category.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{entry.score}</div>
                  <div className="text-gray-500">Score</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-green-600">{entry.accuracy.toFixed(1)}%</div>
                  <div className="text-gray-500">Accuracy</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-purple-600">+{entry.xp}</div>
                  <div className="text-gray-500">XP</div>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500 text-right">
                <Calendar className="w-3 h-3 inline mr-1" />
                {entry.completedAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}