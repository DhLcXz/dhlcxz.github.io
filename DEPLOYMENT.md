# 个人知识库系统部署指南

## 项目概述

这是一个完整的个人在线知识库系统，包含：
- **前端**：纯HTML/CSS/JavaScript，可部署到GitHub Pages
- **后端**：Node.js + Express API，可部署到Vercel
- **数据存储**：JSON文件（无需数据库）

## 部署步骤

### 第一步：准备代码仓库

1. **创建GitHub仓库**
   ```bash
   # 在GitHub上创建新仓库
   # 仓库名：personal-knowledge-base
   # 选择公开（Public）仓库
   ```

2. **本地初始化Git**
   ```bash
   # 进入项目目录
   cd personal-knowledge-base
   
   # 初始化Git仓库
   git init
   
   # 添加所有文件
   git add .
   
   # 提交初始版本
   git commit -m "初始提交：个人知识库系统"
   
   # 添加远程仓库
   git remote add origin https://github.com/你的用户名/personal-knowledge-base.git
   
   # 推送到GitHub
   git push -u origin main
   ```

### 第二步：部署后端到Vercel

#### 方法一：通过Vercel网站部署

1. **访问Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录

2. **导入项目**
   - 点击"New Project"
   - 选择你的GitHub仓库
   - 选择"Import"

3. **配置项目**
   - **Framework Preset**: 选择"Other"
   - **Root Directory**: 选择"backend"
   - **Build Command**: 留空或填写 `npm install`
   - **Output Directory**: 留空
   - **Install Command**: `npm install`

4. **环境变量配置**
   - 点击"Environment Variables"
   - 添加以下变量：
     ```
     ADMIN_PASSWORD=your-secure-password-here
     NODE_ENV=production
     ```

5. **部署**
   - 点击"Deploy"
   - 等待部署完成
   - 记下生成的域名（如：`your-app.vercel.app`）

#### 方法二：通过Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署后端**
   ```bash
   cd backend
   vercel
   ```

4. **设置环境变量**
   ```bash
   vercel env add ADMIN_PASSWORD
   vercel env add NODE_ENV
   ```

### 第三步：部署前端到GitHub Pages

#### 方法一：通过GitHub设置

1. **修改API地址**
   - 打开 `frontend/notes.html`
   - 找到第184行左右的API配置：
     ```javascript
     const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';
     ```
   - 替换为你的Vercel应用地址

   - 同样修改 `frontend/edit.html` 中的API地址

2. **启用GitHub Pages**
   - 进入GitHub仓库设置
   - 找到"Pages"设置
   - **Source**: 选择"main"分支，文件夹选择"/frontend"
   - 点击"Save"

3. **访问网站**
   - 等待几分钟
   - 访问：`https://你的用户名.github.io/personal-knowledge-base/`

#### 方法二：通过GitHub Actions自动部署

1. **创建工作流文件**
   在项目根目录创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: |
             cd backend
             npm ci
             
         - name: Build
           run: |
             # 这里可以添加构建步骤
             echo "Build completed"
             
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./frontend
   ```

### 第四步：配置自定义域名（可选）

#### Vercel自定义域名
1. 在Vercel项目设置中选择"Domains"
2. 添加你的域名（如：api.yourdomain.com）
3. 按照提示配置DNS记录

#### GitHub Pages自定义域名
1. 在GitHub仓库设置的"Pages"部分
2. 输入你的域名（如：yourdomain.com）
3. 配置DNS记录指向GitHub Pages

## 环境变量配置

### 后端环境变量
在Vercel项目设置中配置：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ADMIN_PASSWORD` | 管理员密码 | `my-secure-password-123` |
| `NODE_ENV` | 环境模式 | `production` |
| `PORT` | 服务器端口（可选） | `3000` |

### 前端配置
在HTML文件中修改：

```javascript
// notes.html 和 edit.html 中
const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';
```

## 安全建议

1. **修改默认密码**
   - 默认密码：`admin123`
   - 部署后立即修改为强密码

2. **启用HTTPS**
   - Vercel和GitHub Pages默认支持HTTPS
   - 确保所有API调用使用HTTPS

3. **限制API访问**
   - 考虑添加API密钥验证
   - 或使用Vercel的访问控制功能

4. **定期备份**
   - 定期备份 `backend/db.json` 文件
   - 可以设置自动备份到GitHub

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查Vercel应用是否正常运行
   - 检查前端API地址配置是否正确
   - 查看浏览器控制台错误信息

2. **GitHub Pages不更新**
   - 清除浏览器缓存
   - 检查GitHub Actions状态
   - 等待几分钟后重试

3. **Vercel部署失败**
   - 检查 `vercel.json` 配置
   - 查看部署日志
   - 确保 `package.json` 依赖正确

4. **管理员密码无效**
   - 检查Vercel环境变量设置
   - 重启Vercel应用
   - 尝试重新设置密码

### 日志查看

#### Vercel日志
```bash
# 查看部署日志
vercel logs your-app.vercel.app

# 实时日志
vercel logs your-app.vercel.app --follow
```

#### 本地调试
```bash
# 启动本地后端
cd backend
npm start

# 或开发模式
npm run dev
```

## 维护和更新

### 更新代码
```bash
# 拉取最新代码
git pull origin main

# 安装依赖
cd backend
npm install

# 测试本地运行
npm start

# 提交更改
git add .
git commit -m "更新说明"
git push origin main
```

### 备份数据
```bash
# 备份数据库文件
cp backend/db.json backend/db-backup-$(date +%Y%m%d).json

# 添加到Git（可选）
git add backend/db-backup-*.json
git commit -m "数据库备份"
git push origin main
```

### 监控和性能
1. **Vercel监控**
   - 使用Vercel的Analytics功能
   - 监控API响应时间

2. **GitHub Pages统计**
   - 启用GitHub Pages的访问统计
   - 或使用Google Analytics

## 扩展功能建议

1. **添加评论系统**
   - 集成Disqus或Giscus
   - 或使用GitHub Discussions

2. **搜索优化**
   - 添加Algolia搜索
   - 或使用本地全文搜索

3. **图片上传**
   - 集成Cloudinary或Imgur
   - 或使用GitHub作为图床

4. **多用户支持**
   - 添加用户注册/登录
   - 基于角色的权限控制

## 技术支持

- **GitHub Issues**: 报告问题和功能请求
- **Vercel文档**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages文档**: [docs.github.com/pages](https://docs.github.com/pages)

---

**重要提示**: 首次部署后，请立即修改管理员密码，并测试所有功能是否正常工作。