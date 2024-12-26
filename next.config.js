/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置项
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // 允许所有主机访问
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  // 开发服务器配置
  webpack: (config, { dev, isServer }) => {
    // 自定义 webpack 配置
    return config
  },
  // 服务器配置
  serverRuntimeConfig: {
    // 仅在服务器端可用的配置
  },
  publicRuntimeConfig: {
    // 客户端和服务器端都可用的配置
  }
}

module.exports = nextConfig 