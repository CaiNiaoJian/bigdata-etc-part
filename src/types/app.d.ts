declare module '@/context/AppContext' {
  export interface AppContextType {
    language: 'zh' | 'en'
    setLanguage: (language: 'zh' | 'en') => void
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
  }

  export function useApp(): AppContextType
}

declare module '@monaco-editor/react' {
  import { FC } from 'react'

  interface MonacoEditorProps {
    height: string | number
    language: string
    theme?: string
    value?: string
    onChange?: (value: string | undefined) => void
    options?: Record<string, any>
  }

  const MonacoEditor: FC<MonacoEditorProps>
  export default MonacoEditor
} 