<template>
  <div class="relative z-0 min-h-screen flex flex-col">
    <!-- 背景光晕层 -->
    <div class="bg-aura" />
    <!-- 两侧流动水波 -->
    <SideWaterFlow />
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-10 max-w-6xl w-full">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style>
.bg-aura {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(ellipse 700px 450px at 15% 75%, rgba(180,160,130,0.18) 0%, transparent 50%),
    radial-gradient(ellipse 550px 400px at 85% 25%, rgba(200,180,150,0.13) 0%, transparent 50%);
  animation: auraDrift 25s ease-in-out infinite alternate;
}

.dark .bg-aura {
  background:
    radial-gradient(ellipse 700px 450px at 15% 75%, rgba(100,140,200,0.15) 0%, transparent 50%),
    radial-gradient(ellipse 550px 400px at 85% 25%, rgba(80,120,180,0.10) 0%, transparent 50%);
}

@keyframes auraDrift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(1.5vw, -0.8vh); }
  50%  { transform: translate(-0.8vw, 1.2vh); }
  75%  { transform: translate(1vw, 0.5vh); }
  100% { transform: translate(-0.5vw, -1vh); }
}
</style>
