<script setup lang="ts">
const route = useRoute();
const { siteName } = useAppConfig();

const logoTitle = siteName.split(/[，,]/)[0];
const logoFirst = computed(() => logoTitle[0]);
const logoRest = computed(() => logoTitle.slice(1));
const isHome = computed(() => route.path === "/");

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "Tags", path: "/tags" },
  { name: "About", path: "/about" },
];
</script>

<template>
  <header
    :class="[
      'z-50 transition-all duration-300',
      isHome
        ? 'fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-sm'
        : 'sticky top-0 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm',
    ]"
  >
    <div class="container mx-auto px-6 max-w-6xl h-16 flex items-center">
      <!-- 左：Logo -->
      <NuxtLink
        to="/"
        class="font-bold text-xl tracking-tight transition-colors text-gray-900 dark:text-white hover:opacity-80 shrink-0"
      >
        <span class="text-primary-600">{{ logoFirst }}</span
        >{{ logoRest }}
      </NuxtLink>

      <!-- 中：导航链接 -->
      <nav class="flex-1 flex items-center justify-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-1.5 text-sm rounded-lg transition-colors"
          :class="
            route.path === link.path
              ? 'text-gray-900 dark:text-white font-bold'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-gray-800'
          "
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- 右：图标按钮 -->
      <div class="flex items-center gap-0.5 shrink-0">
        <CoverModeToggle v-if="route.path.startsWith('/posts/')" />
        <ThemeToggle />
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-gray-800"
          aria-label="搜索"
        >
          <Icon name="ph:magnifying-glass" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>
