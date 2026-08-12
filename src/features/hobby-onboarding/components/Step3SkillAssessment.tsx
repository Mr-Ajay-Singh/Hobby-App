import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { EXPERIENCE_LEVELS } from '../constants';
import { Colors } from '@/shared/theme';

interface Step3SkillAssessmentProps {
  activeHobbyName: string;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
}

export const Step3SkillAssessment: React.FC<Step3SkillAssessmentProps> = ({
  activeHobbyName,
  experienceLevel,
  setExperienceLevel,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>What is your current level in {activeHobbyName}?</Text>
      <Text style={styles.stepSub}>Your AI coach adapts lesson complexity based on your experience.</Text>

      <View style={styles.levelList}>
        {EXPERIENCE_LEVELS.map((lvl) => {
          const isSelected = experienceLevel === lvl.level;
          return (
            <TouchableOpacity
              key={lvl.level}
              style={[styles.levelCard, isSelected && styles.levelCardSelected]}
              onPress={() => setExperienceLevel(lvl.level)}
              activeOpacity={0.8}
            >
              <View style={styles.levelCardHeader}>
                <Text style={[styles.levelCardTitle, isSelected && styles.levelCardTitleSelected]}>
                  {lvl.title}
                </Text>
                {isSelected && <Feather name="check-circle" size={18} color={Colors.accentCyan} />}
              </View>
              <Text style={styles.levelCardDesc}>{lvl.desc}</Text>
            </TouchableOpacity>
          );
        })}
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
  levelList: {
    gap: 10,
  },
  levelCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 14,
    padding: 14,
  },
  levelCardSelected: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.accentCyan,
  },
  levelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  levelCardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  levelCardTitleSelected: {
    color: Colors.accentCyan,
  },
  levelCardDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
