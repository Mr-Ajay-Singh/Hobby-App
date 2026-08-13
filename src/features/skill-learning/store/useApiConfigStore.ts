import { create } from 'zustand';
import { getDefaultBaseUrl } from '@/shared/lib/urlUtils';
import { AudioVoice, LearningForm } from '../schemas/skillChatSchema';

export interface ApiConfigState {
  baseUrl: string;
  model: string;
  voice: AudioVoice | string;
  requestedForms: LearningForm[];
  setBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: AudioVoice | string) => void;
  setRequestedForms: (forms: LearningForm[]) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG = {
  baseUrl: getDefaultBaseUrl(),
  model: 'gemini',
  voice: 'alloy' as AudioVoice,
  requestedForms: [
    'text',
    'svg',
    'audio',
    'interactive_quiz',
    'flashcard',
    'checklist',
  ] as LearningForm[],
};

export const useApiConfigStore = create<ApiConfigState>((set) => ({
  ...DEFAULT_CONFIG,
  setBaseUrl: (baseUrl) => set({ baseUrl }),
  setModel: (model) => set({ model }),
  setVoice: (voice) => set({ voice }),
  setRequestedForms: (requestedForms) => set({ requestedForms }),
  resetConfig: () => set({ ...DEFAULT_CONFIG }),
}));
