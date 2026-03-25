<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
    <div
      class="container mx-auto px-4 max-w-5xl py-6 text-center text-sm text-gray-400 dark:text-gray-500"
    >
      © {{ new Date().getFullYear() }} Unusebamboo. Built with
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
  </footer>
</template>
