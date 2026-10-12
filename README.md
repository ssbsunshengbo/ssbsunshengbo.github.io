# Shengbo Sun · Engineering Notes

一个按 GitHub Docs 阅读布局搭建的 GitHub Pages 博客。文章放在 Markdown 文件里；Jekyll 负责生成文章列表和阅读页，不需要额外的运行时服务。

界面沿用 Primer 的浅色设计令牌、字阶和间距。对应 CSS 保存在 `assets/css/vendor/primer/`，来自 `@primer/primitives` 11.10.0，采用 MIT 许可证。西文界面使用 GitHub 官方 Mona Sans 可变字体，采用 SIL Open Font License 1.1；许可证文本分别保存在 CSS 与字体目录中。中文由系统字体回退显示。

## 写作

在项目根目录运行：

```sh
node scripts/new-post.mjs "深入理解 Go 并发模型" --slug go-concurrency
```

命令会在 `_drafts/` 创建带 front matter 和复盘提纲的 Markdown 草稿。标题可以直接写中文；`--slug` 可选，用于生成更清晰的文章网址。完成后发布草稿：

```sh
node scripts/new-post.mjs --publish _drafts/2026-10-09-go-concurrency.md
```

发布命令会把草稿移动到 `_posts/`。提交并推送后，GitHub Pages 会生成文章页面并更新列表。示例文章保存在 `_drafts/`，只在本地用 `--drafts` 预览时显示；发布前请替换成自己的真实经验。

## 本地预览

安装 Ruby 3 和 Bundler 后，在项目根目录运行：

```sh
bundle install
bundle exec jekyll serve --drafts
```

然后打开 `http://127.0.0.1:4000/blog/`。`--drafts` 会把 `_drafts/` 中的文章也显示出来，便于发布前检查。GitHub Pages 本身使用 Jekyll 生成 Markdown 文章；本地预览使用 `github-pages` Gem 对齐其常见依赖。

## 并入现有个人主页

博客入口设计为 `/blog/`，导航中的“个人主页”返回 `https://ssbsunshengbo.github.io/`。现有仓库的 `index.html`、`script.js` 和 `style.css` 可以继续保留。将以下内容合并到现有仓库根目录：

- `_config.yml`、`_layouts/`、`_posts/`、`_drafts/`
- `assets/blog-favicon.svg`、`assets/css/`、`assets/fonts/`、`assets/js/`
- `blog/`、`scripts/`、`Gemfile`

保留现有个人主页的根目录 `index.html`。本项目的根目录 `index.html` 只用于独立预览并跳转到 `/blog/`，合并时不要覆盖个人主页首页。如果仓库已有 `_config.yml` 或 `Gemfile`，请把本项目中的设置合并进去，不要整份替换原文件。合并后，把个人主页的 ARTICLES 导航和 READ ARTICLES 入口指向 `/blog/`；单篇文章卡片可以链接到对应的 `/blog/年/月/日/英文短名/` 地址。

## 内容格式

每篇文章用 YAML front matter 提供标题、日期、分类、标签和摘要，正文使用 Markdown。一级分类为“工程实践”“技术难题”“AI实践”；“Agent稳定性保障”是“AI实践”下的子主题。点击“AI实践”名称可展开或折叠子主题。文章网址格式为 `/blog/年/月/日/英文短名/`。

正文中的二级、三级标题会生成“本页内容”目录。引用提示可用 GitHub Markdown 告警语法：

```markdown
> [!NOTE]
> 补充说明。
```

支持 `NOTE`、`TIP`、`IMPORTANT`、`WARNING` 和 `CAUTION`。
