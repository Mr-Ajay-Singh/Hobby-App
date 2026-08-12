import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';
import { AudioContent } from '../schemas/skillChatSchema';

interface AudioPlayerProps {
  audio?: AudioContent | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
  if (!audio || (!audio.base64 && !audio.audioUrl && !audio.script)) {
    return null;
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const html5AudioRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  const narrationText = (audio.script || '').trim();

  const wordCount = narrationText ? narrationText.split(/\s+/).length : 10;
  const estimatedDurationSec = Math.max(4, Math.ceil((wordCount / 140) * 60));

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    if (Platform.OS !== 'web') {
      try {
        Speech.stop();
      } catch (_) {}
    }
    if (html5AudioRef.current) {
      try {
        html5AudioRef.current.pause();
      } catch (_) {}
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    stopAllAudio();
    setIsPlaying(true);

    const sourceUri = audio.base64 || audio.audioUrl;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && sourceUri) {
      try {
        if (!html5AudioRef.current) {
          html5AudioRef.current = new window.Audio(sourceUri);
          html5AudioRef.current.onended = () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          };
          html5AudioRef.current.ontimeupdate = () => {
            if (html5AudioRef.current.duration) {
              setPlaybackProgress(
                html5AudioRef.current.currentTime / html5AudioRef.current.duration
              );
            }
          };
        }
        html5AudioRef.current.playbackRate = playbackSpeed;
        html5AudioRef.current.play().catch(() => {});
      } catch (err) {
        console.warn('Web Audio error:', err);
      }
    } else if (narrationText) {
      try {
        Speech.speak(narrationText, {
          rate: playbackSpeed * 0.95,
          pitch: 1.0,
          onDone: () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          },
          onStopped: () => {
            setIsPlaying(false);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          },
          onError: () => {
            setIsPlaying(false);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          },
        });
      } catch (speechErr) {
        console.warn('Native speech playback warning:', speechErr);
      }
    }

    const intervalMs = 150;
    const totalSteps = (estimatedDurationSec * 1000) / (intervalMs * playbackSpeed);
    const stepIncrement = 1 / totalSteps;

    progressTimerRef.current = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 1) {
          clearInterval(progressTimerRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    stopAllAudio();
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);

    if (isPlaying) {
      startPlayback();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleTogglePlay}
          style={styles.playButton}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={18}
            color={Colors.primaryBtnText}
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </TouchableOpacity>

        <View style={styles.trackInfo}>
          <View style={styles.labelRow}>
            <View style={styles.micBadge}>
              <MaterialCommunityIcons
                name={isPlaying ? 'waveform' : 'microphone'}
                size={13}
                color={Colors.success}
              />
              <Text style={styles.micText}>
                {isPlaying ? 'Playing Narration' : 'AI Voice Narration'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={cycleSpeed}
              style={styles.speedBtn}
            >
              <Text style={styles.speedText}>{playbackSpeed}x</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(4, playbackProgress * 100)}%` },
              ]}
            />
          </View>
        </View>

        {narrationText ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowScript(!showScript)}
            style={[styles.scriptBtn, showScript && styles.scriptBtnActive]}
          >
            <Feather
              name={showScript ? 'chevron-up' : 'file-text'}
              size={16}
              color={showScript ? Colors.accentCyan : Colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {showScript && narrationText ? (
        <View style={styles.scriptDrawer}>
          <Text style={styles.scriptLabel}>NARRATION TRANSCRIPT:</Text>
          <Text style={styles.scriptText}>"{narrationText}"</Text>
        </View>
      ) : null}
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
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBtn,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryBtn,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  trackInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  micBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  micText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  speedBtn: {
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speedText: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.bgAppAlt,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentCyan,
    borderRadius: 2,
  },
  scriptBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scriptBtnActive: {
    backgroundColor: Colors.borderHighlight,
  },
  scriptDrawer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  scriptLabel: {
    color: Colors.accentCyan,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  scriptText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
