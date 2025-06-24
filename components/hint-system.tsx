"use client"

import { useState } from 'react';
import { Lightbulb, Coins, X, BookOpen, Scale, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hint, PHASE_HINTS } from '@/types/hints';

interface HintSystemProps {
  currentPhase: string;
  onUseHint: (hint: Hint) => void;
  usedHints: string[];
  currentScore: number;
  isVisible: boolean;
  onClose: () => void;
}

export default function HintSystem({ 
  currentPhase, 
  onUseHint, 
  usedHints, 
  currentScore, 
  isVisible, 
  onClose 
}: HintSystemProps) {
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);
  
  const availableHints = PHASE_HINTS[currentPhase] || [];
  const unusedHints = availableHints.filter(hint => !usedHints.includes(hint.id));
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strategy': return <Target className="w-4 h-4" />;
      case 'evidence': return <BookOpen className="w-4 h-4" />;
      case 'legal': return <Scale className="w-4 h-4" />;
      case 'timing': return <Clock className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategy': return 'text-blue-600 bg-blue-100';
      case 'evidence': return 'text-green-600 bg-green-100';
      case 'legal': return 'text-purple-600 bg-purple-100';
      case 'timing': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Legal Strategy Hints</h2>
                <p className="text-yellow-100">Get expert guidance for this phase</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                <Coins className="w-4 h-4" />
                <span className="font-medium">{currentScore} points</span>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {unusedHints.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No More Hints Available</h3>
              <p className="text-gray-500">You've used all available hints for this phase.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Available Hints for {currentPhase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <p className="text-gray-600">Choose a hint to get strategic guidance (costs points)</p>
              </div>
              
              {unusedHints.map((hint) => (
                <div
                  key={hint.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedHint?.id === hint.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
                  }`}
                  onClick={() => setSelectedHint(hint)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(hint.category)}`}>
                        {getCategoryIcon(hint.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 capitalize">
                          {hint.category} Guidance
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Coins className="w-3 h-3" />
                          <span>{hint.cost} points</span>
                        </div>
                      </div>
                    </div>
                    {currentScore < hint.cost && (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                        Insufficient points
                      </span>
                    )}
                  </div>
                  
                  {selectedHint?.id === hint.id && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-gray-700 mb-4">{hint.text}</p>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => onUseHint(hint)}
                          disabled={currentScore < hint.cost}
                          className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          Use Hint (-{hint.cost} points)
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}