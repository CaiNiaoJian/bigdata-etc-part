'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'ohaoz',
    role: '后端工程师',
    github: 'github.com/ohaoz',
    avatar: '/team/ohaoz.jpg',
    responsibilities: '负责优化项目架构、数据转化、后端Kafka高速缓存、flink算法设计，项目docker搭建与集成运行'
  },
  {
    name: 'CaiNiaoJian',
    role: '前端工程师',
    github: 'github.com/CaiNiaoJian',
    avatar: '/team/CaiNiaoJian.jpg',
    responsibilities: '负责总体项目架构设计，Next.js与React架构下的typescript前端设计和开发，前后端接口设计，API调用开发，技术文档编写'
  },
  {
    name: 'Qinhe',
    role: '数据库与网络运维工程师',
    github: 'github.com/qinhe_data',
    avatar: '/team/qinhe.jpg',
    responsibilities: '负责MySQL数据库分片设计和优化，对数据库进行设计'
  },
  {
    name: 'yq',
    role: '数据科学工程师',
    github: 'github.com/yq',
    avatar: '/team/yq.jpg',
    responsibilities: '负责对数据进行预处理，对交通数据进行数据挖掘，Xgboost预测模型开发，参与数据分析报告的设计与深度学习'
  }
]

const borderColors = [
  'from-blue-500 to-purple-500',
  'from-green-500 to-teal-500',
  'from-orange-500 to-pink-500',
  'from-red-500 to-yellow-500'
]

export default function AboutPage() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {language === 'zh' ? '关于我们' : 'About Us'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {language === 'zh' 
              ? '我们是一支充满激情的技术团队，致力于打造智能化的高速公路ETC解决方案'
              : 'We are a passionate tech team dedicated to building intelligent highway ETC solutions'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-1 rounded-2xl bg-gradient-to-r ${borderColors[index]} hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light rounded-full animate-pulse" />
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="rounded-full relative z-10"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-2">
                  {language === 'zh' ? member.role : member.role.replace('工程师', 'Engineer')}
                </p>
                <a
                  href={`https://${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  {member.github}
                </a>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {language === 'zh' 
                    ? member.responsibilities
                    : `Responsible for ${member.responsibilities
                        .replace('负责', '')
                        .replace('，', ', ')}`
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 border-t border-gray-200 dark:border-gray-700 pt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'zh' ? '联系我们' : 'Contact Us'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Email: contact@etc-bigdata.com
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'zh' ? '项目地址' : 'Project Repository'}
              </h4>
              <a
                href="https://github.com/your-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
              >
                GitHub Repository
              </a>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'zh' ? '技术栈' : 'Tech Stack'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'React', 'TypeScript', 'Kafka', 'Flink', 'MySQL', 'Docker', 'Python'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>© 2024 ETC Big Data Platform. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
} 