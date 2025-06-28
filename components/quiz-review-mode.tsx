"use client"

import { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizQuestion, QuizResult } from '@/types/quiz';

interface QuizReviewModeProps {
  questions: QuizQuestion[];
  results: QuizResult[];
  onBack: () => void;
  onRetakeQuiz: () => void;
}

export default function QuizReviewMode({ questions, results, onBack, onRetakeQuiz }: QuizReviewModeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentResult = results[currentQuestionIndex];

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnswerStatus = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const isSelected = optionIndex === currentResult.selectedAnswer;
    
    if (isCorrect && isSelected) return 'correct-selected';
    if (isCorrect) return 'correct';
    if (isSelected) return 'wrong-selected';
    return 'default';
  };

  const getAnswerClasses = (status: string) => {
    switch (status) {
      case 'correct-selected':
        return 'border-green-500 bg-green-50 text-green-800';
      case 'correct':
        return 'border-green-300 bg-green-25 text-green-700';
      case 'wrong-selected':
        return 'border-red-500 bg-red-50 text-red-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Quiz Review</h1>
              </div>
            </div>
            <Button onClick={onRetakeQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>

          {/* Progress */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Review Mode</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Review Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {currentQuestion.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <div className="flex items-center gap-1">
                {currentResult.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  currentResult.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentResult.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid gap-4 mb-6">
            {currentQuestion.options.map((option, index) => {
              const status = getAnswerStatus(index);
              const classes = getAnswerClasses(status);

              return (
                <div
                  key={index}
                  className={`w-full p-4 rounded-lg border-2 ${classes}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base flex-1">{option}</span>
                    <div className="flex items-center gap-2">
                      {index === currentQuestion.correctAnswer && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Correct Answer</span>
                        </div>
                      )}
                      {index === currentResult.selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Your Answer</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Detailed Explanation
            </h3>
            <p className="text-blue-700 leading-relaxed mb-4">{currentQuestion.explanation}</p>
            
            {/* Performance Stats */}
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-blue-200">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">{currentResult.timeSpent}s</div>
                <div className="text-sm text-blue-600">Time Taken</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">+{currentResult.pointsEarned}</div>
                <div className="text-sm text-blue-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${currentResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {currentResult.isCorrect ? '✓' : '✗'}
                </div>
                <div className="text-sm text-blue-600">Result</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {/* Question Dots */}
            <div className="flex gap-2">
              {questions.map((_, index) => {
                const result = results[index];
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white scale-110'
                        : result.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              variant="outline"
              className="border-gray-300"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Summary</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.isCorrect).length}
              </div>
              <div className="text-sm text-green-800">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => !r.isCorrect).length}
              </div>
              <div className="text-sm text-red-800">Incorrect Answers</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((results.filter(r => r.isCorrect).length / results.length) * 100)}%
              </div>
              <div className="text-sm text-blue-800">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {results.reduce((sum, r) => sum + r.pointsEarned, 0)}
              </div>
              <div className="text-sm text-purple-800">Total XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}