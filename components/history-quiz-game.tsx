"use client"

import { useState, useEffect, useRef } from 'react';
import { Clock, Trophy, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
  id: string;
  type: 'text' | 'image' | 'scenario';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

interface HistoryQuizGameProps {
  onBack?: () => void;
  questions?: QuizQuestion[];
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'text',
    question: 'Who is known as the "Father of the Indian Constitution"?',
    options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
    correctAnswer: 1,
    explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution for his pivotal role as the Chairman of the Drafting Committee.',
    difficulty: 'easy',
    category: 'Constitutional Law'
  },
  {
    id: 'q2',
    type: 'text',
    question: 'In which year was the Indian Constitution adopted?',
    options: ['1947', '1949', '1950', '1951'],
    correctAnswer: 1,
    explanation: 'The Indian Constitution was adopted on November 26, 1949, and came into effect on January 26, 1950.',
    difficulty: 'easy',
    category: 'Constitutional History'
  },
  {
    id: 'q3',
    type: 'scenario',
    question: 'Emperor Ashoka converted to Buddhism after witnessing the devastation of which war?',
    options: ['Battle of Hydaspes', 'Kalinga War', 'Battle of Panipat', 'Kurukshetra War'],
    correctAnswer: 1,
    explanation: 'The Kalinga War (c. 261 BCE) was so devastating that it led to Ashoka\'s conversion to Buddhism and his adoption of non-violence.',
    difficulty: 'medium',
    category: 'Ancient History'
  },
  {
    id: 'q4',
    type: 'text',
    question: 'Which Article of the Indian Constitution deals with the Right to Equality?',
    options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
    correctAnswer: 1,
    explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons within the territory of India.',
    difficulty: 'medium',
    category: 'Fundamental Rights'
  },
  {
    id: 'q5',
    type: 'scenario',
    question: 'The Quit India Movement was launched in which year, demanding immediate independence from British rule?',
    options: ['1940', '1942', '1944', '1946'],
    correctAnswer: 1,
    explanation: 'The Quit India Movement was launched on August 8, 1942, by Mahatma Gandhi, demanding an end to British rule in India.',
    difficulty: 'medium',
    category: 'Freedom Struggle'
  },
  {
    id: 'q6',
    type: 'text',
    question: 'Which Mughal emperor built the Taj Mahal?',
    options: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'],
    correctAnswer: 2,
    explanation: 'Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal between 1632 and 1653.',
    difficulty: 'easy',
    category: 'Medieval History'
  },
  {
    id: 'q7',
    type: 'text',
    question: 'The Indian National Congress was founded in which year?',
    options: ['1883', '1885', '1887', '1889'],
    correctAnswer: 1,
    explanation: 'The Indian National Congress was founded in 1885 by Allan Octavian Hume, becoming the principal leader of the Indian independence movement.',
    difficulty: 'medium',
    category: 'Political History'
  },
  {
    id: 'q8',
    type: 'scenario',
    question: 'Which ancient Indian text is considered the world\'s first treatise on political economy and statecraft?',
    options: ['Mahabharata', 'Arthashastra', 'Manusmriti', 'Ramayana'],
    correctAnswer: 1,
    explanation: 'The Arthashastra, written by Chanakya (Kautilya), is an ancient Indian treatise on statecraft, economic policy, and military strategy.',
    difficulty: 'hard',
    category: 'Ancient Literature'
  },
  {
    id: 'q9',
    type: 'text',
    question: 'Who was the first President of India?',
    options: ['Dr. Rajendra Prasad', 'Dr. S. Radhakrishnan', 'Dr. A.P.J. Abdul Kalam', 'Dr. Zakir Hussain'],
    correctAnswer: 0,
    explanation: 'Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.',
    difficulty: 'easy',
    category: 'Political History'
  },
  {
    id: 'q10',
    type: 'scenario',
    question: 'The Doctrine of Lapse was a policy introduced by which British Governor-General?',
    options: ['Lord Wellesley', 'Lord Dalhousie', 'Lord Cornwallis', 'Lord Hastings'],
    correctAnswer: 1,
    explanation: 'The Doctrine of Lapse was introduced by Lord Dalhousie, allowing the British to annex princely states if the ruler died without a natural heir.',
    difficulty: 'hard',
    category: 'Colonial History'
  }
];

export default function HistoryQuizGame({ onBack, questions = defaultQuestions }: HistoryQuizGameProps) {
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

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
      handleAnswerSubmit(-1); // -1 indicates no answer selected
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
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent
    };

    setResults(prev => [...prev, result]);
    setShowExplanation(true);

    // Auto-advance after showing explanation
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('finished');
      }
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('finished');
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
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const getScoreGrade = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Not Bad!' };
    return { grade: 'D', color: 'text-red-500', message: 'Keep Learning!' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (gameState === 'finished') {
    const { grade, color, message } = getScoreGrade();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${color}`} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <p className="text-xl text-gray-600 mb-4">{message}</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-blue-800">Correct Answers</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className={`text-3xl font-bold ${color}`}>{grade}</div>
                <div className="text-sm text-purple-800">Grade</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{getScorePercentage()}%</div>
                <div className="text-sm text-green-800">Accuracy</div>
              </div>
            </div>

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

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Review</h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const result = results[index];
                const isCorrect = result?.isCorrect;
                
                return (
                  <div key={question.id} className={`border rounded-lg p-4 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium text-gray-800">Question {index + 1}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{question.question}</p>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Correct Answer:</span> {question.options[question.correctAnswer]}
                        </div>
                        {result && result.selectedAnswer !== -1 && result.selectedAnswer !== question.correctAnswer && (
                          <div className="text-sm text-red-600">
                            <span className="font-medium">Your Answer:</span> {question.options[result.selectedAnswer]}
                          </div>
                        )}
                        {result && result.selectedAnswer === -1 && (
                          <div className="text-sm text-red-600">
                            <span className="font-medium">Your Answer:</span> No answer selected (time up)
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {result && `${result.timeSpent}s`}
                      </div>
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
              <h1 className="text-2xl font-bold text-gray-800">History Quiz</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">{score}/{questions.length}</span>
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
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-3" />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {currentQuestion.category}
              </span>
              {currentQuestion.type === 'scenario' && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Scenario
                </span>
              )}
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.imageUrl && (
              <div className="mt-4">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Question illustration" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
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
              
              <div className="mt-4 text-center">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-center">
            <div className="flex gap-2 flex-wrap">
              {questions.map((_, index) => {
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