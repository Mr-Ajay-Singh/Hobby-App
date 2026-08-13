import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActiveHobbyState {
  activeUserHobbyId: string | undefined;
  enrolledHobbyIds: string[];
  setActiveUserHobbyId: (userHobbyId: string | undefined) => void;
  addEnrolledHobbyId: (userHobbyId: string) => void;
  syncEnrolledHobbyIds: (userHobbyIds: string[]) => void;
}

export const useActiveHobbyStore = create<ActiveHobbyState>()(
  persist(
    (set) => ({
      activeUserHobbyId: undefined,
      enrolledHobbyIds: [],
      setActiveUserHobbyId: (activeUserHobbyId) =>
        set((state) => {
          const nextEnrolled =
            activeUserHobbyId && !state.enrolledHobbyIds.includes(activeUserHobbyId)
              ? [...state.enrolledHobbyIds, activeUserHobbyId]
              : state.enrolledHobbyIds;
          return {
            activeUserHobbyId,
            enrolledHobbyIds: nextEnrolled,
          };
        }),
      addEnrolledHobbyId: (id) =>
        set((state) => ({
          enrolledHobbyIds: state.enrolledHobbyIds.includes(id)
            ? state.enrolledHobbyIds
            : [...state.enrolledHobbyIds, id],
        })),
      syncEnrolledHobbyIds: (fetchedIds) =>
        set((state) => {
          const merged = Array.from(new Set([...state.enrolledHobbyIds, ...fetchedIds]));
          return { enrolledHobbyIds: merged };
        }),
    }),
    {
      name: 'active-hobby-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
