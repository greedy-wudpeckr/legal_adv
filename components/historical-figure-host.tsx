"use client"

import { useState, useEffect } from 'react';
import { Crown, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoricalFigureHostProps {
  figureId: string;
  category: string;
  onIntroComplete?: () => void;
  message?: string;
  isLifeline?: boolean;
}

const historicalFigures = {
  'gandhi': {
    name: 'Mahatma Gandhi',
    avatar: '👨‍⚖️',
    specialty: 'Constitutional Law & Civil Rights',
    introMessage: 'Namaste! I am Mohandas Gandhi. Through my journey of satyagraha and civil disobedience, I learned much about law and justice. Let me guide you through the constitutional principles that shape our great nation.',
    lifelineAdvice: {
      'constitutional-law': 'Remember, beta, the Constitution is like satyagraha - it must be based on truth and non-violence. Look for the answer that protects the rights of all people equally.',
      'freedom-struggle': 'During our struggle, we learned that true freedom comes through understanding our rights. The answer often lies in what gives power to the people, not the rulers.',
      'legal-reforms': 'Every reform I supported was for the upliftment of the oppressed. Choose the option that serves justice for the common man.',
      'famous-cases': 'In my legal practice, I learned that the strongest case is built on truth and moral foundation. Look for the answer rooted in justice.'
    }
  },
  'ambedkar': {
    name: 'Dr. B.R. Ambedkar',
    avatar: '👨‍🎓',
    specialty: 'Constitutional Law & Social Justice',
    introMessage: 'Jai Bhim! I am Dr. Bhimrao Ambedkar, the principal architect of our Constitution. Through years of struggle against discrimination, I crafted a document that ensures equality for all. Let us explore the constitutional framework together.',
    lifelineAdvice: {
      'constitutional-law': 'The Constitution I drafted ensures equality and justice for all. Look for the answer that upholds fundamental rights and protects the marginalized.',
      'freedom-struggle': 'My fight was not just for political freedom, but for social justice. The correct answer usually promotes equality and human dignity.',
      'legal-reforms': 'Every legal reform should aim to create a just society. Choose the option that breaks barriers and promotes inclusion.',
      'famous-cases': 'Constitutional cases often revolve around protecting individual rights against state power. Look for the answer that strengthens democracy.'
    }
  },
  'nehru': {
    name: 'Pandit Jawaharlal Nehru',
    avatar: '🎩',
    specialty: 'Constitutional Development & Governance',
    introMessage: 'Greetings, young scholar! I am Jawaharlal Nehru, first Prime Minister of independent India. Having witnessed the birth of our republic, I can guide you through the constitutional and legal foundations of modern India.',
    lifelineAdvice: {
      'constitutional-law': 'The Constitution reflects our tryst with destiny. Look for answers that embody the spirit of democracy, secularism, and socialism.',
      'freedom-struggle': 'Our struggle taught us the value of unity in diversity. The right answer often reflects our composite culture and inclusive vision.',
      'legal-reforms': 'Progress requires bold reforms while respecting our traditions. Choose the option that balances modernity with our cultural values.',
      'famous-cases': 'Landmark cases shape the nation\'s future. Look for the answer that strengthens democratic institutions and rule of law.'
    }
  },
  'patel': {
    name: 'Sardar Vallabhbhai Patel',
    avatar: '🛡️',
    specialty: 'Administrative Law & National Integration',
    introMessage: 'Namaste! I am Vallabhbhai Patel, the Iron Man of India. My experience in uniting 562 princely states taught me about law, administration, and governance. Let me help you understand the legal framework that binds our nation.',
    lifelineAdvice: {
      'constitutional-law': 'A strong constitution needs strong implementation. Look for the answer that ensures effective governance and national unity.',
      'freedom-struggle': 'Unity was our greatest strength in the freedom struggle. The correct answer often emphasizes collective action and national integration.',
      'legal-reforms': 'Practical reforms that can be implemented effectively are the best. Choose the option that is both just and administratively feasible.',
      'famous-cases': 'Legal precedents must serve the nation\'s unity and progress. Look for the answer that strengthens the federal structure.'
    }
  }
};

export default function HistoricalFigureHost({ 
  figureId, 
  category, 
  onIntroComplete, 
  message, 
  isLifeline = false 
}: HistoricalFigureHostProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const figure = historicalFigures[figureId as keyof typeof historicalFigures] || historicalFigures.gandhi;

  useEffect(() => {
    setShowMessage(true);
    
    if (isLifeline && message) {
      setCurrentMessage(message);
    } else {
      const introMsg = figure.introMessage;
      setCurrentMessage(introMsg);
    }

    // Auto-complete intro after animation
    if (!isLifeline && onIntroComplete) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onIntroComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [figureId, category, isLifeline, message, onIntroComplete]);

  const getLifelineAdvice = () => {
    return figure.lifelineAdvice[category as keyof typeof figure.lifelineAdvice] || 
           "Trust your knowledge and think carefully about the principles of justice and truth.";
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 border-amber-200 p-6 ${isAnimating ? 'animate-fade-in-up' : ''}`}>
      {/* Figure Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center text-3xl">
          {figure.avatar}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{figure.name}</h3>
          <p className="text-sm text-gray-600">{figure.specialty}</p>
          {isLifeline && (
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-yellow-600 font-medium">Expert Advice</span>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">
              {isLifeline ? getLifelineAdvice() : currentMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isLifeline && onIntroComplete && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setIsAnimating(false);
              onIntroComplete();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Begin Quiz
          </Button>
        </div>
      )}

      {isLifeline && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Advice from {figure.name} • Use this wisdom to guide your answer
          </p>
        </div>
      )}
    </div>
  );
}