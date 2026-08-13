import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/shared/theme';
import { useActiveHobbyStore } from '@/features/dashboard/store/useActiveHobbyStore';
import { submitHobbyOnboarding } from '../api/hobbyOnboardingApi';
import { AdaptiveContainer } from '@/shared/components/layout/AdaptiveContainer';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { DesktopSidebar } from '@/shared/components/layout/DesktopSidebar';

import { Step1HobbySelection } from './Step1HobbySelection';
import { Step2GoalDefinition } from './Step2GoalDefinition';
import { Step3SkillAssessment } from './Step3SkillAssessment';
import { Step4WeeklyCommitment } from './Step4WeeklyCommitment';

export const HobbyOnboardingScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { isDesktop } = useResponsive();
  const searchParams = useLocalSearchParams<{ initialHobby?: string; isMandatory?: string }>();
  const isMandatory = searchParams.isMandatory === 'true';

  const [step, setStep] = useState(searchParams.initialHobby ? 2 : 1);
  const [selectedHobby, setSelectedHobby] = useState(searchParams.initialHobby || '');
  const [customHobby, setCustomHobby] = useState(searchParams.initialHobby || '');
  const [goal, setGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [weeklyMinutes, setWeeklyMinutes] = useState(120);
  const [displayName, setDisplayName] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('⚡');
  const [submitting, setSubmitting] = useState(false);

  const activeHobbyName = selectedHobby || customHobby;

  const handleNextStep = () => {
    if (step === 1) {
      if (!activeHobbyName.trim()) {
        Alert.alert('Selection Required', 'Please select or type a hobby to continue.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!goal.trim()) {
        Alert.alert('Goal Required', 'Please enter or select a learning goal.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = () => {
    if (isMandatory) {
      Alert.alert(
        'Onboarding Required 🚀',
        'Please complete setting up your first hobby profile to unlock your AI Coach and Dashboard.',
        [{ text: 'Continue Setup', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Cancel Hobby Setup?',
      'Are you sure you want to cancel setting up this hobby?',
      [
        { text: 'Continue Setup', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleFinish = async () => {
    if (!activeHobbyName.trim()) {
      Alert.alert('Error', 'Hobby name is missing.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitHobbyOnboarding({
        hobbyName: activeHobbyName.trim(),
        goal: goal.trim(),
        experienceLevel,
        weeklyPracticeMinutes: weeklyMinutes,
        displayName: displayName.trim() || undefined,
        avatar: avatarEmoji,
      });

      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

      // Navigate straight to AI Chat for the new hobby!
      const userHobbyId = response?.data?.userHobby?._id || response?.userHobby?._id;
      if (userHobbyId) {
        useActiveHobbyStore.getState().setActiveUserHobbyId(userHobbyId);
        router.replace({
          pathname: '/skill-chat',
          params: { userHobbyId },
        });
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Enrollment Error', err.message || 'Failed to finish onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['1. Select Skill', '2. Goal', '3. Level', '4. Schedule'];

  const renderContent = () => (
    <>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <Step1HobbySelection
            customHobby={customHobby}
            setCustomHobby={setCustomHobby}
            selectedHobby={selectedHobby}
            setSelectedHobby={setSelectedHobby}
            setGoal={setGoal}
            displayName={displayName}
            setDisplayName={setDisplayName}
            avatarEmoji={avatarEmoji}
            setAvatarEmoji={setAvatarEmoji}
          />
        )}

        {step === 2 && (
          <Step2GoalDefinition
            activeHobbyName={activeHobbyName}
            goal={goal}
            setGoal={setGoal}
          />
        )}

        {step === 3 && (
          <Step3SkillAssessment
            activeHobbyName={activeHobbyName}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
          />
        )}

        {step === 4 && (
          <Step4WeeklyCommitment
            activeHobbyName={activeHobbyName}
            weeklyMinutes={weeklyMinutes}
            setWeeklyMinutes={setWeeklyMinutes}
            experienceLevel={experienceLevel}
            goal={goal}
          />
        )}
      </ScrollView>

      {/* Bottom Sticky Action Footer Bar */}
      <View style={[styles.footerBar, { paddingBottom: Math.max(insets.bottom + 12, isDesktop ? 16 : 24) }]}>
        <TouchableOpacity style={styles.footerBackBtn} onPress={handlePrevStep} activeOpacity={0.7}>
          <Feather name="arrow-left" size={16} color={Colors.textSecondary} />
          <Text style={styles.footerBackText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
        </TouchableOpacity>

        {step < 4 ? (
          <TouchableOpacity
            style={[
              styles.footerNextBtn,
              (step === 1 && !activeHobbyName.trim()) || (step === 2 && !goal.trim())
                ? styles.footerNextBtnDisabled
                : null,
            ]}
            onPress={handleNextStep}
            disabled={(step === 1 && !activeHobbyName.trim()) || (step === 2 && !goal.trim())}
            activeOpacity={0.85}
          >
            <Text style={styles.footerNextText}>Next Step</Text>
            <Feather name="arrow-right" size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.footerFinishBtn}
            onPress={handleFinish}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.textPrimary} size="small" />
            ) : (
              <Text style={styles.footerFinishText}>Launch AI Coaching 🚀</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopLayoutRoot}>
        <DesktopSidebar />
        
        <View style={styles.desktopMainContent}>
          {/* Top Desktop Workspace Header */}
          <View style={styles.desktopWorkspaceHeader}>
            <View>
              <Text style={styles.desktopHeaderTitle}>Hobby Setup & Skill Enrollment 🚀</Text>
              <Text style={styles.desktopHeaderSub}>Configure your personalized AI Coach curriculum</Text>
            </View>
            
            {/* Horizontal Stepper Chips */}
            <View style={styles.desktopStepperRow}>
              {stepLabels.map((lbl, idx) => {
                const sNum = idx + 1;
                const isActive = step === sNum;
                const isDone = step > sNum;
                return (
                  <View
                    key={lbl}
                    style={[
                      styles.desktopStepChip,
                      isActive && styles.desktopStepChipActive,
                      isDone && styles.desktopStepChipDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.desktopStepChipText,
                        (isActive || isDone) && styles.desktopStepChipTextActive,
                      ]}
                    >
                      {lbl}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Desktop Wizard Card */}
          <View style={styles.desktopCardWrapper}>
            <View style={styles.desktopCardInner}>
              {renderContent()}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <AdaptiveContainer maxWidth={680} style={{ backgroundColor: Colors.bgAppAlt }}>
      {/* Top Header Navigation Bar */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={handlePrevStep} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleCenter}>
          <Text style={styles.headerTitle}>Hobby Onboarding</Text>
          <Text style={styles.headerSubtitle}>Step {step} of 4 • {step * 25}% Complete</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={confirmCancel} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrackBg}>
        <View style={[styles.progressTrackFill, { width: `${step * 25}%` }]} />
      </View>

      {renderContent()}
    </AdaptiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgAppAlt,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  progressTrackBg: {
    height: 4,
    backgroundColor: Colors.bgCardAlt,
    width: '100%',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: Colors.accentCyan,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: Colors.bgAppAlt,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  footerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  footerBackText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  footerNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryBtn,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  footerNextBtnDisabled: {
    backgroundColor: Colors.bgCardAlt,
    opacity: 0.5,
  },
  footerNextText: {
    color: Colors.primaryBtnText,
    fontSize: 14,
    fontWeight: '800',
  },
  footerFinishBtn: {
    backgroundColor: Colors.success,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerFinishText: {
    color: Colors.primaryBtnText,
    fontSize: 14,
    fontWeight: '800',
  },
  desktopLayoutRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.bgApp,
  },
  desktopMainContent: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bgApp,
  },
  desktopWorkspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCard,
  },
  desktopHeaderTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  desktopHeaderSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  desktopStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  desktopStepChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  desktopStepChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.accentCyan,
  },
  desktopStepChipDone: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  desktopStepChipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  desktopStepChipTextActive: {
    color: Colors.accentCyan,
    fontWeight: '800',
  },
  desktopCardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  desktopCardInner: {
    width: 720,
    maxWidth: '100%',
    height: '92%',
    maxHeight: 700,
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    overflow: 'hidden',
  },
});
