<script setup lang="ts">
const route = useRoute()
const { siteName, author } = useAppConfig()
const slug = computed(() => (route.params.slug as string[]).join('/'))
const contentPath = computed(() => `/${slug.value}`)

const { data: post } = await useAsyncData(
  `post-${slug.value}`,
  () => queryContent(contentPath.value).findOne(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

useSeoMeta({
  title: () => `${post.value?.title ?? ''} - ${siteName} Blog`,
  description: () => post.value?.description ?? '',
  ogImage: () => post.value?.cover ?? '',
})

// 文章链接（SSR 关闭时 useRequestURL 不可用，客户端用 window.location）
const articleUrl = computed(() => {
  const origin = import.meta.client ? window.location.origin : ''
  return `${origin}/posts${contentPath.value}`
})

// 上一篇 / 下一篇
const { data: allPosts } = await useAsyncData('all-posts-nav', () =>
  queryContent('/').sort({ date: -1 }).find(),
)

const currentIndex = computed(() =>
  allPosts.value?.findIndex((p: any) => p._path === contentPath.value) ?? -1,
)

// 按日期降序排列，上一篇是更新的，下一篇是更旧的
const prevPost = computed(() =>
  currentIndex.value > 0 ? allPosts.value?.[currentIndex.value - 1] : null,
)
const nextPost = computed(() =>
  currentIndex.value < (allPosts.value?.length ?? 0) - 1
    ? allPosts.value?.[currentIndex.value + 1]
    : null,
)

function formatDate(date: string) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 递归统计正文文字数(去除空白)
function countText(node: any): number {
  if (!node) return 0
  if (typeof node === 'string') return node.replace(/\s+/g, '').length
  let sum = 0
  if (typeof node.value === 'string') sum += node.value.replace(/\s+/g, '').length
  if (Array.isArray(node.children)) {
    for (const c of node.children) sum += countText(c)
  }
  return sum
}

const wordCount = computed(() => countText(post.value?.body))
// 阅读时长按 300 字/分钟估算,最少 1 分钟
const readingMinutes = computed(() => Math.max(1, Math.ceil(wordCount.value / 300)))

function formatWordCount(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<template>
  <div v-if="post">
    <!-- 头部:通栏(标题居中带背景 + 元数据) -->
    <header class="mb-6">
      <div class="relative inline-block w-full text-center mb-6">
        <span
          class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 md:h-16
                 bg-gradient-to-r from-amber-100/0 via-amber-100/70 to-amber-100/0
                 dark:from-amber-900/0 dark:via-amber-900/30 dark:to-amber-900/0
                 rounded-full -z-10"
          aria-hidden="true"
        />
        <h1 class="text-3xl md:text-4xl font-bold text-stone-800 dark:text-white leading-snug px-6 py-2">
          {{ post.title }}
        </h1>
      </div>

      <!-- 第一行:左 tags 胶囊,右 category -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex flex-wrap gap-2 min-w-0">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tags/${tag}`"
            class="text-xs px-3 py-1 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            {{ tag }}
          </NuxtLink>
        </div>
        <NuxtLink
          v-if="post.categories?.[0]"
          :to="`/categories/${post.categories[0]}`"
          class="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors shrink-0"
        >
          <Icon name="ph:bookmark-simple-fill" class="w-4 h-4" />
          {{ post.categories[0] }}
        </NuxtLink>
      </div>

      <!-- 第二行:发布日期 / 字数 / 阅读时长 / 阅读次数 -->
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <span v-if="post.date" class="inline-flex items-center gap-1.5">
          <Icon name="ph:calendar" class="w-4 h-4" />
          <span>发布日期:</span>
          <span>{{ formatDate(post.date) }}</span>
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Icon name="ph:article" class="w-4 h-4" />
          <span>文章字数:</span>
          <span>{{ formatWordCount(wordCount) }}</span>
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Icon name="ph:clock" class="w-4 h-4" />
          <span>阅读时长:</span>
          <span>{{ readingMinutes }} 分</span>
        </span>
        <!-- 阅读次数:等访问统计接入后才有数据,缺值时不渲染 -->
        <span v-if="post.views != null" class="inline-flex items-center gap-1.5">
          <Icon name="ph:eye" class="w-4 h-4" />
          <span>阅读次数:</span>
          <span>{{ post.views }}</span>
        </span>
      </div>
    </header>

    <!-- 分割线 -->
    <hr class="border-gray-200 dark:border-gray-800 mb-8" />

    <!-- 正文 + 侧栏 -->
    <div class="lg:flex lg:gap-8 lg:items-stretch">
      <article id="article-content" class="min-w-0 flex-1">
        <ContentRenderer
          :value="post"
          class="prose prose-gray dark:prose-invert max-w-none
                 prose-headings:font-bold prose-headings:tracking-tight
                 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
                 prose-img:rounded-xl
                 prose-blockquote:border-primary-400 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
        />

        <!-- 文章元信息：作者 / 链接 / 版权 -->
        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex gap-2">
            <span class="shrink-0 font-medium text-gray-700 dark:text-gray-300">文章作者：</span>
            <span>{{ author.nickname }}</span>
          </div>
          <div class="flex gap-2">
            <span class="shrink-0 font-medium text-gray-700 dark:text-gray-300">文章链接：</span>
            <a :href="articleUrl" class="text-primary-600 dark:text-primary-400 hover:underline break-all">
              {{ articleUrl }}
            </a>
          </div>
          <div class="flex gap-2">
            <span class="shrink-0 font-medium text-gray-700 dark:text-gray-300">版权声明：</span>
            <span>本文采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener" class="text-primary-600 dark:text-primary-400 hover:underline">CC BY-NC-SA 4.0</a> 许可协议，转载请注明出处。</span>
          </div>
        </div>

        <!-- 上一篇 / 下一篇 -->
        <div v-if="prevPost || nextPost" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-if="prevPost">
              <span class="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">上一篇</span>
              <PostCard :post="prevPost" compact />
            </div>
            <div v-else class="hidden sm:block" />
            <div v-if="nextPost">
              <span class="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">下一篇</span>
              <PostCard :post="nextPost" compact />
            </div>
          </div>
        </div>
      </article>

      <!-- 侧栏 -->
      <aside class="hidden lg:block w-72 shrink-0">
        <div class="sticky top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <AuthorCard />
          <ArticleToc v-if="post.body?.toc?.links?.length" :toc="post.body.toc.links" />
        </div>
      </aside>
    </div>

  <BackToTop />
</div>
</template>
