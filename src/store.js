// src/store/store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  speed: 0,
  setSpeed: (speed) => set({ speed }),
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
}));
