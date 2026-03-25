<script setup lang="ts">
const route = useRoute()
const { siteName } = useAppConfig()
const category = route.params.name as string

const { data: posts } = await useAsyncData(`category-${category}`, () =>
  queryContent('/')
    .where({ categories: { $contains: category } })
    .sort({ date: -1 })
    .only(['_path', 'title', 'description', 'date', 'cover', 'categories', 'tags'])
    .find(),
)

useSeoMeta({ title: `${category} - 分类 - ${siteName} Blog` })
</script>

<template>
  <div>
    <!-- 标题 -->
    <div class="flex items-center gap-2 mb-8">
      <NuxtLink
        to="/categories"
        class="text-sm text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors"
      >
        分类
      </NuxtLink>
      <Icon name="ph:caret-right" class="w-3 h-3 text-gray-300 dark:text-gray-600" />
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ category }}
      </h1>
      <span class="text-sm text-gray-400 dark:text-gray-500">
        ({{ posts?.length ?? 0 }} 篇)
      </span>
    </div>

    <div
      v-if="posts?.length"
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
      该分类下暂无文章
    </div>
  </div>
</template>
