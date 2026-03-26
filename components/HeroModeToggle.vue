<script setup lang="ts">
const { heroMode, toggle } = useHeroMode()
</script>

<template>
  <button
    class="w-10 h-10 flex items-center justify-center rounded-lg
           text-gray-600 dark:text-gray-300
           hover:bg-gray-100 dark:hover:bg-gray-800
           transition-colors"
    :aria-label="heroMode === 'intro' ? '切换到轮播模式' : '切换到简介模式'"
    @click="toggle"
  >
    <Icon :name="heroMode === 'intro' ? 'ph:slideshow' : 'ph:layout'" class="w-5 h-5" />
  </button>
</template>
