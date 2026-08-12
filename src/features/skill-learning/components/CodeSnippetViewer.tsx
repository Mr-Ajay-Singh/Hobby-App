import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme';
import { CodeSnippetContent } from '../schemas/skillChatSchema';

interface CodeSnippetViewerProps {
  codeSnippet: CodeSnippetContent;
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({ codeSnippet }) => {
  if (!codeSnippet || !codeSnippet.code) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Code copied to clipboard', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="code-tags" size={18} color={Colors.accentCyan} />
          <Text style={styles.langBadge}>
            {(codeSnippet.language || 'Code').toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCopy}
          style={styles.copyBtn}
        >
          <Feather
            name={copied ? 'check' : 'copy'}
            size={13}
            color={copied ? Colors.success : Colors.textMuted}
          />
          <Text style={[styles.copyBtnText, copied && styles.copyBtnTextCopied]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.codeBlock}>
        <Text style={styles.codeText}>{codeSnippet.code}</Text>
      </View>

      {codeSnippet.expectedOutput ? (
        <View style={styles.outputBox}>
          <Text style={styles.outputLabel}>EXPECTED OUTPUT:</Text>
          <Text style={styles.outputText}>{codeSnippet.expectedOutput}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCardSubtle,
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
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBadge: {
    color: Colors.accentCyan,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  copyBtnText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  copyBtnTextCopied: {
    color: Colors.success,
  },
  codeBlock: {
    backgroundColor: Colors.bgInput,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  codeText: {
    color: Colors.textCyan,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12.5,
    lineHeight: 18,
  },
  outputBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  outputLabel: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  outputText: {
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
});
