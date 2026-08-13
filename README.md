# 📱 Hobby AI Skill Coach - React Native & Expo Web Frontend

A cross-platform React Native (iOS, Android, and Web) application powered by Expo Router, TanStack Query, and Zustand. Features a responsive desktop/mobile UI, multi-modal AI skill chat, interactive quizzes, video player modals, global leaderboards, and a mandatory first-time onboarding gate.

---

## 🌟 Live Production Links

* **Live Web Application**: `https://hobby.missioninvictus.com`
* **Live API Base URL**: `https://hobby.missioninvictus.com/api/v1`

---

## 🛠️ Technology Stack

* **Framework**: React Native v0.76+ & Expo SDK 52
* **Navigation & Routing**: Expo Router v4 (File-based routing, SPA Single Mode)
* **State Management**: Zustand (Global stores for active hobbies & API config)
* **Data Fetching & Caching**: TanStack React Query v5 (Automatic stale-time invalidation)
* **UI & Styling**: Vanilla React Native StyleSheet with custom dark/light theme tokens (`Colors.ts`)
* **Components**: `react-native-webview` (In-App YouTube Player), `@expo/vector-icons`
* **Icons & Assets**: Custom SVG diagrams, Feather & Material Community Icons

---

## ✨ Key Features & Screen Breakdown

### 1. Mandatory First-Time Onboarding Gate (`/hobby-onboarding`)
* **Locked Flow**: New visitors without an active hobby profile are automatically locked onto the Onboarding Wizard.
* **4-Step Setup**:
  1. **Hobby Selection**: Pick from popular catalog (Guitar, Piano, Cricket, Ludo, Chess, Coding, Drawing, Spanish) or enter custom skill + Leaderboard profile display name & avatar.
  2. **Goal Definition**: Define primary learning objective.
  3. **Skill Assessment**: Select experience level (Beginner, Intermediate, Advanced, Expert).
  4. **Weekly Commitment**: Set weekly target practice minutes (e.g. 120 mins/week).

### 2. Interactive Learning Dashboard (`/`)
* **Active Stage Stepper**: Displays curriculum stage, progress bar, and step pills.
* **Primary Goal & Target**: Displays active goal, level badge, and countdown timer.
* **Weekly Practice Goal Tracker**: Visual ring badge and progress bar reflecting real-time practice minutes logged.
* **Quick Stats Grid**: Total Practice Time, Completed Sessions, Skill Mastery Score Average, and Active Hobbies count.
* **Responsive Desktop Layout**: Adaptive desktop sidebar (`DesktopSidebar.tsx`) for wide screens.

### 3. Multi-Modal AI Skill Chat (`/skill-chat`)
* Real-time conversation with specialized AI Coach.
* Renders rich structured content:
  * **Markdown Text**: Formatted lessons with bold headings and numbered steps.
  * **SVG Diagrams**: Interactive vector graphics.
  * **In-App Video Cards**: YouTube tutorial cards with `https://img.youtube.com/vi/` thumbnails, `onError` image fallbacks, inline player, and full-screen Theater Modal.
  * **Interactive Quizzes**: 4-choice interactive quiz cards with instant feedback, explanations, and XP score rewards.
  * **Checklists, Flashcards, Code Snippets & Musical Notes**.

### 4. League Leaderboard (`/leaderboard`)
* Toggle between **Weekly League** and **Global All-Time** standings.
* Displays podium (Top 3 learners with gold/silver/bronze trophies) and ranking list.
* Highlights requesting user rank and calculates **XP Needed to Overtake** the learner ahead.

---

## 📁 Repository Directory Structure

```
react-native-learning/
├── src/
│   ├── app/                                 # Expo Router File-Based Page Routes
│   │   ├── _layout.tsx                      # Root Provider Layout & Web Document Title
│   │   ├── index.tsx                        # Dashboard Main Screen Route
│   │   ├── hobby-onboarding.tsx             # Hobby Onboarding Route
│   │   ├── leaderboard.tsx                  # League Leaderboard Route
│   │   └── skill-chat.tsx                   # Multi-Modal AI Skill Chat Route
│   ├── features/                            # Feature-Driven Architecture
│   │   ├── dashboard/                       # Dashboard Feature
│   │   │   ├── api/dashboardApi.ts          # Dashboard & User Hobbies API calls
│   │   │   ├── components/                  # DashboardScreen, HobbySwitcherModal, EditGoalModal
│   │   │   ├── store/useActiveHobbyStore.ts # Active Hobby state store
│   │   │   └── types/                       # TypeScript Data Interfaces
│   │   ├── hobby-onboarding/                # Onboarding Feature
│   │   │   ├── api/hobbyOnboardingApi.ts    # Onboarding submission API call
│   │   │   ├── components/                  # Step1-4 Wizard Components & Screen
│   │   │   └── constants.ts                 # Popular Hobby Catalog & Avatars
│   │   ├── leaderboard/                     # Leaderboard Feature
│   │   │   ├── api/leaderboardApi.ts        # Leaderboard query API call
│   │   │   ├── components/                  # LeaderboardScreen & Podium Cards
│   │   │   └── types/                       # Leaderboard Type Definitions
│   │   └── skill-learning/                  # AI Skill Coaching Feature
│   │       ├── api/skillChatApi.ts          # Learn-skill & quiz submission APIs
│   │       ├── components/                  # SkillChatScreen, VideoCard, QuizCard, ConfigModal
│   │       ├── schemas/skillChatSchema.ts   # Zod Runtime Response Schemas
│   │       └── store/useApiConfigStore.ts   # API base URL & model state store
│   └── shared/                              # Shared Utilities & Components
│       ├── components/layout/               # AdaptiveContainer, DesktopSidebar
│       ├── hooks/useResponsive.ts           # Responsive screen breakpoint detector
│       ├── lib/                             # apiClient, deviceId, queryClient, urlUtils
│       └── theme/                           # Colors, Typography, Spacing Design System
├── app.json                                 # Expo App Config ("output": "single")
├── package.json                             # Dependency manifest
└── tsconfig.json                            # TypeScript Config
```

---

## 🏃 Local Setup & Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/Mr-Ajay-Singh/Hobby-App.git
   cd Hobby-App
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start local Metro bundler**:
   ```bash
   npx expo start
   ```
4. **Run in Web Browser**:
   Press **`w`** in terminal or run `npx expo start --web`.

---

## 📦 Export Web Production Build

To generate static Single Page Application (SPA) web build for hosting:

```bash
NODE_OPTIONS="--max-old-space-size=256" npx expo export -p web
```

*(Generates production files in `./dist/` folder)*

---

## 🚀 Production Deployment to Backend (`public/`)

Copy exported web build into Express backend static folder:

```bash
cp -r ./dist/* /var/www/hobby-backend/public/
pm2 restart hobby-backend
```

---

## 📄 License
ISC License © 2026 Mr. Ajay Singh.
