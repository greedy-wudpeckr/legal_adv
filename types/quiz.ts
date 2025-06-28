export interface QuizQuestion {
  id: string;
  type: 'text' | 'image' | 'scenario';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: 'constitutional-law' | 'freedom-struggle' | 'legal-reforms' | 'famous-cases';
  points: number;
}

export interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

export interface UserStats {
  totalGames: number;
  totalXP: number;
  level: number;
  accuracyRate: number;
  favoriteCategory: string;
  achievements: Achievement[];
  streakCount: number;
  bestStreak: number;
  categoriesPlayed: Record<string, number>;
  difficultyStats: Record<string, { played: number; won: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  xp: number;
  level: number;
  accuracy: number;
  category: string;
  difficulty: string;
  completedAt: Date;
}

export interface Lifeline {
  id: 'fifty-fifty' | 'ask-expert' | 'extra-time';
  name: string;
  description: string;
  icon: string;
  used: boolean;
  cost: number;
}

export const ACHIEVEMENTS_DATA: Record<string, Omit<Achievement, 'unlockedAt'>> = {
  'first-quiz': {
    id: 'first-quiz',
    name: 'Quiz Rookie',
    description: 'Complete your first quiz',
    icon: '🎯',
    rarity: 'common'
  },
  'perfect-score': {
    id: 'perfect-score',
    name: 'Perfectionist',
    description: 'Get 100% on any quiz',
    icon: '💯',
    rarity: 'rare'
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Answer all questions in under 10 seconds each',
    icon: '⚡',
    rarity: 'epic'
  },
  'streak-master': {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    rarity: 'epic'
  },
  'knowledge-seeker': {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete quizzes in all categories',
    icon: '📚',
    rarity: 'legendary'
  },
  'expert-level': {
    id: 'expert-level',
    name: 'Expert Scholar',
    description: 'Complete an expert level quiz',
    icon: '🎓',
    rarity: 'rare'
  },
  'constitution-master': {
    id: 'constitution-master',
    name: 'Constitution Master',
    description: 'Score 90%+ on Constitutional Law quiz',
    icon: '⚖️',
    rarity: 'epic'
  },
  'history-buff': {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Play 50 total quizzes',
    icon: '🏛️',
    rarity: 'legendary'
  }
};

export const XP_REWARDS = {
  beginner: { base: 10, streak: 5, perfect: 20 },
  intermediate: { base: 15, streak: 8, perfect: 30 },
  expert: { base: 25, streak: 12, perfect: 50 }
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000
];