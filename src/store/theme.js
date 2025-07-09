import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    return { theme: newTheme }
  }),
  initTheme: () => set(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(savedTheme)
    return { theme: savedTheme }
  })
})) 