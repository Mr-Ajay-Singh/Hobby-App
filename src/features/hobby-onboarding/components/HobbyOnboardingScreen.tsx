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
import { submitHobbyOnboarding } from '../api/hobbyOnboardingApi';

import { Step1HobbySelection } from './Step1HobbySelection';
import { Step2GoalDefinition } from './Step2GoalDefinition';
import { Step3SkillAssessment } from './Step3SkillAssessment';
import { Step4WeeklyCommitment } from './Step4WeeklyCommitment';

export const HobbyOnboardingScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const searchParams = useLocalSearchParams<{ initialHobby?: string }>();

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Top Header Navigation Bar ────────────────────────────────────────────── */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={handlePrevStep} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#F1F5F9" />
        </TouchableOpacity>

        <View style={styles.headerTitleCenter}>
          <Text style={styles.headerTitle}>Hobby Onboarding</Text>
          <Text style={styles.headerSubtitle}>Step {step} of 4 • {step * 25}% Complete</Text>
        </View>

        {/* ❌ Explicit Close Button */}
        <TouchableOpacity style={styles.iconBtn} onPress={confirmCancel} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrackBg}>
        <View style={[styles.progressTrackFill, { width: `${step * 25}%` }]} />
      </View>

      {/* ── Main Scrollable Questionnaire Body ───────────────────────────────────── */}
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

      {/* ── Bottom Sticky Action Footer Bar ───────────────────────────────────────── */}
      <View style={[styles.footerBar, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
        <TouchableOpacity style={styles.footerBackBtn} onPress={handlePrevStep} activeOpacity={0.7}>
          <Feather name="arrow-left" size={16} color="#94A3B8" />
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
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.footerFinishBtn}
            onPress={handleFinish}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.footerFinishText}>Launch AI Coaching 🚀</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0813',
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
    backgroundColor: '#191329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  progressTrackBg: {
    height: 4,
    backgroundColor: '#1E1933',
    width: '100%',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
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
    backgroundColor: '#0B0813',
    borderTopWidth: 1,
    borderTopColor: '#1F1833',
  },
  footerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  footerBackText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  footerNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  footerNextBtnDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.5,
  },
  footerNextText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  footerFinishBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerFinishText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
