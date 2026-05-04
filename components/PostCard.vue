<script setup lang="ts">
defineProps<{
  post: Record<string, any>
}>()

const router = useRouter()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function goTag(e: MouseEvent, tag: string) {
  e.preventDefault()
  e.stopPropagation()
  router.push(`/tags/${tag}`)
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
    <NuxtLink :to="`/posts${post._path}`" class="flex flex-col flex-1 p-4">
      <!-- 内容区域：flex-1 自适应填充 -->
      <div class="flex-1 min-h-0 overflow-hidden">
        <!-- 封面图：右上浮动，文字环绕 -->
        <img
          v-if="post.cover"
          :src="post.cover"
          :alt="post.title"
          class="float-right ml-3 mb-2 w-20 h-20 rounded-lg object-cover
                 bg-stone-100 dark:bg-gray-800
                 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <!-- 分类 -->
        <span
          v-if="post.categories?.[0]"
          class="block text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-700/65 dark:text-amber-400/65"
        >
          {{ post.categories[0] }}
        </span>

        <!-- 标题 -->
        <h2
          class="font-semibold text-stone-800 dark:text-white leading-snug mt-1
                 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors"
        >
          {{ post.title }}
        </h2>

        <!-- 描述：多余内容截断 -->
        <p
          v-if="post.description"
          class="text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-4 mt-1"
        >
          {{ post.description }}
        </p>
      </div>

      <!-- 标签 + 日期：固定在底部，占用约 1/8 高度 -->
      <div
        class="shrink-0 min-h-[20px] flex items-center justify-between gap-2
               border-t border-[#ede5d8] dark:border-gray-800"
      >
        <div class="flex flex-wrap gap-2 min-w-0">
          <span
            v-for="tag in post.tags?.slice(0, 2)"
            :key="tag"
            class="text-[10px] tracking-wide text-stone-400 dark:text-stone-500
                   cursor-pointer transition-all duration-200
                   hover:scale-110 hover:text-amber-600 dark:hover:text-amber-400"
            @click="goTag($event, tag)"
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
    </NuxtLink>
  </article>
</template>
