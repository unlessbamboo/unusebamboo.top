<script setup lang="ts">
const heroVisible = useHeroVisible()
heroVisible.value = false

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

const tags = computed(() => (post.value?.tags as string[]) ?? [])

const pageToc = useState<any[]>('page-toc', () => [])
watchEffect(() => { pageToc.value = post.value?.body?.toc?.links ?? [] })

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

      <!-- 元数据行：左侧日期/字数/时长，右侧 category ( tags ) -->
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <!-- 左：发布日期 / 字数 / 阅读时长 / 阅读次数 -->
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span v-if="post.date" class="inline-flex items-center gap-1">
            <Icon name="ph:calendar" class="w-4 h-4" />
            <span>发布日期:</span>
            <span>{{ formatDate(post.date) }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <Icon name="ph:article" class="w-4 h-4" />
            <span>文章字数:</span>
            <span>{{ formatWordCount(wordCount) }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <Icon name="ph:clock" class="w-4 h-4" />
            <span>阅读时长:</span>
            <span>{{ readingMinutes }} 分</span>
          </span>
          <span v-if="post.views != null" class="inline-flex items-center gap-1">
            <Icon name="ph:eye" class="w-4 h-4" />
            <span>阅读次数:</span>
            <span>{{ post.views }}</span>
          </span>
        </div>

        <!-- 右：category ( tag1 · tag2 ) -->
        <div class="flex items-center gap-1 shrink-0 flex-wrap">
          <NuxtLink
            v-if="post.categories?.[0]"
            :to="`/categories/${post.categories[0]}`"
            class="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
          >
            <Icon name="ph:bookmark-simple-fill" class="w-4 h-4" />
          >
            {{ post.categories[0] }}
          </NuxtLink>
          <template v-if="tags.length">
            <span class="text-gray-400 dark:text-gray-600">(</span>
            <template v-for="(tag, i) in tags" :key="tag">
              <NuxtLink
                :to="`/tags/${tag}`"
                class="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >{{ tag }}</NuxtLink>
              <span v-if="i < tags.length - 1" class="text-gray-300 dark:text-gray-600">·</span>
            </template>
            <span class="text-gray-400 dark:text-gray-600">)</span>
          </template>
        </div>
      </div>
    </header>

    <!-- 分割线 -->
    <hr class="border-gray-200 dark:border-gray-800 mb-8" />

    <!-- 正文 -->
    <article id="article-content" class="min-w-0">
      <!-- 作者卡片：float 右侧，文字环绕 -->
      <div class="float-right ml-6 mb-4 w-60 clear-right">
        <AuthorCard />
      </div>

      <ContentRenderer
        :value="post"
        class="prose prose-gray dark:prose-invert max-w-none
               prose-headings:font-bold prose-headings:tracking-tight
               prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
               prose-img:rounded-xl
               prose-blockquote:border-primary-400 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
      />

      <!-- 文章元信息：作者 / 链接 / 版权 -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 space-y-2 text-sm text-gray-500 dark:text-gray-400">
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
        <div class="flex flex-wrap justify-between">
          <div v-if="prevPost" class="w-72">
            <span class="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">上一篇</span>
            <PostCard :post="prevPost" compact />
          </div>
          <div v-if="nextPost" class="w-72">
            <span class="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">下一篇</span>
            <PostCard :post="nextPost" compact />
          </div>
        </div>
      </div>
    </article>

  </div>
</template>
