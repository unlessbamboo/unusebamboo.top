# 多阶段构建：构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制项目文件（注意：blog/_posts 需要是真实目录，不能是符号链接）
# 使用 make docker-build 命令，它会自动处理符号链接的解引用
COPY . .

RUN npm run build

# 运行阶段（SSR 模式，无需 nginx）
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output /app/.output

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", "/app/.output/server/index.mjs"]
