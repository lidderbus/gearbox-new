# 快速开始 - 云端服务器部署

**目标服务器**: http://47.111.132.236

---

## 🚀 最快部署方式（推荐）

### 方法一：使用自动化脚本

```bash
# 1. 确保已完成修改并准备部署
git add .
git commit -m "准备部署到云端服务器"

# 2. 运行自动化部署脚本
chmod +x deploy.sh
./deploy.sh

# 3. 根据提示配置 Nginx（首次部署需要）

# 4. 访问测试
# http://47.111.132.236/gearbox/
```

**完成！** 🎉

---

## 📋 手动部署步骤

如果自动化脚本不可用，可以按以下步骤手动部署：

### 步骤 1: 修改配置

编辑 `package.json`，添加：

```json
{
  "homepage": "/gearbox"
}
```

### 步骤 2: 构建项目

```bash
npm run build
```

### 步骤 3: 上传到服务器

```bash
# 方式 A: 使用 scp
scp -r build/* root@47.111.132.236:/var/www/html/gearbox/

# 方式 B: 使用 rsync（推荐）
rsync -avz --progress build/ root@47.111.132.236:/var/www/html/gearbox/

# 方式 C: 使用 FTP/SFTP 工具（如 FileZilla）
# 上传 build 目录中的所有文件到 /var/www/html/gearbox/
```

### 步骤 4: 配置服务器

SSH 登录到服务器：

```bash
ssh root@47.111.132.236
```

设置文件权限：

```bash
sudo chown -R www-data:www-data /var/www/html/gearbox
sudo chmod -R 755 /var/www/html/gearbox
```

### 步骤 5: 配置 Nginx

编辑 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/default
```

添加以下配置到 `server` 块中：

```nginx
location /gearbox {
    alias /var/www/html/gearbox;
    try_files $uri $uri/ /gearbox/index.html;
    index index.html;
}
```

测试并重启 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 6: 访问测试

浏览器访问：**http://47.111.132.236/gearbox/**

---

## 🐳 Docker 部署方式

### 快速部署

```bash
# 1. 构建镜像
docker build -t gearbox-system .

# 2. 运行容器
docker run -d -p 8080:80 --name gearbox gearbox-system

# 3. 访问测试
# http://47.111.132.236:8080/gearbox/
```

### 使用 docker-compose

```bash
# 1. 启动
docker-compose up -d

# 2. 查看状态
docker-compose ps

# 3. 查看日志
docker-compose logs -f

# 4. 停止
docker-compose down
```

---

## 🔗 集成到 Dashboard

### 添加入口链接

在 `dashboard-complete.html` 中添加：

```html
<li>
  <a href="/gearbox/" target="_blank">
    <i class="fas fa-cog"></i> 齿轮箱选型系统
  </a>
</li>
```

### iframe 嵌入（推荐）

参考 `dashboard-integration.html` 文件中的完整代码。

核心代码：

```html
<iframe
  src="/gearbox/"
  style="width:100%; height:100vh; border:none;"
  frameborder="0">
</iframe>
```

---

## ✅ 验证部署

### 1. 检查文件

SSH 到服务器，确认文件存在：

```bash
ls -la /var/www/html/gearbox/
# 应该看到: index.html, static/, gearbox-data.json 等
```

### 2. 检查 Nginx 配置

```bash
sudo nginx -t
# 应该看到: syntax is ok, test is successful
```

### 3. 测试访问

```bash
curl -I http://47.111.132.236/gearbox/
# 应该返回 HTTP/1.1 200 OK
```

### 4. 浏览器测试

访问 http://47.111.132.236/gearbox/

应该能看到完整的齿轮箱选型系统界面。

---

## 🛠️ 故障排查

### 问题1: 404 Not Found

**原因**: Nginx 配置不正确或文件路径错误

**解决**:
```bash
# 检查文件是否存在
ls /var/www/html/gearbox/index.html

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 问题2: 403 Forbidden

**原因**: 文件权限问题

**解决**:
```bash
sudo chown -R www-data:www-data /var/www/html/gearbox
sudo chmod -R 755 /var/www/html/gearbox
```

### 问题3: 页面空白或资源加载失败

**原因**:
- 路径配置不正确
- 资源文件未正确上传

**解决**:
1. 确认 `package.json` 中设置了 `"homepage": "/gearbox"`
2. 重新构建: `npm run build`
3. 重新上传所有文件
4. 清除浏览器缓存

### 问题4: 网络无法访问

**原因**: 防火墙阻止

**解决**:
```bash
# 检查防火墙状态
sudo ufw status

# 如果需要，开放 80 端口
sudo ufw allow 80/tcp
```

---

## 📝 更新部署

当需要更新系统时：

```bash
# 1. 备份当前版本（可选）
ssh root@47.111.132.236 "cp -r /var/www/html/gearbox /var/www/html/gearbox_backup_$(date +%Y%m%d)"

# 2. 重新构建
npm run build

# 3. 上传新版本
rsync -avz --delete build/ root@47.111.132.236:/var/www/html/gearbox/

# 4. 清除浏览器缓存并测试
```

---

## 📞 获取帮助

如遇到问题：

1. 查看详细部署文档: `DEPLOYMENT_GUIDE.md`
2. 查看 Nginx 错误日志: `/var/log/nginx/error.log`
3. 查看浏览器控制台错误
4. 检查网络连接

---

## 🎯 成功部署后

- ✅ 系统访问地址: http://47.111.132.236/gearbox/
- ✅ 独立运行，不影响原有 dashboard
- ✅ 支持技术协议模板功能（已修复闪退问题）
- ✅ 可以通过 dashboard 入口访问

**部署完成！享受使用吧！** 🎉
