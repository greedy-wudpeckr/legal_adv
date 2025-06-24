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
  TrendingDown,
  FileText,
  Users,
  Eye,
  Mic,
  Trophy,
  Star,
  RotateCcw,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCaseById } from '@/data/sample-cases';

type BattlePhase = 'opening-statements' | 'evidence-presentation' | 'witness-examination' | 'closing-arguments';
type PlayerRole = 'defense' | 'prosecution';
type EffectivenessLevel = 'perfect' | 'good' | 'weak' | 'bad';

interface ResponseOption {
  text: string;
  effectiveness: EffectivenessLevel;
  scoreChange: number;
  explanation: string;
  strategyType: string;
}

interface BattleState {
  currentPhase: BattlePhase;
  phaseNumber: number;
  totalPhases: number;
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
  phaseContext: {
    evidencePresented?: string[];
    witnessesExamined?: string[];
    keyPoints?: string[];
  };
  choiceHistory: {
    phase: BattlePhase;
    choice: ResponseOption;
    effectiveness: EffectivenessLevel;
  }[];
  perfectChoices: number;
  goodChoices: number;
  weakChoices: number;
  badChoices: number;
}

const phaseNames = {
  'opening-statements': 'Opening Statements',
  'evidence-presentation': 'Evidence Presentation',
  'witness-examination': 'Witness Cross-Examination',
  'closing-arguments': 'Closing Arguments'
};

const phaseDescriptions = {
  'opening-statements': 'Set the narrative and outline your case strategy',
  'evidence-presentation': 'Present and challenge physical evidence',
  'witness-examination': 'Question witnesses and test their credibility',
  'closing-arguments': 'Make your final appeal to the jury'
};

const phaseIcons = {
  'opening-statements': Mic,
  'evidence-presentation': FileText,
  'witness-examination': Users,
  'closing-arguments': Scale
};

// Gandhi arguments for each phase
const gandhiArguments = {
  'opening-statements': {
    prosecution: "Your Honor, members of the jury, today I will prove beyond reasonable doubt that the defendant committed premeditated murder. The evidence will show motive, means, and opportunity. The defendant was found at the scene with the murder weapon, and their fingerprints tell the story of guilt.",
    defense: "Your Honor, esteemed jurors, the prosecution's case is built on circumstantial evidence and assumptions. My client is innocent, and I will demonstrate that reasonable doubt exists at every turn. The prosecution must prove guilt beyond reasonable doubt - they cannot and will not meet this burden."
  },
  'evidence-presentation': {
    prosecution: "Let's examine the murder weapon - an 8-inch kitchen knife with the defendant's fingerprints clearly visible on the handle. The blood spatter analysis shows the victim was attacked while cooking, with no signs of struggle. Security footage places the defendant at the scene during the time of death.",
    defense: "The prosecution wants you to believe that fingerprints on a kitchen knife in someone's own home proves murder. The security footage merely shows a visit - not a crime. The lack of struggle could indicate many scenarios, none of which necessarily point to my client as the perpetrator."
  },
  'witness-examination': {
    prosecution: "Mrs. Johnson, the neighbor, clearly heard arguing followed by sudden silence at 9:30 PM. The defendant had no alibi for this crucial time period. When questioned by Detective Rodriguez, the defendant appeared shocked but offered no explanation for their presence at the scene.",
    defense: "Mrs. Johnson admits she heard sounds through apartment walls - hardly reliable evidence. Detective Rodriguez found my client in shock, which is exactly how an innocent person would react upon discovering a tragedy. The prosecution's witnesses offer speculation, not facts."
  },
  'closing-arguments': {
    prosecution: "Ladies and gentlemen, we have presented overwhelming evidence: the defendant's fingerprints on the murder weapon, their presence at the scene, a clear motive involving money, and no credible alibi. The evidence speaks with one voice - guilty beyond reasonable doubt.",
    defense: "The prosecution has failed to prove guilt beyond reasonable doubt. They've presented circumstantial evidence, speculation, and asked you to fill in gaps with assumptions. In America, we don't convict on maybes and possibilities. The evidence creates reasonable doubt, and you must find my client not guilty."
  }
};

// Phase-specific response options with different strategy types
const responseOptions = {
  'opening-statements': {
    prosecution: [
      { 
        text: "Present a clear timeline of events leading to the murder, emphasizing the defendant's motive and opportunity", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent opening strategy! A clear, chronological narrative helps jurors understand the case and creates a strong foundation for evidence presentation.",
        strategyType: "Narrative Building"
      },
      { 
        text: "Focus on the physical evidence and forensic findings that will be presented during trial", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good approach. Previewing strong evidence builds anticipation, though a complete narrative would be more compelling.",
        strategyType: "Evidence Preview"
      },
      { 
        text: "Make an emotional appeal about justice for the victim and community safety", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak for opening statements. Emotional appeals are better saved for closing arguments after evidence has been presented.",
        strategyType: "Emotional Appeal"
      },
      { 
        text: "Attack the defense's anticipated arguments before they present them", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor strategy! Attacking arguments that haven't been made yet appears defensive and may give the defense ideas.",
        strategyType: "Preemptive Attack"
      }
    ],
    defense: [
      { 
        text: "Emphasize the burden of proof and presumption of innocence while outlining reasonable doubt themes", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense opening! Establishing legal standards and doubt themes gives jurors a framework for evaluating evidence.",
        strategyType: "Legal Framework"
      },
      { 
        text: "Present alternative theories for what really happened that night", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Alternative theories create doubt, though be careful not to seem like you're grasping at straws.",
        strategyType: "Alternative Theory"
      },
      { 
        text: "Highlight your client's good character and lack of criminal history", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak timing. Character evidence is better presented during the defense case, not in opening statements.",
        strategyType: "Character Defense"
      },
      { 
        text: "Accuse the prosecution of rushing to judgment without proper investigation", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad approach! Making accusations without evidence undermines your credibility from the start.",
        strategyType: "Prosecution Attack"
      }
    ]
  },
  'evidence-presentation': {
    prosecution: [
      { 
        text: "Present forensic timeline showing fresh fingerprints and correlate with security footage timestamp", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent evidence presentation! Combining multiple pieces of scientific evidence creates a compelling, hard-to-refute narrative.",
        strategyType: "Scientific Correlation"
      },
      { 
        text: "Introduce the text message evidence showing the financial dispute and motive", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Establishing motive is crucial, and contemporary communications are powerful evidence.",
        strategyType: "Motive Evidence"
      },
      { 
        text: "Focus on the blood spatter pattern and what it reveals about the attack", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. Blood evidence alone without context may confuse jurors rather than convince them.",
        strategyType: "Forensic Detail"
      },
      { 
        text: "Show graphic crime scene photos to emphasize the brutality", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor choice! Graphic photos without proper foundation can backfire and appear manipulative.",
        strategyType: "Shock Value"
      }
    ],
    defense: [
      { 
        text: "Challenge the chain of custody and evidence handling procedures systematically", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense tactic! Systematic challenges to evidence integrity can undermine the entire prosecution case.",
        strategyType: "Chain of Custody"
      },
      { 
        text: "Question the reliability and accuracy of the security camera timestamp", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good technical challenge. Questioning digital evidence reliability can create reasonable doubt.",
        strategyType: "Technical Challenge"
      },
      { 
        text: "Argue that the text messages show frustration, not murderous intent", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. This acknowledges the conflict existed, which may hurt more than help.",
        strategyType: "Intent Mitigation"
      },
      { 
        text: "Suggest evidence was planted by the real killer to frame your client", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Conspiracy theories without evidence make you look desperate and unreliable.",
        strategyType: "Conspiracy Theory"
      }
    ]
  },
  'witness-examination': {
    prosecution: [
      { 
        text: "Cross-examine the defendant about specific details and inconsistencies in their story", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Excellent cross-examination strategy! Pinning down specific details can reveal lies and inconsistencies.",
        strategyType: "Detail Interrogation"
      },
      { 
        text: "Question Mrs. Johnson about exactly what she heard and when", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good witness examination. Specific details from credible witnesses strengthen your case.",
        strategyType: "Witness Specificity"
      },
      { 
        text: "Confront the defendant with the evidence and demand explanations", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak strategy. Giving defendants chances to explain can backfire if they have good answers.",
        strategyType: "Evidence Confrontation"
      },
      { 
        text: "Use leading questions to trap the defendant in contradictions", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor technique! Obvious leading questions will be objected to and make you look manipulative.",
        strategyType: "Leading Questions"
      }
    ],
    defense: [
      { 
        text: "Challenge Mrs. Johnson's ability to accurately identify sounds through apartment walls", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense cross-examination! Attacking witness perception reliability is classic and effective.",
        strategyType: "Perception Challenge"
      },
      { 
        text: "Question Detective Rodriguez about investigation procedures and potential contamination", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Challenging police procedures can undermine the prosecution's foundation.",
        strategyType: "Procedure Challenge"
      },
      { 
        text: "Cross-examine the victim's sister about her emotional bias", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. Attacking grieving family members can make you appear heartless to jurors.",
        strategyType: "Bias Attack"
      },
      { 
        text: "Aggressively attack the credibility of all prosecution witnesses", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad strategy! Overly aggressive tactics backfire and make jurors sympathize with witnesses.",
        strategyType: "Aggressive Attack"
      }
    ]
  },
  'closing-arguments': {
    prosecution: [
      { 
        text: "Systematically review all evidence and show how each piece points to guilt", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect closing strategy! Methodical evidence review that ties everything together is exactly what closings should do.",
        strategyType: "Evidence Synthesis"
      },
      { 
        text: "Appeal to the jury's duty to deliver justice while connecting to the evidence", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good combination of facts and moral imperative. This is appropriate timing for emotional appeals.",
        strategyType: "Justice Appeal"
      },
      { 
        text: "Address each defense argument with specific counter-evidence", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak approach. Spending too much time on defense arguments can make their points seem stronger.",
        strategyType: "Defense Rebuttal"
      },
      { 
        text: "Make a purely emotional plea about the victim's life and family", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Poor strategy! Pure emotion without evidence connection seems manipulative and desperate.",
        strategyType: "Pure Emotion"
      }
    ],
    defense: [
      { 
        text: "Systematically highlight every reasonable doubt raised during trial", 
        effectiveness: 'perfect' as EffectivenessLevel, 
        scoreChange: 20, 
        explanation: "Perfect defense closing! Methodically reviewing all doubts reinforces your core message and legal standard.",
        strategyType: "Doubt Compilation"
      },
      { 
        text: "Remind the jury of the high burden of proof and presumption of innocence", 
        effectiveness: 'good' as EffectivenessLevel, 
        scoreChange: 10, 
        explanation: "Good strategy. Reinforcing legal standards is important, especially in closing arguments.",
        strategyType: "Legal Standard"
      },
      { 
        text: "Point out the lack of direct evidence or eyewitnesses to the crime", 
        effectiveness: 'weak' as EffectivenessLevel, 
        scoreChange: -10, 
        explanation: "Weak for closing. This point should have been emphasized throughout trial, not saved for the end.",
        strategyType: "Evidence Gap"
      },
      { 
        text: "Attack the prosecution for building a case on speculation", 
        effectiveness: 'bad' as EffectivenessLevel, 
        scoreChange: -20, 
        explanation: "Bad approach! Direct attacks on prosecution can seem unprofessional and may backfire.",
        strategyType: "Prosecution Attack"
      }
    ]
  }
};

// Gandhi responses based on effectiveness
const gandhiResponses = {
  perfect: [
    "That's... a very sophisticated legal argument. I must reconsider my approach...",
    "You've raised an excellent point that requires careful consideration...",
    "I see you've mastered this aspect of trial advocacy. Impressive...",
    "A textbook example of effective legal strategy. Well played..."
  ],
  good: [
    "A reasonable argument, though I believe the evidence still shows...",
    "You make a fair point, however the facts indicate...",
    "That's a valid legal strategy, but consider this perspective...",
    "I understand your position, though I respectfully disagree..."
  ],
  weak: [
    "I'm afraid that argument lacks the foundation needed in this phase...",
    "While I see your point, it doesn't address the core issues...",
    "That approach seems to miss the strategic opportunity here...",
    "I expected a stronger response given the evidence presented..."
  ],
  bad: [
    "That's exactly the kind of mistake I was hoping you'd make...",
    "Such tactics only serve to undermine your case...",
    "The jury will see through that obvious misdirection...",
    "I'm disappointed by such unprofessional conduct in my courtroom..."
  ]
};

export default function BattlePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.caseId as string;
  const playerRole = (searchParams.get('role') || 'defense') as PlayerRole;
  
  const caseData = getCaseById(caseId);
  
  const [battleState, setBattleState] = useState<BattleState>({
    currentPhase: 'opening-statements',
    phaseNumber: 1,
    totalPhases: 4,
    score: 0,
    timeRemaining: 2700, // 45 minutes
    choiceTimeRemaining: 45, // Longer time for complex decisions
    gandhiArgument: gandhiArguments['opening-statements'][playerRole === 'defense' ? 'prosecution' : 'defense'],
    playerOptions: responseOptions['opening-statements'][playerRole],
    showGandhiSpeech: true,
    showResults: false,
    lastChoice: null,
    gamePhase: 'gandhi-speaking',
    flashEffect: 'none',
    gandhiMood: 'confident',
    phaseContext: {
      evidencePresented: [],
      witnessesExamined: [],
      keyPoints: []
    },
    choiceHistory: [],
    perfectChoices: 0,
    goodChoices: 0,
    weakChoices: 0,
    badChoices: 0
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

  // Choice timer with phase-specific durations
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

  const getPhaseTimeLimit = (phase: BattlePhase) => {
    switch (phase) {
      case 'opening-statements': return 45;
      case 'evidence-presentation': return 60;
      case 'witness-examination': return 50;
      case 'closing-arguments': return 45;
      default: return 45;
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

    // Update phase context based on choice
    const updatedContext = { ...battleState.phaseContext };
    if (battleState.currentPhase === 'evidence-presentation') {
      updatedContext.evidencePresented = [...(updatedContext.evidencePresented || []), selectedResponse.strategyType];
    } else if (battleState.currentPhase === 'witness-examination') {
      updatedContext.witnessesExamined = [...(updatedContext.witnessesExamined || []), selectedResponse.strategyType];
    }

    // Update choice statistics
    const newChoiceHistory = [...battleState.choiceHistory, {
      phase: battleState.currentPhase,
      choice: selectedResponse,
      effectiveness: selectedResponse.effectiveness
    }];

    const newStats = {
      perfectChoices: battleState.perfectChoices + (selectedResponse.effectiveness === 'perfect' ? 1 : 0),
      goodChoices: battleState.goodChoices + (selectedResponse.effectiveness === 'good' ? 1 : 0),
      weakChoices: battleState.weakChoices + (selectedResponse.effectiveness === 'weak' ? 1 : 0),
      badChoices: battleState.badChoices + (selectedResponse.effectiveness === 'bad' ? 1 : 0)
    };

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
      gandhiMood,
      phaseContext: updatedContext,
      choiceHistory: newChoiceHistory,
      ...newStats
    }));

    // Auto-advance after showing results
    setTimeout(() => {
      advanceToNextPhase();
    }, 7000);
  };

  const advanceToNextPhase = () => {
    setBattleState(prev => {
      const nextPhaseNumber = prev.phaseNumber + 1;
      
      if (nextPhaseNumber > prev.totalPhases) {
        return {
          ...prev,
          gamePhase: 'game-over'
        };
      }

      const phases: BattlePhase[] = ['opening-statements', 'evidence-presentation', 'witness-examination', 'closing-arguments'];
      const nextPhase = phases[nextPhaseNumber - 1];
      const oppositionRole = playerRole === 'defense' ? 'prosecution' : 'defense';
      const timeLimit = getPhaseTimeLimit(nextPhase);
      
      return {
        ...prev,
        currentPhase: nextPhase,
        phaseNumber: nextPhaseNumber,
        gandhiArgument: gandhiArguments[nextPhase][oppositionRole],
        playerOptions: responseOptions[nextPhase][playerRole],
        choiceTimeRemaining: timeLimit,
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
    }, 4000);
  };

  const handleGandhiSpeechEnd = () => {
    setBattleState(prev => ({
      ...prev,
      gamePhase: 'player-choosing',
      choiceTimeRemaining: getPhaseTimeLimit(prev.currentPhase)
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
    const finalScore = battleState.score;
    const isVictory = finalScore > 20;
    const isDefeat = finalScore < -20;
    const isHungJury = !isVictory && !isDefeat;
    
    const totalChoices = battleState.perfectChoices + battleState.goodChoices + battleState.weakChoices + battleState.badChoices;
    const accuracy = totalChoices > 0 ? Math.round(((battleState.perfectChoices + battleState.goodChoices) / totalChoices) * 100) : 0;
    
    // Calculate XP and achievements
    const baseXP = caseData.pointsAvailable;
    const scoreMultiplier = Math.max(0.1, (finalScore + 100) / 200); // 0.1 to 1.0 based on score
    const accuracyBonus = accuracy > 75 ? 200 : accuracy > 50 ? 100 : 0;
    const perfectChoiceBonus = battleState.perfectChoices * 50;
    const totalXP = Math.round(baseXP * scoreMultiplier + accuracyBonus + perfectChoiceBonus);
    
    // Determine achievements
    const achievements = [];
    if (battleState.perfectChoices >= 3) achievements.push({ name: "Perfect Strategist", icon: "🎯", description: "Made 3+ perfect choices" });
    if (accuracy >= 75) achievements.push({ name: "Legal Eagle", icon: "🦅", description: "75%+ choice accuracy" });
    if (isVictory && finalScore > 50) achievements.push({ name: "Courtroom Dominator", icon: "👑", description: "Decisive victory" });
    if (battleState.perfectChoices === totalChoices) achievements.push({ name: "Flawless Victory", icon: "💎", description: "All perfect choices" });
    
    // Victory Screen
    if (isVictory) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-green-200">
            {/* Victory Header */}
            <div className="text-center mb-8">
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">Case Won!</h1>
              <p className="text-xl text-gray-600">🎉 Congratulations! You successfully defended your client!</p>
            </div>

            {/* Score Summary */}
            <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Final Results
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+{finalScore}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
              
              {/* Choice Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-green-100 rounded p-2">
                  <div className="font-bold text-green-800">{battleState.perfectChoices}</div>
                  <div className="text-green-600">Perfect</div>
                </div>
                <div className="bg-blue-100 rounded p-2">
                  <div className="font-bold text-blue-800">{battleState.goodChoices}</div>
                  <div className="text-blue-600">Good</div>
                </div>
                <div className="bg-orange-100 rounded p-2">
                  <div className="font-bold text-orange-800">{battleState.weakChoices}</div>
                  <div className="text-orange-600">Weak</div>
                </div>
                <div className="bg-red-100 rounded p-2">
                  <div className="font-bold text-red-800">{battleState.badChoices}</div>
                  <div className="text-red-600">Bad</div>
                </div>
              </div>
            </div>

            {/* XP and Achievements */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Rewards Earned
              </h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Experience Points:</span>
                <span className="text-2xl font-bold text-yellow-600">+{totalXP} XP</span>
              </div>
              
              {achievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Achievements Unlocked:</h4>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white rounded p-3 border border-yellow-300">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800">{achievement.name}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/courtroom-battle">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  <Star className="w-5 h-5 mr-2" />
                  Choose Next Case
                </Button>
              </Link>
              <Link href={`/courtroom-battle/case-briefing/${caseId}`}>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 py-3">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Defeat Screen
    if (isDefeat) {
      // Analyze what went wrong
      const weakestPhase = battleState.choiceHistory.reduce((worst, current) => {
        return current.choice.scoreChange < worst.choice.scoreChange ? current : worst;
      }, battleState.choiceHistory[0]);

      const improvementTips = [
        "Focus on legal fundamentals - burden of proof is key in defense cases",
        "Consider the jury's perspective when choosing your strategy",
        "Evidence challenges are most effective when systematic and specific",
        "Emotional appeals work better in closing arguments than opening statements"
      ];

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-red-200">
            {/* Defeat Header */}
            <div className="text-center mb-8">
              <div className="relative">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-2">Case Lost</h1>
              <p className="text-xl text-gray-600">The jury found against your client. Let's learn from this experience.</p>
            </div>

            {/* Analysis */}
            <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-600" />
                What Went Wrong
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{finalScore}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
              
              {weakestPhase && (
                <div className="bg-white rounded p-4 border border-red-300">
                  <h4 className="font-medium text-gray-800 mb-2">Weakest Performance:</h4>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{phaseNames[weakestPhase.phase]}</div>
                    <div className="text-red-600 mt-1">"{weakestPhase.choice.text}"</div>
                    <div className="text-gray-500 mt-1">{weakestPhase.choice.explanation}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Improvement Tips */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Tips for Improvement
              </h3>
              <div className="space-y-3">
                {improvementTips.slice(0, 3).map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Resources */}
            <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                Recommended Study
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div>• Review the case evidence more carefully before starting</div>
                <div>• Practice with easier cases to build fundamentals</div>
                <div>• Focus on {phaseNames[weakestPhase?.phase || 'opening-statements']} strategies</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href={`/courtroom-battle/case-briefing/${caseId}`}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </Link>
              <Link href="/courtroom-battle">
                <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 py-3">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Choose Different Case
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Hung Jury Screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-gray-200">
          <div className="text-center mb-8">
            <Gavel className="w-20 h-20 text-gray-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-600 mb-2">Hung Jury</h1>
            <p className="text-xl text-gray-600">The jury couldn't reach a unanimous decision. A mixed result.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{finalScore}</div>
              <div className="text-gray-600">Final Score - Neither side convinced the jury</div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/courtroom-battle/case-briefing/${caseId}`}>
              <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg">
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry for Better Result
              </Button>
            </Link>
            <Link href="/courtroom-battle">
              <Button variant="outline" className="w-full py-3">
                Choose New Case
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const PhaseIcon = phaseIcons[battleState.currentPhase];

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

      {/* Phase Status Bar */}
      <div className="bg-white border-b border-amber-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <PhaseIcon className="w-6 h-6 text-amber-600" />
              <div>
                <span className="text-lg font-semibold text-gray-800">{phaseNames[battleState.currentPhase]}</span>
                <p className="text-sm text-gray-600">{phaseDescriptions[battleState.currentPhase]}</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Phase {battleState.phaseNumber} of {battleState.totalPhases}
              </span>
              {battleState.gamePhase === 'player-choosing' && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${battleState.choiceTimeRemaining <= 15 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                  <span className={`font-mono ${battleState.choiceTimeRemaining <= 15 ? 'text-red-600 font-bold' : 'text-orange-600'}`}>
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
                Jury Favor: {battleState.score > 0 ? '+' : ''}{battleState.score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Interface */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-320px)]">
          
          {/* Left Panel - Player Arguments/Options */}
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Your Strategy</h3>
            </div>
            
            {battleState.gamePhase === 'gandhi-speaking' ? (
              <div className="text-center py-8">
                <PhaseIcon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Gandhi is presenting their {battleState.currentPhase.replace('-', ' ')}...</p>
                <Button 
                  onClick={handleGandhiSpeechEnd}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Prepare Response
                </Button>
              </div>
            ) : battleState.gamePhase === 'showing-results' ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getEffectivenessColor(battleState.lastChoice!.effectiveness)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getEffectivenessIcon(battleState.lastChoice!.effectiveness)}
                    <span className="font-medium capitalize">{battleState.lastChoice!.effectiveness} Strategy</span>
                    <span className="text-sm">({battleState.lastChoice!.option.scoreChange > 0 ? '+' : ''}{battleState.lastChoice!.option.scoreChange} points)</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {battleState.lastChoice!.option.strategyType}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{battleState.lastChoice!.option.text}</p>
                  <div className="bg-white/50 rounded p-3 border-l-4 border-current">
                    <h5 className="font-medium text-xs uppercase tracking-wide mb-1">Strategic Analysis:</h5>
                    <p className="text-xs">{battleState.lastChoice!.option.explanation}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Gandhi's Response:</h4>
                  <p className="text-sm text-gray-700 italic">"{battleState.lastChoice!.gandhiResponse}"</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Advancing to next phase...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-amber-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Choose your {battleState.currentPhase.replace('-', ' ')} strategy:</p>
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
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {option.strategyType}
                        </div>
                        <span className="text-sm">{option.text}</span>
                      </div>
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
              <p className="text-gray-600 mb-6">Presiding over the trial</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Trial Progress</h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(phaseNames).map(([phase, name], index) => {
                    const PhaseIcon = phaseIcons[phase as BattlePhase];
                    return (
                      <div key={phase} className={`flex items-center gap-3 ${
                        battleState.currentPhase === phase ? 'text-amber-600 font-medium' : 
                        battleState.phaseNumber > index + 1 ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <PhaseIcon className="w-4 h-4" />
                        <div className={`w-2 h-2 rounded-full ${
                          battleState.currentPhase === phase ? 'bg-amber-600' :
                          battleState.phaseNumber > index + 1 ? 'bg-green-600' : 'bg-gray-300'
                        }`}></div>
                        <span>{name}</span>
                      </div>
                    );
                  })}
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
                  {battleState.gamePhase === 'gandhi-speaking' ? 'Presenting' : 'Waiting'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}