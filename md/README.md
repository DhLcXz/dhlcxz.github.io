# 个人在线知识库系统

一个现代化、响应式的个人知识库系统，使用纯前端技术（HTML、CSS、JavaScript）和Node.js后端构建。

## 🌟 功能特点

### 用户功能
- ✅ **响应式设计**：完美适配电脑、平板和手机
- ✅ **现代简约风格**：采用最新的设计趋势和色彩方案
- ✅ **笔记浏览**：游客可以查看所有公开笔记
- ✅ **搜索功能**：支持全文搜索和筛选
- ✅ **分类标签**：按分类和标签组织内容
- ✅ **Markdown支持**：完整的Markdown语法支持

### 管理员功能
- 🔐 **密码保护**：输入自定义密码后进入管理模式
- 📝 **笔记管理**：新建、编辑、删除笔记
- 🏷️ **标签管理**：添加和管理标签
- 📂 **分类管理**：组织笔记到不同分类
- 📊 **统计查看**：查看笔记统计信息

### 技术特性
- 🚀 **无框架**：纯原生HTML、CSS、JavaScript
- 💾 **轻量存储**：使用JSON文件，无需数据库
- 🔄 **实时预览**：Markdown编辑器实时预览
- 📱 **PWA支持**：可安装为桌面/移动应用
- 🔍 **全文搜索**：快速查找笔记内容

## 📁 项目结构

```
个人知识库系统/
├── frontend/                    # 前端代码
│   ├── css/                    # 样式文件
│   │   ├── style.css          # 基础样式
│   │   ├── knowledge-base.css # 知识库页面样式
│   │   └── edit-page.css      # 编辑页面样式
│   ├── js/                    # JavaScript文件
│   │   ├── main.js           # 基础交互
│   │   ├── knowledge-base.js # 知识库逻辑
│   │   └── edit-page.js      # 编辑页面逻辑
│   ├── images/               # 图片资源
│   ├── index.html           # 个人网站首页
│   ├── notes.html          # 知识库列表页
│   └── edit.html           # 笔记编辑页
├── backend/                   # 后端代码
│   ├── api/                  # API路由
│   ├── db.json              # 数据库文件
│   ├── package.json        # 依赖配置
│   ├── server.js           # 主服务器文件
│   └── vercel.json         # Vercel部署配置
├── docs/                     # 文档
│   ├── DEPLOYMENT.md       # 部署指南
│   ├── LOCAL_SETUP.md      # 本地设置指南
│   ├── GIT_GUIDE.md        # Git使用指南
│   └── ENVIRONMENT_SETUP.md # 环境变量配置
└── README.md               # 本文件
```

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/personal-knowledge-base.git
   cd personal-knowledge-base
   ```

2. **启动后端**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **启动前端**
   ```bash
   cd frontend
   python -m http.server 8000
   ```

4. **访问应用**
   - 前端：http://localhost:8000
   - 后端API：http://localhost:3000/api/health

详细步骤请查看 [LOCAL_SETUP.md](LOCAL_SETUP.md)

### 在线部署

#### 后端部署到Vercel
1. 将代码推送到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 部署完成

#### 前端部署到GitHub Pages
1. 修改API地址为Vercel域名
2. 启用GitHub Pages
3. 访问生成的页面

详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔧 技术栈

### 前端
- **HTML5** - 语义化标记
- **CSS3** - 现代样式（Grid、Flexbox、CSS变量）
- **JavaScript (ES6+)** - 原生交互
- **Marked.js** - Markdown解析
- **Highlight.js** - 代码高亮
- **Font Awesome** - 图标库

### 后端
- **Node.js** - 运行时环境
- **Express.js** - Web框架
- **CORS** - 跨域支持
- **UUID** - 唯一标识生成

### 部署
- **GitHub Pages** - 前端托管
- **Vercel** - 后端托管
- **JSON文件** - 数据存储

## 📖 使用指南

### 作为游客
1. 访问知识库页面
2. 浏览笔记列表
3. 使用搜索功能查找笔记
4. 点击笔记标题查看详情

### 作为管理员
1. 点击"管理笔记"按钮
2. 输入管理员密码（默认：admin123）
3. 进入管理模式
4. 可以新建、编辑、删除笔记

### 创建新笔记
1. 点击"新建笔记"按钮
2. 输入标题和内容（支持Markdown）
3. 添加标签和分类
4. 点击保存

### 编辑笔记
1. 在笔记详情页点击"编辑笔记"
2. 修改内容
3. 点击保存

## 🔐 安全配置

### 修改管理员密码
**重要**：部署后必须修改默认密码！

1. **本地开发**：修改 `backend/.env` 文件
2. **Vercel部署**：在项目设置中添加环境变量

### 环境变量
```env
ADMIN_PASSWORD=your-strong-password-here
NODE_ENV=production
PORT=3000
```

详细配置请查看 [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

## 📱 响应式设计

系统支持多种设备：

| 设备 | 特性 |
|------|------|
| **桌面电脑** | 完整功能，多栏布局 |
| **平板电脑** | 自适应布局，触控优化 |
| **手机** | 单栏布局，移动端菜单 |

## 🔍 API接口

### 公开接口
- `GET /api/notes` - 获取所有笔记
- `GET /api/notes/:id` - 获取单篇笔记
- `GET /api/search` - 搜索笔记
- `GET /api/stats` - 获取统计信息

### 管理员接口（需要密码）
- `POST /api/notes` - 创建笔记
- `PUT /api/notes/:id` - 更新笔记
- `DELETE /api/notes/:id` - 删除笔记

## 📈 扩展功能

### 已实现功能
- [x] 基本的CRUD操作
- [x] Markdown编辑器
- [x] 全文搜索
- [x] 分类标签系统
- [x] 响应式设计
- [x] 密码保护

### 计划功能
- [ ] 图片上传
- [ ] 导出功能（PDF/Markdown）
- [ ] 评论系统
- [ ] 多用户支持
- [ ] 主题切换
- [ ] 离线支持

## 🛠️ 开发指南

### 代码规范
- 使用有意义的提交信息
- 遵循现有的代码风格
- 添加适当的注释
- 测试所有功能

### Git工作流
```bash
# 创建功能分支
git checkout -b feature/your-feature

# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin feature/your-feature

# 创建Pull Request
```

详细Git指南请查看 [GIT_GUIDE.md](GIT_GUIDE.md)

## 🐛 故障排除

### 常见问题

#### 1. API连接失败
- 检查后端服务器是否运行
- 确认API地址配置正确
- 查看浏览器控制台错误

#### 2. 密码验证失败
- 确认密码输入正确
- 检查环境变量配置
- 重启后端服务器

#### 3. 页面样式异常
- 清除浏览器缓存
- 检查CSS文件是否加载
- 确认网络连接正常

### 获取帮助
1. 查看相关文档
2. 检查GitHub Issues
3. 在控制台查看错误信息
4. 搜索类似问题

## 📄 许可证

本项目为个人使用而创建，您可以自由修改和使用。

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务
- [Marked.js](https://marked.js.org/) - Markdown解析器
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [Vercel](https://vercel.com/) - 部署平台
- [GitHub Pages](https://pages.github.com/) - 静态网站托管

## 📞 联系方式

如有问题或建议，请：
1. 创建GitHub Issue
2. 查看现有文档
3. 参考示例代码

---

**提示**: 首次部署后，请立即修改管理员密码，并测试所有功能是否正常工作。

## 🚀 下一步

1. [ ] 阅读 [LOCAL_SETUP.md](LOCAL_SETUP.md) 设置本地环境
2. [ ] 阅读 [DEPLOYMENT.md](DEPLOYMENT.md) 部署到生产环境
3. [ ] 阅读 [GIT_GUIDE.md](GIT_GUIDE.md) 学习Git使用
4. [ ] 开始使用你的个人知识库！