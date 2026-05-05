<script setup lang="ts">
const route = useRoute();
const { siteName } = useAppConfig();

const logoTitle = siteName.split(/[，,]/)[0];
const logoFirst = computed(() => logoTitle[0]);
const logoRest = computed(() => logoTitle.slice(1));
const isHome = computed(() => route.path === "/");
const heroVisible = useHeroVisible();

// 首页 hero 展示时用透明玻璃；hero 消失后或其他页面用暖米白/深色背景
const headerBg = computed(() => {
  if (isHome.value && heroVisible.value) {
    // hero 背景图偏暗，亮色用白色玻璃，暗色用黑色玻璃
    return 'fixed top-0 left-0 right-0 bg-transparent';
  }
  return 'sticky top-0 border-b border-[#e5ddd0] dark:border-gray-800 bg-[#f7f4ef]/95 dark:bg-gray-900/95 backdrop-blur-sm';
});

const isHero = computed(() => isHome.value && heroVisible.value);

function navClass(path: string) {
  const active = route.path === path;
  if (isHero.value) {
    return active
      ? 'text-white font-bold'
      : 'text-white/80 hover:text-white';
  }
  return active
    ? 'text-gray-900 dark:text-white font-bold'
    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-gray-800';
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "Tags", path: "/tags" },
  { name: "About", path: "/about" },
];
</script>

<template>
  <header :class="['z-50 transition-all duration-300', headerBg]">
    <div class="container mx-auto px-6 max-w-6xl h-16 flex items-center">
      <!-- 左：Logo -->
      <NuxtLink
        to="/"
        class="font-bold text-xl tracking-tight transition-colors hover:opacity-80 shrink-0"
        :class="isHero ? 'text-white' : 'text-gray-900 dark:text-white'"
      >
        <span :class="'text-primary-600'">{{ logoFirst }}</span
        >{{ logoRest }}
      </NuxtLink>

      <!-- 中：导航链接 -->
      <nav class="flex-1 flex items-center justify-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-1.5 text-[15px] rounded-lg transition-colors"
          :class="navClass(link.path)"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- 右：图标按钮 -->
      <div class="flex items-center gap-0.5 shrink-0">
        <ThemeToggle :light="isHero" />
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          :class="isHero ? 'text-white hover:bg-white/10' : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-gray-800'"
          aria-label="搜索"
        >
          <Icon name="ph:magnifying-glass" class="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  </header>
</template>
