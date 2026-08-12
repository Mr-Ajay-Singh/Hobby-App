import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';
import { VideoContent } from '../schemas/skillChatSchema';

interface VideoCardProps {
  video: VideoContent;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  if (!video || !video.embedUrl) return null;

  const handleOpenVideo = () => {
    try {
      Linking.openURL(video.embedUrl);
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="video-vintage" size={18} color={Colors.danger} />
          <Text style={styles.headerTitle}>Video Demonstration</Text>
        </View>
        {video.durationSeconds ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.durationSeconds}s Clip</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleOpenVideo}
        style={styles.previewBox}
      >
        <View style={styles.playIconCircle}>
          <Feather name="play" size={22} color={Colors.primaryBtnText} style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoTitle}>{video.title || 'Watch Video Guide'}</Text>
        <Text style={styles.urlHint}>Tap to watch external demonstration video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
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
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  durationBadge: {
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  durationText: {
    color: Colors.danger,
    fontSize: 10.5,
    fontWeight: '700',
  },
  previewBox: {
    backgroundColor: Colors.bgAppAlt,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  videoTitle: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  urlHint: {
    color: Colors.textSecondary,
    fontSize: 11.5,
  },
});
