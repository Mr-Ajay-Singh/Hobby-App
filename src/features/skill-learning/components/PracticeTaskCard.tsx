import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';

interface PracticeTaskCardProps {
  task: string;
}

export const PracticeTaskCard: React.FC<PracticeTaskCardProps> = ({ task }) => {
  if (!task) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="target" size={16} color={Colors.accentPurple} />
        <Text style={styles.title}>Practice Task</Text>
      </View>
      <Text style={styles.taskText}>{task}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderPurple,
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    color: Colors.accentPurpleBadge,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  taskText: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    lineHeight: 19,
  },
});
