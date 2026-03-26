<script setup lang="ts">
const { siteName, icpText, icpUrl, policeText, policeCode, policeIcon } = useAppConfig()

const logoTitle = siteName.split(/[，,]/)[0]

const metrics = [
  { value: '120k', label: 'WORD COUNT' },
  { value: '45k',  label: 'TOTAL VIEWS' },
  { value: '12k',  label: 'VISITORS' },
  { value: '99.9%', label: 'UPTIME' },
]

const archiveLinks = [
  { name: 'ARCHIVE INDEX', path: '/' },
  { name: 'LIBRARY',       path: '/categories' },
  { name: 'TAGS',          path: '/tags' },
  { name: 'RSS FEED',      path: '/feed.xml' },
]
</script>

<template>
  <footer class="border-t border-stone-200 dark:border-gray-800 mt-16" style="background-color: #f0ede8;">
    <div class="container mx-auto px-6 max-w-6xl py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

        <!-- 左：站点信息 -->
        <div class="flex flex-col gap-3">
          <span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ logoTitle }}
          </span>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            © {{ new Date().getFullYear() }} {{ logoTitle }} (UselessBamboo).<br />
            All rights reserved.
          </p>
          <p class="text-sm italic text-gray-400 dark:text-gray-500">
            Built with Nuxt Content
          </p>
          <div v-if="icpText || policeText" class="flex flex-col gap-1 mt-1">
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
              <img v-if="policeIcon" :src="policeIcon" alt="公安备案" class="h-3.5 w-3.5" />
              {{ policeText }}
            </a>
          </div>
        </div>

        <!-- 中：统计指标 -->
        <div>
          <p class="text-xs font-semibold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">
            Archival Metrics
          </p>
          <div class="bg-stone-200/60 dark:bg-gray-800 rounded-xl p-5 grid grid-cols-2 gap-y-5 gap-x-4">
            <div v-for="m in metrics" :key="m.label">
              <p class="text-2xl font-bold text-gray-900 dark:text-white leading-none">{{ m.value }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 tracking-wider mt-1">{{ m.label }}</p>
            </div>
          </div>
        </div>

        <!-- 右：导航链接 -->
        <div class="text-right">
          <p class="text-xs font-semibold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">
            The Archive
          </p>
          <nav class="flex flex-col gap-2.5">
            <NuxtLink
              v-for="link in archiveLinks"
              :key="link.path"
              :to="link.path"
              class="text-sm font-medium tracking-[0.12em] text-gray-600 dark:text-gray-300
                     hover:text-gray-900 dark:hover:text-white transition-colors uppercase"
            >
              {{ link.name }}
            </NuxtLink>
          </nav>
        </div>

      </div>
    </div>
  </footer>
</template>
