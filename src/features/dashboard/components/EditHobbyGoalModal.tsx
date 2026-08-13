import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateHobbySettings } from '../api/dashboardApi';
import { Colors } from '@/shared/theme';
import { useResponsive } from '@/shared/hooks/useResponsive';

interface EditHobbyGoalModalProps {
  visible: boolean;
  onClose: () => void;
  userHobbyId?: string;
  currentGoal?: string;
  currentExperienceLevel?: string;
  currentWeeklyMinutes?: number;
  onSaved: () => void;
}

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱' },
  { id: 'novice', label: 'Novice', emoji: '🌿' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🌳' },
  { id: 'advanced', label: 'Advanced', emoji: '🏆' },
];

const WEEKLY_PRESETS = [
  { minutes: 30, label: '30 mins/wk', sub: '5 mins/day' },
  { minutes: 60, label: '60 mins/wk', sub: '10 mins/day' },
  { minutes: 120, label: '120 mins/wk', sub: '20 mins/day' },
  { minutes: 300, label: '300 mins/wk', sub: '45 mins/day' },
];

export const EditHobbyGoalModal: React.FC<EditHobbyGoalModalProps> = ({
  visible,
  onClose,
  userHobbyId,
  currentGoal = '',
  currentExperienceLevel = 'beginner',
  currentWeeklyMinutes = 120,
  onSaved,
}) => {
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsive();
  const [goal, setGoal] = useState(currentGoal);
  const [experienceLevel, setExperienceLevel] = useState(currentExperienceLevel);
  const [weeklyMinutes, setWeeklyMinutes] = useState(currentWeeklyMinutes);
  const [loading, setLoading] = useState(false);
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    if (visible) {
      setGoal(currentGoal);
      setExperienceLevel(currentExperienceLevel || 'beginner');
      setWeeklyMinutes(currentWeeklyMinutes || 120);
    }
  }, [visible, currentGoal, currentExperienceLevel, currentWeeklyMinutes]);

  const handleSave = async () => {
    if (!goal.trim()) {
      setGoalError('Please enter a learning goal.');
      return;
    }
    setGoalError('');

    setLoading(true);
    try {
      await updateHobbySettings({
        userHobbyId,
        goal: goal.trim(),
        experienceLevel,
        weeklyPracticeMinutes: weeklyMinutes,
      });

      onSaved();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update goal and settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType={isDesktop ? 'fade' : 'slide'} transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, isDesktop && styles.overlayDesktop]}
      >
        <View
          style={[
            styles.sheetContainer,
            isDesktop && styles.sheetContainerDesktop,
            { paddingBottom: Math.max(insets.bottom + 16, 24) },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Feather name="edit-3" size={20} color={Colors.accentCyan} />
              <Text style={styles.title}>Edit Goal & Settings</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* 1. Primary Goal Input */}
            <Text style={styles.label}>Primary Learning Goal</Text>
            <TextInput
              style={styles.textInput}
              value={goal}
              onChangeText={(text) => { setGoal(text); if (goalError) setGoalError(''); }}
              placeholder="e.g. Play Chopin Nocturne Op. 9 No. 2"
              placeholderTextColor={Colors.textMuted}
              multiline
            />
            {goalError ? (
              <Text style={styles.errorText}>{goalError}</Text>
            ) : null}

            {/* 2. Experience Level Selector */}
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.levelRow}>
              {EXPERIENCE_LEVELS.map((lvl) => {
                const isSelected = experienceLevel.toLowerCase() === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    style={[styles.levelChip, isSelected && styles.levelChipSelected]}
                    onPress={() => setExperienceLevel(lvl.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipEmoji}>{lvl.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {lvl.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Weekly Target Minutes Selector */}
            <Text style={styles.label}>Weekly Practice Goal</Text>
            <View style={styles.presetGrid}>
              {WEEKLY_PRESETS.map((preset) => {
                const isSelected = weeklyMinutes === preset.minutes;
                return (
                  <TouchableOpacity
                    key={preset.minutes}
                    style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                    onPress={() => setWeeklyMinutes(preset.minutes)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetLabel,
                        isSelected && styles.presetLabelSelected,
                      ]}
                    >
                      {preset.label}
                    </Text>
                    <Text style={styles.presetSub}>{preset.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Modal Footer / Save Action */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textPrimary} />
              ) : (
                <>
                  <Feather name="check" size={18} color={Colors.textPrimary} />
                  <Text style={styles.saveBtnText}>Save Settings</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheetContainer: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderCard,
  },
  sheetContainerDesktop: {
    width: 560,
    maxWidth: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCard,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: Colors.bgApp,
    borderColor: Colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 15,
    minHeight: 80,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgApp,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelChipSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.accentCyan,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.accentCyan,
    fontWeight: '800',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  presetCard: {
    width: '48%',
    backgroundColor: Colors.bgApp,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 12,
    padding: 12,
  },
  presetCardSelected: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.accentCyan,
  },
  presetLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  presetLabelSelected: {
    color: Colors.accentCyan,
  },
  presetSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveBtn: {
    backgroundColor: Colors.primaryBtn,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});
