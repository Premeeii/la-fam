import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentGroupState {
  groupId: string | null;
  setGroupId: (id: string) => void;
}

export const useCurrentGroup = create<CurrentGroupState>()(
  persist(
    (set) => ({
      groupId: null,
      setGroupId: (id) => set({ groupId: id }),
    }),
    { name: 'current-group' }
  )
);