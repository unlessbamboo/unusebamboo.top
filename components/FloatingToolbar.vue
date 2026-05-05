<script setup lang="ts">
/* ── 全局 TOC（由页面设置） ──────────────────────── */
const pageToc = useState<any[]>('page-toc', () => [])

/* ── Hero 全屏时不显示 ──────────────────────────── */
const heroVisible = useHeroVisible()
const hidden = computed(() => heroVisible.value)

/* ── 拖拽（拖拽后覆盖 CSS 默认定位） ─────────────── */
const isDragging = ref(false)
const hasDragged = ref(false)
const dragTop = ref(0)
const dragRight = ref(0)
let dragStart = { x: 0, y: 0, top: 0, right: 0 }

const dragStyle = computed(() => {
  if (!hasDragged.value) return null
  return { top: dragTop.value + 'px', right: dragRight.value + 'px' }
})

function startDrag(e: MouseEvent) {
  isDragging.value = true
  hasDragged.value = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragTop.value = rect.top
  dragRight.value = window.innerWidth - rect.right
  dragStart = { x: e.clientX, y: e.clientY, top: rect.top, right: window.innerWidth - rect.right }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  dragTop.value = Math.max(8, dragStart.top + dy)
  dragRight.value = Math.max(8, dragStart.right - dx)
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function scrollTo(target: 'top' | 'bottom') {
  window.scrollTo({ top: target === 'top' ? 0 : document.body.scrollHeight, behavior: 'smooth' })
}

/* ── 目录浮窗 ──────────────────────────────────── */
const showToc = ref(false)
</script>

<template>
  <div
    v-show="!hidden"
    class="toolbar-float"
    :class="{ dragging: isDragging }"
    :style="dragStyle"
    @mousedown.prevent="startDrag"
  >
    <button class="toolbar-btn" aria-label="回到顶部" @click="scrollTo('top')">
      <Icon name="ph:caret-up" class="w-4 h-4" />
    </button>
    <NuxtLink to="/" class="toolbar-btn" aria-label="回到首页">
      <Icon name="ph:house" class="w-4 h-4" />
    </NuxtLink>
    <div
      v-if="pageToc.length"
      class="toolbar-btn toolbar-btn--toc"
      @mouseenter="showToc = true"
      @mouseleave="showToc = false"
    >
      <Icon name="ph:list-bullets" class="w-4 h-4" />
      <Transition name="toc-slide">
        <div v-show="showToc" class="toolbar-toc__panel">
          <ArticleToc :toc="pageToc" />
        </div>
      </Transition>
    </div>
    <button class="toolbar-btn" aria-label="搜索">
      <Icon name="ph:magnifying-glass" class="w-4 h-4" />
    </button>
    <button class="toolbar-btn" aria-label="回到底部" @click="scrollTo('bottom')">
      <Icon name="ph:caret-down" class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
.toolbar-float {
  position: fixed;
  z-index: 50;
  /* 默认定位：在右侧栏中间（grid: 1fr minmax(0,1280px) 1fr gap:1rem） */
  /* 右侧栏中线距右侧: (100vw - 1280px - 2rem) / 4，小于 1312px 时 clamp */
  right: calc(max(0.75rem, (100vw - 1280px - 2rem) / 4));
  top: 55vh;
  transform: translateX(50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  background: #fdf9f3;
  border: 1px solid #e5ddd0;
  border-radius: 999px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.10);
  cursor: grab;
  user-select: none;
}
:global(.dark) .toolbar-float {
  background: #1e1e2e;
  border-color: #2a2a3e;
}
.toolbar-float.dragging {
  cursor: grabbing;
}

.toolbar-btn {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #92400e;
  transition: background 0.15s, color 0.15s;
}
:global(.dark) .toolbar-btn {
  color: #fbbf24;
}
.toolbar-btn:hover {
  background: rgba(217,119,6,0.12);
  color: #78350f;
}
:global(.dark) .toolbar-btn:hover {
  background: rgba(251,191,36,0.12);
  color: #fde68a;
}

.toolbar-btn--toc {
  position: relative;
}

.toolbar-toc__panel {
  position: absolute;
  left: auto;
  right: calc(100% + 0.5rem);
  top: 50%;
  transform: translateY(-50%);
  width: 16rem;
  max-height: 70vh;
  overflow-y: auto;
}

.toc-slide-enter-active,
.toc-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toc-slide-enter-from,
.toc-slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(0.5rem);
}
</style>
