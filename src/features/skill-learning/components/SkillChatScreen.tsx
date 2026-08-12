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
            tintColor="#38BDF8"
            colors={['#38BDF8']}
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
                <ActivityIndicator size="small" color="#38BDF8" />
              ) : (
                <>
                  <Feather name="clock" size={13} color="#38BDF8" />
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
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>Loading chat history...</Text>
            </View>
          ) : historyQuery.isError ? (
            <View style={{ paddingVertical: 30, paddingHorizontal: 16, alignItems: 'center', gap: 12 }}>
              <MaterialCommunityIcons name="wifi-off" size={40} color="#EF4444" />
              <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
                Unable to load chat history
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
                Check if the backend server is active at {baseUrl}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => historyQuery.refetch()}
                  style={styles.retryButton}
                >
                  <Feather name="refresh-cw" size={14} color="#38BDF8" />
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setConfigModalVisible(true)}
                  style={styles.configErrorButton}
                >
                  <Ionicons name="server-outline" size={15} color="#FBBF24" />
                  <Text style={styles.configErrorButtonText}>Change Server IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <MaterialCommunityIcons name="robot-happy" size={36} color="#38BDF8" />
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
                  <MaterialCommunityIcons name="robot-happy" size={16} color="#38BDF8" />
                </View>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#38BDF8" />
                  <Text style={styles.loadingText}>Fetching from {baseUrl}...</Text>
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
                  <Feather name="refresh-cw" size={14} color="#38BDF8" />
                  <Text style={styles.retryButtonText}>Retry Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setConfigModalVisible(true)}
                  style={styles.configErrorButton}
                >
                  <Ionicons name="server-outline" size={15} color="#FBBF24" />
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
            placeholder="Type your prompt for the backend AI..."
            placeholderTextColor="#64748B"
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
            <Feather name="arrow-up" size={20} color="#FFFFFF" />
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
    backgroundColor: '#0A0C12',
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
    backgroundColor: '#0E1724',
    borderWidth: 1,
    borderColor: '#192C44',
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  loadEarlierText: {
    color: '#38BDF8',
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
    backgroundColor: '#0E2338',
    borderWidth: 1.5,
    borderColor: '#1E4976',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    marginBottom: 10,
  },
  serverHighlight: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  emptyStateDesc: {
    color: '#64748B',
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
    backgroundColor: '#0F263E',
    borderWidth: 1,
    borderColor: '#1D456E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2538',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#8E9BB0',
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
    backgroundColor: '#0F2338',
    borderWidth: 1,
    borderColor: '#1E4976',
    paddingVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  retryButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  configErrorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#261C0D',
    borderWidth: 1,
    borderColor: '#78350F',
    paddingVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  configErrorButtonText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: '#0F121C',
    borderTopWidth: 1,
    borderTopColor: '#1A2030',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#161B28',
    borderWidth: 1,
    borderColor: '#242D42',
    borderRadius: 22,
    color: '#FFFFFF',
    fontSize: 14.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2F69FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F69FE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});
