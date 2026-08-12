import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/shared/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { QuizItem } from '../schemas/skillChatSchema';
import { useSubmitQuizMutation } from '../api/skillChatQueries';
import { useSkillChatStore } from '../store/useSkillChatStore';

interface QuizCardProps {
  quiz: QuizItem[];
  onSubmitResults?: (summary: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onSubmitResults }) => {
  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) return null;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastXpGain, setLastXpGain] = useState<number | null>(null);
  const [isCapReached, setIsCapReached] = useState(false);

  const submitQuizMutation = useSubmitQuizMutation();
  const userHobbyId = useSkillChatStore((s) => s.userHobbyId);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (selectedAnswers[questionIdx] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));

    const q = quiz[questionIdx];
    submitQuizMutation.mutate(
      {
        userHobbyId,
        quizId: q.id || `quiz_${questionIdx}`,
        questionIndex: questionIdx,
        selectedIndex: optionIdx,
        correctIndex: q.correctIndex,
      },
      {
        onSuccess: (res) => {
          if (res.xpAwarded > 0) {
            setLastXpGain(res.xpAwarded);
          }
          if (res.isCapReached) {
            setIsCapReached(true);
          }
        },
      }
    );
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === quiz.length;

  const correctCount = quiz.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmitResults) {
      const summary = `I finished the quiz! I got ${correctCount} out of ${quiz.length} questions correct.`;
      onSubmitResults(summary);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="help-box-multiple-outline" size={18} color={Colors.accentPurple} />
          <Text style={styles.headerTitle}>Interactive Practice Quiz</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {quiz.length} {quiz.length === 1 ? 'Question' : 'Questions'}
          </Text>
        </View>
      </View>

      {/* Quiz Questions List */}
      {quiz.map((q, qIdx) => {
        const selectedIdx = selectedAnswers[qIdx];
        const isAnswered = selectedIdx !== undefined;
        const isCorrect = isAnswered && selectedIdx === q.correctIndex;

        return (
          <View key={q.id || `q_${qIdx}`} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.qNumBadge}>
                <Text style={styles.qNumText}>{qIdx + 1}</Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsList}>
              {q.options.map((opt, optIdx) => {
                let optStyle: any = styles.optionPending;
                let optTextStyle: any = styles.optionTextPending;
                let iconName: any = 'circle';
                let iconColor: string = Colors.textMuted;

                if (isAnswered) {
                  if (optIdx === q.correctIndex) {
                    optStyle = styles.optionCorrect;
                    optTextStyle = styles.optionTextCorrect;
                    iconName = 'check-circle';
                    iconColor = Colors.success;
                  } else if (optIdx === selectedIdx) {
                    optStyle = styles.optionIncorrect;
                    optTextStyle = styles.optionTextIncorrect;
                    iconName = 'x-circle';
                    iconColor = Colors.danger;
                  } else {
                    optStyle = styles.optionMuted;
                    optTextStyle = styles.optionTextMuted;
                  }
                }

                return (
                  <TouchableOpacity
                    key={optIdx}
                    activeOpacity={0.8}
                    disabled={isAnswered}
                    onPress={() => handleSelectOption(qIdx, optIdx)}
                    style={[styles.optionBtn, optStyle]}
                  >
                    <Feather name={iconName} size={16} color={iconColor} />
                    <Text style={[styles.optionText, optTextStyle]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation Drawer */}
            {isAnswered && (
              <View
                style={[
                  styles.explanationBox,
                  isCorrect ? styles.explanationCorrect : styles.explanationIncorrect,
                ]}
              >
                <View style={styles.explanationHeader}>
                  <Feather
                    name={isCorrect ? 'check' : 'info'}
                    size={14}
                    color={isCorrect ? Colors.success : Colors.warning}
                  />
                  <Text
                    style={[
                      styles.explanationTitle,
                      { color: isCorrect ? Colors.success : Colors.warning },
                    ]}
                  >
                    {isCorrect ? 'Correct! Well done.' : 'Explanation:'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>{q.explanation}</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Interactive Submission Bar */}
      {isAllAnswered && !submitted && onSubmitResults && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          style={styles.submitBtn}
        >
          <MaterialCommunityIcons name="send-check" size={16} color={Colors.textPrimary} />
          <Text style={styles.submitBtnText}>
            Submit Score ({correctCount}/{quiz.length}) to AI Coach
          </Text>
        </TouchableOpacity>
      )}

      {submitted && (
        <View style={styles.submittedBanner}>
          <Feather name="check" size={14} color={Colors.success} />
          <Text style={styles.submittedText}>Results Submitted to Coach!</Text>
        </View>
      )}

      {/* Real-time XP Gain Toast */}
      {lastXpGain !== null && (
        <View style={styles.xpToastBanner}>
          <MaterialCommunityIcons name="star-circle" size={16} color={Colors.warning} />
          <Text style={styles.xpToastText}>+{lastXpGain} XP Earned!</Text>
        </View>
      )}

      {/* Daily Cap Reached Notice */}
      {isCapReached && (
        <View style={styles.capNoticeBanner}>
          <MaterialCommunityIcons name="trophy-outline" size={16} color={Colors.accentCyan} />
          <Text style={styles.capNoticeText}>🌟 Daily Practice Target Reached (20 XP Cap)!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgAppAlt,
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
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: Colors.bgCardAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.accentPurple,
    fontSize: 10.5,
    fontWeight: '700',
  },
  questionCard: {
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  qNumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  qNumText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  questionText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 19,
  },
  optionsList: {
    gap: 6,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionPending: {
    backgroundColor: Colors.bgCardSubtle,
    borderColor: Colors.borderCard,
  },
  optionCorrect: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  optionIncorrect: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.danger,
  },
  optionMuted: {
    backgroundColor: Colors.bgCardSubtle,
    borderColor: Colors.borderSubtle,
    opacity: 0.6,
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  optionTextPending: {
    color: Colors.textPrimary,
  },
  optionTextCorrect: {
    color: Colors.success,
    fontWeight: '700',
  },
  optionTextIncorrect: {
    color: Colors.danger,
    fontWeight: '700',
  },
  optionTextMuted: {
    color: Colors.textMuted,
  },
  explanationBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  explanationCorrect: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  explanationIncorrect: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warning,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  explanationTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  explanationText: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.accentPurple,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  submitBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  submittedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCardAlt,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  submittedText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  xpToastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: Colors.warning,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  xpToastText: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: '800',
  },
  capNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: Colors.accentCyan,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  capNoticeText: {
    color: Colors.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
});
