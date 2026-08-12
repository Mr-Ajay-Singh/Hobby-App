import { HobbyPreset, ExperienceLevelItem, WeeklyTargetItem } from './types';

export const HOBBY_CATALOG: HobbyPreset[] = [
  { name: 'Guitar', emoji: '🎸', category: 'Music', defaultGoals: ['Master basic chords & tuning', 'Play favorite songs by ear', 'Learn fingerpicking technique'] },
  { name: 'Cricket', emoji: '🏏', category: 'Sports', defaultGoals: ['Master batting stance & shot timing', 'Improve bowling accuracy & spin', 'Learn match strategies & field placements'] },
  { name: 'Piano', emoji: '🎹', category: 'Music', defaultGoals: ['Read sheet music & play scales', 'Master two-handed melody & chords', 'Play classical & pop piano pieces'] },
  { name: 'Ludo', emoji: '🎲', category: 'Games', defaultGoals: ['Learn dice probability & safe zone rules', 'Master token movement & capture tactics', 'Win casual & competitive Ludo matches'] },
  { name: 'Chess', emoji: '♟️', category: 'Strategy', defaultGoals: ['Learn opening moves & pawn structure', 'Master tactical sacrifices & endgames', 'Increase chess rating & win online matches'] },
  { name: 'Drawing', emoji: '🎨', category: 'Arts', defaultGoals: ['Master perspective & shading techniques', 'Sketch realistic human anatomy', 'Create digital art & illustration'] },
  { name: 'Spanish', emoji: '🇪🇸', category: 'Language', defaultGoals: ['Master daily conversational fluency', 'Understand spoken podcasts & films', 'Prepare for DELE language certification'] },
  { name: 'Coding', emoji: '💻', category: 'Tech', defaultGoals: ['Build full-stack web applications', 'Master data structures & algorithms', 'Learn Python & React Native development'] },
];

export const EXPERIENCE_LEVELS: ExperienceLevelItem[] = [
  { level: 'beginner', title: 'Complete Beginner', desc: 'Starting from scratch with zero prior knowledge.' },
  { level: 'novice', title: 'Novice / Basics Known', desc: 'Know fundamental rules/concepts, want structured practice.' },
  { level: 'intermediate', title: 'Intermediate', desc: 'Can practice independently, aiming for mastery.' },
  { level: 'advanced', title: 'Advanced / Expert', desc: 'Looking for advanced diagnostics & expert techniques.' },
];

export const WEEKLY_TARGETS: WeeklyTargetItem[] = [
  { minutes: 30, title: 'Casual Practice', desc: '5 mins / day (30 mins / wk)' },
  { minutes: 60, title: 'Steady Pace', desc: '10 mins / day (60 mins / wk)' },
  { minutes: 120, title: 'Recommended', desc: '20 mins / day (120 mins / wk)' },
  { minutes: 300, title: 'Intense Mastery', desc: '45 mins / day (300 mins / wk)' },
];

export const AVATAR_EMOJIS = ['⚡', '🔥', '🎯', '🌟', '🚀', '💎', '🥷', '🎸', '🏆', '🦁', '👑', '🥇'];
