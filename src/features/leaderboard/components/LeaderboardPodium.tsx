import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaderboardUser } from '../types';
import { Colors } from '@/shared/theme';

interface LeaderboardPodiumProps {
  podium: LeaderboardUser[];
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ podium }) => {
  if (!podium || podium.length === 0) return null;

  const rank1 = podium.find((u) => u.rank === 1) || podium[0];
  const rank2 = podium.find((u) => u.rank === 2) || podium[1];
  const rank3 = podium.find((u) => u.rank === 3) || podium[2];

  return (
    <View style={styles.container}>
      {/* Rank 2 (Left) */}
      {rank2 && (
        <View style={[styles.stepWrapper, styles.stepWrapper2]}>
          <View style={styles.avatarRingSilver}>
            <Text style={styles.avatarEmoji}>{rank2.avatar || '👤'}</Text>
            <View style={styles.rankBadgeSilver}>
              <Text style={styles.rankBadgeText}>2</Text>
            </View>
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            {rank2.displayName}
          </Text>
          <Text style={styles.userXp}>{rank2.dailyXpEarned || rank2.score} XP</Text>
          <View style={styles.stepBlock2}>
            <Text style={styles.stepLabel}>🥈</Text>
          </View>
        </View>
      )}

      {/* Rank 1 (Center - Taller & Glowing) */}
      {rank1 && (
        <View style={[styles.stepWrapper, styles.stepWrapper1]}>
          <MaterialCommunityIcons name="crown" size={24} color={Colors.warning} style={styles.crownIcon} />
          <View style={styles.avatarRingGold}>
            <Text style={styles.avatarEmoji}>{rank1.avatar || '⚡'}</Text>
            <View style={styles.rankBadgeGold}>
              <Text style={styles.rankBadgeText}>1</Text>
            </View>
          </View>
          <Text style={[styles.userName, styles.userNameGold]} numberOfLines={1}>
            {rank1.displayName}
          </Text>
          <Text style={styles.userXpGold}>{rank1.dailyXpEarned || rank1.score} XP</Text>
          <View style={styles.stepBlock1}>
            <Text style={styles.stepLabel}>🥇</Text>
          </View>
        </View>
      )}

      {/* Rank 3 (Right) */}
      {rank3 && (
        <View style={[styles.stepWrapper, styles.stepWrapper3]}>
          <View style={styles.avatarRingBronze}>
            <Text style={styles.avatarEmoji}>{rank3.avatar || '👤'}</Text>
            <View style={styles.rankBadgeBronze}>
              <Text style={styles.rankBadgeText}>3</Text>
            </View>
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            {rank3.displayName}
          </Text>
          <Text style={styles.userXp}>{rank3.dailyXpEarned || rank3.score} XP</Text>
          <View style={styles.stepBlock3}>
            <Text style={styles.stepLabel}>🥉</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 12,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepWrapper1: {
    marginBottom: 0,
  },
  stepWrapper2: {
    marginBottom: 0,
  },
  stepWrapper3: {
    marginBottom: 0,
  },
  crownIcon: {
    marginBottom: -4,
  },
  avatarRingGold: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#382506',
    borderWidth: 2.5,
    borderColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  avatarRingSilver: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  avatarRingBronze: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E1911',
    borderWidth: 2,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  rankBadgeGold: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: Colors.warning,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeSilver: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: Colors.textMuted,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeBronze: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#D97706',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  userName: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  userNameGold: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '800',
  },
  userXp: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  userXpGold: {
    color: Colors.warning,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  stepBlock1: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBlock2: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderWidth: 1,
    borderColor: Colors.textMuted,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBlock3: {
    width: '100%',
    height: 46,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderWidth: 1,
    borderColor: '#B45309',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 20,
  },
});
