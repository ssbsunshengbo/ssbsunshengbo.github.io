(() => {
  const storageKey = "shengbo-engineering-notes-drafts-v1";
  const starterBody = `## 背景\n\n问题发生在什么场景？影响了谁？\n\n## 过程与判断\n\n记录关键证据、尝试过的方案，以及每一步的判断依据。\n\n## 结果与复盘\n\n最后如何解决？哪些经验可以复用？还有什么后续行动？\n`;
  const fields = {
    title: document.querySelector("#post-title"),
    slug: document.querySelector("#post-slug"),
    date: document.querySelector("#post-date"),
    category: document.querySelector("#post-category"),
    summary: document.querySelector("#post-summary"),
    tags: document.querySelector("#post-tags"),
    body: document.querySelector("#post-body"),
  };
  const picker = document.querySelector("#draft-select");
  const saveStatus = document.querySelector("#save-status");
  const filename = document.querySelector("#post-filename");
  const preview = document.querySelector("#writer-preview");
  const columns = document.querySelector("#writer-columns");
  const githubNewFile = document.querySelector("#github-new-file");
  const md = window.markdownit({ html: false, linkify: false, typographer: false });
  let drafts = readDrafts();
  let currentId = drafts[0]?.id || "";
  let loading = false;
  let saveTimer;

  function today() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function newId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function safeSlug(value) {
    return value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function displaySlug() {
    return safeSlug(fields.slug.value) || safeSlug(fields.title.value) || `engineering-note-${fields.date.value.replaceAll("-", "") || today().replaceAll("-", "")}`;
  }

  function currentFilename() {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(fields.date.value) ? fields.date.value : today();
    return `_posts/${date}-${displaySlug()}.md`;
  }

  function blankDraft() {
    return {
      id: newId(),
      title: "",
      slug: "",
      date: today(),
      category: "工程实践",
      summary: "",
      tags: "",
      body: starterBody,
      updatedAt: Date.now(),
    };
  }

  function readDrafts() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) {
        return saved
          .filter((draft) => draft && typeof draft.id === "string")
          .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      }
    } catch {
      // Start with a clean local draft if saved browser data cannot be read.
    }
    return [];
  }

  function currentDraft() {
    return drafts.find((draft) => draft.id === currentId);
  }

  function updatePicker() {
    const ordered = [...drafts].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    picker.replaceChildren(...ordered.map((draft) => {
      const option = new Option(draft.title.trim() || "未命名草稿", draft.id);
      return option;
    }));
    picker.value = currentId;
  }

  function setForm(draft) {
    loading = true;
    for (const [key, field] of Object.entries(fields)) field.value = draft[key] || "";
    if (!fields.date.value) fields.date.value = today();
    if (![...fields.category.options].some((option) => option.value === draft.category)) {
      fields.category.value = "工程实践";
    }
    loading = false;
    updateFilename();
    renderPreview();
  }

  function saveCurrent() {
    if (loading) return;
    const draft = currentDraft();
    if (!draft) return;
    for (const [key, field] of Object.entries(fields)) draft[key] = field.value;
    draft.updatedAt = Date.now();
    try {
      localStorage.setItem(storageKey, JSON.stringify(drafts));
      saveStatus.textContent = "草稿已保存在当前浏览器";
    } catch {
      saveStatus.textContent = "浏览器未能保存草稿，请下载 Markdown 备份";
    }
    updatePicker();
    updateFilename();
    renderPreview();
  }

  function scheduleSave() {
    saveStatus.textContent = "正在保存…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCurrent, 180);
  }

  function quoteYaml(value) {
    return JSON.stringify(String(value || ""));
  }

  function articleMarkdown() {
    const title = fields.title.value.trim() || "未命名文章";
    const date = /^\d{4}-\d{2}-\d{2}$/.test(fields.date.value) ? fields.date.value : today();
    const tags = fields.tags.value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);
    const body = fields.body.value.trimEnd();
    return [
      "---",
      `title: ${quoteYaml(title)}`,
      `date: ${date} 12:00:00 +0800`,
      `categories: [${quoteYaml(fields.category.value)}]`,
      `tags: [${tags.map(quoteYaml).join(", ")}]`,
      `summary: ${quoteYaml(fields.summary.value.trim())}`,
      "---",
      "",
      body,
      "",
    ].join("\n");
  }

  function enhanceAlerts(container) {
    const labels = { NOTE: "注", TIP: "提示", IMPORTANT: "重要", WARNING: "警告", CAUTION: "注意" };
    for (const quote of container.querySelectorAll("blockquote")) {
      const paragraph = quote.querySelector("p");
      const textNode = paragraph && [...paragraph.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      const match = textNode?.textContent.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
      if (!match) continue;
      textNode.textContent = textNode.textContent.replace(match[0], "");
      const kind = match[1].toUpperCase();
      quote.classList.add("markdown-alert", `markdown-alert-${kind.toLowerCase()}`);
      const label = document.createElement("p");
      label.className = "markdown-alert-title";
      label.textContent = labels[kind];
      quote.prepend(label);
    }
  }

  function renderPreview() {
    const heading = document.createElement("h1");
    heading.textContent = fields.title.value.trim() || "未命名文章";
    const parts = [heading];
    if (fields.summary.value.trim()) {
      const summary = document.createElement("p");
      summary.className = "writer-preview-summary";
      summary.textContent = fields.summary.value.trim();
      parts.push(summary);
    }
    const content = document.createElement("div");
    content.innerHTML = md.render(fields.body.value);
    enhanceAlerts(content);
    for (const link of content.querySelectorAll("a")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    parts.push(...content.childNodes);
    preview.replaceChildren(...parts);
  }

  function updateFilename() {
    const path = currentFilename();
    filename.textContent = path;
    const url = new URL(githubNewFile.href);
    url.searchParams.set("filename", path);
    githubNewFile.href = url.toString();
  }

  function switchDraft(id) {
    clearTimeout(saveTimer);
    saveCurrent();
    currentId = id;
    const draft = currentDraft();
    if (!draft) return;
    updatePicker();
    setForm(draft);
  }

  for (const field of Object.values(fields)) {
    field.addEventListener("input", scheduleSave);
    field.addEventListener("change", scheduleSave);
  }

  picker.addEventListener("change", () => switchDraft(picker.value));
  document.querySelector("#new-draft").addEventListener("click", () => {
    const draft = blankDraft();
    drafts.unshift(draft);
    currentId = draft.id;
    setForm(draft);
    saveCurrent();
    fields.title.focus();
  });

  document.querySelector("#delete-draft").addEventListener("click", () => {
    if (!window.confirm("删除这篇保存在当前浏览器的草稿？")) return;
    drafts = drafts.filter((draft) => draft.id !== currentId);
    if (drafts.length === 0) drafts.push(blankDraft());
    currentId = drafts[0].id;
    setForm(currentDraft());
    saveCurrent();
  });

  document.querySelector("#copy-markdown").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(articleMarkdown());
      saveStatus.textContent = "Markdown 已复制，可以粘贴到 GitHub";
    } catch {
      saveStatus.textContent = "复制失败；可以改用“下载 .md”";
    }
  });

  document.querySelector("#download-markdown").addEventListener("click", () => {
    const blob = new Blob([articleMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = currentFilename().replace(/^_posts\//, "");
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    saveStatus.textContent = "Markdown 文件已下载";
  });

  const editTab = document.querySelector("#edit-tab");
  const previewTab = document.querySelector("#preview-tab");
  function setView(view) {
    columns.dataset.view = view;
    editTab.setAttribute("aria-pressed", String(view === "edit"));
    previewTab.setAttribute("aria-pressed", String(view === "preview"));
  }
  editTab.addEventListener("click", () => setView("edit"));
  previewTab.addEventListener("click", () => setView("preview"));

  if (drafts.length === 0) drafts.push(blankDraft());
  currentId = drafts[0].id;
  updatePicker();
  setForm(currentDraft());
  saveCurrent();
})();
