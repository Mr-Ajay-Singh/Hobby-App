import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkillInfo } from '../schemas/skillChatSchema';
import { getSkillLevelColor } from '../types';

interface SkillProgressHeaderProps {
  skillInfo: SkillInfo;
}

export const SkillProgressHeader: React.FC<SkillProgressHeaderProps> = ({ skillInfo }) => {
  if (!skillInfo) return null;

  const level = (skillInfo.currentLevel || 'beginner').toLowerCase();
  const score = typeof skillInfo.score === 'number' ? skillInfo.score : 25;
  const badgeColor = getSkillLevelColor(level, score);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {skillInfo.skillName || 'Skill Mastery'}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{level.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(100, Math.max(5, score))}%`,
                backgroundColor: badgeColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.scoreText, { color: badgeColor }]}>{score}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#131826',
    borderWidth: 1,
    borderColor: '#20293D',
    borderRadius: 14,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E273A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreText: {
    fontWeight: '800',
    marginLeft: 10,
    fontSize: 12.5,
  },
});
