"use client"

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Trophy, Clock, Target, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HistoryQuizGame from '@/components/history-quiz-game';

const quizCategories = [
  {
    id: 'constitutional-law',
    title: 'Constitutional Law',
    description: 'Test your knowledge of Indian Constitution and fundamental rights',
    difficulty: 'Medium',
    questions: 10,
    timeLimit: '5 minutes',
    color: 'from-blue-500 to-indigo-600',
    icon: BookOpen
  },
  {
    id: 'ancient-history',
    title: 'Ancient India',
    description: 'Explore the rich heritage of ancient Indian civilization',
    difficulty: 'Easy',
    questions: 10,
    timeLimit: '5 minutes',
    color: 'from-amber-500 to-orange-600',
    icon: Star
  },
  {
    id: 'freedom-struggle',
    title: 'Freedom Struggle',
    description: 'Learn about India\'s fight for independence',
    difficulty: 'Hard',
    questions: 10,
    timeLimit: '5 minutes',
    color: 'from-green-500 to-emerald-600',
    icon: Trophy
  }
];

export default function QuizPage() {
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleStartQuiz = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setGameMode('playing');
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setSelectedCategory(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (gameMode === 'playing') {
    return <HistoryQuizGame onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/apni-history" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to History</span>
            </Link>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-black">History Quiz Challenge</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Test Your Knowledge
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              Challenge yourself with interactive quizzes covering Indian history, law, and constitutional principles
            </p>
            <p className="text-lg text-gray-600">
              From ancient civilizations to modern legal frameworks, discover how much you really know about India's rich heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Choose Your Challenge</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a quiz category to begin your learning journey. Each quiz is designed to test and expand your knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-8 h-8" />
                      <h4 className="text-xl font-bold">{category.title}</h4>
                    </div>
                    <p className="text-white/90">{category.description}</p>
                  </div>

                  {/* Category Details */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(category.difficulty)}`}>
                          {category.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Questions:</span>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-black">{category.questions}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time Limit:</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-black">{category.timeLimit}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartQuiz(category.id)}
                      className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-semibold py-3`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">Quiz Features</h3>
            <p className="text-lg text-gray-600">
              Experience interactive learning with our comprehensive quiz system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-black mb-2">Timed Challenges</h4>
              <p className="text-gray-600 text-sm">30-second timer for each question to test your quick thinking</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-black mb-2">Instant Feedback</h4>
              <p className="text-gray-600 text-sm">Get immediate explanations for correct and incorrect answers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-black mb-2">Score Tracking</h4>
              <p className="text-gray-600 text-sm">Track your progress and see detailed performance analytics</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-black mb-2">Multiple Formats</h4>
              <p className="text-gray-600 text-sm">Text, image, and scenario-based questions for varied learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with any quiz category and challenge yourself to learn more about India's fascinating history and legal heritage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleStartQuiz('constitutional-law')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Constitutional Law Quiz
            </Button>
            <Link href="/apni-history">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 font-semibold"
              >
                Explore More History
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}