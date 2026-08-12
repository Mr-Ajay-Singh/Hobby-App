import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LearningResponse, responseTypeSchema } from '../schemas/skillChatSchema';
import { ChatTurnItem } from '../store/useSkillChatStore';
import { MarkdownText } from './MarkdownText';
import { SvgViewer } from './SvgViewer';
import { AudioPlayer } from './AudioPlayer';
import { PracticeTaskCard } from './PracticeTaskCard';
import { QuizCard } from './QuizCard';
import { FlashcardViewer } from './FlashcardViewer';
import { MusicalNotesPlayer } from './MusicalNotesPlayer';
import { ChecklistView } from './ChecklistView';
import { VideoCard } from './VideoCard';
import { CodeSnippetViewer } from './CodeSnippetViewer';

interface SkillMessageBubbleProps {
  item: ChatTurnItem;
  onSendQuizScore?: (summary: string) => void;
}

export const SkillMessageBubble: React.FC<SkillMessageBubbleProps> = ({
  item,
  onSendQuizScore,
}) => {
  // 1. Error Turn
  if (item.role === 'error') {
    return (
      <View style={styles.errorRow}>
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#EF4444" />
            <Text style={styles.errorTitle}>Request Failed</Text>
          </View>
          <Text style={styles.errorText}>{item.content}</Text>
          <Text style={styles.errorTime}>{item.timestamp}</Text>
        </View>
      </View>
    );
  }

  // 2. User Turn
  if (item.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.content}</Text>
          <Text style={styles.userTime}>{item.timestamp}</Text>
        </View>
      </View>
    );
  }

  // 3. Real Assistant Response from Backend
  const rawData: any = item.data;
  const data: LearningResponse | undefined =
    rawData?.data?.learningContent ? rawData.data : rawData;

  if (!data || !data.learningContent) return null;

  const content = data.learningContent;
  const forms = content.formsDelivered || ['text'];

  let typeLabel = 'LESSON CONTENT';
  let typeColor = '#38BDF8';
  let typeIcon: any = 'school-outline';

  switch (data.responseType) {
    case 'clarification':
      typeLabel = 'CLARIFICATION NEEDED';
      typeColor = '#F59E0B';
      typeIcon = 'help-circle-outline';
      break;
    case 'practice_drill':
      typeLabel = 'PRACTICE DRILL';
      typeColor = '#A855F7';
      typeIcon = 'target';
      break;
    case 'assessment':
      typeLabel = 'ASSESSMENT EVALUATION';
      typeColor = '#22C55E';
      typeIcon = 'clipboard-check-outline';
      break;
    case 'off_topic_redirect':
      typeLabel = 'SKILL GUIDANCE';
      typeColor = '#818CF8';
      typeIcon = 'compass-outline';
      break;
    default:
      typeLabel = 'LESSON CONTENT';
      typeColor = '#38BDF8';
      typeIcon = 'school-outline';
  }

  const hasSvg =
    Boolean(content.svg) &&
    typeof content.svg === 'string' &&
    content.svg.trim().length > 0;

  const hasAudio =
    Boolean(content.audio) &&
    Boolean(content.audio?.base64 || content.audio?.audioUrl || content.audio?.script);

  const hasQuiz =
    Boolean(content.quiz) &&
    Array.isArray(content.quiz) &&
    content.quiz.length > 0;

  const flashcardsList =
    content.flashcards && Array.isArray(content.flashcards) && content.flashcards.length > 0
      ? content.flashcards
      : content.flashcard && Array.isArray(content.flashcard) && content.flashcard.length > 0
      ? content.flashcard
      : null;

  const hasFlashcards = Boolean(flashcardsList);

  const hasMusicalNotes =
    Boolean(content.musicalNotes) &&
    Boolean(content.musicalNotes?.notes) &&
    Array.isArray(content.musicalNotes?.notes) &&
    content.musicalNotes.notes.length > 0;

  const hasChecklist =
    Boolean(content.checklist) &&
    Array.isArray(content.checklist) &&
    content.checklist.length > 0;

  const hasVideo =
    Boolean(content.video) &&
    Boolean(content.video?.embedUrl);

  const hasCodeSnippet =
    Boolean(content.codeSnippet) &&
    Boolean(content.codeSnippet?.code);

  const hasPracticeTask =
    Boolean(content.practiceTask) &&
    typeof content.practiceTask === 'string' &&
    content.practiceTask.trim().length > 0;

  return (
    <View style={styles.assistantRow}>
      <View style={styles.avatarWrapper}>
        <MaterialCommunityIcons name="robot-happy" size={17} color={typeColor} />
      </View>

      <View style={styles.assistantCard}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons name={typeIcon} size={14} color={typeColor} />
            <Text style={[styles.typeText, { color: typeColor }]}>{typeLabel}</Text>
          </View>

          <View style={styles.formsRow}>
            {forms.map((f, idx) => (
              <View key={idx} style={styles.formPill}>
                <Text style={styles.formPillText}>{f.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 1. Markdown Text */}
        {content.text ? (
          <View style={styles.textContent}>
            <MarkdownText content={content.text} />
          </View>
        ) : null}

        {/* 2. Vector Graphic SVG */}
        {hasSvg ? (
          <SvgViewer
            svgContent={content.svg!}
            title={`${data.skillInfo?.skillName || 'Skill'} Visual`}
          />
        ) : null}

        {/* 3. Audio Narration Player */}
        {hasAudio ? <AudioPlayer audio={content.audio!} /> : null}

        {/* 4. Interactive Quiz (with Submission) */}
        {hasQuiz ? (
          <QuizCard
            quiz={content.quiz!}
            onSubmitResults={onSendQuizScore}
          />
        ) : null}

        {/* 5. Memorization Flashcards */}
        {hasFlashcards ? <FlashcardViewer flashcards={flashcardsList!} /> : null}

        {/* 6. Musical Note Sequence */}
        {hasMusicalNotes ? <MusicalNotesPlayer data={content.musicalNotes!} /> : null}

        {/* 7. Step-by-Step Checklist */}
        {hasChecklist ? <ChecklistView checklist={content.checklist!} /> : null}

        {/* 8. Video Clip */}
        {hasVideo ? <VideoCard video={content.video!} /> : null}

        {/* 9. Code Snippet */}
        {hasCodeSnippet ? <CodeSnippetViewer codeSnippet={content.codeSnippet!} /> : null}

        {/* 10. Practice Task */}
        {hasPracticeTask ? (
          <PracticeTaskCard task={content.practiceTask!} />
        ) : null}

        <Text style={styles.assistantTime}>{item.timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 6,
    paddingLeft: 40,
  },
  userBubble: {
    backgroundColor: '#2F69FE',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '85%',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '500',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  assistantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    gap: 8,
    paddingRight: 10,
  },
  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F263E',
    borderWidth: 1,
    borderColor: '#1D456E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  assistantCard: {
    flex: 1,
    backgroundColor: '#121622',
    borderWidth: 1,
    borderColor: '#1E2538',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2030',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  formsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  formPill: {
    backgroundColor: '#182030',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#243048',
  },
  formPillText: {
    color: '#8E9BB0',
    fontSize: 9.5,
    fontWeight: '700',
  },
  textContent: {
    marginBottom: 4,
  },
  assistantTime: {
    color: '#64748B',
    fontSize: 10.5,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  errorRow: {
    marginVertical: 6,
  },
  errorCard: {
    backgroundColor: '#1F1215',
    borderWidth: 1,
    borderColor: '#4A1D24',
    borderRadius: 14,
    padding: 12,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  errorTitle: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    lineHeight: 18,
  },
  errorTime: {
    color: '#7F1D1D',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
