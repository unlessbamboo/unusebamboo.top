<script setup lang="ts">
const props = withDefaults(defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
}>(), {
  code: '',
  language: '',
})

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    // 非 HTTPS 环境（局域网 IP）fallback
    const el = document.createElement('textarea')
    el.value = props.code
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__header">
      <span class="code-block__lang">{{ language || 'text' }}</span>
      <button class="code-block__copy" :class="{ copied }" @click.stop="copy">
        <Icon :name="copied ? 'ph:check' : 'ph:copy-simple'" class="w-3.5 h-3.5" />
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <pre class="code-block__pre"><slot /></pre>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e2e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
:global(.dark) .code-block {
  border-color: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 14px;
  background: #ebebeb;
  border-bottom: 1px solid #e0e0e0;
}
:global(.dark) .code-block__header {
  background: #1e1e1e;
  border-bottom: 1px solid #2d2d2d;
}

.code-block__lang {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888;
  font-family: ui-monospace, monospace;
}
:global(.dark) .code-block__lang {
  color: #666;
}

.code-block__copy {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  cursor: pointer;
}
.code-block__copy:hover {
  color: #555;
  border-color: #d0d0d0;
  background: #fff;
}
:global(.dark) .code-block__copy {
  color: #666;
}
:global(.dark) .code-block__copy:hover {
  color: #aaa;
  border-color: #3a3a3a;
  background: #2a2a2a;
}
.code-block__copy.copied {
  color: #16a34a;
  border-color: #bbf7d0;
  background: #f0fdf4;
}
:global(.dark) .code-block__copy.copied {
  color: #4ade80;
  border-color: #166534;
  background: #052e16;
}

.code-block__pre {
  margin: 0 !important;
  border-radius: 0 !important;
  padding: 1.25rem 1.5rem !important;
  overflow-x: auto;
}
</style>
