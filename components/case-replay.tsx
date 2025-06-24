"use client"

import { useState } from 'react';
import { RotateCcw, Play, Eye, ChevronRight, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReplayChoice {
  phase: string;
  choice: string;
  effectiveness: 'perfect' | 'good' | 'weak' | 'bad';
  scoreChange: number;
  explanation: string;
}

interface CaseReplayProps {
  caseTitle: string;
  choices: ReplayChoice[];
  finalScore: number;
  isVisible: boolean;
  onClose: () => void;
  onReplay: () => void;
}

export default function CaseReplay({ 
  caseTitle, 
  choices, 
  finalScore, 
  isVisible, 
  onClose, 
  onReplay 
}: CaseReplayProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const getEffectivenessIcon = (effectiveness: string) => {
    switch (effectiveness) {
      case 'perfect': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'weak': return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case 'bad': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'perfect': return 'border-green-500 bg-green-50 text-green-800';
      case 'good': return 'border-blue-500 bg-blue-50 text-blue-800';
      case 'weak': return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'bad': return 'border-red-500 bg-red-50 text-red-800';
    }
  };

  const phaseNames: Record<string, string> = {
    'opening-statements': 'Opening Statements',
    'evidence-presentation': 'Evidence Presentation',
    'witness-examination': 'Witness Cross-Examination',
    'closing-arguments': 'Closing Arguments'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Case Replay</h2>
                <p className="text-indigo-100">{caseTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{finalScore > 0 ? '+' : ''}{finalScore}</div>
                <div className="text-sm text-indigo-200">Final Score</div>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[70vh]">
          {/* Choice Timeline */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-4">Your Choices</h3>
            <div className="space-y-3">
              {choices.map((choice, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedChoice === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedChoice(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {phaseNames[choice.phase] || choice.phase}
                    </span>
                    {getEffectivenessIcon(choice.effectiveness)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${getEffectivenessColor(choice.effectiveness)}`}>
                      {choice.effectiveness}
                    </span>
                    <span className={`text-sm font-medium ${
                      choice.scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {choice.scoreChange > 0 ? '+' : ''}{choice.scoreChange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Choice Details */}
          <div className="flex-1 p-6">
            {selectedChoice !== null ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {phaseNames[choices[selectedChoice].phase] || choices[selectedChoice].phase}
                  </h3>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getEffectivenessColor(choices[selectedChoice].effectiveness)}`}>
                    {getEffectivenessIcon(choices[selectedChoice].effectiveness)}
                    <span className="font-medium capitalize">{choices[selectedChoice].effectiveness} Choice</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Your Strategy:</h4>
                  <p className="text-gray-700">{choices[selectedChoice].choice}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Analysis:</h4>
                  <p className="text-blue-700">{choices[selectedChoice].explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${
                      choices[selectedChoice].scoreChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {choices[selectedChoice].scoreChange > 0 ? '+' : ''}{choices[selectedChoice].scoreChange}
                    </div>
                    <div className="text-sm text-gray-600">Score Impact</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {selectedChoice + 1}/{choices.length}
                    </div>
                    <div className="text-sm text-gray-600">Phase Progress</div>
                  </div>
                </div>

                {/* Alternative Strategies */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">💡 What Could Have Been Better:</h4>
                  <div className="text-sm text-yellow-700">
                    {choices[selectedChoice].effectiveness === 'perfect' ? (
                      "This was the optimal choice for this phase. Well done!"
                    ) : choices[selectedChoice].effectiveness === 'good' ? (
                      "A solid choice, but consider more evidence-based arguments for perfect scores."
                    ) : choices[selectedChoice].effectiveness === 'weak' ? (
                      "This approach lacked strategic focus. Try to align your strategy with the phase objectives."
                    ) : (
                      "This strategy was counterproductive. Focus on legal fundamentals and appropriate timing."
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <ChevronRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Choice</h3>
                  <p className="text-gray-500">Click on any choice from the timeline to see detailed analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Review your choices to improve your legal strategy</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close Review
              </Button>
              <Button onClick={onReplay} className="bg-indigo-600 hover:bg-indigo-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Different Strategy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}