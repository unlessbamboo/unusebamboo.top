<script setup lang="ts">
const { siteName, icpText, icpUrl, policeText, policeCode, policeIcon } = useAppConfig()

const logoTitle = siteName.split(/[，,]/)[0]

const metrics = [
  { value: '120k', label: '字数' },
  { value: '45k',  label: '浏览' },
  { value: '12k',  label: '访客' },
  { value: '99.9%', label: '可用率' },
]

const archiveLinks = [
  { name: '文章索引', path: '/' },
  { name: '分类',     path: '/categories' },
  { name: '标签',     path: '/tags' },
  { name: 'RSS',      path: '/feed.xml' },
]
</script>

<template>
  <footer class="border-t border-stone-200 dark:border-gray-800 mt-16 bg-[#f0ede8] dark:bg-gray-900">
    <div class="container mx-auto px-6 max-w-6xl py-5">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        <!-- 左：站点信息 -->
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            {{ logoTitle }}
          </span>
          <p class="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            © {{ new Date().getFullYear() }} {{ logoTitle }} (UselessBamboo). 保留所有权利。
          </p>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5">
            <span class="text-xs italic text-gray-400 dark:text-gray-500">基于 Nuxt Content 构建</span>
            <a
              v-if="icpText"
              :href="icpUrl"
              target="_blank"
              rel="noopener"
              class="text-xs text-gray-400 hover:text-primary-500 transition-colors"
            >{{ icpText }}</a>
            <a
              v-if="policeText"
              :href="policeCode"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-500 transition-colors"
            >
              <img v-if="policeIcon" :src="policeIcon" alt="公安备案" class="h-3 w-3" />
              {{ policeText }}
            </a>
          </div>
        </div>

        <!-- 中：站点统计 -->
        <div>
          <p class="text-[10px] font-semibold tracking-[0.18em] text-gray-400 dark:text-gray-500 uppercase mb-2">
            站点统计
          </p>
          <div class="flex flex-wrap gap-x-5 gap-y-1">
            <div v-for="m in metrics" :key="m.label" class="flex items-baseline gap-1">
              <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ m.value }}</span>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 tracking-wide">{{ m.label }}</span>
            </div>
          </div>
        </div>

        <!-- 右：快速导航 -->
        <div class="text-right">
          <p class="text-[10px] font-semibold tracking-[0.18em] text-gray-400 dark:text-gray-500 uppercase mb-2">
            快速导航
          </p>
          <nav class="flex flex-wrap gap-x-3 gap-y-1 justify-end">
            <NuxtLink
              v-for="link in archiveLinks"
              :key="link.path"
              :to="link.path"
              class="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-300
                     hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {{ link.name }}
            </NuxtLink>
          </nav>
        </div>

      </div>
    </div>
  </footer>
</template>
