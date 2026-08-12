import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { fetchDashboardData } from '../api/dashboardApi';
import { DashboardData } from '../types';
import { useApiConfigStore } from '@/features/skill-learning/store/useApiConfigStore';
import { SkillChatConfigModal } from '@/features/skill-learning/components/SkillChatConfigModal';
import { EditHobbyGoalModal } from './EditHobbyGoalModal';
import { HobbySwitcherModal } from './HobbySwitcherModal';

interface DashboardScreenProps {
  onOpenChat: (userHobbyId?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenChat }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { baseUrl } = useApiConfigStore();
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [switcherModalVisible, setSwitcherModalVisible] = useState(false);
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const [onboardingHobbyName, setOnboardingHobbyName] = useState<string | undefined>(undefined);
  const [selectedUserHobbyId, setSelectedUserHobbyId] = useState<string | undefined>(undefined);

  // Fetch Dashboard Summary via TanStack Query
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard-summary', baseUrl, selectedUserHobbyId],
    queryFn: () => fetchDashboardData(selectedUserHobbyId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const dashboard: DashboardData | null = data?.data || null;
  const hasActiveHobby = (data?.hasActiveHobby ?? true) && !!dashboard?.hobbyInfo;

  const formatStageLabel = (stage?: string) => {
    if (!stage) return 'Onboarding';
    return stage
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Skill Learning Hub</Text>
          <Text style={styles.headerTitle}>My Dashboard 🚀</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.leaderboardHeaderBtn}
            onPress={() => router.push('/leaderboard')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => refetch()}
            activeOpacity={0.7}
          >
            <Feather name="refresh-cw" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setConfigModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Main Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#38BDF8"
            colors={['#38BDF8']}
          />
        }
      >
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={styles.loadingText}>Loading learning dashboard...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={40} color="#EF4444" />
            <Text style={styles.errorTitle}>Failed to load dashboard</Text>
            <Text style={styles.errorSubtext}>
              Make sure backend server is running on {baseUrl}
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : !hasActiveHobby || !dashboard || !dashboard.hobbyInfo ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="compass-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No Active Hobby Found</Text>
            <Text style={styles.emptySubtext}>
              Start a practice conversation with your AI Coach to enroll in a new skill!
            </Text>
            <TouchableOpacity style={styles.primaryChatBtn} onPress={() => onOpenChat()}>
              <Text style={styles.primaryChatBtnText}>Open AI Coach Chat</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ─── Active Hobby Banner ───────────────────────────────────────── */}
            <View style={styles.hobbyCard}>
              <View style={styles.hobbyHeaderRow}>
                <TouchableOpacity
                  style={styles.hobbyTitleBadge}
                  onPress={() => setSwitcherModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.hobbyEmoji}>🎹</Text>
                  <Text style={styles.hobbyName} numberOfLines={1} ellipsizeMode="tail">
                    {dashboard.hobbyInfo?.hobbyName || 'Hobby'}
                  </Text>
                  <Feather name="chevron-down" size={18} color="#38BDF8" style={{ marginLeft: 2 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchHobbyBadgeBtn}
                  onPress={() => setSwitcherModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Feather name="grid" size={14} color="#38BDF8" />
                  <Text style={styles.switchHobbyBadgeText}>Switch / + Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ─── Onboarding Incomplete Alert Card ─────────────────── */}
            {(!dashboard.currentStage.isOnboardingCompleted || dashboard.currentStage.stage === 'onboarding') && (
              <View style={styles.onboardingBannerCard}>
                <View style={styles.onboardingBannerHeader}>
                  <View style={styles.onboardingIconBg}>
                    <Ionicons name="sparkles" size={20} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.onboardingBannerTitle}>
                      Onboarding Incomplete ({dashboard.hobbyInfo?.hobbyName || 'Hobby'})
                    </Text>
                    <Text style={styles.onboardingBannerSubtext}>
                      Set your main goal & practice commitment to unlock personalized AI coaching.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.onboardingBannerBtn}
                  onPress={() => {
                    router.push({
                      pathname: '/hobby-onboarding',
                      params: { initialHobby: dashboard.hobbyInfo?.hobbyName },
                    });
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.onboardingBannerBtnText}>Complete Setup Now 🎯</Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* ─── 1. Current Stage Stepper Card ───────────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="shoe-print" size={20} color="#38BDF8" />
                <Text style={styles.cardTitle}>Learning Curriculum Stage</Text>
                <Text style={styles.cardMeta}>
                  Step {dashboard.currentStage.stepNumber} of {dashboard.currentStage.totalSteps}
                </Text>
              </View>

              <Text style={styles.currentStageBadgeText}>
                {formatStageLabel(dashboard.currentStage.stage)}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${dashboard.currentStage.progressPercentage}%` },
                  ]}
                />
              </View>

              {/* Stepper Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stepperScroll}
                contentContainerStyle={styles.stepperContainer}
              >
                {dashboard.currentStage.allStages.map((stageItem, idx) => {
                  const isCurrent = stageItem === dashboard.currentStage.stage;
                  const isCompleted = idx + 1 < dashboard.currentStage.stepNumber;

                  return (
                    <View
                      key={stageItem}
                      style={[
                        styles.stepPill,
                        isCurrent && styles.stepPillCurrent,
                        isCompleted && styles.stepPillCompleted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepPillText,
                          isCurrent && styles.stepPillTextCurrent,
                          isCompleted && styles.stepPillTextCompleted,
                        ]}
                      >
                        {isCompleted ? '✓ ' : ''}
                        {formatStageLabel(stageItem)}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* ─── 2. Main Goal & Target Countdown Card ──────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Feather name="target" size={20} color="#F59E0B" />
                <Text style={styles.cardTitle}>Primary Learning Goal</Text>
                <TouchableOpacity
                  onPress={() => setEditGoalModalVisible(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="edit-2" size={16} color="#38BDF8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.goalText}>{dashboard.goalAndTarget.goal}</Text>

              <View style={styles.goalFooterRow}>
                <View style={styles.levelBadge}>
                  <Feather name="award" size={13} color="#818CF8" />
                  <Text style={styles.levelBadgeText}>
                    {dashboard.goalAndTarget.experienceLevel.toUpperCase()}
                  </Text>
                </View>

                {dashboard.goalAndTarget.daysRemaining !== null && (
                  <View style={styles.countdownBadge}>
                    <Feather name="clock" size={13} color="#F59E0B" />
                    <Text style={styles.countdownText}>
                      {dashboard.goalAndTarget.daysRemaining} Days Left
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* ─── 3. Weekly Practice Goal Tracker Card ──────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="flame-outline" size={20} color="#EF4444" />
                <Text style={styles.cardTitle}>Weekly Practice Goal</Text>
                <Text style={styles.cardMeta}>
                  {dashboard.weeklyPracticeTracker.progressPercentage}%
                </Text>
              </View>

              <View style={styles.trackerRow}>
                <View style={styles.trackerTextCol}>
                  <Text style={styles.trackerBigNum}>
                    {dashboard.weeklyPracticeTracker.practicedThisWeekMinutes}
                    <Text style={styles.trackerUnit}>
                      {' '}
                      / {dashboard.weeklyPracticeTracker.targetWeeklyMinutes} mins
                    </Text>
                  </Text>
                  <Text style={styles.trackerSubtext}>Practiced this week</Text>
                </View>

                <View style={styles.ringBadge}>
                  <Text style={styles.ringText}>
                    {dashboard.weeklyPracticeTracker.progressPercentage}%
                  </Text>
                </View>
              </View>

              {/* Weekly Tracker Progress Bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFillWeekly,
                    {
                      width: `${Math.min(
                        100,
                        dashboard.weeklyPracticeTracker.progressPercentage
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* ─── 4. Quick Stats Cards Grid ─────────────────────────────────── */}
            <Text style={styles.sectionTitle}>Overview Statistics</Text>

            <View style={styles.statsGrid}>
              {/* Stat 1: Practice Time */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#1E293B' }]}>
                  <Feather name="clock" size={18} color="#38BDF8" />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.totalPracticeTimeFormatted}
                </Text>
                <Text style={styles.statLbl}>Total Practice Time</Text>
              </View>

              {/* Stat 2: Sessions Completed */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#312E81' }]}>
                  <Feather name="check-circle" size={18} color="#818CF8" />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.totalSessionsCompleted}
                </Text>
                <Text style={styles.statLbl}>Completed Sessions</Text>
              </View>

              {/* Stat 3: Skill Mastery */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#451A03' }]}>
                  <MaterialCommunityIcons name="star-four-points" size={18} color="#F59E0B" />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.overallSkillMasteryScore}
                  <Text style={styles.statMaxVal}> / 100</Text>
                </Text>
                <Text style={styles.statLbl}>Mastery Score Avg</Text>
              </View>

              {/* Stat 4: Skills Tracked */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: '#064E3B' }]}>
                  <Feather name="layers" size={18} color="#34D399" />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.totalSkillsTracked}
                </Text>
                <Text style={styles.statLbl}>Skills Tracked</Text>
              </View>
            </View>

            {/* ─── 5. Primary AI Coach CTA Button ────────────────────────────── */}
            <TouchableOpacity
              style={styles.primaryChatBtn}
              onPress={() => onOpenChat(dashboard?.hobbyInfo?.userHobbyId)}
              activeOpacity={0.85}
            >
              <View style={styles.btnIconCircle}>
                <Ionicons name="chatbubbles" size={20} color="#38BDF8" />
              </View>

              <View style={styles.btnTextCol}>
                <Text style={styles.primaryChatBtnText}>Start AI Coaching Session</Text>
                <Text style={styles.btnSubtext}>Chat, get lessons & submit assignments</Text>
              </View>

              <Feather name="chevron-right" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* ─── Config Modal ─────────────────────────────────────────────────── */}
      <SkillChatConfigModal
        visible={configModalVisible}
        onClose={() => setConfigModalVisible(false)}
      />

      {/* ─── Edit Goal & Settings Modal ────────────────────────────────────── */}
      <EditHobbyGoalModal
        visible={editGoalModalVisible}
        onClose={() => setEditGoalModalVisible(false)}
        userHobbyId={dashboard?.hobbyInfo?.userHobbyId}
        currentGoal={dashboard?.goalAndTarget?.goal}
        currentExperienceLevel={dashboard?.goalAndTarget?.experienceLevel}
        currentWeeklyMinutes={dashboard?.weeklyPracticeTracker?.targetWeeklyMinutes}
        onSaved={() => refetch()}
      />

      {/* ─── Hobby Switcher Modal ───────────────────────────────────────────── */}
      <HobbySwitcherModal
        visible={switcherModalVisible}
        onClose={() => setSwitcherModalVisible(false)}
        activeUserHobbyId={dashboard?.hobbyInfo?.userHobbyId}
        onSelectHobby={(userHobbyId) => {
          setSelectedUserHobbyId(userHobbyId);
        }}
        onHobbyEnrolled={() => refetch()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F121C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1B2132',
  },
  headerSubtitle: {
    color: '#8E9BB0',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161B28',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#242C3F',
  },
  leaderboardHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#261908',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#78350F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#1E1215',
    borderColor: '#7F1D1D',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
  },
  errorTitle: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorSubtext: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: '#161B28',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242C3F',
    marginVertical: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  hobbyCard: {
    backgroundColor: '#161B28',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#242C3F',
  },
  hobbyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hobbyTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchHobbyBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  switchHobbyBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  leaderboardBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginLeft: 6,
  },
  leaderboardBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  hobbyEmoji: {
    fontSize: 24,
  },
  hobbyName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  statusPaused: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
  },
  capabilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  capChip: {
    backgroundColor: '#1E2638',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#161B28',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#242C3F',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  cardMeta: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  currentStageBadgeText: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1E2638',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  progressBarFillWeekly: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  stepperScroll: {
    marginTop: 4,
  },
  stepperContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepPill: {
    backgroundColor: '#1E2638',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D374D',
  },
  stepPillCurrent: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  stepPillCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  stepPillText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  stepPillTextCurrent: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  stepPillTextCompleted: {
    color: '#22C55E',
    fontWeight: '700',
  },
  goalText: {
    color: '#F3F4F6',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 12,
  },
  goalFooterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3730A3',
  },
  levelBadgeText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '800',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#451A03',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#78350F',
  },
  countdownText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trackerTextCol: {
    flex: 1,
  },
  trackerBigNum: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  trackerUnit: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  trackerSubtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  ringBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#161B28',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#242C3F',
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statMaxVal: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  statLbl: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  primaryChatBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryChatBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  btnIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCol: {
    flex: 1,
  },
  btnSubtext: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
  },
  onboardingBannerCard: {
    backgroundColor: '#271B11',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  onboardingBannerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  onboardingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#451A03',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingBannerTitle: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '800',
  },
  onboardingBannerSubtext: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  onboardingBannerBtn: {
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  onboardingBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
