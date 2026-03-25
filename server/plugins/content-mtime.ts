import { statSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore — Nuxt Content v2 hook
  nitroApp.hooks.hook('content:file:afterParse', (file: Record<string, any>) => {
    if (file._extension !== 'md') return
    try {
      const filePath = resolve(process.cwd(), 'blog/_posts', file._file)
      const { mtime } = statSync(filePath)
      file._mtime = mtime.toISOString()
    }
    catch {}
  })
})
