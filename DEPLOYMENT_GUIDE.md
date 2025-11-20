# 云端服务器集成部署方案

本文档提供将改进后的齿轮箱选型系统集成到现有云端服务器的多种方案。

**现有系统**: http://47.111.132.236/dashboard-complete.html

---

## 方案一：子路径部署（推荐）⭐

### 适用场景
- 最简单、最直接的集成方式
- 保持原有系统不变，新增独立功能模块
- 适合快速上线

### 部署步骤

#### 1. 配置构建路径
修改 `package.json`，添加 homepage 字段：

```json
{
  "homepage": "/gearbox",
  ...
}
```

#### 2. 重新构建
```bash
npm run build
```

#### 3. 部署到服务器
将 `build` 目录上传到服务器的 `/var/www/html/gearbox/` 目录

```bash
# 在服务器上执行
sudo mkdir -p /var/www/html/gearbox
sudo chown -R www-data:www-data /var/www/html/gearbox

# 从本地上传（在本地执行）
scp -r build/* root@47.111.132.236:/var/www/html/gearbox/
```

#### 4. 配置 Nginx（如果使用）
在 Nginx 配置中添加：

```nginx
server {
    listen 80;
    server_name 47.111.132.236;

    # 现有的 dashboard
    location / {
        root /var/www/html;
        index dashboard-complete.html;
    }

    # 新增的齿轮箱选型系统
    location /gearbox {
        alias /var/www/html/gearbox;
        try_files $uri $uri/ /gearbox/index.html;
        index index.html;
    }
}
```

重启 Nginx：
```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. 访问地址
- 原系统：http://47.111.132.236/dashboard-complete.html
- 新系统：http://47.111.132.236/gearbox/

### 优点
✅ 简单快速
✅ 独立部署，互不影响
✅ 易于维护和更新
✅ 保持原有系统稳定

---

## 方案二：iframe 嵌入集成

### 适用场景
- 需要在现有 dashboard 中直接显示新功能
- 希望保持统一的导航和外观
- 不想修改现有系统代码

### 部署步骤

#### 1. 按方案一部署子路径应用

#### 2. 修改 dashboard-complete.html
在现有 dashboard 中添加菜单项和 iframe：

```html
<!-- 在导航菜单中添加 -->
<li>
  <a href="#" onclick="loadGearboxModule(); return false;">
    <i class="fas fa-cog"></i> 齿轮箱选型系统
  </a>
</li>

<!-- 在内容区域添加 iframe 容器 -->
<div id="gearbox-module" style="display:none; height: 100vh;">
  <iframe
    id="gearbox-iframe"
    src="/gearbox/"
    style="width:100%; height:100%; border:none;"
    frameborder="0">
  </iframe>
</div>

<script>
function loadGearboxModule() {
  // 隐藏其他模块
  document.querySelectorAll('.module-container').forEach(el => {
    el.style.display = 'none';
  });

  // 显示齿轮箱模块
  document.getElementById('gearbox-module').style.display = 'block';
}
</script>
```

### 优点
✅ 集成度高
✅ 统一的用户界面
✅ 无需修改后端
✅ 可以保持独立更新

### 注意事项
⚠️ 需要处理跨域通信（如果需要）
⚠️ iframe 高度需要动态调整

---

## 方案三：反向代理集成

### 适用场景
- 希望使用不同端口或域名
- 需要负载均衡
- 企业级部署需求

### 部署步骤

#### 1. 在服务器上运行开发服务器或使用 serve
```bash
# 安装 serve
npm install -g serve

# 在后台运行（端口3001）
nohup serve -s build -l 3001 > gearbox.log 2>&1 &
```

#### 2. 配置 Nginx 反向代理
```nginx
server {
    listen 80;
    server_name 47.111.132.236;

    # 原有系统
    location / {
        root /var/www/html;
        index dashboard-complete.html;
    }

    # 齿轮箱系统 - 反向代理
    location /gearbox/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 优点
✅ 灵活性高
✅ 可以使用热更新
✅ 适合开发和生产环境
✅ 支持 WebSocket

---

## 方案四：Docker 容器化部署

### 适用场景
- 需要隔离环境
- 多环境部署
- 容器化管理

### 部署步骤

#### 1. 创建 Dockerfile
```dockerfile
FROM nginx:alpine

# 复制构建文件
COPY build /usr/share/nginx/html/gearbox

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf
```nginx
server {
    listen 80;

    location /gearbox {
        alias /usr/share/nginx/html/gearbox;
        try_files $uri $uri/ /gearbox/index.html;
        index index.html;
    }
}
```

#### 3. 构建和运行
```bash
docker build -t gearbox-system .
docker run -d -p 8080:80 --name gearbox gearbox-system
```

#### 4. 配置主 Nginx 代理到容器
```nginx
location /gearbox/ {
    proxy_pass http://localhost:8080/gearbox/;
}
```

### 优点
✅ 环境隔离
✅ 易于扩展
✅ 版本管理方便
✅ 支持 CI/CD

---

## 方案五：微前端架构（高级）

### 适用场景
- 多个团队协作开发
- 需要独立部署和更新
- 大型企业应用

### 技术方案
使用 qiankun 或 single-spa 等微前端框架

### 实施概要
1. 将现有 dashboard 改造为主应用（base）
2. 将齿轮箱系统注册为微应用
3. 通过配置实现动态加载

详细实施需要较多改造工作，建议在需要时单独规划。

---

## 快速部署脚本

已为您准备了自动化部署脚本 `deploy.sh`，可一键部署到服务器。

---

## 推荐方案对比

| 方案 | 难度 | 集成度 | 维护性 | 推荐指数 |
|-----|------|-------|--------|---------|
| 子路径部署 | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| iframe 嵌入 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 反向代理 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Docker容器 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 微前端 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 建议选择

### 如果您希望：
- **快速上线** → 选择方案一（子路径部署）
- **深度集成** → 选择方案二（iframe 嵌入）
- **灵活管理** → 选择方案三（反向代理）
- **专业运维** → 选择方案四（Docker）

**最推荐：方案一 + 方案二的组合**
先用方案一快速部署，再通过方案二在 dashboard 中添加入口链接。
