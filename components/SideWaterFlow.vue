<template>
  <div class="side-water" aria-hidden="true">
    <!-- 左侧 -->
    <div class="side-water__panel side-water__panel--left">
      <svg
        class="side-water__svg"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
      >
        <path class="stream stream-1" d="M50 -20 C 30 100, 70 220, 50 340 S 30 580, 50 820" />
        <path class="stream stream-2" d="M30 -20 C 60 120, 10 260, 40 400 S 70 640, 30 820" />
        <path class="stream stream-3" d="M70 -20 C 40 140, 90 280, 60 420 S 20 660, 70 820" />
        <path class="stream stream-4" d="M20 -20 C 80 100, 20 240, 80 380 S 20 620, 60 820" />
      </svg>
    </div>

    <!-- 右侧 -->
    <div class="side-water__panel side-water__panel--right">
      <svg
        class="side-water__svg"
        viewBox="0 0 100 800"
        preserveAspectRatio="none"
      >
        <path class="stream stream-1" d="M50 -20 C 70 100, 30 220, 50 340 S 70 580, 50 820" />
        <path class="stream stream-2" d="M70 -20 C 40 120, 90 260, 60 400 S 30 640, 70 820" />
        <path class="stream stream-3" d="M30 -20 C 60 140, 10 280, 40 420 S 80 660, 30 820" />
        <path class="stream stream-4" d="M80 -20 C 20 100, 80 240, 20 380 S 80 620, 40 820" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.side-water {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  /* 内容容器 max-w-5xl = 64rem，xl 断点以下隐藏 */
  display: none;
}

@media (min-width: 1280px) {
  .side-water {
    display: block;
  }
}

.side-water__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  /* 内容区两侧的空白宽度，留 1rem 安全间距 */
  width: calc((100vw - 64rem) / 2 - 1rem);
  overflow: hidden;
  /* 顶/底渐变淡出，避免硬边 */
  mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
}

.side-water__panel--left {
  left: 0;
}
.side-water__panel--right {
  right: 0;
}

.side-water__svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── 水流线条 ───────────────────────────────────────────── */
.stream {
  fill: none;
  stroke: rgba(80, 130, 180, 0.28);
  stroke-linecap: round;
  /* 长虚线 + 大间隔，配合 dashoffset 动画 = 水流向下流动 */
  stroke-dasharray: 60 220;
  animation: streamFlow linear infinite;
}

/* 每条线粗细、速度、透明度、相位错开 */
.stream-1 {
  stroke-width: 1.2;
  stroke: rgba(96, 145, 195, 0.32);
  animation-duration: 5.5s;
  animation-delay: 0s;
}
.stream-2 {
  stroke-width: 0.8;
  stroke: rgba(110, 165, 210, 0.22);
  animation-duration: 7.5s;
  animation-delay: -1.8s;
  stroke-dasharray: 40 260;
}
.stream-3 {
  stroke-width: 0.6;
  stroke: rgba(130, 180, 220, 0.18);
  animation-duration: 9s;
  animation-delay: -3.4s;
  stroke-dasharray: 30 300;
}
.stream-4 {
  stroke-width: 1;
  stroke: rgba(85, 140, 190, 0.20);
  animation-duration: 6.2s;
  animation-delay: -4.2s;
  stroke-dasharray: 80 200;
}

/* 暗色模式：更冷的蓝、更低饱和 */
:global(.dark) .stream-1 {
  stroke: rgba(120, 170, 220, 0.30);
}
:global(.dark) .stream-2 {
  stroke: rgba(100, 150, 200, 0.22);
}
:global(.dark) .stream-3 {
  stroke: rgba(140, 185, 225, 0.18);
}
:global(.dark) .stream-4 {
  stroke: rgba(110, 160, 210, 0.20);
}

@keyframes streamFlow {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -280; }
}

/* 用户偏好减少动效时关闭流动 */
@media (prefers-reduced-motion: reduce) {
  .stream {
    animation: none;
  }
}
</style>
