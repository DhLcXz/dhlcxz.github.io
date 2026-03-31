# 环境变量配置指南

## 概述

环境变量用于配置应用程序在不同环境（开发、测试、生产）中的行为。个人知识库系统使用环境变量来管理敏感信息和配置选项。

## 重要安全提示

⚠️ **重要**: 永远不要将包含敏感信息的 `.env` 文件提交到Git仓库！

## 配置方法

### 方法1：本地开发环境

#### 步骤1：创建 `.env` 文件
在 `backend/` 目录下创建 `.env` 文件：

```bash
cd backend
touch .env
```

#### 步骤2：配置环境变量
编辑 `.env` 文件，添加以下内容：

```env
# 基本配置
PORT=3000
NODE_ENV=development

# 安全配置 - 必须修改！
ADMIN_PASSWORD=your-strong-password-here

# 数据库配置
DB_FILE=./db.json

# 开发配置
DEBUG=true
```

#### 步骤3：添加到 .gitignore
确保 `.gitignore` 文件包含：
```
.env
.env.local
.env.*.local
```

### 方法2：Vercel生产环境

#### 步骤1：Vercel控制台配置
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" -> "Environment Variables"
4. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ADMIN_PASSWORD` | `your-production-password` | 生产环境管理员密码 |
| `NODE_ENV` | `production` | 生产环境模式 |

#### 步骤2：CLI配置
```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 设置环境变量
vercel env add ADMIN_PASSWORD
vercel env add NODE_ENV production
```

### 方法3：使用dotenv包

后端代码已经配置了dotenv支持：

```javascript
// server.js 中已经包含
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
```

## 环境变量详解

### 必需配置

| 变量名 | 默认值 | 说明 | 示例 |
|--------|--------|------|------|
| `ADMIN_PASSWORD` | `admin123` | **管理员密码**，必须修改！ | `My$tr0ngP@ssw0rd!` |
| `NODE_ENV` | `development` | 环境模式 | `production` |

### 服务器配置

| 变量名 | 默认值 | 说明 | 示例 |
|--------|--------|------|------|
| `PORT` | `3000` | 服务器端口 | `8080` |
| `DB_FILE` | `./db.json` | 数据库文件路径 | `./data/db.json` |

### 可选配置

| 变量名 | 默认值 | 说明 | 示例 |
|--------|--------|------|------|
| `DEBUG` | `false` | 启用调试模式 | `true` |
| `LOG_LEVEL` | `info` | 日志级别 | `debug` |
| `CORS_ORIGIN` | `*` | CORS允许的源 | `https://yourdomain.com` |

## 密码安全指南

### 创建强密码

```bash
# 使用密码生成器
# 或使用以下规则创建：
# - 至少12个字符
# - 包含大小写字母
# - 包含数字
# - 包含特殊字符
# - 不要使用常见单词

# 示例强密码：
# - C0mpl3x!P@ssw0rd#
# - MyKb$3cur3P@ss!
# - N3wP@ss!2024#
```

### 密码管理建议

1. **不同环境使用不同密码**
   - 开发环境：`dev-password-123`
   - 测试环境：`test-password-456`
   - 生产环境：`prod-strong-password-789`

2. **定期更换密码**
   - 建议每3-6个月更换一次
   - 重要系统每月更换

3. **不要共享密码**
   - 使用密码管理器
   - 需要共享时使用临时密码

## 多环境配置

### 开发环境配置 (`.env.development`)

```env
PORT=3000
NODE_ENV=development
ADMIN_PASSWORD=dev-password-123
DEBUG=true
LOG_LEVEL=debug
```

### 测试环境配置 (`.env.test`)

```env
PORT=3001
NODE_ENV=test
ADMIN_PASSWORD=test-password-456
DEBUG=false
LOG_LEVEL=info
```

### 生产环境配置 (`.env.production`)

```env
PORT=3000
NODE_ENV=production
ADMIN_PASSWORD=prod-strong-password-789
DEBUG=false
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
```

## 自动加载配置

### package.json脚本

```json
{
  "scripts": {
    "dev": "NODE_ENV=development node server.js",
    "start": "NODE_ENV=production node server.js",
    "test": "NODE_ENV=test jest"
  }
}
```

### 使用cross-env（跨平台）

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development node server.js",
    "start": "cross-env NODE_ENV=production node server.js"
  }
}
```

## 故障排除

### 常见问题

#### 问题1：环境变量未生效
```bash
# 检查是否加载了正确的.env文件
echo $NODE_ENV

# 重启服务器
npm start

# 检查server.js中的配置
console.log('Admin password:', process.env.ADMIN_PASSWORD);
```

#### 问题2：端口被占用
```bash
# 查找占用端口的进程
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# 修改端口
PORT=3001 npm start
```

#### 问题3：权限问题
```bash
# 检查文件权限
ls -la .env

# 修复权限
chmod 600 .env  # 仅所有者可读写
```

### 调试技巧

```javascript
// 在server.js中添加调试代码
console.log('环境变量:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- DB_FILE:', process.env.DB_FILE);

// 检查所有环境变量
console.log('所有环境变量:', process.env);
```

## 安全最佳实践

### 1. 敏感信息管理
- 使用环境变量存储密码、API密钥
- 不要硬编码在源代码中
- 使用加密存储（如Vault）管理生产环境密钥

### 2. 访问控制
- 限制.env文件访问权限
- 使用不同的密码用于不同环境
- 定期审计环境变量使用

### 3. 监控和日志
- 记录环境变量变更
- 监控异常访问
- 定期检查日志

### 4. 备份和恢复
```bash
# 备份环境变量
cp .env .env.backup.$(date +%Y%m%d)

# 恢复环境变量
cp .env.backup.20240101 .env
```

## 自动化部署

### GitHub Actions示例

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          cd backend
          vercel --prod --token=$VERCEL_TOKEN
```

### 环境变量加密

```bash
# 使用openssl加密
openssl enc -aes-256-cbc -salt -in .env -out .env.enc -pass pass:your-secret

# 解密
openssl enc -aes-256-cbc -d -in .env.enc -out .env -pass pass:your-secret
```

## 扩展配置

### 添加自定义配置

```javascript
// 在server.js中添加
const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  security: {
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET
  },
  database: {
    file: process.env.DB_FILE,
    backupDir: process.env.DB_BACKUP_DIR
  }
};
```

### 配置验证

```javascript
function validateConfig() {
  const required = ['ADMIN_PASSWORD', 'NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('缺少必需的环境变量:', missing.join(', '));
    process.exit(1);
  }
  
  if (process.env.ADMIN_PASSWORD === 'admin123') {
    console.warn('警告: 使用默认管理员密码，建议修改！');
  }
}

validateConfig();
```

## 资源链接

- [dotenv文档](https://github.com/motdotla/dotenv)
- [Vercel环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [12 Factor App配置](https://12factor.net/config)
- [OWASP安全配置指南](https://cheatsheetseries.owasp.org/cheatsheets/Configuration_Cheat_Sheet.html)

---

**记住**: 正确的环境变量管理是应用安全的基础。始终遵循最小权限原则，并定期审查和更新配置。