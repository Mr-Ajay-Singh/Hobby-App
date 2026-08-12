import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WEEKLY_TARGETS } from '../constants';

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
          <Ionicons name="sparkles" size={18} color="#F59E0B" />
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
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  stepSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  targetGrid: {
    gap: 10,
  },
  targetCard: {
    backgroundColor: '#151124',
    borderWidth: 1,
    borderColor: '#261F3E',
    borderRadius: 14,
    padding: 14,
  },
  targetCardSelected: {
    backgroundColor: '#26134B',
    borderColor: '#A855F7',
  },
  targetTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  targetTitleSelected: {
    color: '#C084FC',
  },
  targetDesc: {
    color: '#94A3B8',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#19122D',
    borderWidth: 1,
    borderColor: '#36245C',
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
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '800',
  },
  summaryRow: {
    color: '#94A3B8',
    fontSize: 13,
  },
  summaryBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
