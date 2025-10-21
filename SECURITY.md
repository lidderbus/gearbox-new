# 安全配置指南

本文档说明系统的安全配置和最佳实践。

## 🔐 安全改进概述

### 已实施的安全措施

1. ✅ **移除硬编码密码** - 不再在源代码中存储明文密码
2. ✅ **密码哈希验证** - 使用 SHA256 哈希存储和验证密码
3. ✅ **数据加密存储** - localStorage 中的敏感数据使用 AES 加密
4. ✅ **环境变量管理** - 通过 .env 文件管理敏感配置
5. ✅ **日志系统** - 可配置的日志级别，生产环境禁用调试日志

---

## 📋 环境变量配置

### 1. 复制环境变量模板

```bash
cp .env.example .env
```

### 2. 生成密码哈希

使用提供的工具生成新的密码哈希：

```bash
# 生成管理员密码哈希
node scripts/generate-password-hash.js "your-new-admin-password"

# 生成普通用户密码哈希
node scripts/generate-password-hash.js "your-new-user-password"
```

将输出的哈希值复制到 `.env` 文件中：

```env
REACT_APP_ADMIN_PASSWORD_HASH=your-generated-hash-here
REACT_APP_USER_PASSWORD_HASH=your-generated-hash-here
```

### 3. 生成加密密钥

生成随机加密密钥用于数据加密：

```bash
node scripts/generate-password-hash.js --key
```

将生成的密钥添加到 `.env` 文件：

```env
REACT_APP_ENCRYPTION_KEY=your-generated-key-here
```

---

## 🚀 部署到生产环境

### 重要步骤

1. **更改默认密码**
   ```bash
   # 为生产环境生成新的强密码哈希
   node scripts/generate-password-hash.js "YourProductionPassword@2024!"
   ```

2. **生成新的加密密钥**
   ```bash
   node scripts/generate-password-hash.js --key
   ```

3. **设置环境变量**
   - 在生产服务器上设置环境变量
   - **永远不要**将 `.env` 文件提交到 Git
   - 使用服务器的环境变量管理系统（如 Vercel、Netlify 等）

4. **配置日志级别**
   ```env
   REACT_APP_LOG_LEVEL=error
   REACT_APP_ENABLE_LOGGING_IN_PRODUCTION=false
   ```

---

## 🛠️ 新的安全工具

### SecureStorage (安全存储)

加密的 localStorage 包装器：

```javascript
import { secureStorage, STORAGE_KEYS } from './utils/secureStorage';

// 存储敏感数据（自动加密）
secureStorage.setItem(STORAGE_KEYS.USER, userData);

// 读取数据（自动解密）
const user = secureStorage.getItem(STORAGE_KEYS.USER);

// 删除数据
secureStorage.removeItem(STORAGE_KEYS.USER);
```

### Logger (日志系统)

替代 console.log 的日志工具：

```javascript
import { createLogger } from './utils/logger';

const log = createLogger('MyModule');

log.debug('调试信息', { data }); // 仅开发环境
log.info('一般信息');
log.warn('警告信息');
log.error('错误信息'); // 始终记录

// 性能测量
log.time('operation');
// ... 执行操作
log.timeEnd('operation');
```

---

## 🔒 最佳实践

### DO ✅

- ✅ 使用强密码（至少12字符，包含大小写字母、数字、特殊字符）
- ✅ 定期更换密码
- ✅ 为每个环境使用不同的密钥
- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 在生产环境禁用调试日志
- ✅ 定期检查依赖包的安全漏洞 (`npm audit`)

### DON'T ❌

- ❌ 不要在代码中硬编码密码或密钥
- ❌ 不要提交 `.env` 文件到 Git
- ❌ 不要在生产环境使用默认密码
- ❌ 不要在日志中输出敏感信息（密码、token等）
- ❌ 不要在客户端代码中存储敏感的 API 密钥

---

## 🔍 安全审计

### 定期检查

```bash
# 检查依赖包漏洞
npm audit

# 自动修复已知漏洞
npm audit fix

# 检查过时的包
npm outdated
```

### 代码审查清单

- [ ] 没有硬编码的密码或密钥
- [ ] 敏感数据使用加密存储
- [ ] 日志中不包含敏感信息
- [ ] 环境变量正确配置
- [ ] .gitignore 包含 .env 文件
- [ ] 生产环境使用强密码

---

## 📝 默认凭据（仅开发环境）

⚠️ **警告：生产环境必须更改这些密码！**

| 账户 | 用户名 | 默认密码 | 角色 |
|------|--------|----------|------|
| 管理员 | admin | Gbox@2024! | ADMIN |
| 普通用户 | user | User@2024! | USER |

---

## 🆘 常见问题

### Q: 忘记密码怎么办？

A: 使用密码哈希生成工具创建新密码：
```bash
node scripts/generate-password-hash.js "new-password"
```
然后更新 `.env` 文件中的对应哈希值。

### Q: 如何在服务器上部署？

A: 不要上传 `.env` 文件。在服务器的环境变量配置中设置：
- Vercel: 在项目设置的 Environment Variables 中添加
- Netlify: 在 Build & Deploy > Environment 中添加
- 其他平台: 查看对应文档

### Q: 数据迁移问题？

A: 系统会自动迁移旧的明文数据到加密存储。首次登录后会看到迁移日志。

---

## 📞 报告安全问题

如果发现安全漏洞，请通过以下方式报告：
- 创建 GitHub Issue（标记为 Security）
- 或直接联系项目维护者

---

## 📚 相关文档

- [环境变量配置](.env.example)
- [密码哈希生成工具](scripts/generate-password-hash.js)
- [安全存储工具](src/utils/secureStorage.js)
- [日志系统](src/utils/logger.js)

---

**最后更新**: 2025-10-21
**维护者**: Claude Code Optimization
