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
import { Colors } from '@/shared/theme';
import { AdaptiveContainer } from '@/shared/components/layout/AdaptiveContainer';
import { useResponsive } from '@/shared/hooks/useResponsive';
import { DesktopSidebar } from '@/shared/components/layout/DesktopSidebar';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const [selectedType, setSelectedType] = useState<LeaderboardType>('weekly');

  const { data, isLoading, isError, refetch, isRefetching } = useLeaderboardQuery(selectedType);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <AdaptiveContainer
      style={[
        { backgroundColor: Colors.bgAppAlt },
        isDesktop && { flexDirection: 'row' },
      ]}
    >
      {isDesktop && <DesktopSidebar />}

      <View style={{ flex: 1 }}>
        {/* Top Header Navigation Bar */}
        <View style={styles.navHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.textPrimary} />
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
            <ActivityIndicator size="large" color={Colors.accentPurple} />
            <Text style={styles.loadingText}>Fetching League Standings...</Text>
          </View>
        ) : isError ? (
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={40} color={Colors.danger} />
            <Text style={styles.loadingText}>Failed to load league standings</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => refetch()}
              style={{
                backgroundColor: Colors.accentPurple,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <Text style={{ color: Colors.textPrimary, fontWeight: '700', fontSize: 13 }}>Retry Connection</Text>
            </TouchableOpacity>
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
                tintColor={Colors.accentPurple}
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
    </View>
    </AdaptiveContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgAppAlt,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: Colors.textPrimary,
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
    color: Colors.textMuted,
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
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
