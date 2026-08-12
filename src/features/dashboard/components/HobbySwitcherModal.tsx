import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchUserHobbiesList } from '../api/dashboardApi';
import { Colors } from '@/shared/theme';

const HOBBY_EMOJI_MAP: Record<string, string> = {
  piano: '🎹',
  guitar: '🎸',
  cricket: '🏏',
  ludo: '🎲',
  chess: '♟️',
  drawing: '🎨',
  spanish: '🇪🇸',
  coding: '💻',
  singing: '🎤',
  photography: '📸',
  cooking: '🍳',
  yoga: '🧘',
  swimming: '🏊',
  running: '🏃',
  reading: '📚',
};

const getHobbyEmoji = (hobbyName?: string): string => {
  if (!hobbyName) return '🎯';
  return HOBBY_EMOJI_MAP[hobbyName.toLowerCase()] || '🎯';
};

interface HobbySwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  activeUserHobbyId?: string;
  onSelectHobby: (userHobbyId: string) => void;
  onHobbyEnrolled: () => void;
  onOpenOnboardingFlow?: (initialHobbyName?: string) => void;
}

const CATALOG_PRESETS = [
  { name: 'Piano', emoji: '🎹' },
  { name: 'Guitar', emoji: '🎸' },
  { name: 'Cricket', emoji: '🏏' },
  { name: 'Ludo', emoji: '🎲' },
  { name: 'Chess', emoji: '♟️' },
  { name: 'Drawing', emoji: '🎨' },
];

export const HobbySwitcherModal: React.FC<HobbySwitcherModalProps> = ({
  visible,
  onClose,
  activeUserHobbyId,
  onSelectHobby,
  onHobbyEnrolled,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userHobbies, setUserHobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHobbies = async () => {
    setLoading(true);
    try {
      const res = await fetchUserHobbiesList();
      setUserHobbies(res.userHobbies || []);
    } catch (err) {
      console.warn('Failed to load user hobbies list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadHobbies();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="compass-outline" size={22} color={Colors.accentCyan} />
              <Text style={styles.title}>My Hobbies & Skills</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* 1. Enrolled Hobbies Section */}
            <Text style={styles.sectionHeader}>Enrolled Hobbies</Text>

            {loading ? (
              <ActivityIndicator size="small" color={Colors.accentCyan} style={{ marginVertical: 20 }} />
            ) : userHobbies.length === 0 ? (
              <Text style={styles.emptyText}>No hobbies enrolled yet.</Text>
            ) : (
              userHobbies.map((item) => {
                const isActive = item._id === activeUserHobbyId;
                const hobbyName = item.hobbyId?.name || 'Hobby';

                return (
                  <TouchableOpacity
                    key={item._id}
                    style={[styles.hobbyRow, isActive && styles.hobbyRowActive]}
                    onPress={() => {
                      onSelectHobby(item._id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.hobbyRowLeft}>
                      <Text style={styles.hobbyEmoji}>{getHobbyEmoji(hobbyName)}</Text>
                      <View>
                        <Text style={[styles.hobbyRowTitle, isActive && styles.hobbyRowTitleActive]}>
                          {hobbyName}
                        </Text>
                        <Text style={styles.hobbyRowSub}>
                          {item.currentStage ? item.currentStage.replace('_', ' ') : 'active'} • {item.weeklyPracticeMinutes || 120} mins/wk
                        </Text>
                      </View>
                    </View>

                    {isActive ? (
                      <View style={styles.activeCheck}>
                        <Feather name="check" size={16} color={Colors.success} />
                      </View>
                    ) : (
                      <Feather name="chevron-right" size={18} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}

            {/* 2. Start Onboarding Questionnaire CTA */}
            <TouchableOpacity
              style={styles.addHobbyBtn}
              onPress={() => {
                onClose();
                router.push('/hobby-onboarding');
              }}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={18} color={Colors.textPrimary} />
              <Text style={styles.addHobbyBtnText}>+ Start New Hobby Onboarding</Text>
            </TouchableOpacity>

            <Text style={styles.presetTitle}>Quick Start Catalog:</Text>
            <View style={styles.presetGrid}>
              {CATALOG_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  style={styles.presetChip}
                  onPress={() => {
                    onClose();
                    router.push({
                      pathname: '/hobby-onboarding',
                      params: { initialHobby: preset.name },
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                  <Text style={styles.presetChipText}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderCard,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderCard,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionHeader: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginVertical: 12,
  },
  hobbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgApp,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  hobbyRowActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: Colors.accentCyan,
  },
  hobbyRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hobbyEmoji: {
    fontSize: 22,
  },
  hobbyRowTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  hobbyRowTitleActive: {
    color: Colors.accentCyan,
  },
  hobbyRowSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  activeCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHobbyBtn: {
    backgroundColor: Colors.primaryBtn,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  addHobbyBtnText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  addCard: {
    backgroundColor: Colors.bgApp,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    marginTop: 10,
    marginBottom: 20,
  },
  addCardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 14,
  },
  presetTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D374D',
  },
  presetEmoji: {
    fontSize: 14,
  },
  presetChipText: {
    color: Colors.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
  addCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.primaryBtn,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitBtnText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
