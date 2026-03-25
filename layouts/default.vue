<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-10 max-w-5xl w-full">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
