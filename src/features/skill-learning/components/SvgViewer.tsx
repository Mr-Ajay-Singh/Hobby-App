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

// 🛡️ Error Boundary to prevent malformed SVG XML from crashing the React tree
class SvgErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[SvgViewer] Handled malformed SVG render error:', error?.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallbackBox}>
          <MaterialCommunityIcons name="vector-polyline" size={24} color={Colors.accentCyan} />
          <Text style={styles.fallbackText}>Visual Diagram (Raw render unavailable)</Text>
        </View>
      );
    }
    return this.props.children;
  }
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

  // Extract strict <svg ... </svg> block if wrapped in explanation text
  const match = cleanSvg.match(/<svg[\s\S]*?<\/svg>/i);
  if (!match) return null;
  cleanSvg = match[0];

  // Sanitize ARIA & Web attributes for React Native Web DOM compatibility
  cleanSvg = cleanSvg
    .replace(/\saria[a-z0-9_-]*=("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  const cardWidth = Math.min(windowWidth - 68, 800);

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

      {/* Embedded In-Card SVG with Error Boundary */}
      <View style={styles.svgWrapper}>
        <SvgErrorBoundary>
          <SvgXml xml={cleanSvg} width={cardWidth} height={160} />
        </SvgErrorBoundary>
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
            contentContainerStyle={styles.modalScrollContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalSvgContainer}>
              <SvgErrorBoundary>
                <SvgXml xml={cleanSvg} width={windowWidth - 32} height={400} />
              </SvgErrorBoundary>
            </View>
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
  fallbackBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  modalSvgContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
