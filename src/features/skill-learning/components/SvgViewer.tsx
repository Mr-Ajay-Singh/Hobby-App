import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';

interface SvgViewerProps {
  svgContent: string;
  title?: string;
}

export const SvgViewer: React.FC<SvgViewerProps> = ({
  svgContent,
  title = 'Visual Learning Diagram',
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  if (!svgContent || typeof svgContent !== 'string') return null;

  // Clean SVG XML
  let cleanSvg = svgContent.trim();
  if (cleanSvg.startsWith('```xml')) {
    cleanSvg = cleanSvg.replace(/^```xml\s*/, '').replace(/\s*```$/, '').trim();
  } else if (cleanSvg.startsWith('```')) {
    cleanSvg = cleanSvg.replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
  }

  const isInvalid = !cleanSvg.includes('<svg') || !cleanSvg.includes('</svg>');
  if (isInvalid) return null;

  const cardWidth = windowWidth - 68;

  return (
    <View style={styles.container}>
      {/* Header with Title & Fullscreen Action */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="vector-polyline" size={17} color={Colors.accentCyan} />
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setFullscreen(true)}
          style={styles.expandButton}
        >
          <Feather name="maximize-2" size={14} color={Colors.textMuted} />
          <Text style={styles.expandText}>Zoom</Text>
        </TouchableOpacity>
      </View>

      {/* Embedded In-Card SVG */}
      <View style={styles.svgWrapper}>
        <SvgXml xml={cleanSvg} width={cardWidth} height={160} />
      </View>

      {/* Fullscreen Zoom Modal */}
      <Modal
        visible={fullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setFullscreen(false)}
              style={styles.closeButton}
            >
              <Feather name="x" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            maximumZoomScale={3}
            minimumZoomScale={1}
            contentContainerStyle={styles.modalScrollContent}
            centerContent
          >
            <SvgXml xml={cleanSvg} width={windowWidth - 32} height={320} />
          </ScrollView>
        </View>
      </Modal>
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
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  expandText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  svgWrapper: {
    backgroundColor: Colors.bgAppAlt,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.bgOverlay,
    justifyContent: 'center',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
