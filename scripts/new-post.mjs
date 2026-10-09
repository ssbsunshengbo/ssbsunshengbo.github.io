#!/usr/bin/env node
import { mkdir, rename, writeFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const args = process.argv.slice(2);

function usage() {
  console.log(`
新建草稿：
  node scripts/new-post.mjs "文章标题" [--slug english-slug]

发布草稿到 _posts：
  node scripts/new-post.mjs --publish _drafts/草稿文件名.md
`);
}

function localDate(now = new Date()) {
  const pad = (number) => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function safeSlug(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

if (args[0] === "--publish") {
  const sourceArg = args[1];
  if (!sourceArg) {
    usage();
    process.exitCode = 2;
  } else {
    const draftDir = path.resolve(root, "_drafts");
    const source = path.resolve(root, sourceArg);
    if (!source.startsWith(`${draftDir}${path.sep}`)) {
      throw new Error("只能发布 _drafts/ 目录中的草稿。");
    }
    const originalName = path.basename(source);
    const datedName = /^\d{4}-\d{2}-\d{2}-/.test(originalName)
      ? originalName
      : `${localDate()}-${originalName}`;
    const destination = path.join(root, "_posts", datedName);
    if (!(await exists(source))) throw new Error(`找不到草稿：${sourceArg}`);
    if (await exists(destination)) throw new Error(`文章已存在：_posts/${datedName}`);
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(source, destination);
    console.log(`已发布到 _posts/${datedName}`);
  }
} else {
  const title = args[0];
  if (!title || title.startsWith("--")) {
    usage();
    process.exitCode = 2;
  } else {
    const slugIndex = args.indexOf("--slug");
    const requestedSlug = slugIndex >= 0 ? args[slugIndex + 1] : "";
    const baseSlug = safeSlug(requestedSlug || title) || `note-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const date = localDate(now);
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const draftDir = path.join(root, "_drafts");
    await mkdir(draftDir, { recursive: true });

    let slug = baseSlug;
    let target = path.join(draftDir, `${date}-${slug}.md`);
    let suffix = 2;
    while (await exists(target)) {
      slug = `${baseSlug}-${suffix++}`;
      target = path.join(draftDir, `${date}-${slug}.md`);
    }

    const body = `---
title: ${JSON.stringify(title)}
date: ${date} ${time}:00 +0800
categories: [工程实践]
tags: []
summary: "用一句话概括文章内容。"
---

## 背景

问题发生在什么场景？为什么值得记录？

## 过程与判断

记录关键证据、尝试过的方案，以及每一步的判断依据。

## 结果与复盘

最后如何解决？哪些经验可以复用？还有什么后续行动？
`;

    await writeFile(target, body, { flag: "wx" });
    console.log(`已创建草稿：${path.relative(root, target)}`);
  }
}
