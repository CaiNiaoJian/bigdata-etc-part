"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import LanguageSwitch from './LanguageSwitch'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language } = useApp()

  useEffect(() => {
    setMounted(true)
  }, [])

  const t = translations[language as keyof typeof translations].nav

  const navigation = [
    { name: t.intro, href: '/' },
    { name: t.monitor, href: '/monitor' },
    { name: t.query, href: '/query' },
    { name: t.reports, href: '/reports' },
    { name: t.about, href: '/about' },
  ]

  return (
    <nav className="fixed w-full backdrop-blur-md bg-white/75 dark:bg-gray-900/75 z-50 transition-all duration-300 border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold gradient-text">
              ETC
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <LanguageSwitch />
            
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-amber-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-100" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 