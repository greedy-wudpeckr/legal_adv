"use client"

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Crown,
  Calendar,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Canvas } from '@react-three/fiber';
import { historicalFigures } from '@/data/historical-data';
import { HistoricalFigure } from '@/types/history';
import HistoricalAvatar from '@/components/historical-avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'figure';
  timestamp: Date;
}

export default function ChatWithFigurePage() {
  const params = useParams();
  const router = useRouter();
  const figureId = params.figureId as string;
  
  const [figure, setFigure] = useState<HistoricalFigure | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const foundFigure = historicalFigures.find(f => f.id === figureId);
    if (foundFigure) {
      setFigure(foundFigure);
      // Add welcome message
      setMessages([{
        id: '1',
        text: `Greetings! I am ${foundFigure.name}. I have witnessed the rise and fall of empires, and I'm here to share my experiences with you. What would you like to know about my time?`,
        sender: 'figure',
        timestamp: new Date()
      }]);
    }
  }, [figureId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !figure || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        `In my time, such matters were handled with great wisdom and consideration for the people's welfare.`,
        `I remember when similar challenges arose during my reign. The key was always to balance justice with compassion.`,
        `That reminds me of an incident from my court. Let me share what I learned from that experience.`,
        `Your question touches upon the very essence of leadership. In my era, we believed that...`,
        `Ah, this brings back memories of the great debates in my council. The wise men would say...`
      ];

      const figureResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'figure',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, figureResponse]);
      
      if (audioEnabled) {
        setIsSpeaking(true);
        // Simulate speech duration
        setTimeout(() => setIsSpeaking(false), 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    if (figure) {
      setMessages([{
        id: '1',
        text: `Greetings! I am ${figure.name}. I have witnessed the rise and fall of empires, and I'm here to share my experiences with you. What would you like to know about my time?`,
        sender: 'figure',
        timestamp: new Date()
      }]);
    }
  };

  if (!figure) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Historical Figure...</h1>
          <Link href="/apni-history/explore">
            <Button variant="outline" className="border-gray-300">
              Back to Figures
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/apni-history/explore" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Figures</span>
            </Link>
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-xl font-bold text-black">{figure.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{figure.timeRange}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="border-gray-300"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetConversation}
                className="border-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* 3D Avatar Section */}
        <div className="w-1/3 bg-gradient-to-br from-gray-50 to-white border-r border-gray-200 flex flex-col">
          {/* Avatar Display */}
          <div className="flex-1 relative">
            <Canvas camera={{ position: [0, 1.5, 3] }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[2, 2, 5]} intensity={0.8} />
              <pointLight position={[-2, 2, 2]} intensity={0.5} />
              <HistoricalAvatar figureId={figure.id} speaking={isSpeaking} />
            </Canvas>
            
            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Speaking...
              </div>
            )}
          </div>

          {/* Figure Info Panel */}
          <div className="p-6 bg-white border-t border-gray-200">
            <h3 className="font-bold text-black mb-2">{figure.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{figure.significance}</p>
            
            {/* Quick Facts */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{figure.timeRange}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BookOpen className="w-3 h-3" />
                <span>{figure.achievements.length} major achievements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 shadow-sm px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                type="text"
                placeholder={`Ask ${figure.name} about their life and times...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 border-gray-300 focus:border-black focus:ring-black"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-black hover:bg-gray-800 text-white px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Suggested Questions */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "What was your greatest achievement?",
                  "Tell me about your daily life",
                  "What challenges did you face?",
                  "What advice would you give to modern leaders?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}