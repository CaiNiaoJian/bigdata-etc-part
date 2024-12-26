'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

type AppContextType = {
  language: string
  setLanguage: (lang: string) => void
  toggleLanguage: () => void
  theme?: string
  setTheme: (theme: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('zh')
  const { theme, setTheme } = useTheme()

  // 在组件挂载时从localStorage读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 切换语言并保存到localStorage
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, toggleLanguage, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 