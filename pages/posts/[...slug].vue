<script setup lang="ts">
const route = useRoute()
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
  title: () => `${post.value?.title ?? ''} - Unusebamboo Blog`,
  description: () => post.value?.description ?? '',
  ogImage: () => post.value?.cover ?? '',
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const { coverMode, initFromStorage } = useCoverMode()

onMounted(() => {
  initFromStorage()
})
</script>

<template>
  <div v-if="post" class="max-w-3xl mx-auto">
    <!-- 面包屑 -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mb-8">
      <NuxtLink to="/" class="hover:text-primary-500 transition-colors">首页</NuxtLink>
      <Icon name="ph:caret-right" class="w-3 h-3" />
      <NuxtLink
        v-if="post.categories?.[0]"
        :to="`/categories/${post.categories[0]}`"
        class="hover:text-primary-500 transition-colors"
      >
        {{ post.categories[0] }}
      </NuxtLink>
      <Icon v-if="post.categories?.[0]" name="ph:caret-right" class="w-3 h-3" />
      <span class="text-gray-600 dark:text-gray-300 truncate">{{ post.title }}</span>
    </nav>

    <!-- 标题区域 -->
    <header class="mb-6">
      <!-- 方案 A：左文右图两栏 -->
      <div v-if="coverMode === 'hero'" class="flex flex-col md:flex-row md:items-center gap-5">
        <div class="flex-1 min-w-0">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
            {{ post.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <time
              v-if="post.date"
              class="text-gray-400 dark:text-gray-500 flex items-center gap-1"
            >
              <Icon name="ph:calendar" class="w-4 h-4" />
              {{ formatDate(post.date) }}
            </time>
            <NuxtLink
              v-if="post.categories?.[0]"
              :to="`/categories/${post.categories[0]}`"
              class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30
                     px-2 py-0.5 rounded text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
            >
              {{ post.categories[0] }}
            </NuxtLink>
            <div class="flex flex-wrap gap-1">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag"
                :to="`/tags/${tag}`"
                class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800
                       px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-if="post.cover" class="shrink-0 md:w-52 lg:w-60">
          <img
            :src="post.cover"
            :alt="post.title"
            class="w-full rounded-xl"
          />
        </div>
      </div>

      <!-- 方案 B：模糊背景衬底 -->
      <div v-else>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
          {{ post.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-3 text-sm mb-4">
          <time
            v-if="post.date"
            class="text-gray-400 dark:text-gray-500 flex items-center gap-1"
          >
            <Icon name="ph:calendar" class="w-4 h-4" />
            {{ formatDate(post.date) }}
          </time>
          <NuxtLink
            v-if="post.categories?.[0]"
            :to="`/categories/${post.categories[0]}`"
            class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30
                   px-2 py-0.5 rounded text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            {{ post.categories[0] }}
          </NuxtLink>
          <div class="flex flex-wrap gap-1">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/tags/${tag}`"
              class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800
                     px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>
        <div v-if="post.cover" class="relative rounded-xl overflow-hidden">
          <!-- 模糊背景层 -->
          <img
            :src="post.cover"
            :alt="post.title"
            class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
            aria-hidden="true"
          />
          <!-- 居中清晰图 -->
          <div class="relative flex justify-center py-6">
            <img
              :src="post.cover"
              :alt="post.title"
              class="max-w-xs w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

    </header>

    <!-- 分割线 -->
    <hr class="border-gray-200 dark:border-gray-800 mb-8" />

    <!-- 文章内容 -->
    <ContentRenderer
      :value="post"
      class="prose prose-gray dark:prose-invert max-w-none
             prose-headings:font-bold prose-headings:tracking-tight
             prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
             prose-img:rounded-xl
             prose-blockquote:border-primary-400 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
    />

    <!-- 底部返回 -->
    <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
               hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4" />
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>
