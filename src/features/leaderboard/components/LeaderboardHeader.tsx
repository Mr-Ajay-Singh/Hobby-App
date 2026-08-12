import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaderboardType } from '../types';
import { Colors } from '@/shared/theme';

interface LeaderboardHeaderProps {
  selectedType: LeaderboardType;
  onSelectType: (type: LeaderboardType) => void;
}

export const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectType('weekly')}
          style={[
            styles.segmentBtn,
            selectedType === 'weekly' && styles.segmentBtnActive,
          ]}
        >
          <MaterialCommunityIcons
            name="trophy"
            size={16}
            color={selectedType === 'weekly' ? Colors.warning : Colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              selectedType === 'weekly' && styles.segmentTextActive,
            ]}
          >
            Weekly League
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectType('alltime')}
          style={[
            styles.segmentBtn,
            selectedType === 'alltime' && styles.segmentBtnActive,
          ]}
        >
          <MaterialCommunityIcons
            name="earth"
            size={16}
            color={selectedType === 'alltime' ? Colors.accentCyan : Colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              selectedType === 'alltime' && styles.segmentTextActive,
            ]}
          >
            Global All-Time
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: Colors.bgCardAlt,
  },
  segmentText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
