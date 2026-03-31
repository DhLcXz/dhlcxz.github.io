# 本地开发环境设置指南

## 系统要求

- **Node.js**: 14.0.0 或更高版本
- **npm**: 6.0.0 或更高版本
- **Git**: 2.0.0 或更高版本
- **现代浏览器**: Chrome 60+, Firefox 55+, Safari 11+

## 第一步：环境准备

### 1.1 安装Node.js和npm

#### Windows
1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载LTS版本（推荐）
3. 运行安装程序，按照提示完成安装
4. 验证安装：
   ```bash
   node --version
   npm --version
   ```

#### macOS
```bash
# 使用Homebrew安装
brew install node

# 或从官网下载安装包
```

#### Linux (Ubuntu/Debian)
```bash
# 使用apt安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.2 安装Git

#### Windows
1. 访问 [Git官网](https://git-scm.com/)
2. 下载安装程序
3. 安装时选择"Use Git from the Windows Command Prompt"

#### macOS
```bash
# 使用Homebrew安装
brew install git
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

## 第二步：获取项目代码

### 2.1 克隆仓库
```bash
# 克隆项目到本地
git clone https://github.com/你的用户名/personal-knowledge-base.git

# 进入项目目录
cd personal-knowledge-base
```

### 2.2 项目结构
```
personal-knowledge-base/
├── frontend/          # 前端代码
│   ├── css/          # 样式文件
│   ├── js/           # JavaScript文件
│   ├── images/       # 图片资源
│   ├── index.html    # 首页
│   ├── notes.html    # 知识库页面
│   └── edit.html     # 编辑页面
├── backend/          # 后端代码
│   ├── api/          # API路由
│   ├── db.json       # 数据库文件
│   ├── package.json  # 依赖配置
│   ├── server.js     # 主服务器文件
│   └── vercel.json   # Vercel配置
├── README.md         # 项目说明
├── DEPLOYMENT.md     # 部署指南
└── LOCAL_SETUP.md    # 本地设置指南
```

## 第三步：后端设置

### 3.1 安装依赖
```bash
# 进入后端目录
cd backend

# 安装依赖包
npm install
```

### 3.2 配置环境变量

创建 `.env` 文件：
```bash
# 在backend目录下创建.env文件
touch .env
```

编辑 `.env` 文件：
```env
# 管理员密码（重要！）
ADMIN_PASSWORD=your-local-password

# 服务器端口
PORT=3000

# 环境模式
NODE_ENV=development

# 数据库文件路径
DB_FILE=./db.json
```

### 3.3 启动后端服务器

#### 开发模式（推荐）
```bash
# 使用nodemon自动重启
npm run dev

# 或直接使用node
node server.js
```

#### 生产模式
```bash
npm start
```

#### 验证服务器运行
访问：http://localhost:3000/api/health

应该看到：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "个人知识库API"
}
```

## 第四步：前端设置

### 4.1 配置API地址

编辑前端文件中的API配置：

**notes.html** (约第184行)：
```javascript
// 本地开发配置
const API_BASE_URL = 'http://localhost:3000/api';

// 生产环境配置（部署后修改）
// const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';
```

**edit.html** (约第184行)：
```javascript
// 本地开发配置
const API_BASE_URL = 'http://localhost:3000/api';

// 生产环境配置（部署后修改）
// const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';
```

### 4.2 启动本地服务器

有多种方式可以启动本地服务器：

#### 方法一：使用Python（最简单）
```bash
# 进入前端目录
cd frontend

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

访问：http://localhost:8000

#### 方法二：使用Node.js的http-server
```bash
# 全局安装http-server
npm install -g http-server

# 启动服务器
cd frontend
http-server -p 8000
```

#### 方法三：使用Live Server（VS Code扩展）
1. 安装VS Code扩展"Live Server"
2. 右键点击 `frontend/index.html`
3. 选择"Open with Live Server"

#### 方法四：使用npx serve
```bash
# 不需要安装
cd frontend
npx serve -p 8000
```

## 第五步：测试系统功能

### 5.1 测试流程

1. **访问首页**
   - 打开：http://localhost:8000
   - 确认页面正常加载
   - 测试导航功能

2. **访问知识库**
   - 点击导航栏的"知识库"链接
   - 或直接访问：http://localhost:8000/notes.html
   - 确认笔记列表正常显示

3. **测试管理员功能**
   - 点击"新建笔记"按钮
   - 输入密码：`your-local-password`（.env中设置的）
   - 创建一篇测试笔记

4. **测试编辑功能**
   - 点击笔记标题查看详情
   - 点击"编辑笔记"按钮
   - 修改内容并保存

5. **测试删除功能**
   - 在笔记详情页点击"删除笔记"
   - 确认删除成功

### 5.2 常见测试场景

#### 场景1：游客浏览
```bash
# 1. 不登录，直接浏览笔记
# 2. 查看笔记详情
# 3. 使用搜索功能
# 4. 使用筛选功能
```

#### 场景2：管理员操作
```bash
# 1. 点击"管理笔记"按钮
# 2. 输入正确密码
# 3. 创建新笔记
# 4. 编辑现有笔记
# 5. 删除笔记
# 6. 退出管理员模式
```

#### 场景3：数据持久化
```bash
# 1. 创建几篇笔记
# 2. 重启后端服务器
# 3. 确认笔记数据仍然存在
# 4. 检查db.json文件
```

## 第六步：开发工具配置

### 6.1 VS Code推荐扩展

1. **Live Server** - 实时预览HTML
2. **Prettier** - 代码格式化
3. **ESLint** - JavaScript代码检查
4. **GitLens** - Git增强功能
5. **Markdown All in One** - Markdown支持
6. **Auto Rename Tag** - 自动重命名标签

### 6.2 浏览器开发者工具

#### Chrome DevTools
- **F12** 或 **Ctrl+Shift+I** 打开
- **Network** 标签：监控API请求
- **Console** 标签：查看JavaScript错误
- **Application** 标签：检查LocalStorage

#### Firefox Developer Tools
- **F12** 打开
- 类似功能，界面略有不同

### 6.3 调试技巧

#### 前端调试
```javascript
// 在JavaScript中添加调试语句
console.log('调试信息:', variable);
console.table(dataArray);
debugger; // 添加断点
```

#### 后端调试
```javascript
// 在server.js中添加日志
console.log('请求路径:', req.path);
console.log('请求体:', req.body);
console.error('错误信息:', error);
```

## 第七步：数据库管理

### 7.1 数据库文件结构
`backend/db.json` 文件结构：
```json
{
  "notes": [
    {
      "id": "uuid-string",
      "title": "笔记标题",
      "content": "Markdown内容",
      "tags": ["标签1", "标签2"],
      "category": "分类",
      "createdAt": "ISO时间",
      "updatedAt": "ISO时间",
      "views": 0
    }
  ],
  "lastUpdated": "ISO时间"
}
```

### 7.2 手动管理数据库

#### 备份数据库
```bash
# 创建备份
cp backend/db.json backend/db-backup-$(date +%Y%m%d-%H%M%S).json

# 或使用Git
git add backend/db.json
git commit -m "备份数据库"
```

#### 恢复数据库
```bash
# 从备份恢复
cp backend/db-backup-20240101-120000.json backend/db.json

# 重启服务器
npm start
```

#### 清空数据库
```bash
# 创建空的数据库文件
echo '{"notes": [], "lastUpdated": "'$(date -Iseconds)'"}' > backend/db.json
```

### 7.3 数据库工具

#### 使用jq处理JSON
```bash
# 安装jq
# Ubuntu/Debian: sudo apt-get install jq
# macOS: brew install jq

# 查看笔记数量
jq '.notes | length' backend/db.json

# 查看所有笔记标题
jq '.notes[].title' backend/db.json

# 导出笔记为CSV
jq -r '.notes[] | [.title, .category, (.tags | join(",")), .views] | @csv' backend/db.json > notes.csv
```

## 第八步：常见问题解决

### 8.1 端口冲突

如果端口3000或8000被占用：

```bash
# 查找占用端口的进程
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# 修改端口
# 1. 修改.env文件中的PORT
# 2. 修改前端API地址中的端口
# 3. 重启服务器
```

### 8.2 CORS错误

如果看到CORS错误：
```bash
# 确保后端已启用CORS
# server.js中应该有：
app.use(cors());

# 如果仍有问题，可以配置更宽松的CORS：
app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}));
```

### 8.3 文件权限问题

#### Linux/macOS
```bash
# 修复文件权限
chmod 755 backend/
chmod 644 backend/db.json
chmod +x backend/server.js
```

#### Windows
- 确保有读写权限
- 以管理员身份运行命令行

### 8.4 依赖安装失败

```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules
rm -rf node_modules

# 重新安装
npm install
```

## 第九步：开发工作流

### 9.1 日常开发流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 启动后端
cd backend
npm run dev

# 3. 启动前端
cd ../frontend
python -m http.server 8000

# 4. 进行开发
# 5. 测试功能
# 6. 提交更改
git add .
git commit -m "功能描述"
git push origin main
```

### 9.2 代码规范

#### 文件命名
- HTML文件：小写，用连字符分隔，如 `edit-page.html`
- CSS文件：小写，用连字符分隔，如 `knowledge-base.css`
- JavaScript文件：小写，用连字符分隔，如 `edit-page.js`

#### 代码风格
- 使用2个空格缩进
- 字符串使用单引号
- 语句末尾添加分号
- 添加有意义的注释

### 9.3 Git使用规范

```bash
# 提交信息格式
git commit -m "类型: 描述"

# 类型包括：
# feat: 新功能
# fix: 修复bug
# docs: 文档更新
# style: 代码格式
# refactor: 重构
# test: 测试
# chore: 构建过程或辅助工具

# 示例：
git commit -m "feat: 添加笔记搜索功能"
git commit -m "fix: 修复密码验证问题"
```

## 第十步：性能优化

### 10.1 开发环境优化

#### 启用缓存
```bash
# 在浏览器中禁用缓存进行开发
# Chrome: DevTools -> Network -> Disable cache
```

#### 使用开发工具
```bash
# 监控内存使用
node --inspect server.js

# 性能分析
node --prof server.js
```

### 10.2 生产环境优化

#### 前端优化
- 压缩HTML/CSS/JavaScript
- 使用CDN加载外部资源
- 启用浏览器缓存

#### 后端优化
- 启用Gzip压缩
- 设置合适的缓存头
- 监控API响应时间

## 技术支持

### 获取帮助
1. **查看日志**
   ```bash
   # 后端日志
   tail -f backend/npm-debug.log
   
   # 浏览器控制台
   # 按F12打开开发者工具
   ```

2. **搜索问题**
   - 错误信息 + "Stack Overflow"
   - GitHub Issues

3. **社区支持**
   - Node.js社区
   - Express.js文档
   - Vercel社区

### 学习资源
- [Node.js官方文档](https://nodejs.org/docs/)
- [Express.js指南](https://expressjs.com/)
- [JavaScript教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [Git教程](https://git-scm.com/book/zh/v2)

---

**提示**: 开发过程中，建议定期提交代码到Git，并保持数据库备份。