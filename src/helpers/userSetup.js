const crypto = require("crypto");
const slugify = require("@sindresorhus/slugify");
const { buildTocHtml } = require("./tocNormalized");

const BLOG_IGNORE_TAGS = new Set(["gardenEntry", "note"]);

function getBlogSortTime(item) {
  const d = item.data.created || item.data.updated || item.date;
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function getBlogUpdatedTime(item) {
  const d = item.data.updated || item.data.created || item.date;
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function stripHtmlToText(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Same membership as `blogPosts` — Eleventy collection API has no `getCollection` inside `addCollection`. */
function filterBlogPostsFromNotes(collectionApi) {
  return collectionApi.getFilteredByTag("note").filter((item) => {
    const tags = item.data.tags || [];
    return !tags.includes("gardenEntry");
  });
}

function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}

function userEleventySetup(eleventyConfig) {
  // Override `toc` from eleventy-plugin-nesting-toc: outline levels are normalized so the
  // shallowest heading in the page is treated as the first outline level (see tocNormalized.js).
  eleventyConfig.addFilter("toc", function (content, opts) {
    if (!content) {
      return "";
    }
    return buildTocHtml(content, {
      tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
      ...(opts || {}),
    });
  });

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    return filterBlogPostsFromNotes(collectionApi).sort(
      (a, b) => getBlogSortTime(b) - getBlogSortTime(a)
    );
  });

  eleventyConfig.addCollection("blogTags", (collectionApi) => {
    const set = new Set();
    for (const item of filterBlogPostsFromNotes(collectionApi)) {
      for (const t of item.data.tags || []) {
        if (t && !BLOG_IGNORE_TAGS.has(t)) {
          set.add(t);
        }
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "zh-CN"));
  });

  eleventyConfig.addCollection("blogRecentUpdated", (collectionApi) => {
    return filterBlogPostsFromNotes(collectionApi)
      .slice()
      .sort((a, b) => getBlogUpdatedTime(b) - getBlogUpdatedTime(a))
      .slice(0, 8);
  });

  eleventyConfig.addFilter("blogExcerpt", (content, len) => {
    const n = len != null ? Number(len) : 200;
    const text = stripHtmlToText(content);
    if (!text) return "";
    return text.length > n ? text.slice(0, n) + "…" : text;
  });

  /** Accepts a collection item (post) or an ISO date string. */
  eleventyConfig.addFilter("blogDateFormat", (input) => {
    let d;
    if (input && typeof input === "object" && "data" in input) {
      d = input.data.created || input.data.updated || input.date;
    } else {
      d = input;
    }
    if (!d) return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("blogTagSlug", (tag) => {
    if (tag == null || tag === "") return "untitled";
    const str = String(tag);
    const s = slugify(str);
    if (s) {
      return s;
    }
    // CJK-only tags slug to "" — would collide on `blog/tags/index.html`.
    return `t-${crypto.createHash("sha256").update(str, "utf8").digest("hex").slice(0, 12)}`;
  });

  /** Append `?view=blog` (or &view=blog) to a note URL; preserves hash. */
  eleventyConfig.addFilter("withBlogContext", (url) => {
    if (url == null) return "";
    const s = String(url);
    const hashIdx = s.indexOf("#");
    const base = hashIdx >= 0 ? s.slice(0, hashIdx) : s;
    const hash = hashIdx >= 0 ? s.slice(hashIdx) : "";
    if (base.includes("view=blog")) {
      return s;
    }
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}view=blog${hash}`;
  });

  /** Group all blog posts by year → month for `/blog/timeline/`. */
  eleventyConfig.addFilter("blogTimelineGroups", (items) => {
    if (!items || !items.length) return [];
    const byYear = new Map();
    for (const item of items) {
      const dRaw = item.data.created || item.data.updated || item.date;
      if (!dRaw) continue;
      const d = new Date(dRaw);
      if (Number.isNaN(d.getTime())) continue;
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      if (!byYear.has(y)) {
        byYear.set(y, new Map());
      }
      const byM = byYear.get(y);
      if (!byM.has(m)) {
        byM.set(m, []);
      }
      byM.get(m).push(item);
    }
    const years = Array.from(byYear.keys()).sort((a, b) => b - a);
    return years.map((year) => {
      const monthMap = byYear.get(year);
      const monthNums = Array.from(monthMap.keys()).sort((a, b) => b - a);
      return {
        year,
        months: monthNums.map((m) => ({
          month: m,
          monthLabel: `${m} 月`,
          posts: monthMap.get(m).sort((a, b) => getBlogSortTime(b) - getBlogSortTime(a)),
        })),
      };
    });
  });
}

exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
