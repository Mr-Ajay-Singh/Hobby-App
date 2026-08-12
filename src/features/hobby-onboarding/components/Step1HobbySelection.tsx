import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { HOBBY_CATALOG, AVATAR_EMOJIS } from '../constants';

interface Step1HobbySelectionProps {
  customHobby: string;
  setCustomHobby: (val: string) => void;
  selectedHobby: string;
  setSelectedHobby: (val: string) => void;
  setGoal: (val: string) => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  avatarEmoji: string;
  setAvatarEmoji: (val: string) => void;
}

export const Step1HobbySelection: React.FC<Step1HobbySelectionProps> = ({
  customHobby,
  setCustomHobby,
  selectedHobby,
  setSelectedHobby,
  setGoal,
  displayName,
  setDisplayName,
  avatarEmoji,
  setAvatarEmoji,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>What hobby do you want to learn?</Text>
      <Text style={styles.stepSub}>Select from catalog or enter your custom skill below.</Text>

      <TextInput
        style={styles.textInput}
        value={customHobby}
        onChangeText={(txt) => {
          setCustomHobby(txt);
          const match = HOBBY_CATALOG.find(
            (h) => h.name.toLowerCase() === txt.trim().toLowerCase()
          );
          setSelectedHobby(match ? match.name : '');
        }}
        placeholder="e.g. Cricket, Ludo, Guitar, Spanish..."
        placeholderTextColor="#64748B"
      />

      <Text style={styles.gridTitle}>Or Pick a Popular Hobby:</Text>
      <View style={styles.catalogGrid}>
        {HOBBY_CATALOG.map((item) => {
          const isSelected =
            selectedHobby === item.name ||
            customHobby.trim().toLowerCase() === item.name.toLowerCase();
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.catalogCard, isSelected && styles.catalogCardSelected]}
              onPress={() => {
                setSelectedHobby(item.name);
                setCustomHobby(item.name); // Fills textfield with selected chip name!
                if (item.defaultGoals.length > 0) {
                  setGoal(item.defaultGoals[0]);
                }
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.catalogEmoji}>{item.emoji}</Text>
              <Text style={[styles.catalogName, isSelected && styles.catalogNameSelected]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🏆 Optional Leaderboard Profile */}
      <Text style={[styles.gridTitle, { marginTop: 24 }]}>
        🏆 Leaderboard Profile (Optional):
      </Text>
      <TextInput
        style={styles.textInput}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your Display Name (e.g. Alex Rivera)"
        placeholderTextColor="#64748B"
      />

      <Text style={styles.avatarLabel}>Choose Avatar Icon:</Text>
      <View style={styles.avatarGrid}>
        {AVATAR_EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[styles.avatarChip, avatarEmoji === emoji && styles.avatarChipSelected]}
            onPress={() => setAvatarEmoji(emoji)}
            activeOpacity={0.75}
          >
            <Text style={styles.avatarEmojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  stepSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#151124',
    borderWidth: 1,
    borderColor: '#292044',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  gridTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  catalogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#151124',
    borderWidth: 1,
    borderColor: '#261F3E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  catalogCardSelected: {
    backgroundColor: '#26134B',
    borderColor: '#9333EA',
  },
  catalogEmoji: {
    fontSize: 18,
  },
  catalogName: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  catalogNameSelected: {
    color: '#E9D5FF',
    fontWeight: '800',
  },
  avatarLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#151124',
    borderWidth: 1,
    borderColor: '#261F3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarChipSelected: {
    backgroundColor: '#3B156B',
    borderColor: '#A855F7',
    borderWidth: 2,
  },
  avatarEmojiText: {
    fontSize: 22,
  },
});
