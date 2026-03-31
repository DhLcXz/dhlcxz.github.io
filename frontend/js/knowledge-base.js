/**
 * 个人知识库系统 - 前端JavaScript
 * 负责知识库页面的所有交互功能
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化知识库功能
    initKnowledgeBase();
});

// ==================== 笔记列表功能 ====================

// 初始化笔记列表
function initNotesList() {
    console.log('初始化笔记列表功能...');
    
    // 绑定新建笔记按钮
    const newNoteBtn = document.getElementById('newNoteBtn');
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', function() {
            showPasswordModal('new');
        });
    }
    
    // 绑定管理笔记按钮
    const manageNotesBtn = document.getElementById('manageNotesBtn');
    if (manageNotesBtn) {
        manageNotesBtn.addEventListener('click', function() {
            toggleManageMode();
        });
    }
}

// 加载笔记列表
async function loadNotes() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/notes`);
        const data = await response.json();
        
        if (data.success) {
            renderNotesList(data.notes);
            updateFilters(data.notes);
            updateStats(data.notes);
        } else {
            showError('加载笔记失败: ' + data.message);
        }
    } catch (error) {
        console.error('加载笔记失败:', error);
        showError('无法连接到服务器，请检查网络连接');
    } finally {
        hideLoading();
    }
}

// 渲染笔记列表
function renderNotesList(notes) {
    const notesList = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyState');
    
    if (!notesList) return;
    
    // 清空现有内容
    notesList.innerHTML = '';
    
    if (!notes || notes.length === 0) {
        // 显示空状态
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        notesList.style.display = 'none';
        return;
    }
    
    // 隐藏空状态
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    notesList.style.display = 'grid';
    
    // 渲染每个笔记卡片
    notes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesList.appendChild(noteCard);
    });
}

// 创建笔记卡片
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.id = note.id;
    
    // 格式化日期
    const createdDate = new Date(note.createdAt).toLocaleDateString('zh-CN');
    const updatedDate = new Date(note.updatedAt).toLocaleDateString('zh-CN');
    
    // 创建预览内容（限制长度）
    const previewContent = note.content.length > 150 
        ? note.content.substring(0, 150) + '...' 
        : note.content;
    
    // 创建标签HTML
    const tagsHtml = note.tags && note.tags.length > 0
        ? note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')
        : '<span class="note-tag">无标签</span>';
    
    card.innerHTML = `
        <div class="note-header">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <span class="note-category">${escapeHtml(note.category)}</span>
        </div>
        <div class="note-preview">${escapeHtml(previewContent)}</div>
        <div class="note-footer">
            <div class="note-tags">${tagsHtml}</div>
            <div class="note-meta">
                <span class="note-date" title="创建时间">
                    <i class="far fa-calendar"></i> ${createdDate}
                </span>
                <span class="note-views" title="浏览量">
                    <i class="far fa-eye"></i> ${note.views || 0}
                </span>
            </div>
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', function(e) {
        // 防止点击内部按钮时触发
        if (e.target.closest('.note-select-checkbox')) return;
        showNoteDetail(note.id);
    });
    
    return card;
}

// ==================== 搜索功能 ====================

// 初始化搜索功能
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // 点击搜索按钮
        searchBtn.addEventListener('click', performSearch);
        
        // 回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 输入时实时搜索（防抖）
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }
}

// 执行搜索
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    
    try {
        showLoading();
        
        let url = `${API_BASE_URL}/notes`;
        if (query) {
            url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            renderNotesList(data.notes);
            updateSearchResultsInfo(query, data.notes.length);
        }
    } catch (error) {
        console.error('搜索失败:', error);
        showError('搜索失败，请重试');
    } finally {
        hideLoading();
    }
}

// 更新搜索结果信息
function updateSearchResultsInfo(query, count) {
    const contentTitle = document.getElementById('contentTitle');
    if (!contentTitle) return;
    
    if (query) {
        contentTitle.textContent = `搜索结果: "${query}" (${count}条)`;
    } else {
        contentTitle.textContent = '所有笔记';
    }
}

// ==================== 筛选系统 ====================

// 初始化筛选系统
function initFilterSystem() {
    // 分类筛选
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        // 这里将通过JavaScript动态生成分类选项
    }
    
    // 标签筛选
    const tagFilter = document.getElementById('tagFilter');
    if (tagFilter) {
        // 这里将通过JavaScript动态生成标签选项
    }
}

// 更新筛选器
function updateFilters(notes) {
    updateCategoryFilter(notes);
    updateTagFilter(notes);
}

// 更新分类筛选器
function updateCategoryFilter(notes) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    // 收集所有分类
    const categories = {};
    notes.forEach(note => {
        categories[note.category] = (categories[note.category] || 0) + 1;
    });
    
    // 清空现有内容
    categoryFilter.innerHTML = '';
    
    // 添加"全部"选项
    const allItem = createFilterItem('全部', notes.length, 'category', 'all', true);
    categoryFilter.appendChild(allItem);
    
    // 添加分类选项
    Object.entries(categories).forEach(([category, count]) => {
        const item = createFilterItem(category, count, 'category', category);
        categoryFilter.appendChild(item);
    });
}

// 更新标签筛选器
function updateTagFilter(notes) {
    const tagFilter = document.getElementById('tagFilter');
    if (!tagFilter) return;
    
    // 收集所有标签
    const tags = {};
    notes.forEach(note => {
        if (note.tags && Array.isArray(note.tags)) {
            note.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }
    });
    
    // 清空现有内容
    tagFilter.innerHTML = '';
    
    // 添加"全部"选项
    const allItem = createFilterItem('全部', notes.length, 'tag', 'all', true);
    tagFilter.appendChild(allItem);
    
    // 添加标签选项（按数量排序）
    Object.entries(tags)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, count]) => {
            const item = createFilterItem(tag, count, 'tag', tag);
            tagFilter.appendChild(item);
        });
}

// 创建筛选项目
function createFilterItem(label, count, type, value, active = false) {
    const item = document.createElement('div');
    item.className = `filter-item ${active ? 'active' : ''}`;
    item.dataset.type = type;
    item.dataset.value = value;
    
    item.innerHTML = `
        <span class="filter-label">${escapeHtml(label)}</span>
        <span class="filter-count">${count}</span>
    `;
    
    item.addEventListener('click', function() {
        // 移除同类型的其他active状态
        document.querySelectorAll(`.filter-item[data-type="${type}"]`).forEach(el => {
            el.classList.remove('active');
        });
        
        // 激活当前项目
        this.classList.add('active');
        
        // 应用筛选
        applyFilters();
    });
    
    return item;
}

// 应用筛选
async function applyFilters() {
    try {
        showLoading();
        
        // 获取当前激活的筛选条件
        const activeFilters = {
            category: null,
            tag: null
        };
        
        document.querySelectorAll('.filter-item.active').forEach(item => {
            const type = item.dataset.type;
            const value = item.dataset.value;
            if (value !== 'all') {
                activeFilters[type] = value;
            }
        });
        
        // 构建查询参数
        const params = new URLSearchParams();
        if (activeFilters.category) params.append('category', activeFilters.category);
        if (activeFilters.tag) params.append('tag', activeFilters.tag);
        
        const queryString = params.toString();
        const url = queryString 
            ? `${API_BASE_URL}/search?${queryString}`
            : `${API_BASE_URL}/notes`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            renderNotesList(data.notes);
        }
    } catch (error) {
        console.error('筛选失败:', error);
        showError('筛选失败，请重试');
    } finally {
        hideLoading();
    }
}

// ==================== 模态框控制 ====================

// 初始化模态框控制
function initModalControls() {
    // 笔记详情模态框
    const noteDetailModal = document.getElementById('noteDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    
    if (noteDetailModal && closeDetailModal) {
        closeDetailModal.addEventListener('click', function() {
            hideModal('noteDetailModal');
        });
        
        // 点击模态框背景关闭
        noteDetailModal.addEventListener('click', function(e) {
            if (e.target === noteDetailModal) {
                hideModal('noteDetailModal');
            }
        });
    }
    
    // 密码验证模态框
    const passwordModal = document.getElementById('passwordModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPassword = document.getElementById('cancelPassword');
    
    if (passwordModal && closePasswordModal && cancelPassword) {
        closePasswordModal.addEventListener('click', function() {
            hideModal('passwordModal');
        });
        
        cancelPassword.addEventListener('click', function() {
            hideModal('passwordModal');
        });
        
        // 点击模态框背景关闭
        passwordModal.addEventListener('click', function(e) {
            if (e.target === passwordModal) {
                hideModal('passwordModal');
            }
        });
    }
    
    // 密码提交
    const submitPassword = document.getElementById('submitPassword');
    const adminPasswordInput = document.getElementById('adminPassword');
    
    if (submitPassword && adminPasswordInput) {
        submitPassword.addEventListener('click', verifyAdminPassword);
        
        // 回车键提交
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyAdminPassword();
            }
        });
    }
}

// 显示模态框
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// 隐藏模态框
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 清空密码输入框
        if (modalId === 'passwordModal') {
            const adminPasswordInput = document.getElementById('adminPassword');
            if (adminPasswordInput) {
                adminPasswordInput.value = '';
            }
            hidePasswordError();
        }
    }
}

// ==================== 笔记详情功能 ====================

// 显示笔记详情
async function showNoteDetail(noteId) {
    try {
        showLoading();
        
        // 获取笔记详情
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '获取笔记详情失败');
        }
        
        const note = data.note;
        
        // 更新模态框内容
        updateNoteDetailModal(note);
        
        // 显示模态框
        showModal('noteDetailModal');
        
        // 增加浏览量
        await incrementNoteViews(noteId);
        
    } catch (error) {
        console.error('显示笔记详情失败:', error);
        showError('无法加载笔记详情: ' + error.message);
    } finally {
        hideLoading();
    }
}

// 更新笔记详情模态框
function updateNoteDetailModal(note) {
    // 更新标题
    const modalTitle = document.getElementById('modalNoteTitle');
    if (modalTitle) {
        modalTitle.textContent = note.title;
    }
    
    // 更新元数据
    const modalDate = document.getElementById('modalNoteDate');
    if (modalDate) {
        modalDate.textContent = new Date(note.updatedAt).toLocaleDateString('zh-CN');
    }
    
    const modalViews = document.getElementById('modalNoteViews');
    if (modalViews) {
        modalViews.textContent = note.views || 0;
    }
    
    const modalTags = document.getElementById('modalNoteTags');
    if (modalTags) {
        modalTags.textContent = note.tags && note.tags.length > 0 
            ? note.tags.join(', ') 
            : '无标签';
    }
    
    const modalCategory = document.getElementById('modalNoteCategory');
    if (modalCategory) {
        modalCategory.textContent = note.category || '未分类';
    }
    
    // 更新内容（渲染Markdown）
    const modalContent = document.getElementById('modalNoteContent');
    if (modalContent) {
        // 使用marked.js渲染Markdown
        if (typeof marked !== 'undefined') {
            modalContent.innerHTML = marked.parse(note.content);
            
            // 高亮代码块
            if (typeof hljs !== 'undefined') {
                modalContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } else {
            // 如果没有marked.js，显示纯文本
            modalContent.textContent = note.content;
        }
    }
    
    // 更新按钮事件
    const editNoteBtn = document.getElementById('editNoteBtn');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    
    if (editNoteBtn) {
        editNoteBtn.onclick = function() {
            hideModal('noteDetailModal');
            showPasswordModal('edit', note.id);
        };
    }
    
    if (deleteNoteBtn) {
        deleteNoteBtn.onclick = function() {
            hideModal('noteDetailModal');
            showPasswordModal('delete', note.id);
        };
    }
}

// 增加笔记浏览量
async function incrementNoteViews(noteId) {
    try {
        await fetch(`${API_BASE_URL}/notes/${noteId}/view`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('增加浏览量失败:', error);
    }
}

// ==================== 管理员认证 ====================

// 初始化管理员认证
function initAdminAuth() {
    // 检查本地存储中是否有认证状态
    const savedAuth = localStorage.getItem('adminAuthenticated');
    const savedPassword = localStorage.getItem('adminPassword');
    
    if (savedAuth === 'true' && savedPassword) {
        adminAuthenticated = true;
        adminPassword = savedPassword;
        updateAdminUI();
    }
}

// 显示密码验证模态框
function showPasswordModal(action, noteId = null) {
    const passwordModal = document.getElementById('passwordModal');
    if (!passwordModal) return;
    
    // 存储操作信息
    passwordModal.dataset.action = action;
    if (noteId) {
        passwordModal.dataset.noteId = noteId;
    }
    
    // 显示模态框
    showModal('passwordModal');
    
    // 聚焦密码输入框
    const adminPasswordInput = document.getElementById('adminPassword');
    if (adminPasswordInput) {
        adminPasswordInput.focus();
    }
}

// 继续 knowledge-base.js 的剩余部分

// 验证管理员密码（续）
async function verifyAdminPassword() {
    const adminPasswordInput = document.getElementById('adminPassword');
    if (!adminPasswordInput) return;
    
    const password = adminPasswordInput.value.trim();
    
    if (!password) {
        showPasswordError('请输入密码');
        return;
    }
    
    try {
        showLoading();
        
        // 验证密码（通过尝试创建一个测试请求）
        const testResponse = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Password': password
            },
            body: JSON.stringify({
                title: '密码验证测试',
                content: '这是一个密码验证测试，不会保存',
                tags: ['test'],
                category: '测试'
            })
        });
        
        const data = await testResponse.json();
        
        if (testResponse.status === 401 || testResponse.status === 403) {
            showPasswordError('密码错误');
            return;
        }
        
        // 密码验证成功
        adminAuthenticated = true;
        adminPassword = password;
        
        // 保存到本地存储
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminPassword', password);
        
        // 更新UI
        updateAdminUI();
        
        // 隐藏密码模态框
        hideModal('passwordModal');
        
        // 执行相应的操作
        const passwordModal = document.getElementById('passwordModal');
        if (passwordModal) {
            const action = passwordModal.dataset.action;
            const noteId = passwordModal.dataset.noteId;
            
            switch (action) {
                case 'new':
                    window.location.href = 'edit.html';
                    break;
                case 'edit':
                    if (noteId) {
                        window.location.href = `edit.html?id=${noteId}`;
                    }
                    break;
                case 'delete':
                    if (noteId) {
                        deleteNote(noteId);
                    }
                    break;
            }
        }
        
    } catch (error) {
        console.error('密码验证失败:', error);
        showPasswordError('验证失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

// 显示密码错误
function showPasswordError(message) {
    const passwordError = document.getElementById('passwordError');
    if (passwordError) {
        passwordError.textContent = message;
        passwordError.style.display = 'block';
    }
}

// 隐藏密码错误
function hidePasswordError() {
    const passwordError = document.getElementById('passwordError');
    if (passwordError) {
        passwordError.style.display = 'none';
    }
}

// 更新管理员UI
function updateAdminUI() {
    if (adminAuthenticated) {
        // 更新按钮文本和状态
        const newNoteBtn = document.getElementById('newNoteBtn');
        if (newNoteBtn) {
            newNoteBtn.innerHTML = '<i class="fas fa-plus"></i> 新建笔记';
            newNoteBtn.onclick = function() {
                window.location.href = 'edit.html';
            };
        }
        
        const manageNotesBtn = document.getElementById('manageNotesBtn');
        if (manageNotesBtn) {
            manageNotesBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> 退出管理';
            manageNotesBtn.onclick = function() {
                logoutAdmin();
            };
        }
    }
}

// 退出管理员
function logoutAdmin() {
    adminAuthenticated = false;
    adminPassword = '';
    
    // 清除本地存储
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminPassword');
    
    // 更新UI
    const newNoteBtn = document.getElementById('newNoteBtn');
    if (newNoteBtn) {
        newNoteBtn.innerHTML = '<i class="fas fa-plus"></i> 新建笔记';
        newNoteBtn.onclick = function() {
            showPasswordModal('new');
        };
    }
    
    const manageNotesBtn = document.getElementById('manageNotesBtn');
    if (manageNotesBtn) {
        manageNotesBtn.innerHTML = '<i class="fas fa-edit"></i> 管理笔记';
        manageNotesBtn.onclick = function() {
            toggleManageMode();
        };
    }
    
    // 退出管理模式
    exitManageMode();
    
    showSuccess('已退出管理员模式');
}

// 切换管理模式
function toggleManageMode() {
    if (!adminAuthenticated) {
        showPasswordModal('manage');
        return;
    }
    
    const isManageMode = document.body.classList.contains('manage-mode');
    
    if (isManageMode) {
        exitManageMode();
    } else {
        enterManageMode();
    }
}

// 进入管理模式
function enterManageMode() {
    document.body.classList.add('manage-mode');
    
    // 显示批量操作工具栏
    const batchToolbar = document.querySelector('.batch-actions-toolbar');
    if (batchToolbar) {
        batchToolbar.classList.add('active');
    }
    
    // 为每个笔记卡片添加选择框
    document.querySelectorAll('.note-card').forEach(card => {
        if (!card.querySelector('.note-select-checkbox')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'note-select-checkbox';
            checkbox.addEventListener('click', function(e) {
                e.stopPropagation();
                updateBatchSelection();
            });
            card.appendChild(checkbox);
        }
    });
    
    // 更新按钮文本
    const manageNotesBtn = document.getElementById('manageNotesBtn');
    if (manageNotesBtn) {
        manageNotesBtn.innerHTML = '<i class="fas fa-times"></i> 退出管理';
    }
}

// 退出管理模式
function exitManageMode() {
    document.body.classList.remove('manage-mode');
    
    // 隐藏批量操作工具栏
    const batchToolbar = document.querySelector('.batch-actions-toolbar');
    if (batchToolbar) {
        batchToolbar.classList.remove('active');
    }
    
    // 移除选择框
    document.querySelectorAll('.note-select-checkbox').forEach(checkbox => {
        checkbox.remove();
    });
    
    // 移除选中状态
    document.querySelectorAll('.note-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 更新按钮文本
    const manageNotesBtn = document.getElementById('manageNotesBtn');
    if (manageNotesBtn) {
        manageNotesBtn.innerHTML = '<i class="fas fa-edit"></i> 管理笔记';
    }
}

// 更新批量选择
function updateBatchSelection() {
    const selectedNotes = document.querySelectorAll('.note-select-checkbox:checked');
    const selectedCount = selectedNotes.length;
    
    // 更新选中状态
    document.querySelectorAll('.note-card').forEach(card => {
        const checkbox = card.querySelector('.note-select-checkbox');
        if (checkbox && checkbox.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // 更新批量操作工具栏
    const batchCount = document.querySelector('.batch-selection-count');
    if (batchCount) {
        batchCount.textContent = `已选择 ${selectedCount} 项`;
    }
}

// ==================== 排序功能 ====================

// 初始化排序功能
function initSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }
}

// 应用排序
function applySorting(sortBy) {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const noteCards = Array.from(notesList.querySelectorAll('.note-card'));
    
    noteCards.sort((a, b) => {
        const aId = a.dataset.id;
        const bId = b.dataset.id;
        
        // 这里需要从数据中获取排序信息
        // 实际应用中应该从API获取排序后的数据
        // 这里只是前端演示
        
        switch (sortBy) {
            case 'newest':
                return bId.localeCompare(aId); // 简单演示，实际应该按时间排序
            case 'oldest':
                return aId.localeCompare(bId);
            case 'title':
                const aTitle = a.querySelector('.note-title').textContent;
                const bTitle = b.querySelector('.note-title').textContent;
                return aTitle.localeCompare(bTitle);
            case 'views':
                const aViews = parseInt(a.querySelector('.note-views').textContent) || 0;
                const bViews = parseInt(b.querySelector('.note-views').textContent) || 0;
                return bViews - aViews;
            default:
                return 0;
        }
    });
    
    // 重新排列
    noteCards.forEach(card => {
        notesList.appendChild(card);
    });
}

// ==================== 统计功能 ====================

// 初始化统计功能
function initStats() {
    // 统计功能已集成到其他函数中
}

// 加载统计信息
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const data = await response.json();
        
        if (data.success) {
            updateStatsDisplay(data);
        }
    } catch (error) {
        console.error('加载统计失败:', error);
    }
}

// 更新统计显示
function updateStatsDisplay(stats) {
    // 更新笔记总数
    const totalNotes = document.getElementById('totalNotes');
    if (totalNotes) {
        totalNotes.textContent = stats.totalNotes || 0;
    }
    
    // 更新总浏览量
    const totalViews = document.getElementById('totalViews');
    if (totalViews) {
        totalViews.textContent = stats.totalViews || 0;
    }
    
    // 更新最后更新时间
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated && stats.lastUpdated) {
        const date = new Date(stats.lastUpdated);
        lastUpdated.textContent = date.toLocaleDateString('zh-CN');
    }
}

// 更新统计（从笔记列表）
function updateStats(notes) {
    const totalNotes = document.getElementById('totalNotes');
    if (totalNotes) {
        totalNotes.textContent = notes.length;
    }
    
    // 计算总浏览量
    const totalViews = notes.reduce((sum, note) => sum + (note.views || 0), 0);
    const totalViewsEl = document.getElementById('totalViews');
    if (totalViewsEl) {
        totalViewsEl.textContent = totalViews;
    }
    
    // 更新最后更新时间
    if (notes.length > 0) {
        const lastNote = notes.reduce((latest, note) => {
            const noteTime = new Date(note.updatedAt).getTime();
            const latestTime = new Date(latest.updatedAt).getTime();
            return noteTime > latestTime ? note : latest;
        });
        
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            const date = new Date(lastNote.updatedAt);
            lastUpdated.textContent = date.toLocaleDateString('zh-CN');
        }
    }
}

// ==================== 笔记操作功能 ====================

// 删除笔记
async function deleteNote(noteId) {
    if (!confirm('确定要删除这篇笔记吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'X-Admin-Password': adminPassword
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('笔记删除成功');
            
            // 从列表中移除
            const noteCard = document.querySelector(`.note-card[data-id="${noteId}"]`);
            if (noteCard) {
                noteCard.remove();
            }
            
            // 重新加载统计
            loadStats();
            
            // 检查是否还有笔记
            const notesList = document.getElementById('notesList');
            if (notesList && notesList.children.length === 0) {
                const emptyState = document.getElementById('emptyState');
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
        } else {
            showError('删除失败: ' + data.message);
        }
    } catch (error) {
        console.error('删除笔记失败:', error);
        showError('删除失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

// 批量删除笔记
async function deleteSelectedNotes() {
    const selectedNotes = document.querySelectorAll('.note-select-checkbox:checked');
    
    if (selectedNotes.length === 0) {
        showError('请先选择要删除的笔记');
        return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedNotes.length} 篇笔记吗？此操作不可撤销。`)) {
        return;
    }
    
    try {
        showLoading();
        
        const deletePromises = Array.from(selectedNotes).map(checkbox => {
            const noteId = checkbox.closest('.note-card').dataset.id;
            return fetch(`${API_BASE_URL}/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'X-Admin-Password': adminPassword
                }
            });
        });
        
        const responses = await Promise.all(deletePromises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        const successCount = results.filter(r => r.success).length;
        
        if (successCount > 0) {
            showSuccess(`成功删除 ${successCount} 篇笔记`);
            
            // 重新加载笔记列表
            loadNotes();
            
            // 退出管理模式
            exitManageMode();
        } else {
            showError('删除失败，请重试');
        }
    } catch (error) {
        console.error('批量删除失败:', error);
        showError('删除失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

// ==================== 工具函数 ====================

// 显示加载状态
function showLoading() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
}

// 隐藏加载状态
function hideLoading() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

// 显示成功消息
function showSuccess(message) {
    showMessage(message, 'success');
}

// 显示错误消息
function showError(message) {
    showMessage(message, 'error');
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建一个临时消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `status-message ${type}`;
    messageEl.textContent = message;
    
    // 添加到页面顶部
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(messageEl, container.firstChild);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== 键盘快捷键 ====================

// 初始化键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC键关闭所有模态框
    if (e.key === 'Escape') {
        hideModal('noteDetailModal');
        hideModal('passwordModal');
    }
    
    // Ctrl/Cmd + F 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Ctrl/Cmd + N 新建笔记
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const newNoteBtn = document.getElementById('newNoteBtn');
        if (newNoteBtn) {
            newNoteBtn.click();
        }
    }
});

// ==================== 页面卸载处理 ====================

// 页面卸载前保存状态
window.addEventListener('beforeunload', function() {
    // 保存搜索状态
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        localStorage.setItem('knowledgeSearch', searchInput.value);
    }
    
    // 保存排序状态
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        localStorage.setItem('knowledgeSort', sortSelect.value);
    }
});

// 页面加载时恢复状态
window.addEventListener('load', function() {
    // 恢复搜索状态
    const savedSearch = localStorage.getItem('knowledgeSearch');
    const searchInput = document.getElementById('searchInput');
    if (savedSearch && searchInput) {
        searchInput.value = savedSearch;
        if (savedSearch.trim()) {
            performSearch();
        }
    }
    
    // 恢复排序状态
    const savedSort = localStorage.getItem('knowledgeSort');
    const sortSelect = document.getElementById('sortSelect');
    if (savedSort && sortSelect) {
        sortSelect.value = savedSort;
        applySorting(savedSort);
    }
});

// ==================== 批量操作工具栏 ====================

// 初始化批量操作工具栏
function initBatchActionsToolbar() {
    // 创建批量操作工具栏
    const toolbar = document.createElement('div');
    toolbar.className = 'batch-actions-toolbar';
    toolbar.innerHTML = `
        <div class="batch-selection-info">
            <span class="batch-selection-count">已选择 0 项</span>
        </div>
        <div class="batch-actions-buttons">
            <button class="btn btn-danger" id="batchDeleteBtn">
                <i class="fas fa-trash"></i> 批量删除
            </button>
            <button class="btn btn-secondary" id="batchCancelBtn">
                <i class="fas fa-times"></i> 取消选择
            </button>
        </div>
    `;
    
    // 插入到内容区域前面
    const knowledgeContent = document.querySelector('.knowledge-content');
    if (knowledgeContent) {
        knowledgeContent.insertBefore(toolbar, knowledgeContent.firstChild);
    }
    
    // 绑定批量删除按钮
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', deleteSelectedNotes);
    }
    
    // 绑定取消选择按钮
    const batchCancelBtn = document.getElementById('batchCancelBtn');
    if (batchCancelBtn) {
        batchCancelBtn.addEventListener('click', function() {
            // 取消所有选择
            document.querySelectorAll('.note-select-checkbox:checked').forEach(checkbox => {
                checkbox.checked = false;
            });
            updateBatchSelection();
        });
    }
}

// ==================== 导出功能 ====================

// 导出笔记为Markdown文件
function exportNoteAsMarkdown(note) {
    const content = `# ${note.title}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导出所有笔记为ZIP文件
async function exportAllNotes() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/notes`);
        const data = await response.json();
        
        if (data.success) {
            // 创建ZIP文件
            const zip = new JSZip();
            
            data.notes.forEach(note => {
                const content = `# ${note.title}\n\n${note.content}`;
                const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
                zip.file(filename, content);
            });
            
            // 添加README文件
            const readme = `# 个人知识库导出\n\n导出时间: ${new Date().toLocaleString('zh-CN')}\n笔记总数: ${data.notes.length}\n\n使用说明:\n1. 所有笔记均为Markdown格式\n2. 文件名已自动处理为兼容格式\n3. 可以使用任何Markdown编辑器查看`;
            zip.file('README.md', readme);
            
            // 生成ZIP文件
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `knowledge-base-export-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showSuccess('导出成功！');
        }
    } catch (error) {
        console.error('导出失败:', error);
        showError('导出失败，请重试');
    } finally {
        hideLoading();
    }
}

// ==================== 导入功能 ====================

// 导入笔记
async function importNotes(files) {
    try {
        showLoading();
        
        const importedNotes = [];
        
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const content = await readFileAsText(file);
                const lines = content.split('\n');
                const title = lines[0].replace(/^#\s*/, '');
                const noteContent = lines.slice(2).join('\n');
                
                importedNotes.push({
                    title: title || file.name.replace('.md', ''),
                    content: noteContent,
                    tags: ['导入'],
                    category: '导入笔记'
                });
            }
        }
        
        if (importedNotes.length === 0) {
            showError('没有找到有效的Markdown文件');
            return;
        }
        
        // 批量导入笔记
        const importPromises = importedNotes.map(note => 
            fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Password': adminPassword
                },
                body: JSON.stringify(note)
            })
        );
        
        const responses = await Promise.all(importPromises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        const successCount = results.filter(r => r.success).length;
        
        if (successCount > 0) {
            showSuccess(`成功导入 ${successCount} 篇笔记`);
            // 重新加载笔记列表
            loadNotes();
        } else {
            showError('导入失败，请检查文件格式');
        }
    } catch (error) {
        console.error('导入失败:', error);
        showError('导入失败，请重试');
    } finally {
        hideLoading();
    }
}

// 读取文件为文本
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// ==================== 离线功能 ====================

// 检查网络状态
function checkNetworkStatus() {
    const isOnline = navigator.onLine;
    const networkStatus = document.getElementById('networkStatus');
    
    if (networkStatus) {
        if (isOnline) {
            networkStatus.style.display = 'none';
        } else {
            networkStatus.style.display = 'block';
            networkStatus.innerHTML = `
                <i class="fas fa-wifi-slash"></i>
                <span>当前处于离线状态，部分功能可能受限</span>
            `;
        }
    }
}

// 初始化离线功能
function initOfflineFeatures() {
    // 创建网络状态指示器
    const networkStatus = document.createElement('div');
    networkStatus.id = 'networkStatus';
    networkStatus.className = 'network-status';
    networkStatus.style.display = 'none';
    
    document.body.appendChild(networkStatus);
    
    // 监听网络状态变化
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    // 初始检查
    checkNetworkStatus();
}

// ==================== 性能优化 ====================

// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 虚拟滚动（用于大量笔记）
function initVirtualScroll() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    const containerHeight = notesList.clientHeight;
    const itemHeight = 150; // 预估每个笔记卡片的高度
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
    
    // 这里可以实现虚拟滚动逻辑
    // 由于笔记数量通常不会太多，这里暂时不实现完整功能
}

// ==================== 主题切换 ====================

// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // 检查保存的主题
    const savedTheme = localStorage.getItem('knowledgeTheme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// 设置主题
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('knowledgeTheme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' 
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }
}

// ==================== 最终初始化 ====================

// 完整的初始化函数
function initKnowledgeBase() {
    console.log('初始化个人知识库系统...');
    
    // 初始化所有模块
    initNotesList();
    initSearchFunction();
    initFilterSystem();
    initModalControls();
    initAdminAuth();
    initSorting();
    initStats();
    initBatchActionsToolbar();
    initOfflineFeatures();
    initThemeToggle();
    initLazyLoading();
    initVirtualScroll();
    
    // 加载初始数据
    loadNotes();
    loadStats();
    
    // 显示欢迎消息
    setTimeout(() => {
        console.log('个人知识库系统初始化完成！');
    }, 1000);
}

// ==================== 错误边界处理 ====================

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    showError('系统发生错误，请刷新页面重试');
});

// Promise拒绝处理
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
    showError('操作失败，请重试');
});

// ==================== 服务工作者（PWA支持） ====================

// 注册服务工作者
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
            function(registration) {
                console.log('ServiceWorker 注册成功:', registration.scope);
            },
            function(err) {
                console.log('ServiceWorker 注册失败:', err);
            }
        );
    });
}

// ==================== 完成 ====================

console.log('knowledge-base.js 加载完成');

