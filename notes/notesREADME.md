# Ank Notes

一个简洁的纯前端 Markdown 笔记查看系统，专为 GitHub Pages 设计。

## 项目特点

- 🚀 纯静态部署，无需后端服务
- 📱 响应式设计，支持移动端
- ⚡️ 快速加载，支持离线访问
- ♿️ 无障碍支持，适合所有用户
- 🎨 优雅的代码高亮
- 🔍 实时笔记搜索（计划中）

## 技术栈

- HTML5 + CSS3 + ES6+
- Marked.js - Markdown 解析
- Highlight.js - 代码高亮
- 纯前端实现，不依赖 Node.js 环境

## 项目结构

```
notes/
├── NotesBook/        # 存放Markdown笔记文件
├── pages/            # 页面文件
│   └── notesIndex.html
├── src/              # 源代码
│   ├── css/          # 样式文件
│   │   ├── lib/      # 第三方CSS
│   │   ├── reset.css
│   │   └── styles.css
│   └── js/           # JavaScript文件
│       ├── lib/      # 第三方库
│       └── main.js
└── notesREADME.md   # 项目说明文档
```

## 功能特性

### 已实现功能

- [x] Markdown 渲染
- [x] 代码语法高亮
- [x] 响应式布局
- [x] 移动端侧边栏
- [x] 无障碍支持
- [x] 键盘导航
- [x] 打印优化

### 开发计划

- [ ] 笔记搜索功能
- [ ] 深色模式支持
- [ ] 目录大纲显示
- [ ] 笔记标签系统
- [ ] 本地存储支持
- [ ] 自定义主题
- [ ] 多语言支持

## 使用说明

### 添加笔记

1. 在`NotesBook`目录下创建`.md`文件
2. 使用标准 Markdown 语法编写笔记
3. 支持的功能：
   - 标准 Markdown 语法
   - GitHub Flavored Markdown
   - 代码块语法高亮
   - 表格支持
   - 任务列表

### 部署说明

1. Fork 本项目到你的 GitHub
2. 开启 GitHub Pages 功能
3. 访问`你的用户名.github.io/仓库名`即可

### 自定义配置

#### 样式定制

修改`src/css/styles.css`中的 CSS 变量：

```css
:root {
  --primary-color: #2196f3; /* 主题色 */
  --bg-color: #ffffff; /* 背景色 */
  --text-color: #333333; /* 文字颜色 */
  /* 其他变量... */
}
```

#### 功能定制

修改`src/js/main.js`中的配置：

```javascript
marked.setOptions({
  breaks: false, // 是否支持GitHub的换行符
  pedantic: false, // 是否尽可能地兼容 markdown.pl
  gfm: true, // 是否启用GitHub特殊语法
  // 其他选项...
});
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- IE11+ (基本功能)

## 性能优化

- 延迟加载非关键资源
- 异步加载样式文件
- 预加载关键资源
- 代码压缩和优化
- 缓存策略优化

## 无障碍支持

- 符合 WCAG 2.1 标准
- 支持屏幕阅读器
- 键盘导航支持
- 跳过导航链接
- ARIA 标签支持

## 已知问题

- [ ] 在某些浏览器上代码高亮可能有延迟
- [ ] 移动端侧边栏动画可能不流畅
- [ ] 打印时可能存在分页问题

## 贡献指南

欢迎提交 Issue 和 Pull Request，请确保：

1. 遵循现有的代码风格
2. 添加必要的注释和文档
3. 更新 README 中的功能列表
4. 测试所有更改

## 开源协议

MIT License
