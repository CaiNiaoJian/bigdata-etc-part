'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

interface SQLEditorProps {
  onExecute: (sql: string) => void
}

export default function SQLEditor({ onExecute }: SQLEditorProps) {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query.sqlEditor
  
  const [sql, setSql] = useState('')

  const handleExecute = () => {
    if (sql.trim()) {
      onExecute(sql)
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] border border-gray-300 rounded-lg overflow-hidden dark:border-gray-600">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="SELECT * FROM vehicles WHERE..."
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleExecute}
          disabled={!sql.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.execute}
        </button>
      </div>
    </div>
  )
} 