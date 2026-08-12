import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';
import { FlashcardItem } from '../schemas/skillChatSchema';

interface FlashcardViewerProps {
  flashcards: FlashcardItem[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards }) => {
  if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="cards-outline" size={18} color={Colors.accentCyan} />
          <Text style={styles.headerTitle}>Memorization Flashcards</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleFlip}
        style={[styles.cardSurface, isFlipped && styles.cardSurfaceFlipped]}
      >
        <View style={styles.sideRow}>
          <View
            style={[
              styles.sideBadge,
              { backgroundColor: isFlipped ? Colors.successBg : Colors.bgAppAlt },
            ]}
          >
            <Text
              style={[
                styles.sideBadgeText,
                { color: isFlipped ? Colors.success : Colors.accentCyan },
              ]}
            >
              {isFlipped ? 'ANSWER / BACK' : 'QUESTION / FRONT'}
            </Text>
          </View>
          <Text style={styles.tapPrompt}>Tap to flip ↻</Text>
        </View>

        <Text style={[styles.cardText, isFlipped && styles.cardTextFlipped]}>
          {isFlipped ? card.back : card.front}
        </Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePrev}
          style={styles.navBtn}
        >
          <Feather name="chevron-left" size={18} color={Colors.textMuted} />
          <Text style={styles.navBtnText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleFlip}
          style={styles.flipCenterBtn}
        >
          <MaterialCommunityIcons name="rotate-3d-variant" size={16} color={Colors.accentCyan} />
          <Text style={styles.flipCenterText}>
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleNext}
          style={styles.navBtn}
        >
          <Text style={styles.navBtnText}>Next</Text>
          <Feather name="chevron-right" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
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
    borderBottomColor: Colors.borderSubtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: Colors.textCyan,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  counterBadge: {
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterText: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  cardSurface: {
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardSurfaceFlipped: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.successBorder,
  },
  sideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sideBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sideBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tapPrompt: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  cardText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  cardTextFlipped: {
    color: Colors.success,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  flipCenterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.bgAppAlt,
    borderWidth: 1,
    borderColor: Colors.borderHighlight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  flipCenterText: {
    color: Colors.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
});
