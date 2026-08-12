import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from './leaderboardApi';
import { LeaderboardType } from '../types';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (type: LeaderboardType = 'weekly', userHobbyId?: string) =>
    [...leaderboardKeys.all, type, { userHobbyId }] as const,
};

export const useLeaderboardQuery = (
  type: LeaderboardType = 'weekly',
  userHobbyId?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: leaderboardKeys.list(type, userHobbyId),
    queryFn: () => fetchLeaderboard({ type, userHobbyId }),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
