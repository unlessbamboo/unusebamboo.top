<script setup lang="ts">
defineProps<{ side: 'left' | 'right' }>()

const BASE = 'https://unusebamboo.oss-cn-shanghai.aliyuncs.com/bamboo/bgslide/'

/* ── 构建播放列表 ──────────────────────────────────── */
interface Slide {
  file: string
  overlay: 'none' | 'rain' | 'mist'
}

const seasons: Slide[] = [
  { file: 'bg_spring.png', overlay: 'none' },
  { file: 'bg_summer.png', overlay: 'none' },
  { file: 'bg_autumn.png', overlay: 'none' },
  { file: 'bg_winter.png', overlay: 'none' },
]

const weathers: Slide[] = [
  { file: 'bg_rainy.png', overlay: 'rain' },
  { file: 'bg_foggy.png', overlay: 'mist' },
]

function buildPlaylist(): Slide[] {
  const list: Slide[] = []
  for (const season of seasons) {
    list.push(season)
    // 春夏季节穿插雨雾天气
    if (season.file.includes('spring') || season.file.includes('summer')) {
      const count = Math.random() < 0.6 ? (Math.random() < 0.25 ? 2 : 1) : 0
      const used: string[] = []
      for (let i = 0; i < count; i++) {
        const pool = weathers.filter((w) => !used.includes(w.file))
        if (!pool.length) break
        const pick = pool[Math.floor(Math.random() * pool.length)]
        used.push(pick.file)
        list.push(pick)
      }
    }
  }
  return list
}

const playlist = buildPlaylist()
let playIdx = 0

/* ── 跨帧渐隐渐现（两层叠化） ───────────────────────── */
const frontImg = ref(BASE + playlist[0].file)
const backImg = ref('')
const showFront = ref(true)
const overlay = ref(playlist[0].overlay)

let timer: ReturnType<typeof setTimeout> | null = null

function advance() {
  playIdx = (playIdx + 1) % playlist.length
  const next = playlist[playIdx]

  // 新图写入 back 层（opacity 0 → 等待一帧 → 渐入）
  backImg.value = BASE + next.file

  // setTimeout 50ms 确保 back 层以 opacity 0 渲染到 DOM
  setTimeout(() => {
    // 触发叠化：front 渐出、back 渐入（均由 CSS transition 驱动）
    showFront.value = false

    // 15 秒叠化完成后交换图层
    setTimeout(() => {
      frontImg.value = backImg.value
      backImg.value = ''
      showFront.value = true
      overlay.value = next.overlay
      scheduleNext()
    }, 15000)
  }, 50)
}

function scheduleNext() {
  timer = setTimeout(advance, 60000)
}

onMounted(() => { scheduleNext() })
onUnmounted(() => { if (timer) clearTimeout(timer) })

/* ── 雨滴数据 ──────────────────────────────────────── */
const raindrops = Array.from({ length: 60 }, () => ({
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 4}s`,
  dur: `${0.5 + Math.random() * 1.0}s`,
  w: `${0.8 + Math.random() * 1.8}px`,
  h: `${6 + Math.random() * 16}px`,
  o: 0.2 + Math.random() * 0.4,
  r: `${-2 + Math.random() * 4}deg`,
}))
</script>

<template>
  <div :class="['side-water', `side-water--${side}`]" aria-hidden="true">
    <!-- ── 叠化层 ────────────────────────────────── -->
    <div class="img-stack">
      <div
        class="slide-img"
        :style="{ backgroundImage: `url('${frontImg}')` }"
        :class="{ hide: !showFront }"
      ></div>
      <div
        class="slide-img"
        :style="{ backgroundImage: `url('${backImg}')` }"
        :class="{ hide: showFront }"
      ></div>
    </div>

    <!-- 调色层 -->
    <div class="side-water__tint"></div>

    <!-- ── 雨滴 ────────────────────────────────── -->
    <div v-if="overlay === 'rain'" class="rain-layer">
      <div
        v-for="(d, i) in raindrops"
        :key="i"
        class="raindrop"
        :style="{
          left: d.left, width: d.w, height: d.h, opacity: d.o,
          animationDuration: d.dur, animationDelay: d.delay,
          transform: `rotate(${d.r})`,
        }"
      />
    </div>

    <!-- ── 雾气 ────────────────────────────────── -->
    <div v-if="overlay === 'mist'" class="mist-layer">
      <div class="mist mist--1"></div>
      <div class="mist mist--2"></div>
      <div class="mist mist--3"></div>
    </div>
  </div>
</template>

<style scoped>
.side-water {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

/* ── 图片叠化层 ────────────────────────────────────── */
.img-stack {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.slide-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 1;
  transition: opacity 15s ease-in-out;
}
.slide-img.hide { opacity: 0; }

.side-water--left  .slide-img { background-position: left center; }
.side-water--right .slide-img { background-position: right center; }

/* ── 调色层 ────────────────────────────────────────── */
.side-water__tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.04) 100%);
}
:global(.dark) .side-water__tint {
  background: linear-gradient(180deg, rgba(15,32,39,0.20) 0%, rgba(20,40,50,0.15) 100%);
}

/* ── 雨滴 ──────────────────────────────────────────── */
.rain-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}
.raindrop {
  position: absolute;
  top: -20px;
  border-radius: 1px 1px 50% 50%;
  background: linear-gradient(to bottom, rgba(175,200,235,0.65) 0%, transparent 100%);
  animation: raindropFall linear infinite;
}
:global(.dark) .raindrop {
  background: linear-gradient(to bottom, rgba(190,215,245,0.75) 0%, transparent 100%);
}
@keyframes raindropFall {
  0%   { transform: translateY(-20px); opacity: 0; }
  8%   { opacity: 1; }
  85%  { opacity: 0.8; }
  100% { transform: translateY(calc(100vh + 20px)); opacity: 0; }
}

/* ── 雾气 ──────────────────────────────────────────── */
.mist-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.mist {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  will-change: transform, opacity;
}
.mist--1 {
  width: 130%; height: 55%; top: 5%; left: -15%;
  background: radial-gradient(ellipse at 50% 50%, rgba(200,200,215,0.13) 0%, transparent 55%);
  animation: mistDrift 22s ease-in-out infinite alternate;
}
.mist--2 {
  width: 110%; height: 45%; bottom: 10%; right: -10%;
  background: radial-gradient(ellipse at 50% 50%, rgba(190,195,215,0.10) 0%, transparent 55%);
  animation: mistDrift 28s ease-in-out infinite alternate-reverse;
}
.mist--3 {
  width: 140%; height: 35%; top: 55%; left: -20%;
  background: radial-gradient(ellipse at 50% 50%, rgba(205,200,215,0.08) 0%, transparent 50%);
  animation: mistDrift 35s ease-in-out infinite alternate;
}
:global(.dark) .mist--1 { background: radial-gradient(ellipse at 50% 50%, rgba(150,175,210,0.16) 0%, transparent 55%); }
:global(.dark) .mist--2 { background: radial-gradient(ellipse at 50% 50%, rgba(140,165,200,0.12) 0%, transparent 55%); }
:global(.dark) .mist--3 { background: radial-gradient(ellipse at 50% 50%, rgba(150,175,205,0.10) 0%, transparent 50%); }

@keyframes mistDrift {
  0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
  50%  { transform: translate(4%, -2%) scale(1.1); opacity: 0.85; }
  100% { transform: translate(-3%, 2%) scale(0.92); opacity: 0.6; }
}

@media (prefers-reduced-motion: reduce) {
  .raindrop, .mist { animation: none !important; }
  .slide-img { transition: none !important; }
}
</style>
