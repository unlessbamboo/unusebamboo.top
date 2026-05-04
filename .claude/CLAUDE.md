# CLAUDE.md

## 项目概览

个人技术博客，基于 Nuxt 3 + Nuxt Content v2 构建,从而构建一个比较酷炫的,个人博客网站,其最终呈现的是一个包含 home, categories, about, project4 个页面的网站.
博客内容内容通过符号链接 `./blog` 引入，路径指向本地的某个目录。

---

## 技术栈

| 层级     | 技术                                   |
| -------- | -------------------------------------- |
| 框架     | Nuxt 3（SSR 模式）                     |
| 内容     | @nuxt/content v2（读取 markdown）      |
| 样式     | Tailwind CSS + @tailwindcss/typography |
| 暗黑模式 | @nuxtjs/color-mode（class 策略）       |
| 图标     | @nuxt/icon（Phosphor Icons）           |
| 代码高亮 | Shiki（内置于 @nuxt/content）          |

---

## 目录结构

```
blog-nuxt/
├── blog/                    # 符号链接
│   └── _posts/              # markdown 文章，按分类子目录组织
├── assets/css/main.css      # 全局样式 + Shiki 暗黑模式覆盖
├── components/
│   ├── AppHeader.vue        # 导航栏（含主题切换）
│   ├── AppFooter.vue
│   ├── ThemeToggle.vue      # 亮/暗模式切换按钮
│   └── PostCard.vue         # 文章卡片（封面/标题/描述/标签/日期）
├── layouts/default.vue
├── pages/
│   ├── index.vue            # 首页：文章列表 + 分页
│   ├── posts/[...slug].vue  # 文章详情
│   ├── categories/index.vue # 分类列表
│   ├── categories/[name].vue
│   ├── tags/index.vue       # 标签列表
│   └── tags/[name].vue
├── nuxt.config.ts
├── tailwind.config.ts
├── Dockerfile               # SSR 模式，node:20-alpine
├── docker-compose.yml       # 对外端口 3016
└── Makefile                 # 常用命令（dev / docker-build / docker-up）
```

---

## 内容来源配置

`nuxt.config.ts` 中通过 `content.sources` 覆盖默认 `content/` 目录，
直接读取 `blog/_posts/`：

```ts
content: {
  sources: {
    content: {
      driver: 'fs',
      base: resolve(__dirname, 'blog/_posts'),
    },
  },
}
```

**如果此配置不生效**，备选方案：在项目根目录创建 `content` 软链接：

```bash
ln -s blog/_posts content
```

---

## 文章 frontmatter 格式

```yaml
---
title: "文章标题"
description: "摘要"
date: 2024-01-01 12:00:00
updated: 2024-01-01 12:00:00
cover: "https://image.unusebamboo.top/blog/cover/xxx.png"
categories:
  - web
tags:
  - tag1
  - tag2
---
```

---

## 开发命令

```bash
pnpm install          # 安装依赖
pnpm run dev          # 启动开发服务器（默认 3000 端口）
pnpm run build        # 构建 SSR 生产包
```

## Docker 部署

```bash
make docker-build    # 处理符号链接 + 构建镜像 blog-nuxt:latest
make docker-up       # docker-compose up -d（端口 3016）
make docker-down
make docker-logs
```

> **注意**：`blog/_posts` 是符号链接，Docker 构建时无法跨越，
> `make docker-build` 会自动 `cp -rL` 处理，不要直接 `docker build .`。

---

## 端口

| 环境        | 端口 |
| ----------- | ---- |
| 本地开发    | 3000 |
| Docker 对外 | 3016 |

---

## 待办 / 后续功能

- [ ] 文章 TOC（目录）侧边栏
- [ ] 全文搜索（Nuxt Content 内置 `/api/search.json`）
- [ ] 评论系统（giscus）
- [ ] 访问统计
