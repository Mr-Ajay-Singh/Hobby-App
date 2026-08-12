import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SkillInfo } from '../schemas/skillChatSchema';

interface SkillChatHeaderProps {
  skillInfo?: SkillInfo | null;
  onBack: () => void;
  onOpenSettings: () => void;
  onResetChat: () => void;
}

export const SkillChatHeader: React.FC<SkillChatHeaderProps> = ({
  skillInfo,
  onBack,
  onOpenSettings,
  onResetChat,
}) => {
  const level = skillInfo?.currentLevel || 'beginner';
  const score = skillInfo?.score || 25;
  const title = skillInfo?.skillName || 'Multi-Modal Skill AI';

  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case 'expert':
        return { bg: '#451A03', text: '#F59E0B', border: '#78350F' };
      case 'advanced':
        return { bg: '#3B0764', text: '#C084FC', border: '#581C87' };
      case 'intermediate':
        return { bg: '#1E1B4B', text: '#818CF8', border: '#3730A3' };
      case 'beginner':
      default:
        return { bg: '#064E3B', text: '#34D399', border: '#065F46' };
    }
  };

  const badgeColors = getLevelBadgeColor(level);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.iconBtn}
      >
        <Feather name="arrow-left" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View
            style={[
              styles.levelBadge,
              {
                backgroundColor: badgeColors.bg,
                borderColor: badgeColors.border,
              },
            ]}
          >
            <Text style={[styles.levelText, { color: badgeColors.text }]}>
              {level.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.subtext}>Active AI Coach</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <MaterialCommunityIcons name="star-four-points" size={12} color="#FBBF24" />
          <Text style={styles.scoreText}>{score} XP</Text>
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onResetChat}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconBtn}
        >
          <Feather name="rotate-ccw" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenSettings}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconBtn}
        >
          <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F121C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1B2132',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161B28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  subtext: {
    color: '#8E9BB0',
    fontSize: 11.5,
    fontWeight: '500',
  },
  dotSeparator: {
    color: '#4B5563',
    fontSize: 11,
  },
  scoreText: {
    color: '#FBBF24',
    fontSize: 11.5,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
