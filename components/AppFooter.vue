<script setup lang="ts">
const { siteName, icpText, icpUrl, policeText, policeCode, policeIcon } = useAppConfig()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
    <div
      class="container mx-auto px-4 max-w-5xl py-6 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      <div>
        © {{ new Date().getFullYear() }} {{ siteName }}. Built with
        <a
          href="https://nuxt.com"
          target="_blank"
          rel="noopener"
          class="hover:text-primary-500 transition-colors"
        >Nuxt 3</a>
        +
        <a
          href="https://content.nuxt.com"
          target="_blank"
          rel="noopener"
          class="hover:text-primary-500 transition-colors"
        >Nuxt Content</a>.
      </div>
      <div v-if="icpText || policeText" class="mt-2 flex items-center justify-center gap-4">
        <a
          v-if="icpText"
          :href="icpUrl"
          target="_blank"
          rel="noopener"
          class="hover:text-primary-500 transition-colors"
        >{{ icpText }}</a>
        <a
          v-if="policeText"
          :href="policeCode"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1 hover:text-primary-500 transition-colors"
        >
          <img v-if="policeIcon" :src="policeIcon" alt="公安备案" class="h-4 w-4" />
          {{ policeText }}
        </a>
      </div>
    </div>
  </footer>
</template>
