<script setup lang="ts">
defineProps<{
  post: Record<string, any>
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <article
    class="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
           overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50
           hover:border-gray-300 dark:hover:border-gray-700
           transition-all duration-200"
  >
    <NuxtLink :to="`/posts${post._path}`" class="flex gap-4 p-4">
      <!-- 封面图 -->
      <div class="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          v-if="post.cover"
          :src="post.cover"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700"
        />
      </div>

      <!-- 内容 -->
      <div class="flex flex-col justify-between min-w-0 flex-1 py-0.5">
        <div>
          <!-- 分类 -->
          <div class="mb-1.5">
            <span
              v-if="post.categories?.[0]"
              class="text-xs font-medium text-primary-600 dark:text-primary-400
                     bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded"
            >
              {{ post.categories[0] }}
            </span>
          </div>

          <!-- 标题 -->
          <h2
            class="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1.5
                   group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          >
            {{ post.title }}
          </h2>

          <!-- 描述 -->
          <p
            v-if="post.description"
            class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
          >
            {{ post.description }}
          </p>
        </div>

        <!-- 标签 + 日期 -->
        <div class="flex items-center justify-between gap-2 mt-2">
          <div class="flex flex-wrap gap-1 min-w-0">
            <span
              v-for="tag in post.tags?.slice(0, 3)"
              :key="tag"
              class="text-xs text-gray-400 dark:text-gray-500
                     bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded"
            >
              #{{ tag }}
            </span>
          </div>
          <time
            v-if="post.date"
            class="text-xs text-gray-400 dark:text-gray-500 shrink-0"
          >
            {{ formatDate(post.date) }}
          </time>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
