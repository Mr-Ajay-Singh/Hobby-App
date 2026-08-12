export * from '../schemas/skillChatSchema';

export const RESPONSE_TYPE = {
  CLARIFICATION: 'clarification',
  LEARNING_CONTENT: 'learning_content',
  PRACTICE_DRILL: 'practice_drill',
  ASSESSMENT: 'assessment',
  OFF_TOPIC_REDIRECT: 'off_topic_redirect',
} as const;

export const LEARNING_FORM = {
  TEXT: 'text',
  SVG: 'svg',
  AUDIO: 'audio',
  INTERACTIVE_QUIZ: 'interactive_quiz',
  FLASHCARD: 'flashcard',
  MUSICAL_NOTES: 'musical_notes',
  CHECKLIST: 'checklist',
  VIDEO: 'video',
  CODE_SNIPPET: 'code_snippet',
} as const;

export const SKILL_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const SKILL_TYPE = {
  KNOWLEDGE: 'knowledge',
  PHYSICAL: 'physical',
  CREATIVE: 'creative',
  TECHNICAL: 'technical',
  STRATEGIC: 'strategic',
} as const;

export const AUDIO_VOICE = {
  ALLOY: 'alloy',
  ECHO: 'echo',
  FABLE: 'fable',
  ONYX: 'onyx',
  NOVA: 'nova',
  SHIMMER: 'shimmer',
} as const;

export const getSkillLevelColor = (level?: string, score?: number): string => {
  if (typeof score === 'number') {
    if (score <= 25) return '#4CAF50'; // Beginner Green
    if (score <= 50) return '#2196F3'; // Intermediate Blue
    if (score <= 75) return '#9C27B0'; // Advanced Purple
    return '#FF9800';                 // Expert Gold
  }
  const l = (level || '').toLowerCase();
  switch (l) {
    case 'beginner': return '#4CAF50';
    case 'intermediate': return '#2196F3';
    case 'advanced': return '#9C27B0';
    case 'expert': return '#FF9800';
    default: return '#38BDF8';
  }
};
