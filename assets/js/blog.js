(() => {
  const input = document.querySelector("#article-search");
  const entries = [...document.querySelectorAll(".post-entry")];
  const count = document.querySelector("#visible-count");
  const empty = document.querySelector("#search-empty");
  const status = document.querySelector("#search-status");
  const title = document.querySelector("#article-list-title");
  const params = new URLSearchParams(window.location.search);
  const queryCategory = params.get("category") || "";
  const categoryLinks = [...document.querySelectorAll("[data-category-nav]")];
  const allLink = document.querySelector("[data-nav-all]");

  if (!input) return;

  input.value = params.get("q") || "";
  for (const link of categoryLinks) {
    const current = link.dataset.categoryNav === queryCategory;
    link.classList.toggle("is-current", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  const showAll = !queryCategory;
  allLink?.classList.toggle("is-current", showAll);
  if (showAll) allLink?.setAttribute("aria-current", "page");
  else allLink?.removeAttribute("aria-current");

  if (entries.length === 0) return;

  const update = () => {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    let visible = 0;

    for (const entry of entries) {
      const matchesText = entry.dataset.search.toLocaleLowerCase("zh-CN").includes(query);
      const categories = entry.dataset.category.split("|").filter(Boolean);
      const matchesCategory = !queryCategory || categories.includes(queryCategory);
      entry.hidden = !(matchesText && matchesCategory);
      if (!entry.hidden) visible += 1;
    }

    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    if (title) title.textContent = queryCategory ? `分类：${queryCategory}` : query ? "搜索结果" : "全部文章";
    status.textContent = query || queryCategory ? `找到 ${visible} 篇文章` : "";
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
