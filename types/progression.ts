export interface PlayerStats {
  totalXP: number;
  level: number;
  casesWon: number;
  casesLost: number;
  currentWinStreak: number;
  bestWinStreak: number;
  totalCasesPlayed: number;
  averageScore: number;
  perfectChoices: number;
  totalChoices: number;
  fastestWin: number; // in seconds
  achievements: Achievement[];
  unlockedCases: string[];
  unlockedDifficulties: ('beginner' | 'intermediate' | 'advanced')[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CaseResult {
  caseId: string;
  won: boolean;
  score: number;
  accuracy: number;
  timeElapsed: number;
  perfectChoices: number;
  totalChoices: number;
  xpEarned: number;
  achievementsUnlocked: Achievement[];
}

export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlockedAt'>> = {
  'first-victory': {
    id: 'first-victory',
    name: 'First Victory',
    description: 'Win your first case',
    icon: '🏆',
    xpReward: 100,
    rarity: 'common'
  },
  'undefeated': {
    id: 'undefeated',
    name: 'Undefeated',
    description: 'Win 5 cases in a row',
    icon: '🔥',
    xpReward: 500,
    rarity: 'rare'
  },
  'master-defender': {
    id: 'master-defender',
    name: 'Master Defender',
    description: 'Win all available cases',
    icon: '👑',
    xpReward: 1000,
    rarity: 'legendary'
  },
  'quick-thinker': {
    id: 'quick-thinker',
    name: 'Quick Thinker',
    description: 'Win a case in under 15 minutes',
    icon: '⚡',
    xpReward: 200,
    rarity: 'common'
  },
  'perfect-strategist': {
    id: 'perfect-strategist',
    name: 'Perfect Strategist',
    description: 'Make only perfect choices in a case',
    icon: '🎯',
    xpReward: 300,
    rarity: 'rare'
  },
  'legal-eagle': {
    id: 'legal-eagle',
    name: 'Legal Eagle',
    description: 'Achieve 90% accuracy in a case',
    icon: '🦅',
    xpReward: 250,
    rarity: 'rare'
  },
  'courtroom-dominator': {
    id: 'courtroom-dominator',
    name: 'Courtroom Dominator',
    description: 'Win with a score of +60 or higher',
    icon: '💎',
    xpReward: 400,
    rarity: 'epic'
  },
  'comeback-king': {
    id: 'comeback-king',
    name: 'Comeback King',
    description: 'Win after being behind by 40+ points',
    icon: '🔄',
    xpReward: 350,
    rarity: 'epic'
  },
  'veteran-lawyer': {
    id: 'veteran-lawyer',
    name: 'Veteran Lawyer',
    description: 'Complete 10 cases',
    icon: '📚',
    xpReward: 300,
    rarity: 'rare'
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Make all choices in under 10 seconds each',
    icon: '💨',
    xpReward: 200,
    rarity: 'rare'
  }
};

export const XP_REWARDS = {
  beginner: {
    base: 100,
    win: 200,
    perfectChoice: 25,
    timeBonus: 50 // if completed quickly
  },
  intermediate: {
    base: 200,
    win: 400,
    perfectChoice: 40,
    timeBonus: 100
  },
  advanced: {
    base: 300,
    win: 600,
    perfectChoice: 60,
    timeBonus: 150
  }
};

export const LEVEL_THRESHOLDS = [
  0, 500, 1200, 2000, 3000, 4500, 6500, 9000, 12000, 15500, 20000
];

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i;
    }
  }
  return 0;
}

export function getXPForNextLevel(currentLevel: number): number {
  return LEVEL_THRESHOLDS[currentLevel + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function calculateXPEarned(
  caseResult: Omit<CaseResult, 'xpEarned' | 'achievementsUnlocked'>,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const rewards = XP_REWARDS[difficulty];
  let xp = rewards.base;
  
  if (caseResult.won) {
    xp += rewards.win;
  }
  
  // Perfect choice bonus
  xp += caseResult.perfectChoices * rewards.perfectChoice;
  
  // Time bonus (if completed in under half the time limit)
  if (caseResult.timeElapsed < 900) { // 15 minutes
    xp += rewards.timeBonus;
  }
  
  // Accuracy bonus
  if (caseResult.accuracy >= 0.9) {
    xp += 100;
  } else if (caseResult.accuracy >= 0.75) {
    xp += 50;
  }
  
  return Math.floor(xp);
}