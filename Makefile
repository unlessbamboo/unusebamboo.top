.PHONY: dev install docker-build docker-up docker-down docker-logs

# 本地开发
dev:
	npm run dev

# 安装依赖
install:
	npm install

# 构建 Docker 镜像
# 因为 blog/_posts 是符号链接，Docker 无法直接访问链接外部目录
# 此命令会先将其复制为真实目录，构建完成后恢复
docker-build:
	@echo "==> 解引用 blog/_posts 符号链接..."
	@cp -rL blog/_posts blog-posts-snapshot
	@echo "==> 构建 Docker 镜像..."
	@docker build -t blog-nuxt:latest .
	@rm -rf blog-posts-snapshot
	@echo "==> 完成: blog-nuxt:latest"

# 启动容器
docker-up:
	docker-compose up -d

# 停止容器
docker-down:
	docker-compose down

# 查看日志
docker-logs:
	docker-compose logs -f
