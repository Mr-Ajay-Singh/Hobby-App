import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { EXPERIENCE_LEVELS } from '../constants';

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
                {isSelected && <Feather name="check-circle" size={18} color="#38BDF8" />}
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
  levelList: {
    gap: 10,
  },
  levelCard: {
    backgroundColor: '#151124',
    borderWidth: 1,
    borderColor: '#261F3E',
    borderRadius: 14,
    padding: 14,
  },
  levelCardSelected: {
    backgroundColor: '#0F2942',
    borderColor: '#38BDF8',
  },
  levelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  levelCardTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  levelCardTitleSelected: {
    color: '#38BDF8',
  },
  levelCardDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
});
