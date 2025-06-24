import { PlayerStats, CaseResult, Achievement, ACHIEVEMENTS, calculateLevel, calculateXPEarned } from '@/types/progression';
import { sampleCases } from '@/data/sample-cases';

const STORAGE_KEY = 'apnawakeel_player_stats';

export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return getDefaultPlayerStats();
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getDefaultPlayerStats();
  }
  
  try {
    const stats = JSON.parse(stored);
    // Ensure all required fields exist
    return {
      ...getDefaultPlayerStats(),
      ...stats,
      achievements: stats.achievements?.map((a: any) => ({
        ...a,
        unlockedAt: new Date(a.unlockedAt)
      })) || []
    };
  } catch {
    return getDefaultPlayerStats();
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function getDefaultPlayerStats(): PlayerStats {
  return {
    totalXP: 0,
    level: 0,
    casesWon: 0,
    casesLost: 0,
    currentWinStreak: 0,
    bestWinStreak: 0,
    totalCasesPlayed: 0,
    averageScore: 0,
    perfectChoices: 0,
    totalChoices: 0,
    fastestWin: Infinity,
    achievements: [],
    unlockedCases: ['murder-001'], // First case always unlocked
    unlockedDifficulties: ['beginner']
  };
}

export function updatePlayerStats(
  caseResult: Omit<CaseResult, 'xpEarned' | 'achievementsUnlocked'>,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): { updatedStats: PlayerStats; newAchievements: Achievement[] } {
  const currentStats = getPlayerStats();
  const xpEarned = calculateXPEarned(caseResult, difficulty);
  
  // Update basic stats
  const newTotalXP = currentStats.totalXP + xpEarned;
  const newLevel = calculateLevel(newTotalXP);
  const newTotalCases = currentStats.totalCasesPlayed + 1;
  
  let newWinStreak = currentStats.currentWinStreak;
  let newBestStreak = currentStats.bestWinStreak;
  let newCasesWon = currentStats.casesWon;
  let newCasesLost = currentStats.casesLost;
  
  if (caseResult.won) {
    newWinStreak += 1;
    newBestStreak = Math.max(newBestStreak, newWinStreak);
    newCasesWon += 1;
  } else {
    newWinStreak = 0;
    newCasesLost += 1;
  }
  
  // Update averages
  const newTotalScore = (currentStats.averageScore * currentStats.totalCasesPlayed) + caseResult.score;
  const newAverageScore = newTotalScore / newTotalCases;
  
  const newPerfectChoices = currentStats.perfectChoices + caseResult.perfectChoices;
  const newTotalChoices = currentStats.totalChoices + caseResult.totalChoices;
  
  const newFastestWin = caseResult.won ? Math.min(currentStats.fastestWin, caseResult.timeElapsed) : currentStats.fastestWin;
  
  // Check for new achievements
  const newAchievements = checkAchievements(currentStats, {
    ...caseResult,
    xpEarned,
    achievementsUnlocked: []
  }, {
    newCasesWon,
    newWinStreak,
    newTotalCases,
    newLevel,
    difficulty
  });
  
  // Unlock new content
  const newUnlockedCases = [...currentStats.unlockedCases];
  const newUnlockedDifficulties = [...currentStats.unlockedDifficulties];
  
  // Unlock next case if won
  if (caseResult.won) {
    const currentCaseIndex = sampleCases.findIndex(c => c.caseId === caseResult.caseId);
    if (currentCaseIndex >= 0 && currentCaseIndex < sampleCases.length - 1) {
      const nextCase = sampleCases[currentCaseIndex + 1];
      if (!newUnlockedCases.includes(nextCase.caseId)) {
        newUnlockedCases.push(nextCase.caseId);
      }
    }
  }
  
  // Unlock difficulties based on wins
  if (newCasesWon >= 1 && !newUnlockedDifficulties.includes('intermediate')) {
    newUnlockedDifficulties.push('intermediate');
  }
  if (newCasesWon >= 3 && !newUnlockedDifficulties.includes('advanced')) {
    newUnlockedDifficulties.push('advanced');
  }
  
  const updatedStats: PlayerStats = {
    totalXP: newTotalXP,
    level: newLevel,
    casesWon: newCasesWon,
    casesLost: newCasesLost,
    currentWinStreak: newWinStreak,
    bestWinStreak: newBestStreak,
    totalCasesPlayed: newTotalCases,
    averageScore: newAverageScore,
    perfectChoices: newPerfectChoices,
    totalChoices: newTotalChoices,
    fastestWin: newFastestWin,
    achievements: [...currentStats.achievements, ...newAchievements],
    unlockedCases: newUnlockedCases,
    unlockedDifficulties: newUnlockedDifficulties
  };
  
  savePlayerStats(updatedStats);
  return { updatedStats, newAchievements };
}

function checkAchievements(
  currentStats: PlayerStats,
  caseResult: CaseResult,
  context: {
    newCasesWon: number;
    newWinStreak: number;
    newTotalCases: number;
    newLevel: number;
    difficulty: string;
  }
): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(currentStats.achievements.map(a => a.id));
  
  // First Victory
  if (!existingIds.has('first-victory') && caseResult.won && currentStats.casesWon === 0) {
    newAchievements.push(createAchievement('first-victory'));
  }
  
  // Undefeated (5 wins in a row)
  if (!existingIds.has('undefeated') && context.newWinStreak >= 5) {
    newAchievements.push(createAchievement('undefeated'));
  }
  
  // Master Defender (win all cases)
  if (!existingIds.has('master-defender') && context.newCasesWon >= sampleCases.length) {
    newAchievements.push(createAchievement('master-defender'));
  }
  
  // Quick Thinker (win in under 15 minutes)
  if (!existingIds.has('quick-thinker') && caseResult.won && caseResult.timeElapsed < 900) {
    newAchievements.push(createAchievement('quick-thinker'));
  }
  
  // Perfect Strategist (all perfect choices)
  if (!existingIds.has('perfect-strategist') && caseResult.perfectChoices === caseResult.totalChoices && caseResult.totalChoices > 0) {
    newAchievements.push(createAchievement('perfect-strategist'));
  }
  
  // Legal Eagle (90% accuracy)
  if (!existingIds.has('legal-eagle') && caseResult.accuracy >= 0.9) {
    newAchievements.push(createAchievement('legal-eagle'));
  }
  
  // Courtroom Dominator (score +60 or higher)
  if (!existingIds.has('courtroom-dominator') && caseResult.won && caseResult.score >= 60) {
    newAchievements.push(createAchievement('courtroom-dominator'));
  }
  
  // Veteran Lawyer (10 cases)
  if (!existingIds.has('veteran-lawyer') && context.newTotalCases >= 10) {
    newAchievements.push(createAchievement('veteran-lawyer'));
  }
  
  return newAchievements;
}

function createAchievement(id: string): Achievement {
  const template = ACHIEVEMENTS[id];
  return {
    ...template,
    unlockedAt: new Date()
  };
}

export function getWinRate(stats: PlayerStats): number {
  if (stats.totalCasesPlayed === 0) return 0;
  return (stats.casesWon / stats.totalCasesPlayed) * 100;
}

export function getAccuracyRate(stats: PlayerStats): number {
  if (stats.totalChoices === 0) return 0;
  return (stats.perfectChoices / stats.totalChoices) * 100;
}