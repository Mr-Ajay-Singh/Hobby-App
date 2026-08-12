import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaderboardUser } from '../types';

interface StickyUserRankFooterProps {
  userRank: LeaderboardUser | null;
}

export const StickyUserRankFooter: React.FC<StickyUserRankFooterProps> = ({ userRank }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  if (!userRank) return null;

  const xpNeeded = userRank.xpNeededToOvertake || 5;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom + 10, 24) }]}>
      <View style={styles.innerCard}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{userRank.rank}</Text>
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.titleText}>Your League Rank</Text>
          <Text style={styles.motivationText}>
            🔥 Earn <Text style={styles.highlight}>+{xpNeeded} XP</Text> to advance your rank!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/skill-chat')}
          style={styles.practiceBtn}
        >
          <MaterialCommunityIcons name="target" size={16} color="#FFFFFF" />
          <Text style={styles.practiceBtnText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B0813',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#2B2144',
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#271B47',
    borderWidth: 1,
    borderColor: '#9333EA',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rankBadge: {
    backgroundColor: '#A855F7',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  infoWrapper: {
    flex: 1,
  },
  titleText: {
    color: '#F3E8FF',
    fontSize: 13,
    fontWeight: '800',
  },
  motivationText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  highlight: {
    color: '#F59E0B',
    fontWeight: '800',
  },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9333EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  practiceBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
