import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/shared/theme';
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
        return { bg: Colors.bgCardAlt, text: Colors.warning, border: Colors.borderCard };
      case 'advanced':
        return { bg: Colors.bgCardAlt, text: Colors.accentPurple, border: Colors.borderCard };
      case 'intermediate':
        return { bg: Colors.bgCardAlt, text: Colors.textPrimary, border: Colors.borderCard };
      case 'beginner':
      default:
        return { bg: Colors.bgCardAlt, text: Colors.success, border: Colors.borderCard };
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
        <Feather name="arrow-left" size={22} color={Colors.textPrimary} />
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
          <MaterialCommunityIcons name="star-four-points" size={12} color={Colors.warning} />
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
          <Feather name="rotate-ccw" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgApp,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
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
    color: Colors.textPrimary,
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
    backgroundColor: Colors.success,
  },
  subtext: {
    color: Colors.textSecondary,
    fontSize: 11.5,
    fontWeight: '500',
  },
  dotSeparator: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  scoreText: {
    color: Colors.warning,
    fontSize: 11.5,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
