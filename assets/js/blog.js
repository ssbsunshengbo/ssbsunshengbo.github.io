(() => {
  const input = document.querySelector("#article-search");
  const cards = [...document.querySelectorAll(".post-card")];
  const count = document.querySelector("#visible-count");
  const empty = document.querySelector("#search-empty");
  const status = document.querySelector("#search-status");

  if (!input || cards.length === 0) return;

  const update = () => {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    let visible = 0;

    for (const card of cards) {
      const matches = card.dataset.search.toLocaleLowerCase("zh-CN").includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    status.textContent = query ? `找到 ${visible} 篇文章` : "";
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
})();
