import { createApiClient } from '@/shared/lib/apiClient';
import { useApiConfigStore } from '../store/useApiConfigStore';
import {
  LearningResponse,
  learningResponseSchema,
  ChatHistoryResponse,
  chatHistoryResponseSchema,
  LearningForm,
  AudioVoice,
} from '../schemas/skillChatSchema';

export interface SendSkillMessagePayload {
  message: string;
  conversationId?: string;
  userId?: string;
  userHobbyId?: string;
  hobbySkillId?: string;
  options?: {
    model?: string;
    voice?: AudioVoice | string;
    requestedForms?: LearningForm[];
  };
}

/**
 * Sends a POST request to POST /api/v1/ai/learn-skill
 * Validates the response at runtime using Zod
 */
export const sendLearnSkillMessage = async (
  payload: SendSkillMessagePayload
): Promise<LearningResponse> => {
  const { baseUrl, model, voice, requestedForms } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const requestBody: SendSkillMessagePayload = {
    message: payload.message,
    conversationId: payload.conversationId,
    userId: payload.userId,
    userHobbyId: payload.userHobbyId,
    hobbySkillId: payload.hobbySkillId,
    options: {
      model: payload.options?.model || model,
      voice: payload.options?.voice || voice,
      requestedForms: payload.options?.requestedForms || requestedForms,
    },
  };

  const response = await client.post('/api/v1/ai/learn-skill', requestBody);
  const resData = response.data;

  // Automatically unwrap standard backend wrapper ({ status: 200, data: { ... } })
  const rawPayload =
    resData && resData.data && (resData.data.learningContent || resData.data.responseType || resData.data.conversationId)
      ? resData.data
      : resData;

  // Runtime Zod Validation
  try {
    return learningResponseSchema.parse(rawPayload);
  } catch (zodError) {
    console.warn('[Zod Warning] Schema mismatch in learn-skill response, using fallback parse:', zodError);
    return rawPayload as LearningResponse;
  }
};

/**
 * Sends a GET request to GET /api/v1/ai/chat-history
 * Validates the response at runtime using Zod
 */
export const fetchChatHistory = async (params: {
  page?: number;
  limit?: number;
  conversationId?: string;
  userHobbyId?: string;
}): Promise<ChatHistoryResponse> => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const page = params.page || 1;
  const limit = params.limit || 20;

  const response = await client.get('/api/v1/ai/chat-history', {
    params: {
      page,
      limit,
      conversationId: params.conversationId,
      userHobbyId: params.userHobbyId,
    },
  });

  const resData = response.data;

  const rawPayload =
    resData && resData.data && Array.isArray(resData.data.messages)
      ? resData.data
      : resData;

  // Runtime Zod Validation
  try {
    return chatHistoryResponseSchema.parse(rawPayload);
  } catch (zodError) {
    console.warn('[Zod Warning] Schema mismatch in chat-history response, using fallback parse:', zodError);
    return rawPayload as ChatHistoryResponse;
  }
};

export interface SubmitQuizPayload {
  userHobbyId?: string;
  hobbySkillId?: string;
  quizId: string;
  questionIndex: number;
  selectedIndex: number;
  correctIndex: number;
}

export const submitQuizAnswer = async (payload: SubmitQuizPayload) => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.post('/api/v1/ai/submit-quiz', payload);
  return response.data;
};

export interface CompleteTaskPayload {
  userHobbyId?: string;
  hobbySkillId?: string;
  taskId: string;
  taskTitle?: string;
}

export const completeTask = async (payload: CompleteTaskPayload) => {
  const { baseUrl } = useApiConfigStore.getState();
  const client = createApiClient(baseUrl);

  const response = await client.post('/api/v1/ai/complete-task', payload);
  return response.data;
};
