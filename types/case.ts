export interface Evidence {
  id: string;
  type: 'physical' | 'digital' | 'document' | 'testimony';
  title: string;
  description: string;
  reliability: 'high' | 'medium' | 'low';
  source: string;
}

export interface Witness {
  id: string;
  name: string;
  role: string;
  testimony: string;
  credibility: 'high' | 'medium' | 'low';
  relationship: string;
}

export interface CaseScenario {
  caseId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'murder' | 'theft' | 'fraud' | 'assault';
  prosecutionOpening: string;
  evidenceList: Evidence[];
  witnesses: Witness[];
  timeLimit?: number; // in minutes
  pointsAvailable: number;
}

export interface CaseBriefing {
  case: CaseScenario;
  playerRole: 'defense' | 'prosecution';
  objectives: string[];
  tips: string[];
}