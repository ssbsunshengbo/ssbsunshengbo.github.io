(() => {
  const toggle = document.querySelector(".sidebar-toggle");

  toggle?.addEventListener("click", () => {
    const collapsed = document.body.classList.toggle("sidebar-collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "展开目录" : "折叠目录");
  });

  const headings = [...document.querySelectorAll(".prose h2, .prose h3")];
  const toc = document.querySelector(".article-toc");
  const tocList = document.querySelector("#article-toc-list");
  const slugCounts = new Map();

  if (toc && tocList && headings.length > 0) {
    toc.hidden = false;
    for (const heading of headings) {
      const base = heading.textContent
        .normalize("NFKC")
        .trim()
        .toLocaleLowerCase("zh-CN")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || "section";
      const count = (slugCounts.get(base) || 0) + 1;
      slugCounts.set(base, count);
      if (!heading.id) heading.id = count === 1 ? base : `${base}-${count}`;

      const item = document.createElement("li");
      if (heading.tagName === "H3") item.classList.add("toc-subitem");
      const link = document.createElement("a");
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.textContent = heading.textContent;
      item.append(link);
      tocList.append(item);
    }
  } else if (toc) {
    toc.hidden = true;
  }

  const calloutLabels = {
    NOTE: "注",
    TIP: "提示",
    IMPORTANT: "重要",
    WARNING: "警告",
    CAUTION: "注意",
  };

  for (const quote of document.querySelectorAll(".prose blockquote")) {
    const paragraph = quote.querySelector("p");
    const firstText = paragraph && [...paragraph.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    const match = firstText?.textContent.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
    if (!match) continue;

    firstText.textContent = firstText.textContent.replace(match[0], "");
    const kind = match[1].toUpperCase();
    quote.classList.add("markdown-alert", `markdown-alert-${kind.toLowerCase()}`);
    const label = document.createElement("p");
    label.className = "markdown-alert-title";
    label.textContent = calloutLabels[kind];
    quote.prepend(label);
  }
})();
