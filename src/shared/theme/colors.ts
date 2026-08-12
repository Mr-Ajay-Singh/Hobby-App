/**
 * Impeccable Design System — Color Tokens & Theme Architecture
 * 
 * 1. Palette: Raw primitive color values (Never consume directly in UI components)
 * 2. Colors: Semantic design tokens (Always consume these in UI components)
 */

export const Palette = {
  // Dark Background Slates
  slate950: '#07090F',
  slate900: '#0F121C',
  slate850: '#121622',
  slate800: '#161B28',
  slate750: '#1B2132',
  slate700: '#242C3F',
  slate600: '#2D374D',
  slate500: '#4B5563',
  slate400: '#6B7280',
  slate300: '#9CA3AF',
  slate200: '#CBD5E1',
  slate100: '#F1F5F9',
  white: '#FFFFFF',

  // Deep Violet / Gamified Purple Scale
  purple950: '#0B0813',
  purple900: '#151124',
  purple850: '#191329',
  purple800: '#1E1933',
  purple700: '#271B47',
  purple600: '#3730A3',
  purple500: '#9333EA',
  purple400: '#A855F7',
  purple300: '#C084FC',
  purple100: '#F3E8FF',

  // Cyan / Progress Accent Scale
  cyan900: '#0D2D44',
  cyan800: '#163854',
  cyan700: '#1E2638',
  cyan600: '#0284C7',
  cyan500: '#38BDF8',
  cyan400: '#7DD3FC',
  cyan100: '#E0F2FE',

  // Primary Blue Action Scale
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue100: '#DBEAFE',

  // Gamification Statuses: Gold / Green / Red
  amber950: '#261908',
  amber900: '#451A03',
  amber800: '#78350F',
  amber700: '#D97706',
  amber500: '#F59E0B',
  amber400: '#FBBF24',

  emerald950: '#042F2E',
  emerald900: '#064E3B',
  emerald800: '#065F46',
  emerald700: '#15803D',
  emerald600: '#16A34A',
  emerald500: '#22C55E',
  emerald400: '#34D399',

  red950: '#1E1215',
  red900: '#4A1D24',
  red800: '#7F1D1D',
  red600: '#DC2626',
  red500: '#EF4444',
  red400: '#F87171',
} as const;

export const Colors = {
  // ─── Surfaces & Backgrounds ───────────────────────────────────────────────
  bgApp: Palette.slate900,
  bgAppAlt: Palette.purple950,
  bgCard: Palette.slate800,
  bgCardAlt: Palette.purple900,
  bgCardSubtle: Palette.slate750,
  bgInput: Palette.slate950,
  bgOverlay: 'rgba(0, 0, 0, 0.75)',

  // ─── Borders & Separators ──────────────────────────────────────────────────
  borderSubtle: Palette.slate750,
  borderCard: Palette.slate700,
  borderHighlight: Palette.cyan500,
  borderPurple: Palette.purple500,

  // ─── Typography Colors ─────────────────────────────────────────────────────
  textPrimary: Palette.white,
  textSecondary: Palette.slate300,
  textMuted: Palette.slate400,
  textSubtle: Palette.slate500,
  textCyan: Palette.cyan500,
  textAmber: Palette.amber500,
  textPurple: Palette.purple300,

  // ─── Brand & Interactive CTAs ──────────────────────────────────────────────
  primaryBtn: Palette.blue600,
  primaryBtnText: Palette.white,
  accentCyan: Palette.cyan500,
  accentPurple: Palette.purple500,
  accentPurpleBadge: Palette.purple400,

  // ─── Gamification & Status Colors ──────────────────────────────────────────
  success: Palette.emerald500,
  successBg: 'rgba(34, 197, 94, 0.15)',
  successBorder: Palette.emerald500,

  warning: Palette.amber500,
  warningBg: 'rgba(245, 158, 11, 0.15)',
  warningBorder: Palette.amber500,

  danger: Palette.red500,
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  dangerBorder: Palette.red500,

  // Streak & Countdown Badges
  streakBg: Palette.amber900,
  streakText: Palette.amber500,
  streakBorder: Palette.amber800,

  levelBg: Palette.purple700,
  levelText: Palette.purple300,
  levelBorder: Palette.purple600,
} as const;

export type ColorToken = keyof typeof Colors;
