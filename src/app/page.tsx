"use client"

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function Home() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center z-10 px-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-xl p-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/50 dark:from-transparent dark:via-black/5 dark:to-black/50"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">
              {t.cta.title}
            </h2>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {t.cta.button}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: '📊',
    title: '实时数据分析',
    description: '基于开源技术栈构建的高性能数据分析引擎，提供实时的交通流量分析。',
  },
  {
    icon: '🔍',
    title: '智能监控',
    description: '创新的监控系统设计，确保ETC设备的稳定运行和交易安全。',
  },
  {
    icon: '📱',
    title: '开放平台',
    description: '提供完整的API接口和开发文档，支持二次开发和功能扩展。',
  },
]

const stats = [
  { value: '99.9%', label: '系统可用性' },
  { value: '10000+', label: '服务车道数' },
  { value: '17万+', label: '日均车流量' },
  { value: '4+', label: '技术贡献者' },
]
