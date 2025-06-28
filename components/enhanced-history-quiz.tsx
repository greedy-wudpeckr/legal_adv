"use client"

import { useState, useEffect, useRef } from 'react';
import { 
  Clock, Trophy, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, 
  Zap, Target, Award, Users, TrendingUp, Gift, HelpCircle, Timer,
  Sparkles, Crown, Medal, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion, QuizResult, UserStats, Lifeline, XP_REWARDS } from '@/types/quiz';
import { getUserStats, saveUserStats, addLeaderboardEntry, checkAchievements, calculateLevel, getXPForNextLevel } from '@/lib/quiz-storage';
import ConfettiAnimation from '@/components/confetti-animation';

interface EnhancedHistoryQuizProps {
  onBack?: () => void;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  questions?: QuizQuestion[];
}

const sampleQuestions: Record<string, QuizQuestion[]> = {
  'constitutional-law': [
    {
      id: 'cl1',
      type: 'text',
      question: 'Who is known as the "Father of the Indian Constitution"?',
      options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
      correctAnswer: 1,
      explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution for his pivotal role as the Chairman of the Drafting Committee.',
      difficulty: 'beginner',
      category: 'constitutional-law',
      points: 10
    },
    {
      id: 'cl2',
      type: 'text',
      question: 'Which Article of the Indian Constitution deals with the Right to Equality?',
      options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
      correctAnswer: 1,
      explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons within the territory of India.',
      difficulty: 'intermediate',
      category: 'constitutional-law',
      points: 15
    },
    {
      id: 'cl3',
      type: 'scenario',
      question: 'The Doctrine of Basic Structure was established in which landmark case?',
      options: ['Golaknath Case', 'Kesavananda Bharati Case', 'Minerva Mills Case', 'Maneka Gandhi Case'],
      correctAnswer: 1,
      explanation: 'The Kesavananda Bharati v. State of Kerala (1973) case established the Doctrine of Basic Structure, limiting Parliament\'s power to amend the Constitution.',
      difficulty: 'expert',
      category: 'constitutional-law',
      points: 25
    }
  ],
  'freedom-struggle': [
    {
      id: 'fs1',
      type: 'text',
      question: 'The Quit India Movement was launched in which year?',
      options: ['1940', '1942', '1944', '1946'],
      correctAnswer: 1,
      explanation: 'The Quit India Movement was launched on August 8, 1942, by Mahatma Gandhi, demanding an end to British rule in India.',
      difficulty: 'beginner',
      category: 'freedom-struggle',
      points: 10
    },
    {
      id: 'fs2',
      type: 'scenario',
      question: 'Who gave the famous slogan "Give me blood, and I will give you freedom"?',
      options: ['Mahatma Gandhi', 'Subhas Chandra Bose', 'Bhagat Singh', 'Chandrashekhar Azad'],
      correctAnswer: 1,
      explanation: 'Subhas Chandra Bose gave this famous slogan while leading the Indian National Army (Azad Hind Fauj) during World War II.',
      difficulty: 'intermediate',
      category: 'freedom-struggle',
      points: 15
    }
  ]
};

export default function EnhancedHistoryQuiz({ onBack, category, difficulty, questions }: EnhancedHistoryQuizProps) {
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [userStats, setUserStats] = useState<UserStats>(getUserStats());
  const [streakCount, setStreakCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [xpEarned, setXpEarned] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [lifelines, setLifelines] = useState<Lifeline[]>([
    { id: 'fifty-fifty', name: '50-50', description: 'Remove two wrong answers', icon: '🎯', used: false, cost: 50 },
    { id: 'ask-expert', name: 'Ask Expert', description: 'Get advice from a historical figure', icon: '🎓', used: false, cost: 75 },
    { id: 'extra-time', name: 'Extra Time', description: 'Add 15 seconds to the timer', icon: '⏰', used: false, cost: 25 }
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quizQuestions = questions || sampleQuestions[category] || sampleQuestions['constitutional-law'];
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !showExplanation) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, showExplanation, currentQuestionIndex]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      handleAnswerSubmit(-1);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null && !showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleAnswerSubmit = (answerIndex: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    let pointsEarned = 0;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreakCount(prev => prev + 1);
      
      // Calculate points with multiplier
      const basePoints = XP_REWARDS[difficulty].base;
      const streakBonus = streakCount >= 3 ? XP_REWARDS[difficulty].streak : 0;
      pointsEarned = (basePoints + streakBonus) * comboMultiplier;
      
      setXpEarned(prev => prev + pointsEarned);
      
      // Increase combo multiplier
      if (streakCount >= 3) {
        setComboMultiplier(prev => Math.min(prev + 0.5, 3));
      }
    } else {
      setStreakCount(0);
      setComboMultiplier(1);
    }

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent,
      pointsEarned
    };

    setResults(prev => [...prev, result]);
    setShowExplanation(true);

    // Auto-advance after showing explanation
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishQuiz();
      }
    }, 3000);
  };

  const finishQuiz = () => {
    const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
    const accuracy = finalScore / quizQuestions.length;
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;

    // Update user stats
    const updatedStats = { ...userStats };
    updatedStats.totalGames += 1;
    updatedStats.totalXP += xpEarned;
    updatedStats.level = calculateLevel(updatedStats.totalXP);
    updatedStats.accuracyRate = ((updatedStats.accuracyRate * (updatedStats.totalGames - 1)) + accuracy) / updatedStats.totalGames;
    updatedStats.bestStreak = Math.max(updatedStats.bestStreak, streakCount);
    updatedStats.categoriesPlayed[category] = (updatedStats.categoriesPlayed[category] || 0) + 1;
    updatedStats.difficultyStats[difficulty].played += 1;
    
    if (accuracy >= 0.7) {
      updatedStats.difficultyStats[difficulty].won += 1;
    }

    // Check for achievements
    const achievements = checkAchievements(updatedStats, {
      score: finalScore,
      totalQuestions: quizQuestions.length,
      category,
      difficulty,
      averageTime,
      streak: streakCount
    });

    updatedStats.achievements.push(...achievements);
    setNewAchievements(achievements);

    // Add to leaderboard
    addLeaderboardEntry({
      playerName: 'Player',
      score: finalScore,
      xp: xpEarned,
      level: updatedStats.level,
      accuracy: accuracy * 100,
      category,
      difficulty,
      completedAt: new Date()
    });

    saveUserStats(updatedStats);
    setUserStats(updatedStats);

    // Show confetti for high scores
    if (accuracy >= 0.8 || achievements.length > 0) {
      setShowConfetti(true);
    }

    setGameState('finished');
  };

  const useLifeline = (lifelineId: string) => {
    const lifeline = lifelines.find(l => l.id === lifelineId);
    if (!lifeline || lifeline.used || userStats.totalXP < lifeline.cost) return;

    setLifelines(prev => prev.map(l => 
      l.id === lifelineId ? { ...l, used: true } : l
    ));

    // Deduct XP cost
    const updatedStats = { ...userStats, totalXP: userStats.totalXP - lifeline.cost };
    setUserStats(updatedStats);
    saveUserStats(updatedStats);

    switch (lifelineId) {
      case 'fifty-fifty':
        // Remove two wrong answers (implementation would modify question display)
        break;
      case 'ask-expert':
        // Show expert advice (implementation would show modal with hint)
        break;
      case 'extra-time':
        setTimeLeft(prev => prev + 15);
        break;
    }
  };

  const resetGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setScore(0);
    setResults([]);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
    setStreakCount(0);
    setComboMultiplier(1);
    setXpEarned(0);
    setShowConfetti(false);
    setNewAchievements([]);
    setLifelines(prev => prev.map(l => ({ ...l, used: false })));
  };

  const getScorePercentage = () => {
    return Math.round((score / quizQuestions.length) * 100);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <ConfettiAnimation isVisible={showConfetti} onComplete={() => setShowConfetti(false)} />
        
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Trophy className="w-16 h-16 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Quiz Complete!</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg text-gray-600">Level {userStats.level}</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-blue-800">Correct</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{getScorePercentage()}%</div>
                <div className="text-sm text-green-800">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">+{xpEarned}</div>
                <div className="text-sm text-purple-800">XP Earned</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600">{streakCount}</div>
                <div className="text-sm text-orange-800">Best Streak</div>
              </div>
            </div>

            {/* New Achievements */}
            {newAchievements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🎉 New Achievements!</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {newAchievements.map((achievement) => (
                    <div key={achievement.id} className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold text-gray-800">{achievement.name}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              {onBack && (
                <Button onClick={onBack} variant="outline" className="border-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </Button>
              )}
            </div>
          </div>

          {/* User Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Level {userStats.level}</span>
                  <span>{userStats.totalXP} / {getXPForNextLevel(userStats.level)} XP</span>
                </div>
                <Progress 
                  value={((userStats.totalXP % getXPForNextLevel(userStats.level)) / getXPForNextLevel(userStats.level)) * 100} 
                  className="h-3 mb-4" 
                />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Games:</span>
                    <span className="font-medium">{userStats.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Accuracy:</span>
                    <span className="font-medium">{(userStats.accuracyRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak:</span>
                    <span className="font-medium">{userStats.bestStreak}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Achievements ({userStats.achievements.length})</h3>
                <div className="grid grid-cols-4 gap-2">
                  {userStats.achievements.slice(0, 8).map((achievement) => (
                    <div key={achievement.id} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg">{achievement.icon}</div>
                      <div className="text-xs text-gray-600 truncate">{achievement.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button onClick={onBack} variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">History Quiz</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                  <span>•</span>
                  <span>{category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">+{xpEarned}</div>
                <div className="text-xs text-gray-600">XP</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{streakCount}</div>
                <div className="text-xs text-gray-600">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{score}/{quizQuestions.length}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-3" />
          </div>

          {/* Lifelines */}
          <div className="flex gap-2 justify-center">
            {lifelines.map((lifeline) => (
              <Button
                key={lifeline.id}
                onClick={() => useLifeline(lifeline.id)}
                disabled={lifeline.used || userStats.totalXP < lifeline.cost}
                variant="outline"
                size="sm"
                className={`${lifeline.used ? 'opacity-50' : ''}`}
                title={`${lifeline.description} (${lifeline.cost} XP)`}
              >
                <span className="mr-1">{lifeline.icon}</span>
                {lifeline.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {comboMultiplier > 1 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  {comboMultiplier}x Combo!
                </div>
              )}
              {streakCount >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <Target className="w-4 h-4" />
                  {streakCount} Streak!
                </div>
              )}
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid gap-4 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105";
              
              if (showExplanation) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass += " border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += " border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswer === index) {
                buttonClass += " border-blue-500 bg-blue-50 text-blue-800";
              } else {
                buttonClass += " border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base">{option}</span>
                    {showExplanation && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                    {showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!showExplanation && (
            <div className="text-center">
              <Button
                onClick={() => handleAnswerSubmit(selectedAnswer || -1)}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
              <p className="text-blue-700 leading-relaxed">{currentQuestion.explanation}</p>
              
              {selectedAnswer === currentQuestion.correctAnswer && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">
                      Correct! +{XP_REWARDS[difficulty].base * comboMultiplier} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-center">
            <div className="flex gap-2 flex-wrap">
              {quizQuestions.map((_, index) => {
                let dotClass = "w-3 h-3 rounded-full transition-all duration-200";
                
                if (index < currentQuestionIndex) {
                  const result = results[index];
                  dotClass += result?.isCorrect ? " bg-green-500" : " bg-red-500";
                } else if (index === currentQuestionIndex) {
                  dotClass += " bg-blue-500 scale-125";
                } else {
                  dotClass += " bg-gray-300";
                }
                
                return <div key={index} className={dotClass} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}