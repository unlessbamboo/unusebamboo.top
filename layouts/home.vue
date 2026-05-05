<template>
  <div class="page-shell">
    <div class="bg-aura" />

    <aside class="page-aside page-aside--left">
      <SideWaterFlow side="left" />
    </aside>

    <div class="page-center">
      <div class="page-card page-card--header">
        <AppHeader />
      </div>
      <main class="page-card page-card--main">
        <slot />
      </main>
      <div class="page-card page-card--footer">
        <AppFooter />
      </div>
    </div>

    <aside class="page-aside page-aside--right">
      <SideWaterFlow side="right" />
    </aside>
  </div>
</template>
