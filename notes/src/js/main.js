class NotesApp {
  constructor() {
    this.noteList = document.getElementById('noteList');
    this.noteContent = document.getElementById('noteContent');
    this.currentNoteTitle = document.getElementById('currentNoteTitle');
    this.toggleButton = document.getElementById('toggleSidebar');
    this.sidebar = document.querySelector('.sidebar');
    this.notesPath = '../NotesBook/';
    this.currentNote = null;
    // GitHub相关配置
    this.githubConfig = {
      owner: window.location.host.split('.')[0],
      repo: window.location.host.split('.')[0] + '.github.io',
      branch: 'main',
    };

    this.initEventListeners();
    this.init();
  }

  initEventListeners() {
    // 侧边栏切换
    this.toggleButton.addEventListener('click', () => {
      this.sidebar.classList.toggle('show');
    });

    // 点击内容区域时关闭侧边栏（移动端）
    this.noteContent.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        this.sidebar.classList.remove('show');
      }
    });
  }

  async init() {
    // 初始化marked配置
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
    });

    await this.loadNotesList();
  }

  async loadNotesList() {
    try {
      const notesList = await this.fetchDirectoryContents('notes/NotesBook');
      if (!notesList || !Array.isArray(notesList)) {
        throw new Error('Failed to load notes list');
      }

      const mdFiles = this.filterMarkdownFiles(notesList);
      this.renderNotesList(mdFiles);
    } catch (error) {
      console.error('Error loading notes list:', error);
      this.noteList.innerHTML = '<div class="error">加载笔记列表失败</div>';
    }
  }

  async fetchDirectoryContents(path) {
    try {
      const { owner, repo, branch } = this.githubConfig;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

      const response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch directory contents');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching directory contents:', error);
      return null;
    }
  }

  filterMarkdownFiles(contents) {
    return contents
      .filter(item => item.type === 'file' && item.name.endsWith('.md'))
      .map(item => ({
        name: decodeURIComponent(item.name.replace('.md', '')),
        path: item.download_url,
        size: item.size,
        sha: item.sha,
        url: item.html_url,
      }));
  }

  renderNotesList(notes) {
    if (!notes.length) {
      this.noteList.innerHTML = '<div class="note-item">暂无笔记</div>';
      return;
    }

    this.noteList.innerHTML = notes
      .map(
        note => `
          <div class="note-item" data-path="${note.path}">
            <div class="note-title">${note.name}</div>
            <div class="note-meta">
              <span class="note-size">${this.formatFileSize(note.size)}</span>
              <a href="${note.url}" class="note-link" target="_blank" title="在GitHub中查看">
                <svg height="16" viewBox="0 0 16 16" width="16">
                  <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </div>
          </div>
        `
      )
      .join('');

    // 添加点击事件
    this.noteList.querySelectorAll('.note-item').forEach(item => {
      const link = item.querySelector('.note-link');
      link.addEventListener('click', e => {
        e.stopPropagation(); // 阻止事件冒泡
      });
      item.addEventListener('click', () => this.loadNote(item.dataset.path));
    });
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async loadNote(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Failed to load note');

      const markdown = await response.text();
      this.renderNote(markdown);

      // 更新UI状态
      this.currentNote = path;
      this.updateActiveNoteInList();
      this.updateNoteTitle(path);

      // 在移动端自动隐藏侧边栏
      if (window.innerWidth <= 768) {
        this.sidebar.classList.remove('show');
      }
    } catch (error) {
      console.error('Error loading note:', error);
      this.noteContent.innerHTML = '<div class="error">加载笔记失败</div>';
    }
  }

  renderNote(markdown) {
    try {
      this.noteContent.innerHTML = marked(markdown);
      // 代码高亮
      this.noteContent.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block);
      });
    } catch (error) {
      console.error('Error rendering markdown:', error);
      this.noteContent.innerHTML = '<div class="error">渲染笔记失败</div>';
    }
  }

  updateActiveNoteInList() {
    this.noteList.querySelectorAll('.note-item').forEach(item => {
      item.classList.toggle('active', item.dataset.path === this.currentNote);
    });
  }

  updateNoteTitle(path) {
    const fileName = decodeURIComponent(path.split('/').pop().replace('.md', ''));
    this.currentNoteTitle.textContent = fileName;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.notesApp = new NotesApp();
});
