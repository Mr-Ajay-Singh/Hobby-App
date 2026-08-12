import { create } from 'zustand';
import { SkillInfo } from '../schemas/skillChatSchema';

export interface ChatTurnItem {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content?: string;
  data?: any;
  timestamp: string;
}

export interface SkillChatState {
  conversationId?: string;
  userHobbyId?: string;
  skillInfo: SkillInfo | null;
  inputMessage: string;
  lastFailedPrompt: string | null;
  messages: ChatTurnItem[];
  setConversationId: (id?: string) => void;
  setUserHobbyId: (id?: string) => void;
  setSkillInfo: (info: SkillInfo | null) => void;
  setInputMessage: (msg: string) => void;
  setLastFailedPrompt: (prompt: string | null) => void;
  setMessages: (messages: ChatTurnItem[] | ((prev: ChatTurnItem[]) => ChatTurnItem[])) => void;
  appendMessage: (message: ChatTurnItem) => void;
  prependMessages: (messages: ChatTurnItem[]) => void;
  resetChat: () => void;
}

export const useSkillChatStore = create<SkillChatState>((set) => ({
  conversationId: undefined,
  userHobbyId: undefined,
  skillInfo: null,
  inputMessage: '',
  lastFailedPrompt: null,
  messages: [],
  setConversationId: (conversationId) => set({ conversationId }),
  setUserHobbyId: (userHobbyId) => set({ userHobbyId }),
  setSkillInfo: (skillInfo) => set({ skillInfo }),
  setInputMessage: (inputMessage) => set({ inputMessage }),
  setLastFailedPrompt: (lastFailedPrompt) => set({ lastFailedPrompt }),
  setMessages: (updater) =>
    set((state) => ({
      messages: typeof updater === 'function' ? updater(state.messages) : updater,
    })),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  prependMessages: (newMessages) =>
    set((state) => ({ messages: [...newMessages, ...state.messages] })),
  resetChat: () =>
    set({
      conversationId: undefined,
      userHobbyId: undefined,
      skillInfo: null,
      inputMessage: '',
      lastFailedPrompt: null,
      messages: [],
    }),
}));
