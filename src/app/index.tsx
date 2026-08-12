import React from 'react';
import { useRouter } from 'expo-router';
import { DashboardScreen } from '@/features/dashboard';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <DashboardScreen
      onOpenChat={(userHobbyId) =>
        router.push({
          pathname: '/skill-chat',
          params: userHobbyId ? { userHobbyId } : undefined,
        })
      }
    />
  );
}
