import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SkillChatScreen } from '@/features/skill-learning';

export default function SkillChatRoute() {
  const router = useRouter();
  const { userHobbyId } = useLocalSearchParams<{ userHobbyId?: string }>();

  return <SkillChatScreen onBack={() => router.back()} userHobbyId={userHobbyId} />;
}
