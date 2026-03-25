import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsDir = resolve(__dirname, '../blog/_posts')

// 提取所有已有 cover
const allCovers = execSync(`grep -rh "^cover:" ${postsDir} --include="*.md"`, { encoding: 'utf-8' })
  .split('\n')
  .filter(Boolean)
  .map(line => line.replace(/^cover:\s*/, '').trim())

const covers = [...new Set(allCovers)]
console.log(`可用封面图：${covers.length} 张`)

// 找出没有 cover 的文章
const noCoverFiles = execSync(`grep -rL "^cover:" ${postsDir} --include="*.md"`, { encoding: 'utf-8' })
  .split('\n')
  .filter(Boolean)

console.log(`无封面文章：${noCoverFiles.length} 篇`)

// 读取每篇文章的日期，按日期排序
const posts = noCoverFiles.map(filePath => {
  const content = readFileSync(filePath, 'utf-8')
  const dateMatch = content.match(/^date:\s*(.+)$/m)
  const date = dateMatch ? new Date(dateMatch[1].trim()) : new Date(0)
  return { filePath, content, date }
})

posts.sort((a, b) => a.date - b.date)

// 随机打乱 covers 作为初始池
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 为每篇文章分配封面，确保相邻不重复
function pickCover(pool, lastCover) {
  // 从池中找第一个不等于 lastCover 的
  const idx = pool.findIndex(c => c !== lastCover)
  if (idx === -1) {
    // 极端情况：只剩一种封面，直接用
    return pool[0]
  }
  return pool.splice(idx, 1)[0]
}

let pool = shuffle(covers)
let lastCover = null

for (const post of posts) {
  // 池快空时补充
  if (pool.length < 5) {
    pool = [...pool, ...shuffle(covers)]
  }

  const cover = pickCover(pool, lastCover)
  lastCover = cover

  // 在 frontmatter 第一个 --- 后插入 cover 行
  const updated = post.content.replace(
    /^(---\n)([\s\S]*?)(---)/m,
    (_, open, body, close) => {
      // 避免重复添加
      if (body.includes('cover:')) return _
      return `${open}${body}cover: ${cover}\n${close}`
    }
  )

  if (updated !== post.content) {
    writeFileSync(post.filePath, updated, 'utf-8')
    console.log(`✓ ${post.filePath.split('/').slice(-2).join('/')}  →  ${cover.split('/').pop()}`)
  }
}

console.log('\n完成！')
