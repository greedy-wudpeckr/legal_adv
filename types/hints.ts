export interface Hint {
  id: string;
  phase: string;
  text: string;
  cost: number;
  category: 'strategy' | 'evidence' | 'legal' | 'timing';
}

export interface HintSystem {
  hintsUsed: number;
  totalHintCost: number;
  availableHints: Hint[];
  usedHints: string[];
}

export const PHASE_HINTS: Record<string, Hint[]> = {
  'opening-statements': [
    {
      id: 'opening-strategy',
      phase: 'opening-statements',
      text: 'Focus on setting a clear narrative rather than attacking the opposition. Save aggressive tactics for later phases.',
      cost: 5,
      category: 'strategy'
    },
    {
      id: 'opening-legal',
      phase: 'opening-statements',
      text: 'Remember: Opening statements should preview evidence, not argue conclusions. Stick to what you can prove.',
      cost: 5,
      category: 'legal'
    },
    {
      id: 'opening-timing',
      phase: 'opening-statements',
      text: 'Establish the burden of proof early. For defense, emphasize "reasonable doubt" - for prosecution, "beyond reasonable doubt".',
      cost: 10,
      category: timing'
    }
  ],
  'evidence-presentation': [
    {
      id: 'evidence-strategy',
      phase: 'evidence-presentation',
      text: 'Challenge the chain of custody and evidence handling procedures. Technical challenges can undermine entire cases.',
      cost: 10,
      category: 'strategy'
    },
    {
      id: 'evidence-technical',
      phase: 'evidence-presentation',
      text: 'Question the reliability of digital evidence like timestamps and GPS data. Technology can be manipulated or malfunction.',
      cost: 15,
      category: 'evidence'
    },
    {
      id: 'evidence-correlation',
      phase: 'evidence-presentation',
      text: 'Look for gaps between different pieces of evidence. Inconsistencies create reasonable doubt.',
      cost: 10,
      category: 'legal'
    }
  ],
  'witness-examination': [
    {
      id: 'witness-credibility',
      phase: 'witness-examination',
      text: 'Attack witness perception and memory, not their character. Focus on what they could actually see/hear/remember.',
      cost: 15,
      category: 'strategy'
    },
    {
      id: 'witness-bias',
      phase: 'witness-examination',
      text: 'Explore witness relationships and potential biases, but be careful not to appear to be bullying sympathetic witnesses.',
      cost: 10,
      category: 'legal'
    },
    {
      id: 'witness-details',
      phase: 'witness-examination',
      text: 'Pin down specific details. Vague testimony is weak testimony. Force witnesses to commit to specifics.',
      cost: 15,
      category: 'evidence'
    }
  ],
  'closing-arguments': [
    {
      id: 'closing-synthesis',
      phase: 'closing-arguments',
      text: 'Systematically review all evidence that supports your case. This is your last chance to tie everything together.',
      cost: 10,
      category: 'strategy'
    },
    {
      id: 'closing-doubt',
      phase: 'closing-arguments',
      text: 'For defense: Highlight every instance of reasonable doubt. For prosecution: Show how evidence eliminates other possibilities.',
      cost: 15,
      category: 'legal'
    },
    {
      id: 'closing-emotion',
      phase: 'closing-arguments',
      text: 'Now is the time for emotional appeals, but ground them in the evidence. Pure emotion without facts appears desperate.',
      cost: 10,
      category: 'timing'
    }
  ]
};