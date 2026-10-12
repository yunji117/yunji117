import { create } from 'zustand';

export type Language = 'ko' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  // 방문할 때마다 한국어를 기본 언어로 보여줍니다.
  language: 'ko',
  setLanguage: (language) => {
    document.documentElement.lang = language;
    set({ language });
  },
}));
