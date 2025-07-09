import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.className = newTheme
    return { theme: newTheme }
  })
})) 