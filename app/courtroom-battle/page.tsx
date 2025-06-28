"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Gavel, Play, Star, Clock, Target, TrendingUp, Trophy, Lock, Unlock, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sampleCases, getCaseStats } from '@/data/sample-cases';
import { getPlayerStats } from '@/lib/progression';
import { PlayerStats } from '@/types/progression';
import PlayerStatsComponent from '@/components/player-stats';
import QuickFactsCard from '@/components/ui/quick-facts-card';
import SettingsPanel from '@/components/ui/settings-panel';
import HelpOverlay from '@/components/ui/help-overlay';
import { Layout } from '@/components/layout/Layout';

const caseCategories = [
  { id: 'murder', name: 'Murder', description: 'Homicide and related charges', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'theft', name: 'Theft', description: 'Property crimes and burglary', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'fraud', name: 'Fraud', description: 'Financial crimes and deception', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { id: 'assault', name: 'Assault', description: 'Physical violence and battery', color: 'bg-purple-100 border-purple-300 text-purple-800' },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Clear evidence, straightforward cases', color: 'bg-green-100 border-green-300 text-green-800', icon: '⭐' },
  { id: 'intermediate', name: 'Intermediate', description: 'Complex motives, conflicting evidence', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', icon: '⭐⭐' },
  { id: 'advanced', name: 'Advanced', description: 'Sophisticated crimes, circumstantial evidence', color: 'bg-red-100 border-red-300 text-red-800', icon: '⭐⭐⭐' },
];

const helpSections = [
  {
    title: 'Getting Started',
    content: 'Learn the basics of courtroom battles and how to navigate the interface.',
    steps: [
      'Choose a case from the available options',
      'Review the case briefing and evidence',
      'Select your role as defense or prosecution',
      'Enter the courtroom and make strategic choices'
    ]
  },
  {
    title: 'Case Strategy',
    content: 'Master the art of legal strategy and courtroom tactics.',
    steps: [
      'Analyze evidence carefully for strengths and weaknesses',
      'Consider the timing of your arguments',
      'Adapt your strategy based on Gandhi\'s responses',
      'Use hints wisely to improve your performance'
    ]
  },
  {
    title: 'Scoring System',
    content: 'Understand how your performance is evaluated and scored.',
    steps: [
      'Perfect choices earn maximum points',
      'Good choices earn moderate points',
      'Weak choices may lose points',
      'Bad choices significantly hurt your score'
    ]
  }
];

export default function CourtroomBattle() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setPlayerStats(getPlayerStats());
  }, []);

  const availableCases = sampleCases.filter(caseItem => {
    const categoryMatch = selectedCategory ? caseItem.category === selectedCategory : true;
    const difficultyMatch = selectedDifficulty ? caseItem.difficulty === selectedDifficulty : true;
    const isUnlocked = playerStats?.unlockedCases.includes(caseItem.caseId) ?? false;
    const isDifficultyUnlocked = playerStats?.unlockedDifficulties.includes(caseItem.difficulty as any) ?? false;
    
    return categoryMatch && difficultyMatch && isUnlocked && isDifficultyUnlocked;
  });

  const stats = getCaseStats();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 border-green-300';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'advanced': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '⭐';
      case 'intermediate': return '⭐⭐';
      case 'advanced': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  const isCaseUnlocked = (caseId: string) => {
    return playerStats?.unlockedCases.includes(caseId) ?? false;
  };

  const isDifficultyUnlocked = (difficulty: string) => {
    return playerStats?.unlockedDifficulties.includes(difficulty as any) ?? false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gavel className="w-12 h-12 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-800">Courtroom Battle</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Master legal advocacy through realistic courtroom simulations with increasing difficulty
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              onClick={() => setShowStatsModal(true)}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              onClick={() => setShowSettings(true)}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              onClick={() => setShowHelp(true)}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
          
          {/* Player Progress Summary */}
          {playerStats && (
            <QuickFactsCard
              title="Your Progress"
              facts={[
                { label: 'Current Level', value: `Level ${playerStats.level}`, icon: Trophy },
                { label: 'Cases Won', value: playerStats.casesWon.toString(), icon: Star },
                { label: 'Win Streak', value: playerStats.currentWinStreak.toString(), icon: TrendingUp },
                { label: 'Accuracy', value: `${Math.round((playerStats.perfectChoices / Math.max(playerStats.totalChoices, 1)) * 100)}%`, icon: Target }
              ]}
              theme="amber"
              className="max-w-md mx-auto mb-6"
            />
          )}
          
          {/* Case Statistics */}
          <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-amber-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Cases</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-green-600">{stats.byDifficulty.beginner}</div>
              <div className="text-sm text-gray-600">Beginner</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-yellow-600">{stats.byDifficulty.intermediate}</div>
              <div className="text-sm text-gray-600">Intermediate</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-red-600">{stats.byDifficulty.advanced}</div>
              <div className="text-sm text-gray-600">Advanced</div>
            </div>
          </div>
        </div>

          {/* Difficulty Filter */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-amber-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Choose Difficulty Level</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {difficultyLevels.map((level) => {
                const isUnlocked = isDifficultyUnlocked(level.id);
                return (
                  <div
                    key={level.id}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      !isUnlocked 
                        ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                        : selectedDifficulty === level.id 
                          ? `${level.color} shadow-md scale-105 cursor-pointer` 
                          : 'bg-gray-50 border-gray-200 hover:border-amber-300 cursor-pointer hover:shadow-md'
                    }`}
                    onClick={() => isUnlocked && setSelectedDifficulty(selectedDifficulty === level.id ? null : level.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-semibold">{level.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{level.icon}</span>
                        {!isUnlocked && <Lock className="w-5 h-5 text-gray-500" />}
                        {isUnlocked && <Unlock className="w-5 h-5 text-green-600" />}
                      </div>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{level.description}</p>
                    <div className="text-xs font-medium">
                      {stats.byDifficulty[level.id as keyof typeof stats.byDifficulty]} cases available
                    </div>
                    {!isUnlocked && (
                      <div className="mt-2 text-xs text-gray-500">
                        {level.id === 'intermediate' ? 'Win 1 case to unlock' : 'Win 3 cases to unlock'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDifficulty && (
              <div className="text-center">
                <Button 
                  onClick={() => setSelectedDifficulty(null)}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Show All Difficulties
                </Button>
              </div>
            )}
          </div>

          {/* Case Categories */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-amber-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Case Categories</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {caseCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedCategory === category.id 
                      ? `${category.color} shadow-md scale-105` 
                      : 'bg-gray-50 border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-semibold">{category.name}</h4>
                    <Scale className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm opacity-80 mb-2">{category.description}</p>
                  <div className="text-xs font-medium">
                    {stats.byCategory[category.id as keyof typeof stats.byCategory]} cases
                  </div>
                </div>
              ))}
            </div>

            {selectedCategory && (
              <div className="text-center">
                <Button 
                  onClick={() => setSelectedCategory(null)}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Show All Categories
                </Button>
              </div>
            )}
          </div>

          {/* Available Cases */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {selectedCategory || selectedDifficulty ? 'Filtered Cases' : 'Available Cases'}
              <span className="text-lg text-gray-500 ml-2">({availableCases.length})</span>
            </h3>
            
            <div className="space-y-6">
              {sampleCases.map((caseItem) => {
                const isUnlocked = isCaseUnlocked(caseItem.caseId);
                const isDiffUnlocked = isDifficultyUnlocked(caseItem.difficulty);
                const isVisible = !selectedCategory || caseItem.category === selectedCategory;
                const isDiffVisible = !selectedDifficulty || caseItem.difficulty === selectedDifficulty;
                
                if (!isVisible || !isDiffVisible) return null;
                
                return (
                  <div key={caseItem.caseId} className={`border rounded-lg p-6 transition-shadow ${
                    isUnlocked && isDiffUnlocked 
                      ? 'border-gray-200 hover:shadow-md' 
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold text-gray-800">{caseItem.title}</h4>
                          <span className="text-lg">{getDifficultyStars(caseItem.difficulty)}</span>
                          {!isUnlocked && <Lock className="w-5 h-5 text-gray-500" />}
                          {!isDiffUnlocked && <Lock className="w-5 h-5 text-red-500" />}
                        </div>
                        <p className="text-gray-600 mb-3">{caseItem.description}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(caseItem.difficulty)}`}>
                            {caseItem.difficulty.charAt(0).toUpperCase() + caseItem.difficulty.slice(1)}
                          </span>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{caseItem.timeLimit} minutes</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Target className="w-4 h-4" />
                            <span className="text-sm">{caseItem.pointsAvailable} points</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm capitalize">{caseItem.category}</span>
                          </div>
                        </div>
                      </div>
                      {isUnlocked && isDiffUnlocked ? (
                        <Link href={`/courtroom-battle/case-briefing/${caseItem.caseId}`}>
                          <Button className="bg-amber-600 hover:bg-amber-700 text-white ml-4">
                            <Play className="w-4 h-4 mr-2" />
                            Start Case
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="ml-4 opacity-50 cursor-not-allowed">
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      <div>
                        <strong>Evidence:</strong> {caseItem.evidenceList.length} pieces
                      </div>
                      <div>
                        <strong>Witnesses:</strong> {caseItem.witnesses.length} available
                      </div>
                      <div>
                        <strong>Complexity:</strong> {
                          caseItem.difficulty === 'beginner' ? 'Straightforward' :
                          caseItem.difficulty === 'intermediate' ? 'Moderate' :
                          'High'
                        }
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="mt-3 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-3">
                        🔒 Complete previous cases to unlock this case
                      </div>
                    )}
                    
                    {!isDiffUnlocked && (
                      <div className="mt-3 text-sm text-gray-500 bg-red-50 border border-red-200 rounded p-3">
                        🔒 {caseItem.difficulty === 'intermediate' ? 'Win 1 case' : 'Win 3 cases'} to unlock {caseItem.difficulty} difficulty
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {availableCases.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No unlocked cases match your current filters.</p>
                <p className="text-sm text-gray-500 mt-2">Complete more cases to unlock additional content.</p>
              </div>
            )}
          </div>

          {/* Learning Path Recommendation */}
          <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">📚 Recommended Learning Path</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Start:</strong> Easy cases to learn basics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span><strong>Progress:</strong> Medium cases for strategy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span><strong>Master:</strong> Hard cases for expertise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showStatsModal && (
          <PlayerStatsComponent onClose={() => setShowStatsModal(false)} />
        )}
        
        <SettingsPanel 
          isVisible={showSettings}
          onClose={() => setShowSettings(false)}
          theme="amber"
        />
        
        <HelpOverlay
          isVisible={showHelp}
          onClose={() => setShowHelp(false)}
          title="Courtroom Battle Help"
          sections={helpSections}
          theme="amber"
        />
      </div>
  );
}