import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SkillStarterTopicsProps {
  onSelectTopic: (prompt: string) => void;
}

const TOPICS = [
  {
    id: 'piano_scale',
    icon: 'piano',
    label: 'C Major Scale on Piano',
    color: '#38BDF8',
    prompt: 'Teach me how to play C Major scale on piano with a diagram and quiz',
  },
  {
    id: 'guitar_chords',
    icon: 'guitar-acoustic',
    label: 'Guitar Open Chords',
    color: '#F59E0B',
    prompt: 'Show me basic open guitar chords (C, G, D, Em) and strumming checklist',
  },
  {
    id: 'chess_openings',
    icon: 'chess-knight',
    label: 'Chess Opening Principles',
    color: '#A855F7',
    prompt: 'Explain the fundamental opening principles in chess with a flashcard quiz',
  },
  {
    id: 'python_loops',
    icon: 'language-python',
    label: 'Python Loops & Functions',
    color: '#22C55E',
    prompt: 'Explain Python for loops and functions with code snippets and expected output',
  },
];

export const SkillStarterTopics: React.FC<SkillStarterTopicsProps> = ({
  onSelectTopic,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>QUICK STARTER TOPICS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TOPICS.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.8}
            onPress={() => onSelectTopic(topic.prompt)}
            style={styles.topicCard}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name={topic.icon as any}
                size={16}
                color={topic.color}
              />
            </View>
            <Text style={styles.topicLabel}>{topic.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    backgroundColor: '#0A0C12',
    borderTopWidth: 1,
    borderTopColor: '#141824',
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2538',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#182030',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
});
