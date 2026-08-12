import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme';

interface MarkdownTextProps {
  content: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <View style={styles.container}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <View key={idx} style={styles.paragraphSpacer} />;
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <Text key={idx} style={styles.h1}>
              {trimmed.substring(2)}
            </Text>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <Text key={idx} style={styles.h2}>
              {trimmed.substring(3)}
            </Text>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <Text key={idx} style={styles.h3}>
              {trimmed.substring(4)}
            </Text>
          );
        }

        // Bullet point (* or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const bulletContent = trimmed.substring(2);
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{parseFormattedText(bulletContent)}</Text>
            </View>
          );
        }

        // Numbered list (1. 2. etc)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numMatch) {
          return (
            <View key={idx} style={styles.numberedRow}>
              <Text style={styles.numberLabel}>{numMatch[1]}.</Text>
              <Text style={styles.numberedText}>{parseFormattedText(numMatch[2])}</Text>
            </View>
          );
        }

        // Blockquote (> ...)
        if (trimmed.startsWith('> ')) {
          return (
            <View key={idx} style={styles.quoteBox}>
              <Text style={styles.quoteText}>{parseFormattedText(trimmed.substring(2))}</Text>
            </View>
          );
        }

        // Standard Body Line
        return (
          <Text key={idx} style={styles.bodyText}>
            {parseFormattedText(trimmed)}
          </Text>
        );
      })}
    </View>
  );
};

function parseFormattedText(text: string): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <Text key={`bold_${match.index}`} style={styles.boldText}>
        {match[1]}
      </Text>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  paragraphSpacer: {
    height: 6,
  },
  h1: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  h2: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  h3: {
    color: Colors.accentCyan,
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 3,
  },
  bodyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 2,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    color: Colors.accentCyan,
    fontSize: 14,
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
    paddingLeft: 4,
  },
  numberLabel: {
    color: Colors.accentCyan,
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
    lineHeight: 20,
  },
  numberedText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
  },
  quoteBox: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentCyan,
    backgroundColor: Colors.bgCardSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginVertical: 4,
  },
  quoteText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
  },
});
