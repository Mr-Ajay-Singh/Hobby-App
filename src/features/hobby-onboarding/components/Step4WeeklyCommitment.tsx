import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WEEKLY_TARGETS } from '../constants';
import { Colors } from '@/shared/theme';

interface Step4WeeklyCommitmentProps {
  activeHobbyName: string;
  weeklyMinutes: number;
  setWeeklyMinutes: (val: number) => void;
  experienceLevel: string;
  goal: string;
}

export const Step4WeeklyCommitment: React.FC<Step4WeeklyCommitmentProps> = ({
  activeHobbyName,
  weeklyMinutes,
  setWeeklyMinutes,
  experienceLevel,
  goal,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Weekly Practice Commitment</Text>
      <Text style={styles.stepSub}>How many minutes can you practice {activeHobbyName} each week?</Text>

      <View style={styles.targetGrid}>
        {WEEKLY_TARGETS.map((tgt) => {
          const isSelected = weeklyMinutes === tgt.minutes;
          return (
            <TouchableOpacity
              key={tgt.minutes}
              style={[styles.targetCard, isSelected && styles.targetCardSelected]}
              onPress={() => setWeeklyMinutes(tgt.minutes)}
              activeOpacity={0.8}
            >
              <Text style={[styles.targetTitle, isSelected && styles.targetTitleSelected]}>
                {tgt.title}
              </Text>
              <Text style={styles.targetDesc}>{tgt.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Final Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Ionicons name="sparkles" size={18} color={Colors.warning} />
          <Text style={styles.summaryTitle}>Setup Ready!</Text>
        </View>

        <Text style={styles.summaryRow}>
          Hobby: <Text style={styles.summaryBold}>{activeHobbyName}</Text>
        </Text>
        <Text style={styles.summaryRow}>
          Level: <Text style={styles.summaryBold}>{experienceLevel.toUpperCase()}</Text>
        </Text>
        <Text style={styles.summaryRow}>
          Commitment: <Text style={styles.summaryBold}>{weeklyMinutes} mins / week</Text>
        </Text>
        {goal ? (
          <Text style={styles.summaryRow} numberOfLines={2}>
            Goal: <Text style={styles.summaryBold}>{goal}</Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  stepSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  targetGrid: {
    gap: 10,
  },
  targetCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 14,
    padding: 14,
  },
  targetCardSelected: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.accentPurple,
  },
  targetTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  targetTitleSelected: {
    color: Colors.accentPurple,
  },
  targetDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    gap: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryTitle: {
    color: Colors.warning,
    fontSize: 14,
    fontWeight: '800',
  },
  summaryRow: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  summaryBold: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
