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
    class="group flex flex-col rounded-xl overflow-hidden
           border border-[#e5ddd0] dark:border-gray-800
           bg-[#fdf9f3] dark:bg-gray-900
           hover:-translate-y-0.5
           hover:shadow-[0_6px_24px_rgba(120,90,50,0.12)] dark:hover:shadow-gray-900/60
           hover:border-[#cbb99e] dark:hover:border-gray-700
           transition-all duration-200"
  >
    <NuxtLink :to="`/posts${post._path}`" class="flex flex-col flex-1">
      <!-- 封面图 -->
      <div class="overflow-hidden h-36 shrink-0 bg-stone-100 dark:bg-gray-800">
        <img
          v-if="post.cover"
          :src="post.cover"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-stone-100 to-amber-50/60 dark:from-gray-800 dark:to-gray-700"
        />
      </div>

      <!-- 内容 -->
      <div class="flex flex-col flex-1 p-4 gap-2">
        <!-- 分类 -->
        <span
          v-if="post.categories?.[0]"
          class="text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-700/65 dark:text-amber-400/65"
        >
          {{ post.categories[0] }}
        </span>

        <!-- 标题 -->
        <h2
          class="font-semibold text-stone-800 dark:text-white line-clamp-2 leading-snug
                 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors"
        >
          {{ post.title }}
        </h2>

        <!-- 描述 -->
        <p
          v-if="post.description"
          class="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed flex-1"
        >
          {{ post.description }}
        </p>

        <!-- 标签 + 日期 -->
        <div
          class="flex items-center justify-between gap-2 pt-2.5 mt-auto
                 border-t border-[#ede5d8] dark:border-gray-800"
        >
          <div class="flex flex-wrap gap-2 min-w-0">
            <span
              v-for="tag in post.tags?.slice(0, 2)"
              :key="tag"
              class="text-[10px] tracking-wide text-stone-400 dark:text-stone-500"
            >
              #{{ tag }}
            </span>
          </div>
          <time
            v-if="post.date"
            class="text-[10px] tracking-wide text-stone-400 dark:text-stone-500 shrink-0"
          >
            {{ formatDate(post.date) }}
          </time>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
