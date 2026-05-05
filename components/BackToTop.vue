<script setup lang="ts">
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <button
    class="fixed right-6 bottom-6 z-50 w-10 h-10 flex items-center justify-center rounded-full
           bg-white dark:bg-gray-800 border border-[#e5ddd0] dark:border-gray-700
           text-gray-400 dark:text-gray-500 shadow-md
           hover:text-gray-600 dark:hover:text-gray-300 hover:shadow-lg
           transition-all duration-300"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
    aria-label="返回顶部"
    @click="scrollToTop"
  >
    <Icon name="ph:caret-up" class="w-5 h-5" />
  </button>
</template>
