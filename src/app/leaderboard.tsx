import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useLeaderboardQuery,
  LeaderboardType,
  LeaderboardHeader,
  LeaderboardPodium,
  LeaderboardRowItem,
  StickyUserRankFooter,
} from '@/features/leaderboard';

export default function LeaderboardScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<LeaderboardType>('weekly');

  const { data, isLoading, refetch, isRefetching } = useLeaderboardQuery(selectedType);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Navigation Bar */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>League Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Container */}
      <View style={styles.container}>
        <LeaderboardHeader
          selectedType={selectedType}
          onSelectType={setSelectedType}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A855F7" />
            <Text style={styles.loadingText}>Fetching League Standings...</Text>
          </View>
        ) : (
          <FlatList
            data={data?.rankings || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#A855F7"
              />
            }
            ListHeaderComponent={
              <View>
                <LeaderboardPodium podium={data?.podium || []} />
                <Text style={styles.sectionHeader}>LEAGUE STANDINGS</Text>
              </View>
            }
            renderItem={({ item }) => <LeaderboardRowItem item={item} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No learners ranked yet in this league.</Text>
              </View>
            }
          />
        )}

        {/* Sticky Current User Rank Footer */}
        {data?.currentUserRank && (
          <StickyUserRankFooter userRank={data.currentUserRank} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0813',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1429',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#191329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 36,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110, // Extra padding for sticky footer
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
  },
});
