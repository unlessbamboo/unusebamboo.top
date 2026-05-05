<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

interface TocContext {
  activeId: Ref<string>
  hoveredId: Ref<string | null>
  scrollTo: (id: string) => void
  isExpanded: (id: string) => boolean
}

const props = defineProps<{
  item: TocItem
  level: number
}>()

const ctx = inject<TocContext>('toc-context')!

const isActive = computed(() => ctx.activeId.value === props.item.id)
const expanded = computed(() => ctx.isExpanded(props.item.id))

const sizeClass = computed(() => {
  if (props.level === 0) return 'text-sm py-1.5'
  if (props.level === 1) return 'text-[13px] py-1'
  return 'text-xs py-1'
})
</script>

<template>
  <div class="toc-group">
    <a
      :href="`#${item.id}`"
      :class="[
        'group relative flex items-center gap-2 pl-3 pr-2 rounded-md transition-all duration-200',
        sizeClass,
        isActive
          ? 'text-amber-700 dark:text-amber-400 font-medium bg-amber-50/80 dark:bg-amber-900/25'
          : 'text-stone-500 dark:text-gray-400 hover:text-stone-800 dark:hover:text-gray-200 hover:bg-stone-100/60 dark:hover:bg-gray-800/40 hover:translate-x-0.5',
      ]"
      @click.prevent="ctx.scrollTo(item.id)"
      @mouseenter="ctx.hoveredId.value = item.id"
      @mouseleave="ctx.hoveredId.value = null"
    >
      <span
        :class="[
          'absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-200',
          isActive ? 'w-1 h-4 bg-amber-600 dark:bg-amber-400' : 'w-0 h-0',
        ]"
      />
      <span class="truncate">{{ item.text }}</span>
    </a>

    <div
      v-if="item.children?.length"
      class="overflow-hidden transition-all duration-300"
      :style="{ maxHeight: expanded ? '2000px' : '0' }"
    >
      <div class="ml-3 pl-3 mt-0.5 space-y-0.5 border-l border-amber-200/50 dark:border-amber-800/30">
        <TocNode
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>
