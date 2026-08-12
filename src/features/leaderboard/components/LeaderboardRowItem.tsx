import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaderboardUser } from '../types';

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
    backgroundColor: '#13111E',
    borderWidth: 1,
    borderColor: '#231D38',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  currentUserContainer: {
    backgroundColor: '#2A1F4D',
    borderColor: '#A855F7',
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '800',
  },
  currentUserRankText: {
    color: '#E9D5FF',
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1933',
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
    color: '#F1F5F9',
    fontSize: 13.5,
    fontWeight: '700',
  },
  currentUserNameText: {
    color: '#F472B6',
    fontWeight: '800',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  levelText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  dot: {
    color: '#64748B',
    fontSize: 10,
  },
  streakText: {
    color: '#F59E0B',
    fontSize: 10.5,
    fontWeight: '600',
  },
  xpWrapper: {
    backgroundColor: '#22193E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    color: '#C084FC',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
