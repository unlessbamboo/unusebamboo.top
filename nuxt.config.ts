import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  devtools: { enabled: false },

  devServer: {
    host: '0.0.0.0',
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
  ],

  content: {
    // 直接读取 blog/_posts 目录（blog 是指向内容仓库的符号链接）
    sources: {
      content: {
        driver: 'fs',
        base: resolve(__dirname, 'blog/_posts'),
      },
    },
    highlight: {
      theme: {
        default: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      langs: [
        'bash', 'shell', 'sh', 'python', 'javascript', 'typescript',
        'vue', 'html', 'css', 'json', 'yaml', 'sql', 'go',
        'rust', 'java', 'c', 'cpp', 'markdown', 'dockerfile',
        'nginx', 'ini', 'toml', 'xml',
        'powershell', 'lua', 'vim', 'http',
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'blog-color-mode',
  },

  app: {
    head: {
      title: 'Unusebamboo Blog',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '全栈工程师技术博客' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-11-01',
})
