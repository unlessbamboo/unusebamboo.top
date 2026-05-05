<script setup lang="ts">
const { heroBg } = useAppConfig()
defineProps<{ side: 'left' | 'right' }>()

type Weather = 'sunny' | 'rainy' | 'misty' | 'cloudy'

const presets: Record<Weather, { filter: string; overlay: 'none' | 'rain' | 'mist' }> = {
  sunny:  { filter: 'brightness(1.12) saturate(1.15) contrast(1.05) hue-rotate(-5deg)',        overlay: 'none' },
  rainy:  { filter: 'brightness(0.72) saturate(0.55) contrast(0.88) hue-rotate(10deg)',        overlay: 'rain' },
  misty:  { filter: 'brightness(0.88) saturate(0.28) contrast(0.65) blur(3px)',                overlay: 'mist' },
  cloudy: { filter: 'brightness(0.82) saturate(0.38) contrast(0.82)',                          overlay: 'none' },
}

const weatherKeys = Object.keys(presets) as Weather[]
const currentW = ref<Weather>('sunny')
const filterStyle = ref(presets.sunny.filter)
const activeOverlay = ref<'none' | 'rain' | 'mist'>('none')

let timer: ReturnType<typeof setTimeout> | null = null

function pickNext(): Weather {
  let w: Weather
  do { w = weatherKeys[Math.floor(Math.random() * weatherKeys.length)] }
  while (w === currentW.value)
  return w
}

function scheduleNext() {
  timer = setTimeout(() => {
    const next = pickNext()
    filterStyle.value = presets[next].filter

    // 15 秒过渡期间 overlay 不变（不然先换 overlay 再换背景会不匹配）
    setTimeout(() => {
      currentW.value = next
      activeOverlay.value = presets[next].overlay
      scheduleNext()
    }, 15000)
  }, 60000)
}

onMounted(() => { scheduleNext() })
onUnmounted(() => { if (timer) clearTimeout(timer) })

/* ── 雨滴数据 ────────────────────────────────────── */
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
    <!-- 背景图 + filter 缓慢过渡 -->
    <div
      v-if="heroBg"
      class="side-water__bg"
      :style="`background-image: url('${heroBg}')`"
    ></div>

    <!-- 调色层（深色模式 + 轻微 mood 压暗） -->
    <div class="side-water__tint"></div>

    <!-- ── 雨滴 ────────────────────────────────── -->
    <div v-if="activeOverlay === 'rain'" class="rain-layer">
      <div
        v-for="(d, i) in raindrops"
        :key="i"
        class="raindrop"
        :style="{
          left: d.left,
          width: d.w,
          height: d.h,
          opacity: d.o,
          animationDuration: d.dur,
          animationDelay: d.delay,
          transform: `rotate(${d.r})`,
        }"
      />
    </div>

    <!-- ── 雾气 ────────────────────────────────── -->
    <div v-if="activeOverlay === 'mist'" class="mist-layer">
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

/* ── 背景层 + filter 过渡 ──────────────────────────── */
.side-water__bg {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 0;
  opacity: 0.95;
  /* filter 缓慢过渡：15 秒跨 60 秒间隔 */
  transition: filter 15s ease-in-out;
}
.side-water--left  .side-water__bg { left: 0; background-position: left center; }
.side-water--right .side-water__bg { right: 0; background-position: right center; }

:global(.dark) .side-water__bg { opacity: 0.85; }

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
  .side-water__bg { transition: none !important; }
}
</style>
