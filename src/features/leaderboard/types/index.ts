export type LeaderboardType = 'weekly' | 'alltime';

export interface LeaderboardUser {
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  score: number;
  dailyXpEarned: number;
  level: string;
  streakCount: number;
  rank: number;
  isCurrentUser: boolean;
  xpNeededToOvertake?: number;
}

export interface LeaderboardResponse {
  success: boolean;
  type: LeaderboardType;
  podium: LeaderboardUser[];
  rankings: LeaderboardUser[];
  currentUserRank: LeaderboardUser | null;
}
