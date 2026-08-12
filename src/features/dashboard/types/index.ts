export interface DashboardHobbyInfo {
  userHobbyId: string;
  hobbyId: string;
  hobbyName: string;
  hobbySlug: string;
  capabilities: string[];
  status: string;
}

export interface DashboardCurrentStage {
  stage: string;
  allStages: string[];
  stepNumber: number;
  totalSteps: number;
  progressPercentage: number;
  isOnboardingCompleted?: boolean;
  nextOnboardingStep?: string;
}

export interface DashboardGoalAndTarget {
  goal: string;
  experienceLevel: string;
  targetDate: string | null;
  daysRemaining: number | null;
}

export interface DashboardWeeklyTracker {
  targetWeeklyMinutes: number;
  practicedThisWeekMinutes: number;
  progressPercentage: number;
}

export interface DashboardQuickStats {
  totalPracticeTimeMinutes: number;
  totalPracticeTimeFormatted: string;
  totalSessionsCompleted: number;
  overallSkillMasteryScore: number;
  averageConfidence: number;
  totalSkillsTracked: number;
}

export interface DashboardData {
  hobbyInfo: DashboardHobbyInfo;
  currentStage: DashboardCurrentStage;
  goalAndTarget: DashboardGoalAndTarget;
  weeklyPracticeTracker: DashboardWeeklyTracker;
  quickStats: DashboardQuickStats;
}

export interface DashboardResponse {
  success: boolean;
  hasActiveHobby: boolean;
  message?: string;
  data: DashboardData | null;
}
