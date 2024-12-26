"use client"

import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function Footer() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].footer

  const navigation = {
    main: [
      { name: '首页', href: '/' },
      { name: '监控大厅', href: '/monitor' },
      { name: '数据查询', href: '/query' },
      { name: '统计分析', href: '/analysis' },
      { name: '系统设置', href: '/settings' }
    ],
    support: [
      { name: '帮助中心', href: '#' },
      { name: '使用文档', href: '#' },
      { name: '常见问题', href: '#' },
      { name: '技术支持', href: '#' }
    ],
    company: [
      { name: '关于我们', href: '#' },
      { name: '联系方式', href: '#' },
      { name: '加入我们', href: '#' },
      { name: '合作伙伴', href: '#' }
    ],
    legal: [
      { name: '隐私政策', href: '#' },
      { name: '服务条款', href: '#' },
      { name: '免责声明', href: '#' }
    ],
    social: [
      {
        name: '微信',
        href: '#',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.167 6.088c-3.75.956-6.415 4.294-6.415 7.912 0 2.503 1.294 4.853 3.353 6.47.456.353.515 1.147.118 1.603l-.618.706c-.397.456-.103 1.147.456 1.206 2.868.397 5.206-.956 6.912-2.868.397-.456 1.088-.515 1.603-.397.912.25 1.824.353 2.735.353 4.853 0 8.794-3.456 8.794-7.912s-3.941-7.912-8.794-7.912c-3.088 0-5.823 1.544-7.353 3.897-.397.618-1.147.75-1.765.353l-.618-.353c-.618-.397-1.147-.103-1.147.618v2.25z" />
          </svg>
        ),
      },
      {
        name: '微博',
        href: '#',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M9.82 13.87c-.397.456-.397 1.147.103 1.544.5.397 1.191.397 1.588-.059.397-.456.397-1.147-.103-1.544-.5-.397-1.191-.397-1.588.059zm2.676-3.088c-.853 0-1.544.691-1.544 1.544s.691 1.544 1.544 1.544 1.544-.691 1.544-1.544-.691-1.544-1.544-1.544z" />
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.918 11.729c-.456 2.206-3.088 4.412-7.206 4.412-3.676 0-6.647-1.765-6.647-4.412 0-2.647 2.971-4.412 6.647-4.412.853 0 1.706.103 2.5.309.397.103.75-.191.853-.588.103-.397-.191-.75-.588-.853-.912-.25-1.824-.353-2.765-.353-4.853 0-8.794 2.647-8.794 5.897s3.941 5.897 8.794 5.897c4.853 0 8.794-2.647 8.794-5.897 0-.397-.309-.75-.706-.75s-.75.309-.75.706l-.132.044z" clipRule="evenodd" />
          </svg>
        ),
      },
    ],
  }

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        {/* 主要内容区 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* 公司信息 */}
          <div>
            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">{t.company}</h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t.description}
            </p>
          </div>
          
          {/* 导航链接 */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              {/* 功能导航 */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">功能导航</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 支持服务 */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">支持服务</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 公司信息 */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">关于我们</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 社交媒体和法律信息 */}
        <div className="mt-16 border-t border-gray-900/10 dark:border-gray-100/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 社交媒体图标 */}
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
            
            {/* 法律链接 */}
            <div className="mt-8 md:mt-0">
              <ul className="flex space-x-6">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 版权信息 */}
          <p className="mt-8 text-center text-sm leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t.company}. {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
} 