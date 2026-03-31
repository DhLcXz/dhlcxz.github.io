/**
 * 编辑页面JavaScript - 个人知识库系统
 * 负责笔记的创建和编辑功能
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化编辑页面
    initEditPage();
});

// ==================== 表单控制 ====================

// 初始化表单控制
function initFormControls() {
    // 获取表单元素
    const noteForm = document.getElementById('noteForm');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNote();
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveNote);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
                window.location.href = 'notes.html';
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const noteId = document.getElementById('noteId').value;
            if (noteId) {
                deleteNote(noteId);
            }
        });
    }
    
    // 自动保存草稿
    initAutoSave();
}

// 初始化自动保存
function initAutoSave() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    
    if (titleInput && contentInput) {
        let saveTimeout;
        
        const saveDraft = debounce(function() {
            const draft = {
                title: titleInput.value,
                content: contentInput.value,
                tags: getCurrentTags(),
                category: document.getElementById('noteCategory').value,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('noteDraft', JSON.stringify(draft));
            console.log('草稿已自动保存');
        }, 2000);
        
        titleInput.addEventListener('input', saveDraft);
        contentInput.addEventListener('input', saveDraft);
        
        // 页面加载时检查是否有草稿
        window.addEventListener('load', function() {
            const savedDraft = localStorage.getItem('noteDraft');
            if (savedDraft && !document.getElementById('noteId').value) {
                if (confirm('检测到未保存的草稿，是否恢复？')) {
                    const draft = JSON.parse(savedDraft);
                    titleInput.value = draft.title || '';
                    contentInput.value = draft.content || '';
                    setCurrentTags(draft.tags || []);
                    if (draft.category) {
                        document.getElementById('noteCategory').value = draft.category;
                    }
                    showMessage('草稿已恢复', 'info');
                }
            }
        });
        
        // 页面卸载前保存草稿
        window.addEventListener('beforeunload', function(e) {
            if (titleInput.value || contentInput.value) {
                saveDraft();
            }
        });
    }
}

// ==================== 标签输入 ====================

// 初始化标签输入
function initTagInput() {
    const tagsInput = document.getElementById('tagsInput');
    const tagsContainer = document.getElementById('tagsContainer');
    
    if (!tagsInput || !tagsContainer) return;
    
    // 初始化标签数组
    let currentTags = [];
    
    // 添加标签
    function addTag(tag) {
        tag = tag.trim();
        if (!tag) return;
        
        // 检查标签是否已存在
        if (currentTags.includes(tag)) {
            showMessage('标签已存在', 'error');
            return;
        }
        
        // 添加到数组
        currentTags.push(tag);
        
        // 创建标签元素
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${escapeHtml(tag)}
            <span class="remove-tag" data-tag="${escapeHtml(tag)}">
                <i class="fas fa-times"></i>
            </span>
        `;
        
        // 添加到容器
        tagsContainer.appendChild(tagElement);
        
        // 清空输入框
        tagsInput.value = '';
        
        // 绑定删除事件
        const removeBtn = tagElement.querySelector('.remove-tag');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const tagToRemove = this.dataset.tag;
                removeTag(tagToRemove);
            });
        }
    }
    
    // 移除标签
    function removeTag(tag) {
        currentTags = currentTags.filter(t => t !== tag);
        
        // 从DOM中移除
        const tagElement = tagsContainer.querySelector(`.remove-tag[data-tag="${escapeHtml(tag)}"]`);
        if (tagElement) {
            tagElement.closest('.tag-item').remove();
        }
    }
    
    // 获取当前标签
    function getCurrentTags() {
        return currentTags;
    }
    
    // 设置当前标签
    function setCurrentTags(tags) {
        // 清空现有标签
        currentTags = [];
        tagsContainer.innerHTML = '';
        
        // 添加新标签
        tags.forEach(tag => addTag(tag));
    }
    
    // 暴露函数给全局作用域
    window.addTag = addTag;
    window.removeTag = removeTag;
    window.getCurrentTags = getCurrentTags;
    window.setCurrentTags = setCurrentTags;
    
    // 回车键添加标签
    tagsInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(this.value);
        }
    });
    
    // 逗号分隔添加标签
    tagsInput.addEventListener('input', function() {
        const value = this.value;
        if (value.includes(',')) {
            const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            tags.forEach(tag => addTag(tag));
            this.value = '';
        }
    });
    
    // 失去焦点时添加标签
    tagsInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            addTag(this.value);
        }
    });
}

// ==================== Markdown预览 ====================

// 初始化Markdown预览
function initMarkdownPreview() {
    const contentInput = document.getElementById('noteContent');
    const previewContent = document.getElementById('previewContent');
    const previewToggle = document.getElementById('previewToggle');
    
    if (!contentInput || !previewContent) return;
    
    // 更新预览
    function updatePreview() {
        if (typeof marked !== 'undefined') {
            previewContent.innerHTML = marked.parse(contentInput.value || '*暂无内容*');
            
            // 高亮代码块
            if (typeof hljs !== 'undefined') {
                previewContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        } else {
            previewContent.textContent = contentInput.value || '暂无内容';
        }
    }
    
    // 初始预览
    updatePreview();
    
    // 输入时更新预览（防抖）
    let previewTimeout;
    contentInput.addEventListener('input', function() {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(updatePreview, 500);
    });
    
    // 切换预览显示
    if (previewToggle) {
        previewToggle.addEventListener('click', function() {
            const previewContainer = document.querySelector('.markdown-preview');
            if (previewContainer) {
                const isHidden = previewContainer.style.display === 'none';
                previewContainer.style.display = isHidden ? 'block' : 'none';
                this.innerHTML = isHidden 
                    ? '<i class="fas fa-eye-slash"></i> 隐藏预览'
                    : '<i class="fas fa-eye"></i> 显示预览';
            }
        });
    }
}

// ==================== 编辑器工具栏 ====================

// 初始化编辑器工具栏
function initEditorToolbar() {
    const contentInput = document.getElementById('noteContent');
    if (!contentInput) return;
    
    // 工具栏按钮配置
    const toolbarButtons = [
        {
            id: 'boldBtn',
            icon: 'fas fa-bold',
            text: '粗体',
            action: () => insertText('**', '**', '粗体文字')
        },
        {
            id: 'italicBtn',
            icon: 'fas fa-italic',
            text: '斜体',
            action: () => insertText('*', '*', '斜体文字')
        },
        {
            id: 'headingBtn',
            icon: 'fas fa-heading',
            text: '标题',
            action: () => insertText('# ', '', '标题')
        },
        {
            id: 'linkBtn',
            icon: 'fas fa-link',
            text: '链接',
            action: () => insertText('[', '](https://example.com)', '链接文本')
        },
        {
            id: 'codeBtn',
            icon: 'fas fa-code',
            text: '代码',
            action: () => insertText('`', '`', '代码')
        },
        {
            id: 'codeBlockBtn',
            icon: 'fas fa-file-code',
            text: '代码块',
            action: () => insertText('```\n', '\n```', '// 代码块')
        },
        {
            id: 'listBtn',
            icon: 'fas fa-list',
            text: '列表',
            action: () => insertText('- ', '', '列表项')
        },
        {
            id: 'quoteBtn',
            icon: 'fas fa-quote-right',
            text: '引用',
            action: () => insertText('> ', '', '引用内容')
        },
        {
            id: 'imageBtn',
            icon: 'fas fa-image',
            text: '图片',
            action: () => insertText('![', '](图片地址)', '图片描述')
        }
    ];
    
    // 创建工具栏
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    
    toolbarButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toolbar-btn';
        btn.innerHTML = `<i class="${button.icon}"></i> ${button.text}`;
        btn.addEventListener('click', button.action);
        toolbar.appendChild(btn);
    });
    
    // 插入到内容输入框前面
    contentInput.parentNode.insertBefore(toolbar, contentInput);
    
    // 插入文本函数
    function insertText(before, after, placeholder) {
        const start = contentInput.selectionStart;
        const end = contentInput.selectionEnd;
        const selectedText = contentInput.value.substring(start, end);
        const textToInsert = selectedText || placeholder;
        
        const newText = contentInput.value.substring(0, start) + 
                       before + textToInsert + after + 
                       contentInput.value.substring(end);
        
        contentInput.value = newText;
        
        // 设置光标位置
        const newCursorPos = start + before.length + textToInsert.length;
        contentInput.setSelectionRange(newCursorPos, newCursorPos);
        
        // 聚焦输入框
        contentInput.focus();
        
        // 触发输入事件以更新预览
        contentInput.dispatchEvent(new Event('input'));
    }
    
    // 暴露函数给全局作用域
    window.insertText = insertText;
}

// ==================== 管理员检查 ====================

// 初始化管理员检查
function initAdminCheck() {
    // 检查是否已认证
    const adminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const adminPassword = localStorage.getItem('adminPassword');
    
    if (!adminAuthenticated || !adminPassword) {
        // 未认证，重定向到知识库页面
        showMessage('需要管理员权限，正在跳转...', 'error');
        setTimeout(() => {
            window.location.href = 'notes.html';
        }, 2000);
        return;
    }
    
    // 设置全局变量
    window.adminPassword = adminPassword;
}

// ==================== 笔记加载和保存 ====================

// 加载笔记进行编辑
async function loadNoteForEditing(noteId) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);
        const data = await response.json();
        
        if (data.success) {
            const note = data.note;
            
            // 填充表单
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteCategory').value = note.category || '未分类';
            
            // 设置标签
            if (window.setCurrentTags) {
                window.setCurrentTags(note.tags || []);
            }
            
            // 更新页面标题
            document.title = `编辑: ${note.title} | 个人知识库`;
            
            // 显示删除按钮
            const deleteBtn = document.getElementById('deleteBtn');
            if (deleteBtn) {
                deleteBtn.style.display = 'inline-block';
            }
            
            showMessage('笔记加载成功', 'success');
        } else {
            throw new Error(data.message || '加载笔记失败');
        }
    } catch (error) {
        console.error('加载笔记失败:', error);
        showMessage('加载笔记失败: ' + error.message, 'error');
        
        // 3秒后重定向
        setTimeout(() => {
            window.location.href = 'notes.html';
        }, 3000);
    } finally {
        hideLoading();
    }
}

// 设置新建笔记
function setupNewNote() {
    // 设置页面标题
    document.title = '新建笔记 | 个人知识库';
    
    // 隐藏删除按钮
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.style.display = 'none';
    }
    
    // 设置默认分类
    const categorySelect = document.getElementById('noteCategory');
    if (categorySelect) {
        // 尝试从本地存储获取上次使用的分类
        const lastCategory = localStorage.getItem('lastCategory');
        if (lastCategory) {
            categorySelect.value = lastCategory;
        }
    }
}

// 保存笔记
async function saveNote() {
    try {
        showLoading();

        // 获取表单数据
        const noteId = document.getElementById('noteId').value;
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const category = document.getElementById('noteCategory').value;
        const tags = window.getCurrentTags ? window.getCurrentTags() : [];

        // 验证数据
        if (!title) {
            throw new Error('标题不能为空');
        }

        if (!content) {
            throw new Error('内容不能为空');
        }

        // 检查管理员密码
        if (!window.adminPassword) {
            throw new Error('管理员认证已失效，请重新登录');
        }

        // 构建请求数据
        const noteData = {
            title,
            content,
            tags,
            category
        };

        // 确定请求方法和URL
        const method = noteId ? 'PUT' : 'POST';
        const url = noteId ? `${API_BASE_URL}/notes/${noteId}` : `${API_BASE_URL}/notes`;

        // 发送请求
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Password': window.adminPassword
            },
            body: JSON.stringify(noteData)
        });

        const data = await response.json();

        if (data.success) {
            // 保存成功
            showMessage(noteId ? '笔记更新成功' : '笔记创建成功', 'success');

            // 保存最后使用的分类
            localStorage.setItem('lastCategory', category);

            // 清除草稿
            localStorage.removeItem('noteDraft');

            // 3秒后重定向到笔记列表
            setTimeout(() => {
                window.location.href = 'notes.html';
            }, 2000);
        } else {
            throw new Error(data.message || '保存失败');
        }
    } catch (error) {
        console.error('保存笔记失败:', error);
        showMessage('保存失败: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}


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
                'X-Admin-Password': window.adminPassword
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('笔记删除成功', 'success');
            
            // 清除草稿
            localStorage.removeItem('noteDraft');
            
            // 3秒后重定向到笔记列表
            setTimeout(() => {
                window.location.href = 'notes.html';
            }, 2000);
        } else {
            throw new Error(data.message || '删除失败');
        }
    } catch (error) {
        console.error('删除笔记失败:', error);
        showMessage('删除失败: ' + error.message, 'error');
    } finally {
                hideLoading();
    }
}

// ==================== 工具函数 ====================

// 显示加载状态
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

// 隐藏加载状态
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建或获取消息容器
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.position = 'fixed';
        messageContainer.style.top = '20px';
        messageContainer.style.right = '20px';
        messageContainer.style.zIndex = '1000';
        document.body.appendChild(messageContainer);
    }
    
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `status-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.marginBottom = '10px';
    messageEl.style.padding = '15px 20px';
    messageEl.style.borderRadius = 'var(--border-radius)';
    messageEl.style.boxShadow = 'var(--shadow)';
    messageEl.style.animation = 'fadeIn 0.3s ease';
    
    // 设置颜色
    switch (type) {
        case 'success':
            messageEl.style.backgroundColor = '#d4edda';
            messageEl.style.color = '#155724';
            messageEl.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            messageEl.style.backgroundColor = '#f8d7da';
            messageEl.style.color = '#721c24';
            messageEl.style.border = '1px solid #f5c6cb';
            break;
        case 'info':
            messageEl.style.backgroundColor = '#d1ecf1';
            messageEl.style.color = '#0c5460';
            messageEl.style.border = '1px solid #bee5eb';
            break;
        case 'warning':
            messageEl.style.backgroundColor = '#fff3cd';
            messageEl.style.color = '#856404';
            messageEl.style.border = '1px solid #ffeaa7';
            break;
    }
    
    // 添加到容器
    messageContainer.appendChild(messageEl);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateX(100%)';
        messageEl.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

// ==================== 键盘快捷键 ====================

// 初始化键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S 保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.click();
        }
    }
    
    // Ctrl/Cmd + Enter 保存并返回
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveNote();
    }
    
    // ESC 取消/返回
    if (e.key === 'Escape') {
        if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
            window.location.href = 'notes.html';
        }
    }
});

// ==================== 页面卸载处理 ====================

// 页面卸载前检查未保存的更改
window.addEventListener('beforeunload', function(e) {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (title || content) {
        // 显示确认对话框
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return e.returnValue;
    }
});

// ==================== 图片上传功能 ====================

// 初始化图片上传
function initImageUpload() {
    const contentInput = document.getElementById('noteContent');
    if (!contentInput) return;
    
    // 创建图片上传按钮
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'toolbar-btn';
    uploadBtn.innerHTML = '<i class="fas fa-upload"></i> 上传图片';
    uploadBtn.style.marginLeft = 'auto';
    
    // 创建文件输入
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // 添加到工具栏
    const toolbar = document.querySelector('.editor-toolbar');
    if (toolbar) {
        toolbar.appendChild(uploadBtn);
        toolbar.appendChild(fileInput);
    }
    
    // 点击按钮触发文件选择
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 文件选择处理
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            showMessage('请选择图片文件', 'error');
            return;
        }
        
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
            showMessage('图片大小不能超过5MB', 'error');
            return;
        }
        
        try {
            showLoading();
            
            // 这里可以添加图片上传到服务器的逻辑
            // 由于项目使用JSON存储，这里暂时使用base64编码
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;
                
                // 插入Markdown图片语法
                const imageMarkdown = `![${file.name}](${base64Image})`;
                const start = contentInput.selectionStart;
                const end = contentInput.selectionEnd;
                
                const newText = contentInput.value.substring(0, start) + 
                               imageMarkdown + 
                               contentInput.value.substring(end);
                
                contentInput.value = newText;
                
                // 设置光标位置
                const newCursorPos = start + imageMarkdown.length;
                contentInput.setSelectionRange(newCursorPos, newCursorPos);
                
                // 聚焦输入框
                contentInput.focus();
                
                // 触发输入事件以更新预览
                contentInput.dispatchEvent(new Event('input'));
                
                showMessage('图片已插入', 'success');
                hideLoading();
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('图片上传失败:', error);
            showMessage('图片上传失败: ' + error.message, 'error');
            hideLoading();
        }
        
        // 清空文件输入
        fileInput.value = '';
    });
}

// ==================== 字数统计 ====================

// 初始化字数统计
function initWordCount() {
    const contentInput = document.getElementById('noteContent');
    if (!contentInput) return;
    
    // 创建统计显示
    const statsContainer = document.createElement('div');
    statsContainer.className = 'word-stats';
    statsContainer.style.marginTop = '10px';
    statsContainer.style.fontSize = '0.9rem';
    statsContainer.style.color = 'var(--gray-color)';
    
    // 插入到内容输入框后面
    contentInput.parentNode.appendChild(statsContainer);
    
    // 更新统计
    function updateStats() {
        const text = contentInput.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lineCount = text ? text.split('\n').length : 1;
        
        statsContainer.innerHTML = `
            <span>字符: ${charCount}</span>
            <span style="margin-left: 15px;">单词: ${wordCount}</span>
            <span style="margin-left: 15px;">行数: ${lineCount}</span>
        `;
    }
    
    // 初始统计
    updateStats();
    
    // 输入时更新统计
    contentInput.addEventListener('input', updateStats);
}

// ==================== 语法检查 ====================

// 初始化语法检查
function initSpellCheck() {
    const contentInput = document.getElementById('noteContent');
    if (!contentInput) return;
    
    // 启用拼写检查
    contentInput.spellcheck = true;
    
    // 添加语法检查提示
    const hint = document.createElement('div');
    hint.className = 'form-hint';
    hint.innerHTML = '<i class="fas fa-info-circle"></i> 已启用拼写检查，拼写错误的单词会显示红色下划线';
    hint.style.marginTop = '5px';
    
    contentInput.parentNode.appendChild(hint);
}

// ==================== 最终初始化 ====================

// 完整的初始化函数
function initEditPage() {
    console.log('初始化编辑页面...');
    
    // 初始化所有模块
    initFormControls();
    initTagInput();
    initMarkdownPreview();
    initEditorToolbar();
    initAdminCheck();
    initImageUpload();
    initWordCount();
    initSpellCheck();
    
    // 检查URL参数，判断是新建还是编辑
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('id');
    
    if (noteId) {
        // 编辑现有笔记
        loadNoteForEditing(noteId);
    } else {
        // 新建笔记
        setupNewNote();
    }
    
    // 显示欢迎消息
    setTimeout(() => {
        console.log('编辑页面初始化完成！');
    }, 1000);
}

// ==================== 错误处理 ====================

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    showMessage('系统发生错误，请刷新页面重试', 'error');
});

// Promise拒绝处理
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
    showMessage('操作失败，请重试', 'error');
});

// ==================== 完成 ====================

console.log('edit-page.js 加载完成');