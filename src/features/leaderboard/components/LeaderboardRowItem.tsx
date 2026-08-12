import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaderboardUser } from '../types';
import { Colors } from '@/shared/theme';

interface LeaderboardRowItemProps {
  item: LeaderboardUser;
}

export const LeaderboardRowItem: React.FC<LeaderboardRowItemProps> = ({ item }) => {
  return (
    <View style={[styles.container, item.isCurrentUser && styles.currentUserContainer]}>
      {/* Rank Position */}
      <View style={styles.rankBadge}>
        <Text style={[styles.rankText, item.isCurrentUser && styles.currentUserRankText]}>
          #{item.rank}
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Text style={styles.avatarText}>{item.avatar || '👤'}</Text>
      </View>

      {/* User Info */}
      <View style={styles.infoWrapper}>
        <Text style={[styles.nameText, item.isCurrentUser && styles.currentUserNameText]} numberOfLines={1}>
          {item.displayName} {item.isCurrentUser ? '(You)' : ''}
        </Text>
        <View style={styles.subRow}>
          <Text style={styles.levelText}>{item.level.toUpperCase()}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.streakText}>🔥 {item.streakCount}d Streak</Text>
        </View>
      </View>

      {/* XP Score */}
      <View style={styles.xpWrapper}>
        <Text style={styles.xpText}>{item.dailyXpEarned || item.score} XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  currentUserContainer: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.accentPurple,
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  currentUserRankText: {
    color: Colors.textPrimary,
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgAppAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
  },
  infoWrapper: {
    flex: 1,
  },
  nameText: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  currentUserNameText: {
    color: Colors.accentPurple,
    fontWeight: '800',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  levelText: {
    color: Colors.accentCyan,
    fontSize: 10,
    fontWeight: '700',
  },
  dot: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  streakText: {
    color: Colors.warning,
    fontSize: 10.5,
    fontWeight: '600',
  },
  xpWrapper: {
    backgroundColor: Colors.bgAppAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    color: Colors.accentPurple,
    fontSize: 12.5,
    fontWeight: '800',
  },
});
