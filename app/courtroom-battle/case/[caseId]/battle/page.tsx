"use client"

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Scale, 
  ArrowLeft, 
  Clock, 
  Gavel,
  User,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCaseById } from '@/data/sample-cases';

type BattleRound = 'opening' | 'evidence' | 'cross-examination' | 'closing';
type PlayerRole = 'defense' | 'prosecution';

interface BattleState {
  currentRound: BattleRound;
  score: number; // -100 to 100, negative favors prosecution, positive favors defense
  timeRemaining: number;
  gandhiArgument: string;
  playerOptions: string[];
  roundHistory: Array<{
    round: BattleRound;
    gandhiArgument: string;
    playerResponse: string;
    scoreChange: number;
  }>;
}

const roundNames = {
  opening: 'Opening Statements',
  evidence: 'Evidence Presentation',
  'cross-examination': 'Cross-Examination',
  closing: 'Closing Arguments'
};

const gandhiArguments = {
  opening: {
    prosecution: "Your Honor, the evidence will clearly show that the defendant committed this heinous crime. We have physical evidence, witness testimony, and a clear motive. Justice demands accountability.",
    defense: "Your Honor, the prosecution's case is built on circumstantial evidence and assumptions. We will demonstrate that reasonable doubt exists and my client is innocent of these charges."
  },
  evidence: {
    prosecution: "The murder weapon bears the defendant's fingerprints, and security footage places them at the scene during the time of death. This is not coincidence, but proof of guilt.",
    defense: "The evidence is circumstantial at best. Fingerprints on a kitchen knife in someone's own home? Security footage showing a visit? None of this proves murder beyond reasonable doubt."
  },
  'cross-examination': {
    prosecution: "The witness clearly stated they heard arguing and then silence. The defendant had motive - a $5,000 debt dispute. When confronted with evidence, they have no alibi.",
    defense: "The witness testimony is inconsistent and based on assumptions. A debt dispute doesn't equal murder, and being present doesn't prove guilt. Where is the concrete evidence?"
  },
  closing: {
    prosecution: "Ladies and gentlemen, we have presented overwhelming evidence. The defendant had motive, means, and opportunity. The evidence speaks for itself - guilty beyond reasonable doubt.",
    defense: "The prosecution has failed to prove guilt beyond reasonable doubt. Circumstantial evidence and speculation cannot convict an innocent person. You must find my client not guilty."
  }
};

const responseOptions = {
  opening: {
    prosecution: [
      "Challenge the defense's claim of innocence with concrete evidence",
      "Emphasize the strength of physical evidence and witness testimony",
      "Appeal to the jury's sense of justice and community safety",
      "Outline the clear timeline and motive for the crime"
    ],
    defense: [
      "Point out the lack of direct evidence linking client to the crime",
      "Emphasize the burden of proof lies with the prosecution",
      "Suggest alternative theories that create reasonable doubt",
      "Highlight inconsistencies in the prosecution's timeline"
    ]
  },
  evidence: {
    prosecution: [
      "Present the forensic analysis of the murder weapon",
      "Show the security footage timeline to establish presence",
      "Introduce the text messages showing motive",
      "Call the medical examiner to testify about cause of death"
    ],
    defense: [
      "Question the chain of custody for the murder weapon",
      "Challenge the reliability of the security camera timestamp",
      "Argue that text messages show frustration, not murderous intent",
      "Request independent forensic analysis of the evidence"
    ]
  },
  'cross-examination': {
    prosecution: [
      "Press the neighbor about what exactly they heard",
      "Question the defendant about their whereabouts that evening",
      "Confront the defendant with the evidence against them",
      "Ask about the nature of their relationship with the victim"
    ],
    defense: [
      "Challenge the neighbor's ability to accurately identify sounds",
      "Question the detective about potential evidence contamination",
      "Cross-examine the victim's sister about her bias",
      "Challenge the medical examiner's timeline conclusions"
    ]
  },
  closing: {
    prosecution: [
      "Summarize all evidence pointing to defendant's guilt",
      "Appeal to jury's duty to deliver justice for the victim",
      "Address each defense argument with counter-evidence",
      "Emphasize that all evidence points to one conclusion"
    ],
    defense: [
      "Highlight all the reasonable doubts raised during trial",
      "Remind jury of the high burden of proof required",
      "Point out the lack of direct evidence or witnesses to the crime",
      "Appeal to presumption of innocence and constitutional rights"
    ]
  }
};

export default function BattlePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const playerRole = (searchParams.get('role') || 'defense') as PlayerRole;
  
  const caseData = getCaseById(caseId);
  
  const [battleState, setBattleState] = useState<BattleState>({
    currentRound: 'opening',
    score: 0,
    timeRemaining: 2700, // 45 minutes in seconds
    gandhiArgument: gandhiArguments.opening[playerRole === 'defense' ? 'prosecution' : 'defense'],
    playerOptions: responseOptions.opening[playerRole],
    roundHistory: []
  });

  const [showGandhiSpeech, setShowGandhiSpeech] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setBattleState(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score > 20) return 'bg-green-500';
    if (score > 0) return 'bg-green-300';
    if (score < -20) return 'bg-red-500';
    if (score < 0) return 'bg-red-300';
    return 'bg-gray-400';
  };

  const getScorePosition = (score: number) => {
    // Convert score (-100 to 100) to percentage (0 to 100)
    return Math.max(0, Math.min(100, 50 + (score / 2)));
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleSubmitResponse = () => {
    if (selectedOption === null) return;

    const selectedResponse = battleState.playerOptions[selectedOption];
    const scoreChange = Math.floor(Math.random() * 21) - 10; // Random score change between -10 and +10

    // Add to history
    const newHistory = [...battleState.roundHistory, {
      round: battleState.currentRound,
      gandhiArgument: battleState.gandhiArgument,
      playerResponse: selectedResponse,
      scoreChange
    }];

    // Determine next round
    const rounds: BattleRound[] = ['opening', 'evidence', 'cross-examination', 'closing'];
    const currentIndex = rounds.indexOf(battleState.currentRound);
    const nextRound = currentIndex < rounds.length - 1 ? rounds[currentIndex + 1] : 'closing';

    // Update battle state
    setBattleState(prev => ({
      ...prev,
      currentRound: nextRound,
      score: prev.score + scoreChange,
      gandhiArgument: gandhiArguments[nextRound][playerRole === 'defense' ? 'prosecution' : 'defense'],
      playerOptions: responseOptions[nextRound][playerRole],
      roundHistory: newHistory
    }));

    setSelectedOption(null);
    setShowGandhiSpeech(true);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Case Not Found</h1>
          <Link href="/courtroom-battle">
            <Button className="bg-amber-600 hover:bg-amber-700">Back to Courtroom Battle</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/courtroom-battle/case-briefing/${caseId}`} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Briefing</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(battleState.timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Scale className="w-8 h-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-800">{caseData.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Status Bar */}
      <div className="bg-white border-b border-amber-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Current Round:</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {roundNames[battleState.currentRound]}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Playing as: <span className="font-medium capitalize text-amber-600">{playerRole}</span>
            </div>
          </div>
          
          {/* Score Meter */}
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Prosecution Favor</span>
              <span>Neutral</span>
              <span>Defense Favor</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-gray-100 to-green-200"></div>
              <div 
                className={`absolute top-0 w-4 h-4 rounded-full ${getScoreColor(battleState.score)} border-2 border-white shadow-md transition-all duration-500`}
                style={{ left: `calc(${getScorePosition(battleState.score)}% - 8px)` }}
              ></div>
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-gray-500">
                Score: {battleState.score > 0 ? '+' : ''}{battleState.score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Interface */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          
          {/* Left Panel - Player Arguments/Options */}
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Your Response</h3>
            </div>
            
            {showGandhiSpeech ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Gandhi is presenting their argument...</p>
                <Button 
                  onClick={() => setShowGandhiSpeech(false)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  View Response Options
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Choose your response strategy:</p>
                {battleState.playerOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                  </button>
                ))}
                
                {selectedOption !== null && (
                  <Button 
                    onClick={handleSubmitResponse}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Submit Response
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Center Panel - Judge's Bench */}
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <Gavel className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Judge's Bench</h3>
              <p className="text-gray-600 mb-6">Presiding over the case</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Case Progress</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(roundNames).map(([round, name]) => (
                    <div key={round} className={`flex items-center gap-2 ${
                      battleState.currentRound === round ? 'text-amber-600 font-medium' : 
                      battleState.roundHistory.some(h => h.round === round) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        battleState.currentRound === round ? 'bg-amber-600' :
                        battleState.roundHistory.some(h => h.round === round) ? 'bg-green-600' : 'bg-gray-300'
                      }`}></div>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Gandhi Avatar (Opposition) */}
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                {playerRole === 'defense' ? 'Prosecution' : 'Defense'} (Gandhi)
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Gandhi's Avatar Placeholder */}
              <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full mx-auto flex items-center justify-center">
                <User className="w-16 h-16 text-amber-600" />
              </div>
              
              {/* Gandhi's Speech Bubble */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 border-l border-t border-gray-200 transform rotate-45"></div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {battleState.gandhiArgument}
                  </p>
                </div>
              </div>
              
              {/* Gandhi Status */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  showGandhiSpeech ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    showGandhiSpeech ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  {showGandhiSpeech ? 'Speaking' : 'Waiting'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}