<template>
  <div class="page-shell">
    <!-- 全局光晕 -->
    <div class="bg-aura" />

    <!-- 左侧 aside -->
    <aside class="page-aside page-aside--left">
      <SideWaterFlow side="left" />
    </aside>

    <!-- 中间栏：header / 内容 / footer 三张 figma 风格卡片 -->
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

    <!-- 右侧 aside -->
    <aside class="page-aside page-aside--right">
      <SideWaterFlow side="right" />
    </aside>

  </div>

  <FloatingToolbar />
</template>
