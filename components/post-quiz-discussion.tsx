"use client"

import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HistoricalFigureHost from '@/components/historical-figure-host';

interface PostQuizDiscussionProps {
  figureId: string;
  category: string;
  quizScore: number;
  totalQuestions: number;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'figure';
  timestamp: Date;
}

export default function PostQuizDiscussion({ 
  figureId, 
  category, 
  quizScore, 
  totalQuestions,
  onBack 
}: PostQuizDiscussionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial message based on quiz performance
    const accuracy = (quizScore / totalQuestions) * 100;
    let initialMessage = '';
    
    if (accuracy >= 80) {
      initialMessage = `Impressive performance on the ${category.replace('-', ' ')} quiz! You answered ${quizScore} out of ${totalQuestions} questions correctly. Is there anything specific about this topic you'd like to explore further?`;
    } else if (accuracy >= 60) {
      initialMessage = `Good effort on the ${category.replace('-', ' ')} quiz! You answered ${quizScore} out of ${totalQuestions} questions correctly. Which aspects would you like to understand better?`;
    } else {
      initialMessage = `Thank you for taking the ${category.replace('-', ' ')} quiz. You answered ${quizScore} out of ${totalQuestions} questions correctly. Let's discuss the areas where you might need more clarity.`;
    }

    setMessages([{
      id: '1',
      text: initialMessage,
      sender: 'figure',
      timestamp: new Date()
    }]);
  }, [figureId, category, quizScore, totalQuestions]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call to get response
      // In a real implementation, this would call the same API as the chat component
      setTimeout(() => {
        const figureResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateResponse(currentInput, figureId, category),
          sender: 'figure',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, figureResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateResponse = (input: string, figureId: string, category: string): string => {
    // This is a simple mock response generator
    // In a real implementation, this would be replaced with an API call
    
    const responses = [
      `That's an excellent question about ${category.replace('-', ' ')}. During my time, I observed that understanding the historical context is crucial for grasping legal concepts.`,
      `I'm glad you asked about that. The development of ${category.replace('-', ' ')} was a complex process that involved many stakeholders and competing interests.`,
      `Your curiosity is commendable. When we were drafting the Constitution, we had extensive debates about these very issues you're asking about.`,
      `This is a topic I devoted considerable attention to. The principles underlying ${category.replace('-', ' ')} are fundamental to understanding India's legal framework.`,
      `I would encourage you to explore this topic further. The quiz only scratches the surface of the rich history and complexity of ${category.replace('-', ' ')}.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Post-Quiz Discussion</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Quiz Score: {quizScore}/{totalQuestions}
            </div>
          </div>
        </div>

        {/* Historical Figure */}
        <div className="mb-6">
          <HistoricalFigureHost 
            figureId={figureId}
            category={category}
            message=""
          />
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask a question about the quiz topics..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Suggested Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              `Can you explain more about the key principles of ${category.replace('-', ' ')}?`,
              `What were the major challenges in developing ${category.replace('-', ' ')}?`,
              `How has ${category.replace('-', ' ')} evolved over time?`,
              `What are some common misconceptions about ${category.replace('-', ' ')}?`,
              `How does ${category.replace('-', ' ')} impact modern India?`
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}