import { createApiClient } from '@/shared/lib/apiClient';
import { useApiConfigStore } from '@/features/skill-learning/store/useApiConfigStore';
import { DashboardResponse } from '../types';

/**
 * Fetch unified dashboard data from GET /api/v1/dashboard
 */
export const fetchDashboardData = async (userHobbyId?: string): Promise<DashboardResponse> => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.get('/api/v1/dashboard', {
    params: { userHobbyId },
  });

  const resData = response.data;
  // Handle backend sendResponse wrapper ({ status: 200, message: "...", data: { ... } })
  const payload = resData?.data || resData;
  const innerData = payload?.data || payload;

  const hobbyInfo = innerData?.hobbyInfo || payload?.hobbyInfo || null;

  return {
    success: payload?.success ?? resData?.success ?? true,
    hasActiveHobby: payload?.hasActiveHobby ?? resData?.hasActiveHobby ?? (!!hobbyInfo),
    data: hobbyInfo ? (innerData?.hobbyInfo ? innerData : payload) : null,
  };
};

export interface UpdateHobbySettingsPayload {
  userHobbyId?: string;
  goal?: string;
  experienceLevel?: string;
  weeklyPracticeMinutes?: number;
  targetDate?: string | null;
  currentStage?: string;
  displayName?: string;
  avatar?: string;
}

/**
 * Update user hobby goal, experience level, & target weekly minutes via POST /api/v1/dashboard/settings
 */
export const updateHobbySettings = async (payload: UpdateHobbySettingsPayload) => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.post('/api/v1/dashboard/settings', payload);
  return response.data;
};

export interface EnrollHobbyPayload {
  hobbyName: string;
  goal?: string;
  experienceLevel?: string;
  weeklyPracticeMinutes?: number;
  targetDate?: string | null;
  displayName?: string;
  avatar?: string;
}

/**
 * Fetch all user hobbies for switcher modal via GET /api/v1/dashboard/hobbies
 */
export const fetchUserHobbiesList = async () => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.get('/api/v1/dashboard/hobbies');
  const resData = response.data;
  const payload = resData?.data || resData;

  return {
    userHobbies: payload?.userHobbies || [],
    catalogHobbies: payload?.catalogHobbies || [],
  };
};

/**
 * Enroll in a new hobby via POST /api/v1/dashboard/enroll
 */
export const enrollNewHobby = async (payload: EnrollHobbyPayload) => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.post('/api/v1/dashboard/enroll', payload);
  return response.data;
};
