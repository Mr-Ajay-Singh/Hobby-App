import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ChecklistItem } from '../schemas/skillChatSchema';

interface ChecklistViewProps {
  checklist: ChecklistItem[];
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ checklist }) => {
  if (!checklist || !Array.isArray(checklist) || checklist.length === 0) return null;

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllComplete = completedCount === checklist.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="format-list-checks" size={18} color="#22C55E" />
          <Text style={styles.headerTitle}>Action Checklist</Text>
        </View>
        <View
          style={[
            styles.progressBadge,
            { backgroundColor: isAllComplete ? '#064E3B' : '#1E293B' },
          ]}
        >
          <Text
            style={[
              styles.progressText,
              { color: isAllComplete ? '#34D399' : '#94A3B8' },
            ]}
          >
            {completedCount}/{checklist.length} Done
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {checklist.map((item, idx) => {
          const isDone = Boolean(completedSteps[idx]);

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => toggleStep(idx)}
              style={[styles.itemCard, isDone && styles.itemCardDone]}
            >
              <View style={styles.checkboxWrapper}>
                <Feather
                  name={isDone ? 'check-square' : 'square'}
                  size={18}
                  color={isDone ? '#22C55E' : '#64748B'}
                />
              </View>

              <View style={styles.itemContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.stepNum}>Step {item.step || idx + 1}:</Text>
                  <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                    {item.title}
                  </Text>
                </View>
                {item.instruction ? (
                  <Text style={[styles.itemInstruction, isDone && styles.itemInstructionDone]}>
                    {item.instruction}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1A15',
    borderWidth: 1,
    borderColor: '#193828',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#162C21',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#BBF7D0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  list: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#13211B',
    borderWidth: 1,
    borderColor: '#1E382B',
    borderRadius: 12,
    padding: 10,
  },
  itemCardDone: {
    backgroundColor: '#0A1812',
    borderColor: '#11462E',
    opacity: 0.8,
  },
  checkboxWrapper: {
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  stepNum: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
  },
  itemTitle: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  itemTitleDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  itemInstruction: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  itemInstructionDone: {
    color: '#64748B',
  },
});
