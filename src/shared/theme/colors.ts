/**
 * Impeccable Design System — Dual Theme Architecture
 * 
 * 1. Palette: Raw primitive color values
 * 2. DarkThemeColors: Dark Slate & Deep Purple Gamified Palette
 * 3. LightThemeColors: Premium Slate 50 & Crisp White High-Contrast Palette
 * 4. Colors: Active Theme Tokens consumed across the entire application
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
  slate50: '#F8FAFC',
  white: '#FFFFFF',

  // Deep Violet / Gamified Purple Scale
  purple950: '#0B0813',
  purple900: '#151124',
  purple850: '#191329',
  purple800: '#1E1933',
  purple700: '#3730A3',
  purple600: '#7E22CE',
  purple500: '#9333EA',
  purple400: '#A855F7',
  purple300: '#C084FC',
  purple200: '#E9D5FF',
  purple100: '#F3E8FF',

  // Sky / Progress Accent Scale
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
  amber700: '#B45309',
  amber600: '#D97706',
  amber500: '#F59E0B',
  amber400: '#FBBF24',
  amber300: '#FCD34D',
  amber100: '#FEF3C7',

  emerald950: '#042F2E',
  emerald900: '#064E3B',
  emerald800: '#065F46',
  emerald700: '#15803D',
  emerald600: '#16A34A',
  emerald500: '#22C55E',
  emerald400: '#34D399',
  emerald100: '#DCFCE7',

  red950: '#1E1215',
  red900: '#4A1D24',
  red800: '#7F1D1D',
  red600: '#DC2626',
  red500: '#EF4444',
  red400: '#F87171',
  red100: '#FEE2E2',
} as const;

export const DarkThemeColors = {
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
  levelBorder: Palette.purple500,
};

export const LightThemeColors = {
  // ─── Surfaces & Backgrounds ───────────────────────────────────────────────
  bgApp: Palette.slate50,         // Slate 50 (#F8FAFC) — ultra-clean, warm neutral
  bgAppAlt: Palette.slate100,      // Slate 100 (#F1F5F9) — soft contrast
  bgAppSubtle: Palette.slate100,
  bgCard: Palette.white,           // Crisp White (#FFFFFF) card containers
  bgCardHover: '#F1F5F9',         // Soft hover elevation on web
  bgCardAlt: Palette.slate50,      // Soft offset container
  bgCardSubtle: Palette.slate100,  // Subtle card background
  bgInput: Palette.white,          // White input background
  bgOverlay: 'rgba(15, 23, 42, 0.65)',

  // ─── Borders & Separators ──────────────────────────────────────────────────
  borderSubtle: Palette.slate200,  // Slate 200 (#E2E8F0)
  borderCard: Palette.slate300,    // Slate 300 (#CBD5E1)
  borderHighlight: Palette.cyan600,// Sky Blue 600 (#0284C7)
  borderPurple: Palette.purple600, // Purple 600 (#7E22CE)

  // ─── Typography Colors ─────────────────────────────────────────────────────
  textPrimary: '#0F172A',          // Slate 900 — crisp high-contrast legibility
  textSecondary: '#475569',        // Slate 600 — clear secondary body copy
  textMuted: Palette.slate500,     // Slate 500 — clear label subtext
  textSubtle: Palette.slate400,    // Slate 400 — subtle captions
  textCyan: Palette.cyan600,       // Sky Blue 600
  textAmber: Palette.amber600,     // Amber 600
  textPurple: Palette.purple600,   // Purple 600

  // ─── Brand & Interactive CTAs ──────────────────────────────────────────────
  primaryBtn: Palette.blue600,     // Royal Blue CTA button
  primaryBtnHover: Palette.blue700, // Darker blue on hover
  primaryBtnText: Palette.white,
  accentCyan: Palette.cyan600,     // Sky Blue 600
  accentPurple: Palette.purple600, // Deep Purple 600
  accentPurpleBadge: Palette.purple600,

  // ─── Gamification & Status Colors ──────────────────────────────────────────
  success: Palette.emerald600,     // Emerald 600
  successBg: 'rgba(22, 163, 74, 0.12)',
  successBorder: Palette.emerald600,

  warning: Palette.amber600,       // Amber 600
  warningBg: 'rgba(217, 119, 6, 0.12)',
  warningBorder: Palette.amber600,

  danger: Palette.red600,          // Red 600
  dangerBg: 'rgba(220, 38, 38, 0.12)',
  dangerBorder: Palette.red600,

  // Streak & Countdown Badges
  streakBg: Palette.amber100,      // Amber 100 (#FEF3C7)
  streakText: Palette.amber700,    // Amber 700 (#B45309)
  streakBorder: Palette.amber300,  // Amber 300 (#FCD34D)

  levelBg: Palette.purple100,      // Purple 100 (#F3E8FF)
  levelText: Palette.purple600,    // Purple 600 (#7E22CE)
  levelBorder: Palette.purple200,  // Purple 200 (#E9D5FF)
};

/**
 * ACTIVE APPLICATION COLORS
 * Set to LightThemeColors so the entire application renders in the Impeccable Light Theme.
 * You can also switch to DarkThemeColors anytime!
 */
export const Colors = LightThemeColors;

export type ColorToken = keyof typeof Colors;
