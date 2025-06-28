import { UserStats, LeaderboardEntry, Achievement, ACHIEVEMENTS_DATA, LEVEL_THRESHOLDS } from '@/types/quiz';

const USER_STATS_KEY = 'apni_history_user_stats';
const LEADERBOARD_KEY = 'apni_history_leaderboard';

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return getDefaultUserStats();
  }
  
  const stored = localStorage.getItem(USER_STATS_KEY);
  if (!stored) {
    return getDefaultUserStats();
  }
  
  try {
    const stats = JSON.parse(stored);
    return {
      ...getDefaultUserStats(),
      ...stats,
      achievements: stats.achievements?.map((a: any) => ({
        ...a,
        unlockedAt: new Date(a.unlockedAt)
      })) || []
    };
  } catch {
    return getDefaultUserStats();
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  if (!stored) return [];
  
  try {
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      completedAt: new Date(entry.completedAt)
    })).sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
  } catch {
    return [];
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>): void {
  if (typeof window === 'undefined') return;
  
  const leaderboard = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 100 entries
  const topEntries = leaderboard.slice(0, 100);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
}

function getDefaultUserStats(): UserStats {
  return {
    totalGames: 0,
    totalXP: 0,
    level: 0,
    accuracyRate: 0,
    favoriteCategory: '',
    achievements: [],
    streakCount: 0,
    bestStreak: 0,
    categoriesPlayed: {},
    difficultyStats: {
      beginner: { played: 0, won: 0 },
      intermediate: { played: 0, won: 0 },
      expert: { played: 0, won: 0 }
    }
  };
}

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

export function checkAchievements(
  stats: UserStats,
  quizResults: {
    score: number;
    totalQuestions: number;
    category: string;
    difficulty: string;
    averageTime: number;
    streak: number;
  }
): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(stats.achievements.map(a => a.id));

  // First quiz
  if (!existingIds.has('first-quiz') && stats.totalGames === 0) {
    newAchievements.push(createAchievement('first-quiz'));
  }

  // Perfect score
  if (!existingIds.has('perfect-score') && quizResults.score === quizResults.totalQuestions) {
    newAchievements.push(createAchievement('perfect-score'));
  }

  // Speed demon
  if (!existingIds.has('speed-demon') && quizResults.averageTime <= 10) {
    newAchievements.push(createAchievement('speed-demon'));
  }

  // Streak master
  if (!existingIds.has('streak-master') && quizResults.streak >= 10) {
    newAchievements.push(createAchievement('streak-master'));
  }

  // Expert level
  if (!existingIds.has('expert-level') && quizResults.difficulty === 'expert') {
    newAchievements.push(createAchievement('expert-level'));
  }

  // Constitution master
  if (!existingIds.has('constitution-master') && 
      quizResults.category === 'constitutional-law' && 
      (quizResults.score / quizResults.totalQuestions) >= 0.9) {
    newAchievements.push(createAchievement('constitution-master'));
  }

  // Knowledge seeker (all categories)
  const categoriesPlayed = Object.keys(stats.categoriesPlayed).length;
  if (!existingIds.has('knowledge-seeker') && categoriesPlayed >= 4) {
    newAchievements.push(createAchievement('knowledge-seeker'));
  }

  // History buff
  if (!existingIds.has('history-buff') && stats.totalGames >= 49) { // 49 because we add 1 later
    newAchievements.push(createAchievement('history-buff'));
  }

  return newAchievements;
}

function createAchievement(id: string): Achievement {
  const template = ACHIEVEMENTS_DATA[id];
  return {
    ...template,
    unlockedAt: new Date()
  };
}