import React, { useState, useEffect } from 'react';
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
import { fetchDashboardData, fetchUserHobbiesList } from '../api/dashboardApi';
import { DashboardData } from '../types';
import { useApiConfigStore } from '@/features/skill-learning/store/useApiConfigStore';
import { SkillChatConfigModal } from '@/features/skill-learning/components/SkillChatConfigModal';
import { EditHobbyGoalModal } from './EditHobbyGoalModal';
import { HobbySwitcherModal } from './HobbySwitcherModal';
import { Colors } from '@/shared/theme';
import { AdaptiveContainer } from '@/shared/components/layout/AdaptiveContainer';

const HOBBY_EMOJI_MAP: Record<string, string> = {
  piano: '🎹',
  guitar: '🎸',
  cricket: '🏏',
  ludo: '🎲',
  chess: '♟️',
  drawing: '🎨',
  spanish: '🇪🇸',
  coding: '💻',
  singing: '🎤',
  photography: '📸',
  cooking: '🍳',
  yoga: '🧘',
  swimming: '🏊',
  running: '🏃',
  reading: '📚',
};

const getHobbyEmoji = (hobbyName?: string): string => {
  if (!hobbyName) return '🎯';
  return HOBBY_EMOJI_MAP[hobbyName.toLowerCase()] || '🎯';
};

import { useActiveHobbyStore } from '../store/useActiveHobbyStore';

interface DashboardScreenProps {
  onOpenChat: (userHobbyId?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenChat }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { baseUrl } = useApiConfigStore();
  const { activeUserHobbyId, setActiveUserHobbyId, enrolledHobbyIds, syncEnrolledHobbyIds } =
    useActiveHobbyStore();
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [switcherModalVisible, setSwitcherModalVisible] = useState(false);
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const [onboardingHobbyName, setOnboardingHobbyName] = useState<string | undefined>(undefined);

  // Fetch Dashboard Summary via TanStack Query (uses persistent activeUserHobbyId)
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard-summary', baseUrl, activeUserHobbyId],
    queryFn: () => fetchDashboardData(activeUserHobbyId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch all user hobbies to compute total active hobbies portfolio count
  const { data: hobbiesData } = useQuery({
    queryKey: ['user-hobbies-list', baseUrl],
    queryFn: () => fetchUserHobbiesList(),
    staleTime: 1000 * 60 * 2,
  });

  // Sync fetched hobbies to local persistent enrolledHobbyIds array
  useEffect(() => {
    if (hobbiesData?.userHobbies && hobbiesData.userHobbies.length > 0) {
      const fetchedIds = hobbiesData.userHobbies.map((h: any) => h._id);
      syncEnrolledHobbyIds(fetchedIds);
    }
  }, [hobbiesData?.userHobbies, syncEnrolledHobbyIds]);

  const dashboard: DashboardData | null = data?.data || null;
  const hasActiveHobby = (data?.hasActiveHobby ?? true) && !!dashboard?.hobbyInfo;

  // Auto-sync active user hobby ID to persistent store if not set yet
  useEffect(() => {
    if (dashboard?.hobbyInfo?.userHobbyId) {
      setActiveUserHobbyId(dashboard.hobbyInfo.userHobbyId);
    }
  }, [dashboard?.hobbyInfo?.userHobbyId, setActiveUserHobbyId]);

  // 🔒 First-Time User Onboarding Gate: If user has no enrolled hobby, automatically route to mandatory onboarding
  useEffect(() => {
    if (!isLoading && !isError && !hasActiveHobby) {
      router.replace({
        pathname: '/hobby-onboarding',
        params: { isMandatory: 'true' },
      });
    }
  }, [isLoading, isError, hasActiveHobby]);

  const formatStageLabel = (stage?: string) => {
    if (!stage) return 'Onboarding';
    return stage
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <AdaptiveContainer style={{ paddingTop: insets.top }}>
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trophy" size={20} color={Colors.warning} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => refetch()}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="refresh-cw" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Main Scrollable Content ───────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 90, 110) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.accentCyan}
            colors={[Colors.accentCyan]}
          />
        }
      >
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.accentCyan} />
            <Text style={styles.loadingText}>Loading learning dashboard...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={40} color={Colors.danger} />
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
            <MaterialCommunityIcons name="rocket-launch-outline" size={48} color={Colors.accentCyan} />
            <Text style={styles.emptyTitle}>Welcome to AI Skill Coach! 🚀</Text>
            <Text style={styles.emptySubtext}>
              Please set up your first hobby profile to unlock your personalized AI Coach and learning dashboard.
            </Text>
            <TouchableOpacity
              style={styles.primaryChatBtn}
              onPress={() =>
                router.push({
                  pathname: '/hobby-onboarding',
                  params: { isMandatory: 'true' },
                })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.primaryChatBtnText}>+ Complete Hobby Onboarding</Text>
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
                  <Text style={styles.hobbyEmoji}>{getHobbyEmoji(dashboard.hobbyInfo?.hobbyName)}</Text>
                  <Text style={styles.hobbyName} numberOfLines={1} ellipsizeMode="tail">
                    {dashboard.hobbyInfo?.hobbyName || 'Hobby'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={Colors.accentCyan} style={{ marginLeft: 2 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchHobbyBadgeBtn}
                  onPress={() => setSwitcherModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Feather name="grid" size={14} color={Colors.accentCyan} />
                  <Text style={styles.switchHobbyBadgeText}>Switch / + Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ─── Onboarding Incomplete Alert Card ─────────────────── */}
            {(!dashboard.currentStage.isOnboardingCompleted || dashboard.currentStage.stage === 'onboarding') && (
              <View style={styles.onboardingBannerCard}>
                <View style={styles.onboardingBannerHeader}>
                  <View style={styles.onboardingIconBg}>
                    <Ionicons name="sparkles" size={20} color={Colors.warning} />
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
                  <Feather name="arrow-right" size={16} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}

            {/* ─── 1. Current Stage Stepper Card ───────────────────────────── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="shoe-print" size={20} color={Colors.accentCyan} />
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
                <Feather name="target" size={20} color={Colors.warning} />
                <Text style={styles.cardTitle}>Primary Learning Goal</Text>
                <TouchableOpacity
                  onPress={() => setEditGoalModalVisible(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="edit-2" size={16} color={Colors.accentCyan} />
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
                    <Feather name="clock" size={13} color={Colors.warning} />
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
                <Ionicons name="flame-outline" size={20} color={Colors.danger} />
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
                <View style={[styles.statIconBg, { backgroundColor: Colors.bgCardSubtle }]}>
                  <Feather name="clock" size={18} color={Colors.accentCyan} />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.totalPracticeTimeFormatted}
                </Text>
                <Text style={styles.statLbl}>Total Practice Time</Text>
              </View>

              {/* Stat 2: Sessions Completed */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.levelBg }]}>
                  <Feather name="check-circle" size={18} color={Colors.levelText} />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.totalSessionsCompleted}
                </Text>
                <Text style={styles.statLbl}>Completed Sessions</Text>
              </View>

              {/* Stat 3: Skill Mastery */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.streakBg }]}>
                  <MaterialCommunityIcons name="star-four-points" size={18} color={Colors.streakText} />
                </View>
                <Text style={styles.statVal}>
                  {dashboard.quickStats.overallSkillMasteryScore}
                  <Text style={styles.statMaxVal}> / 100</Text>
                </Text>
                <Text style={styles.statLbl}>Mastery Score Avg</Text>
              </View>

              {/* Stat 4: Active Hobbies Portfolio Count */}
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.successBg }]}>
                  <Feather name="layers" size={18} color={Colors.success} />
                </View>
                <Text style={styles.statVal}>
                  {Math.max(
                    hobbiesData?.userHobbies?.length || 0,
                    enrolledHobbyIds.length,
                    1
                  )}
                </Text>
                <Text style={styles.statLbl}>Active Hobbies</Text>
              </View>
            </View>

            {/* ─── 5. Primary AI Coach CTA Button ────────────────────────────── */}
            <TouchableOpacity
              style={styles.primaryChatBtn}
              onPress={() => onOpenChat(dashboard?.hobbyInfo?.userHobbyId)}
              activeOpacity={0.85}
            >
              <View style={styles.btnIconCircle}>
                <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
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

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      {hasActiveHobby && dashboard && !isLoading && !isError && (
        <TouchableOpacity
          style={[styles.fab, { bottom: Math.max(insets.bottom + 20, 32) }]}
          onPress={() => onOpenChat(dashboard?.hobbyInfo?.userHobbyId)}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

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
        activeUserHobbyId={activeUserHobbyId || dashboard?.hobbyInfo?.userHobbyId}
        onSelectHobby={(userHobbyId) => {
          setActiveUserHobbyId(userHobbyId);
        }}
        onHobbyEnrolled={() => refetch()}
      />
    </AdaptiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerSubtitle: {
    color: '#8E9BB0',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderCard,
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
    color: Colors.textSecondary,
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
    color: Colors.danger,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorSubtext: {
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderCard,
    marginVertical: 20,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  hobbyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderCard,
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
    borderColor: Colors.accentCyan,
  },
  switchHobbyBadgeText: {
    color: Colors.accentCyan,
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
    borderColor: Colors.warning,
    marginLeft: 6,
  },
  leaderboardBadgeText: {
    color: Colors.warning,
    fontSize: 11,
    fontWeight: '800',
  },
  hobbyEmoji: {
    fontSize: 24,
  },
  hobbyName: {
    color: Colors.textPrimary,
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
    borderColor: Colors.success,
  },
  statusPaused: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  statusText: {
    color: Colors.success,
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
    backgroundColor: Colors.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capText: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  cardMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  currentStageBadgeText: {
    color: Colors.accentCyan,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentCyan,
    borderRadius: 4,
  },
  progressBarFillWeekly: {
    height: '100%',
    backgroundColor: Colors.danger,
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
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stepPillCurrent: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.accentCyan,
  },
  stepPillCompleted: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  stepPillText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  stepPillTextCurrent: {
    color: Colors.accentCyan,
    fontWeight: '800',
  },
  stepPillTextCompleted: {
    color: Colors.success,
    fontWeight: '700',
  },
  goalText: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.levelBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.levelBorder,
  },
  levelBadgeText: {
    color: Colors.levelText,
    fontSize: 11,
    fontWeight: '800',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.streakBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.streakBorder,
  },
  countdownText: {
    color: Colors.streakText,
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
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  trackerUnit: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  trackerSubtext: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  ringBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 2,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    color: Colors.textPrimary,
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
    flex: 1,
    minWidth: 145,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderCard,
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
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  statMaxVal: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  statLbl: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  primaryChatBtn: {
    backgroundColor: Colors.primaryBtn,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCol: {
    flex: 1,
  },
  btnSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  onboardingBannerCard: {
    backgroundColor: '#271B11',
    borderColor: Colors.warning,
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
    color: Colors.warning,
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
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primaryBtn,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
