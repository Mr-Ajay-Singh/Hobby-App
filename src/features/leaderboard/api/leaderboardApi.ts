import { createApiClient } from '@/shared/lib/apiClient';
import { useApiConfigStore } from '@/features/skill-learning/store/useApiConfigStore';
import { LeaderboardResponse, LeaderboardType } from '../types';

export const fetchLeaderboard = async (params: {
  type?: LeaderboardType;
  userHobbyId?: string;
  limit?: number;
}): Promise<LeaderboardResponse> => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.get('/api/v1/leaderboard', {
    params: {
      type: params.type || 'weekly',
      userHobbyId: params.userHobbyId,
      limit: params.limit || 20,
    },
  });

  const resData = response.data;
  return resData?.data || resData;
};
