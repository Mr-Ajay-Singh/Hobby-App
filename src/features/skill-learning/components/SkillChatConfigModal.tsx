import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAutoDetectedHost } from '@/shared/lib/urlUtils';
import { useApiConfigStore } from '../store/useApiConfigStore';
import { AudioVoice } from '../schemas/skillChatSchema';

interface SkillChatConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SkillChatConfigModal: React.FC<SkillChatConfigModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const {
    baseUrl,
    model,
    voice,
    setBaseUrl,
    setModel,
    setVoice,
    resetConfig,
  } = useApiConfigStore();

  const [inputUrl, setInputUrl] = useState(baseUrl);
  const [selectedModel, setSelectedModel] = useState(model);
  const [selectedVoice, setSelectedVoice] = useState(voice);

  const detectedLanIp = getAutoDetectedHost();

  const handleSave = () => {
    let cleanUrl = inputUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `http://${cleanUrl}`;
    }
    setBaseUrl(cleanUrl);
    setModel(selectedModel);
    setVoice(selectedVoice);
    onClose();
  };

  const handleReset = () => {
    resetConfig();
    const defaults = useApiConfigStore.getState();
    setInputUrl(defaults.baseUrl);
    setSelectedModel(defaults.model);
    setSelectedVoice(defaults.voice);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="server-outline" size={20} color="#38BDF8" />
              <Text style={styles.sheetTitle}>API Connection Settings</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
              <Feather name="x" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Backend URL Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BACKEND SERVER URL (PORT 4021)</Text>
              <TextInput
                style={styles.input}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="http://10.0.2.2:4021"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                Android emulator uses <Text style={styles.codeText}>10.0.2.2</Text>. Physical devices use your Wi-Fi LAN IP.
              </Text>
            </View>

            {/* Quick 1-Tap IP Presets */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>QUICK IP PRESETS</Text>
              <View style={styles.presetRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setInputUrl('http://10.0.2.2:4021')}
                  style={styles.presetBtn}
                >
                  <MaterialCommunityIcons name="android" size={15} color="#38BDF8" />
                  <Text style={styles.presetText}>Emulator (10.0.2.2)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setInputUrl(`http://${detectedLanIp}:4021`)}
                  style={styles.presetBtn}
                >
                  <Feather name="wifi" size={14} color="#22C55E" />
                  <Text style={styles.presetText}>LAN ({detectedLanIp})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setInputUrl('http://localhost:4021')}
                  style={styles.presetBtn}
                >
                  <MaterialCommunityIcons name="laptop" size={15} color="#FBBF24" />
                  <Text style={styles.presetText}>Localhost</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* AI Model Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>AI REASONING ENGINE</Text>
              <View style={styles.toggleRow}>
                {['gemini', 'gemini-lite', 'chatgpt'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    activeOpacity={0.8}
                    onPress={() => setSelectedModel(m)}
                    style={[
                      styles.toggleBtn,
                      selectedModel === m && styles.toggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        selectedModel === m && styles.toggleBtnTextActive,
                      ]}
                    >
                      {m.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Audio Voice Choice */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>AUDIO NARRATION VOICE</Text>
              <View style={styles.voiceGrid}>
                {['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].map((v) => (
                  <TouchableOpacity
                    key={v}
                    activeOpacity={0.8}
                    onPress={() => setSelectedVoice(v as AudioVoice)}
                    style={[
                      styles.voiceBtn,
                      selectedVoice === v && styles.voiceBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.voiceBtnText,
                        selectedVoice === v && styles.voiceBtnTextActive,
                      ]}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleReset}
                style={styles.resetBtn}
              >
                <Text style={styles.resetBtnText}>Restore Defaults</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0F121C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#1E2538',
    padding: 20,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2030',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#161B28',
    borderWidth: 1,
    borderColor: '#242D42',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  helperText: {
    color: '#64748B',
    fontSize: 11.5,
    marginTop: 6,
    lineHeight: 16,
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161B28',
    borderWidth: 1,
    borderColor: '#242D42',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  presetText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#161B28',
    borderWidth: 1,
    borderColor: '#242D42',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#0F263E',
    borderColor: '#38BDF8',
  },
  toggleBtnText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: '#38BDF8',
  },
  voiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  voiceBtn: {
    backgroundColor: '#161B28',
    borderWidth: 1,
    borderColor: '#242D42',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  voiceBtnActive: {
    backgroundColor: '#0F263E',
    borderColor: '#22C55E',
  },
  voiceBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  voiceBtnTextActive: {
    color: '#22C55E',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1A2030',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#161B28',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2F69FE',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2F69FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
