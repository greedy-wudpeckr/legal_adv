"use client"

import { useState, useEffect } from 'react';
import { Trophy, Clock, Target, Star, Medal, Crown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLeaderboard } from '@/lib/leaderboard';
import { Leaderboard, LeaderboardEntry, formatTime, getDifficultyMultiplier } from '@/types/leaderboard';

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LeaderboardComponent({ isVisible, onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<Leaderboard>({ fastestWins: [], highestScores: [], bestAccuracy: [] });
  const [selectedCategory, setSelectedCategory] = useState<'fastestWins' | 'highestScores' | 'bestAccuracy'>('fastestWins');

  useEffect(() => {
    if (isVisible) {
      setLeaderboard(getLeaderboard());
    }
  }, [isVisible]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categories = [
    { id: 'fastestWins', name: 'Fastest Wins', icon: Clock, description: 'Quickest case completions' },
    { id: 'highestScores', name: 'Highest Scores', icon: Trophy, description: 'Best jury favor scores' },
    { id: 'bestAccuracy', name: 'Best Accuracy', icon: Target, description: 'Most perfect choices' }
  ];

  if (!isVisible) return null;

  const currentEntries = leaderboard[selectedCategory];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <p className="text-purple-100">Top performers in courtroom battles</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`flex-1 px-6 py-4 text-center transition-colors ${
                    selectedCategory === category.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentEntries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Entries Yet</h3>
              <p className="text-gray-500">Be the first to make it onto the leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentEntries.map((entry, index) => (
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
                        {entry.playerName || 'Anonymous'}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{entry.caseName}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    {selectedCategory === 'fastestWins' && (
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{formatTime(entry.timeElapsed)}</div>
                        <div className="text-gray-500">Time</div>
                      </div>
                    )}
                    
                    {selectedCategory === 'highestScores' && (
                      <div className="text-center">
                        <div className="font-bold text-green-600">+{entry.score}</div>
                        <div className="text-gray-500">Score</div>
                      </div>
                    )}
                    
                    {selectedCategory === 'bestAccuracy' && (
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{(entry.accuracy * 100).toFixed(1)}%</div>
                        <div className="text-gray-500">Accuracy</div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="font-bold text-gray-700">{entry.score}</div>
                      <div className="text-gray-500">Score</div>
                    </div>

                    <div className="text-center">
                      <div className="font-bold text-gray-700">{(entry.accuracy * 100).toFixed(0)}%</div>
                      <div className="text-gray-500">Accuracy</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 text-right">
                    {entry.completedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            <p>Complete cases to earn your place on the leaderboard!</p>
            <p className="text-xs mt-1">Rankings are based on local performance data</p>
          </div>
        </div>
      </div>
    </div>
  );
}