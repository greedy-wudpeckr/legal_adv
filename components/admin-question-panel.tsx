"use client"

import { useState } from 'react';
import { Plus, Save, Trash2, Edit, BookOpen, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuizQuestion } from '@/types/quiz';

interface AdminQuestionPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AdminQuestionPanel({ isVisible, onClose }: AdminQuestionPanelProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'beginner' as const,
    category: 'constitutional-law' as const,
    type: 'text' as const,
    points: 10
  });

  const categories = [
    { id: 'constitutional-law', name: 'Constitutional Law' },
    { id: 'freedom-struggle', name: 'Freedom Struggle' },
    { id: 'legal-reforms', name: 'Legal Reforms' },
    { id: 'famous-cases', name: 'Famous Cases' }
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', points: 10 },
    { id: 'intermediate', name: 'Intermediate', points: 15 },
    { id: 'expert', name: 'Expert', points: 25 }
  ];

  const questionTypes = [
    { id: 'text', name: 'Text Question' },
    { id: 'scenario', name: 'Scenario Based' },
    { id: 'image', name: 'Image Based' }
  ];

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingQuestion(null);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'beginner',
      category: 'constitutional-law',
      type: 'text',
      points: 10
    });
  };

  const handleEdit = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsCreating(true);
    setFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      category: question.category,
      type: question.type,
      points: question.points
    });
  };

  const handleSave = () => {
    const newQuestion: QuizQuestion = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      ...formData
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions(prev => [...prev, newQuestion]);
    }

    // Save to localStorage (in a real app, this would be an API call)
    const existingQuestions = JSON.parse(localStorage.getItem('admin_questions') || '[]');
    const updatedQuestions = editingQuestion 
      ? existingQuestions.map((q: QuizQuestion) => q.id === editingQuestion.id ? newQuestion : q)
      : [...existingQuestions, newQuestion];
    
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));

    setIsCreating(false);
    setEditingQuestion(null);
  };

  const handleDelete = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    
    // Update localStorage
    const existingQuestions = JSON.parse(localStorage.getItem('admin_questions') || '[]');
    const updatedQuestions = existingQuestions.filter((q: QuizQuestion) => q.id !== questionId);
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const updateDifficulty = (difficulty: string) => {
    const difficultyData = difficulties.find(d => d.id === difficulty);
    setFormData(prev => ({ 
      ...prev, 
      difficulty: difficulty as any,
      points: difficultyData?.points || 10
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Question Management</h2>
                <p className="text-indigo-100">Add and manage quiz questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateNew}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Question
              </Button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Question List */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-4">Questions ({questions.length})</h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                        {question.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {question.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEdit(question)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isCreating ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingQuestion ? 'Edit Question' : 'Create New Question'}
                  </h3>
                  <Button
                    onClick={() => setIsCreating(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === index}
                          onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                          className="text-indigo-600"
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Explain why this is the correct answer..."
                  />
                </div>

                {/* Metadata */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => updateDifficulty(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {difficulties.map((diff) => (
                        <option key={diff.id} value={diff.id}>
                          {diff.name} ({diff.points} pts)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={!formData.question || !formData.explanation || formData.options.some(opt => !opt)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingQuestion ? 'Update Question' : 'Save Question'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Question Selected</h3>
                <p className="text-gray-500 mb-6">Select a question to edit or create a new one</p>
                <Button onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Question
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}