<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { name: '首页', path: '/' },
  { name: '分类', path: '/categories' },
  { name: '标签', path: '/tags' },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800
           bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm"
  >
    <div class="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="font-bold text-xl text-gray-900 dark:text-white tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        Unusebamboo
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-1.5 rounded-lg text-sm transition-colors"
          :class="
            route.path === link.path
              ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          "
        >
          {{ link.name }}
        </NuxtLink>
        <div class="ml-2 flex items-center gap-1">
          <HeroModeToggle v-if="route.path === '/'" />
          <CoverModeToggle v-else-if="route.path.startsWith('/posts/')" />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  </header>
</template>
