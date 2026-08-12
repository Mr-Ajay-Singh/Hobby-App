import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface TopBarProps {
  streakCount?: number;
  onAvatarPress?: () => void;
  onGetNowPress?: () => void;
  onStatsPress?: () => void;
  onTrophyPress?: () => void;
  onStreakPress?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  streakCount = 0,
  onAvatarPress,
  onGetNowPress,
  onStatsPress,
  onTrophyPress,
  onStreakPress,
}) => {
  const insets = useSafeAreaInsets();

  const handleAvatarPress = () => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      Alert.alert('Profile', 'Opening user profile...');
    }
  };

  const handleGetNowPress = () => {
    if (onGetNowPress) {
      onGetNowPress();
    } else {
      Alert.alert('Upgrade Plan', 'Get Premium Access Now!');
    }
  };

  const handleStatsPress = () => {
    if (onStatsPress) {
      onStatsPress();
    } else {
      Alert.alert('Analytics', 'Your learning stats and progress');
    }
  };

  const handleTrophyPress = () => {
    if (onTrophyPress) {
      onTrophyPress();
    } else {
      Alert.alert('Achievements', 'View your earned trophies & badges');
    }
  };

  const handleStreakPress = () => {
    if (onStreakPress) {
      onStreakPress();
    } else {
      Alert.alert('Daily Streak', `Current streak: ${streakCount} days`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      {/* Left side: Avatar + GET NOW button */}
      <View style={styles.leftContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAvatarPress}
          style={styles.avatarWrapper}
        >
          <Image
            source={require('../../assets/images/cat_avatar.jpg')}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleGetNowPress}
          style={styles.getNowButton}
        >
          <Text style={styles.getNowText}>GET NOW</Text>
        </TouchableOpacity>
      </View>

      {/* Right side: Stats + Trophy + Streak */}
      <View style={styles.rightContainer}>
        {/* Stats / Analytics Icon Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleStatsPress}
          style={styles.iconBadge}
        >
          <View style={styles.barChartIcon}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
          </View>
        </TouchableOpacity>

        {/* Trophy / Achievements Icon Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleTrophyPress}
          style={styles.iconBadge}
        >
          <Ionicons name="trophy" size={17} color="#F97316" />
        </TouchableOpacity>

        {/* Streak Flame Counter Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleStreakPress}
          style={[styles.iconBadge, styles.streakBadge]}
        >
          <MaterialCommunityIcons name="fire" size={19} color="#9CA3AF" />
          <Text style={styles.streakText}>{streakCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1015',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#181A22',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#262A38',
    backgroundColor: '#1E212D',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  getNowButton: {
    backgroundColor: '#6C42F5',
    paddingHorizontal: 16,
    paddingVertical: 7.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C42F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  getNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    backgroundColor: '#1A1C24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252936',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    minWidth: 38,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
  },
  barChartIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2.5,
    height: 16,
    width: 14,
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    backgroundColor: '#2F69FE',
    borderRadius: 1.5,
  },
  bar1: {
    height: 6,
  },
  bar2: {
    height: 11,
  },
  bar3: {
    height: 16,
  },
  streakText: {
    color: '#9CA3AF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
