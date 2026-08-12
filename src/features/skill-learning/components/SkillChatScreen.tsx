import { Colors } from '@/shared/theme';
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSkillChatStore } from '../store/useSkillChatStore';
import { useApiConfigStore } from '../store/useApiConfigStore';
import {
  useChatHistoryQuery,
  useSendSkillMessageMutation,
  formatHistoryMessages,
} from '../api/skillChatQueries';
import { SkillChatHeader } from './SkillChatHeader';
import { SkillProgressHeader } from './SkillProgressHeader';
import { SkillMessageBubble } from './SkillMessageBubble';
import { SkillChatConfigModal } from './SkillChatConfigModal';

interface SkillChatScreenProps {
  onBack?: () => void;
  userHobbyId?: string;
}

export const SkillChatScreen: React.FC<SkillChatScreenProps> = ({ onBack, userHobbyId }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList | null>(null);

  // Zustand State
  const {
    conversationId,
    userHobbyId: storeUserHobbyId,
    skillInfo,
    inputMessage,
    lastFailedPrompt,
    messages,
    setUserHobbyId,
    setInputMessage,
    setMessages,
    resetChat,
  } = useSkillChatStore();

  const effectiveUserHobbyId = userHobbyId || storeUserHobbyId;

  useEffect(() => {
    if (userHobbyId && userHobbyId !== storeUserHobbyId) {
      resetChat();
      setUserHobbyId(userHobbyId);
    } else if (userHobbyId) {
      setUserHobbyId(userHobbyId);
    }
  }, [userHobbyId]);

  const { baseUrl } = useApiConfigStore();

  // Local Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [configModalVisible, setConfigModalVisible] = useState(false);

  // TanStack Query: Fetch History (uses effectiveUserHobbyId directly!)
  const historyQuery = useChatHistoryQuery(currentPage, 20, effectiveUserHobbyId);

  // Sync TanStack Query history result with Zustand state on fetch or cache hit
  useEffect(() => {
    if (historyQuery.data) {
      const formatted = formatHistoryMessages(historyQuery.data);
      setMessages(formatted);
    }
  }, [historyQuery.data]);

  // TanStack Query: Send Message Mutation
  const sendMutation = useSendSkillMessageMutation();

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!historyQuery.isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages.length, sendMutation.isPending, historyQuery.isLoading]);

  const handleSendMessage = (promptToSend?: string) => {
    const query = promptToSend || inputMessage;
    if (!query.trim() || sendMutation.isPending) return;

    const userPrompt = query.trim();
    setInputMessage('');

    sendMutation.mutate({
      message: userPrompt,
      conversationId,
    });
  };

  const handleLoadEarlier = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleResetChat = () => {
    Alert.alert('Reset Chat', 'Clear chat history and start a new conversation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetChat();
          setCurrentPage(1);
        },
      },
    ]);
  };

  const hasMoreHistory = historyQuery.data?.hasMore || false;
  const totalMessages = historyQuery.data?.totalMessages || 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Top Header */}
      <SkillChatHeader
        skillInfo={skillInfo}
        onBack={() => (onBack ? onBack() : Alert.alert('Back', 'Navigating back...'))}
        onOpenSettings={() => setConfigModalVisible(true)}
        onResetChat={handleResetChat}
      />

      {/* 2. Real-Time Skill Mastery Tier Progress Banner */}
      {skillInfo ? (
        <View style={styles.progressHeaderWrapper}>
          <SkillProgressHeader skillInfo={skillInfo} />
        </View>
      ) : null}

      {/* 3. Messages List Area (Virtualized for Performance) */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        contentContainerStyle={[
          styles.chatContent,
          messages.length === 0 && styles.emptyChatContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={historyQuery.isRefetching}
            onRefresh={() => historyQuery.refetch()}
            tintColor={Colors.accentCyan}
            colors={[Colors.accentCyan]}
          />
        }
        ListHeaderComponent={
          hasMoreHistory ? (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={historyQuery.isFetching}
              onPress={handleLoadEarlier}
              style={styles.loadEarlierBtn}
            >
              {historyQuery.isFetching ? (
                <ActivityIndicator size="small" color={Colors.accentCyan} />
              ) : (
                <>
                  <Feather name="clock" size={13} color={Colors.accentCyan} />
                  <Text style={styles.loadEarlierText}>
                    Load earlier messages ({totalMessages - messages.length} more)
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          historyQuery.isLoading ? (
            <View style={{ paddingVertical: 50, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <ActivityIndicator size="large" color={Colors.accentCyan} />
              <Text style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: '600' }}>Loading chat history...</Text>
            </View>
          ) : historyQuery.isError ? (
            <View style={{ paddingVertical: 30, paddingHorizontal: 16, alignItems: 'center', gap: 12 }}>
              <MaterialCommunityIcons name="wifi-off" size={40} color={Colors.danger} />
              <Text style={{ color: Colors.danger, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
                Unable to load chat history
              </Text>
              <Text style={{ color: Colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
                Check if the backend server is active at {baseUrl}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => historyQuery.refetch()}
                  style={styles.retryButton}
                >
                  <Feather name="refresh-cw" size={14} color={Colors.accentCyan} />
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setConfigModalVisible(true)}
                  style={styles.configErrorButton}
                >
                  <Ionicons name="server-outline" size={15} color={Colors.warning} />
                  <Text style={styles.configErrorButtonText}>Change Server IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <MaterialCommunityIcons name="robot-happy" size={36} color={Colors.accentCyan} />
              </View>
              <Text style={styles.emptyStateTitle}>Multi-Modal Skill Learning</Text>
              <Text style={styles.emptyStateSubtitle}>
                Connected to <Text style={styles.serverHighlight}>{baseUrl}</Text>
              </Text>
              <Text style={styles.emptyStateDesc}>
                Lessons deliver Markdown, SVGs, audio narration, quizzes, and flashcards.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <SkillMessageBubble
            item={item}
            onSendQuizScore={(summary) => handleSendMessage(summary)}
          />
        )}
        ListFooterComponent={
          <View style={{ gap: 8 }}>
            {/* Real Loading Indicator */}
            {sendMutation.isPending && (
              <View style={styles.loadingRow}>
                <View style={styles.aiLoadingAvatar}>
                  <MaterialCommunityIcons name="robot-happy" size={16} color={Colors.accentCyan} />
                </View>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={Colors.accentCyan} />
                  <Text style={styles.loadingText}>AI Coach is thinking...</Text>
                </View>
              </View>
            )}

            {/* Retry on Error */}
            {lastFailedPrompt && !sendMutation.isPending && (
              <View style={styles.errorActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSendMessage(lastFailedPrompt)}
                  style={styles.retryButton}
                >
                  <Feather name="refresh-cw" size={14} color={Colors.accentCyan} />
                  <Text style={styles.retryButtonText}>Retry Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setConfigModalVisible(true)}
                  style={styles.configErrorButton}
                >
                  <Ionicons name="server-outline" size={15} color={Colors.warning} />
                  <Text style={styles.configErrorButtonText}>Change Server IP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />

      {/* 4. Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom + 12, 24) },
          ]}
        >
          <TextInput
            style={styles.textInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask your AI Coach anything..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSendMessage()}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSendMessage()}
            style={[
              styles.sendButton,
              { opacity: inputMessage.trim() && !sendMutation.isPending ? 1 : 0.5 },
            ]}
            disabled={!inputMessage.trim() || sendMutation.isPending}
          >
            <Feather name="arrow-up" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 6. API Configuration Sheet */}
      <SkillChatConfigModal
        visible={configModalVisible}
        onClose={() => setConfigModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgAppAlt,
  },
  progressHeaderWrapper: {
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  emptyChatContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadEarlierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  loadEarlierText: {
    color: Colors.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1.5,
    borderColor: Colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    marginBottom: 10,
  },
  serverHighlight: {
    color: Colors.accentCyan,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  emptyStateDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  aiLoadingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  errorActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 6,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    paddingVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  retryButtonText: {
    color: Colors.accentCyan,
    fontSize: 13,
    fontWeight: '700',
  },
  configErrorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    paddingVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  configErrorButtonText: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: Colors.bgApp,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    borderRadius: 22,
    color: Colors.textPrimary,
    fontSize: 14.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryBtn,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryBtn,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});
