import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { SkillChatScreen } from '@/features/skill-learning';

export default function SkillChatRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userHobbyId } = useLocalSearchParams<{ userHobbyId?: string }>();

  const handleBack = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return <SkillChatScreen onBack={handleBack} userHobbyId={userHobbyId} />;
}
