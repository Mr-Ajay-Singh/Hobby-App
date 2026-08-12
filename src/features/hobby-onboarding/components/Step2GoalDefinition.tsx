import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HOBBY_CATALOG } from '../constants';
import { Colors } from '@/shared/theme';

interface Step2GoalDefinitionProps {
  activeHobbyName: string;
  goal: string;
  setGoal: (val: string) => void;
}

export const Step2GoalDefinition: React.FC<Step2GoalDefinitionProps> = ({
  activeHobbyName,
  goal,
  setGoal,
}) => {
  const currentHobbyPreset = HOBBY_CATALOG.find(
    (h) => h.name.toLowerCase() === activeHobbyName.trim().toLowerCase()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>What is your main goal for {activeHobbyName}?</Text>
      <Text style={styles.stepSub}>Setting a specific target helps your AI coach structure your lessons.</Text>

      <TextInput
        style={styles.textInputArea}
        value={goal}
        onChangeText={setGoal}
        multiline
        numberOfLines={3}
        placeholder={`e.g. Master ${activeHobbyName} fundamentals & rules`}
        placeholderTextColor={Colors.textMuted}
      />

      {currentHobbyPreset && (
        <>
          <Text style={styles.gridTitle}>Suggested Goal Templates:</Text>
          <View style={styles.templateList}>
            {currentHobbyPreset.defaultGoals.map((tmpl, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.templateChip, goal === tmpl && styles.templateChipSelected]}
                onPress={() => setGoal(tmpl)}
                activeOpacity={0.7}
              >
                <Feather name="target" size={14} color={goal === tmpl ? Colors.accentCyan : Colors.textSecondary} />
                <Text style={[styles.templateText, goal === tmpl && styles.templateTextSelected]}>
                  {tmpl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  stepSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  textInputArea: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  gridTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  templateList: {
    gap: 8,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  templateChipSelected: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.accentCyan,
  },
  templateText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  templateTextSelected: {
    color: Colors.accentCyan,
    fontWeight: '700',
  },
});
