import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Colors } from '@/shared/theme';

export interface VideoContentPayload {
  title?: string;
  videoId?: string;
  embedUrl: string;
  thumbnailUrl?: string;
  channelTitle?: string;
  durationSeconds?: number;
}

interface VideoCardProps {
  video: VideoContentPayload;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  if (!video || !video.embedUrl) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const rawVideoId =
    video.videoId || video.embedUrl.match(/(?:embed\/|v=|\/vi\/|youtu\.be\/|\/v\/)([^#&?]*)/)?.[1];
  const thumbnailUrl = !imageError
    ? video.thumbnailUrl || (rawVideoId ? `https://img.youtube.com/vi/${rawVideoId}/hqdefault.jpg` : null)
    : null;

  // HTML Embed string for WebView inline & modal playback
  const embedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; background-color: #0b0f19; }
          html, body { width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          .iframe-container { position: relative; width: 100%; height: 100%; }
          iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div class="iframe-container">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${rawVideoId || ''}?autoplay=1&playsinline=1&controls=1&enablejsapi=1&origin=https://www.youtube-nocookie.com" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Inline Card Header with Expand Toggle */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="youtube" size={20} color={Colors.danger} />
          <Text style={styles.headerTitle}>In-App Video Tutorial</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setIsPlaying(true);
            setIsModalOpen(true);
          }}
          style={styles.expandBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="maximize-2" size={14} color={Colors.accentCyan} />
          <Text style={styles.expandText}>Expand</Text>
        </TouchableOpacity>
      </View>

      {/* Embedded Inline Card Player */}
      {isPlaying ? (
        <View style={styles.inlinePlayerContainer}>
          {Platform.OS === 'web' ? (
            React.createElement('iframe', {
              src: `https://www.youtube-nocookie.com/embed/${rawVideoId || ''}?autoplay=1&playsinline=1&controls=1&enablejsapi=1&origin=https://www.youtube-nocookie.com`,
              style: { width: '100%', height: '100%', borderWidth: 0, borderRadius: 12 },
              allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
              referrerPolicy: 'strict-origin-when-cross-origin',
              allowFullScreen: true,
            })
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{ html: embedHtml, baseUrl: 'https://www.youtube-nocookie.com' }}
              style={styles.webview}
              allowsInlineMediaPlayback={true}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scrollEnabled={false}
              automaticallyAdjustContentInsets={false}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => setIsPlaying(true)}
          style={styles.previewBox}
        >
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : null}
          <View style={styles.overlay}>
            <View style={styles.playIconCircle}>
              <Feather name="play" size={26} color="#FFFFFF" style={{ marginLeft: 3 }} />
            </View>
          </View>
          <View style={styles.infoFooter}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {video.title || 'Watch Video Demonstration'}
            </Text>
            <Text style={styles.urlHint}>Tap to play video inline in chat</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Full-Screen Theater Modal Overlay inside App */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />
          
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleGroup}>
              <MaterialCommunityIcons name="youtube" size={22} color={Colors.danger} />
              <Text style={styles.modalTitle} numberOfLines={1}>
                {video.title || 'Video Tutorial'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalOpen(false)}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Full Theater Embedded Player */}
          <View style={styles.modalPlayerContainer}>
            {Platform.OS === 'web' ? (
              React.createElement('iframe', {
                src: `https://www.youtube-nocookie.com/embed/${rawVideoId || ''}?autoplay=1&playsinline=1&controls=1&enablejsapi=1&origin=https://www.youtube-nocookie.com`,
                style: { width: '100%', height: '100%', borderWidth: 0 },
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                referrerPolicy: 'strict-origin-when-cross-origin',
                allowFullScreen: true,
              })
            ) : (
              <WebView
                originWhitelist={['*']}
                source={{ html: embedHtml, baseUrl: 'https://www.youtube-nocookie.com' }}
                style={styles.modalWebview}
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* Modal Footer Info */}
          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterTitle}>{video.title}</Text>
            {video.channelTitle ? (
              <Text style={styles.modalChannel}>Channel: {video.channelTitle}</Text>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
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
    overflow: 'hidden',
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
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCardAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  expandText: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  inlinePlayerContainer: {
    width: '100%',
    height: 210,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0b0f19',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  previewBox: {
    backgroundColor: Colors.bgAppAlt,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  thumbnail: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  infoFooter: {
    backgroundColor: 'rgba(11, 15, 25, 0.88)',
    padding: 10,
  },
  videoTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  urlHint: {
    color: Colors.accentCyan,
    fontSize: 11,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPlayerContainer: {
    width: '100%',
    height: 360,
    backgroundColor: '#000',
  },
  modalWebview: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalFooter: {
    padding: 18,
    gap: 6,
  },
  modalFooterTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  modalChannel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
