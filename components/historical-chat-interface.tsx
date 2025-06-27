"use client"

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HistoricalFigure } from '@/types/history';
import HistoricalCaption from '@/components/historical-caption';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'figure';
  timestamp: Date;
}

interface HistoricalChatInterfaceProps {
  figure: HistoricalFigure;
  onSpeakingChange: (speaking: boolean) => void;
}

export default function HistoricalChatInterface({ figure, onSpeakingChange }: HistoricalChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showCaption, setShowCaption] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      text: `Greetings! I am ${figure.name}. I have witnessed the rise and fall of empires, and I'm here to share my experiences with you. What would you like to know about my time?`,
      sender: 'figure',
      timestamp: new Date()
    }]);
  }, [figure]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await fetch('/api/history/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: currentInput,
          figureId: figure.id 
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiData = await aiResponse.json();
      const responseText = aiData.text || "I apologize, but I cannot respond at this moment.";

      const figureResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'figure',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, figureResponse]);
      setCurrentResponse(responseText);

      // Generate and play audio if enabled
      if (audioEnabled) {
        try {
          const ttsResponse = await fetch('/api/history/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: responseText,
              figureId: figure.id
            }),
          });

          if (ttsResponse.ok) {
            const ttsData = await ttsResponse.json();
            const audio = new Audio(`data:audio/mpeg;base64,${ttsData.audio}`);
            
            setCurrentAudio(audio);
            setShowCaption(true);
            onSpeakingChange(true);

            audio.onended = () => {
              onSpeakingChange(false);
              setShowCaption(false);
              setCurrentAudio(null);
            };

            audio.onerror = () => {
              onSpeakingChange(false);
              setShowCaption(false);
              setCurrentAudio(null);
            };

            await audio.play();
          }
        } catch (audioError) {
          console.error('Audio generation failed:', audioError);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'figure',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const toggleAudio = () => {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      onSpeakingChange(false);
      setShowCaption(false);
    }
    setAudioEnabled(!audioEnabled);
  };

  const resetConversation = () => {
    if (currentAudio) {
      currentAudio.pause();
      onSpeakingChange(false);
      setShowCaption(false);
    }
    
    setMessages([{
      id: '1',
      text: `Greetings! I am ${figure.name}. I have witnessed the rise and fall of empires, and I'm here to share my experiences with you. What would you like to know about my time?`,
      sender: 'figure',
      timestamp: new Date()
    }]);
  };

  const suggestedQuestions = [
    "What was your greatest achievement?",
    "Tell me about your daily life",
    "What challenges did you face?",
    "How did you handle difficult decisions?",
    "What do you think about today's world?"
  ];

return (
  <div className="flex flex-col h-full bg-white">
    {/* Audio Controls - Fixed Height */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAudio}
          className="border-gray-300 hover:bg-gray-50"
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-black" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-500" />
          )}
          <span className="ml-2 text-sm">
            {audioEnabled ? 'Audio On' : 'Audio Off'}
          </span>
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={resetConversation}
        className="border-gray-300 hover:bg-gray-50 text-black"
      >
        Reset Chat
      </Button>
    </div>

    {/* Messages Area - Fixed Height with Scroll */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white min-h-0">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg transition-all duration-200 ${
              message.sender === 'user'
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-gray-200 text-black shadow-sm hover:shadow-md'
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
          <div className="bg-white border border-gray-200 text-black shadow-sm px-4 py-3 rounded-lg">
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

    {/* Input Area - Fixed Height */}
    <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0">
      <div className="flex gap-3 mb-4">
        <Input
          ref={inputRef}
          type="text"
          placeholder={`Ask ${figure.name} about their life and times...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 border-gray-300 focus:border-black focus:ring-black bg-white text-black placeholder-gray-500"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-black hover:bg-gray-800 text-white px-6 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {/* Suggested Questions */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors border border-gray-200"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Caption System */}
    <HistoricalCaption
      text={currentResponse}
      isVisible={showCaption}
      onComplete={() => setShowCaption(false)}
    />
  </div>
);
}