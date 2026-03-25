<script setup lang="ts">
definePageMeta({ layout: 'home' })

const { siteName, siteDescription, heroBg } = useAppConfig()
const PAGE_SIZE = 12
const page = ref(1)

const { data: allPosts } = await useAsyncData('all-posts', () =>
  queryContent('/')
    .where({ _extension: 'md' })
    .sort({ date: -1 })
    .only(['_path', 'title', 'description', 'date', 'cover', 'categories', 'tags'])
    .find(),
)

const total = computed(() => allPosts.value?.length ?? 0)
const totalPages = computed(() => Math.ceil(total.value / PAGE_SIZE))
const posts = computed(() =>
  allPosts.value?.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE) ?? [],
)

const categoryCount = computed(() => {
  const set = new Set<string>()
  allPosts.value?.forEach(p => p.categories?.forEach((c: string) => set.add(c)))
  return set.size
})

const tagCount = computed(() => {
  const set = new Set<string>()
  allPosts.value?.forEach(p => p.tags?.forEach((t: string) => set.add(t)))
  return set.size
})

const latestPost = computed(() => allPosts.value?.[0])
const carouselPosts = computed(() => allPosts.value?.slice(0, 5) ?? [])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function goPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 分页：显示首尾页 + 当前页前后2页，中间用 null 表示省略号
const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = page.value
  const pages: (number | null)[] = []
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n) }

  add(1)
  for (let i = Math.max(2, cur - 2); i <= Math.min(total - 1, cur + 2); i++) add(i)
  add(total)

  // 插入省略号
  const result: (number | null)[] = []
  let prev = 0
  for (const p of pages) {
    if (p - prev > 1) result.push(null)
    result.push(p)
    prev = p
  }
  return result
})

const jumpInput = ref('')
function onJump() {
  const p = parseInt(jumpInput.value)
  if (!isNaN(p)) goPage(p)
  jumpInput.value = ''
}

// Hero 模式
const { heroMode, initFromStorage } = useHeroMode()

// 轮播逻辑
const carouselIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startCarousel() {
  stopCarousel()
  timer = setInterval(() => {
    carouselIndex.value = (carouselIndex.value + 1) % carouselPosts.value.length
  }, 4000)
}

function stopCarousel() {
  if (timer) { clearInterval(timer); timer = null }
}

function goSlide(i: number) {
  carouselIndex.value = i
  startCarousel()
}

onMounted(() => {
  initFromStorage()
  if (heroMode.value === 'carousel') startCarousel()
})

watch(heroMode, (val) => {
  stopCarousel()
  if (val === 'carousel') startCarousel()
})

onUnmounted(() => stopCarousel())
</script>

<template>
  <div>
    <!-- 全屏 Banner -->
    <section
      class="hero-section relative w-full overflow-hidden"
      style="height: calc(100vh - 64px)"
    >
      <!-- 背景：有图用图，无图用渐变 -->
      <div
        class="absolute inset-0 transition-opacity duration-700"
        :style="heroBg
          ? `background: url('${heroBg}') center/cover no-repeat`
          : 'background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'"
      />
      <!-- 暗色遮罩，增强文字可读性 -->
      <div class="absolute inset-0 bg-black/45" />

      <!-- 主文字 -->
      <div class="absolute inset-0 flex flex-col items-center justify-center px-6 gap-6">
        <p class="hero-quote">
          Knowledge is simple;<br />practice is difficult.
        </p>
        <span class="hero-sub">— 知易行难</span>
      </div>

      <!-- 向下滚动提示 -->
      <div class="absolute bottom-8 left-1/2 hero-scroll-hint">
        <Icon name="ph:caret-double-down" class="w-6 h-6 text-white/50" />
      </div>
    </section>

    <!-- 内容区域 -->
    <div class="container mx-auto px-4 py-10 max-w-5xl w-full">
    <!-- Hero 区域 -->

    <!-- 模式 A+B：左侧简介 + 右侧最新文章 -->
    <div
      v-if="heroMode === 'intro'"
      class="flex flex-col md:flex-row md:items-center gap-6 mb-10
             pb-8 border-b border-gray-200 dark:border-gray-800"
    >
      <!-- 左：站点简介 -->
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ siteName }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {{ siteDescription }}
        </p>
        <div class="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
          <span class="flex items-center gap-1">
            <Icon name="ph:article" class="w-4 h-4" />
            {{ total }} 篇文章
          </span>
          <NuxtLink
            to="/categories"
            class="flex items-center gap-1 hover:text-primary-500 transition-colors"
          >
            <Icon name="ph:folders" class="w-4 h-4" />
            {{ categoryCount }} 个分类
          </NuxtLink>
          <NuxtLink
            to="/tags"
            class="flex items-center gap-1 hover:text-primary-500 transition-colors"
          >
            <Icon name="ph:tag" class="w-4 h-4" />
            {{ tagCount }} 个标签
          </NuxtLink>
        </div>
      </div>

      <!-- 右：最新文章 -->
      <NuxtLink
        v-if="latestPost"
        :to="`/posts${latestPost._path}`"
        class="group shrink-0 md:w-72 flex gap-3 p-3 rounded-xl
               border border-gray-200 dark:border-gray-800
               hover:border-gray-300 dark:hover:border-gray-700
               hover:shadow-sm transition-all"
      >
        <div class="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            v-if="latestPost.cover"
            :src="latestPost.cover"
            :alt="latestPost.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <p class="text-xs text-primary-600 dark:text-primary-400 mb-1">最新文章</p>
            <h2 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2
                       group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ latestPost.title }}
            </h2>
          </div>
          <time v-if="latestPost.date" class="text-xs text-gray-400 dark:text-gray-500">
            {{ formatDate(latestPost.date) }}
          </time>
        </div>
      </NuxtLink>
    </div>

    <!-- 模式 C：轮播 -->
    <div
      v-else
      class="mb-10 pb-8 border-b border-gray-200 dark:border-gray-800"
      @mouseenter="stopCarousel"
      @mouseleave="startCarousel"
    >
      <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <!-- slides 容器：固定高度，所有 slide 绝对定位 -->
        <div class="relative h-40">
          <template v-for="(slide, i) in carouselPosts" :key="slide._path">
            <div
              class="absolute inset-0 transition-opacity duration-500"
              :class="i === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
            >
              <!-- 模糊背景 -->
              <img
                v-if="slide.cover"
                :src="slide.cover"
                :alt="slide.title"
                class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-25"
                aria-hidden="true"
              />
              <!-- 内容 -->
              <NuxtLink
                :to="`/posts${slide._path}`"
                class="group absolute inset-0 flex gap-5 p-5"
              >
                <div class="shrink-0 w-24 h-24 my-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    v-if="slide.cover"
                    :src="slide.cover"
                    :alt="slide.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-center gap-1.5 overflow-hidden">
                  <span
                    v-if="slide.categories?.[0]"
                    class="text-xs font-medium text-primary-600 dark:text-primary-400
                           bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded w-fit"
                  >
                    {{ slide.categories[0] }}
                  </span>
                  <h2 class="font-semibold text-gray-900 dark:text-white line-clamp-2
                             group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ slide.title }}
                  </h2>
                  <p
                    v-if="slide.description"
                    class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1"
                  >
                    {{ slide.description }}
                  </p>
                  <div class="flex items-center justify-between">
                    <time v-if="slide.date" class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(slide.date) }}
                    </time>
                    <span class="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-0.5">
                      阅读全文 <Icon name="ph:arrow-right" class="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </div>

        <!-- 指示点：固定在 slides 容器外，高度稳定 -->
        <div class="flex justify-center gap-1.5 py-2.5 border-t border-gray-100 dark:border-gray-800">
          <button
            v-for="(_, i) in carouselPosts"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="i === carouselIndex
              ? 'bg-primary-500 w-4'
              : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'"
            @click="goSlide(i)"
          />
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div
      v-if="posts.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <PostCard
        v-for="post in posts"
        :key="post._path"
        :post="post"
      />
    </div>

    <div
      v-else
      class="text-center py-24 text-gray-400 dark:text-gray-500"
    >
      暂无文章
    </div>

    <!-- 分页 -->
    <div
      v-if="totalPages > 1"
      class="flex flex-wrap justify-end items-center gap-2 mt-12"
    >
      <!-- 上一页 -->
      <button
        :disabled="page === 1"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-sm
               text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
               disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page - 1)"
      >
        <Icon name="ph:caret-left" class="w-4 h-4" />
      </button>

      <!-- 页码 + 省略号 -->
      <template v-for="(p, i) in visiblePages" :key="i">
        <span
          v-if="p === null"
          class="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm select-none"
        >
          …
        </span>
        <button
          v-else
          class="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
          :class="p === page
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          @click="goPage(p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- 下一页 -->
      <button
        :disabled="page === totalPages"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-sm
               text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
               disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page + 1)"
      >
        <Icon name="ph:caret-right" class="w-4 h-4" />
      </button>

      <!-- 总页数 + 跳转 -->
      <span class="text-sm text-gray-400 dark:text-gray-500 ml-1">
        共 {{ totalPages }} 页
      </span>
      <div class="flex items-center gap-1 ml-1">
        <span class="text-sm text-gray-400 dark:text-gray-500">跳转</span>
        <input
          v-model="jumpInput"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-14 h-9 text-center text-sm rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
                 focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 transition-colors"
          @keydown.enter="onJump"
        />
        <button
          class="h-9 px-3 rounded-lg text-sm text-gray-500 dark:text-gray-400
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="onJump"
        >
          GO
        </button>
      </div>
    </div>
    </div><!-- /container -->
  </div>
</template>

<style scoped>
/* ── Banner 主文字 ───────────────────────────────────────────── */
.hero-quote {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  letter-spacing: 0.02em;

  /* 金色光晕扫过白字 */
  background: linear-gradient(
    90deg,
    #fff 0%,
    #fff 25%,
    #fcd34d 50%,
    #fff 75%,
    #fff 100%
  );
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  animation:
    heroFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both,
    heroShimmer 5s linear infinite 1.5s;

  /* 柔和文字阴影（text-shadow 对 gradient text 无效，用 filter 代替） */
  filter: drop-shadow(0 0 24px rgba(252, 211, 77, 0.25));
}

/* 副标题 */
.hero-sub {
  color: rgba(255, 255, 255, 0.45);
  font-size: clamp(0.8rem, 2vw, 1rem);
  letter-spacing: 0.25em;
  animation: heroFadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* 向下滚动箭头 */
.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: heroBounce 2.2s ease-in-out infinite 2.5s;
}

/* ── Keyframes ───────────────────────────────────────────────── */
@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(44px);
    filter: blur(6px) drop-shadow(0 0 0px rgba(252, 211, 77, 0));
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: drop-shadow(0 0 24px rgba(252, 211, 77, 0.25));
  }
}

@keyframes heroShimmer {
  0%   { background-position: 100% center; }
  100% { background-position: -200% center; }
}

@keyframes heroBounce {
  0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.4; }
  50%       { transform: translateX(-50%) translateY(10px); opacity: 0.8; }
}
</style>
