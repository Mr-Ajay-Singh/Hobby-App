import { createApiClient } from '@/shared/lib/apiClient';
import { useApiConfigStore } from '@/features/skill-learning/store/useApiConfigStore';

export interface CompleteOnboardingPayload {
  hobbyName: string;
  goal?: string;
  experienceLevel?: string;
  weeklyPracticeMinutes?: number;
  displayName?: string;
  avatar?: string;
}

export const submitHobbyOnboarding = async (payload: CompleteOnboardingPayload) => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.post('/api/v1/dashboard/enroll', payload);
  return response.data;
};
