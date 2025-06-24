export interface LeaderboardEntry {
  id: string;
  playerName: string;
  caseId: string;
  caseName: string;
  timeElapsed: number;
  score: number;
  accuracy: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completedAt: Date;
  role: 'defense' | 'prosecution';
}

export interface Leaderboard {
  fastestWins: LeaderboardEntry[];
  highestScores: LeaderboardEntry[];
  bestAccuracy: LeaderboardEntry[];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getDifficultyMultiplier(difficulty: string): number {
  switch (difficulty) {
    case 'beginner': return 1;
    case 'intermediate': return 1.5;
    case 'advanced': return 2;
    default: return 1;
  }
}