import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentGroupState {
  groupId: string | null;
  setGroupId: (id: string) => void;
}

export const useCurrentGroup = create<CurrentGroupState>()(
  persist( //set groupid in localstorage as current-group name
    (set) => ({
      groupId: null,
      setGroupId: (id) => set({ groupId: id }),
    }),
    { name: 'current-group' }
  )
);