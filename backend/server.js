/**
 * 个人知识库系统 - 后端服务器
 * 部署到 Vercel 的 Node.js + Express API
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 初始化 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 数据库文件路径
const DB_FILE = path.join(__dirname, 'db.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // 默认密码，建议通过环境变量设置

// 初始化数据库文件
async function initializeDatabase() {
  try {
    await fs.access(DB_FILE);
    console.log('数据库文件已存在');
  } catch (error) {
    // 文件不存在，创建初始数据库
    const initialData = {
      notes: [],
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('已创建初始数据库文件');
  }
}

// 读取数据库
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取数据库失败:', error);
    return { notes: [], lastUpdated: new Date().toISOString() };
  }
}

// 写入数据库
async function writeDatabase(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('写入数据库失败:', error);
    return false;
  }
}

// 密码验证中间件
function authenticate(req, res, next) {
  const password = req.headers['x-admin-password'] || req.body.password;
  
  if (!password) {
    return res.status(401).json({ 
      success: false, 
      message: '需要管理员密码' 
    });
  }
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ 
      success: false, 
      message: '密码错误' 
    });
  }
  
  next();
}

// API 路由

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: '个人知识库API'
  });
});

// 获取所有笔记（公开）
app.get('/api/notes', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json({
      success: true,
      count: db.notes.length,
      notes: db.notes,
      lastUpdated: db.lastUpdated
    });
  } catch (error) {
    console.error('获取笔记列表失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取笔记列表失败' 
    });
  }
});

// 获取单篇笔记（公开）
app.get('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDatabase();
    const note = db.notes.find(n => n.id === id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: '笔记不存在' 
      });
    }
    
    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('获取笔记失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取笔记失败' 
    });
  }
});

// 创建新笔记（需要密码）
app.post('/api/notes', authenticate, async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: '标题和内容不能为空' 
      });
    }
    
    const db = await readDatabase();
    const newNote = {
      id: uuidv4(),
      title,
      content,
      tags: tags || [],
      category: category || '未分类',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    
    db.notes.unshift(newNote); // 添加到开头
    const success = await writeDatabase(db);
    
    if (success) {
      res.status(201).json({
        success: true,
        message: '笔记创建成功',
        note: newNote
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '保存笔记失败' 
      });
    }
  } catch (error) {
    console.error('创建笔记失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建笔记失败' 
    });
  }
});

// 更新笔记（需要密码）
app.put('/api/notes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, category } = req.body;
    
    const db = await readDatabase();
    const noteIndex = db.notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: '笔记不存在' 
      });
    }
    
    // 更新笔记
    const updatedNote = {
      ...db.notes[noteIndex],
      title: title || db.notes[noteIndex].title,
      content: content || db.notes[noteIndex].content,
      tags: tags || db.notes[noteIndex].tags,
      category: category || db.notes[noteIndex].category,
      updatedAt: new Date().toISOString()
    };
    
    db.notes[noteIndex] = updatedNote;
    const success = await writeDatabase(db);
    
    if (success) {
      res.json({
        success: true,
        message: '笔记更新成功',
        note: updatedNote
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '更新笔记失败' 
      });
    }
  } catch (error) {
    console.error('更新笔记失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新笔记失败' 
    });
  }
});

// 删除笔记（需要密码）
app.delete('/api/notes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await readDatabase();
    const noteIndex = db.notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: '笔记不存在' 
      });
    }
    
    // 删除笔记
    const deletedNote = db.notes.splice(noteIndex, 1)[0];
    const success = await writeDatabase(db);
    
    if (success) {
      res.json({
        success: true,
        message: '笔记删除成功',
        note: deletedNote
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '删除笔记失败' 
      });
    }
  } catch (error) {
    console.error('删除笔记失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '删除笔记失败' 
    });
  }
});

// 增加笔记浏览量（公开）
app.post('/api/notes/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = await readDatabase();
    const noteIndex = db.notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: '笔记不存在' 
      });
    }
    
    // 增加浏览量
    db.notes[noteIndex].views = (db.notes[noteIndex].views || 0) + 1;
    await writeDatabase(db);
    
    res.json({
      success: true,
      views: db.notes[noteIndex].views
    });
  } catch (error) {
    console.error('增加浏览量失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '增加浏览量失败' 
    });
  }
});

// 搜索笔记（公开）
app.get('/api/search', async (req, res) => {
  try {
    const { q, category, tag } = req.query;
    const db = await readDatabase();
    
    let results = db.notes;
    
    // 关键词搜索
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
    }
    
    // 分类筛选
    if (category) {
      results = results.filter(note => 
        note.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // 标签筛选
    if (tag) {
      results = results.filter(note => 
        note.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: results.length,
      notes: results
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '搜索失败' 
    });
  }
});

// 获取分类和标签统计（公开）
app.get('/api/stats', async (req, res) => {
  try {
    const db = await readDatabase();
    
    // 分类统计
    const categories = {};
    // 标签统计
    const tags = {};
    let totalViews = 0;
    
    db.notes.forEach(note => {
      // 分类统计
      categories[note.category] = (categories[note.category] || 0) + 1;
      
      // 标签统计
      note.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
      
      // 总浏览量
      totalViews += (note.views || 0);
    });
    
    res.json({
      success: true,
      totalNotes: db.notes.length,
      totalViews,
      categories,
      tags,
      lastUpdated: db.lastUpdated
    });
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取统计失败' 
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API 端点不存在' 
  });
});

// 启动服务器
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`
    ============================================
    个人知识库系统后端服务器
    ============================================
    服务器运行在: http://localhost:${PORT}
    管理员密码: ${ADMIN_PASSWORD}
    数据库文件: ${DB_FILE}
    
    API 端点:
    - GET    /api/health         健康检查
    - GET    /api/notes          获取所有笔记
    - GET    /api/notes/:id      获取单篇笔记
    - POST   /api/notes          创建笔记（需密码）
    - PUT    /api/notes/:id      更新笔记（需密码）
    - DELETE /api/notes/:id      删除笔记（需密码）
    - GET    /api/search         搜索笔记
    - GET    /api/stats          获取统计信息
    ============================================
    `);
  });
}

// 启动服务器
if (require.main === module) {
  startServer();
}

// 导出给 Vercel 使用
module.exports = app;