import { z } from 'zod';

// ─── Enums & Literals ─────────────────────────────────────────────────────────

export const responseTypeSchema = z.enum([
  'clarification',
  'learning_content',
  'practice_drill',
  'assessment',
  'off_topic_redirect',
]);

export const learningFormSchema = z.enum([
  'text',
  'svg',
  'audio',
  'interactive_quiz',
  'flashcard',
  'musical_notes',
  'checklist',
  'video',
  'code_snippet',
]);

export const skillLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);

export const skillTypeSchema = z.enum([
  'knowledge',
  'physical',
  'creative',
  'technical',
  'strategic',
]);

export const audioVoiceSchema = z.enum([
  'alloy',
  'echo',
  'fable',
  'onyx',
  'nova',
  'shimmer',
]);

// ─── Form Data Schemas ───────────────────────────────────────────────────────

export const audioContentSchema = z.object({
  script: z.string(),
  base64: z.string().optional(),
  audioUrl: z.string().nullable().optional(),
  mimeType: z.string().optional(),
  status: z.string().optional(),
});

export const quizItemSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number().int(),
  explanation: z.string(),
});

export const flashcardItemSchema = z.object({
  front: z.string(),
  back: z.string(),
  category: z.string().optional(),
});

export const musicalNoteSchema = z.object({
  note: z.string(),
  finger: z.number(),
  durationMs: z.number(),
});

export const musicalNotesContentSchema = z.object({
  instrument: z.string(),
  bpm: z.number(),
  notes: z.array(musicalNoteSchema),
});

export const checklistItemSchema = z.object({
  step: z.number(),
  title: z.string(),
  instruction: z.string(),
});

export const videoContentSchema = z.object({
  title: z.string(),
  embedUrl: z.string(),
  startTimeSeconds: z.number().optional(),
  durationSeconds: z.number().optional(),
});

export const codeSnippetContentSchema = z.object({
  language: z.string(),
  code: z.string(),
  expectedOutput: z.string().optional(),
});

export const skillInfoSchema = z.object({
  skillName: z.string(),
  currentLevel: z.string(),
  score: z.number(),
  skillType: z.string().optional(),
});

export const learningContentSchema = z.object({
  formsDelivered: z.array(z.string()).default(['text']),
  text: z.string().default(''),
  svg: z.string().nullable().optional(),
  audio: audioContentSchema.nullable().optional(),
  quiz: z.array(quizItemSchema).nullable().optional(),
  flashcards: z.array(flashcardItemSchema).nullable().optional(),
  flashcard: z.array(flashcardItemSchema).nullable().optional(),
  musicalNotes: musicalNotesContentSchema.nullable().optional(),
  checklist: z.array(checklistItemSchema).nullable().optional(),
  video: videoContentSchema.nullable().optional(),
  codeSnippet: codeSnippetContentSchema.nullable().optional(),
  practiceTask: z.string().nullable().optional(),
});

export const learningResponseSchema = z.object({
  success: z.boolean().default(true),
  conversationId: z.string(),
  messageId: z.string().optional().default(''),
  responseType: responseTypeSchema.default('learning_content'),
  skillInfo: skillInfoSchema.optional(),
  learningContent: learningContentSchema,
  error: z.string().optional(),
});

export const chatHistoryMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string().optional(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  parsedContent: learningContentSchema.nullable().optional(),
  contentType: z.string().optional(),
  assetIds: z.array(z.string()).optional(),
  createdAt: z.string(),
});

export const chatHistoryResponseSchema = z.object({
  success: z.boolean().default(true),
  conversationId: z.string().nullable().default(null),
  page: z.number().int().default(1),
  limit: z.number().int().default(20),
  totalMessages: z.number().int().default(0),
  totalPages: z.number().int().default(0),
  hasMore: z.boolean().default(false),
  messages: z.array(chatHistoryMessageSchema).default([]),
});

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type ResponseType = z.infer<typeof responseTypeSchema>;
export type LearningForm = z.infer<typeof learningFormSchema>;
export type SkillLevel = z.infer<typeof skillLevelSchema>;
export type SkillType = z.infer<typeof skillTypeSchema>;
export type AudioVoice = z.infer<typeof audioVoiceSchema>;
export type AudioContent = z.infer<typeof audioContentSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;
export type FlashcardItem = z.infer<typeof flashcardItemSchema>;
export type MusicalNote = z.infer<typeof musicalNoteSchema>;
export type MusicalNotesContent = z.infer<typeof musicalNotesContentSchema>;
export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type VideoContent = z.infer<typeof videoContentSchema>;
export type CodeSnippetContent = z.infer<typeof codeSnippetContentSchema>;
export type SkillInfo = z.infer<typeof skillInfoSchema>;
export type LearningContent = z.infer<typeof learningContentSchema>;
export type LearningResponse = z.infer<typeof learningResponseSchema>;
export type ChatHistoryMessage = z.infer<typeof chatHistoryMessageSchema>;
export type ChatHistoryResponse = z.infer<typeof chatHistoryResponseSchema>;
