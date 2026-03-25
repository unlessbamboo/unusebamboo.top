<script setup lang="ts">
const { data: posts } = await useAsyncData('all-categories', () =>
  queryContent('/').where({ _extension: 'md' }).only(['categories']).find(),
)
const { siteName } = useAppConfig()

const categories = computed(() => {
  const counts: Record<string, number> = {}
  posts.value?.forEach((post) => {
    post.categories?.forEach((cat: string) => {
      counts[cat] = (counts[cat] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
})

useSeoMeta({ title: `分类 - ${siteName} Blog` })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      分类
      <span class="text-sm font-normal text-gray-400 dark:text-gray-500 ml-2">
        共 {{ categories.length }} 个
      </span>
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.name"
        :to="`/categories/${cat.name}`"
        class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
               hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm
               transition-all group"
      >
        <div
          class="font-semibold text-gray-800 dark:text-gray-200
                 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1"
        >
          {{ cat.name }}
        </div>
        <div class="text-sm text-gray-400 dark:text-gray-500">
          {{ cat.count }} 篇
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
