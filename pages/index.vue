<script setup lang="ts">
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

function goPage(p: number) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSeoMeta({
  title: 'Unusebamboo Blog',
  description: '全栈工程师技术博客，分享 Python、Vue、云原生等技术文章',
})
</script>

<template>
  <div>
    <!-- 文章列表 -->
    <div
      v-if="posts.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
      class="flex justify-center items-center gap-2 mt-12"
    >
      <button
        :disabled="page === 1"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-sm
               text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
               disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page - 1)"
      >
        <Icon name="ph:caret-left" class="w-4 h-4" />
      </button>

      <button
        v-for="p in totalPages"
        :key="p"
        class="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
        :class="
          p === page
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        "
        @click="goPage(p)"
      >
        {{ p }}
      </button>

      <button
        :disabled="page === totalPages"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-sm
               text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
               disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="goPage(page + 1)"
      >
        <Icon name="ph:caret-right" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
