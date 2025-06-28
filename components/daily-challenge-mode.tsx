"use client"

import { useState, useEffect } from 'react';
import { Calendar, Star, Trophy, Clock, Gift, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/types/quiz';

interface DailyChallengeProps {
  onStartChallenge: (questions: QuizQuestion[]) => void;
  onBack: () => void;
}

const historicalDates = {
  '01-26': { // January 26
    title: 'Republic Day Special',
    description: 'Constitution of India came into effect',
    questions: [
      {
        id: 'rd1',
        type: 'text' as const,
        question: 'On which date did the Constitution of India come into effect?',
        options: ['January 26, 1949', 'January 26, 1950', 'August 15, 1947', 'November 26, 1949'],
        correctAnswer: 1,
        explanation: 'The Constitution of India came into effect on January 26, 1950, which is why we celebrate Republic Day on this date.',
        difficulty: 'beginner' as const,
        category: 'constitutional-law' as const,
        points: 15
      }
    ]
  },
  '08-15': { // August 15
    title: 'Independence Day Special',
    description: 'India gained independence from British rule',
    questions: [
      {
        id: 'id1',
        type: 'text' as const,
        question: 'Who delivered the famous "Tryst with Destiny" speech on the eve of Independence?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Rajendra Prasad'],
        correctAnswer: 1,
        explanation: 'Jawaharlal Nehru delivered the iconic "Tryst with Destiny" speech to the Indian Constituent Assembly on the eve of Independence.',
        difficulty: 'intermediate' as const,
        category: 'freedom-struggle' as const,
        points: 20
      }
    ]
  },
  '10-02': { // October 2
    title: 'Gandhi Jayanti Special',
    description: 'Birth anniversary of Mahatma Gandhi',
    questions: [
      {
        id: 'gj1',
        type: 'scenario' as const,
        question: 'Which legal principle did Gandhi develop during his time in South Africa?',
        options: ['Ahimsa', 'Satyagraha', 'Swaraj', 'Sarvodaya'],
        correctAnswer: 1,
        explanation: 'Satyagraha, meaning "truth-force" or non-violent resistance, was developed by Gandhi during his legal practice in South Africa.',
        difficulty: 'intermediate' as const,
        category: 'freedom-struggle' as const,
        points: 20
      }
    ]
  }
};

export default function DailyChallengeMode({ onStartChallenge, onBack }: DailyChallengeProps) {
  const [todaysChallenge, setTodaysChallenge] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dateKey = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // Check if today has a special challenge
    const specialChallenge = historicalDates[dateKey as keyof typeof historicalDates];
    
    if (specialChallenge) {
      setTodaysChallenge(specialChallenge);
    } else {
      // Generate a random challenge for regular days
      setTodaysChallenge({
        title: 'Daily History Challenge',
        description: 'Test your knowledge with today\'s questions',
        questions: generateRandomQuestions()
      });
    }

    // Load streak and completion status
    const savedStreak = localStorage.getItem('daily_challenge_streak');
    const savedLastCompleted = localStorage.getItem('daily_challenge_last_completed');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastCompleted) {
      setLastCompleted(savedLastCompleted);
      setIsCompleted(savedLastCompleted === today.toDateString());
    }
  }, []);

  const generateRandomQuestions = (): QuizQuestion[] => {
    // This would typically fetch from a larger question bank
    return [
      {
        id: 'daily1',
        type: 'text',
        question: 'Which Article of the Constitution deals with the Right to Constitutional Remedies?',
        options: ['Article 30', 'Article 32', 'Article 35', 'Article 38'],
        correctAnswer: 1,
        explanation: 'Article 32 is known as the "Heart and Soul" of the Constitution as it provides the Right to Constitutional Remedies.',
        difficulty: 'intermediate',
        category: 'constitutional-law',
        points: 20
      }
    ];
  };

  const handleStartChallenge = () => {
    if (todaysChallenge && !isCompleted) {
      onStartChallenge(todaysChallenge.questions);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Daily Challenge</h1>
          </div>
          <p className="text-lg text-gray-600">{formatDate(new Date())}</p>
        </div>

        {/* Streak Counter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-3xl font-bold text-orange-600">{streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Gift className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-3xl font-bold text-purple-600">2x</div>
                <div className="text-sm text-gray-600">XP Bonus</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Complete daily challenges to maintain your streak and earn bonus XP!
          </p>
        </div>

        {/* Today's Challenge */}
        {todaysChallenge && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{todaysChallenge.title}</h2>
              <p className="text-gray-600">{todaysChallenge.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-800">Special Theme</div>
                <div className="text-sm text-blue-600">Historical significance</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-800">Bonus Rewards</div>
                <div className="text-sm text-green-600">Double XP + Achievements</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-purple-800">Limited Time</div>
                <div className="text-sm text-purple-600">Available for 24 hours</div>
              </div>
            </div>

            <div className="text-center">
              {isCompleted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold">Challenge Completed!</span>
                  </div>
                  <p className="text-gray-600">Come back tomorrow for a new challenge</p>
                  <Button onClick={onBack} variant="outline">
                    Back to Quiz Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleStartChallenge}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                  >
                    Start Today's Challenge
                  </Button>
                  <p className="text-sm text-gray-500">
                    Complete within 24 hours to maintain your streak
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Challenge History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Challenge History</h3>
          <div className="space-y-3">
            {[...Array(7)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              const isToday = index === 0;
              const isCompleted = index <= 3; // Mock completion data
              
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isToday ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`${isToday ? 'font-semibold text-purple-800' : 'text-gray-700'}`}>
                      {date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      {isToday && ' (Today)'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {isCompleted ? (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    ) : (
                      <span className="text-gray-400">Not completed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}