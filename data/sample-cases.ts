import { CaseScenario } from '@/types/case';

export const sampleCases: CaseScenario[] = [
  {
    caseId: 'murder-001',
    title: 'The Kitchen Knife Murder',
    description: 'A man was found dead in his apartment with a kitchen knife. The defendant was discovered at the scene, but claims innocence. Examine the evidence and build your case.',
    difficulty: 'beginner',
    category: 'murder',
    prosecutionOpening: "Ladies and gentlemen of the jury, the defendant was found at the scene with the murder weapon in hand. The evidence will show a clear case of premeditated murder. The victim, Mr. Robert Chen, was stabbed three times with his own kitchen knife. The defendant had motive, means, and opportunity.",
    evidenceList: [
      {
        id: 'evidence-001',
        type: 'physical',
        title: 'Kitchen Knife (Murder Weapon)',
        description: '8-inch chef\'s knife found at the scene with victim\'s blood. Defendant\'s fingerprints on handle.',
        reliability: 'high',
        source: 'Crime Scene Investigation Unit'
      },
      {
        id: 'evidence-002',
        type: 'digital',
        title: 'Security Camera Footage',
        description: 'Hallway camera shows defendant entering building at 9:15 PM, leaving at 9:45 PM on night of murder.',
        reliability: 'high',
        source: 'Building Security System'
      },
      {
        id: 'evidence-003',
        type: 'document',
        title: 'Text Message Thread',
        description: 'Heated argument between victim and defendant about unpaid debt of $5,000 from earlier that day.',
        reliability: 'medium',
        source: 'Victim\'s Phone Records'
      },
      {
        id: 'evidence-004',
        type: 'physical',
        title: 'Blood Spatter Analysis',
        description: 'Blood pattern suggests victim was attacked while cooking dinner. No signs of struggle.',
        reliability: 'high',
        source: 'Forensic Laboratory'
      },
      {
        id: 'evidence-005',
        type: 'document',
        title: 'Autopsy Report',
        description: 'Three stab wounds: two superficial, one fatal to the heart. Time of death: 9:30-9:40 PM.',
        reliability: 'high',
        source: 'Medical Examiner'
      }
    ],
    witnesses: [
      {
        id: 'witness-001',
        name: 'Mrs. Sarah Johnson',
        role: 'Neighbor',
        testimony: 'I heard loud voices and what sounded like furniture being moved around 9:30 PM. Then it got very quiet.',
        credibility: 'high',
        relationship: 'Lives next door, no prior relationship with defendant or victim'
      },
      {
        id: 'witness-002',
        name: 'Detective Mike Rodriguez',
        role: 'Lead Investigator',
        testimony: 'Defendant was found sitting in kitchen, knife on counter. Appeared shocked but cooperative. No signs of forced entry.',
        credibility: 'high',
        relationship: 'Professional law enforcement officer'
      },
      {
        id: 'witness-003',
        name: 'Lisa Chen',
        role: 'Victim\'s Sister',
        testimony: 'Robert mentioned he was worried about the defendant. Said he was acting strange lately and making threats about the money.',
        credibility: 'medium',
        relationship: 'Family member of victim, emotionally involved'
      },
      {
        id: 'witness-004',
        name: 'Dr. Amanda Foster',
        role: 'Medical Examiner',
        testimony: 'Wounds consistent with kitchen knife found at scene. Victim died quickly from heart wound. No defensive injuries.',
        credibility: 'high',
        relationship: 'Professional medical expert'
      }
    ],
    timeLimit: 45,
    pointsAvailable: 1000
  }
];

export const getCaseById = (caseId: string): CaseScenario | undefined => {
  return sampleCases.find(caseItem => caseItem.caseId === caseId);
};

export const getCasesByCategory = (category: string): CaseScenario[] => {
  return sampleCases.filter(caseItem => caseItem.category === category);
};

export const getCasesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): CaseScenario[] => {
  return sampleCases.filter(caseItem => caseItem.difficulty === difficulty);
};

export const getCaseStats = () => {
  const stats = {
    total: sampleCases.length,
    byDifficulty: {
      beginner: sampleCases.filter(c => c.difficulty === 'beginner').length,
      intermediate: sampleCases.filter(c => c.difficulty === 'intermediate').length,
      advanced: sampleCases.filter(c => c.difficulty === 'advanced').length
    },
    byCategory: {
      murder: sampleCases.filter(c => c.category === 'murder').length,
      theft: sampleCases.filter(c => c.category === 'theft').length,
      fraud: sampleCases.filter(c => c.category === 'fraud').length,
      assault: sampleCases.filter(c => c.category === 'assault').length
    }
  };
  return stats;
};