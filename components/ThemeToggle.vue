<script setup lang="ts">
defineProps<{ light?: boolean }>()
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    :class="[
      'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
      light
        ? 'text-white hover:bg-white/10'
        : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-gray-800',
    ]"
    :aria-label="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <Icon v-if="colorMode.value === 'dark'" name="ph:sun" class="w-4 h-4" />
    <Icon v-else name="ph:moon" class="w-4 h-4" />
  </button>
</template>
