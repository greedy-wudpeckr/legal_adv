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
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCaseById } from '@/data/sample-cases';

type BattleRound = 'opening' | 'evidence' | 'cross-examination' | 'closing';
type PlayerRole = 'defense' | 'prosecution';
type EffectivenessLevel = 'perfect' | 'good' | 'weak' | 'bad';

interface ResponseOption {
  text: string;
  effectiveness: EffectivenessLevel;
  scoreChange: number;
  explanation: string;
}

interface BattleState {
  currentRound: BattleRound;
  roundNumber: number;
  totalRounds: number;
  score: number;
  timeRemaining: number;
  choiceTimeRemaining: number;
  gandhiArgument: string;
  playerOptions: ResponseOption[];
  showGandhiSpeech: boolean;
  showResults: boolean;
  lastChoice: {
    option: ResponseOption;
    effectiveness: EffectivenessLevel;
    gandhiResponse: string;
    gandhiMood: 'confident' | 'worried' | 'neutral';
  } | null;
  gamePhase: 'gandhi-speaking' | 'player-choosing' | 'showing-results' | 'game-over';
  flashEffect: 'none' | 'green' | 'red';
  gandhiMood: 'confident' | 'worried' | 'neutral';
}

const roundNames = {
  opening: 'Opening Statements',
  evidence: 'Evidence Presentation',
  'cross-examination': 'Cross-Examination',
  closing: 'Closing Arguments'
};

// Gandhi arguments for each round and role
const gandhiArguments = {
  1: {
    prosecution: "Your Honor, the evidence will clearly show that the defendant committed this heinous crime. We have physical evidence, witness testimony, and a clear motive. The defendant was found at the scene with the murder weapon in hand.",
    defense: "Your Honor, the prosecution's case is built on circumstantial evidence and assumptions. We will demonstrate that reasonable doubt exists and my client is innocent of these charges."
  },
  2: {
    prosecution: "The murder weapon bears the defendant's fingerprints, and security footage places them at the scene during the time of death. This is not coincidence, but proof of guilt.",
    defense: "The evidence is circumstantial at best. Fingerprints on a kitchen knife in someone's own home? Security footage showing a visit? None of this proves murder beyond reasonable doubt."
  },
  3: {
    prosecution: "The witness clearly stated they heard arguing and then silence. The defendant had motive - a $5,000 debt dispute. When confronted with evidence, they have no alibi.",
    defense: "The witness testimony is inconsistent and based on assumptions. A debt dispute doesn't equal murder, and being present doesn't prove guilt. Where is the concrete evidence?"
  },
  4: {
    prosecution: "The blood spatter analysis shows the victim was attacked while cooking. No signs of struggle suggest the victim trusted their attacker. Who else had access to the apartment?",
    defense: "The lack of struggle could indicate many scenarios. The prosecution wants you to fill in gaps with speculation. They must prove guilt beyond reasonable doubt, not create a story."
  },
  5: {
    prosecution: "Ladies and gentlemen, we have presented overwhelming evidence. The defendant had motive, means, and opportunity. The evidence speaks for itself - guilty beyond reasonable doubt.",
    defense: "The prosecution has failed to prove guilt beyond reasonable doubt. Circumstantial evidence and speculation cannot convict an innocent person. You must find my client not guilty."
  }
};

// Enhanced response options with explanations
const responseOptions = {
  1: {
    prosecution: [
      { 
        text: "Challenge the defense's claim by presenting the timeline of events and physical evidence found at the scene", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent strategy! Immediately countering with concrete evidence establishes credibility and puts the defense on the defensive. This direct approach resonates well with juries."
      },
      { 
        text: "Emphasize the defendant's presence at the scene and their relationship with the victim", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good approach. Establishing opportunity and connection is important, though it would be stronger with more specific evidence details."
      },
      { 
        text: "Appeal to the jury's emotions about the victim's family and community safety", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak strategy for opening statements. Emotional appeals work better in closing arguments. Focus on facts and evidence first."
      },
      { 
        text: "Attack the defense attorney's credibility and experience in murder cases", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor choice! Personal attacks on opposing counsel appear unprofessional and desperate. This damages your credibility with the jury."
      }
    ],
    defense: [
      { 
        text: "Point out the lack of direct evidence and emphasize the burden of proof lies with prosecution", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense strategy! Immediately establishing reasonable doubt and reminding the jury of the prosecution's burden is textbook defense work."
      },
      { 
        text: "Suggest alternative theories that could explain the defendant's presence at the scene", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good approach. Providing alternative explanations creates doubt, though be careful not to seem like you're grasping at straws."
      },
      { 
        text: "Highlight the defendant's clean criminal record and good character", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak for opening statements. Character evidence is better saved for later in the trial when you need to humanize your client."
      },
      { 
        text: "Claim the prosecution is rushing to judgment without proper investigation", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Making accusations without evidence makes you look desperate and undermines your credibility from the start."
      }
    ]
  },
  2: {
    prosecution: [
      { 
        text: "Present the forensic timeline showing the defendant's fingerprints were fresh and the security footage timestamp", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent! Combining multiple pieces of evidence with scientific backing creates a compelling narrative that's hard to refute."
      },
      { 
        text: "Introduce the text messages showing the heated argument about money earlier that day", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good move. Establishing motive is crucial, and contemporary communications are powerful evidence."
      },
      { 
        text: "Call the medical examiner to testify about the cause and time of death", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak timing. Medical testimony is important but should be presented strategically, not as a reaction to defense arguments."
      },
      { 
        text: "Show graphic crime scene photos to emphasize the brutality of the attack", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor choice! Graphic photos without proper foundation can backfire and make you appear to be manipulating emotions rather than presenting facts."
      }
    ],
    defense: [
      { 
        text: "Question the chain of custody for evidence and point out contamination possibilities", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense tactic! Challenging evidence integrity is fundamental and can cast doubt on the entire prosecution case."
      },
      { 
        text: "Challenge the reliability of the security camera timestamp and video quality", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Technical challenges to evidence can be effective, especially if you can bring in expert testimony."
      },
      { 
        text: "Argue that text messages show frustration, not murderous intent", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. This argument acknowledges the conflict existed, which may hurt more than help your case."
      },
      { 
        text: "Suggest the real killer planted evidence to frame your client", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Conspiracy theories without evidence make you look desperate and can alienate the jury."
      }
    ]
  },
  3: {
    prosecution: [
      { 
        text: "Cross-examine the defendant about their exact whereabouts and actions that evening", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent cross-examination strategy! Pinning down specific details can reveal inconsistencies and lies."
      },
      { 
        text: "Press the neighbor witness about the specific sounds they heard", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good approach. Getting specific details from witnesses strengthens their credibility and your case."
      },
      { 
        text: "Confront the defendant with the evidence and ask them to explain the inconsistencies", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak strategy. Giving the defendant a chance to explain can backfire if they have a good answer."
      },
      { 
        text: "Ask leading questions to trap the defendant in contradictions", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor technique! Obvious leading questions will be objected to and make you look manipulative to the jury."
      }
    ],
    defense: [
      { 
        text: "Challenge the neighbor's ability to accurately identify sounds through apartment walls", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense! Attacking the reliability of witness perception is a classic and effective strategy."
      },
      { 
        text: "Question the detective about potential evidence contamination and rushed investigation", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Challenging police procedures can undermine the prosecution's case foundation."
      },
      { 
        text: "Cross-examine the victim's sister about her emotional bias and hearsay testimony", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. Attacking grieving family members can make you look heartless to the jury."
      },
      { 
        text: "Aggressively attack the credibility of all prosecution witnesses", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Overly aggressive tactics can backfire and make the jury sympathize with the witnesses."
      }
    ]
  },
  4: {
    prosecution: [
      { 
        text: "Use the blood spatter expert to demonstrate how the attack occurred and rule out self-defense", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent use of expert testimony! Scientific evidence presented clearly can be very persuasive to juries."
      },
      { 
        text: "Establish that only the defendant had both motive and access to the victim", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good logical argument. Combining motive and opportunity creates a strong circumstantial case."
      },
      { 
        text: "Present character evidence showing the defendant's history of financial disputes", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak strategy. Character evidence can be risky and may open doors for the defense to present positive character evidence."
      },
      { 
        text: "Argue that the defendant's calm demeanor shows premeditation", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor argument! People react differently to stress, and this argument is too speculative for most juries."
      }
    ],
    defense: [
      { 
        text: "Present alternative scenarios for the blood spatter pattern and lack of struggle", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect counter-strategy! Providing scientific alternative explanations directly challenges the prosecution's expert testimony."
      },
      { 
        text: "Introduce evidence of other people who had access to the apartment", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good approach. Showing other suspects creates reasonable doubt about your client's guilt."
      },
      { 
        text: "Challenge the prosecution's timeline with alibi witnesses", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak timing. Alibi evidence should have been presented earlier in the trial for maximum impact."
      },
      { 
        text: "Claim the victim was involved in dangerous activities that led to their death", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Attacking the victim's character without solid evidence can backfire and anger the jury."
      }
    ]
  },
  5: {
    prosecution: [
      { 
        text: "Systematically review all evidence and show how it points to one conclusion: guilt", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect closing strategy! A methodical review that ties everything together is exactly what closing arguments should do."
      },
      { 
        text: "Appeal to the jury's duty to deliver justice for the victim and community", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good emotional appeal for closing. This is the appropriate time to combine facts with the moral imperative for justice."
      },
      { 
        text: "Address each defense argument with specific counter-evidence", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. Spending too much time on defense arguments can make their points seem stronger."
      },
      { 
        text: "Make an emotional plea about the victim's life and family's suffering", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor strategy! Pure emotional appeals without connecting to evidence can seem manipulative and desperate."
      }
    ],
    defense: [
      { 
        text: "Systematically highlight every reasonable doubt raised during the trial", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense closing! Methodically reviewing all doubts reinforces your core message and legal standard."
      },
      { 
        text: "Remind the jury of the high burden of proof and presumption of innocence", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Reinforcing legal standards is important, especially in closing arguments."
      },
      { 
        text: "Point out the lack of direct evidence or witnesses to the actual crime", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak for closing. This point should have been emphasized throughout the trial, not saved for the end."
      },
      { 
        text: "Attack the prosecution for building a case on speculation and emotion", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad approach! Attacking the prosecution directly can seem unprofessional and may backfire with the jury."
      }
    ]
  }
};

// Gandhi responses based on effectiveness
const gandhiResponses = {
  perfect: [
    "That's... a very strong argument. Let me reconsider my approach...",
    "You've raised an excellent point that I must address carefully...",
    "I see you've done your homework. This requires a thoughtful response...",
    "A sophisticated legal strategy. I respect that, but consider this..."
  ],
  good: [
    "A reasonable argument, though I believe the evidence shows...",
    "You make a fair point, however the facts still indicate...",
    "That's a valid concern, but let me clarify why...",
    "I understand your position, though I must respectfully disagree..."
  ],
  weak: [
    "I'm afraid that argument lacks the foundation needed...",
    "While I see your point, it doesn't address the core evidence...",
    "That approach seems to miss the crucial facts of this case...",
    "I expected a stronger response to such clear evidence..."
  ],
  bad: [
    "That's exactly the kind of desperate tactic I anticipated...",
    "Such arguments only serve to undermine your credibility...",
    "The jury will see through that obvious misdirection...",
    "I'm disappointed by such unprofessional conduct..."
  ]
};

export default function BattlePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const playerRole = (searchParams.get('role') || 'defense') as PlayerRole;
  
  const caseData = getCaseById(caseId);
  
  const [battleState, setBattleState] = useState<BattleState>({
    currentRound: 'opening',
    roundNumber: 1,
    totalRounds: 5,
    score: 0,
    timeRemaining: 2700, // 45 minutes
    choiceTimeRemaining: 30,
    gandhiArgument: gandhiArguments[1][playerRole === 'defense' ? 'prosecution' : 'defense'],
    playerOptions: responseOptions[1][playerRole],
    showGandhiSpeech: true,
    showResults: false,
    lastChoice: null,
    gamePhase: 'gandhi-speaking',
    flashEffect: 'none',
    gandhiMood: 'confident'
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Main game timer
  useEffect(() => {
    if (battleState.gamePhase === 'game-over') return;
    
    const timer = setInterval(() => {
      setBattleState(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [battleState.gamePhase]);

  // Choice timer
  useEffect(() => {
    if (battleState.gamePhase !== 'player-choosing') return;
    
    const timer = setInterval(() => {
      setBattleState(prev => {
        if (prev.choiceTimeRemaining <= 1) {
          // Auto-select worst option if time runs out
          handleOptionSelect(prev.playerOptions.length - 1, true);
          return prev;
        }
        return {
          ...prev,
          choiceTimeRemaining: prev.choiceTimeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleState.gamePhase, battleState.choiceTimeRemaining]);

  // Flash effect timer
  useEffect(() => {
    if (battleState.flashEffect !== 'none') {
      const timer = setTimeout(() => {
        setBattleState(prev => ({ ...prev, flashEffect: 'none' }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [battleState.flashEffect]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score > 40) return 'bg-green-600';
    if (score > 20) return 'bg-green-400';
    if (score > 0) return 'bg-green-200';
    if (score < -40) return 'bg-red-600';
    if (score < -20) return 'bg-red-400';
    if (score < 0) return 'bg-red-200';
    return 'bg-gray-400';
  };

  const getScorePosition = (score: number) => {
    // Convert score (-100 to 100) to percentage (0 to 100)
    return Math.max(0, Math.min(100, 50 + (score / 2)));
  };

  const getEffectivenessIcon = (effectiveness: EffectivenessLevel) => {
    switch (effectiveness) {
      case 'perfect': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'weak': return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case 'bad': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getEffectivenessColor = (effectiveness: EffectivenessLevel) => {
    switch (effectiveness) {
      case 'perfect': return 'border-green-500 bg-green-50 text-green-800';
      case 'good': return 'border-blue-500 bg-blue-50 text-blue-800';
      case 'weak': return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'bad': return 'border-red-500 bg-red-50 text-red-800';
    }
  };

  const getGandhiMoodEmoji = (mood: 'confident' | 'worried' | 'neutral') => {
    switch (mood) {
      case 'confident': return '😤';
      case 'worried': return '😰';
      case 'neutral': return '🤔';
    }
  };

  const getGandhiMoodColor = (mood: 'confident' | 'worried' | 'neutral') => {
    switch (mood) {
      case 'confident': return 'bg-red-100 text-red-800';
      case 'worried': return 'bg-yellow-100 text-yellow-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOptionSelect = (optionIndex: number, autoSelected = false) => {
    if (battleState.gamePhase !== 'player-choosing') return;
    
    setSelectedOption(optionIndex);
    const selectedResponse = battleState.playerOptions[optionIndex];
    
    // Determine flash effect and Gandhi mood
    const flashEffect = selectedResponse.effectiveness === 'perfect' || selectedResponse.effectiveness === 'good' ? 'green' : 'red';
    const gandhiMood = selectedResponse.effectiveness === 'perfect' ? 'worried' : 
                      selectedResponse.effectiveness === 'bad' ? 'confident' : 'neutral';
    
    // Show results immediately
    const gandhiResponseText = gandhiResponses[selectedResponse.effectiveness][
      Math.floor(Math.random() * gandhiResponses[selectedResponse.effectiveness].length)
    ];

    setBattleState(prev => ({
      ...prev,
      score: prev.score + selectedResponse.scoreChange,
      lastChoice: {
        option: selectedResponse,
        effectiveness: selectedResponse.effectiveness,
        gandhiResponse: gandhiResponseText,
        gandhiMood
      },
      gamePhase: 'showing-results',
      flashEffect,
      gandhiMood
    }));

    // Auto-advance after showing results
    setTimeout(() => {
      advanceToNextRound();
    }, 6000);
  };

  const advanceToNextRound = () => {
    setBattleState(prev => {
      const nextRoundNumber = prev.roundNumber + 1;
      
      if (nextRoundNumber > prev.totalRounds) {
        return {
          ...prev,
          gamePhase: 'game-over'
        };
      }

      const oppositionRole = playerRole === 'defense' ? 'prosecution' : 'defense';
      
      return {
        ...prev,
        roundNumber: nextRoundNumber,
        gandhiArgument: gandhiArguments[nextRoundNumber][oppositionRole],
        playerOptions: responseOptions[nextRoundNumber][playerRole],
        choiceTimeRemaining: 30,
        gamePhase: 'gandhi-speaking',
        lastChoice: null,
        gandhiMood: 'confident'
      };
    });

    setSelectedOption(null);
    
    // Auto-advance to player choosing after Gandhi speaks
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        gamePhase: 'player-choosing'
      }));
    }, 3000);
  };

  const handleGandhiSpeechEnd = () => {
    setBattleState(prev => ({
      ...prev,
      gamePhase: 'player-choosing',
      choiceTimeRemaining: 30
    }));
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

  if (battleState.gamePhase === 'game-over') {
    const finalVerdict = battleState.score > 0 ? 'Defense Wins!' : battleState.score < 0 ? 'Prosecution Wins!' : 'Hung Jury!';
    const verdictColor = battleState.score > 0 ? 'text-green-600' : battleState.score < 0 ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center border border-amber-200">
          <Gavel className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className={`text-3xl font-bold mb-4 ${verdictColor}`}>{finalVerdict}</h1>
          <p className="text-gray-600 mb-2">Final Score: {battleState.score > 0 ? '+' : ''}{battleState.score}</p>
          <p className="text-sm text-gray-500 mb-6">
            You completed {battleState.totalRounds} rounds of legal argumentation
          </p>
          <div className="space-y-3">
            <Link href={`/courtroom-battle/case-briefing/${caseId}`}>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Try Again</Button>
            </Link>
            <Link href="/courtroom-battle">
              <Button variant="outline" className="w-full">Choose New Case</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 transition-all duration-1000 ${
      battleState.flashEffect === 'green' ? 'bg-green-100' : 
      battleState.flashEffect === 'red' ? 'bg-red-100' : ''
    }`}>
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
              <span className="text-sm font-medium text-gray-600">Round:</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {battleState.roundNumber} of {battleState.totalRounds}
              </span>
              {battleState.gamePhase === 'player-choosing' && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${battleState.choiceTimeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                  <span className={`font-mono ${battleState.choiceTimeRemaining <= 10 ? 'text-red-600 font-bold' : 'text-orange-600'}`}>
                    {battleState.choiceTimeRemaining}s
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Playing as: <span className="font-medium capitalize text-amber-600">{playerRole}</span>
            </div>
          </div>
          
          {/* Enhanced Score Meter */}
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Prosecution Favor</span>
              <span>Neutral</span>
              <span>Defense Favor</span>
            </div>
            <div className="w-full h-6 bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-300 via-gray-100 to-green-300"></div>
              <div 
                className={`absolute top-1 w-4 h-4 rounded-full ${getScoreColor(battleState.score)} border-2 border-white shadow-lg transition-all duration-1000 transform ${
                  battleState.flashEffect === 'green' ? 'scale-150' : battleState.flashEffect === 'red' ? 'scale-150' : 'scale-100'
                }`}
                style={{ left: `calc(${getScorePosition(battleState.score)}% - 8px)` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-700">
                Jury Meter: {battleState.score > 0 ? '+' : ''}{battleState.score}
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
            
            {battleState.gamePhase === 'gandhi-speaking' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Gandhi is presenting their argument...</p>
                <Button 
                  onClick={handleGandhiSpeechEnd}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Continue
                </Button>
              </div>
            ) : battleState.gamePhase === 'showing-results' ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getEffectivenessColor(battleState.lastChoice!.effectiveness)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getEffectivenessIcon(battleState.lastChoice!.effectiveness)}
                    <span className="font-medium capitalize">{battleState.lastChoice!.effectiveness} Choice</span>
                    <span className="text-sm">({battleState.lastChoice!.option.scoreChange > 0 ? '+' : ''}{battleState.lastChoice!.option.scoreChange} points)</span>
                  </div>
                  <p className="text-sm mb-3">{battleState.lastChoice!.option.text}</p>
                  <div className="bg-white/50 rounded p-3 border-l-4 border-current">
                    <h5 className="font-medium text-xs uppercase tracking-wide mb-1">Why this choice:</h5>
                    <p className="text-xs">{battleState.lastChoice!.option.explanation}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Gandhi's Response:</h4>
                  <p className="text-sm text-gray-700 italic">"{battleState.lastChoice!.gandhiResponse}"</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Advancing to next round...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Choose your response strategy:</p>
                {battleState.playerOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{option.text}</span>
                    </div>
                  </button>
                ))}
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
                  {Array.from({ length: battleState.totalRounds }, (_, i) => i + 1).map((round) => (
                    <div key={round} className={`flex items-center gap-2 ${
                      battleState.roundNumber === round ? 'text-amber-600 font-medium' : 
                      battleState.roundNumber > round ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        battleState.roundNumber === round ? 'bg-amber-600' :
                        battleState.roundNumber > round ? 'bg-green-600' : 'bg-gray-300'
                      }`}></div>
                      <span>Round {round}</span>
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
              {/* Gandhi's Avatar with Expression */}
              <div className="relative w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full mx-auto flex items-center justify-center">
                <div className="text-4xl">{getGandhiMoodEmoji(battleState.gandhiMood)}</div>
                <div className={`absolute -bottom-2 px-2 py-1 rounded-full text-xs font-medium ${getGandhiMoodColor(battleState.gandhiMood)}`}>
                  {battleState.gandhiMood}
                </div>
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
                  battleState.gamePhase === 'gandhi-speaking' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    battleState.gamePhase === 'gandhi-speaking' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  {battleState.gamePhase === 'gandhi-speaking' ? 'Speaking' : 'Waiting'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}