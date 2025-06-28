"use client"

import { useState, useEffect } from 'react';
import { User, Trophy, Target, Star, TrendingUp, Award, Calendar, Crown, Medal, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getUserStats, getXPForNextLevel } from '@/lib/quiz-storage';
import { UserStats } from '@/types/quiz';

interface UserProfileSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function UserProfileSection({ isVisible, onClose }: UserProfileSectionProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'categories'>('overview');

  useEffect(() => {
    if (isVisible) {
      setUserStats(getUserStats());
    }
  }, [isVisible]);

  if (!isVisible || !userStats) return null;

  const nextLevelXP = getXPForNextLevel(userStats.level);
  const currentLevelProgress = nextLevelXP > 0 ? ((userStats.totalXP % nextLevelXP) / nextLevelXP) * 100 : 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 text-gray-800';
      case 'rare': return 'border-blue-300 bg-blue-50 text-blue-800';
      case 'epic': return 'border-purple-300 bg-purple-50 text-purple-800';
      case 'legendary': return 'border-yellow-300 bg-yellow-50 text-yellow-800';
      default: return 'border-gray-300 bg-gray-50 text-gray-800';
    }
  };

  const getCategoryStats = () => {
    return Object.entries(userStats.categoriesPlayed).map(([category, count]) => ({
      category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / userStats.totalGames) * 100
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Player Profile</h2>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg">Level {userStats.level}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(userStats.level, 5) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>XP: {userStats.totalXP.toLocaleString()}</span>
              <span>Next Level: {nextLevelXP > 0 ? nextLevelXP.toLocaleString() : 'Max Level'}</span>
            </div>
            <Progress value={currentLevelProgress} className="h-3 bg-white/20" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'categories', label: 'Categories', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  selectedTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{userStats.totalGames}</div>
                  <div className="text-sm text-blue-600">Total Games</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{(userStats.accuracyRate * 100).toFixed(1)}%</div>
                  <div className="text-sm text-green-600">Accuracy Rate</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-800">{userStats.bestStreak}</div>
                  <div className="text-sm text-purple-600">Best Streak</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-800">{userStats.achievements.length}</div>
                  <div className="text-sm text-orange-600">Achievements</div>
                </div>
              </div>

              {/* Difficulty Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Difficulty Performance</h3>
                <div className="space-y-3">
                  {Object.entries(userStats.difficultyStats).map(([difficulty, stats]) => {
                    const winRate = stats.played > 0 ? (stats.won / stats.played) * 100 : 0;
                    return (
                      <div key={difficulty} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {stats.played} played, {stats.won} won
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          {winRate.toFixed(1)}% win rate
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Achievements</h3>
                {userStats.achievements.length === 0 ? (
                  <p className="text-gray-500 text-sm">No achievements yet. Keep playing to unlock them!</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {userStats.achievements.slice(-4).map((achievement) => (
                      <div key={achievement.id} className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-xs opacity-75">{achievement.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievement Gallery</h3>
                <p className="text-gray-600">Unlock achievements by mastering different aspects of history</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {userStats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`border rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-sm opacity-75 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Unlocked</span>
                          <span>{achievement.unlockedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {userStats.achievements.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No achievements yet</h3>
                  <p className="text-gray-500">Start playing quizzes to unlock achievements!</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'categories' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Category Performance</h3>
                <p className="text-gray-600">See how you perform across different quiz categories</p>
              </div>

              {/* Favorite Category */}
              {userStats.favoriteCategory && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Favorite Category</h4>
                  </div>
                  <p className="text-blue-700">
                    {userStats.favoriteCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              )}

              {/* Category Stats */}
              <div className="space-y-4">
                {getCategoryStats().map(({ category, count, percentage }) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{category}</h4>
                      <span className="text-sm text-gray-600">{count} games</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of total games
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(userStats.categoriesPlayed).length === 0 && (
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories played yet</h3>
                  <p className="text-gray-500">Start playing different quiz categories to see your performance!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}