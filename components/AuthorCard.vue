<script setup lang="ts">
const { avatar, bio } = useAppConfig().author ?? {}
const socials = useAppConfig().socials ?? []
const parts = bio?.split('；') ?? []
const bio1 = parts[0]
const bio2 = parts[1]

const { data: allPosts } = useLazyAsyncData('author-card-stats', () =>
  queryContent('/')
    .where({ _extension: 'md' })
    .only(['categories', 'tags'])
    .find()
)

const total = computed(() => allPosts.value?.length ?? 0)
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
</script>

<template>
  <div class="rounded-xl border border-[#e5ddd0] dark:border-gray-800 bg-[#fdf9f3] dark:bg-gray-900 p-4 space-y-2.5">
    <!-- 第一行：头像 + bio -->
    <div class="flex items-center gap-2">
      <img
        v-if="avatar"
        :src="avatar"
        :alt="bio1"
        class="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200/60 dark:ring-amber-800/40 shrink-0"
      />
      <div class="min-w-0">
        <p
          v-if="bio1"
          class="text-base font-medium bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent truncate leading-snug"
        >{{ bio1 }}</p>
        <p
          v-if="bio2"
          class="text-base font-medium bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent truncate leading-snug"
        >{{ bio2 }}</p>
      </div>
    </div>

    <!-- 第二行：统计 -->
    <div class="flex items-center justify-around text-center border-t border-[#ede5d8] dark:border-gray-800 pt-1.5">
      <div>
        <p class="text-sm font-semibold text-amber-700 dark:text-amber-400">{{ total }}</p>
        <p class="text-[10px] text-stone-500 dark:text-gray-400">文章</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-amber-700 dark:text-amber-400">{{ categoryCount }}</p>
        <p class="text-[10px] text-stone-500 dark:text-gray-400">分类</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-amber-700 dark:text-amber-400">{{ tagCount }}</p>
        <p class="text-[10px] text-stone-500 dark:text-gray-400">标签</p>
      </div>
    </div>

    <!-- 第三行：社交链接 -->
    <div v-if="socials.length" class="flex items-center justify-around border-t border-[#ede5d8] dark:border-gray-800 pt-1.5">
      <a
        v-for="s in socials"
        :key="s.name"
        :href="s.url"
        :title="s.name"
        target="_blank"
        rel="noopener"
        class="w-6 h-6 flex items-center justify-center rounded text-gray-400 dark:text-gray-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
      >
        <Icon :name="s.icon" class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
