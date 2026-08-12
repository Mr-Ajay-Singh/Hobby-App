import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { MusicalNotesContent } from '../schemas/skillChatSchema';

interface MusicalNotesPlayerProps {
  data: MusicalNotesContent;
}

export const MusicalNotesPlayer: React.FC<MusicalNotesPlayerProps> = ({ data }) => {
  if (!data || !data.notes || !Array.isArray(data.notes) || data.notes.length === 0) {
    return null;
  }

  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, []);

  const handlePlaySequence = () => {
    if (isPlaying) {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
      setIsPlaying(false);
      setActiveNoteIdx(null);
      return;
    }

    setIsPlaying(true);
    let idx = 0;

    const playNext = () => {
      if (idx >= data.notes.length) {
        setIsPlaying(false);
        setActiveNoteIdx(null);
        return;
      }

      const noteItem = data.notes[idx];
      setActiveNoteIdx(idx);

      try {
        Speech.speak(noteItem.note, { rate: 1.4, pitch: 1.2 });
      } catch (_) {}

      const duration = Math.max(300, noteItem.durationMs || (60000 / (data.bpm || 80)));
      idx++;
      playbackTimerRef.current = setTimeout(playNext, duration);
    };

    playNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="music-clef-treble" size={18} color="#F59E0B" />
          <Text style={styles.headerTitle}>
            {data.instrument || 'Instrument'} Note Sequence
          </Text>
        </View>
        <View style={styles.bpmBadge}>
          <Text style={styles.bpmText}>{data.bpm || 80} BPM</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.notesTrack}
      >
        {data.notes.map((item, idx) => {
          const isActive = activeNoteIdx === idx;
          return (
            <View
              key={idx}
              style={[styles.notePill, isActive && styles.notePillActive]}
            >
              <Text style={[styles.noteName, isActive && styles.noteNameActive]}>
                {item.note}
              </Text>
              <View
                style={[
                  styles.fingerBadge,
                  isActive && styles.fingerBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.fingerText,
                    isActive && styles.fingerTextActive,
                  ]}
                >
                  F{item.finger}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePlaySequence}
        style={[styles.playBtn, isPlaying && styles.playBtnActive]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={16}
          color="#FFFFFF"
        />
        <Text style={styles.playBtnText}>
          {isPlaying ? 'Pause Note Practice' : 'Play Note Sequence'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#17140B',
    borderWidth: 1,
    borderColor: '#3D2F12',
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
    borderBottomColor: '#2B210D',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bpmBadge: {
    backgroundColor: '#3B2A08',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bpmText: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '700',
  },
  notesTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  notePill: {
    backgroundColor: '#241C0F',
    borderWidth: 1,
    borderColor: '#3D2F18',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 54,
  },
  notePillActive: {
    backgroundColor: '#D97706',
    borderColor: '#F59E0B',
    transform: [{ scale: 1.08 }],
  },
  noteName: {
    color: '#FDE68A',
    fontSize: 14,
    fontWeight: '800',
  },
  noteNameActive: {
    color: '#FFFFFF',
  },
  fingerBadge: {
    backgroundColor: '#382B14',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 4,
  },
  fingerBadgeActive: {
    backgroundColor: '#92400E',
  },
  fingerText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '700',
  },
  fingerTextActive: {
    color: '#FEF3C7',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#B45309',
    paddingVertical: 8,
    borderRadius: 10,
  },
  playBtnActive: {
    backgroundColor: '#78350F',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
});
