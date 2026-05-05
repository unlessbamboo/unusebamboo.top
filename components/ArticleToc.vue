<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

const props = defineProps<{
  toc: TocItem[]
}>()

const activeId = ref('')
const hoveredId = ref<string | null>(null)

// 构建 id → 祖先 id 列表的映射,用于判断"是否应展开"
function buildAncestorMap(items: TocItem[], parents: string[] = [], result: Record<string, string[]> = {}) {
  for (const item of items) {
    result[item.id] = parents
    if (item.children?.length) buildAncestorMap(item.children, [...parents, item.id], result)
  }
  return result
}
const ancestorMap = computed(() => buildAncestorMap(props.toc))

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 96
  window.scrollTo({ top, behavior: 'smooth' })
}

function isExpanded(id: string): boolean {
  if (hoveredId.value === id) return true
  if (activeId.value === id) return true
  if (activeId.value && ancestorMap.value[activeId.value]?.includes(id)) return true
  if (hoveredId.value && ancestorMap.value[hoveredId.value]?.includes(id)) return true
  return false
}

provide('toc-context', { activeId, hoveredId, scrollTo, isExpanded })

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  const headings = document.querySelectorAll(
    '#article-content h2, #article-content h3, #article-content h4'
  )
  if (!headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
    }
  )

  headings.forEach(h => observer!.observe(h))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    v-if="toc.length"
    class="rounded-xl border border-[#e5ddd0] dark:border-gray-800
           bg-[#fdf9f3]/80 dark:bg-gray-900/60 backdrop-blur-sm
           shadow-[0_2px_12px_-4px_rgba(180,140,80,0.18)] dark:shadow-none
           overflow-hidden"
  >
    <!-- 顶部装饰渐变条 -->
    <div class="h-[3px] bg-gradient-to-r from-amber-300/60 via-amber-500 to-amber-300/60 dark:from-amber-800 dark:via-amber-500 dark:to-amber-800" />
    <div class="p-4">
      <div class="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#ede5d8] dark:border-gray-800">
        <Icon name="ph:list-bullets" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <p class="text-xs font-semibold tracking-[0.18em] text-stone-700 dark:text-gray-300 uppercase">
          目录
        </p>
      </div>
      <nav class="space-y-0.5">
        <TocNode
          v-for="item in toc"
          :key="item.id"
          :item="item"
          :level="0"
        />
      </nav>
    </div>
  </div>
</template>
