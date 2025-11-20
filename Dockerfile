# Dockerfile for Gearbox Selection System
FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="your-email@example.com"
LABEL description="Gearbox Selection System"

# 复制构建文件到 nginx 目录
COPY build /usr/share/nginx/html/gearbox

# 复制自定义 nginx 配置
COPY docker-nginx.conf /etc/nginx/conf.d/default.conf

# 创建日志目录
RUN mkdir -p /var/log/nginx

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/gearbox/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
