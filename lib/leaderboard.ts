import { LeaderboardEntry, Leaderboard } from '@/types/leaderboard';

const STORAGE_KEY = 'apnawakeel_leaderboard';
const MAX_ENTRIES_PER_CATEGORY = 10;

export function getLeaderboard(): Leaderboard {
  if (typeof window === 'undefined') {
    return { fastestWins: [], highestScores: [], bestAccuracy: [] };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { fastestWins: [], highestScores: [], bestAccuracy: [] };
  }
  
  try {
    const data = JSON.parse(stored);
    return {
      fastestWins: data.fastestWins?.map((entry: any) => ({
        ...entry,
        completedAt: new Date(entry.completedAt)
      })) || [],
      highestScores: data.highestScores?.map((entry: any) => ({
        ...entry,
        completedAt: new Date(entry.completedAt)
      })) || [],
      bestAccuracy: data.bestAccuracy?.map((entry: any) => ({
        ...entry,
        completedAt: new Date(entry.completedAt)
      })) || []
    };
  } catch {
    return { fastestWins: [], highestScores: [], bestAccuracy: [] };
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>): void {
  if (typeof window === 'undefined') return;
  
  const leaderboard = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  
  // Add to fastest wins (only if won)
  if (entry.score > 20) {
    leaderboard.fastestWins.push(newEntry);
    leaderboard.fastestWins.sort((a, b) => a.timeElapsed - b.timeElapsed);
    leaderboard.fastestWins = leaderboard.fastestWins.slice(0, MAX_ENTRIES_PER_CATEGORY);
  }
  
  // Add to highest scores
  leaderboard.highestScores.push(newEntry);
  leaderboard.highestScores.sort((a, b) => b.score - a.score);
  leaderboard.highestScores = leaderboard.highestScores.slice(0, MAX_ENTRIES_PER_CATEGORY);
  
  // Add to best accuracy (only if accuracy > 75%)
  if (entry.accuracy > 0.75) {
    leaderboard.bestAccuracy.push(newEntry);
    leaderboard.bestAccuracy.sort((a, b) => b.accuracy - a.accuracy);
    leaderboard.bestAccuracy = leaderboard.bestAccuracy.slice(0, MAX_ENTRIES_PER_CATEGORY);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
}

export function getPlayerRank(playerName: string, category: keyof Leaderboard): number {
  const leaderboard = getLeaderboard();
  const entries = leaderboard[category];
  const playerEntries = entries.filter(entry => entry.playerName === playerName);
  
  if (playerEntries.length === 0) return -1;
  
  const bestEntry = playerEntries[0];
  return entries.findIndex(entry => entry.id === bestEntry.id) + 1;
}