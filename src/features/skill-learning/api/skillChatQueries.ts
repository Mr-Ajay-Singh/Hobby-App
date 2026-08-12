import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendLearnSkillMessage,
  fetchChatHistory,
  submitQuizAnswer,
  completeTask,
  SendSkillMessagePayload,
  SubmitQuizPayload,
  CompleteTaskPayload,
} from './skillChatApi';
import { useSkillChatStore, ChatTurnItem } from '../store/useSkillChatStore';
import { LearningResponse, ChatHistoryResponse } from '../schemas/skillChatSchema';

// ─── Query Key Factories ──────────────────────────────────────────────────────

export const skillChatKeys = {
  all: ['skill-chat'] as const,
  history: (page = 1, limit = 20, userHobbyId?: string) =>
    [...skillChatKeys.all, 'history', { page, limit, userHobbyId }] as const,
  session: (conversationId?: string) => [...skillChatKeys.all, 'session', conversationId] as const,
};

// ─── TanStack Query: Fetch Chat History ──────────────────────────────────────

export const useChatHistoryQuery = (page = 1, limit = 20, enabled = true) => {
  const setConversationId = useSkillChatStore((s) => s.setConversationId);
  const userHobbyId = useSkillChatStore((s) => s.userHobbyId);
  const setMessages = useSkillChatStore((s) => s.setMessages);

  return useQuery<ChatHistoryResponse, Error>({
    queryKey: skillChatKeys.history(page, limit, userHobbyId),
    queryFn: async () => {
      const data = await fetchChatHistory({ page, limit, userHobbyId });

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Convert backend history to ChatTurnItem format
      const formatted: ChatTurnItem[] = (data.messages || []).map((msg) => {
        const timeStr = msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Recent';

        if (msg.role === 'user') {
          return {
            id: msg.id,
            role: 'user',
            content: msg.content,
            timestamp: timeStr,
          };
        }

        let learningContent = msg.parsedContent;
        if (!learningContent && msg.content) {
          try {
            learningContent = JSON.parse(msg.content);
          } catch (_) {
            learningContent = { formsDelivered: ['text'], text: msg.content };
          }
        }

        return {
          id: msg.id,
          role: 'assistant',
          data: {
            success: true,
            conversationId: msg.conversationId || data.conversationId || '',
            messageId: msg.id,
            responseType: 'learning_content',
            learningContent: learningContent || { formsDelivered: ['text'], text: msg.content },
          },
          timestamp: timeStr,
        };
      });

      if (page === 1) {
        setMessages(formatted);
      } else {
        setMessages((prev) => [...formatted, ...prev]);
      }

      return data;
    },
    enabled,
  });
};

// ─── TanStack Query: Send Skill Learning Message Mutation ─────────────────────

export const useSendSkillMessageMutation = () => {
  const queryClient = useQueryClient();
  const conversationId = useSkillChatStore((s) => s.conversationId);
  const userHobbyId = useSkillChatStore((s) => s.userHobbyId);
  const setConversationId = useSkillChatStore((s) => s.setConversationId);
  const setSkillInfo = useSkillChatStore((s) => s.setSkillInfo);
  const appendMessage = useSkillChatStore((s) => s.appendMessage);
  const setLastFailedPrompt = useSkillChatStore((s) => s.setLastFailedPrompt);

  return useMutation<LearningResponse, Error, SendSkillMessagePayload>({
    mutationFn: async (payload) => {
      const activePayload: SendSkillMessagePayload = {
        ...payload,
        conversationId: payload.conversationId || conversationId,
        userHobbyId: payload.userHobbyId || userHobbyId,
      };
      return sendLearnSkillMessage(activePayload);
    },
    onMutate: async (newPrompt) => {
      setLastFailedPrompt(null);

      // Add user turn immediately (optimistic UI)
      const userTurn: ChatTurnItem = {
        id: 'usr_' + Date.now(),
        role: 'user',
        content: newPrompt.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      appendMessage(userTurn);
    },
    onSuccess: (data) => {
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      if (data.skillInfo) {
        setSkillInfo(data.skillInfo);
      }

      // Add assistant turn
      const assistantTurn: ChatTurnItem = {
        id: data.messageId || 'ai_' + Date.now(),
        role: 'assistant',
        data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      appendMessage(assistantTurn);

      // Invalidate history query in background
      queryClient.invalidateQueries({ queryKey: skillChatKeys.all });
    },
    onError: (err, variables) => {
      console.warn('[SkillChatMutation] Error:', err);
      setLastFailedPrompt(variables.message);

      const errorTurn: ChatTurnItem = {
        id: 'err_' + Date.now(),
        role: 'error',
        content: err.message || 'Failed to send message to backend.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      appendMessage(errorTurn);
    },
  });
};

/**
 * Mutation for submitting a quiz answer
 */
export const useSubmitQuizMutation = () => {
  const queryClient = useQueryClient();
  const setSkillInfo = useSkillChatStore((s) => s.setSkillInfo);
  const skillInfo = useSkillChatStore((s) => s.skillInfo);

  return useMutation<any, Error, SubmitQuizPayload>({
    mutationFn: submitQuizAnswer,
    onSuccess: (data) => {
      if (data?.success && data?.xpAwarded > 0) {
        setSkillInfo({
          skillName: skillInfo?.skillName || 'Skill Practice',
          currentLevel: data.newLevel || skillInfo?.currentLevel || 'beginner',
          score: data.newScore ?? skillInfo?.score ?? 0,
        });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      }
    },
  });
};

/**
 * Mutation for marking a practice task completed
 */
export const useCompleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const setSkillInfo = useSkillChatStore((s) => s.setSkillInfo);
  const skillInfo = useSkillChatStore((s) => s.skillInfo);

  return useMutation<any, Error, CompleteTaskPayload>({
    mutationFn: completeTask,
    onSuccess: (data) => {
      if (data?.success && data?.xpAwarded > 0) {
        setSkillInfo({
          skillName: skillInfo?.skillName || 'Skill Practice',
          currentLevel: data.newLevel || skillInfo?.currentLevel || 'beginner',
          score: data.newScore ?? skillInfo?.score ?? 0,
        });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      }
    },
  });
};
