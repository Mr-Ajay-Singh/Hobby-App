import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
          <MaterialCommunityIcons name="code-tags" size={18} color="#38BDF8" />
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
            color={copied ? '#22C55E' : '#94A3B8'}
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
    backgroundColor: '#0A0E17',
    borderWidth: 1,
    borderColor: '#192233',
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
    borderBottomColor: '#161F2E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBadge: {
    color: '#38BDF8',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#162030',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  copyBtnTextCopied: {
    color: '#22C55E',
  },
  codeBlock: {
    backgroundColor: '#05070B',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#121824',
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12.5,
    lineHeight: 18,
  },
  outputBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#161F2E',
  },
  outputLabel: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  outputText: {
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
});
