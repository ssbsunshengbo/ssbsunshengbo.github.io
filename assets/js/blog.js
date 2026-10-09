(() => {
  const input = document.querySelector("#article-search");
  const entries = [...document.querySelectorAll(".post-entry")];
  const count = document.querySelector("#visible-count");
  const empty = document.querySelector("#search-empty");
  const status = document.querySelector("#search-status");
  const title = document.querySelector("#article-list-title");
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "";

  if (!input || entries.length === 0) return;

  input.value = params.get("q") || "";

  const update = () => {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    let visible = 0;

    for (const entry of entries) {
      const matchesText = entry.dataset.search.toLocaleLowerCase("zh-CN").includes(query);
      const categories = entry.dataset.category.split("|").filter(Boolean);
      const matchesCategory = !category || categories.includes(category);
      entry.hidden = !(matchesText && matchesCategory);
      if (!entry.hidden) visible += 1;
    }

    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    if (title) title.textContent = category ? `分类：${category}` : query ? "搜索结果" : "全部文章";
    status.textContent = query || category ? `找到 ${visible} 篇文章` : "";
  };

  input.addEventListener("input", update);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) {
      input.value = "";
      update();
      input.blur();
    }
  });

  update();
})();
