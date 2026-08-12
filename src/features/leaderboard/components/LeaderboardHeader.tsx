import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LeaderboardType } from '../types';

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
            color={selectedType === 'weekly' ? '#F59E0B' : '#94A3B8'}
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
            color={selectedType === 'alltime' ? '#38BDF8' : '#94A3B8'}
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
    backgroundColor: '#1E1B2E',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2D264A',
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
    backgroundColor: '#2E264E',
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
