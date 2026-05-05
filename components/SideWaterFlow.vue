<template>
  <div class="side-water" aria-hidden="true">
    <!-- 左侧 -->
    <div class="side-water__panel side-water__panel--left">
      <!-- 深色模式 banner 同款渐变底 -->
      <div class="side-water__sky"></div>
      <!-- 星点：用 slice 模式保持圆形不被拉伸 -->
      <svg
        class="side-water__stars"
        viewBox="0 0 100 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- 小星 -->
        <circle class="star star--s d1" cx="18" cy="25" r="0.35" />
        <circle class="star star--s d2" cx="62" cy="48" r="0.4" />
        <circle class="star star--s d3" cx="35" cy="80" r="0.3" />
        <circle class="star star--s d1" cx="80" cy="110" r="0.35" />
        <circle class="star star--s d2" cx="22" cy="145" r="0.4" />
        <circle class="star star--s d3" cx="55" cy="175" r="0.3" />
        <circle class="star star--s d1" cx="88" cy="210" r="0.35" />
        <circle class="star star--s d2" cx="12" cy="245" r="0.3" />
        <circle class="star star--s d3" cx="48" cy="280" r="0.4" />
        <circle class="star star--s d1" cx="72" cy="315" r="0.3" />
        <circle class="star star--s d2" cx="28" cy="350" r="0.35" />
        <circle class="star star--s d3" cx="65" cy="390" r="0.4" />
        <circle class="star star--s d1" cx="15" cy="425" r="0.3" />
        <circle class="star star--s d2" cx="82" cy="460" r="0.35" />
        <circle class="star star--s d3" cx="42" cy="495" r="0.4" />
        <circle class="star star--s d1" cx="58" cy="535" r="0.3" />
        <circle class="star star--s d2" cx="25" cy="570" r="0.35" />
        <!-- 中星 -->
        <circle class="star star--m d2" cx="50" cy="40" r="0.7" />
        <circle class="star star--m d3" cx="78" cy="155" r="0.65" />
        <circle class="star star--m d1" cx="20" cy="265" r="0.7" />
        <circle class="star star--m d2" cx="62" cy="370" r="0.75" />
        <circle class="star star--m d3" cx="32" cy="455" r="0.65" />
        <circle class="star star--m d1" cx="75" cy="540" r="0.7" />
        <!-- 大星（带辉光） -->
        <circle class="star star--l d3" cx="40" cy="120" r="1.1" />
        <circle class="star star--l d1" cx="68" cy="300" r="1.0" />
        <circle class="star star--l d2" cx="28" cy="500" r="1.2" />
      </svg>
      <!-- 水流 -->
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
      <div class="side-water__sky"></div>
      <svg
        class="side-water__stars"
        viewBox="0 0 100 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- 右侧用不同坐标错开，避免左右镜像感 -->
        <circle class="star star--s d2" cx="30" cy="18" r="0.35" />
        <circle class="star star--s d3" cx="72" cy="55" r="0.4" />
        <circle class="star star--s d1" cx="15" cy="92" r="0.3" />
        <circle class="star star--s d2" cx="58" cy="125" r="0.4" />
        <circle class="star star--s d3" cx="85" cy="160" r="0.3" />
        <circle class="star star--s d1" cx="38" cy="195" r="0.35" />
        <circle class="star star--s d2" cx="68" cy="232" r="0.4" />
        <circle class="star star--s d3" cx="22" cy="268" r="0.3" />
        <circle class="star star--s d1" cx="80" cy="305" r="0.35" />
        <circle class="star star--s d2" cx="45" cy="340" r="0.4" />
        <circle class="star star--s d3" cx="18" cy="378" r="0.3" />
        <circle class="star star--s d1" cx="62" cy="412" r="0.35" />
        <circle class="star star--s d2" cx="88" cy="445" r="0.4" />
        <circle class="star star--s d3" cx="32" cy="480" r="0.3" />
        <circle class="star star--s d1" cx="70" cy="518" r="0.35" />
        <circle class="star star--s d2" cx="20" cy="552" r="0.4" />
        <circle class="star star--s d3" cx="52" cy="585" r="0.3" />
        <!-- 中星 -->
        <circle class="star star--m d3" cx="55" cy="75" r="0.7" />
        <circle class="star star--m d1" cx="25" cy="190" r="0.65" />
        <circle class="star star--m d2" cx="78" cy="290" r="0.75" />
        <circle class="star star--m d3" cx="42" cy="395" r="0.7" />
        <circle class="star star--m d1" cx="68" cy="478" r="0.65" />
        <circle class="star star--m d2" cx="22" cy="560" r="0.7" />
        <!-- 大星 -->
        <circle class="star star--l d1" cx="65" cy="135" r="1.1" />
        <circle class="star star--l d2" cx="35" cy="325" r="1.2" />
        <circle class="star star--l d3" cx="72" cy="510" r="1.0" />
      </svg>
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

/* ── 星空底色（banner 同款 #0f2027 → #203a43 → #2c5364） ── */
.side-water__sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* 浅色模式：极淡的冷色，避免与米色 body 冲突 */
  background: linear-gradient(
    180deg,
    rgba(15, 32, 39, 0.04) 0%,
    rgba(32, 58, 67, 0.07) 50%,
    rgba(44, 83, 100, 0.09) 100%
  );
}

:global(.dark) .side-water__sky {
  background: linear-gradient(
    180deg,
    rgba(15, 32, 39, 0.65) 0%,
    rgba(32, 58, 67, 0.55) 50%,
    rgba(44, 83, 100, 0.45) 100%
  );
}

.side-water__stars,
.side-water__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.side-water__stars {
  z-index: 1;
}

.side-water__svg {
  z-index: 2;
}

/* ── 星点 ───────────────────────────────────────────── */
.star {
  /* 浅色模式：偏冷色调的灰蓝，与 banner 配色呼应 */
  fill: rgb(60, 90, 120);
  opacity: 0.55;
}

.star--m {
  fill: rgb(45, 75, 105);
  opacity: 0.7;
}

.star--l {
  fill: rgb(35, 65, 95);
  opacity: 0.8;
  /* 大星辉光 */
  filter: drop-shadow(0 0 1.2px rgba(60, 100, 140, 0.6));
}

/* 暗色模式：亮白偏冷 */
:global(.dark) .star {
  fill: rgb(210, 225, 245);
  opacity: 0.75;
}
:global(.dark) .star--m {
  fill: rgb(225, 235, 250);
  opacity: 0.9;
}
:global(.dark) .star--l {
  fill: rgb(240, 248, 255);
  opacity: 1;
  filter: drop-shadow(0 0 1.5px rgba(180, 210, 240, 0.9));
}

/* 三组错相位的闪烁动画 */
.star.d1 { animation: twinkle 4.2s ease-in-out infinite; }
.star.d2 { animation: twinkle 5.6s ease-in-out infinite -1.4s; }
.star.d3 { animation: twinkle 7.3s ease-in-out infinite -3.0s; }

@keyframes twinkle {
  0%, 100% { opacity: var(--star-op, 0.55); }
  50%      { opacity: 0.2; }
}

/* 通过 CSS var 让动画峰值 = 各档默认透明度 */
.star    { --star-op: 0.55; }
.star--m { --star-op: 0.7; }
.star--l { --star-op: 0.85; }
:global(.dark) .star    { --star-op: 0.75; }
:global(.dark) .star--m { --star-op: 0.9; }
:global(.dark) .star--l { --star-op: 1; }

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

/* 暗色模式：更亮一些以便在深底上突出 */
:global(.dark) .stream-1 {
  stroke: rgba(140, 190, 235, 0.45);
}
:global(.dark) .stream-2 {
  stroke: rgba(120, 175, 220, 0.35);
}
:global(.dark) .stream-3 {
  stroke: rgba(155, 200, 235, 0.28);
}
:global(.dark) .stream-4 {
  stroke: rgba(130, 180, 225, 0.32);
}

@keyframes streamFlow {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -280; }
}

/* 用户偏好减少动效时关闭流动与闪烁 */
@media (prefers-reduced-motion: reduce) {
  .stream,
  .star {
    animation: none;
  }
}
</style>
