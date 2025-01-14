class NotesApp {
  constructor() {
    this.noteList = document.getElementById('noteList');
    this.noteContent = document.getElementById('noteContent');
    this.currentNoteTitle = document.getElementById('currentNoteTitle');
    this.toggleButton = document.getElementById('toggleSidebar');
    this.sidebar = document.querySelector('.sidebar');
    this.notesPath = '../NotesBook/';
    this.currentNote = null;

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
      // 获取笔记列表
      const response = await fetch(this.notesPath);
      if (!response.ok) throw new Error('Failed to load notes list');

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'))
        .filter(link => link.href.endsWith('.md'))
        .map(link => {
          return {
            name: decodeURIComponent(link.textContent),
            path: link.href,
          };
        });

      this.renderNotesList(links);
    } catch (error) {
      console.error('Error loading notes list:', error);
      this.noteList.innerHTML = '<div class="error">加载笔记列表失败</div>';
    }
  }

  renderNotesList(notes) {
    this.noteList.innerHTML = notes
      .map(
        note => `
            <div class="note-item" data-path="${note.path}">
                ${note.name}
            </div>
        `
      )
      .join('');

    // 添加点击事件
    this.noteList.querySelectorAll('.note-item').forEach(item => {
      item.addEventListener('click', () => this.loadNote(item.dataset.path));
    });
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
