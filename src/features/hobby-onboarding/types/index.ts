export interface HobbyPreset {
  name: string;
  emoji: string;
  category: string;
  defaultGoals: string[];
}

export interface ExperienceLevelItem {
  level: 'beginner' | 'novice' | 'intermediate' | 'advanced';
  title: string;
  desc: string;
}

export interface WeeklyTargetItem {
  minutes: number;
  title: string;
  desc: string;
}

export interface OnboardingState {
  step: number;
  selectedHobby: string;
  customHobby: string;
  goal: string;
  experienceLevel: string;
  weeklyMinutes: number;
  displayName: string;
  avatarEmoji: string;
}
