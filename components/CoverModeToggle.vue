<script setup lang="ts">
const { coverMode, toggle } = useCoverMode()
</script>

<template>
  <button
    class="w-8 h-8 flex items-center justify-center rounded-lg
           text-gray-600 dark:text-gray-300
           hover:bg-gray-100 dark:hover:bg-gray-800
           transition-colors"
    :aria-label="coverMode === 'hero' ? '切换到模糊背景' : '切换到两栏布局'"
    @click="toggle"
  >
    <Icon :name="coverMode === 'hero' ? 'ph:circles-four' : 'ph:layout'" class="w-4 h-4" />
  </button>
</template>
