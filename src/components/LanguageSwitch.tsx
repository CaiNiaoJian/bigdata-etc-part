'use client'

import { motion } from 'framer-motion'
import { LanguageIcon } from '@heroicons/react/24/outline'
import { useApp } from '@/context/AppContext'

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useApp()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex items-center"
      aria-label="Switch language"
    >
      <LanguageIcon className="h-5 w-5 text-gray-700 dark:text-gray-100" />
      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-100">
        {language.toUpperCase()}
      </span>
    </motion.button>
  )
} 