# blog-nuxt

个人技术博客，基于 Nuxt 3 + Nuxt Content 构建，支持 SSR、亮/暗主题、代码高亮。

## 项目结构

```
blog-nuxt/
├── blog/               # 符号链接 → ~/Documents/blog（Markdown 文章仓库）
│   └── _posts/         # 按分类子目录存放文章
├── assets/css/         # 全局样式
├── components/         # 公共组件（导航栏、文章卡片、主题切换等）
├── composables/        # 组合式函数（封面模式、首页 Hero 模式）
├── layouts/            # 页面布局
├── pages/              # 路由页面
│   ├── index.vue           # 首页（文章列表 + Hero 区域）
│   ├── posts/[...slug].vue # 文章详情
│   ├── categories/         # 分类页
│   └── tags/               # 标签页
├── scripts/            # 工具脚本（如批量补全封面图）
├── nuxt.config.ts      # Nuxt 配置
├── Dockerfile
├── docker-compose.yml  # 对外端口 3016
└── Makefile            # 常用命令快捷入口
```

## 本地开发

**前提**：Node.js 20+，文章目录软链接已建立。

```bash
# 1. 建立文章目录软链接（只需做一次）
ln -s ~/Documents/blog blog

# 2. 安装依赖
npm install

# 3. 启动开发服务器（http://localhost:3000）
npm run dev
```

> 如果你通过局域网 IP 访问开发服务器，内容热更新的 WebSocket 会自动使用本机 IP，无需额外配置。

## 文章格式

文章为 Markdown 文件，放在 `blog/_posts/<分类>/` 目录下，frontmatter 格式如下：

```yaml
---
title: '文章标题'
description: '一句话摘要'
date: 2024-01-01 12:00:00
cover: 'https://example.com/cover.jpg'
categories:
  - web
tags:
  - vue
  - nuxt
---
```

文章没有封面图时，可以运行以下脚本自动从现有图片中随机分配：

```bash
node scripts/assign-covers.mjs
```

## 功能特性

- **首页 Hero**：两种模式可切换（站点简介 + 最新文章 / 近期文章轮播）
- **文章封面**：两种布局可切换（左文右图两栏 / 模糊背景居中图）
- **亮/暗主题**：跟随系统，也可手动切换，偏好持久化
- **代码高亮**：Shiki（vitesse-light / vitesse-dark 主题）
- **分类 & 标签**：支持多分类、多标签浏览

以上切换偏好均保存在 `localStorage`，刷新后保留。

## Docker 部署

```bash
# 构建镜像（自动处理符号链接问题）
make docker-build

# 启动（端口 3016）
make docker-up

# 查看日志
make docker-logs

# 停止
make docker-down
```

> 不要直接运行 `docker build .`，因为 `blog/_posts` 是符号链接，Docker 无法跨越。`make docker-build` 会先将其复制为真实目录再构建。

## 技术栈

| 用途 | 技术 |
|------|------|
| 框架 | Nuxt 3（SSR） |
| 内容 | @nuxt/content v2 |
| 样式 | Tailwind CSS + Typography |
| 图标 | @nuxt/icon（Phosphor Icons） |
| 主题 | @nuxtjs/color-mode |
| 代码高亮 | Shiki（内置于 @nuxt/content） |
