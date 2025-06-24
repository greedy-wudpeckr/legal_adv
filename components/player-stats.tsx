"use client"

import { useState, useEffect } from 'react';
import { Trophy, Star, Target, Clock, TrendingUp, Award, Lock, Unlock } from 'lucide-react';
import { getPlayerStats, getWinRate, getAccuracyRate } from '@/lib/progression';
import { PlayerStats, Achievement, getXPForNextLevel } from '@/types/progression';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PlayerStatsProps {
  onClose?: () => void;
}

export default function PlayerStatsComponent({ onClose }: PlayerStatsProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements'>('overview');

  useEffect(() => {
    setStats(getPlayerStats());
  }, []);

  if (!stats) return null;

  const winRate = getWinRate(stats);
  const accuracyRate = getAccuracyRate(stats);
  const nextLevelXP = getXPForNextLevel(stats.level);
  const currentLevelProgress = nextLevelXP > 0 ? ((stats.totalXP % nextLevelXP) / nextLevelXP) * 100 : 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Player Profile</h2>
                <div className="flex items-center gap-2">
                  <span className="text-lg">Level {stats.level}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(stats.level, 5) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                ✕
              </Button>
            )}
          </div>
          
          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>XP: {stats.totalXP.toLocaleString()}</span>
              <span>Next Level: {nextLevelXP > 0 ? nextLevelXP.toLocaleString() : 'Max Level'}</span>
            </div>
            <Progress value={currentLevelProgress} className="h-3 bg-white/20" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'overview'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('achievements')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedTab === 'achievements'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Achievements ({stats.achievements.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {selectedTab === 'overview' ? (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{stats.casesWon}</div>
                  <div className="text-sm text-green-600">Cases Won</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{winRate.toFixed(1)}%</div>
                  <div className="text-sm text-blue-600">Win Rate</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-800">{accuracyRate.toFixed(1)}%</div>
                  <div className="text-sm text-purple-600">Accuracy</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-800">{stats.currentWinStreak}</div>
                  <div className="text-sm text-orange-600">Win Streak</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Case Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cases Played:</span>
                      <span className="font-medium">{stats.totalCasesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cases Lost:</span>
                      <span className="font-medium">{stats.casesLost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Win Streak:</span>
                      <span className="font-medium">{stats.bestWinStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score:</span>
                      <span className="font-medium">{stats.averageScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fastest Win:</span>
                      <span className="font-medium">
                        {stats.fastestWin === Infinity ? 'N/A' : `${Math.floor(stats.fastestWin / 60)}:${(stats.fastestWin % 60).toString().padStart(2, '0')}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Choice Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Perfect Choices:</span>
                      <span className="font-medium">{stats.perfectChoices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Choices:</span>
                      <span className="font-medium">{stats.totalChoices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Choice Accuracy:</span>
                      <span className="font-medium">{accuracyRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Choice Accuracy Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Perfect Choices</span>
                      <span>{stats.perfectChoices}/{stats.totalChoices}</span>
                    </div>
                    <Progress value={accuracyRate} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Unlocked Content */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Unlocked Content</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty Levels</h4>
                    <div className="space-y-1">
                      {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                        <div key={difficulty} className="flex items-center gap-2 text-sm">
                          {stats.unlockedDifficulties.includes(difficulty as any) ? (
                            <Unlock className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={stats.unlockedDifficulties.includes(difficulty as any) ? 'text-gray-800' : 'text-gray-400'}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cases Available</h4>
                    <div className="text-sm text-gray-600">
                      {stats.unlockedCases.length} of 5 cases unlocked
                    </div>
                    <Progress value={(stats.unlockedCases.length / 5) * 100} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievement Gallery</h3>
                <p className="text-gray-600">Unlock achievements by mastering different aspects of legal advocacy</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isUnlocked = stats.achievements.some(a => a.id === achievement.id);
                  const unlockedAchievement = stats.achievements.find(a => a.id === achievement.id);
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isUnlocked
                          ? 'border-amber-300 bg-amber-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${isUnlocked ? 'text-amber-600' : 'text-gray-400'}`}>
                              +{achievement.xpReward} XP
                            </span>
                            {isUnlocked && unlockedAchievement && (
                              <span className="text-xs text-gray-500">
                                {unlockedAchievement.unlockedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}