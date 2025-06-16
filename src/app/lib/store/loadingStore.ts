import { create } from 'zustand'

interface LoadingState {
   activeLoaders: number
   startLoading: (id?: string) => void
   finishLoading: (id?: string) => void
}


export const useLoadingStore = create<LoadingState>((set) => ({
   activeLoaders: 1,

   startLoading: (id = 'unidentified') => {
      console.log(`%c -> startLoading called from: [${id}]`, 'color: lightblue')
      set((state) => ({ activeLoaders: state.activeLoaders + 1 }))
   },

   finishLoading: (id = 'unidentified') => {
      console.log(`%c <- finishLoading called from: [${id}]`, 'color: lightgreen')
      set((state) => ({ activeLoaders: Math.max(0, state.activeLoaders - 1) }))
   }
}))

useLoadingStore.subscribe((state) => {
  console.log('%c Loader count:', 'color: yellow', state.activeLoaders);
});



import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}