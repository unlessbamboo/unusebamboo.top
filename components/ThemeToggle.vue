<script setup lang="ts">
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="w-8 h-8 flex items-center justify-center rounded-lg
           text-gray-600 dark:text-gray-300
           hover:bg-gray-100 dark:hover:bg-gray-800
           transition-colors"
    :aria-label="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <Icon
      v-if="colorMode.value === 'dark'"
      name="ph:sun"
      class="w-4 h-4"
    />
    <Icon
      v-else
      name="ph:moon"
      class="w-4 h-4"
    />
  </button>
</template>
