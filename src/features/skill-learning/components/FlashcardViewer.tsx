import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
          <MaterialCommunityIcons name="cards-outline" size={18} color="#38BDF8" />
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
              { backgroundColor: isFlipped ? '#064E3B' : '#0F2B48' },
            ]}
          >
            <Text
              style={[
                styles.sideBadgeText,
                { color: isFlipped ? '#34D399' : '#38BDF8' },
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
          <Feather name="chevron-left" size={18} color="#94A3B8" />
          <Text style={styles.navBtnText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleFlip}
          style={styles.flipCenterBtn}
        >
          <MaterialCommunityIcons name="rotate-3d-variant" size={16} color="#38BDF8" />
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
          <Feather name="chevron-right" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1622',
    borderWidth: 1,
    borderColor: '#1C293D',
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
    borderBottomColor: '#1A2536',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#BAE6FD',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  counterBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  cardSurface: {
    backgroundColor: '#151D2A',
    borderWidth: 1,
    borderColor: '#243248',
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardSurfaceFlipped: {
    backgroundColor: '#0E211A',
    borderColor: '#134E35',
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
    color: '#64748B',
    fontSize: 11,
  },
  cardText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  cardTextFlipped: {
    color: '#A7F3D0',
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
    backgroundColor: '#151C28',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  flipCenterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#0F263E',
    borderWidth: 1,
    borderColor: '#1D456E',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  flipCenterText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
});
